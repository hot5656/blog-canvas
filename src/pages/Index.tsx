import { useState, useEffect } from "react";
import { BlogPost } from "@/types/blog";
import { getPosts, addPost, deletePost } from "@/lib/blogData";
import Header from "@/components/Header";
import BlogCard from "@/components/BlogCard";
import AddPostModal from "@/components/AddPostModal";
import { useToast } from "@/hooks/use-toast";

const Index = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    setPosts(getPosts());
  }, []);

  const handleAddPost = (newPost: Omit<BlogPost, "id">) => {
    const created = addPost(newPost);
    setPosts([created, ...posts]);
    toast({
      title: "Post published!",
      description: "Your new post is now live on the blog.",
    });
  };

  const handleDeletePost = (id: string) => {
    deletePost(id);
    setPosts(posts.filter(post => post.id !== id));
    toast({
      title: "Post deleted",
      description: "The post has been removed from your blog.",
    });
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
      </main>

      {/* Footer */}
      <footer className="border-t border-border py-8 mt-16">
        <div className="container mx-auto px-4 md:px-6 text-center">
          <p className="text-sm text-muted-foreground">
            © 2024 The Journal. All stories are stored locally in your browser.
          </p>
        </div>
      </footer>

      <AddPostModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAdd={handleAddPost}
      />
    </div>
  );
};

export default Index;
