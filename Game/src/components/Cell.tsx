import React from 'react';
import { Cell as CellType } from '../types';

interface CellProps {
  cell: CellType;
  onClick: (cell: CellType) => void;
}

export const Cell: React.FC<CellProps> = ({ cell, onClick }) => {
  return (
    <button
      onClick={() => onClick(cell)}
      className={`
        w-16 h-16 m-1 text-xl font-bold rounded-lg
        transition-all duration-200 transform hover:scale-105
        ${cell.selected 
          ? 'bg-white-500 text-white shadow-lg scale-105' 
          : 'bg-blue text-gray-800 shadow-md hover:shadow-lg'
        }
        disabled:opacity-50 disabled:cursor-not-allowed
      `}
    >
      {cell.value}
    </button>
  );
};
