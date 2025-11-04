import { useEffect, useState, useMemo, useCallback } from 'react'
import { getMangaSupabase } from '@/services/getMangas.service'
import MangaCard from './MangaCard'
import { useNavigate } from 'react-router-dom'

interface Manga {
  id: number
  title: string
  description: string | null
  thumbnails: string | null
  linkManga: string | null
  color: string | null
  site: string | null
  created_at: string | null
}

interface MangaGridProps {
  title: string
  showAll?: boolean
  searchedTitle?: string
  onMangasLoaded?: (count: number) => void
}

const SKELETON_COUNT = 6
const DEFAULT_DISPLAY_LIMIT = 6

const MangaGrid = ({ title, showAll = false, searchedTitle, onMangasLoaded }: MangaGridProps) => {
  const navigate = useNavigate()

  const [allMangas, setAllMangas] = useState<Manga[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let isMounted = true

    const fetchMangas = async () => {
      try {
        setIsLoading(true)
        setError(null)

        const data = await getMangaSupabase()

        if (isMounted) {
          setAllMangas(data)
        }
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err.message : 'Failed to load mangas')
        }
      } finally {
        if (isMounted) {
          setIsLoading(false)
        }
      }
    }

    fetchMangas()

    return () => {
      isMounted = false
    }
  }, [])

  const filteredMangas = useMemo(() => {
    if (!searchedTitle) return allMangas

    const searchLower = searchedTitle.toLowerCase()
    return allMangas.filter((manga) => manga.title.toLowerCase().includes(searchLower))
  }, [allMangas, searchedTitle])

  const displayedMangas = useMemo(() => {
    return showAll ? filteredMangas : filteredMangas.slice(0, DEFAULT_DISPLAY_LIMIT)
  }, [filteredMangas, showAll])

  // Callback pour notifier le parent du nombre de mangas filtrés
  useEffect(() => {
    if (onMangasLoaded && !isLoading) {
      onMangasLoaded(filteredMangas.length)
    }
  }, [filteredMangas.length, isLoading, onMangasLoaded])

  const handleViewAll = useCallback(() => {
    navigate('/all-manga')
  }, [navigate])

  if (isLoading) {
    return (
      <section className="mb-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-foreground">{title}</h2>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
          {Array.from({ length: SKELETON_COUNT }).map((_, i) => (
            <div key={i} className="bg-muted animate-pulse rounded-lg aspect-[3/4]" />
          ))}
        </div>
      </section>
    )
  }

  if (error) {
    return (
      <section className="mb-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-foreground">{title}</h2>
        </div>
        <div className="text-center py-8">
          <p className="text-muted-foreground">Failed to load manga. Please try again later.</p>
        </div>
      </section>
    )
  }

  const showViewAllButton = !showAll && filteredMangas.length > DEFAULT_DISPLAY_LIMIT

  return (
    <section className="mb-12">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-foreground">{title}</h2>
        {showViewAllButton && (
          <button
            className="text-primary hover:text-primary/80 font-medium"
            onClick={handleViewAll}
          >
            Tout voir →
          </button>
        )}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
        {displayedMangas.map((manga) => (
          <MangaCard
            key={manga.id}
            id={manga.id.toString()}
            title={manga.title}
            cover={manga.thumbnails || '/placeholder.svg'}
            genre={manga.site || 'Unknown'}
            rating={4.5}
            chapters={[]}
            status="En cours"
            description={manga.description || ''}
          />
        ))}
      </div>

      {displayedMangas.length === 0 && (
        <div className="text-center py-8">
          <p className="text-muted-foreground">No manga available yet.</p>
        </div>
      )}
    </section>
  )
}

export default MangaGrid
