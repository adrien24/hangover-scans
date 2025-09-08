import { useState } from "react";
import { Star, TrendingUp, Award } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import MangaNavigation from "@/components/MangaNavigation";
import MangaCard from "@/components/MangaCard";

const TopRated = () => {
  const topRatedManga = [
    {
      id: "1",
      title: "Attack on Titan",
      cover: "/src/assets/manga-cover-1.jpg",
      genre: "Action",
      rating: 9.8,
      chapters: 139,
      status: "Completed",
      description: "Humanity fights for survival against giant humanoid Titans.",
      votes: 125847
    },
    {
      id: "2", 
      title: "One Piece",
      cover: "/src/assets/manga-cover-2.jpg",
      genre: "Adventure",
      rating: 9.7,
      chapters: 1100,
      status: "Ongoing",
      description: "Follow Monkey D. Luffy on his quest to become the Pirate King.",
      votes: 98234
    },
    {
      id: "3",
      title: "Demon Slayer", 
      cover: "/src/assets/manga-cover-3.jpg",
      genre: "Supernatural",
      rating: 9.6,
      chapters: 230,
      status: "Completed",
      description: "Tanjiro becomes a demon slayer to save his sister.",
      votes: 87432
    },
    {
      id: "4",
      title: "My Hero Academia",
      cover: "/src/assets/manga-cover-4.jpg", 
      genre: "Superhero",
      rating: 9.4,
      chapters: 400,
      status: "Ongoing",
      description: "Izuku dreams of becoming the greatest hero.",
      votes: 76543
    },
    {
      id: "5",
      title: "Jujutsu Kaisen",
      cover: "/src/assets/manga-cover-5.jpg",
      genre: "Supernatural", 
      rating: 9.3,
      chapters: 250,
      status: "Ongoing",
      description: "Yuji joins Jujutsu Sorcerers to kill a powerful curse.",
      votes: 65432
    },
    {
      id: "6",
      title: "Chainsaw Man",
      cover: "/src/assets/manga-cover-6.jpg",
      genre: "Action",
      rating: 9.2,
      chapters: 180,
      status: "Ongoing", 
      description: "Denji becomes the Chainsaw Devil.",
      votes: 54321
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <MangaNavigation />
      
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-2 mb-8">
          <Award className="w-6 h-6 text-primary" />
          <div>
            <h1 className="text-3xl font-bold text-foreground">Top Rated Manga</h1>
            <p className="text-muted-foreground">The highest rated manga according to our community</p>
          </div>
        </div>

        <Tabs defaultValue="all" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="all">All Time</TabsTrigger>
            <TabsTrigger value="year">This Year</TabsTrigger>  
            <TabsTrigger value="month">This Month</TabsTrigger>
            <TabsTrigger value="week">This Week</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-6">
            {/* Top 3 Spotlight */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {topRatedManga.slice(0, 3).map((manga, index) => (
                <Card key={manga.id} className="relative overflow-hidden group">
                  <div className="absolute top-4 left-4 z-10">
                    <Badge className={`text-white ${
                      index === 0 ? 'bg-yellow-500' : 
                      index === 1 ? 'bg-gray-400' : 'bg-amber-600'
                    }`}>
                      #{index + 1}
                    </Badge>
                  </div>
                  <div className="relative">
                    <img 
                      src={manga.cover} 
                      alt={manga.title}
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-bold text-lg mb-2">{manga.title}</h3>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span className="font-bold">{manga.rating}</span>
                      </div>
                      <Badge variant="outline">{manga.genre}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                      {manga.description}
                    </p>
                    <div className="text-xs text-muted-foreground">
                      {manga.votes.toLocaleString()} votes
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Full Rankings */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  Complete Rankings
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {topRatedManga.map((manga, index) => (
                    <div key={manga.id} className="flex items-center gap-4 p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground font-bold text-sm">
                        {index + 1}
                      </div>
                      <img 
                        src={manga.cover}
                        alt={manga.title}
                        className="w-12 h-16 object-cover rounded"
                      />
                      <div className="flex-1">
                        <h4 className="font-medium text-foreground">{manga.title}</h4>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                            {manga.rating}
                          </span>
                          <span>{manga.chapters} chapters</span>
                          <Badge variant="outline" className="text-xs">
                            {manga.status}
                          </Badge>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium">{manga.votes.toLocaleString()}</div>
                        <div className="text-xs text-muted-foreground">votes</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="year">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
              {topRatedManga.slice(0, 6).map((manga) => (
                <MangaCard 
                  key={manga.id}
                  id={manga.id}
                  title={manga.title}
                  cover={manga.cover}
                  genre={manga.genre}
                  rating={manga.rating}
                  chapters={manga.chapters}
                  status={manga.status as "Completed" | "Ongoing"}
                  description={manga.description}
                />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="month">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
              {topRatedManga.slice(1, 7).map((manga) => (
                <MangaCard 
                  key={manga.id}
                  id={manga.id}
                  title={manga.title}
                  cover={manga.cover}
                  genre={manga.genre}
                  rating={manga.rating}
                  chapters={manga.chapters}
                  status={manga.status as "Completed" | "Ongoing"}
                  description={manga.description}
                />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="week">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
              {topRatedManga.slice(2, 8).map((manga) => (
                <MangaCard 
                  key={manga.id}
                  id={manga.id}
                  title={manga.title}
                  cover={manga.cover}
                  genre={manga.genre}
                  rating={manga.rating}
                  chapters={manga.chapters}
                  status={manga.status as "Completed" | "Ongoing"}
                  description={manga.description}
                />
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default TopRated;