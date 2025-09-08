import { Search, User, Bookmark, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

const MangaNavigation = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <nav className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-8">
            <h1 
              className="text-2xl font-bold bg-gradient-orange bg-clip-text text-transparent cursor-pointer"
              onClick={() => navigate("/")}
            >
              MangaRoll
            </h1>
            <div className="hidden md:flex space-x-6">
              <Button variant="ghost" className="text-foreground hover:text-primary" onClick={() => navigate("/popular")}>
                Popular
              </Button>
              <Button variant="ghost" className="text-foreground hover:text-primary" onClick={() => navigate("/latest")}>
                Latest
              </Button>
              <Button variant="ghost" className="text-foreground hover:text-primary" onClick={() => navigate("/genres")}>
                Genres
              </Button>
              <Button variant="ghost" className="text-foreground hover:text-primary" onClick={() => navigate("/top-rated")}>
                Top Rated
              </Button>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="relative hidden sm:block">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search manga..." 
                className="pl-10 w-64 bg-manga-card border-border focus:border-primary"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && searchQuery.trim()) {
                    navigate(`/all-manga?search=${encodeURIComponent(searchQuery)}`);
                  }
                }}
              />
            </div>
            
            <Button variant="ghost" size="icon" className="hover:bg-manga-card" onClick={() => navigate("/watchlist")}>
              <Bookmark className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" className="hover:bg-manga-card">
              <Settings className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" className="hover:bg-manga-card" onClick={() => navigate("/account")}>
              <User className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default MangaNavigation;