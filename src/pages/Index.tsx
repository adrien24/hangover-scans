import MangaNavigation from "@/components/MangaNavigation";
import HeroSection from "@/components/HeroSection";
import MangaGrid from "@/components/MangaGrid";
import CategoriesSection from "@/components/CategoriesSection";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <MangaNavigation />
      
      <main>
        <HeroSection />
        
        <div className="container mx-auto px-4 py-12">
          <MangaGrid title="Trending Now" />
          <CategoriesSection />
          <MangaGrid title="Recently Updated" />
          <MangaGrid title="Top Rated" />
        </div>
      </main>
      
      <footer className="bg-manga-card border-t border-border py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-lg font-bold mb-4 bg-gradient-orange bg-clip-text text-transparent">
                MangaRoll
              </h3>
              <p className="text-muted-foreground">
                Your ultimate destination for reading manga online. 
                Discover thousands of titles from every genre.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4 text-foreground">Popular</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li><a href="#" className="hover:text-primary transition-colors">Action</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Romance</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Fantasy</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Sci-Fi</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4 text-foreground">Features</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li><a href="#" className="hover:text-primary transition-colors">Latest Releases</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Top Rated</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Bookmarks</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Reading History</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4 text-foreground">Support</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li><a href="#" className="hover:text-primary transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Contact Us</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Terms of Service</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-border mt-8 pt-8 text-center text-muted-foreground">
            <p>&copy; 2024 MangaRoll. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
