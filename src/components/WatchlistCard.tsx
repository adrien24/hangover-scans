import { Star, Play, Trash2, Clock, CheckCircle } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'

interface WatchlistCardProps {
  title: string
  cover: string
  genre: string
  rating: number
  totalChapters: number
  readChapters: number
  status: 'Reading' | 'Completed' | 'Plan to Read' | 'On Hold'
  lastRead?: string
  onRemove: () => void
  onContinueReading: () => void
}

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
  onContinueReading,
}: WatchlistCardProps) => {
  const progressPercentage = (readChapters / totalChapters) * 100

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Reading':
        return 'bg-green-600 hover:bg-green-600'
      case 'Completed':
        return 'bg-blue-600 hover:bg-blue-600'
      case 'Plan to Read':
        return 'bg-yellow-600 hover:bg-yellow-600'
      case 'On Hold':
        return 'bg-gray-600 hover:bg-gray-600'
      default:
        return 'bg-gray-600 hover:bg-gray-600'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Reading':
        return <Play className="w-3 h-3" />
      case 'Completed':
        return <CheckCircle className="w-3 h-3" />
      case 'Plan to Read':
        return <Clock className="w-3 h-3" />
      case 'On Hold':
        return <Clock className="w-3 h-3" />
      default:
        return <Clock className="w-3 h-3" />
    }
  }

  return (
    <Card className="group relative overflow-hidden bg-manga-card border-border hover:bg-manga-card-hover transition-all duration-300">
      <div className="flex">
        {/* Cover Image */}
        <div className="relative w-24 sm:w-32 aspect-[3/4] overflow-hidden flex-shrink-0">
          <img src={cover} alt={title} className="w-full h-full object-cover" />

          {/* Status badge */}
          <Badge
            className={`absolute top-2 left-2 text-white text-xs flex items-center gap-1 ${getStatusColor(
              status
            )}`}
          >
            {getStatusIcon(status)}
            <span className="hidden sm:inline">{status}</span>
          </Badge>
        </div>

        {/* Content */}
        <div className="flex-1 p-4 flex flex-col justify-between">
          <div>
            <div className="flex items-start justify-between mb-2">
              <h3 className="font-semibold text-foreground line-clamp-2 flex-1 pr-2">{title}</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={onRemove}
                className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 flex-shrink-0"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>

            <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
              <span className="bg-primary/10 text-primary px-2 py-1 rounded-md text-xs">
                {genre}
              </span>
              <div className="flex items-center space-x-1">
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                <span className="font-medium text-foreground">{rating}</span>
              </div>
            </div>

            {/* Progress */}
            <div className="mb-3">
              <div className="flex items-center justify-between text-sm mb-1">
                <span className="text-muted-foreground">Progress</span>
                <span className="text-foreground font-medium">
                  {readChapters}/{totalChapters}
                </span>
              </div>
              <Progress value={progressPercentage} className="h-2" />
              <div className="text-xs text-muted-foreground mt-1">
                {Math.round(progressPercentage)}% completed
              </div>
            </div>

            {lastRead && (
              <p className="text-xs text-muted-foreground mb-3">Dernière lecture: {lastRead}</p>
            )}
          </div>

          <div className="flex gap-2">
            <Button
              size="sm"
              onClick={onContinueReading}
              className="bg-primary hover:bg-primary/90 text-primary-foreground flex-1"
            >
              <Play className="w-4 h-4 mr-1" />
              {status === 'Plan to Read' ? 'Commencer à lire' : 'Continuer'}
            </Button>
          </div>
        </div>
      </div>
    </Card>
  )
}

export default WatchlistCard
