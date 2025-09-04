import MangaCard from "./MangaCard";
import mangaCover1 from "@/assets/manga-cover-1.jpg";
import mangaCover2 from "@/assets/manga-cover-2.jpg";
import mangaCover3 from "@/assets/manga-cover-3.jpg";
import mangaCover4 from "@/assets/manga-cover-4.jpg";
import mangaCover5 from "@/assets/manga-cover-5.jpg";
import mangaCover6 from "@/assets/manga-cover-6.jpg";

const mockManga = [
  {
    id: "1",
    title: "Dragon's Fury: The Last Samurai",
    cover: mangaCover1,
    genre: "Action",
    rating: 4.8,
    chapters: 156,
    status: "Ongoing" as const,
    description: "A legendary warrior must protect his village from ancient demons while mastering the forbidden arts of his ancestors."
  },
  {
    id: "2",
    title: "Magical Academy Chronicles",
    cover: mangaCover2,
    genre: "Fantasy",
    rating: 4.6,
    chapters: 89,
    status: "Ongoing" as const,
    description: "Young Yuki discovers her magical powers and enters a prestigious academy where friendship and magic intertwine."
  },
  {
    id: "3",
    title: "Shadows of the Gothic Tower",
    cover: mangaCover3,
    genre: "Horror",
    rating: 4.7,
    chapters: 234,
    status: "Completed" as const,
    description: "In a world of darkness and mystery, a hooded figure uncovers ancient secrets that could change everything."
  },
  {
    id: "4",
    title: "Spring Hearts Academy",
    cover: mangaCover4,
    genre: "Romance",
    rating: 4.5,
    chapters: 67,
    status: "Ongoing" as const,
    description: "A sweet high school romance blooms under cherry blossom trees as two students navigate love and friendship."
  },
  {
    id: "5",
    title: "Neon Genesis: Future War",
    cover: mangaCover5,
    genre: "Sci-Fi",
    rating: 4.9,
    chapters: 178,
    status: "Ongoing" as const,
    description: "In a cyberpunk future, elite warriors fight for humanity's survival against AI overlords in sprawling neon cities."
  },
  {
    id: "6",
    title: "Phantom Woods: Dark Legends",
    cover: mangaCover6,
    genre: "Supernatural",
    rating: 4.4,
    chapters: 145,
    status: "Ongoing" as const,
    description: "Supernatural creatures emerge from ancient forests as brave heroes face their darkest fears and hidden powers."
  }
];

interface MangaGridProps {
  title: string;
  showAll?: boolean;
}

const MangaGrid = ({ title, showAll = false }: MangaGridProps) => {
  const displayManga = showAll ? mockManga : mockManga.slice(0, 6);

  return (
    <section className="mb-12">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-foreground">{title}</h2>
        {!showAll && (
          <button className="text-primary hover:text-primary/80 font-medium">
            View All →
          </button>
        )}
      </div>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
        {displayManga.map((manga, index) => (
          <MangaCard key={index} {...manga} />
        ))}
      </div>
    </section>
  );
};

export default MangaGrid;