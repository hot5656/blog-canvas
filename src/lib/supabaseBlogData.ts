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
  };
}

export async function addPostToSupabase(post: Omit<BlogPost, 'id'>): Promise<BlogPost | null> {
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
