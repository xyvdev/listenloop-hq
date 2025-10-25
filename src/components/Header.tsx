import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { LogOut, Mic2, User } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

export const Header = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/auth');
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center space-x-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-primary">
            <Mic2 className="h-6 w-6 text-primary-foreground" />
          </div>
          <span className="text-xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            PodcastHub
          </span>
        </Link>

        <nav className="flex items-center space-x-4">
          <Link to="/">
            <Button variant="ghost">Dashboard</Button>
          </Link>

          {user?.role === 'podcaster' && (
            <Link to="/podcasts">
              <Button variant="ghost">My Podcasts</Button>
            </Link>
          )}

          {user?.role === 'listener' && (
            <Link to="/episodes">
              <Button variant="ghost">Browse Episodes</Button>
            </Link>
          )}

          {user?.role === 'admin' && (
            <Link to="/admin">
              <Button variant="ghost">Admin Panel</Button>
            </Link>
          )}

          <Link to="/profile">
            <Button variant="ghost" size="icon">
              <Avatar className="h-8 w-8">
                <AvatarFallback className="bg-primary text-primary-foreground">
                  {user?.username.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
            </Button>
          </Link>

          <Button variant="ghost" size="icon" onClick={handleLogout}>
            <LogOut className="h-5 w-5" />
          </Button>
        </nav>
      </div>
    </header>
  );
};
