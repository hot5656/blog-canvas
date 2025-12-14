import { useState, useEffect } from "react";
import { BlogPost } from "@/types/blog";
import { getPostsFromSupabase, addPostToSupabase, deletePostFromSupabase, updatePostInSupabase } from "@/lib/supabaseBlogData";
import Header from "@/components/Header";
import BlogCard from "@/components/BlogCard";
import AddPostModal from "@/components/AddPostModal";
import EditPostModal from "@/components/EditPostModal";
import { useToast } from "@/hooks/use-toast";

const Index = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = async () => {
    setIsLoading(true);
    const fetchedPosts = await getPostsFromSupabase();
    setPosts(fetchedPosts);
    setIsLoading(false);
  };

  const handleAddPost = async (newPost: Omit<BlogPost, "id">) => {
    const created = await addPostToSupabase(newPost);
    if (created) {
      setPosts([created, ...posts]);
      toast({
        title: "Post published!",
        description: "Your new post is now live on the blog.",
      });
    } else {
      toast({
        title: "Error",
        description: "Failed to publish post. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleEditPost = (post: BlogPost) => {
    setEditingPost(post);
    setIsEditModalOpen(true);
  };

  const handleSavePost = async (id: string, updates: Partial<Omit<BlogPost, "id">>) => {
    const updated = await updatePostInSupabase(id, updates);
    if (updated) {
      setPosts(posts.map(p => p.id === id ? updated : p));
      toast({
        title: "Post updated!",
        description: updates.status === 'published' 
          ? "Your post is now published." 
          : updates.status === 'draft' 
            ? "Your post is now a draft." 
            : "Your changes have been saved.",
      });
    } else {
      toast({
        title: "Error",
        description: "Failed to update post. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleDeletePost = async (id: string) => {
    const success = await deletePostFromSupabase(id);
    if (success) {
      setPosts(posts.filter(post => post.id !== id));
      toast({
        title: "Post deleted",
        description: "The post has been removed from your blog.",
      });
    } else {
      toast({
        title: "Error",
        description: "Failed to delete post. Please try again.",
        variant: "destructive",
      });
    }
  };

  const featuredPost = posts[0];
  const otherPosts = posts.slice(1);

  return (
    <div className="min-h-screen bg-background">
      <Header onAddPost={() => setIsModalOpen(true)} />
      
      <main className="container mx-auto px-4 py-12 md:px-6">
        {/* Hero Section */}
        <section className="mb-16 text-center animate-fade-in">
          <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-4 text-balance">
            Stories that <span className="text-primary">inspire</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            A curated collection of thoughts on design, technology, culture, and the art of mindful living.
          </p>
        </section>

        {isLoading ? (
          <div className="text-center py-20">
            <p className="text-muted-foreground text-lg">Loading posts...</p>
          </div>
        ) : (
          <>
            {/* Featured Post */}
            {featuredPost && (
              <section className="mb-12">
                <div className="flex items-center gap-3 mb-6">
                  <div className="h-px flex-1 bg-border" />
                  <span className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                    Featured
                  </span>
                  <div className="h-px flex-1 bg-border" />
                </div>
                <BlogCard 
                  post={featuredPost} 
                  onDelete={handleDeletePost}
                  onEdit={handleEditPost}
                  featured 
                  index={0}
                />
              </section>
            )}

            {/* Post Grid */}
            {otherPosts.length > 0 && (
              <section>
                <div className="flex items-center gap-3 mb-6">
                  <div className="h-px flex-1 bg-border" />
                  <span className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                    Latest Posts
                  </span>
                  <div className="h-px flex-1 bg-border" />
                </div>
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {otherPosts.map((post, index) => (
                    <BlogCard 
                      key={post.id} 
                      post={post} 
                      onDelete={handleDeletePost}
                      onEdit={handleEditPost}
                      index={index + 1}
                    />
                  ))}
                </div>
              </section>
            )}

            {posts.length === 0 && (
              <div className="text-center py-20 animate-fade-in">
                <p className="text-muted-foreground text-lg mb-4">
                  No posts yet. Start writing your first story!
                </p>
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="text-primary font-medium hover:underline underline-offset-4"
                >
                  Create your first post →
                </button>
              </div>
            )}
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-border py-8 mt-16">
        <div className="container mx-auto px-4 md:px-6 text-center">
          <p className="text-sm text-muted-foreground">
            © 2024 The Journal. Powered by Supabase.
          </p>
        </div>
      </footer>

      <AddPostModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAdd={handleAddPost}
      />

      <EditPostModal
        isOpen={isEditModalOpen}
        post={editingPost}
        onClose={() => {
          setIsEditModalOpen(false);
          setEditingPost(null);
        }}
        onSave={handleSavePost}
      />
    </div>
  );
};

export default Index;
