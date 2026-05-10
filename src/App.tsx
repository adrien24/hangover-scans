import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { PWAUpdatePrompt } from "@/components/PWAUpdatePrompt";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { UserdataBootstrap } from "@/components/UserdataBootstrap";
import Index from "./pages/Index";
import Watchlist from "./pages/Watchlist";
import MangaChapters from "./pages/MangaChapters";
import ChapterReader from "./pages/ChapterReader";
import Account from "./pages/Account";
import Popular from "./pages/Popular";
import Latest from "./pages/Latest";
import Genres from "./pages/Genres";
import TopRated from "./pages/TopRated";
import AllManga from "./pages/AllManga";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ResetPassword from "./pages/ResetPassword";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000,
      gcTime: 30 * 60 * 1000,
      refetchOnMount: false,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
      retry: 1,
    },
  },
});

const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <PWAUpdatePrompt />
      <BrowserRouter>
        <ScrollToTop />
        <AuthProvider>
          <UserdataBootstrap />
          <Routes>
            <Route path='/login' element={<Login />} />
            <Route path='/signup' element={<Signup />} />
            <Route path='/reset-password' element={<ResetPassword />} />
            <Route path='/' element={<ProtectedRoute><Index /></ProtectedRoute>} />
            <Route path='/watchlist' element={<ProtectedRoute><Watchlist /></ProtectedRoute>} />
            <Route path='/account' element={<ProtectedRoute><Account /></ProtectedRoute>} />
            <Route path='/popular' element={<ProtectedRoute><Popular /></ProtectedRoute>} />
            <Route path='/latest' element={<ProtectedRoute><Latest /></ProtectedRoute>} />
            <Route path='/genres' element={<ProtectedRoute><Genres /></ProtectedRoute>} />
            <Route path='/top-rated' element={<ProtectedRoute><TopRated /></ProtectedRoute>} />
            <Route path='/all-manga' element={<ProtectedRoute><AllManga /></ProtectedRoute>} />
            <Route path='/manga/:title' element={<ProtectedRoute><MangaChapters /></ProtectedRoute>} />
            <Route path='/manga/:title/chapter/:id' element={<ProtectedRoute><ChapterReader /></ProtectedRoute>} />
            <Route path='*' element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
