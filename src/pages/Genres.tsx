import { useState } from "react";
import { Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import MangaNavigation from "@/components/MangaNavigation";
import MangaGrid from "@/components/MangaGrid";

const Genres = () => {
  const [selectedGenre, setSelectedGenre] = useState<string | null>(null);

  const genres = [
    { name: "Action", count: 1247, color: "bg-red-500", description: "High-intensity battles and adventures" },
    { name: "Adventure", count: 892, color: "bg-blue-500", description: "Epic journeys and exploration" },
    { name: "Romance", count: 756, color: "bg-pink-500", description: "Love stories and relationships" },
    { name: "Supernatural", count: 634, color: "bg-purple-500", description: "Magic, demons, and otherworldly elements" },
    { name: "Comedy", count: 523, color: "bg-yellow-500", description: "Humor and lighthearted stories" },
    { name: "Drama", count: 445, color: "bg-gray-500", description: "Emotional and character-driven narratives" },
    { name: "Fantasy", count: 398, color: "bg-green-500", description: "Magical worlds and mythical creatures" },
    { name: "Slice of Life", count: 287, color: "bg-orange-500", description: "Everyday life and realistic situations" },
    { name: "Thriller", count: 234, color: "bg-indigo-500", description: "Suspense and psychological tension" },
    { name: "Horror", count: 156, color: "bg-red-800", description: "Fear, terror, and dark themes" },
    { name: "Sci-Fi", count: 123, color: "bg-cyan-500", description: "Future technology and space adventures" },
    { name: "Historical", count: 98, color: "bg-amber-600", description: "Stories set in historical periods" }
  ];

  if (selectedGenre) {
    return (
      <div className="min-h-screen bg-background">
        <MangaNavigation />
        
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center gap-4 mb-8">
            <Button variant="ghost" onClick={() => setSelectedGenre(null)}>
              ← Back to Genres
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-foreground">{selectedGenre} Manga</h1>
              <p className="text-muted-foreground">
                {genres.find(g => g.name === selectedGenre)?.description}
              </p>
            </div>
          </div>
          
          <MangaGrid title="" showAll={true} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <MangaNavigation />
      
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-2 mb-8">
          <Tag className="w-6 h-6 text-primary" />
          <div>
            <h1 className="text-3xl font-bold text-foreground">Browse by Genre</h1>
            <p className="text-muted-foreground">Explore manga by your favorite genres</p>
          </div>
        </div>

        {/* Genre Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {genres.map((genre) => (
            <Card 
              key={genre.name} 
              className="cursor-pointer hover:shadow-lg transition-all duration-300 hover:scale-105"
              onClick={() => setSelectedGenre(genre.name)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{genre.name}</CardTitle>
                  <div className={`w-4 h-4 rounded-full ${genre.color}`}></div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                  {genre.description}
                </p>
                <Badge variant="secondary">
                  {genre.count} manga
                </Badge>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Popular in Each Genre */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-foreground mb-6">Trending by Genre</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  Popular in Action
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {["Attack on Titan", "One Piece", "Demon Slayer"].map((title, i) => (
                    <div key={i} className="flex items-center gap-3 p-2 rounded hover:bg-muted/50">
                      <img 
                        src={`/manga-cover-${i + 1}.jpg`} 
                        alt={title}
                        className="w-10 h-12 object-cover rounded"
                      />
                      <div className="flex-1">
                        <div className="font-medium">{title}</div>
                        <div className="text-sm text-muted-foreground">★ 4.{8-i}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-pink-500"></div>
                  Popular in Romance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {["My Hero Academia", "Jujutsu Kaisen", "Chainsaw Man"].map((title, i) => (
                    <div key={i} className="flex items-center gap-3 p-2 rounded hover:bg-muted/50">
                      <img 
                        src={`/manga-cover-${i + 4}.jpg`} 
                        alt={title}
                        className="w-10 h-12 object-cover rounded"
                      />
                      <div className="flex-1">
                        <div className="font-medium">{title}</div>
                        <div className="text-sm text-muted-foreground">★ 4.{6-i}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Genres;