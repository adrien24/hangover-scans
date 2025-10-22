import { useEffect, useState } from 'react'
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
}

const MangaGrid = ({ title, showAll = false }: MangaGridProps) => {
  const navigate = useNavigate()

  // state: list of mangas retrieved from Supabase
  const [getAllMangas, setGetAllMangas] = useState<Manga[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  // Mock chapter counts for each manga
  const scansCount: Record<string, number> = {
    '1': 139,
    '2': 1100,
    '3': 230,
    '4': 400,
    '5': 250,
    '6': 180,
    '7': 179,
    '8': 700,
  }

  useEffect(() => {
    let mounted = true

    const fetchMangas = async () => {
      setIsLoading(true)
      setError(null)
      try {
        const data = await getMangaSupabase()
        if (mounted) {
          setGetAllMangas(Array.isArray(data) ? data : [])
        }
      } catch (e) {
        if (mounted) {
          setError((e as Error)?.message ?? 'Failed to load mangas')
        }
      } finally {
        if (mounted) {
          setIsLoading(false)
        }
      }
    }

    fetchMangas()

    return () => {
      mounted = false
    }
  }, [])

  const displayManga = showAll ? getAllMangas : getAllMangas.slice(0, 6)

  if (isLoading) {
    return (
      <section className="mb-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-foreground">{title}</h2>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
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

  return (
    <section className="mb-12">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-foreground">{title}</h2>
        {!showAll && getAllMangas.length > 6 && (
          <button
            className="text-primary hover:text-primary/80 font-medium"
            onClick={() => navigate('/all-manga')}
          >
            Tout voir →
          </button>
        )}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
        {displayManga.map((manga) => (
          <MangaCard
            key={manga.id}
            id={manga.id.toString()}
            title={manga.title}
            cover={manga.thumbnails || '/placeholder.svg'}
            genre={manga.site || 'Unknown'}
            rating={4.5} // Default rating since not in DB
            chapters={scansCount?.[manga.id.toString()] || 0}
            status="En cours" // Default status since not in DB
            description={manga.description || ''}
          />
        ))}
      </div>

      {displayManga.length === 0 && (
        <div className="text-center py-8">
          <p className="text-muted-foreground">No manga available yet.</p>
        </div>
      )}
    </section>
  )
}

export default MangaGrid
