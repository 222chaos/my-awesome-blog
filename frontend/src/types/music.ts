export interface Artist {
  id: string;
  name: string;
  avatar: string;
  fans?: number;
  description?: string;
}

export interface Album {
  id: string;
  name: string;
  coverImg: string;
  artist: Artist;
  releaseDate?: string;
  trackCount?: number;
}

export interface Song {
  id: string;
  name: string;
  artists: Artist[];
  album: Album;
  duration: number;
  mv?: boolean;
  sq?: boolean;
  coverImg?: string;
}

export interface Playlist {
  id: string;
  name: string;
  coverImg: string;
  playCount: number;
  trackCount: number;
  creator?: string;
  description?: string;
}

export interface Banner {
  id: string;
  image: string;
  title: string;
  subtitle: string;
  description?: string;
  type: 'playlist' | 'album' | 'artist';
  targetId: string;
  gradient: string;
  coverImage?: string;
}

export type PlayMode = 'list' | 'random' | 'single';

export interface PlayerState {
  currentSong?: Song;
  isPlaying: boolean;
  progress: number;
  duration: number;
  volume: number;
  playMode: PlayMode;
  playlist: Song[];
  currentIndex: number;
}

export interface Ranking {
  id: string;
  name: string;
  coverImg: string;
  updateTime: string;
  tracks: Song[];
}
