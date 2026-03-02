import { useState, useEffect, useMemo } from "react";
import { ArrowLeft, Grid3X3, List, Filter, Search } from "lucide-react";
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
import {
  useWatchlistStorage,
  WatchlistStatus,
} from "@/hooks/useWatchlistStorage";
import { useBookmarkStorage } from "@/hooks/useBookmarkStorage";
import { getMangasBulk } from "@/services/getMangasBulk.service";
import { Manga } from "@/services/getMangas.service";
import { getAllChapters } from "@/services/getChapters.service";

interface EnrichedWatchlistItem {
  id: string;
  title: string;
  cover: string;
  genre: string;
  rating: number;
  totalChapters: number;
  readChapters: number;
  status: WatchlistStatus;
  lastRead?: string;
}

const Watchlist = () => {
  const navigate = useNavigate();
  const { getAllWatchlist, removeFromWatchlist, updateStatus } =
    useWatchlistStorage();
  const { getMangaLocalStorage } = useBookmarkStorage();

  const [watchlist, setWatchlist] = useState<EnrichedWatchlistItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState<"grid" | "list">("list");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<string>("recently-read");

  // Load and enrich watchlist data
  useEffect(() => {
    const loadWatchlist = async () => {
      setIsLoading(true);
      try {
        const watchlistItems = getAllWatchlist();
        console.log("Watchlist items from localStorage:", watchlistItems);

        if (watchlistItems.length === 0) {
          setWatchlist([]);
          setIsLoading(false);
          return;
        }

        // Get manga details from API
        const titles = watchlistItems.map((item) => item.title);
        console.log("Fetching bulk manga data for:", titles);

        let mangasData: Manga[] = [];
        try {
          mangasData = await getMangasBulk(titles);
          console.log("API bulk response:", mangasData);
        } catch (apiError) {
          console.error(
            "API bulk failed, continuing with basic data:",
            apiError,
          );
          // Continue with empty manga data - we'll use defaults
        }

        // Create a map for quick lookup
        const mangaMap = new Map<string, Manga>();
        mangasData.forEach((manga) => {
          mangaMap.set(manga.title, manga);
        });

        // Fetch chapter counts for each manga
        const enrichedItems: EnrichedWatchlistItem[] = await Promise.all(
          watchlistItems.map(async (item) => {
            const mangaData = mangaMap.get(item.title);
            console.log(`Processing ${item.title}, mangaData:`, mangaData);
            const bookmarkData = getMangaLocalStorage(item.title);

            // Get total chapters
            let totalChapters = 0;
            try {
              const chaptersData = await getAllChapters(item.title);
              totalChapters = chaptersData?.chapters?.length || 0;
            } catch (err) {
              console.error(`Failed to fetch chapters for ${item.title}`, err);
            }

            // Calculate read chapters
            const readChapters =
              bookmarkData?.chapters.filter((ch) => ch.isFinished).length || 0;

            // Format last read date
            const lastRead = item.lastRead
              ? formatLastReadTime(item.lastRead)
              : undefined;

            return {
              id: item.title, // Use title as ID since we don't have a separate ID
              title: item.title,
              cover: mangaData?.thumbnails || "",
              genre:
                typeof mangaData?.genres?.[0] === "string"
                  ? mangaData.genres[0]
                  : mangaData?.genres?.[0]?.name || "Unknown",
              rating: mangaData?.mean || 0,
              totalChapters,
              readChapters,
              status: item.status,
              lastRead,
            };
          }),
        );

        console.log("Enriched watchlist items:", enrichedItems);
        setWatchlist(enrichedItems);
      } catch (error) {
        console.error("Failed to load watchlist:", error);
        // Still set empty watchlist to show the UI
        setWatchlist([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadWatchlist();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
          case "progress":
            return (
              b.readChapters / b.totalChapters -
              a.readChapters / a.totalChapters
            );
          default: // recently-read
            return 0;
        }
      });
  }, [watchlist, searchQuery, filterStatus, sortBy]);

  const handleRemoveFromWatchlist = (title: string) => {
    removeFromWatchlist(title);
    setWatchlist((prev) => prev.filter((item) => item.title !== title));
  };

  const handleStatusChange = (title: string, newStatus: WatchlistStatus) => {
    updateStatus(title, newStatus);
    setWatchlist((prev) =>
      prev.map((item) =>
        item.title === title ? { ...item, status: newStatus } : item,
      ),
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

      <main className='container mx-auto px-4 py-8'>
        {/* Header */}
        <div className='flex items-center gap-4 mb-8'>
          <Button
            variant='ghost'
            size='sm'
            onClick={() => navigate("/")}
            className='hover:bg-manga-card'
          >
            <ArrowLeft className='w-4 h-4 mr-2' />
            Back to Home
          </Button>
          <h1 className='text-3xl font-bold text-foreground'>My Watchlist</h1>
          <Badge variant='secondary' className='ml-auto'>
            {watchlist.length} manga
          </Badge>
        </div>

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
            <div className='text-sm text-muted-foreground'>Terminé</div>
          </div>
          <div className='bg-manga-card rounded-lg p-4 border border-border'>
            <div className='text-2xl font-bold text-yellow-400'>
              {getStatusCount("À lire")}
            </div>
            <div className='text-sm text-muted-foreground'>À lire</div>
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

          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className='w-40 bg-manga-card border-border'>
              <Filter className='w-4 h-4 mr-2' />
              <SelectValue placeholder='Filtrer par statut' />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='all'>Tous les statuts</SelectItem>
              <SelectItem value='En cours'>En cours</SelectItem>
              <SelectItem value='Terminé'>Terminé</SelectItem>
              <SelectItem value='À lire'>À lire</SelectItem>
              <SelectItem value='En pause'>En pause</SelectItem>
            </SelectContent>
          </Select>

          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className='w-40 bg-manga-card border-border'>
              <SelectValue placeholder='Sort by' />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='recently-read'>Recently Read</SelectItem>
              <SelectItem value='title'>Title A-Z</SelectItem>
              <SelectItem value='rating'>Rating</SelectItem>
              <SelectItem value='progress'>Progress</SelectItem>
            </SelectContent>
          </Select>

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
                ? "No manga found"
                : "Your watchlist is empty"}
            </h2>
            <p className='text-muted-foreground mb-6'>
              {searchQuery || filterStatus !== "all"
                ? "Essayez d'ajuster vos critères de recherche ou de filtre"
                : "Vous n'avez pas encore ajouté de mangas à votre watchlist"}
            </p>
            {!searchQuery && filterStatus === "all" && (
              <Button
                onClick={() => navigate("/")}
                className='bg-primary hover:bg-primary/90'
              >
                Browse Manga
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
