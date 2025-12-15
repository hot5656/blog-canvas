import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-n8n-api-key',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // 🔐 Validate N8N API Key
    const n8nApiKey = Deno.env.get('N8N_API_KEY');
    const providedApiKey = req.headers.get('x-n8n-api-key');
    
    if (!n8nApiKey) {
      console.error('N8N_API_KEY environment variable is not configured');
      return new Response(
        JSON.stringify({ error: 'Server configuration error' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    if (!providedApiKey || providedApiKey !== n8nApiKey) {
      console.error('Invalid or missing API key');
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    console.log('API key validated successfully');

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Parse multipart form data
    const formData = await req.formData();
    
    const title = formData.get('title') as string;
    let content = formData.get('content') as string;
    let excerpt = formData.get('excerpt') as string || '';
    const authorName = formData.get('author_name') as string || 'Anonymous';
    const authorAvatar = formData.get('author_avatar') as string || '';
    const tagsString = formData.get('tags') as string || '';
    const imageFile = formData.get('image') as File | null;

    if (!title || !content) {
      return new Response(
        JSON.stringify({ error: 'Title and content are required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Convert literal \n strings to actual newlines
    content = content.replace(/\\n/g, '\n');
    excerpt = excerpt.replace(/\\n/g, '\n');

    let featuredImageUrl = '/placeholder.svg';

    // Upload image if provided
    if (imageFile && imageFile.size > 0) {
      const fileExt = imageFile.name.split('.').pop() || 'jpg';
      const fileName = `${crypto.randomUUID()}.${fileExt}`;
      
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('blog-images')
        .upload(fileName, imageFile, {
          contentType: imageFile.type,
          upsert: false
        });

      if (uploadError) {
        console.error('Image upload error:', uploadError);
        return new Response(
          JSON.stringify({ error: 'Failed to upload image', details: uploadError.message }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      // Get public URL
      const { data: urlData } = supabase.storage
        .from('blog-images')
        .getPublicUrl(fileName);
      
      featuredImageUrl = urlData.publicUrl;
      console.log('Image uploaded successfully:', featuredImageUrl);
    }

    // Parse tags
    const tags = tagsString ? tagsString.split(',').map(tag => tag.trim()).filter(Boolean) : [];

    // Calculate read time
    const wordCount = content.split(/\s+/).length;
    const readTime = `${Math.max(1, Math.ceil(wordCount / 200))} min read`;

    // Build author avatar URL if filename provided
    let authorAvatarUrl = '/placeholder.svg';
    if (authorAvatar) {
      // If it's already a full URL, use it directly
      if (authorAvatar.startsWith('http://') || authorAvatar.startsWith('https://')) {
        authorAvatarUrl = authorAvatar;
      } else {
        // Otherwise, construct URL from author-avatars bucket
        const { data: avatarUrlData } = supabase.storage
          .from('author-avatars')
          .getPublicUrl(authorAvatar);
        authorAvatarUrl = avatarUrlData.publicUrl;
      }
    }

    // Insert post with status='draft' for n8n posts
    const { data: post, error: insertError } = await supabase
      .from('posts')
      .insert({
        title,
        content,
        excerpt,
        featured_image: featuredImageUrl,
        author_name: authorName,
        author_avatar: authorAvatarUrl,
        date: new Date().toISOString().split('T')[0],
        read_time: readTime,
        tags,
        status: 'draft'  // n8n posts are drafts by default
      })
      .select()
      .single();

    if (insertError) {
      console.error('Post insert error:', insertError);
      return new Response(
        JSON.stringify({ error: 'Failed to create post', details: insertError.message }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Post created successfully as draft:', post.id);

    return new Response(
      JSON.stringify({ success: true, post }),
      { status: 201, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Unexpected error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ error: 'Internal server error', details: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
