import { Toaster } from '@/components/ui/toaster'
import { Toaster as Sonner } from '@/components/ui/sonner'
import { TooltipProvider } from '@/components/ui/tooltip'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { PWAUpdatePrompt } from '@/components/PWAUpdatePrompt'
import Index from './pages/Index'
import Watchlist from './pages/Watchlist'
import MangaChapters from './pages/MangaChapters'
import ChapterReader from './pages/ChapterReader'
import Account from './pages/Account'
import Popular from './pages/Popular'
import Latest from './pages/Latest'
import Genres from './pages/Genres'
import TopRated from './pages/TopRated'
import AllManga from './pages/AllManga'
import NotFound from './pages/NotFound'

const queryClient = new QueryClient()

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <PWAUpdatePrompt />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/watchlist" element={<Watchlist />} />
          <Route path="/account" element={<Account />} />
          <Route path="/popular" element={<Popular />} />
          <Route path="/latest" element={<Latest />} />
          <Route path="/genres" element={<Genres />} />
          <Route path="/top-rated" element={<TopRated />} />
          <Route path="/all-manga" element={<AllManga />} />
          <Route path="/manga/:title" element={<MangaChapters />} />
          <Route path="/manga/:title/chapter/:id" element={<ChapterReader />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
)

export default App
