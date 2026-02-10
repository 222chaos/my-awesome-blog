export type Platform = 'PC' | 'PS5' | 'PS4' | 'Switch' | 'Xbox' | 'Mobile';
export type Genre = 'Action' | 'RPG' | 'Adventure' | 'Strategy' | 'Shooter' | 'Indie' | 'Simulation' | 'Racing' | 'Sports';
export type GameStatus = 'Playing' | 'Completed' | 'Wishlist' | 'Dropped' | 'Backlog';

export interface Game {
  id: string;
  title: string;
  coverImage: string;
  bannerImage?: string;
  description: string;
  platform: Platform[];
  genre: Genre[];
  releaseDate: string;
  developer: string;
  publisher: string;
  rating: number; // 0-10
  myRating?: number; // 0-10
  status: GameStatus;
  playTime?: number; // hours
  achievements?: {
    total: number;
    unlocked: number;
  };
  review?: string;
  tags?: string[];
  isFavorite?: boolean;
}

export interface GameCategory {
  id: string;
  label: string;
  icon: string;
  count?: number;
}
