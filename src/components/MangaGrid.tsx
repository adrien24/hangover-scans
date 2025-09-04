import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import MangaCard from "./MangaCard";

interface Manga {
  id: number;
  title: string;
  description: string | null;
  thumbnails: string | null;
  linkManga: string | null;
  color: any;
  site: string | null;
  created_at: string;
}

interface MangaGridProps {
  title: string;
  showAll?: boolean;
}

const MangaGrid = ({ title, showAll = false }: MangaGridProps) => {
  const { data: mangas = [], isLoading, error } = useQuery({
    queryKey: ['mangas'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('Mangas')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as Manga[];
    }
  });

  const { data: scansCount } = useQuery({
    queryKey: ['scans-count'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('Scans')
        .select('id, scan_id')
        .order('scan_id');
      
      if (error) throw error;
      
      // Count chapters per manga (assuming scan_id relates to manga id)
      const counts: Record<string, number> = {};
      data?.forEach(scan => {
        if (scan.scan_id) {
          counts[scan.scan_id] = (counts[scan.scan_id] || 0) + 1;
        }
      });
      return counts;
    }
  });

  const displayManga = showAll ? mangas : mangas.slice(0, 6);

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
    );
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
    );
  }

  return (
    <section className="mb-12">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-foreground">{title}</h2>
        {!showAll && mangas.length > 6 && (
          <button className="text-primary hover:text-primary/80 font-medium">
            View All →
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
            status="Ongoing" // Default status since not in DB
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
  );
};

export default MangaGrid;