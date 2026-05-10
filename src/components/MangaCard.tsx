import { useState, useEffect } from "react";
import { Play, CheckCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useBookmarkStorage } from "@/hooks/useBookmarkStorage";
import type { MangaBookmark } from "@/hooks/useBookmarkStorage";
import { WatchlistButton } from "@/components/WatchlistButton";

interface MangaCardProps {
  id: string;
  title: string;
  cover: string;
  genre: string;
  rating: number;
  status: string;
  description: string;
  chapters: Array<[]>;
}

const MangaCard = ({ title, cover, status, description }: MangaCardProps) => {
  const { getBookmark } = useBookmarkStorage();
  const [mangaBookmark, setMangaBookmark] = useState<MangaBookmark | null>(null);

  useEffect(() => {
    getBookmark(title).then(setMangaBookmark);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [title]);

  // Recuperer le dernier chapitre lu
  const lastReadChapter = mangaBookmark?.chapters
    .sort((a, b) => b.id - a.id)
    .at(0);

  // Determiner le statut d'affichage
  const getButtonDisplay = () => {
    if (!lastReadChapter) {
      return { text: "Lire", icon: Play, variant: "default" };
    }

    if (lastReadChapter.isFinished) {
      return { text: "Chapitre fini", icon: CheckCircle, variant: "secondary" };
    }

    return { text: "Continuer", icon: Play, variant: "default" };
  };

  const buttonDisplay = getButtonDisplay();
  return (
    <Card className='group relative overflow-hidden bg-manga-card border-border hover:bg-manga-card-hover transition-all duration-300 hover:scale-105 hover:shadow-xl'>
      {/* Cover Image */}
      <div className='relative aspect-[3/4] overflow-hidden'>
        <img
          src={cover}
          alt={title}
          className='w-full h-full object-cover transition-transform duration-300 group-hover:scale-110'
        />

        {/* Watchlist Button */}
        <div className='absolute top-2 left-2 z-10'>
          <WatchlistButton
            mangaTitle={title}
            variant='icon'
            size='icon'
            className='bg-black/40 backdrop-blur-sm hover:bg-black/60'
          />
        </div>

        {/* Overlay on hover */}
        <div className='absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300'>
          <div className='absolute bottom-4 left-4 right-4'>
            <p className='text-white text-sm line-clamp-3 mb-3'>
              {description}
            </p>
            <div className='flex space-x-2'>
              <Link to={`/manga/${title}`}>
                <Button
                  size='sm'
                  className={`text-primary-foreground ${
                    buttonDisplay.variant === "default"
                      ? "bg-primary hover:bg-primary/90"
                      : "bg-green-600 hover:bg-green-700"
                  }`}
                >
                  <buttonDisplay.icon className='w-4 h-4 mr-1' />
                  {buttonDisplay.text}
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Status badge */}
        <Badge
          className={`absolute top-2 right-2 ${
            status === "En cours"
              ? "bg-green-600 hover:bg-green-600"
              : "bg-blue-600 hover:bg-blue-600"
          } text-white`}
        >
          {status}
        </Badge>
      </div>

      {/* Card Content */}
      <div className='p-4'>
        <h3 className='font-semibold text-foreground mb-2 line-clamp-2 group-hover:text-primary transition-colors'>
          {title}
        </h3>

        <div className='flex items-center justify-between text-sm text-muted-foreground mb-2'>
        </div>

        <div className='flex items-center space-x-1'>
        </div>
      </div>
    </Card>
  );
};

export default MangaCard;
