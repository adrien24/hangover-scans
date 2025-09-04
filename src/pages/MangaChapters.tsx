import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, Search, BookOpen, Clock, Download } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";

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
  
  const { data: manga, isLoading: mangaLoading } = useQuery({
    queryKey: ['manga', mangaId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('Mangas')
        .select('*')
        .eq('id', parseInt(mangaId!))
        .single();
      
      if (error) throw error;
      return data as Manga;
    },
    enabled: !!mangaId
  });

  const { data: chapters = [], isLoading: chaptersLoading } = useQuery({
    queryKey: ['chapters', mangaId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('Scans')
        .select('*')
        .eq('scan_id', mangaId)
        .order('chapter', { ascending: true });
      
      if (error) throw error;
      return data as Scan[];
    },
    enabled: !!mangaId
  });

  const isLoading = mangaLoading || chaptersLoading;

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