import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { ArrowLeft, Clock, Calendar, Trash2 } from "lucide-react";
import { BlogPost as BlogPostType } from "@/types/blog";
import { getPostByIdFromSupabase, deletePostFromSupabase } from "@/lib/supabaseBlogData";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

const BlogPost = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [post, setPost] = useState<BlogPostType | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPost = async () => {
      if (id) {
        const foundPost = await getPostByIdFromSupabase(id);
        setPost(foundPost || null);
        setLoading(false);
      }
    };
    loadPost();
  }, [id]);

  const handleDelete = async () => {
    if (post) {
      const success = await deletePostFromSupabase(post.id);
      if (success) {
        toast({
          title: "Post deleted",
          description: "The post has been removed from your blog.",
        });
        navigate("/");
      } else {
        toast({
          title: "Error",
          description: "Failed to delete post. Please try again.",
          variant: "destructive",
        });
      }
    }
  };

  // Format inline markdown: **bold**, *italic*
  const formatInlineMarkdown = (text: string) => {
    const parts: (string | JSX.Element)[] = [];
    let remaining = text;
    let keyIndex = 0;

    while (remaining.length > 0) {
      // Match **bold** first (before *italic*)
      const boldMatch = remaining.match(/\*\*(.+?)\*\*/);
      // Match *italic* (single asterisk)
      const italicMatch = remaining.match(/(?<!\*)\*(?!\*)(.+?)(?<!\*)\*(?!\*)/);

      let firstMatch: { match: RegExpMatchArray; type: 'bold' | 'italic' } | null = null;

      if (boldMatch && italicMatch) {
        firstMatch = (boldMatch.index! <= italicMatch.index!) 
          ? { match: boldMatch, type: 'bold' } 
          : { match: italicMatch, type: 'italic' };
      } else if (boldMatch) {
        firstMatch = { match: boldMatch, type: 'bold' };
      } else if (italicMatch) {
        firstMatch = { match: italicMatch, type: 'italic' };
      }

      if (firstMatch) {
        const { match, type } = firstMatch;
        const beforeText = remaining.slice(0, match.index!);
        if (beforeText) parts.push(beforeText);
        
        if (type === 'bold') {
          parts.push(<strong key={keyIndex++} className="font-semibold">{match[1]}</strong>);
        } else {
          parts.push(<em key={keyIndex++} className="italic">{match[1]}</em>);
        }
        
        remaining = remaining.slice(match.index! + match[0].length);
      } else {
        parts.push(remaining);
        break;
      }
    }

    return parts.length > 0 ? parts : [text];
  };

  const formatContent = (content: string) => {
    // Convert literal \n to actual newlines
    const processedContent = content.replace(/\\n/g, '\n');
    
    return processedContent.split("\n\n").map((paragraph, index) => {
      // Handle ### h3 headings
      if (paragraph.startsWith("### ")) {
        return (
          <h3 key={index} className="text-xl font-semibold mt-8 mb-3 font-serif">
            {formatInlineMarkdown(paragraph.replace("### ", ""))}
          </h3>
        );
      }
      // Handle ## h2 headings
      if (paragraph.startsWith("## ")) {
        return (
          <h2 key={index} className="text-2xl font-semibold mt-10 mb-4 font-serif">
            {formatInlineMarkdown(paragraph.replace("## ", ""))}
          </h2>
        );
      }
      // Handle blockquotes
      if (paragraph.startsWith("> ")) {
        return (
          <blockquote key={index} className="border-l-4 border-primary/50 pl-6 italic my-6 text-muted-foreground">
            {formatInlineMarkdown(paragraph.replace("> ", ""))}
          </blockquote>
        );
      }
      // Handle list items (- or +)
      if (paragraph.match(/^[\-\+]\s/m)) {
        const items = paragraph.split('\n').filter(line => line.match(/^[\-\+]\s/));
        return (
          <ul key={index} className="list-disc list-inside mb-6 space-y-2">
            {items.map((item, i) => (
              <li key={i} className="leading-relaxed">
                {formatInlineMarkdown(item.replace(/^[\-\+]\s/, ''))}
              </li>
            ))}
          </ul>
        );
      }
      return (
        <p key={index} className="mb-6 leading-relaxed">
          {formatInlineMarkdown(paragraph)}
        </p>
      );
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-4">
        <h1 className="font-serif text-2xl font-semibold">Post not found</h1>
        <Link to="/" className="text-primary hover:underline underline-offset-4">
          ← Back to home
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-md">
        <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
          <Link 
            to="/" 
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-base"
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="text-sm font-medium">Back to all posts</span>
          </Link>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleDelete}
            className="text-muted-foreground hover:text-destructive hover:bg-destructive/10"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Delete
          </Button>
        </div>
      </header>

      <article className="animate-fade-in">
        {/* Hero Image */}
        <div className="relative aspect-[21/9] md:aspect-[3/1] overflow-hidden">
          <img
            src={post.featuredImage}
            alt={post.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
        </div>

        {/* Content */}
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-3xl mx-auto -mt-20 relative z-10">
            {/* Meta */}
            <div className="bg-card rounded-2xl shadow-elevated p-8 md:p-12 mb-8">
              <div className="flex flex-wrap gap-2 mb-4">
                {post.tags.map(tag => (
                  <span 
                    key={tag}
                    className="inline-block rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              
              <h1 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold leading-tight mb-6 text-balance">
                {post.title}
              </h1>
              
              <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground">
                <div className="flex items-center gap-3">
                  <img
                    src={post.author.avatar}
                    alt={post.author.name}
                    className="h-12 w-12 rounded-full object-cover ring-2 ring-border"
                  />
                  <div>
                    <p className="font-medium text-foreground">{post.author.name}</p>
                    <p className="text-xs">Author</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  {post.date}
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  {post.readTime}
                </div>
              </div>
            </div>

            {/* Article Body */}
            <div className="bg-card rounded-2xl shadow-card p-8 md:p-12">
              <div className="prose prose-lg max-w-none blog-prose text-foreground/90">
                {formatContent(post.content)}
              </div>
            </div>

            {/* Back Link */}
            <div className="text-center py-12">
              <Link 
                to="/"
                className="inline-flex items-center gap-2 text-primary font-medium hover:underline underline-offset-4"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to all posts
              </Link>
            </div>
          </div>
        </div>
      </article>
    </div>
  );
};

export default BlogPost;
