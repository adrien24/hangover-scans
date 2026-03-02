import { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  Search,
  BookOpen,
  CheckCircle,
  AArrowDown,
  AArrowUp,
} from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { getAllChapters } from "@/services/getChapters.service";
import { useBookmarkStorage } from "@/hooks/useBookmarkStorage";
import { enumStatus } from "@/components/MangaGrid";
import { getMangaByTitle } from "@/services/getMangas.service";
import { Manga } from "@/services/getMangas.service";
import { WatchlistButton } from "@/components/WatchlistButton";

interface Chapter {
  name: string;
  id: number;
  images: Array<string>;
}

export interface MangaChapter {
  count: number;
  manga: string | null;
  status: string | null;
  chapters: Array<Chapter>;
  thumbnails: string;
}

const MangaChapters = () => {
  const { title } = useParams();
  const [searchTerm, setSearchTerm] = useState("");
  const [mangaChapters, setMangaChapters] = useState<MangaChapter>(null);
  const [allChapters, setAllChapters] = useState<Chapter[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isDescending, setIsDescending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [manga, setMangaInfo] = useState<Manga>(null);
  const [chapterToContinue, setChapterToContinue] = useState<number | null>(
    null,
  );
  const [sortAsc, setSortAsc] = useState(false);
  const { getChapter, getMangaLocalStorage, isChapterFinished } =
    useBookmarkStorage();

  useEffect(() => {
    let mounted = true;

    const fetchData = async () => {
      if (!title) return;
      setIsLoading(true);
      setError(null);
      try {
        const MangaChapters = await getAllChapters(title);
        const MangaInfo = await getMangaByTitle(title);
        setMangaInfo(MangaInfo);

        if (mounted) {
          setMangaChapters(MangaChapters ?? null);
          setAllChapters(MangaChapters?.chapters ?? []);

          const bookmarkedManga = getMangaLocalStorage(title);
          if (bookmarkedManga && bookmarkedManga.chapters.length > 0) {
            const lastRead = bookmarkedManga.chapters.reduce((prev, curr) =>
              curr.lastUpdated > prev.lastUpdated ? curr : prev,
            );
            if (lastRead.isFinished) {
              const apiChapters = MangaChapters?.chapters ?? [];
              const nextChapter = apiChapters
                .filter((c) => c.id > lastRead.id)
                .sort((a, b) => a.id - b.id)[0];
              setChapterToContinue(nextChapter ? nextChapter.id : lastRead.id);
            } else {
              setChapterToContinue(lastRead.id);
            }
          }
        }
      } catch (err: unknown) {
        if (mounted) setError(err instanceof Error ? err.message : String(err));
      } finally {
        if (mounted) setIsLoading(false);
      }
    };

    fetchData();

    return () => {
      mounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [title]);

  const filteredChapters = useMemo(
    () =>
      allChapters
        .filter(
          (chapter) =>
            chapter.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            `Chapter ${chapter.name}`
              .toLowerCase()
              .includes(searchTerm.toLowerCase()),
        )
        .sort((a, b) => (sortAsc ? a.id - b.id : b.id - a.id)),
    [allChapters, searchTerm, sortAsc],
  );

  if (isLoading) {
    return (
      <div className='min-h-screen bg-background flex items-center justify-center'>
        <div className='text-center'>
          <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4'></div>
          <p className='text-muted-foreground'>Loading...</p>
        </div>
      </div>
    );
  }
  if (!mangaChapters) return;

  const sortingFilter = () => setSortAsc((prev) => !prev);

  return (
    <div className='min-h-screen bg-background'>
      {/* Header */}
      <div className='sticky top-0 z-50 bg-background/80 backdrop-blur-sm border-b border-border'>
        <div className='container mx-auto px-4 py-4'>
          <div className='flex items-center gap-4 justify-between'>
            <Link to='/'>
              <Button variant='outline' size='sm' className='py-6 px-4'>
                <ArrowLeft className='w-4 h-4 mr-2' />
                Retour
              </Button>
            </Link>
            {title && (
              <WatchlistButton
                mangaTitle={title}
                variant='icon'
                size='icon'
              />
            )}
          </div>
        </div>
      </div>
      <div className='container mx-auto px-4 pt-6'>
        <div>
          <div className='mb-3'>
            <h1 className='text-xl font-bold text-foreground'>{title}</h1>
          </div>
          <div className='flex items-center gap-2 text-sm text-muted-foreground mb-3'>
            <BookOpen className='w-4 h-4 ' />
            {mangaChapters.chapters?.length} chapitres
            <Badge variant='secondary'>
              {enumStatus(mangaChapters.status)}
            </Badge>
          </div>
        </div>
        <p className='text-sm text-muted-foreground line-clamp-3'>
          {manga?.description}
        </p>
      </div>
      <div className='container mx-auto px-4 pt-6'>
        <Button
          variant='default'
          size='sm'
          onClick={() => {
            if (chapterToContinue !== null) {
              window.location.href = `/manga/${title}/chapter/${chapterToContinue}`;
            } else if (allChapters.length > 0) {
              window.location.href = `/manga/${title}/chapter/${allChapters[0].id}`;
            }
          }}
        >
          {chapterToContinue !== null
            ? `Continuer la lecture : chp. ${chapterToContinue}`
            : "Commencer la lecture"}
        </Button>
      </div>
      <div className='container mx-auto px-4 py-6'>
        {/* Search Bar */}
        <div className='flex gap-4'>
          <div className='mb-6'>
            <div className='relative max-w-md'>
              <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4' />
              <Input
                placeholder='Chercher un chapitre...'
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className='pl-10'
              />
            </div>
          </div>
          <Button
            size='icon'
            variant='secondary'
            onClick={() => {
              sortingFilter();
              setIsDescending(!isDescending);
            }}
          >
            {isDescending ? <AArrowUp /> : <AArrowDown />}
          </Button>
        </div>

        {/* Chapters List */}
        <div className='space-y-2'>
          {filteredChapters.map((chapter) => {
            const pageCount = chapter.images
              ? Array.isArray(chapter.images)
                ? chapter.images.length
                : Object.keys(chapter.images).length
              : 0;

            const isFinished = isChapterFinished(title, chapter.id);
            const chapterBookmark = getChapter(title, chapter.id);

            const getButtonDisplay = () => {
              if (!chapterBookmark) {
                return { text: "Lire", icon: null, variant: "default" };
              }

              if (isFinished) {
                return {
                  text: "fini",
                  icon: CheckCircle,
                  variant: "secondary",
                };
              }

              return { text: "Continuer", icon: null, variant: "default" };
            };

            const buttonDisplay = getButtonDisplay();

            return (
              <Card
                key={chapter.id}
                className='hover:bg-muted/50 transition-colors'
              >
                <div className='p-4'>
                  <div className='flex items-center justify-between gap-4'>
                    <div className='flex items-center gap-4 flex-1 min-w-0'>
                      <div className='text-sm text-muted-foreground font-mono min-w-[3rem]'>
                        # {chapter.id}
                      </div>
                      <div className='flex-1 min-w-0'>
                        <h3 className='font-medium text-foreground mb-1 truncate'>
                          {chapter.name || `Chapter ${chapter.id}`}
                        </h3>
                        <div className='flex items-center gap-4 text-sm text-muted-foreground'>
                          <span className='flex items-center gap-1'>
                            <BookOpen className='w-3 h-3' />
                            {pageCount} pages
                          </span>
                          <span className='flex items-center gap-1'></span>
                        </div>
                      </div>
                    </div>

                    <div className='flex items-center gap-2'>
                      <Link to={`/manga/${title}/chapter/${chapter.id}`}>
                        <Button
                          size='sm'
                          className={`${
                            buttonDisplay.variant === "default"
                              ? "bg-primary hover:bg-primary/90"
                              : "bg-green-600 hover:bg-green-700"
                          }`}
                        >
                          {buttonDisplay.icon && (
                            <buttonDisplay.icon className='w-4 h-4 mr-1' />
                          )}
                          {buttonDisplay.text}
                        </Button>
                      </Link>
                      {/* <Button size="sm" variant="ghost">
                        <Download className="w-4 h-4" />
                      </Button> */}
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        {filteredChapters.length === 0 && (
          <div className='text-center py-12'>
            <p className='text-muted-foreground'>
              Aucun chapitres trouvé avec cette recherche.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MangaChapters;
