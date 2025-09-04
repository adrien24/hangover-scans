import { useState, useEffect } from "react";
import { ArrowLeft, ArrowRight, Settings, Bookmark, Share } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

// Mock chapter data
const mockChapterData = {
  manga: {
    title: "Attack on Titan",
    cover: "/src/assets/manga-cover-1.jpg"
  },
  chapter: {
    id: 1,
    title: "Chapter 1: To You, 2000 Years From Now",
    pages: 45,
    uploadDate: "2021-04-09"
  },
  pages: Array.from({ length: 45 }, (_, i) => ({
    id: i + 1,
    url: `https://via.placeholder.com/800x1200/1a1a2e/eee?text=Page+${i + 1}`,
    alt: `Page ${i + 1}`
  }))
};

const ChapterReader = () => {
  const { mangaId, chapterId } = useParams();
  const [currentPage, setCurrentPage] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);
  
  const data = mockChapterData;
  
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft" && currentPage > 1) {
        setCurrentPage(currentPage - 1);
      } else if (e.key === "ArrowRight" && currentPage < data.pages.length) {
        setCurrentPage(currentPage + 1);
      } else if (e.key === "f" || e.key === "F") {
        setIsFullscreen(!isFullscreen);
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [currentPage, data.pages.length, isFullscreen]);

  const goToNextPage = () => {
    if (currentPage < data.pages.length) {
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
                    src={data.manga.cover} 
                    alt={data.manga.title}
                    className="w-8 h-10 object-cover rounded"
                  />
                  <div>
                    <h1 className="text-sm font-medium">{data.manga.title}</h1>
                    <p className="text-xs text-gray-400">{data.chapter.title}</p>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-white border-white/20">
                  {currentPage} / {data.pages.length}
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
            <img
              src={data.pages[currentPage - 1]?.url}
              alt={data.pages[currentPage - 1]?.alt}
              className="w-full max-h-[80vh] object-contain mx-auto rounded shadow-2xl"
              onClick={goToNextPage}
              style={{ cursor: currentPage < data.pages.length ? 'pointer' : 'default' }}
            />
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
            disabled={currentPage === data.pages.length}
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
              Page {currentPage} of {data.pages.length}
            </span>
          </Card>
          
          <Button
            variant="outline"
            onClick={goToNextPage}
            disabled={currentPage === data.pages.length}
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