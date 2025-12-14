import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { BlogPost, PostStatus } from "@/types/blog";

interface EditPostModalProps {
  isOpen: boolean;
  post: BlogPost | null;
  onClose: () => void;
  onSave: (id: string, updates: Partial<Omit<BlogPost, "id">>) => void;
}

const EditPostModal = ({ isOpen, post, onClose, onSave }: EditPostModalProps) => {
  const [title, setTitle] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [authorName, setAuthorName] = useState("");
  const [tags, setTags] = useState("");
  const [status, setStatus] = useState<PostStatus>("draft");

  useEffect(() => {
    if (post) {
      setTitle(post.title);
      setExcerpt(post.excerpt);
      setContent(post.content);
      setAuthorName(post.author.name);
      setTags(post.tags.join(", "));
      setStatus(post.status);
    }
  }, [post]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!post) return;
    
    const wordCount = content.split(/\s+/).length;
    const readTime = `${Math.max(1, Math.ceil(wordCount / 200))} min read`;
    
    onSave(post.id, {
      title,
      excerpt,
      content,
      author: {
        name: authorName,
        avatar: post.author.avatar,
      },
      readTime,
      tags: tags.split(",").map(tag => tag.trim()).filter(Boolean),
      status,
    });
    
    onClose();
  };

  if (!isOpen || !post) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-foreground/50 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
      />
      <div className="relative z-10 w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl bg-card shadow-elevated animate-scale-in">
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-border bg-card px-6 py-4">
          <h2 className="font-serif text-xl font-semibold">Edit Post</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div className="space-y-2">
            <Label htmlFor="edit-title">Title</Label>
            <Input
              id="edit-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter a captivating title..."
              required
              className="font-serif text-lg"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="edit-excerpt">Excerpt</Label>
            <Textarea
              id="edit-excerpt"
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              placeholder="A brief summary that appears on the homepage..."
              required
              rows={2}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="edit-content">Content</Label>
            <Textarea
              id="edit-content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Write your story... (Supports markdown-style formatting)"
              required
              rows={8}
              className="font-sans"
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="edit-author">Author Name</Label>
              <Input
                id="edit-author"
                value={authorName}
                onChange={(e) => setAuthorName(e.target.value)}
                placeholder="Your name"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="edit-tags">Tags</Label>
              <Input
                id="edit-tags"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                placeholder="Design, Tech, Life (comma separated)"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Status</Label>
            <div className="flex gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="status"
                  value="draft"
                  checked={status === "draft"}
                  onChange={() => setStatus("draft")}
                  className="w-4 h-4 text-primary"
                />
                <span className="text-sm">Draft</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="status"
                  value="published"
                  checked={status === "published"}
                  onChange={() => setStatus("published")}
                  className="w-4 h-4 text-primary"
                />
                <span className="text-sm">Published</span>
              </label>
            </div>
          </div>
          
          <div className="flex gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" className="flex-1">
              Save Changes
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditPostModal;
