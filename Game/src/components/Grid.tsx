import React from 'react';
import { Cell as CellType } from '../types';
import { Cell } from './Cell';

interface GridProps {
  grid: CellType[][];
  onCellClick: (cell: CellType) => void;
}

export const Grid: React.FC<GridProps> = ({ grid, onCellClick }) => {
  return (
    <div className="grid gap-2 p-4 bg-gray-100 rounded-xl shadow-inner">
      {grid.map((row, i) => (
        <div key={i} className="flex justify-center">
          {row.map((cell) => (
            <Cell key={cell.id} cell={cell} onClick={onCellClick} />
          ))}
        </div>
      ))}
    </div>
  );
};