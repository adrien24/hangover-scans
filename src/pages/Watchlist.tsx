import { useState, useEffect, useMemo } from "react";
import { ArrowLeft, Grid3X3, List, Filter, Search, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import MangaNavigation from "@/components/MangaNavigation";
import WatchlistCard from "@/components/WatchlistCard";
import { useNavigate } from "react-router-dom";
import { useWatchlistStorage } from "@/hooks/useWatchlistStorage";
import type { WatchlistStatus } from "@/hooks/useWatchlistStorage";
import {
  getEnrichedWatchlist,
  syncLocalStorageToDb,
} from "@/services/userdata.service";
import type {
  MangaBookmark,
  WatchlistItem,
  MangaReaderMode,
} from "@/types/userdata.types";
import { toast } from "sonner";

interface EnrichedWatchlistItem {
  id: string;
  title: string;
  cover: string;
  genre: string;
  rating: number;
  totalChapters: number;
  readChapters: number;
  lastChapterRead?: string;
  status: WatchlistStatus;
  lastRead?: string;
}

const Watchlist = () => {
  const navigate = useNavigate();
  const { removeFromWatchlist, updateStatus } = useWatchlistStorage();

  const [watchlist, setWatchlist] = useState<EnrichedWatchlistItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "list">("list");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<string>("recently-read");

  const hasLocalStorageData = () => {
    try {
      const bookmarks = localStorage.getItem("manga-bookmarks");
      const watchlistData = localStorage.getItem("manga-watchlist");
      const readerModes = localStorage.getItem("manga-reader-modes");
      return !!(bookmarks || watchlistData || readerModes);
    } catch {
      return false;
    }
  };

  const [showSyncButton, setShowSyncButton] = useState(hasLocalStorageData());

  const handleSyncLocalStorage = async () => {
    setIsSyncing(true);
    try {
      const bookmarks: MangaBookmark[] = JSON.parse(
        localStorage.getItem("manga-bookmarks") || "[]"
      );
      const watchlistData: WatchlistItem[] = JSON.parse(
        localStorage.getItem("manga-watchlist") || "[]"
      );
      const readerModes: MangaReaderMode[] = JSON.parse(
        localStorage.getItem("manga-reader-modes") || "[]"
      );

      const result = await syncLocalStorageToDb({
        bookmarks,
        watchlist: watchlistData,
        readerModes,
      });

      localStorage.removeItem("manga-bookmarks");
      localStorage.removeItem("manga-watchlist");
      localStorage.removeItem("manga-reader-modes");

      setShowSyncButton(false);
      toast.success(
        `Synchronisation reussie : ${result.imported.bookmarks} bookmarks, ${result.imported.watchlist} watchlist, ${result.imported.readerModes} preferences`
      );

      window.location.reload();
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Erreur lors de la synchronisation"
      );
    } finally {
      setIsSyncing(false);
    }
  };

  const formatLastReadTime = (timestamp: number): string => {
    const now = Date.now();
    const diff = now - timestamp;
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const weeks = Math.floor(days / 7);

    if (days === 0) return "Aujourd'hui";
    if (days === 1) return "Hier";
    if (days < 7) return `Il y a ${days} jours`;
    if (weeks === 1) return "Il y a 1 semaine";
    return `Il y a ${weeks} semaines`;
  };

  useEffect(() => {
    const loadWatchlist = async () => {
      setIsLoading(true);
      try {
        const enrichedItems = await getEnrichedWatchlist();

        const items: EnrichedWatchlistItem[] = enrichedItems.map((item) => ({
          id: item.id,
          title: item.title,
          cover: item.thumbnails,
          genre: item.genres[0]?.name || "Unknown",
          rating: item.mean,
          totalChapters: parseInt(item.lastChapter) || 0,
          readChapters: parseInt(item.lastChapterRead) || 0,
          lastChapterRead: item.lastChapterRead || undefined,
          status: item.status || "En cours",
          lastRead: item.lastRead ? formatLastReadTime(item.lastRead) : undefined,
        }));

        setWatchlist(items);
      } catch (error) {
        console.error("Failed to load watchlist:", error);
        setWatchlist([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadWatchlist();
  }, []);

  const filteredWatchlist = useMemo(() => {
    return watchlist
      .filter((item) => {
        const matchesSearch = item.title
          .toLowerCase()
          .includes(searchQuery.toLowerCase());
        const matchesStatus =
          filterStatus === "all" || item.status === filterStatus;
        return matchesSearch && matchesStatus;
      })
      .sort((a, b) => {
        switch (sortBy) {
          case "title":
            return a.title.localeCompare(b.title);
          case "rating":
            return b.rating - a.rating;
          default:
            return 0;
        }
      });
  }, [watchlist, searchQuery, filterStatus, sortBy]);

  const handleRemoveFromWatchlist = async (title: string) => {
    await removeFromWatchlist(title);
    setWatchlist((prev) => prev.filter((item) => item.title !== title));
  };

  const handleStatusChange = async (
    title: string,
    newStatus: WatchlistStatus
  ) => {
    await updateStatus(title, newStatus);
    setWatchlist((prev) =>
      prev.map((item) =>
        item.title === title ? { ...item, status: newStatus } : item
      )
    );
  };

  const handleContinueReading = (title: string) => {
    navigate(`/manga/${title}`);
  };

  const getStatusCount = (status: WatchlistStatus) => {
    return watchlist.filter((item) => item.status === status).length;
  };

  if (isLoading) {
    return (
      <div className='min-h-screen bg-background'>
        <MangaNavigation />
        <div className='container mx-auto px-4 py-8 flex items-center justify-center min-h-[50vh]'>
          <div className='text-center'>
            <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4'></div>
            <p className='text-muted-foreground'>
              Chargement de votre watchlist...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-background'>
      <MangaNavigation />

      <main className='container mx-auto px-4 py-6'>
        {/* Header */}
        <Button
          variant='outline'
          size='sm'
          onClick={() => navigate("/")}
          className='hover:bg-manga-card mb-6 py-6 px-3'
        >
          <ArrowLeft className='w-4 h-4' />
          Accueil
        </Button>
        <div className='flex items-center gap-4 mb-8'>
          <h1 className='text-3xl font-bold text-foreground'>Ma Watchlist</h1>
          <Badge variant='secondary' className='ml-auto'>
            {watchlist.length} mangas
          </Badge>
        </div>

        {/* Sync localStorage button */}
        {showSyncButton && (
          <div className='mb-6 p-4 bg-manga-card rounded-lg border border-primary/30'>
            <div className='flex items-center justify-between gap-4'>
              <div>
                <p className='font-medium text-foreground'>
                  Donnees locales detectees
                </p>
                <p className='text-sm text-muted-foreground'>
                  Tu avais des donnees enregistrees avant la creation de ton
                  compte. Synchronise-les pour ne rien perdre.
                </p>
              </div>
              <Button
                onClick={handleSyncLocalStorage}
                disabled={isSyncing}
                className='shrink-0'
              >
                <Upload className='w-4 h-4 mr-2' />
                {isSyncing ? "Synchronisation..." : "Synchroniser"}
              </Button>
            </div>
          </div>
        )}

        {/* Status Overview */}
        <div className='grid grid-cols-2 md:grid-cols-4 gap-4 mb-8'>
          <div className='bg-manga-card rounded-lg p-4 border border-border'>
            <div className='text-2xl font-bold text-green-400'>
              {getStatusCount("En cours")}
            </div>
            <div className='text-sm text-muted-foreground'>En cours</div>
          </div>
          <div className='bg-manga-card rounded-lg p-4 border border-border'>
            <div className='text-2xl font-bold text-blue-400'>
              {getStatusCount("Terminé")}
            </div>
            <div className='text-sm text-muted-foreground'>Termine</div>
          </div>
          <div className='bg-manga-card rounded-lg p-4 border border-border'>
            <div className='text-2xl font-bold text-yellow-400'>
              {getStatusCount("À lire")}
            </div>
            <div className='text-sm text-muted-foreground'>A lire</div>
          </div>
          <div className='bg-manga-card rounded-lg p-4 border border-border'>
            <div className='text-2xl font-bold text-gray-400'>
              {getStatusCount("En pause")}
            </div>
            <div className='text-sm text-muted-foreground'>En pause</div>
          </div>
        </div>

        {/* Controls */}
        <div className='flex flex-col sm:flex-row gap-4 mb-8'>
          <div className='relative flex-1'>
            <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground' />
            <Input
              placeholder='Chercher dans votre watchlist...'
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className='pl-10 bg-manga-card border-border focus:border-primary'
            />
          </div>
          <div className='flex justify-between'>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className='w-40 bg-manga-card border-border'>
                <Filter className='w-4 h-4 mr-2' />
                <SelectValue placeholder='Filtrer par statut' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='all'>Tous les statuts</SelectItem>
                <SelectItem value='En cours'>En cours</SelectItem>
                <SelectItem value='Terminé'>Termine</SelectItem>
                <SelectItem value='À lire'>A lire</SelectItem>
                <SelectItem value='En pause'>En pause</SelectItem>
              </SelectContent>
            </Select>

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className='w-40 bg-manga-card border-border'>
                <SelectValue placeholder='Sort by' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='recently-read'>Lu recement</SelectItem>
                <SelectItem value='title'>Titre A-Z</SelectItem>
                <SelectItem value='rating'>Note</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className='flex bg-manga-card rounded-lg border border-border'>
            <Button
              variant={viewMode === "list" ? "default" : "ghost"}
              size='sm'
              onClick={() => setViewMode("list")}
              className='rounded-r-none'
            >
              <List className='w-4 h-4' />
            </Button>
            <Button
              variant={viewMode === "grid" ? "default" : "ghost"}
              size='sm'
              onClick={() => setViewMode("grid")}
              className='rounded-l-none'
            >
              <Grid3X3 className='w-4 h-4' />
            </Button>
          </div>
        </div>

        {/* Watchlist Content */}
        {filteredWatchlist.length === 0 ? (
          <div className='text-center py-16'>
            <div className='text-6xl mb-4'>📚</div>
            <h2 className='text-2xl font-bold text-foreground mb-2'>
              {searchQuery || filterStatus !== "all"
                ? "Aucun manga trouvé"
                : "Votre watchlist est vide"}
            </h2>
            <p className='text-muted-foreground mb-6'>
              {searchQuery || filterStatus !== "all"
                ? "Essayez d'ajuster vos criteres de recherche ou de filtre"
                : "Vous n'avez pas encore ajoute de mangas a votre watchlist"}
            </p>
            {!searchQuery && filterStatus === "all" && (
              <Button
                onClick={() => navigate("/")}
                className='bg-primary hover:bg-primary/90'
              >
                Parcourir les mangas
              </Button>
            )}
          </div>
        ) : (
          <div
            className={
              viewMode === "grid"
                ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
                : "space-y-4"
            }
          >
            {filteredWatchlist.map((manga) => (
              <WatchlistCard
                key={manga.id}
                {...manga}
                onRemove={() => handleRemoveFromWatchlist(manga.title)}
                onStatusChange={(newStatus) =>
                  handleStatusChange(manga.title, newStatus)
                }
                onContinueReading={() => handleContinueReading(manga.title)}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Watchlist;
