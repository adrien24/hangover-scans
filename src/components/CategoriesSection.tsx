import { Badge } from "@/components/ui/badge";
import { 
  Swords, 
  Heart, 
  Zap, 
  Skull, 
  Sparkles, 
  Shield, 
  Coffee, 
  Gamepad2,
  Crown,
  Ghost
} from "lucide-react";

const categories = [
  { name: "Action", icon: Swords, color: "bg-red-500/10 text-red-400 border-red-500/20 hover:bg-red-500/20" },
  { name: "Romance", icon: Heart, color: "bg-pink-500/10 text-pink-400 border-pink-500/20 hover:bg-pink-500/20" },
  { name: "Sci-Fi", icon: Zap, color: "bg-blue-500/10 text-blue-400 border-blue-500/20 hover:bg-blue-500/20" },
  { name: "Horror", icon: Skull, color: "bg-gray-500/10 text-gray-400 border-gray-500/20 hover:bg-gray-500/20" },
  { name: "Fantasy", icon: Sparkles, color: "bg-purple-500/10 text-purple-400 border-purple-500/20 hover:bg-purple-500/20" },
  { name: "Adventure", icon: Shield, color: "bg-green-500/10 text-green-400 border-green-500/20 hover:bg-green-500/20" },
  { name: "Slice of Life", icon: Coffee, color: "bg-orange-500/10 text-orange-400 border-orange-500/20 hover:bg-orange-500/20" },
  { name: "Gaming", icon: Gamepad2, color: "bg-indigo-500/10 text-indigo-400 border-indigo-500/20 hover:bg-indigo-500/20" },
  { name: "Historical", icon: Crown, color: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20 hover:bg-yellow-500/20" },
  { name: "Supernatural", icon: Ghost, color: "bg-violet-500/10 text-violet-400 border-violet-500/20 hover:bg-violet-500/20" },
];

const CategoriesSection = () => {
  return (
    <section className="mb-12">
      <h2 className="text-2xl font-bold text-foreground mb-6">Browse by Genre</h2>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {categories.map((category) => {
          const IconComponent = category.icon;
          return (
            <Badge
              key={category.name}
              variant="outline"
              className={`p-4 cursor-pointer transition-all duration-300 flex flex-col items-center space-y-2 hover:scale-105 ${category.color}`}
            >
              <IconComponent className="w-6 h-6" />
              <span className="font-medium">{category.name}</span>
            </Badge>
          );
        })}
      </div>
    </section>
  );
};

export default CategoriesSection;