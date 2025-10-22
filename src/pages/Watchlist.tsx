import { useState } from 'react'
import { ArrowLeft, Grid3X3, List, Filter, Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import MangaNavigation from '@/components/MangaNavigation'
import WatchlistCard from '@/components/WatchlistCard'
import { useNavigate } from 'react-router-dom'
import mangaCover1 from '@/assets/manga-cover-1.jpg'
import mangaCover2 from '@/assets/manga-cover-2.jpg'
import mangaCover3 from '@/assets/manga-cover-3.jpg'
import mangaCover4 from '@/assets/manga-cover-4.jpg'
import mangaCover5 from '@/assets/manga-cover-5.jpg'
import mangaCover6 from '@/assets/manga-cover-6.jpg'

const mockWatchlist = [
  {
    id: '1',
    title: "Dragon's Fury: The Last Samurai",
    cover: mangaCover1,
    genre: 'Action',
    rating: 4.8,
    totalChapters: 156,
    readChapters: 89,
    status: 'Reading' as const,
    lastRead: '2 days ago',
  },
  {
    id: '2',
    title: 'Magical Academy Chronicles',
    cover: mangaCover2,
    genre: 'Fantasy',
    rating: 4.6,
    totalChapters: 89,
    readChapters: 89,
    status: 'Completed' as const,
    lastRead: '1 week ago',
  },
  {
    id: '3',
    title: 'Shadows of the Gothic Tower',
    cover: mangaCover3,
    genre: 'Horror',
    rating: 4.7,
    totalChapters: 234,
    readChapters: 45,
    status: 'Reading' as const,
    lastRead: '3 days ago',
  },
  {
    id: '4',
    title: 'Spring Hearts Academy',
    cover: mangaCover4,
    genre: 'Romance',
    rating: 4.5,
    totalChapters: 67,
    readChapters: 0,
    status: 'Plan to Read' as const,
  },
  {
    id: '5',
    title: 'Neon Genesis: Future War',
    cover: mangaCover5,
    genre: 'Sci-Fi',
    rating: 4.9,
    totalChapters: 178,
    readChapters: 25,
    status: 'On Hold' as const,
    lastRead: '2 weeks ago',
  },
  {
    id: '6',
    title: 'Phantom Woods: Dark Legends',
    cover: mangaCover6,
    genre: 'Supernatural',
    rating: 4.4,
    totalChapters: 145,
    readChapters: 12,
    status: 'Reading' as const,
    lastRead: '5 days ago',
  },
]

const Watchlist = () => {
  const navigate = useNavigate()
  const [watchlist, setWatchlist] = useState(mockWatchlist)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list')
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState<string>('recently-read')

  const filteredWatchlist = watchlist
    .filter((item) => {
      const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesStatus = filterStatus === 'all' || item.status === filterStatus
      return matchesSearch && matchesStatus
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'title':
          return a.title.localeCompare(b.title)
        case 'rating':
          return b.rating - a.rating
        case 'progress':
          return b.readChapters / b.totalChapters - a.readChapters / a.totalChapters
        default:
          return 0
      }
    })

  const handleRemoveFromWatchlist = (id: string) => {
    setWatchlist((prev) => prev.filter((item) => item.id !== id))
  }

  const handleContinueReading = (id: string) => {
    console.log('Continue reading:', id)
    // Navigate to reading page
  }

  const getStatusCount = (status: string) => {
    return watchlist.filter((item) => item.status === status).length
  }

  return (
    <div className="min-h-screen bg-background">
      <MangaNavigation />

      <main className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/')}
            className="hover:bg-manga-card"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Button>
          <h1 className="text-3xl font-bold text-foreground">My Watchlist</h1>
          <Badge variant="secondary" className="ml-auto">
            {watchlist.length} manga
          </Badge>
        </div>

        {/* Status Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-manga-card rounded-lg p-4 border border-border">
            <div className="text-2xl font-bold text-green-400">{getStatusCount('Reading')}</div>
            <div className="text-sm text-muted-foreground">Reading</div>
          </div>
          <div className="bg-manga-card rounded-lg p-4 border border-border">
            <div className="text-2xl font-bold text-blue-400">{getStatusCount('Completed')}</div>
            <div className="text-sm text-muted-foreground">Completed</div>
          </div>
          <div className="bg-manga-card rounded-lg p-4 border border-border">
            <div className="text-2xl font-bold text-yellow-400">
              {getStatusCount('Plan to Read')}
            </div>
            <div className="text-sm text-muted-foreground">Plan to Read</div>
          </div>
          <div className="bg-manga-card rounded-lg p-4 border border-border">
            <div className="text-2xl font-bold text-gray-400">{getStatusCount('On Hold')}</div>
            <div className="text-sm text-muted-foreground">On Hold</div>
          </div>
        </div>

        {/* Controls */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Chercher dans votre watchlist..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-manga-card border-border focus:border-primary"
            />
          </div>

          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-40 bg-manga-card border-border">
              <Filter className="w-4 h-4 mr-2" />
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="Reading">Reading</SelectItem>
              <SelectItem value="Completed">Completed</SelectItem>
              <SelectItem value="Plan to Read">Plan to Read</SelectItem>
              <SelectItem value="On Hold">On Hold</SelectItem>
            </SelectContent>
          </Select>

          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-40 bg-manga-card border-border">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="recently-read">Recently Read</SelectItem>
              <SelectItem value="title">Title A-Z</SelectItem>
              <SelectItem value="rating">Rating</SelectItem>
              <SelectItem value="progress">Progress</SelectItem>
            </SelectContent>
          </Select>

          <div className="flex bg-manga-card rounded-lg border border-border">
            <Button
              variant={viewMode === 'list' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('list')}
              className="rounded-r-none"
            >
              <List className="w-4 h-4" />
            </Button>
            <Button
              variant={viewMode === 'grid' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('grid')}
              className="rounded-l-none"
            >
              <Grid3X3 className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Watchlist Content */}
        {filteredWatchlist.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">📚</div>
            <h2 className="text-2xl font-bold text-foreground mb-2">
              {searchQuery || filterStatus !== 'all' ? 'No manga found' : 'Your watchlist is empty'}
            </h2>
            <p className="text-muted-foreground mb-6">
              {searchQuery || filterStatus !== 'all'
                ? "Essayez d'ajuster vos critères de recherche ou de filtre"
                : "Vous n'avez pas encore ajouté de mangas à votre watchlist"}
            </p>
            {!searchQuery && filterStatus === 'all' && (
              <Button onClick={() => navigate('/')} className="bg-primary hover:bg-primary/90">
                Browse Manga
              </Button>
            )}
          </div>
        ) : (
          <div
            className={
              viewMode === 'grid'
                ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'
                : 'space-y-4'
            }
          >
            {filteredWatchlist.map((manga) => (
              <WatchlistCard
                key={manga.id}
                {...manga}
                onRemove={() => handleRemoveFromWatchlist(manga.id)}
                onContinueReading={() => handleContinueReading(manga.id)}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  )
}

export default Watchlist
