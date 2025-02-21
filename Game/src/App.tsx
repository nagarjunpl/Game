import React, { useState, useEffect, useCallback } from 'react';
import { Grid } from './components/Grid';
import { GameInfo } from './components/GameInfo';
import { LevelPreview } from './components/LevelPreview';
import { PossibleCombinations } from './components/PossibleCombinations';
import { GameState, Cell, GameStatus, LevelInfo, PlayerProgress } from './types';
import {
  generateGrid,
  generateTarget,
  calculateResult,
  getOperationForLevel,
  getLevelInfo,
  findPossibleCombinations
} from './utils';
import { Brain, Home, ArrowRight, RotateCcw } from 'lucide-react';
import { supabase } from './lib/supabase';

function App() {
  const [gameState, setGameState] = useState<GameState>({
    grid: [],
    target: 0,
    selectedCells: [],
    score: 0,
    timeLeft: 60,
    level: 1,
    operation: '+',
  });
  const [gameStatus, setGameStatus] = useState<GameStatus>('idle');
  const [levels, setLevels] = useState<LevelInfo[]>([]);
  const [levelCompleted, setLevelCompleted] = useState(false);
  const [completedLevels, setCompletedLevels] = useState<PlayerProgress[]>([]);

  useEffect(() => {
    // Generate level information
    const levelInfos = Array.from({ length: 12 }, (_, i) => getLevelInfo(i + 1));
    setLevels(levelInfos);
    
    // Load completed levels for the current user
    const loadCompletedLevels = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data } = await supabase
          .from('player_progress')
          .select('*')
          .order('level', { ascending: true });
        
        if (data) {
          setCompletedLevels(data);
        }
      }
    };

    loadCompletedLevels();
  }, []);

  const saveLevelProgress = async (level: number, score: number) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data, error } = await supabase
      .from('player_progress')
      .upsert({
        user_id: user.id,
        level,
        score,
        completed_at: new Date().toISOString()
      }, {
        onConflict: 'user_id,level'
      })
      .select()
      .single();

    if (!error && data) {
      setCompletedLevels(prev => {
        const existing = prev.findIndex(p => p.level === level);
        if (existing >= 0) {
          return [
            ...prev.slice(0, existing),
            data,
            ...prev.slice(existing + 1)
          ];
        }
        return [...prev, data];
      });
    }
  };

  const initializeGame = useCallback((startLevel: number = 1) => {
    const operation = getOperationForLevel(startLevel);
    const rawGrid = generateGrid(startLevel);
    const grid = rawGrid.map((row) =>
      row.map((value) => ({
        value,
        selected: false,
        id: Math.random().toString(36).substr(2, 9),
      }))
    );
    const target = generateTarget(rawGrid, operation);
    const possibleCombinations = findPossibleCombinations(
      rawGrid.flat(),
      target,
      operation
    );

    setGameState({
      grid,
      target,
      selectedCells: [],
      score: 0,
      timeLeft: 60,
      level: startLevel,
      operation,
      possibleCombinations,
    });
    setGameStatus('playing');
    setLevelCompleted(false);
  }, []);

  const nextLevel = useCallback(() => {
    const newLevel = gameState.level + 1;
    if (newLevel > 12) {
      setGameStatus('gameOver');
      return;
    }
    
    const operation = getOperationForLevel(newLevel);
    const rawGrid = generateGrid(newLevel);
    const grid = rawGrid.map((row) =>
      row.map((value) => ({
        value,
        selected: false,
        id: Math.random().toString(36).substr(2, 9),
      }))
    );
    const target = generateTarget(rawGrid, operation);
    const possibleCombinations = findPossibleCombinations(
      rawGrid.flat(),
      target,
      operation
    );

    setGameState((prev) => ({
      ...prev,
      grid,
      target,
      selectedCells: [],
      level: newLevel,
      operation,
      timeLeft: Math.max(60 - (newLevel - 1) * 5, 30),
      score: 0,
      possibleCombinations,
    }));
    setLevelCompleted(false);
  }, [gameState.level]);

  useEffect(() => {
    if (gameStatus === 'playing' && !levelCompleted) {
      const timer = setInterval(() => {
        setGameState((prev) => {
          if (prev.timeLeft <= 1) {
            setGameStatus('gameOver');
            clearInterval(timer);
            return { ...prev, timeLeft: 0 };
          }
          return { ...prev, timeLeft: prev.timeLeft - 1 };
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [gameStatus, levelCompleted]);

  const handleCellClick = (cell: Cell) => {
    if (gameStatus !== 'playing' || levelCompleted) return;

    setGameState((prev) => {
      const newGrid = prev.grid.map((row) =>
        row.map((c) => (c.id === cell.id ? { ...c, selected: !c.selected } : c))
      );

      const selectedCells = newGrid
        .flat()
        .filter((c) => c.selected)
        .map((c) => ({ ...c }));

      const result = calculateResult(
        selectedCells.map((c) => c.value),
        prev.operation
      );

      if (result === prev.target) {
        const newScore = prev.score + 10;
        const levelComplete = newScore >= prev.level * 30;

        if (levelComplete) {
          setLevelCompleted(true);
          saveLevelProgress(prev.level, newScore);
          return {
            ...prev,
            grid: newGrid.map((row) =>
              row.map((c) => ({
                ...c,
                selected: false,
              }))
            ),
            score: newScore,
          };
        }

        // Generate new target with existing numbers
        const target = generateTarget(
          prev.grid.map((row) => row.map((c) => c.value)),
          prev.operation
        );
        const possibleCombinations = findPossibleCombinations(
          prev.grid.flat().map((c) => c.value),
          target,
          prev.operation
        );

        return {
          ...prev,
          grid: newGrid.map((row) =>
            row.map((c) => ({
              ...c,
              selected: false,
            }))
          ),
          target,
          selectedCells: [],
          score: newScore,
          possibleCombinations,
        };
      }

      return {
        ...prev,
        grid: newGrid,
        selectedCells,
      };
    });
  };

  const goHome = () => {
    setGameStatus('idle');
    setLevelCompleted(false);
  };

  const retryLevel = () => {
    initializeGame(gameState.level);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-purple-50 flex flex-col items-center justify-center p-8">
      <div className="max-w-4xl w-full bg-white rounded-2xl shadow-xl p-8">
        <div className="flex items-center justify-center gap-2 mb-8">
          <Brain className="w-8 h-8 text-blue-500" />
          <br>
          <h3 className="text-3xl text-blue-800"> Edit by Nagarjun </h3>
          </br>
          <h1 className="text-3xl font-bold text-gray-800"> Math Puzzle </h1>
          
        </div>

        {gameStatus === 'idle' ? (
          <LevelPreview 
            levels={levels} 
            onStart={() => initializeGame(1)} 
            completedLevels={completedLevels}
          />
        ) : (
          <>
            <GameInfo
              target={gameState.target}
              score={gameState.score}
              timeLeft={gameState.timeLeft}
              level={gameState.level}
              operation={gameState.operation}
            />
            <Grid grid={gameState.grid} onCellClick={handleCellClick} />
            {gameState.possibleCombinations && !levelCompleted && (
              <PossibleCombinations
                combinations={gameState.possibleCombinations}
                operation={gameState.operation}
                target={gameState.target}
              />
            )}

            {levelCompleted && (
              <div className="mt-8 text-center bg-green-50 p-6 rounded-lg">
                <h2 className="text-2xl font-bold text-green-800 mb-4">Level {gameState.level} Completed!</h2>
                <p className="text-lg text-green-700 mb-6">Score: {gameState.score}</p>
                <div className="flex justify-center gap-4">
                  <button
                    onClick={goHome}
                    className="px-6 py-3 bg-gray-500 text-white rounded-lg font-semibold hover:bg-gray-600 transition-colors flex items-center gap-2"
                  >
                    <Home className="w-5 h-5" />
                    Home
                  </button>
                  <button
                    onClick={retryLevel}
                    className="px-6 py-3 bg-yellow-500 text-white rounded-lg font-semibold hover:bg-yellow-600 transition-colors flex items-center gap-2"
                  >
                    <RotateCcw className="w-5 h-5" />
                    Retry Level
                  </button>
                  {gameState.level < 12 && (
                    <button
                      onClick={nextLevel}
                      className="px-6 py-3 bg-blue-500 text-white rounded-lg font-semibold hover:bg-blue-600 transition-colors flex items-center gap-2"
                    >
                      Next Level
                      <ArrowRight className="w-5 h-5" />
                    </button>
                  )}
                </div>
              </div>
            )}
          </>
        )}

        {gameStatus === 'gameOver' && !levelCompleted && (
          <div className="mt-8 text-center">
            <h2 className="text-2xl font-bold mb-4">Game Over!</h2>
            <p className="text-xl mb-4">Final Score: {gameState.score}</p>
            <p className="text-lg mb-6">You reached Level {gameState.level}!</p>
            <div className="flex justify-center gap-4">
              <button
                onClick={goHome}
                className="px-6 py-3 bg-gray-500 text-white rounded-lg font-semibold hover:bg-gray-600 transition-colors flex items-center gap-2"
              >
                <Home className="w-5 h-5" />
                Home
              </button>
              <button
                onClick={retryLevel}
                className="px-6 py-3 bg-blue-500 text-white rounded-lg font-semibold hover:bg-blue-600 transition-colors flex items-center gap-2"
              >
                <RotateCcw className="w-5 h-5" />
                Try Again
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
