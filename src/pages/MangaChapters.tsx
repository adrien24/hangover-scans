import { useEffect, useState } from 'react'
import { ArrowLeft, Search, BookOpen, Clock, Download, CheckCircle } from 'lucide-react'
import { Link, useParams } from 'react-router-dom'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { getAllChapters } from '@/services/getChapters.service'
import { useBookmarkStorage } from '@/hooks/useBookmarkStorage'

interface Manga {
  id: number
  title: string
  description: string | null
  thumbnails: string | null
}

interface Scan {
  id: number
  title: string | null
  description: string | null
  images: Array<string>
  date: string
  chapter: number
  scan_id: string | null
}

const MangaChapters = () => {
  const { title } = useParams()
  const [searchTerm, setSearchTerm] = useState('')
  const [manga, setManga] = useState<Manga | null>(null)
  const [chapters, setChapters] = useState<Scan[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { getChapter, isChapterFinished } = useBookmarkStorage()
  // fetch manga metadata and chapters from services
  // We'll import the existing getMangaSupabase and the new getChaptersSupabase

  useEffect(() => {
    let mounted = true

    const fetchData = async () => {
      if (!title) return
      setIsLoading(true)
      setError(null)
      try {
        // fetch manga metadata
        const mangas = await getAllChapters(title)

        // getMangaSupabase returns an array or object depending on backend; try to handle common shapes
        const foundManga = Array.isArray(mangas) ? mangas[0] : mangas
        if (mounted) setManga(foundManga ?? null)

        // fetch chapters
        const fetchedChapters = await getAllChapters(title)

        if (mounted) setChapters(fetchedChapters || [])
      } catch (err: unknown) {
        console.error('Failed to load manga chapters', err)
        if (mounted) setError(err instanceof Error ? err.message : String(err))
      } finally {
        if (mounted) setIsLoading(false)
      }
    }

    fetchData()

    return () => {
      mounted = false
    }
  }, [title])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  if (!manga) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">Manga not found</h1>
          <Link to="/">
            <Button>Return to Home</Button>
          </Link>
        </div>
      </div>
    )
  }

  const filteredChapters = chapters
    .filter(
      (chapter) =>
        chapter.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        `Chapter ${chapter.chapter}`.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => b.chapter - a.chapter)

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-background/80 backdrop-blur-sm border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Link to="/">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
            </Link>
            <div className="flex items-center gap-4 flex-1">
              {/* <img
                src={manga.thumbnails || '/placeholder.svg'}
                alt={manga.title}
                className="w-12 h-16 object-cover rounded"
              /> */}
              <div>
                <h1 className="text-xl font-bold text-foreground">{title}</h1>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <BookOpen className="w-4 h-4" />
                  {chapters.length} chapitres
                  <Badge variant="secondary">En cours</Badge>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Chercher un chapitre..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Chapters List */}
        <div className="space-y-2">
          {filteredChapters.map((chapter) => {
            const pageCount = chapter.images
              ? Array.isArray(chapter.images)
                ? chapter.images.length
                : Object.keys(chapter.images).length
              : 0

            const isFinished = isChapterFinished(title, chapter.chapter)
            const chapterBookmark = getChapter(title, chapter.chapter)

            const getButtonDisplay = () => {
              if (!chapterBookmark) {
                return { text: 'Lire', icon: null, variant: 'default' }
              }

              if (isFinished) {
                return { text: 'fini', icon: CheckCircle, variant: 'secondary' }
              }

              return { text: 'Continuer', icon: null, variant: 'default' }
            }

            const buttonDisplay = getButtonDisplay()

            return (
              <Card key={chapter.id} className="hover:bg-muted/50 transition-colors">
                <div className="p-4">
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-4 flex-1 min-w-0">
                      <div className="text-sm text-muted-foreground font-mono min-w-[3rem]">
                        #{chapter.chapter}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-foreground mb-1 truncate">
                          {chapter.title || `Chapter ${chapter.chapter}`}
                        </h3>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            {/* <BookOpen className="w-3 h-3" /> */}
                            {/* {pageCount} pages */}
                          </span>
                          <span className="flex items-center gap-1">
                            {/* <Clock className="w-3 h-3" /> */}
                            {chapter.date}
                          </span>
                        </div>
                        {chapter.description && (
                          <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                            {chapter.description}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Link to={`/manga/${title}/chapter/${chapter.chapter}`}>
                        <Button
                          size="sm"
                          className={`${
                            buttonDisplay.variant === 'default'
                              ? 'bg-primary hover:bg-primary/90'
                              : 'bg-green-600 hover:bg-green-700'
                          }`}
                        >
                          {buttonDisplay.icon && <buttonDisplay.icon className="w-4 h-4 mr-1" />}
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
            )
          })}
        </div>

        {filteredChapters.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Aucun chapitres trouvé avec cette recherche.</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default MangaChapters
