import React from 'react';
import { LevelInfo, PlayerProgress } from '../types';
import { Plus, Minus, X, Divide, CheckCircle2 } from 'lucide-react';

interface LevelPreviewProps {
  levels: LevelInfo[];
  onStart: () => void;
  completedLevels: PlayerProgress[];
}

const OperationIcon = ({ operation }: { operation: '+' | '-' | '*' | '/' }) => {
  switch (operation) {
    case '+': return <Plus className="w-5 h-5" />;
    case '-': return <Minus className="w-5 h-5" />;
    case '*': return <X className="w-5 h-5" />;
    case '/': return <Divide className="w-5 h-5" />;
  }
};

export const LevelPreview: React.FC<LevelPreviewProps> = ({ 
  levels, 
  onStart, 
  completedLevels 
}) => {
  return (
    <div className="w-full max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold text-center mb-6">Level Progress</h2>
      <div className="grid gap-4 mb-8">
        {levels.map((level) => {
          const completed = completedLevels.find(p => p.level === level.level);
          return (
            <div
              key={level.level}
              className={`bg-white p-4 rounded-lg shadow-md flex items-center gap-4 ${
                completed ? 'border-2 border-green-500' : ''
              }`}
            >
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-xl font-bold text-blue-600">{level.level}</span>
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <OperationIcon operation={level.operation} />
                  <h3 className="font-semibold">{level.description}</h3>
                  {completed && (
                    <CheckCircle2 className="w-5 h-5 text-green-500 ml-2" />
                  )}
                </div>
                <p className="text-sm text-gray-600">
                  Points to complete: {level.pointsToComplete}
                  {completed && (
                    <span className="text-green-600 ml-2">
                      (Completed with score: {completed.score})
                    </span>
                  )}
                </p>
              </div>
            </div>
          );
        })}
      </div>
      <button
        onClick={onStart}
        className="w-full px-6 py-3 bg-blue-500 text-white rounded-lg font-semibold hover:bg-blue-600 transition-colors"
      >
        Start Game
      </button>
    </div>
  );
};