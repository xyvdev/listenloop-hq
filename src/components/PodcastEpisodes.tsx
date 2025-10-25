import { useState } from 'react';
import { useData } from '@/contexts/DataContext';
import { Header } from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Edit, Trash2, ArrowLeft, Play, Calendar, Clock } from 'lucide-react';
import { toast } from 'sonner';

interface PodcastEpisodesProps {
  podcastId: string;
  onBack: () => void;
}

export const PodcastEpisodes = ({ podcastId, onBack }: PodcastEpisodesProps) => {
  const { podcasts, episodes, addEpisode, updateEpisode, deleteEpisode, incrementPlayCount } = useData();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingEpisode, setEditingEpisode] = useState<any>(null);

  const podcast = podcasts.find(p => p.id === podcastId);
  const podcastEpisodes = episodes.filter(e => e.podcastId === podcastId);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    releaseDate: new Date().toISOString().split('T')[0],
    duration: 0,
    audioUrl: '',
    topic: '',
  });

  const handleAdd = () => {
    if (!formData.title || !formData.duration || !formData.audioUrl) {
      toast.error('Please fill in all required fields');
      return;
    }

    addEpisode({
      ...formData,
      podcastId,
      releaseDate: new Date(formData.releaseDate),
      duration: Number(formData.duration),
    });

    toast.success('Episode added successfully!');
    setFormData({
      title: '',
      description: '',
      releaseDate: new Date().toISOString().split('T')[0],
      duration: 0,
      audioUrl: '',
      topic: '',
    });
    setIsAddDialogOpen(false);
  };

  const handleEdit = () => {
    if (!editingEpisode) return;

    updateEpisode(editingEpisode.id, {
      title: formData.title,
      description: formData.description,
      releaseDate: new Date(formData.releaseDate),
      duration: Number(formData.duration),
      audioUrl: formData.audioUrl,
      topic: formData.topic,
    });

    toast.success('Episode updated successfully!');
    setIsEditDialogOpen(false);
    setEditingEpisode(null);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this episode?')) {
      deleteEpisode(id);
      toast.success('Episode deleted');
    }
  };

  const handlePlayCountIncrement = (episodeId: string) => {
    incrementPlayCount(episodeId);
    toast.success('Play count updated');
  };

  const openEditDialog = (episode: any) => {
    setEditingEpisode(episode);
    setFormData({
      title: episode.title,
      description: episode.description,
      releaseDate: new Date(episode.releaseDate).toISOString().split('T')[0],
      duration: episode.duration,
      audioUrl: episode.audioUrl,
      topic: episode.topic,
    });
    setIsEditDialogOpen(true);
  };

  return (
    <div className="min-h-screen bg-gradient-hero">
      <Header />
      <main className="container py-8 space-y-6 animate-fade-in">
        <div className="flex items-center gap-4 mb-6">
          <Button variant="ghost" size="icon" onClick={onBack}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex-1">
            <h1 className="text-3xl font-bold">{podcast?.title}</h1>
            <p className="text-muted-foreground">Episodes</p>
          </div>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-primary">
                <Plus className="mr-2 h-4 w-4" />
                Add Episode
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Add New Episode</DialogTitle>
                <DialogDescription>Create a new episode for this podcast</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="ep-title">Title *</Label>
                  <Input
                    id="ep-title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="ep-description">Description</Label>
                  <Textarea
                    id="ep-description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="ep-date">Release Date *</Label>
                    <Input
                      id="ep-date"
                      type="date"
                      value={formData.releaseDate}
                      onChange={(e) => setFormData({ ...formData, releaseDate: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="ep-duration">Duration (minutes) *</Label>
                    <Input
                      id="ep-duration"
                      type="number"
                      value={formData.duration || ''}
                      onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) || 0 })}
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="ep-topic">Topic</Label>
                  <Input
                    id="ep-topic"
                    value={formData.topic}
                    onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="ep-audio">Audio URL (Mock S3) *</Label>
                  <Input
                    id="ep-audio"
                    placeholder="https://mock-s3.com/episode.mp3"
                    value={formData.audioUrl}
                    onChange={(e) => setFormData({ ...formData, audioUrl: e.target.value })}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAdd} className="bg-gradient-primary">
                  Add Episode
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {podcastEpisodes.length === 0 ? (
          <Card className="shadow-medium">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Play className="h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-lg font-medium mb-2">No episodes yet</p>
              <p className="text-sm text-muted-foreground">Add your first episode to get started</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {podcastEpisodes.map((episode) => (
              <Card key={episode.id} className="shadow-soft hover:shadow-medium transition-all">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle>{episode.title}</CardTitle>
                      <CardDescription className="mt-2">{episode.description}</CardDescription>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="icon" onClick={() => openEditDialog(episode)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="icon" onClick={() => handleDelete(episode.id)}>
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {new Date(episode.releaseDate).toLocaleDateString()}
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {episode.duration} min
                    </div>
                    <div className="flex items-center gap-1">
                      <Play className="h-4 w-4" />
                      {episode.playCount} plays
                    </div>
                    {episode.topic && (
                      <div className="px-2 py-1 rounded-md bg-primary/10 text-primary text-xs font-medium">
                        {episode.topic}
                      </div>
                    )}
                  </div>
                </CardContent>
                <CardFooter>
                  <Button
                    variant="outline"
                    onClick={() => handlePlayCountIncrement(episode.id)}
                  >
                    <Play className="mr-2 h-4 w-4" />
                    Increment Play Count
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}

        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Edit Episode</DialogTitle>
              <DialogDescription>Update episode information</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="edit-ep-title">Title</Label>
                <Input
                  id="edit-ep-title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="edit-ep-description">Description</Label>
                <Textarea
                  id="edit-ep-description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="edit-ep-date">Release Date</Label>
                  <Input
                    id="edit-ep-date"
                    type="date"
                    value={formData.releaseDate}
                    onChange={(e) => setFormData({ ...formData, releaseDate: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="edit-ep-duration">Duration (minutes)</Label>
                  <Input
                    id="edit-ep-duration"
                    type="number"
                    value={formData.duration || ''}
                    onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) || 0 })}
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="edit-ep-topic">Topic</Label>
                <Input
                  id="edit-ep-topic"
                  value={formData.topic}
                  onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="edit-ep-audio">Audio URL</Label>
                <Input
                  id="edit-ep-audio"
                  value={formData.audioUrl}
                  onChange={(e) => setFormData({ ...formData, audioUrl: e.target.value })}
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
