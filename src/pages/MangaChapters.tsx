import { useState } from "react";
import { ArrowLeft, Search, BookOpen, Clock, Download } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

// Mock data for chapters
const mockManga = {
  "1": {
    title: "Attack on Titan",
    cover: "/src/assets/manga-cover-1.jpg",
    description: "Humanity fights for survival against giant humanoid Titans.",
    totalChapters: 139,
    status: "Completed" as const,
    chapters: Array.from({ length: 139 }, (_, i) => ({
      id: i + 1,
      title: `Chapter ${i + 1}: ${getChapterTitle(i + 1)}`,
      pages: Math.floor(Math.random() * 30) + 15,
      uploadDate: new Date(2021, 3, 9 - i).toLocaleDateString(),
      isNew: i >= 136,
      isRead: Math.random() > 0.7,
    }))
  }
};

function getChapterTitle(num: number): string {
  const titles = [
    "To You, 2000 Years From Now",
    "That Day",
    "A Dim Light Amid Despair",
    "The Night of the Closing Ceremony",
    "First Battle",
    "The World the Girl Saw",
    "Small Blade",
    "I Can Hear His Heartbeat",
    "The Beating of a Heart Can Be Heard",
    "Response"
  ];
  return titles[num % titles.length] || "Untitled";
}

const MangaChapters = () => {
  const { mangaId } = useParams();
  const [searchTerm, setSearchTerm] = useState("");
  
  const manga = mockManga[mangaId as keyof typeof mockManga];
  
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

  const filteredChapters = manga.chapters.filter(chapter =>
    chapter.title.toLowerCase().includes(searchTerm.toLowerCase())
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
                src={manga.cover} 
                alt={manga.title}
                className="w-12 h-16 object-cover rounded"
              />
              <div>
                <h1 className="text-xl font-bold text-foreground">{manga.title}</h1>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <BookOpen className="w-4 h-4" />
                  {manga.totalChapters} chapters
                  <Badge variant="secondary">
                    {manga.status}
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
          {filteredChapters.map((chapter) => (
            <Card key={chapter.id} className="hover:bg-muted/50 transition-colors">
              <div className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 flex-1">
                    <div className="text-sm text-muted-foreground font-mono min-w-[3rem]">
                      #{chapter.id}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium text-foreground mb-1">
                        {chapter.title}
                      </h3>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <BookOpen className="w-3 h-3" />
                          {chapter.pages} pages
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {chapter.uploadDate}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    {chapter.isNew && (
                      <Badge variant="default" className="bg-primary">
                        New
                      </Badge>
                    )}
                    {chapter.isRead && (
                      <Badge variant="outline">
                        Read
                      </Badge>
                    )}
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
          ))}
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