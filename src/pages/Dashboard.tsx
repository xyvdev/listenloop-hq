import { useAuth } from '@/contexts/AuthContext';
import { useData } from '@/contexts/DataContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Header } from '@/components/Header';
import { Mic2, Headphones, TrendingUp, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const Dashboard = () => {
  const { user } = useAuth();
  const { podcasts, episodes } = useData();

  const userPodcasts = podcasts.filter(p => p.createdBy === user?.id);
  const totalPlays = episodes.reduce((sum, ep) => sum + ep.playCount, 0);
  const topEpisodes = [...episodes].sort((a, b) => b.playCount - a.playCount).slice(0, 5);

  return (
    <div className="min-h-screen bg-gradient-hero">
      <Header />
      <main className="container py-8 space-y-8 animate-fade-in">
        <div>
          <h1 className="text-4xl font-bold mb-2">
            Welcome back, <span className="bg-gradient-primary bg-clip-text text-transparent">{user?.username}</span>!
          </h1>
          <p className="text-muted-foreground text-lg">
            {user?.role === 'podcaster' && 'Manage your podcasts and episodes'}
            {user?.role === 'listener' && 'Discover and enjoy amazing podcast content'}
            {user?.role === 'admin' && 'Monitor platform analytics and manage users'}
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card className="shadow-soft hover:shadow-medium transition-all">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Podcasts</CardTitle>
              <Mic2 className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{podcasts.length}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {user?.role === 'podcaster' ? `${userPodcasts.length} yours` : 'Available to explore'}
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-soft hover:shadow-medium transition-all">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Episodes</CardTitle>
              <Headphones className="h-4 w-4 text-accent" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{episodes.length}</div>
              <p className="text-xs text-muted-foreground mt-1">Ready to listen</p>
            </CardContent>
          </Card>

          <Card className="shadow-soft hover:shadow-medium transition-all">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Plays</CardTitle>
              <TrendingUp className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalPlays.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground mt-1">Across all episodes</p>
            </CardContent>
          </Card>

          <Card className="shadow-soft hover:shadow-medium transition-all">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Active Users</CardTitle>
              <Users className="h-4 w-4 text-accent" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">523</div>
              <p className="text-xs text-muted-foreground mt-1">This month</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card className="shadow-medium">
            <CardHeader>
              <CardTitle>Top Episodes</CardTitle>
              <CardDescription>Most popular episodes by play count</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topEpisodes.map((episode, index) => {
                  const podcast = podcasts.find(p => p.id === episode.podcastId);
                  return (
                    <div key={episode.id} className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary/10 text-sm font-bold text-primary">
                        {index + 1}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">{episode.title}</p>
                        <p className="text-xs text-muted-foreground truncate">{podcast?.title}</p>
                      </div>
                      <div className="text-sm font-medium text-muted-foreground">
                        {episode.playCount.toLocaleString()} plays
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-medium">
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>What would you like to do?</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {user?.role === 'podcaster' && (
                <>
                  <Link to="/podcasts">
                    <Button className="w-full justify-start" variant="outline">
                      <Mic2 className="mr-2 h-4 w-4" />
                      Manage Podcasts
                    </Button>
                  </Link>
                  <Link to="/podcasts">
                    <Button className="w-full justify-start bg-gradient-primary">
                      Create New Podcast
                    </Button>
                  </Link>
                </>
              )}
              {user?.role === 'listener' && (
                <>
                  <Link to="/episodes">
                    <Button className="w-full justify-start bg-gradient-primary">
                      <Headphones className="mr-2 h-4 w-4" />
                      Browse Episodes
                    </Button>
                  </Link>
                  <Link to="/profile">
                    <Button className="w-full justify-start" variant="outline">
                      View Subscriptions
                    </Button>
                  </Link>
                </>
              )}
              {user?.role === 'admin' && (
                <>
                  <Link to="/admin">
                    <Button className="w-full justify-start bg-gradient-primary">
                      <Users className="mr-2 h-4 w-4" />
                      Admin Dashboard
                    </Button>
                  </Link>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
