export const generateGrid = (level: number): number[][] => {
  const grid: number[][] = [];
  // Adjust number range based on level
  const maxNumber = Math.min(10 + level * 5, 50); // Increases with level, caps at 50
  
  for (let i = 0; i < 5; i++) {
    const row: number[] = [];
    for (let j = 0; j < 5; j++) {
      row.push(Math.floor(Math.random() * maxNumber) + 1);
    }
    grid.push(row);
  }
  return grid;
};

export const calculateResult = (numbers: number[], operation: '+' | '-' | '*' | '/'): number => {
  if (numbers.length === 0) return 0;
  
  let result = numbers[0];
  for (let i = 1; i < numbers.length; i++) {
    switch (operation) {
      case '+':
        result += numbers[i];
        break;
      case '-':
        result -= numbers[i];
        break;
      case '*':
        result *= numbers[i];
        break;
      case '/':
        if (numbers[i] !== 0) {
          result /= numbers[i];
        }
        break;
    }
  }
  return Math.round(result * 100) / 100; // Round to 2 decimal places for division
};

export const findPossibleCombinations = (
  numbers: number[],
  target: number,
  operation: '+' | '-' | '*' | '/',
  maxCombinations = 5
): number[][] => {
  const combinations: number[][] = [];
  const visited = new Set<string>();

  const findCombinations = (current: number[], remaining: number[], currentResult: number) => {
    if (combinations.length >= maxCombinations) return;
    
    if (current.length >= 2) {
      if (Math.abs(currentResult - target) < 0.01) {
        const sortedComb = [...current].sort((a, b) => a - b);
        const key = sortedComb.join(',');
        if (!visited.has(key)) {
          combinations.push([...current]);
          visited.add(key);
        }
      }
    }

    if (current.length >= 4) return;

    for (let i = 0; i < remaining.length; i++) {
      const num = remaining[i];
      const newRemaining = [...remaining.slice(0, i), ...remaining.slice(i + 1)];
      const newCurrent = [...current, num];
      
      let newResult = current.length === 0 ? num : currentResult;
      if (current.length > 0) {
        switch (operation) {
          case '+': newResult += num; break;
          case '-': newResult -= num; break;
          case '*': newResult *= num; break;
          case '/': if (num !== 0) newResult /= num; break;
        }
      }
      
      findCombinations(newCurrent, newRemaining, newResult);
    }
  };

  findCombinations([], numbers, 0);
  return combinations;
};

export const generateTarget = (grid: number[][], operation: '+' | '-' | '*' | '/'): number => {
  const flatGrid = grid.flat();
  const numbers: number[] = [];
  
  // Select 2-3 random numbers from the grid
  const count = Math.floor(Math.random() * 2) + 2;
  for (let i = 0; i < count; i++) {
    const index = Math.floor(Math.random() * flatGrid.length);
    numbers.push(flatGrid[index]);
  }
  
  // For division, ensure we get a nice round number
  if (operation === '/') {
    numbers.sort((a, b) => b - a); // Sort in descending order for division
    return Math.round(calculateResult(numbers, operation) * 100) / 100;
  }
  
  return calculateResult(numbers, operation);
};

export const getOperationForLevel = (level: number): '+' | '-' | '*' | '/' => {
  if (level <= 3) return '+';
  if (level <= 6) return '-';
  if (level <= 9) return '*';
  return '/';
};

export const getLevelInfo = (level: number): LevelInfo => {
  const operation = getOperationForLevel(level);
  const pointsToComplete = 30;
  
  let description = '';
  if (level <= 3) {
    description = 'Addition: Find numbers that add up to the target';
  } else if (level <= 6) {
    description = 'Subtraction: Find numbers that subtract to the target';
  } else if (level <= 9) {
    description = 'Multiplication: Find numbers that multiply to the target';
  } else {
    description = 'Division: Find numbers that divide to the target';
  }

  return {
    level,
    operation,
    description,
    pointsToComplete
  };
};