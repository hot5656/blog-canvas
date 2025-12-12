import { Link } from "react-router-dom";
import { PenLine } from "lucide-react";
import { Button } from "@/components/ui/button";

interface HeaderProps {
  onAddPost: () => void;
}

const Header = ({ onAddPost }: HeaderProps) => {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-md">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
        <Link 
          to="/" 
          className="flex items-center gap-3 transition-base hover:opacity-80"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <PenLine className="h-5 w-5" />
          </div>
          <span className="font-serif text-xl font-semibold tracking-tight">
            The Journal
          </span>
        </Link>

        <nav className="flex items-center gap-4">
          <Button 
            onClick={onAddPost}
            className="gap-2"
          >
            <PenLine className="h-4 w-4" />
            Write
          </Button>
        </nav>
      </div>
    </header>
  );
};

export default Header;
