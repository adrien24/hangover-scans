import { useState, useEffect } from "react";
import { Heart, BookOpen, BookCheck, Pause, BookmarkPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  useWatchlistStorage,
} from "@/hooks/useWatchlistStorage";
import type { WatchlistStatus } from "@/hooks/useWatchlistStorage";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

interface WatchlistButtonProps {
  mangaTitle: string;
  variant?: "icon" | "button";
  size?: "default" | "sm" | "lg" | "icon";
  className?: string;
}

const statusConfig: Record<
  WatchlistStatus,
  { label: string; icon: typeof BookOpen }
> = {
  "À lire": { label: "À lire", icon: BookmarkPlus },
  "En cours": { label: "En cours", icon: BookOpen },
  Terminé: { label: "Terminé", icon: BookCheck },
  "En pause": { label: "En pause", icon: Pause },
};

export function WatchlistButton({
  mangaTitle,
  variant = "icon",
  size = "icon",
  className,
}: WatchlistButtonProps) {
  const {
    addToWatchlist,
    getWatchlistItem,
    removeFromWatchlist,
  } = useWatchlistStorage();
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [inWatchlist, setInWatchlist] = useState(false);
  const [currentStatus, setCurrentStatus] = useState<WatchlistStatus | null>(null);

  useEffect(() => {
    const load = async () => {
      const item = await getWatchlistItem(mangaTitle);
      setInWatchlist(item !== null);
      setCurrentStatus(item?.status ?? null);
    };
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mangaTitle]);

  const handleStatusSelect = async (status: WatchlistStatus) => {
    await addToWatchlist(mangaTitle, status);
    const wasInWatchlist = inWatchlist;
    setInWatchlist(true);
    setCurrentStatus(status);
    setOpen(false);

    toast({
      title: wasInWatchlist ? "Watchlist mise à jour" : "Ajouté à la watchlist",
      description: `"${mangaTitle}" est maintenant dans "${status}"`,
    });
  };

  const handleRemove = async (e: React.MouseEvent) => {
    e.stopPropagation();
    await removeFromWatchlist(mangaTitle);
    setInWatchlist(false);
    setCurrentStatus(null);
    setOpen(false);

    toast({
      title: "Retiré de la watchlist",
      description: `"${mangaTitle}" a été retiré de votre watchlist`,
      variant: "destructive",
    });
  };

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant={variant === "icon" ? "outline" : "default"}
          size={size}
          className={cn(
            "hover:bg-transparent",
            className,
            inWatchlist ? "text-red-500" : "",
          )}
          onClick={(e) => e.stopPropagation()}
        >
          <Heart
            className={cn(
              "h-6 w-6",
              size === "sm" && "h-14 w-14",
              inWatchlist && "fill-current",
            )}
            strokeWidth={2}
            style={{ stroke: "white" }}
          />
          {variant === "button" && (
            <span className='ml-2'>
              {inWatchlist ? "Dans la watchlist" : "Ajouter à la watchlist"}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end' className='w-48'>
        <div className='px-2 py-1.5 text-sm font-semibold'>
          {inWatchlist ? "Changer le statut" : "Ajouter à la watchlist"}
        </div>
        {Object.entries(statusConfig).map(([status, config]) => {
          const Icon = config.icon;
          return (
            <DropdownMenuItem
              key={status}
              onClick={() => handleStatusSelect(status as WatchlistStatus)}
              className={cn(
                "cursor-pointer",
                currentStatus === status && "bg-accent",
              )}
            >
              <Icon className='mr-2 h-4 w-4' />
              <span>{config.label}</span>
            </DropdownMenuItem>
          );
        })}
        {inWatchlist && (
          <>
            <div className='my-1 h-px bg-border' />
            <DropdownMenuItem
              onClick={handleRemove}
              className='cursor-pointer text-destructive focus:text-destructive'
            >
              Retirer de la watchlist
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
