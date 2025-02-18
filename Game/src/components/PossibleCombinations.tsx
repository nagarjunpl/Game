import React from 'react';

interface PossibleCombinationsProps {
  combinations: number[][];
  operation: '+' | '-' | '*' | '/';
  target: number;
}

export const PossibleCombinations: React.FC<PossibleCombinationsProps> = ({
  combinations,
  operation,
  target
}) => {
  if (combinations.length === 0) return null;

  return (
    <div className="mt-4 p-4 bg-blue-50 rounded-lg">
      <h3 className="text-sm font-semibold text-blue-800 mb-2">
        Possible Solutions (showing {combinations.length}):
      </h3>
      <div className="space-y-1">
        {combinations.map((combo, index) => (
          <div key={index} className="text-sm text-blue-600">
            {combo.join(` ${operation} `)} = {target}
          </div>
        ))}
      </div>
    </div>
  );
};