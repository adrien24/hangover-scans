import { useState } from "react";
import { ArrowLeft, Search, BookOpen, Clock, Download } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

interface Manga {
  id: number;
  title: string;
  description: string | null;
  thumbnails: string | null;
}

interface Scan {
  id: number;
  title: string | null;
  description: string | null;
  images: any;
  date: string;
  chapter: number;
  scan_id: string | null;
}

const MangaChapters = () => {
  const { mangaId } = useParams();
  const [searchTerm, setSearchTerm] = useState("");
  
  // Mock manga data
  const mockMangas: Record<string, Manga> = {
    "1": {
      id: 1,
      title: "Attack on Titan",
      description: "Humanity fights for survival against giant humanoid Titans that have brought civilization to the brink of extinction.",
      thumbnails: "/src/assets/manga-cover-1.jpg"
    },
    "2": {
      id: 2,
      title: "One Piece",
      description: "Follow Monkey D. Luffy on his quest to become the Pirate King and find the legendary treasure One Piece.",
      thumbnails: "/src/assets/manga-cover-2.jpg"
    },
    "3": {
      id: 3,
      title: "Demon Slayer",
      description: "Tanjiro Kamado becomes a demon slayer to save his sister and avenge his family.",
      thumbnails: "/src/assets/manga-cover-3.jpg"
    },
    "4": {
      id: 4,
      title: "My Hero Academia",
      description: "In a world where people have superpowers, Izuku Midoriya dreams of becoming the greatest hero.",
      thumbnails: "/src/assets/manga-cover-4.jpg"
    },
    "5": {
      id: 5,
      title: "Jujutsu Kaisen",
      description: "Yuji Itadori joins a secret organization of Jujutsu Sorcerers to kill a powerful curse.",
      thumbnails: "/src/assets/manga-cover-5.jpg"
    },
    "6": {
      id: 6,
      title: "Chainsaw Man",
      description: "Denji becomes the Chainsaw Devil and hunts other devils for the Public Safety Devil Hunters.",
      thumbnails: "/src/assets/manga-cover-6.jpg"
    }
  };

  // Mock chapters data
  const mockChapters: Record<string, Scan[]> = {
    "1": [
      {
        id: 1,
        title: "To You, 2000 Years From Now",
        description: "The story begins with Eren Yeager having a strange dream.",
        images: Array(45).fill("").map((_, i) => `page_${i + 1}.jpg`),
        date: "2024-01-15",
        chapter: 1,
        scan_id: "1"
      },
      {
        id: 2,
        title: "That Day",
        description: "The Colossal Titan appears and breaks through Wall Maria.",
        images: Array(42).fill("").map((_, i) => `page_${i + 1}.jpg`),
        date: "2024-01-14",
        chapter: 2,
        scan_id: "1"
      },
      {
        id: 3,
        title: "A Dim Light Amid Despair",
        description: "Humanity's first glimpse of hope against the Titans.",
        images: Array(38).fill("").map((_, i) => `page_${i + 1}.jpg`),
        date: "2024-01-13",
        chapter: 3,
        scan_id: "1"
      }
    ],
    "2": Array.from({ length: 100 }, (_, i) => ({
      id: i + 100,
      title: `Chapter ${i + 1}`,
      description: `One Piece chapter ${i + 1}`,
      images: Array(18 + Math.floor(Math.random() * 5)).fill("").map((_, j) => `page_${j + 1}.jpg`),
      date: new Date(2024, 0, 15 - Math.floor(i / 10)).toISOString().split('T')[0],
      chapter: i + 1,
      scan_id: "2"
    })),
    "3": Array.from({ length: 30 }, (_, i) => ({
      id: i + 200,
      title: `Chapter ${i + 1}`,
      description: `Demon Slayer chapter ${i + 1}`,
      images: Array(18 + Math.floor(Math.random() * 5)).fill("").map((_, j) => `page_${j + 1}.jpg`),
      date: new Date(2024, 0, 15 - i).toISOString().split('T')[0],
      chapter: i + 1,
      scan_id: "3"
    })),
    "4": Array.from({ length: 40 }, (_, i) => ({
      id: i + 300,
      title: `Chapter ${i + 1}`,
      description: `My Hero Academia chapter ${i + 1}`,
      images: Array(18 + Math.floor(Math.random() * 5)).fill("").map((_, j) => `page_${j + 1}.jpg`),
      date: new Date(2024, 0, 15 - i).toISOString().split('T')[0],
      chapter: i + 1,
      scan_id: "4"
    })),
    "5": Array.from({ length: 25 }, (_, i) => ({
      id: i + 400,
      title: `Chapter ${i + 1}`,
      description: `Jujutsu Kaisen chapter ${i + 1}`,
      images: Array(18 + Math.floor(Math.random() * 5)).fill("").map((_, j) => `page_${j + 1}.jpg`),
      date: new Date(2024, 0, 15 - i).toISOString().split('T')[0],
      chapter: i + 1,
      scan_id: "5"
    })),
    "6": Array.from({ length: 18 }, (_, i) => ({
      id: i + 500,
      title: `Chapter ${i + 1}`,
      description: `Chainsaw Man chapter ${i + 1}`,
      images: Array(18 + Math.floor(Math.random() * 5)).fill("").map((_, j) => `page_${j + 1}.jpg`),
      date: new Date(2024, 0, 15 - i).toISOString().split('T')[0],
      chapter: i + 1,
      scan_id: "6"
    }))
  };

  const manga = mangaId ? mockMangas[mangaId] : null;
  const chapters = mangaId ? mockChapters[mangaId] || [] : [];
  const isLoading = false;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!manga) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">Manga not found</h1>
          <Link to="/">
            <Button>Return to Home</Button>
          </Link>
        </div>
      </div>
    );
  }

  const filteredChapters = chapters.filter(chapter =>
    (chapter.title?.toLowerCase().includes(searchTerm.toLowerCase()) || 
     `Chapter ${chapter.chapter}`.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-background/80 backdrop-blur-sm border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Link to="/">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
            </Link>
            <div className="flex items-center gap-4 flex-1">
              <img 
                src={manga.thumbnails || '/placeholder.svg'} 
                alt={manga.title}
                className="w-12 h-16 object-cover rounded"
              />
              <div>
                <h1 className="text-xl font-bold text-foreground">{manga.title}</h1>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <BookOpen className="w-4 h-4" />
                  {chapters.length} chapters
                  <Badge variant="secondary">
                    Ongoing
                  </Badge>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Search chapters..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Chapters List */}
        <div className="space-y-2">
          {filteredChapters.map((chapter) => {
            const pageCount = chapter.images ? (Array.isArray(chapter.images) ? chapter.images.length : Object.keys(chapter.images).length) : 0;
            
            return (
              <Card key={chapter.id} className="hover:bg-muted/50 transition-colors">
                <div className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 flex-1">
                      <div className="text-sm text-muted-foreground font-mono min-w-[3rem]">
                        #{chapter.chapter}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium text-foreground mb-1">
                          {chapter.title || `Chapter ${chapter.chapter}`}
                        </h3>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <BookOpen className="w-3 h-3" />
                            {pageCount} pages
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {chapter.date}
                          </span>
                        </div>
                        {chapter.description && (
                          <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                            {chapter.description}
                          </p>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Link to={`/manga/${mangaId}/chapter/${chapter.id}`}>
                        <Button size="sm">
                          Read
                        </Button>
                      </Link>
                      <Button size="sm" variant="ghost">
                        <Download className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        {filteredChapters.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No chapters found matching your search.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MangaChapters;