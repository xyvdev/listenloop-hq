import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useData } from '@/contexts/DataContext';
import { Header } from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, Play, Calendar, Clock, MessageSquare, Edit2, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

interface EpisodeDetailProps {
  episodeId: string;
  onBack: () => void;
}

export const EpisodeDetail = ({ episodeId, onBack }: EpisodeDetailProps) => {
  const { user } = useAuth();
  const { episodes, podcasts, addComment, updateComment, deleteComment, getCommentsByEpisode } = useData();
  const [newComment, setNewComment] = useState('');
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState('');

  const episode = episodes.find(e => e.id === episodeId);
  const podcast = podcasts.find(p => p.id === episode?.podcastId);
  const comments = getCommentsByEpisode(episodeId);

  if (!episode || !podcast) {
    return null;
  }

  const handleAddComment = () => {
    if (!newComment.trim()) {
      toast.error('Please enter a comment');
      return;
    }

    addComment({
      episodeId,
      userId: user!.id,
      username: user!.username,
      content: newComment,
    });

    toast.success('Comment added');
    setNewComment('');
  };

  const handleEditComment = (commentId: string, content: string) => {
    setEditingCommentId(commentId);
    setEditContent(content);
  };

  const handleSaveEdit = (commentId: string) => {
    if (!editContent.trim()) {
      toast.error('Comment cannot be empty');
      return;
    }

    updateComment(commentId, editContent);
    toast.success('Comment updated');
    setEditingCommentId(null);
    setEditContent('');
  };

  const handleDeleteComment = (commentId: string) => {
    if (confirm('Are you sure you want to delete this comment?')) {
      deleteComment(commentId);
      toast.success('Comment deleted');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-hero">
      <Header />
      <main className="container py-8 space-y-6 animate-fade-in max-w-4xl">
        <Button variant="ghost" onClick={onBack} className="mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Episodes
        </Button>

        <Card className="shadow-medium">
          <CardHeader className="p-0">
            <img
              src={podcast.coverImage}
              alt={podcast.title}
              className="h-64 w-full object-cover rounded-t-lg"
            />
          </CardHeader>
          <CardContent className="pt-6 space-y-4">
            <div>
              <div className="text-sm text-primary font-medium mb-2">{podcast.title}</div>
              <CardTitle className="text-2xl mb-2">{episode.title}</CardTitle>
              <CardDescription className="text-base">{episode.description}</CardDescription>
            </div>

            <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                {new Date(episode.releaseDate).toLocaleDateString()}
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                {episode.duration} minutes
              </div>
              <div className="flex items-center gap-2">
                <Play className="h-4 w-4" />
                {episode.playCount.toLocaleString()} plays
              </div>
            </div>

            {episode.topic && (
              <div>
                <span className="inline-flex items-center px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium">
                  Topic: {episode.topic}
                </span>
              </div>
            )}

            <div className="pt-4">
              <div className="text-xs text-muted-foreground mb-2">Audio URL</div>
              <div className="text-sm font-mono bg-muted p-3 rounded-md break-all">
                {episode.audioUrl}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-medium">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              Comments ({comments.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-3">
              <Textarea
                placeholder="Add a comment..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                rows={3}
              />
              <Button onClick={handleAddComment} className="bg-gradient-primary">
                Post Comment
              </Button>
            </div>

            <div className="space-y-4 pt-4">
              {comments.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">
                  No comments yet. Be the first to comment!
                </p>
              ) : (
                comments.map((comment) => (
                  <Card key={comment.id} className="shadow-soft">
                    <CardContent className="pt-4">
                      <div className="flex items-start gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                            {comment.username.charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <div>
                              <div className="font-medium text-sm">{comment.username}</div>
                              <div className="text-xs text-muted-foreground">
                                {new Date(comment.createdAt).toLocaleDateString()}
                              </div>
                            </div>
                            {comment.userId === user?.id && (
                              <div className="flex gap-2">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8"
                                  onClick={() => handleEditComment(comment.id, comment.content)}
                                >
                                  <Edit2 className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8"
                                  onClick={() => handleDeleteComment(comment.id)}
                                >
                                  <Trash2 className="h-4 w-4 text-destructive" />
                                </Button>
                              </div>
                            )}
                          </div>
                          {editingCommentId === comment.id ? (
                            <div className="space-y-2">
                              <Textarea
                                value={editContent}
                                onChange={(e) => setEditContent(e.target.value)}
                                rows={2}
                              />
                              <div className="flex gap-2">
                                <Button size="sm" onClick={() => handleSaveEdit(comment.id)}>
                                  Save
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => setEditingCommentId(null)}
                                >
                                  Cancel
                                </Button>
                              </div>
                            </div>
                          ) : (
                            <p className="text-sm">{comment.content}</p>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};
