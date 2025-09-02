import { Button } from "@/components/ui/button";
import { Play, Plus, Info } from "lucide-react";
import mangaCover1 from "@/assets/manga-cover-1.jpg";

const HeroSection = () => {
  return (
    <section className="relative h-[70vh] overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img 
          src={mangaCover1} 
          alt="Featured Manga"
          className="w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
      </div>
      
      {/* Content */}
      <div className="relative container mx-auto px-4 h-full flex items-center">
        <div className="max-w-2xl text-white">
          <h1 className="text-5xl md:text-6xl font-bold mb-4 leading-tight">
            Dragon's Fury
          </h1>
          <p className="text-xl md:text-2xl mb-6 text-gray-200">
            The Last Samurai
          </p>
          <p className="text-lg mb-8 text-gray-300 max-w-xl leading-relaxed">
            Follow the epic journey of a legendary warrior as he battles ancient demons 
            and masters forbidden arts to protect his village. An action-packed adventure 
            filled with honor, sacrifice, and incredible martial arts.
          </p>
          
          <div className="flex flex-wrap gap-4">
            <Button 
              size="lg" 
              className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-3 text-lg font-semibold"
            >
              <Play className="w-5 h-5 mr-2" />
              Start Reading
            </Button>
            <Button 
              size="lg" 
              variant="secondary"
              className="bg-white/20 hover:bg-white/30 text-white border-white/20 px-8 py-3 text-lg font-semibold backdrop-blur-sm"
            >
              <Plus className="w-5 h-5 mr-2" />
              Add to List
            </Button>
            <Button 
              size="lg" 
              variant="ghost"
              className="text-white hover:bg-white/10 px-8 py-3 text-lg font-semibold"
            >
              <Info className="w-5 h-5 mr-2" />
              More Info
            </Button>
          </div>
          
          <div className="flex items-center space-x-4 mt-8 text-sm text-gray-300">
            <span className="bg-green-600 px-3 py-1 rounded-full font-medium">Ongoing</span>
            <span>156 Chapters</span>
            <span>⭐ 4.8/5</span>
            <span>Action • Adventure • Supernatural</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;