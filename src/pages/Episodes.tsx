import { useState } from 'react';
import { useData } from '@/contexts/DataContext';
import { Header } from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Play, Calendar, Clock, Search, TrendingUp, MessageSquare } from 'lucide-react';
import { EpisodeDetail } from '@/components/EpisodeDetail';

const Episodes = () => {
  const { podcasts, episodes } = useData();
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'popular' | 'date'>('popular');
  const [selectedEpisode, setSelectedEpisode] = useState<string | null>(null);

  const filteredEpisodes = episodes
    .filter(episode => {
      const podcast = podcasts.find(p => p.id === episode.podcastId);
      const searchLower = searchQuery.toLowerCase();
      return (
        episode.title.toLowerCase().includes(searchLower) ||
        episode.topic.toLowerCase().includes(searchLower) ||
        podcast?.host.toLowerCase().includes(searchLower)
      );
    })
    .sort((a, b) => {
      if (sortBy === 'popular') {
        return b.playCount - a.playCount;
      } else {
        return new Date(b.releaseDate).getTime() - new Date(a.releaseDate).getTime();
      }
    });

  if (selectedEpisode) {
    return <EpisodeDetail episodeId={selectedEpisode} onBack={() => setSelectedEpisode(null)} />;
  }

  return (
    <div className="min-h-screen bg-gradient-hero">
      <Header />
      <main className="container py-8 space-y-6 animate-fade-in">
        <div>
          <h1 className="text-3xl font-bold mb-2">Browse Episodes</h1>
          <p className="text-muted-foreground">Discover and listen to amazing podcast content</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by topic or host..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          <Select value={sortBy} onValueChange={(v) => setSortBy(v as 'popular' | 'date')}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="popular">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4" />
                  Most Popular
                </div>
              </SelectItem>
              <SelectItem value="date">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Latest First
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        {filteredEpisodes.length === 0 ? (
          <Card className="shadow-medium">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Search className="h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-lg font-medium mb-2">No episodes found</p>
              <p className="text-sm text-muted-foreground">Try adjusting your search query</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredEpisodes.map((episode) => {
              const podcast = podcasts.find(p => p.id === episode.podcastId);
              return (
                <Card
                  key={episode.id}
                  className="shadow-soft hover:shadow-medium transition-all cursor-pointer group"
                  onClick={() => setSelectedEpisode(episode.id)}
                >
                  <CardHeader className="p-0">
                    <img
                      src={podcast?.coverImage}
                      alt={podcast?.title}
                      className="h-48 w-full object-cover rounded-t-lg group-hover:scale-105 transition-transform"
                    />
                  </CardHeader>
                  <CardContent className="pt-4">
                    <div className="text-xs text-primary font-medium mb-2">{podcast?.title}</div>
                    <CardTitle className="text-lg mb-2 line-clamp-2">{episode.title}</CardTitle>
                    <CardDescription className="line-clamp-2">{episode.description}</CardDescription>
                    <div className="flex flex-wrap gap-3 mt-3 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {new Date(episode.releaseDate).toLocaleDateString()}
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {episode.duration} min
                      </div>
                      <div className="flex items-center gap-1">
                        <Play className="h-3 w-3" />
                        {episode.playCount}
                      </div>
                    </div>
                    {episode.topic && (
                      <div className="mt-3">
                        <span className="inline-flex items-center px-2 py-1 rounded-md bg-primary/10 text-primary text-xs font-medium">
                          {episode.topic}
                        </span>
                      </div>
                    )}
                  </CardContent>
                  <CardFooter>
                    <Button className="w-full bg-gradient-primary">
                      <MessageSquare className="mr-2 h-4 w-4" />
                      View Details
                    </Button>
                  </CardFooter>
                </Card>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
};

export default Episodes;
