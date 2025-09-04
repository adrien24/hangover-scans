import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, ArrowRight, Settings, Bookmark, Share } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";

interface Manga {
  id: number;
  title: string;
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

const ChapterReader = () => {
  const { mangaId, chapterId } = useParams();
  const [currentPage, setCurrentPage] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);
  
  const { data: manga } = useQuery({
    queryKey: ['manga', mangaId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('Mangas')
        .select('id, title, thumbnails')
        .eq('id', parseInt(mangaId!))
        .single();
      
      if (error) throw error;
      return data as Manga;
    },
    enabled: !!mangaId
  });

  const { data: chapter, isLoading } = useQuery({
    queryKey: ['chapter', chapterId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('Scans')
        .select('*')
        .eq('id', parseInt(chapterId!))
        .single();
      
      if (error) throw error;
      return data as Scan;
    },
    enabled: !!chapterId
  });

  const pages = chapter?.images ? (Array.isArray(chapter.images) ? chapter.images : Object.values(chapter.images)) : [];
  
  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-white">Loading chapter...</p>
        </div>
      </div>
    );
  }

  if (!manga || !chapter) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Chapter not found</h1>
          <Link to={`/manga/${mangaId}`}>
            <Button variant="outline" className="border-white text-white hover:bg-white hover:text-black">
              Return to Chapters
            </Button>
          </Link>
        </div>
      </div>
    );
  }
  
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft" && currentPage > 1) {
        setCurrentPage(currentPage - 1);
      } else if (e.key === "ArrowRight" && currentPage < pages.length) {
        setCurrentPage(currentPage + 1);
      } else if (e.key === "f" || e.key === "F") {
        setIsFullscreen(!isFullscreen);
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [currentPage, pages.length, isFullscreen]);

  const goToNextPage = () => {
    if (currentPage < pages.length) {
      setCurrentPage(currentPage + 1);
    }
  };

  const goToPrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <div className={`bg-black text-white ${isFullscreen ? 'fixed inset-0 z-50' : 'min-h-screen'}`}>
      {/* Reader Header */}
      {!isFullscreen && (
        <div className="sticky top-0 z-40 bg-black/90 backdrop-blur-sm border-b border-gray-800">
          <div className="container mx-auto px-4 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Link to={`/manga/${mangaId}`}>
                  <Button variant="ghost" size="sm" className="text-white hover:bg-white/10">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Chapters
                  </Button>
                </Link>
                <div className="flex items-center gap-3">
                  <img 
                    src={manga.thumbnails || '/placeholder.svg'} 
                    alt={manga.title}
                    className="w-8 h-10 object-cover rounded"
                  />
                  <div>
                    <h1 className="text-sm font-medium">{manga.title}</h1>
                    <p className="text-xs text-gray-400">{chapter.title || `Chapter ${chapter.chapter}`}</p>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-white border-white/20">
                  {currentPage} / {pages.length}
                </Badge>
                <Button variant="ghost" size="sm" className="text-white hover:bg-white/10">
                  <Bookmark className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="sm" className="text-white hover:bg-white/10">
                  <Share className="w-4 h-4" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-white hover:bg-white/10"
                  onClick={() => setIsFullscreen(!isFullscreen)}
                >
                  <Settings className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Reader Content */}
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-80px)] p-4">
        <div className="relative max-w-4xl w-full">
          {/* Current Page */}
          <div className="text-center mb-4">
            {pages[currentPage - 1] ? (
              <img
                src={pages[currentPage - 1]}
                alt={`Page ${currentPage}`}
                className="w-full max-h-[80vh] object-contain mx-auto rounded shadow-2xl"
                onClick={goToNextPage}
                style={{ cursor: currentPage < pages.length ? 'pointer' : 'default' }}
              />
            ) : (
              <div className="w-full max-h-[80vh] bg-gray-800 flex items-center justify-center rounded">
                <p className="text-white">Page not available</p>
              </div>
            )}
          </div>

          {/* Navigation Arrows */}
          <Button
            variant="ghost"
            size="lg"
            className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-4 bg-black/50 hover:bg-black/70 text-white"
            onClick={goToPrevPage}
            disabled={currentPage === 1}
          >
            <ArrowLeft className="w-6 h-6" />
          </Button>
          
          <Button
            variant="ghost"
            size="lg"
            className="absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-4 bg-black/50 hover:bg-black/70 text-white"
            onClick={goToNextPage}
            disabled={currentPage === pages.length}
          >
            <ArrowRight className="w-6 h-6" />
          </Button>
        </div>

        {/* Bottom Navigation */}
        <div className="mt-6 flex items-center gap-4">
          <Button
            variant="outline"
            onClick={goToPrevPage}
            disabled={currentPage === 1}
            className="border-white/20 text-white hover:bg-white/10"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Previous
          </Button>
          
          <Card className="bg-white/10 border-white/20 px-4 py-2">
            <span className="text-white text-sm font-medium">
              Page {currentPage} of {pages.length}
            </span>
          </Card>
          
          <Button
            variant="outline"
            onClick={goToNextPage}
            disabled={currentPage === pages.length}
            className="border-white/20 text-white hover:bg-white/10"
          >
            Next
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>

        {/* Instructions */}
        <p className="text-gray-400 text-sm mt-4 text-center">
          Use arrow keys to navigate • Press F for fullscreen • Click image to go to next page
        </p>
      </div>
    </div>
  );
};

export default ChapterReader;