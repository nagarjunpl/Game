export type Cell = {
  value: number;
  selected: boolean;
  id: string;
};

export type GameState = {
  grid: Cell[][];
  target: number;
  selectedCells: Cell[];
  score: number;
  timeLeft: number;
  level: number;
  operation: '+' | '-' | '*' | '/';
  possibleCombinations?: number[][];
};

export type GameStatus = 'idle' | 'playing' | 'paused' | 'gameOver';

export type LevelInfo = {
  level: number;
  operation: '+' | '-' | '*' | '/';
  description: string;
  pointsToComplete: number;
};

export type PlayerProgress = {
  id: string;
  user_id: string;
  level: number;
  completed_at: string;
  score: number;
  created_at: string;
};