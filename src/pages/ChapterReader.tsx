import useScansController from "@/hooks/useScansController";
import { useReaderModeStorage } from "@/hooks/useReaderModeStorage";
import { useBookmarkStorage } from "@/hooks/useBookmarkStorage";
import { useWatchlistSync } from "@/hooks/useWatchlistSync";
import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import ReaderHeader from "@/components/ReaderHeader";
import CarouselReader from "@/components/CarouselReader";
import VerticalReader from "@/components/VerticalReader";

const ChapterReader = () => {
  const { title, id } = useParams();
  const navigate = useNavigate();
  const [showHeader, setShowHeader] = useState(false);
  const { saveMangaMode } = useReaderModeStorage();
  const { markChapterAsFinished } = useBookmarkStorage();
  const [isCarouselMode, setIsCarouselMode] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);

  const controller = useScansController(id, title);
  const { userContext, totalChapters, isLoading } = controller;

  // Apply userContext once it arrives (single network call upstream)
  useEffect(() => {
    if (!userContext) return;
    if (userContext.readerMode) {
      setIsCarouselMode(userContext.readerMode === "carousel");
    }
    setCurrentPage(userContext.currentPage);
  }, [userContext]);

  useWatchlistSync({
    mangaTitle: title || "",
    chapterNumber: id || "",
    totalChapters,
    userContext,
  });

  // Masquer le header apres 3 secondes d'inactivite
  useEffect(() => {
    if (!showHeader) return;
    const timer = setTimeout(() => setShowHeader(false), 3000);
    return () => clearTimeout(timer);
  }, [showHeader]);

  const handlePageClick = () => setShowHeader((s) => !s);

  const handleToggleMode = () => {
    setIsCarouselMode((prevMode) => {
      const newMode = !prevMode;
      if (title) saveMangaMode(title, newMode ? "carousel" : "vertical");
      return newMode;
    });
  };

  const handleImageLoad = (index: number) => {
    controller.imagesScans[index].loaded = true;
  };

  const handleNextChapter = () => {
    const nextChapterId = parseInt(String(id)) + 1;
    if (title && id) {
      markChapterAsFinished(title, parseInt(String(id)));
    }
    navigate(`/manga/${title}/chapter/${nextChapterId}`);
  };

  if (isLoading) {
    return (
      <div className='w-full h-screen flex items-center justify-center bg-black'>
        <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-primary'></div>
      </div>
    );
  }

  return (
    <div className='w-full h-screen flex flex-col bg-black'>
      <ReaderHeader
        title={title}
        isVisible={showHeader}
        isCarouselMode={isCarouselMode}
        onToggleMode={handleToggleMode}
        onNextChapter={handleNextChapter}
        isNextChapterAvailable={controller.isNextChapterAvailable}
      />

      {isCarouselMode ? (
        <CarouselReader
          images={controller.imagesScans}
          onImageLoad={handleImageLoad}
          onClick={handlePageClick}
          mangaTitle={title}
          chapterId={id}
          currentPage={currentPage}
        />
      ) : (
        <VerticalReader
          images={controller.imagesScans}
          onImageLoad={handleImageLoad}
          onClick={handlePageClick}
        />
      )}
    </div>
  );
};

export default ChapterReader;
