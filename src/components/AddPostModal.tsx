import { useState } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { BlogPost } from "@/types/blog";

interface UserProfile {
  name: string;
  avatar_url: string;
}

interface AddPostModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (post: Omit<BlogPost, "id">) => void;
  userProfile: UserProfile | null;
}

const unsplashImages = [
  "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=1200&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?w=1200&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1433086966358-54859d0ed716?w=1200&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=1200&auto=format&fit=crop&q=80",
];

const AddPostModal = ({ isOpen, onClose, onAdd, userProfile }: AddPostModalProps) => {
  const [title, setTitle] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const wordCount = content.split(/\s+/).length;
    const readTime = `${Math.max(1, Math.ceil(wordCount / 200))} min read`;
    
    const newPost: Omit<BlogPost, "id"> = {
      title,
      excerpt,
      content,
      featuredImage: unsplashImages[Math.floor(Math.random() * unsplashImages.length)],
      author: {
        name: userProfile?.name || 'Anonymous',
        avatar: userProfile?.avatar_url || '/placeholder.svg'
      },
      date: new Date().toLocaleDateString("en-US", { 
        year: "numeric", 
        month: "long", 
        day: "numeric" 
      }),
      readTime,
      tags: tags.split(",").map(tag => tag.trim()).filter(Boolean),
      status: "published"
    };
    
    onAdd(newPost);
    
    // Reset form
    setTitle("");
    setExcerpt("");
    setContent("");
    setTags("");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-foreground/50 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
      />
      <div className="relative z-10 w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl bg-card shadow-elevated animate-scale-in">
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-border bg-card px-6 py-4">
          <h2 className="font-serif text-xl font-semibold">Create New Post</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Author preview */}
          {userProfile && (
            <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
              <img
                src={userProfile.avatar_url}
                alt={userProfile.name}
                className="h-10 w-10 rounded-full object-cover ring-2 ring-border"
              />
              <div>
                <p className="text-sm font-medium">{userProfile.name}</p>
                <p className="text-xs text-muted-foreground">Author</p>
              </div>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter a captivating title..."
              required
              className="font-serif text-lg"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="excerpt">Excerpt</Label>
            <Textarea
              id="excerpt"
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              placeholder="A brief summary that appears on the homepage..."
              required
              rows={2}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="content">Content</Label>
            <Textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Write your story... (Supports markdown-style formatting)"
              required
              rows={8}
              className="font-sans"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="tags">Tags</Label>
            <Input
              id="tags"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="Design, Tech, Life (comma separated)"
            />
          </div>
          
          <p className="text-xs text-muted-foreground">
            A random featured image from Unsplash will be assigned to your post.
          </p>
          
          <div className="flex gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" className="flex-1">
              Publish Post
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddPostModal;
