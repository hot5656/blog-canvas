import { Link, useNavigate } from "react-router-dom";
import { PenLine, LogOut, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface HeaderProps {
  onAddPost?: () => void;
}

const Header = ({ onAddPost }: HeaderProps) => {
  const { user, isAdmin, signOut } = useAuth();
  const { t, getLocalizedPath } = useLanguage();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate(getLocalizedPath('/'));
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-md">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
        <Link 
          to={getLocalizedPath('/')} 
          className="flex items-center gap-3 transition-base hover:opacity-80"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <PenLine className="h-5 w-5" />
          </div>
          <span className="font-serif text-xl font-semibold tracking-tight">
            The Journal
          </span>
        </Link>

        <nav className="flex items-center gap-2">
          <LanguageSwitcher />
          
          {user ? (
            <>
              {onAddPost && (
                <Button 
                  onClick={onAddPost}
                  className="gap-2"
                >
                  <PenLine className="h-4 w-4" />
                  {t('header.write')}
                </Button>
              )}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="rounded-full">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary">
                      <User className="h-4 w-4" />
                    </div>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem disabled className="text-xs text-muted-foreground">
                    {user.email}
                  </DropdownMenuItem>
                  {isAdmin && (
                    <DropdownMenuItem disabled className="text-xs text-primary font-medium">
                      {t('header.admin')}
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem onClick={handleSignOut} className="text-destructive">
                    <LogOut className="mr-2 h-4 w-4" />
                    {t('header.logout')}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <Button 
              variant="outline"
              onClick={() => navigate(getLocalizedPath('/auth'))}
              className="gap-2"
            >
              {t('header.login')}
            </Button>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;
