import MangaCard from "./MangaCard";
import { useNavigate } from "react-router-dom";

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
  const navigate = useNavigate();
  // Mock manga data
  const mangas: Manga[] = [
    {
      id: 1,
      title: "Attack on Titan",
      description: "Humanity fights for survival against giant humanoid Titans that have brought civilization to the brink of extinction.",
      thumbnails: "/src/assets/manga-cover-1.jpg",
      linkManga: null,
      color: null,
      site: "Manga Plus",
      created_at: "2024-01-15"
    },
    {
      id: 2,
      title: "One Piece",
      description: "Follow Monkey D. Luffy on his quest to become the Pirate King and find the legendary treasure One Piece.",
      thumbnails: "/src/assets/manga-cover-2.jpg",
      linkManga: null,
      color: null,
      site: "Weekly Shonen Jump",
      created_at: "2024-01-14"
    },
    {
      id: 3,
      title: "Demon Slayer",
      description: "Tanjiro Kamado becomes a demon slayer to save his sister and avenge his family.",
      thumbnails: "/src/assets/manga-cover-3.jpg",
      linkManga: null,
      color: null,
      site: "Weekly Shonen Jump",
      created_at: "2024-01-13"
    },
    {
      id: 4,
      title: "My Hero Academia",
      description: "In a world where people have superpowers, Izuku Midoriya dreams of becoming the greatest hero.",
      thumbnails: "/src/assets/manga-cover-4.jpg",
      linkManga: null,
      color: null,
      site: "Weekly Shonen Jump",
      created_at: "2024-01-12"
    },
    {
      id: 5,
      title: "Jujutsu Kaisen",
      description: "Yuji Itadori joins a secret organization of Jujutsu Sorcerers to kill a powerful curse.",
      thumbnails: "/src/assets/manga-cover-5.jpg",
      linkManga: null,
      color: null,
      site: "Weekly Shonen Jump",
      created_at: "2024-01-11"
    },
    {
      id: 6,
      title: "Chainsaw Man",
      description: "Denji becomes the Chainsaw Devil and hunts other devils for the Public Safety Devil Hunters.",
      thumbnails: "/src/assets/manga-cover-6.jpg",
      linkManga: null,
      color: null,
      site: "Weekly Shonen Jump",
      created_at: "2024-01-10"
    },
    {
      id: 7,
      title: "Tokyo Ghoul",
      description: "Ken Kaneki becomes a half-ghoul and must navigate the world of ghouls and humans.",
      thumbnails: "/placeholder.svg",
      linkManga: null,
      color: null,
      site: "Weekly Young Jump",
      created_at: "2024-01-09"
    },
    {
      id: 8,
      title: "Naruto",
      description: "Naruto Uzumaki dreams of becoming the Hokage and gaining recognition from his village.",
      thumbnails: "/placeholder.svg",
      linkManga: null,
      color: null,
      site: "Weekly Shonen Jump",
      created_at: "2024-01-08"
    }
  ];

  // Mock chapter counts for each manga
  const scansCount: Record<string, number> = {
    "1": 139,
    "2": 1100,
    "3": 230,
    "4": 400,
    "5": 250,
    "6": 180,
    "7": 179,
    "8": 700
  };

  const isLoading = false;
  const error = null;

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
          <button 
            className="text-primary hover:text-primary/80 font-medium"
            onClick={() => navigate("/all-manga")}
          >
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