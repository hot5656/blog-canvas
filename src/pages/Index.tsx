import { useState, useEffect } from "react";
import { BlogPost } from "@/types/blog";
import { getPostsFromSupabase, addPostToSupabase, deletePostFromSupabase, updatePostInSupabase } from "@/lib/supabaseBlogData";
import Header from "@/components/Header";
import BlogCard from "@/components/BlogCard";
import AddPostModal from "@/components/AddPostModal";
import EditPostModal from "@/components/EditPostModal";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

const POSTS_PER_PAGE = 13;

const Index = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const { toast } = useToast();
  const { isAdmin, user, profile } = useAuth();
  const { t, language } = useLanguage();

  useEffect(() => {
    loadPosts();
  }, [isAdmin]);

  const loadPosts = async () => {
    setIsLoading(true);
    const fetchedPosts = await getPostsFromSupabase();
    // Only admins can see draft posts
    const filteredPosts = isAdmin 
      ? fetchedPosts 
      : fetchedPosts.filter(post => post.status === 'published');
    setPosts(filteredPosts);
    setIsLoading(false);
  };

  // Pagination logic
  const totalPages = Math.ceil(posts.length / POSTS_PER_PAGE);
  const startIndex = (currentPage - 1) * POSTS_PER_PAGE;
  const endIndex = startIndex + POSTS_PER_PAGE;
  const currentPosts = posts.slice(startIndex, endIndex);

  const featuredPost = currentPosts[0];
  const otherPosts = currentPosts.slice(1);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAddPost = async (newPost: Omit<BlogPost, "id">) => {
    if (!user) return;
    
    const created = await addPostToSupabase(newPost, user.id);
    if (created) {
      setPosts([created, ...posts]);
      setCurrentPage(1); // Go to first page to see new post
      toast({
        title: t('toast.postPublished'),
        description: t('toast.postPublishedDesc'),
      });
    } else {
      toast({
        title: t('toast.publishError'),
        description: t('toast.publishFailed'),
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
        title: t('toast.postUpdated'),
        description: updates.status === 'published' 
          ? t('toast.nowPublished')
          : updates.status === 'draft' 
            ? t('toast.nowDraft')
            : t('toast.changesSaved'),
      });
    } else {
      toast({
        title: t('toast.updateError'),
        description: t('toast.updateFailed'),
        variant: "destructive",
      });
    }
  };

  const handleDeletePost = async (id: string) => {
    const success = await deletePostFromSupabase(id);
    if (success) {
      const newPosts = posts.filter(post => post.id !== id);
      setPosts(newPosts);
      // Adjust current page if necessary
      const newTotalPages = Math.ceil(newPosts.length / POSTS_PER_PAGE);
      if (currentPage > newTotalPages && newTotalPages > 0) {
        setCurrentPage(newTotalPages);
      }
      toast({
        title: t('toast.postDeleted'),
        description: t('toast.postDeletedDesc'),
      });
    } else {
      toast({
        title: t('toast.deleteError'),
        description: t('toast.deleteFailed'),
        variant: "destructive",
      });
    }
  };

  const canAddPost = !!user;
  const canEditPost = (post: BlogPost) => isAdmin || post.userId === user?.id;

  // Generate page numbers to display
  const getPageNumbers = () => {
    const pages: number[] = [];
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      const start = Math.max(1, currentPage - 2);
      const end = Math.min(totalPages, start + maxVisiblePages - 1);
      
      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
    }
    
    return pages;
  };

  // Pagination text based on language
  const getPaginationText = () => {
    if (language === 'zh-tw') {
      return `${t('pagination.page')} ${currentPage} ${t('pagination.of')} ${totalPages} 頁 · ${posts.length} ${t('pagination.posts')}`;
    }
    return `${t('pagination.page')} ${currentPage} ${t('pagination.of')} ${totalPages} · ${posts.length} ${t('pagination.posts')}`;
  };

  return (
    <div className="min-h-screen bg-background">
      <Header onAddPost={canAddPost ? () => setIsModalOpen(true) : undefined} />
      
      <main className="container mx-auto px-4 py-12 md:px-6">
        {/* Hero Section */}
        <section className="mb-16 text-center animate-fade-in">
          <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-4 text-balance">
            {language === 'zh-tw' ? (
              <>
                {t('hero.title')}<span className="text-primary">{t('hero.highlight')}</span>
              </>
            ) : (
              <>
                {t('hero.title')} <span className="text-primary">{t('hero.highlight')}</span>
              </>
            )}
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            {t('hero.description')}
          </p>
        </section>

        {isLoading ? (
          <div className="text-center py-20">
            <p className="text-muted-foreground text-lg">{t('posts.loading')}</p>
          </div>
        ) : (
          <>
            {/* Featured Post */}
            {featuredPost && (
              <section className="mb-12">
                <div className="flex items-center gap-3 mb-6">
                  <div className="h-px flex-1 bg-border" />
                  <span className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                    {t('section.featured')}
                  </span>
                  <div className="h-px flex-1 bg-border" />
                </div>
              <BlogCard 
                  post={featuredPost} 
                  onDelete={handleDeletePost}
                  onEdit={handleEditPost}
                  featured 
                  index={0}
                  showAdminActions={canEditPost(featuredPost)}
                />
              </section>
            )}

            {/* Post Grid */}
            {otherPosts.length > 0 && (
              <section>
                <div className="flex items-center gap-3 mb-6">
                  <div className="h-px flex-1 bg-border" />
                  <span className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                    {t('section.latest')}
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
                      showAdminActions={canEditPost(post)}
                    />
                  ))}
                </div>
              </section>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <section className="mt-12">
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious 
                        onClick={() => currentPage > 1 && handlePageChange(currentPage - 1)}
                        className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                      />
                    </PaginationItem>
                    
                    {getPageNumbers().map((page) => (
                      <PaginationItem key={page}>
                        <PaginationLink
                          onClick={() => handlePageChange(page)}
                          isActive={currentPage === page}
                          className="cursor-pointer"
                        >
                          {page}
                        </PaginationLink>
                      </PaginationItem>
                    ))}
                    
                    <PaginationItem>
                      <PaginationNext 
                        onClick={() => currentPage < totalPages && handlePageChange(currentPage + 1)}
                        className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
                <p className="text-center text-sm text-muted-foreground mt-4">
                  {getPaginationText()}
                </p>
              </section>
            )}

            {posts.length === 0 && (
              <div className="text-center py-20 animate-fade-in">
                <p className="text-muted-foreground text-lg mb-4">
                  {canAddPost ? t('posts.empty.auth') : t('posts.empty.guest')}
                </p>
                {canAddPost && (
                  <button
                    onClick={() => setIsModalOpen(true)}
                    className="text-primary font-medium hover:underline underline-offset-4"
                  >
                    {t('posts.create')}
                  </button>
                )}
              </div>
            )}
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-border py-8 mt-16">
        <div className="container mx-auto px-4 md:px-6 text-center">
          <p className="text-sm text-muted-foreground">
            {t('footer.copyright')}
          </p>
        </div>
      </footer>

      <AddPostModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAdd={handleAddPost}
        userProfile={profile}
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
