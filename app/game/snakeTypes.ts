export interface Position {
  x: number;
  y: number;
}

export interface Snake {
  body: Position[];
  direction: 'up' | 'down' | 'left' | 'right';
  color: string;
}

export interface Food {
  position: Position;
  color: string;
  type: 'normal' | 'bonus';
  points: number;
}

export interface GameState {
  isPlaying: boolean;
  isPaused: boolean;
  isGameOver: boolean;
  score: number;
  highScore: number;
  level: number;
  speed: number;
}

export interface GameDimensions {
  width: number;
  height: number;
  gridSize: number;
  cols: number;
  rows: number;
}

export interface Controls {
  up: boolean;
  down: boolean;
  left: boolean;
  right: boolean;
}

export interface HighScore {
  score: number;
  level: number;
  date: string;
}