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
  const { getMangaMode, saveMangaMode } = useReaderModeStorage();
  const { getCurrentPage, markChapterAsFinished } = useBookmarkStorage();
  const [isCarouselMode, setIsCarouselMode] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const [isReady, setIsReady] = useState(false);

  const controller = useScansController(id, title);

  // Load reader mode and current page from API
  useEffect(() => {
    const loadUserData = async () => {
      const [mode, page] = await Promise.all([
        getMangaMode(title),
        getCurrentPage(title, id),
      ]);
      setIsCarouselMode(mode === "carousel");
      setCurrentPage(page);
      setIsReady(true);
    };
    loadUserData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [title, id]);

  // Sync with watchlist when reading
  useWatchlistSync({
    mangaTitle: title || "",
    chapterNumber: id || "",
  });

  // Masquer le header apres 3 secondes d'inactivite
  useEffect(() => {
    if (!showHeader) return;

    const timer = setTimeout(() => {
      setShowHeader(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, [showHeader]);

  const handlePageClick = () => {
    setShowHeader(!showHeader);
  };

  const handleToggleMode = () => {
    setIsCarouselMode((prevMode) => {
      const newMode = !prevMode;
      saveMangaMode(title!, newMode ? "carousel" : "vertical");
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

  if (!isReady) {
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
