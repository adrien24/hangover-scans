import { useState } from "react";
import { Clock, Filter, Grid, List } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import MangaNavigation from "@/components/MangaNavigation";
import MangaGrid from "@/components/MangaGrid";

const Latest = () => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [genreFilter, setGenreFilter] = useState('all');

  return (
    <div className="min-h-screen bg-background">
      <MangaNavigation />
      
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Clock className="w-6 h-6 text-primary" />
              <h1 className="text-3xl font-bold text-foreground">Latest Updates</h1>
            </div>
            <p className="text-muted-foreground">Stay up to date with the newest manga chapters</p>
            <Badge variant="secondary" className="mt-2">Updated every hour</Badge>
          </div>
          
          {/* Controls */}
          <div className="flex items-center gap-4 mt-4 md:mt-0">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-muted-foreground" />
              <Select value={genreFilter} onValueChange={setGenreFilter}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Genre" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Genres</SelectItem>
                  <SelectItem value="action">Action</SelectItem>
                  <SelectItem value="adventure">Adventure</SelectItem>
                  <SelectItem value="romance">Romance</SelectItem>
                  <SelectItem value="supernatural">Supernatural</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex items-center border rounded-lg">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('grid')}
              >
                <Grid className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('list')}
              >
                <List className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Content */}
        <MangaGrid title="" showAll={true} />
      </div>
    </div>
  );
};

export default Latest;