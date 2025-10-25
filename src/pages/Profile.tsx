import { useAuth } from '@/contexts/AuthContext';
import { useData } from '@/contexts/DataContext';
import { Header } from '@/components/Header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Mic2, Headphones, Shield, Calendar } from 'lucide-react';

const Profile = () => {
  const { user } = useAuth();
  const { podcasts, episodes } = useData();

  const userPodcasts = podcasts.filter(p => p.createdBy === user?.id);
  const userEpisodeCount = episodes.filter(e => userPodcasts.some(p => p.id === e.podcastId)).length;

  const getRoleIcon = () => {
    switch (user?.role) {
      case 'podcaster':
        return <Mic2 className="h-4 w-4" />;
      case 'listener':
        return <Headphones className="h-4 w-4" />;
      case 'admin':
        return <Shield className="h-4 w-4" />;
    }
  };

  const getRoleColor = () => {
    switch (user?.role) {
      case 'podcaster':
        return 'bg-primary/10 text-primary border-primary/20';
      case 'listener':
        return 'bg-accent/10 text-accent border-accent/20';
      case 'admin':
        return 'bg-destructive/10 text-destructive border-destructive/20';
      default:
        return 'bg-secondary';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-hero">
      <Header />
      <main className="container py-8 space-y-6 animate-fade-in max-w-4xl">
        <Card className="shadow-medium">
          <CardHeader className="text-center pb-2">
            <div className="flex justify-center mb-4">
              <Avatar className="h-24 w-24 border-4 border-primary/20">
                <AvatarFallback className="bg-gradient-primary text-primary-foreground text-3xl">
                  {user?.username.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
            </div>
            <CardTitle className="text-2xl">{user?.username}</CardTitle>
            <CardDescription className="text-base">{user?.email}</CardDescription>
            <div className="flex justify-center mt-3">
              <Badge className={`${getRoleColor()} flex items-center gap-1 px-3 py-1`}>
                {getRoleIcon()}
                <span className="capitalize">{user?.role}</span>
              </Badge>
            </div>
          </CardHeader>
        </Card>

        <div className="grid gap-6 md:grid-cols-2">
          <Card className="shadow-soft">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mic2 className="h-5 w-5 text-primary" />
                Activity Stats
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {user?.role === 'podcaster' ? (
                <>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Podcasts Created</span>
                    <span className="text-2xl font-bold">{userPodcasts.length}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Episodes Published</span>
                    <span className="text-2xl font-bold">{userEpisodeCount}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Total Plays</span>
                    <span className="text-2xl font-bold">
                      {episodes
                        .filter(e => userPodcasts.some(p => p.id === e.podcastId))
                        .reduce((sum, e) => sum + e.playCount, 0)
                        .toLocaleString()}
                    </span>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Episodes Listened</span>
                    <span className="text-2xl font-bold">0</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Comments Posted</span>
                    <span className="text-2xl font-bold">0</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Subscriptions</span>
                    <span className="text-2xl font-bold">0</span>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          <Card className="shadow-soft">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-accent" />
                Account Info
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="text-sm text-muted-foreground mb-1">Account Type</div>
                <div className="font-medium capitalize">{user?.role} Account</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground mb-1">User ID</div>
                <div className="font-mono text-sm">{user?.id}</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground mb-1">Member Since</div>
                <div className="font-medium">January 2024</div>
              </div>
            </CardContent>
          </Card>
        </div>

        {user?.role === 'podcaster' && userPodcasts.length > 0 && (
          <Card className="shadow-medium">
            <CardHeader>
              <CardTitle>My Podcasts</CardTitle>
              <CardDescription>Your podcast collection</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {userPodcasts.map((podcast) => {
                  const podcastEpisodes = episodes.filter(e => e.podcastId === podcast.id);
                  const totalPlays = podcastEpisodes.reduce((sum, e) => sum + e.playCount, 0);

                  return (
                    <div key={podcast.id} className="flex items-center gap-4 p-4 rounded-lg bg-muted/50">
                      <img
                        src={podcast.coverImage}
                        alt={podcast.title}
                        className="h-16 w-16 rounded-lg object-cover"
                      />
                      <div className="flex-1">
                        <h3 className="font-semibold">{podcast.title}</h3>
                        <p className="text-sm text-muted-foreground">{podcast.description}</p>
                        <div className="flex gap-4 mt-2 text-xs text-muted-foreground">
                          <span>{podcastEpisodes.length} episodes</span>
                          <span>{totalPlays.toLocaleString()} plays</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        )}

        {user?.role === 'listener' && (
          <Card className="shadow-medium">
            <CardHeader>
              <CardTitle>Subscriptions</CardTitle>
              <CardDescription>Podcasts you follow</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                No subscriptions yet. Browse episodes to discover great content!
              </div>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
};

export default Profile;
