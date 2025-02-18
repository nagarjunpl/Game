import React from 'react';
import { Timer, Target, Calculator } from 'lucide-react';

interface GameInfoProps {
  target: number;
  score: number;
  timeLeft: number;
  level: number;
  operation: string;
}

export const GameInfo: React.FC<GameInfoProps> = ({
  target,
  score,
  timeLeft,
  level,
  operation,
}) => {
  return (
    <div className="flex flex-col items-center gap-4 mb-8">
      <div className="flex items-center gap-8">
        <div className="flex items-center gap-2">
          <Target className="w-6 h-6 text-blue-500" />
          <span className="text-2xl font-bold">{target}</span>
        </div>
        <div className="flex items-center gap-2">
          <Calculator className="w-6 h-6 text-green-500" />
          <span className="text-2xl font-bold">{operation}</span>
        </div>
        <div className="flex items-center gap-2">
          <Timer className="w-6 h-6 text-red-500" />
          <span className="text-2xl font-bold">{timeLeft}s</span>
        </div>
      </div>
      <div className="flex gap-4">
        <div className="px-4 py-2 bg-blue-100 rounded-lg">
          <span className="font-semibold">Level: {level}</span>
        </div>
        <div className="px-4 py-2 bg-green-100 rounded-lg">
          <span className="font-semibold">Score: {score}</span>
        </div>
      </div>
    </div>
  );
};