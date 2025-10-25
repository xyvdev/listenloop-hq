import React, { createContext, useContext, useState } from 'react';

export interface Podcast {
  id: string;
  title: string;
  description: string;
  host: string;
  coverImage: string;
  createdBy: string;
  createdAt: Date;
}

export interface Episode {
  id: string;
  podcastId: string;
  title: string;
  description: string;
  releaseDate: Date;
  duration: number;
  audioUrl: string;
  playCount: number;
  topic: string;
}

export interface Comment {
  id: string;
  episodeId: string;
  userId: string;
  username: string;
  content: string;
  createdAt: Date;
}

interface DataContextType {
  podcasts: Podcast[];
  episodes: Episode[];
  comments: Comment[];
  addPodcast: (podcast: Omit<Podcast, 'id' | 'createdAt'>) => void;
  updatePodcast: (id: string, podcast: Partial<Podcast>) => void;
  deletePodcast: (id: string) => void;
  addEpisode: (episode: Omit<Episode, 'id' | 'playCount'>) => void;
  updateEpisode: (id: string, episode: Partial<Episode>) => void;
  deleteEpisode: (id: string) => void;
  incrementPlayCount: (episodeId: string) => void;
  addComment: (comment: Omit<Comment, 'id' | 'createdAt'>) => void;
  updateComment: (id: string, content: string) => void;
  deleteComment: (id: string) => void;
  getEpisodesByPodcast: (podcastId: string) => Episode[];
  getCommentsByEpisode: (episodeId: string) => Comment[];
}

const DataContext = createContext<DataContextType | undefined>(undefined);

const MOCK_PODCASTS: Podcast[] = [
  {
    id: '1',
    title: 'Tech Talk Daily',
    description: 'Your daily dose of technology news and insights',
    host: 'Alex Podcaster',
    coverImage: 'https://images.unsplash.com/photo-1478737270239-2f02b77fc618?w=400',
    createdBy: '1',
    createdAt: new Date('2024-01-01'),
  },
  {
    id: '2',
    title: 'Creative Minds',
    description: 'Exploring creativity in art, design, and innovation',
    host: 'Alex Podcaster',
    coverImage: 'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?w=400',
    createdBy: '1',
    createdAt: new Date('2024-02-01'),
  },
];

const MOCK_EPISODES: Episode[] = [
  {
    id: '1',
    podcastId: '1',
    title: 'AI Revolution in 2024',
    description: 'Exploring the latest advances in artificial intelligence',
    releaseDate: new Date('2024-03-15'),
    duration: 45,
    audioUrl: 'https://mock-s3.com/episode1.mp3',
    playCount: 1250,
    topic: 'AI',
  },
  {
    id: '2',
    podcastId: '1',
    title: 'Blockchain Beyond Crypto',
    description: 'Real-world applications of blockchain technology',
    releaseDate: new Date('2024-03-20'),
    duration: 38,
    audioUrl: 'https://mock-s3.com/episode2.mp3',
    playCount: 890,
    topic: 'Blockchain',
  },
  {
    id: '3',
    podcastId: '2',
    title: 'Design Thinking Workshop',
    description: 'Learn the principles of design thinking',
    releaseDate: new Date('2024-03-18'),
    duration: 52,
    audioUrl: 'https://mock-s3.com/episode3.mp3',
    playCount: 2100,
    topic: 'Design',
  },
];

const MOCK_COMMENTS: Comment[] = [
  {
    id: '1',
    episodeId: '1',
    userId: '2',
    username: 'Sam Listener',
    content: 'Great episode! Very insightful discussion on AI ethics.',
    createdAt: new Date('2024-03-16'),
  },
];

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [podcasts, setPodcasts] = useState<Podcast[]>(MOCK_PODCASTS);
  const [episodes, setEpisodes] = useState<Episode[]>(MOCK_EPISODES);
  const [comments, setComments] = useState<Comment[]>(MOCK_COMMENTS);

  const addPodcast = (podcast: Omit<Podcast, 'id' | 'createdAt'>) => {
    const newPodcast: Podcast = {
      ...podcast,
      id: Date.now().toString(),
      createdAt: new Date(),
    };
    setPodcasts([...podcasts, newPodcast]);
  };

  const updatePodcast = (id: string, updates: Partial<Podcast>) => {
    setPodcasts(podcasts.map(p => (p.id === id ? { ...p, ...updates } : p)));
  };

  const deletePodcast = (id: string) => {
    setPodcasts(podcasts.filter(p => p.id !== id));
    setEpisodes(episodes.filter(e => e.podcastId !== id));
  };

  const addEpisode = (episode: Omit<Episode, 'id' | 'playCount'>) => {
    const newEpisode: Episode = {
      ...episode,
      id: Date.now().toString(),
      playCount: 0,
    };
    setEpisodes([...episodes, newEpisode]);
  };

  const updateEpisode = (id: string, updates: Partial<Episode>) => {
    setEpisodes(episodes.map(e => (e.id === id ? { ...e, ...updates } : e)));
  };

  const deleteEpisode = (id: string) => {
    setEpisodes(episodes.filter(e => e.id !== id));
    setComments(comments.filter(c => c.episodeId !== id));
  };

  const incrementPlayCount = (episodeId: string) => {
    setEpisodes(
      episodes.map(e => (e.id === episodeId ? { ...e, playCount: e.playCount + 1 } : e))
    );
  };

  const addComment = (comment: Omit<Comment, 'id' | 'createdAt'>) => {
    const newComment: Comment = {
      ...comment,
      id: Date.now().toString(),
      createdAt: new Date(),
    };
    setComments([...comments, newComment]);
  };

  const updateComment = (id: string, content: string) => {
    setComments(comments.map(c => (c.id === id ? { ...c, content } : c)));
  };

  const deleteComment = (id: string) => {
    setComments(comments.filter(c => c.id !== id));
  };

  const getEpisodesByPodcast = (podcastId: string) => {
    return episodes.filter(e => e.podcastId === podcastId);
  };

  const getCommentsByEpisode = (episodeId: string) => {
    return comments.filter(c => c.episodeId === episodeId);
  };

  return (
    <DataContext.Provider
      value={{
        podcasts,
        episodes,
        comments,
        addPodcast,
        updatePodcast,
        deletePodcast,
        addEpisode,
        updateEpisode,
        deleteEpisode,
        incrementPlayCount,
        addComment,
        updateComment,
        deleteComment,
        getEpisodesByPodcast,
        getCommentsByEpisode,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within DataProvider');
  }
  return context;
};
