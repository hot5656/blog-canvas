import { useState } from "react";
import { Link } from "react-router-dom";
import { Trash2, Pencil } from "lucide-react";
import { BlogPost } from "@/types/blog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import DeleteConfirmDialog from "@/components/DeleteConfirmDialog";

interface BlogCardProps {
  post: BlogPost;
  onDelete: (id: string) => void;
  onEdit: (post: BlogPost) => void;
  featured?: boolean;
  index?: number;
}

const BlogCard = ({ post, onDelete, onEdit, featured = false, index = 0 }: BlogCardProps) => {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    onDelete(post.id);
    setIsDeleteDialogOpen(false);
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onEdit(post);
  };

  const isDraft = post.status === 'draft';

  if (featured) {
    return (
      <article 
        className={`group relative overflow-hidden rounded-2xl bg-card shadow-card transition-base hover:shadow-card-hover animate-fade-in ${isDraft ? 'opacity-75' : ''}`}
        style={{ animationDelay: `${index * 100}ms` }}
      >
        <Link to={`/post/${post.id}`} className="block">
          <div className="grid md:grid-cols-2 gap-0">
            <div className="relative aspect-[4/3] md:aspect-auto overflow-hidden">
              <img
                src={post.featuredImage}
                alt={post.title}
                className="h-full w-full object-cover transition-slow group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-foreground/20 to-transparent opacity-0 group-hover:opacity-100 transition-base" />
              {isDraft && (
                <Badge variant="secondary" className="absolute top-3 left-3 bg-amber-500/90 text-white">
                  Draft
                </Badge>
              )}
            </div>
            <div className="flex flex-col justify-center p-6 md:p-10">
              <div className="flex flex-wrap gap-2 mb-4">
                {post.tags.slice(0, 2).map(tag => (
                  <span 
                    key={tag}
                    className="inline-block rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <h2 className="font-serif text-2xl md:text-3xl font-semibold leading-tight mb-3 text-balance group-hover:text-primary transition-base">
                {post.title}
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-6 line-clamp-3">
                {post.excerpt}
              </p>
              <div className="flex items-center justify-between mt-auto">
                <div className="flex items-center gap-3">
                  <img
                    src={post.author.avatar}
                    alt={post.author.name}
                    className="h-10 w-10 rounded-full object-cover ring-2 ring-border"
                  />
                  <div>
                    <p className="text-sm font-medium">{post.author.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {post.date} · {post.readTime}
                    </p>
                  </div>
                </div>
                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleEdit}
                    className="opacity-0 group-hover:opacity-100 transition-base hover:bg-primary/10 hover:text-primary"
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleDeleteClick}
                    className="opacity-0 group-hover:opacity-100 transition-base hover:bg-destructive/10 hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </Link>
        <DeleteConfirmDialog
          isOpen={isDeleteDialogOpen}
          onClose={() => setIsDeleteDialogOpen(false)}
          onConfirm={handleConfirmDelete}
          authorName={post.author.name}
          postTitle={post.title}
        />
      </article>
    );
  }

  return (
    <article 
      className={`group relative overflow-hidden rounded-xl bg-card shadow-card transition-base hover:shadow-card-hover animate-fade-in ${isDraft ? 'opacity-75' : ''}`}
      style={{ animationDelay: `${index * 100}ms` }}
    >
      <Link to={`/post/${post.id}`} className="block">
        <div className="relative aspect-[16/10] overflow-hidden">
          <img
            src={post.featuredImage}
            alt={post.title}
            className="h-full w-full object-cover transition-slow group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-foreground/30 to-transparent opacity-0 group-hover:opacity-100 transition-base" />
          {isDraft && (
            <Badge variant="secondary" className="absolute top-3 left-3 bg-amber-500/90 text-white">
              Draft
            </Badge>
          )}
          <div className="absolute top-3 right-3 flex gap-1">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleEdit}
              className="bg-card/80 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-base hover:bg-primary hover:text-primary-foreground"
            >
              <Pencil className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleDeleteClick}
              className="bg-card/80 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-base hover:bg-destructive hover:text-destructive-foreground"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <div className="p-5">
          <div className="flex flex-wrap gap-2 mb-3">
            {post.tags.slice(0, 2).map(tag => (
              <span 
                key={tag}
                className="inline-block rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary"
              >
                {tag}
              </span>
            ))}
          </div>
          <h3 className="font-serif text-lg font-semibold leading-snug mb-2 line-clamp-2 group-hover:text-primary transition-base">
            {post.title}
          </h3>
          <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
            {post.excerpt}
          </p>
          <div className="flex items-center gap-3">
            <img
              src={post.author.avatar}
              alt={post.author.name}
              className="h-8 w-8 rounded-full object-cover ring-2 ring-border"
            />
            <div>
              <p className="text-sm font-medium">{post.author.name}</p>
              <p className="text-xs text-muted-foreground">
                {post.date}
              </p>
            </div>
          </div>
        </div>
      </Link>
      <DeleteConfirmDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={handleConfirmDelete}
        authorName={post.author.name}
        postTitle={post.title}
      />
    </article>
  );
};

export default BlogCard;
