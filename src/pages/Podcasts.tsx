import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useData } from '@/contexts/DataContext';
import { Header } from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Edit, Trash2, Music } from 'lucide-react';
import { toast } from 'sonner';
import { PodcastEpisodes } from '@/components/PodcastEpisodes';

const Podcasts = () => {
  const { user } = useAuth();
  const { podcasts, addPodcast, updatePodcast, deletePodcast } = useData();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedPodcast, setSelectedPodcast] = useState<string | null>(null);
  const [editingPodcast, setEditingPodcast] = useState<any>(null);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    host: user?.username || '',
    coverImage: '',
  });

  const userPodcasts = podcasts.filter(p => p.createdBy === user?.id);

  const handleAdd = () => {
    if (!formData.title || !formData.description) {
      toast.error('Please fill in all required fields');
      return;
    }

    addPodcast({
      ...formData,
      createdBy: user!.id,
      coverImage: formData.coverImage || 'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?w=400',
    });

    toast.success('Podcast created successfully!');
    setFormData({ title: '', description: '', host: user?.username || '', coverImage: '' });
    setIsAddDialogOpen(false);
  };

  const handleEdit = () => {
    if (!editingPodcast) return;

    updatePodcast(editingPodcast.id, {
      title: formData.title,
      description: formData.description,
      host: formData.host,
      coverImage: formData.coverImage,
    });

    toast.success('Podcast updated successfully!');
    setIsEditDialogOpen(false);
    setEditingPodcast(null);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this podcast? All episodes will be deleted.')) {
      deletePodcast(id);
      toast.success('Podcast deleted');
    }
  };

  const openEditDialog = (podcast: any) => {
    setEditingPodcast(podcast);
    setFormData({
      title: podcast.title,
      description: podcast.description,
      host: podcast.host,
      coverImage: podcast.coverImage,
    });
    setIsEditDialogOpen(true);
  };

  if (selectedPodcast) {
    return <PodcastEpisodes podcastId={selectedPodcast} onBack={() => setSelectedPodcast(null)} />;
  }

  return (
    <div className="min-h-screen bg-gradient-hero">
      <Header />
      <main className="container py-8 space-y-6 animate-fade-in">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">My Podcasts</h1>
            <p className="text-muted-foreground">Manage your podcast collection</p>
          </div>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-primary">
                <Plus className="mr-2 h-4 w-4" />
                Create Podcast
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Podcast</DialogTitle>
                <DialogDescription>Add a new podcast to your collection</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="title">Title *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="description">Description *</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="host">Host</Label>
                  <Input
                    id="host"
                    value={formData.host}
                    onChange={(e) => setFormData({ ...formData, host: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="coverImage">Cover Image URL</Label>
                  <Input
                    id="coverImage"
                    placeholder="https://..."
                    value={formData.coverImage}
                    onChange={(e) => setFormData({ ...formData, coverImage: e.target.value })}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAdd} className="bg-gradient-primary">
                  Create
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {userPodcasts.length === 0 ? (
          <Card className="shadow-medium">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Music className="h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-lg font-medium mb-2">No podcasts yet</p>
              <p className="text-sm text-muted-foreground">Create your first podcast to get started</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {userPodcasts.map((podcast) => (
              <Card key={podcast.id} className="shadow-soft hover:shadow-medium transition-all cursor-pointer">
                <CardHeader className="p-0">
                  <img
                    src={podcast.coverImage}
                    alt={podcast.title}
                    className="h-48 w-full object-cover rounded-t-lg"
                  />
                </CardHeader>
                <CardContent className="pt-4">
                  <CardTitle className="mb-2">{podcast.title}</CardTitle>
                  <CardDescription className="line-clamp-2">{podcast.description}</CardDescription>
                  <p className="text-sm text-muted-foreground mt-2">Host: {podcast.host}</p>
                </CardContent>
                <CardFooter className="flex gap-2">
                  <Button 
                    variant="outline" 
                    className="flex-1"
                    onClick={() => setSelectedPodcast(podcast.id)}
                  >
                    <Music className="mr-2 h-4 w-4" />
                    Episodes
                  </Button>
                  <Button variant="outline" size="icon" onClick={() => openEditDialog(podcast)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="icon" onClick={() => handleDelete(podcast.id)}>
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}

        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Podcast</DialogTitle>
              <DialogDescription>Update podcast information</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="edit-title">Title</Label>
                <Input
                  id="edit-title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="edit-description">Description</Label>
                <Textarea
                  id="edit-description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="edit-host">Host</Label>
                <Input
                  id="edit-host"
                  value={formData.host}
                  onChange={(e) => setFormData({ ...formData, host: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="edit-coverImage">Cover Image URL</Label>
                <Input
                  id="edit-coverImage"
                  value={formData.coverImage}
                  onChange={(e) => setFormData({ ...formData, coverImage: e.target.value })}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleEdit} className="bg-gradient-primary">
                Save Changes
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </main>
    </div>
  );
};

export default Podcasts;
