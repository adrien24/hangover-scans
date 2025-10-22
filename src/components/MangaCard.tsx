import { Star, Play, Bookmark } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

interface MangaCardProps {
  id: string
  title: string
  cover: string
  genre: string
  rating: number
  chapters: number
  status: 'En cours' | 'Completed'
  description: string
}

const MangaCard = ({
  id,
  title,
  cover,
  genre,
  rating,
  chapters,
  status,
  description,
}: MangaCardProps) => {
  return (
    <Card className="group relative overflow-hidden bg-manga-card border-border hover:bg-manga-card-hover transition-all duration-300 hover:scale-105 hover:shadow-xl">
      {/* Cover Image */}
      <div className="relative aspect-[3/4] overflow-hidden">
        <img
          src={cover}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
        />

        {/* Overlay on hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="absolute bottom-4 left-4 right-4">
            <p className="text-white text-sm line-clamp-3 mb-3">{description}</p>
            <div className="flex space-x-2">
              <Link to={`/manga/${title}`}>
                <Button
                  size="sm"
                  className="bg-primary hover:bg-primary/90 text-primary-foreground"
                >
                  <Play className="w-4 h-4 mr-1" />
                  Lire
                </Button>
              </Link>
              <Button
                size="sm"
                variant="secondary"
                className="bg-white/20 hover:bg-white/30 text-white border-white/20"
              >
                <Bookmark className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Status badge */}
        <Badge
          className={`absolute top-2 right-2 ${
            status === 'En cours'
              ? 'bg-green-600 hover:bg-green-600'
              : 'bg-blue-600 hover:bg-blue-600'
          } text-white`}
        >
          {status}
        </Badge>
      </div>

      {/* Card Content */}
      <div className="p-4">
        <h3 className="font-semibold text-foreground mb-2 line-clamp-2 group-hover:text-primary transition-colors">
          {title}
        </h3>

        <div className="flex items-center justify-between text-sm text-muted-foreground mb-2">
          <span className="bg-primary/10 text-primary px-2 py-1 rounded-md text-xs">{genre}</span>
          <span>{chapters} chapters</span>
        </div>

        <div className="flex items-center space-x-1">
          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
          <span className="text-sm font-medium text-foreground">{rating}</span>
        </div>
      </div>
    </Card>
  )
}

export default MangaCard
