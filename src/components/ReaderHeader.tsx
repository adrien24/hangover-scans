import { ArrowLeft, LayoutGrid, LayoutList, SkipForward } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { WatchlistButton } from "@/components/WatchlistButton";

interface ReaderHeaderProps {
  title?: string;
  isVisible: boolean;
  isCarouselMode: boolean;
  onToggleMode: () => void;
  onNextChapter?: () => void;
  isNextChapterAvailable?: boolean;
}

const ReaderHeader = ({
  title,
  isVisible,
  isCarouselMode,
  onToggleMode,
  onNextChapter,
  isNextChapterAvailable = true,
}: ReaderHeaderProps) => {
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate(`/manga/${title}`);
  };

  return (
    <div
      className={`fixed top-0 left-0 right-0 z-50 transition-opacity duration-300 ${
        isVisible ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
    >
      <div className='bg-black/60 backdrop-blur-sm p-4 flex items-center justify-between'>
        <div className='flex items-center'>
          <Button
            onClick={(e) => {
              e.stopPropagation();
              handleGoBack();
            }}
            variant='ghost'
            size='icon'
            className='text-white hover:bg-white/20'
          >
            <ArrowLeft className='h-5 w-5' />
          </Button>
          <h1 className='text-white ml-4 text-lg font-semibold'>{title}</h1>
        </div>
        <div className='flex items-center gap-2'>
          <Button
            onClick={(e) => {
              e.stopPropagation();
              onToggleMode();
            }}
            variant='ghost'
            size='icon'
            className='text-white hover:bg-white/20'
            title={isCarouselMode ? "Mode vertical" : "Mode carrousel"}
          >
            {isCarouselMode ? (
              <LayoutList className='h-5 w-5' />
            ) : (
              <LayoutGrid className='h-5 w-5' />
            )}
          </Button>
          {title && <WatchlistButton mangaTitle={title} variant='icon' />}
          {onNextChapter && (
            <Button
              onClick={(e) => {
                e.stopPropagation();
                onNextChapter();
              }}
              variant='ghost'
              size='default'
              className='text-white hover:bg-white/20 text-sm gap-2'
              disabled={!isNextChapterAvailable}
              title='Aller au chapitre suivant'
            >
              <span>Suivant</span>
              <SkipForward className='h-4 w-4' />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReaderHeader;
