import { supabase } from '@/integrations/supabase/client';
import { BlogPost } from '@/types/blog';

export async function getPostsFromSupabase(): Promise<BlogPost[]> {
  const { data, error } = await supabase
    .from('posts')
    .select('*')
    .order('date', { ascending: false });

  if (error) {
    console.error('Error fetching posts:', error);
    return [];
  }

  return data.map((post) => ({
    id: post.id,
    title: post.title,
    excerpt: post.excerpt || '',
    content: post.content,
    featuredImage: post.featured_image || '/placeholder.svg',
    author: {
      name: post.author_name || 'Anonymous',
      avatar: post.author_avatar || '/placeholder.svg',
    },
    date: post.date,
    readTime: post.read_time || '5 min read',
    tags: post.tags || [],
    status: post.status || 'published',
    userId: post.user_id || undefined,
  }));
}

export async function getPostByIdFromSupabase(id: string): Promise<BlogPost | undefined> {
  const { data, error } = await supabase
    .from('posts')
    .select('*')
    .eq('id', id)
    .maybeSingle();

  if (error || !data) {
    console.error('Error fetching post:', error);
    return undefined;
  }

  return {
    id: data.id,
    title: data.title,
    excerpt: data.excerpt || '',
    content: data.content,
    featuredImage: data.featured_image || '/placeholder.svg',
    author: {
      name: data.author_name || 'Anonymous',
      avatar: data.author_avatar || '/placeholder.svg',
    },
    date: data.date,
    readTime: data.read_time || '5 min read',
    tags: data.tags || [],
    status: data.status || 'published',
    userId: data.user_id || undefined,
  };
}

export async function addPostToSupabase(post: Omit<BlogPost, 'id'>, userId: string): Promise<BlogPost | null> {
  const { data, error } = await supabase
    .from('posts')
    .insert({
      title: post.title,
      excerpt: post.excerpt,
      content: post.content,
      featured_image: post.featuredImage,
      author_name: post.author.name,
      author_avatar: post.author.avatar,
      date: post.date,
      read_time: post.readTime,
      tags: post.tags,
      status: post.status || 'published',
      user_id: userId,
    })
    .select()
    .single();

  if (error) {
    console.error('Error adding post:', error);
    return null;
  }

  return {
    id: data.id,
    title: data.title,
    excerpt: data.excerpt || '',
    content: data.content,
    featuredImage: data.featured_image || '/placeholder.svg',
    author: {
      name: data.author_name || 'Anonymous',
      avatar: data.author_avatar || '/placeholder.svg',
    },
    date: data.date,
    readTime: data.read_time || '5 min read',
    tags: data.tags || [],
    status: data.status || 'published',
    userId: data.user_id || undefined,
  };
}

export async function updatePostInSupabase(id: string, post: Partial<Omit<BlogPost, 'id'>>): Promise<BlogPost | null> {
  const updateData: Record<string, unknown> = {};
  
  if (post.title !== undefined) updateData.title = post.title;
  if (post.excerpt !== undefined) updateData.excerpt = post.excerpt;
  if (post.content !== undefined) updateData.content = post.content;
  if (post.featuredImage !== undefined) updateData.featured_image = post.featuredImage;
  if (post.author !== undefined) {
    updateData.author_name = post.author.name;
    updateData.author_avatar = post.author.avatar;
  }
  if (post.date !== undefined) updateData.date = post.date;
  if (post.readTime !== undefined) updateData.read_time = post.readTime;
  if (post.tags !== undefined) updateData.tags = post.tags;
  if (post.status !== undefined) updateData.status = post.status;

  const { data, error } = await supabase
    .from('posts')
    .update(updateData)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating post:', error);
    return null;
  }

  return {
    id: data.id,
    title: data.title,
    excerpt: data.excerpt || '',
    content: data.content,
    featuredImage: data.featured_image || '/placeholder.svg',
    author: {
      name: data.author_name || 'Anonymous',
      avatar: data.author_avatar || '/placeholder.svg',
    },
    date: data.date,
    readTime: data.read_time || '5 min read',
    tags: data.tags || [],
    status: data.status || 'published',
    userId: data.user_id || undefined,
  };
}

export async function deletePostFromSupabase(id: string): Promise<boolean> {
  const { error } = await supabase
    .from('posts')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting post:', error);
    return false;
  }

  return true;
}
