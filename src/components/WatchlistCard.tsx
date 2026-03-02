import {
  Star,
  Play,
  Trash2,
  Clock,
  CheckCircle,
  BookOpen,
  Pause,
  BookmarkPlus,
  MoreVertical,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { WatchlistStatus } from "@/hooks/useWatchlistStorage";

interface WatchlistCardProps {
  title: string;
  cover: string;
  genre: string;
  rating: number;
  totalChapters: number;
  readChapters: number;
  status: WatchlistStatus;
  lastRead?: string;
  onRemove: () => void;
  onStatusChange: (newStatus: WatchlistStatus) => void;
  onContinueReading: () => void;
}

const statusConfig: Record<
  WatchlistStatus,
  {
    color: string;
    icon: typeof Play;
    label: string;
  }
> = {
  "En cours": {
    color: "bg-green-600 hover:bg-green-600",
    icon: BookOpen,
    label: "En cours",
  },
  Terminé: {
    color: "bg-blue-600 hover:bg-blue-600",
    icon: CheckCircle,
    label: "Terminé",
  },
  "À lire": {
    color: "bg-yellow-600 hover:bg-yellow-600",
    icon: BookmarkPlus,
    label: "À lire",
  },
  "En pause": {
    color: "bg-gray-600 hover:bg-gray-600",
    icon: Pause,
    label: "En pause",
  },
};

const WatchlistCard = ({
  title,
  cover,
  genre,
  rating,
  totalChapters,
  readChapters,
  status,
  lastRead,
  onRemove,
  onStatusChange,
  onContinueReading,
}: WatchlistCardProps) => {
  const progressPercentage =
    totalChapters > 0 ? (readChapters / totalChapters) * 100 : 0;
  const statusInfo = statusConfig[status];
  const StatusIcon = statusInfo.icon;

  return (
    <Card className='group relative overflow-hidden bg-manga-card border-border hover:bg-manga-card-hover transition-all duration-300'>
      <div className='flex'>
        {/* Cover Image */}
        <div className='relative w-24 sm:w-32 aspect-[3/4] overflow-hidden flex-shrink-0 bg-manga-card-hover'>
          {cover ? (
            <img
              src={cover}
              alt={title}
              className='w-full h-full object-cover'
              onError={(e) => {
                e.currentTarget.style.display = "none";
              }}
            />
          ) : (
            <div className='w-full h-full flex items-center justify-center text-muted-foreground'>
              <BookOpen className='w-8 h-8' />
            </div>
          )}

          {/* Status badge */}
          <Badge
            className={`absolute top-2 left-2 text-white text-xs flex items-center gap-1 ${statusInfo.color}`}
          >
            <StatusIcon className='w-3 h-3' />
            <span className='hidden sm:inline'>{statusInfo.label}</span>
          </Badge>
        </div>

        {/* Content */}
        <div className='flex-1 p-4 flex flex-col justify-between'>
          <div>
            <div className='flex items-start justify-between mb-2'>
              <h3 className='font-semibold text-foreground line-clamp-2 flex-1 pr-2'>
                {title}
              </h3>
              <div className='flex gap-1 flex-shrink-0'>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant='ghost'
                      size='sm'
                      className='text-muted-foreground hover:text-foreground hover:bg-accent'
                    >
                      <MoreVertical className='w-4 h-4' />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align='end'>
                    <div className='px-2 py-1.5 text-sm font-semibold'>
                      Changer le statut
                    </div>
                    {Object.entries(statusConfig).map(([statusKey, config]) => {
                      const Icon = config.icon;
                      return (
                        <DropdownMenuItem
                          key={statusKey}
                          onClick={() =>
                            onStatusChange(statusKey as WatchlistStatus)
                          }
                        >
                          <Icon className='mr-2 h-4 w-4' />
                          <span>{config.label}</span>
                        </DropdownMenuItem>
                      );
                    })}
                  </DropdownMenuContent>
                </DropdownMenu>
                <Button
                  variant='ghost'
                  size='sm'
                  onClick={onRemove}
                  className='text-muted-foreground hover:text-destructive hover:bg-destructive/10'
                >
                  <Trash2 className='w-4 h-4' />
                </Button>
              </div>
            </div>

            <div className='flex items-center gap-4 text-sm text-muted-foreground mb-3'>
              <span className='bg-primary/10 text-primary px-2 py-1 rounded-md text-xs'>
                {genre}
              </span>
              <div className='flex items-center space-x-1'>
                <Star className='w-4 h-4 fill-yellow-400 text-yellow-400' />
                <span className='font-medium text-foreground'>
                  {rating.toFixed(1)}
                </span>
              </div>
            </div>

            {/* Progress */}
            <div className='mb-3'>
              <div className='flex items-center justify-between text-sm mb-1'>
                <span className='text-muted-foreground'>Progression</span>
                <span className='text-foreground font-medium'>
                  {readChapters}/{totalChapters}
                </span>
              </div>
              <Progress value={progressPercentage} className='h-2' />
              <div className='text-xs text-muted-foreground mt-1'>
                {Math.round(progressPercentage)}% terminé
              </div>
            </div>

            {lastRead && (
              <p className='text-xs text-muted-foreground mb-3'>
                Dernière lecture: {lastRead}
              </p>
            )}
          </div>

          <div className='flex gap-2'>
            <Button
              size='sm'
              onClick={onContinueReading}
              className='bg-primary hover:bg-primary/90 text-primary-foreground flex-1'
            >
              <Play className='w-4 h-4 mr-1' />
              {status === "À lire" ? "Commencer à lire" : "Continuer"}
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default WatchlistCard;
