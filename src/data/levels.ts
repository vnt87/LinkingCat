import { Level, ColorType } from '../types/game';

const generateEndpoints = (
  positions: [number, number, number, number][],
  colors: ColorType[],
  gridSize: number
): Level => {
  return {
    id: 0,
    gridSize,
    endpoints: positions.map((pos, idx) => [
      {
        position: { row: pos[0], col: pos[1] },
        color: colors[idx],
        isConnected: false,
      },
      {
        position: { row: pos[2], col: pos[3] },
        color: colors[idx],
        isConnected: false,
      },
    ]).flat(),
  };
};

export const levels: Level[] = [
  // Level 1: 5x5 with 3 flows
  generateEndpoints(
    [
      [0, 0, 4, 2], // red
      [0, 2, 2, 4], // blue
      [2, 0, 4, 4], // green
    ],
    ['red', 'blue', 'green'],
    5
  ),
  
  // Level 2: 5x5 with 4 flows
  generateEndpoints(
    [
      [0, 0, 4, 0], // red
      [0, 4, 4, 4], // blue
      [1, 2, 3, 2], // green
      [2, 1, 2, 3], // yellow
    ],
    ['red', 'blue', 'green', 'yellow'],
    5
  ),
  
  // Level 3: 6x6 with 5 flows
  generateEndpoints(
    [
      [0, 0, 5, 3], // red
      [0, 3, 3, 0], // blue
      [1, 5, 5, 1], // green
      [2, 2, 4, 4], // yellow
      [3, 5, 5, 5], // purple
    ],
    ['red', 'blue', 'green', 'yellow', 'purple'],
    6
  ),
  
  // Level 4: 7x7 with 7 flows (like the reference image)
  generateEndpoints(
    [
      [0, 2, 2, 4], // blue
      [0, 4, 2, 6], // purple
      [1, 3, 5, 5], // red
      [1, 1, 5, 2], // yellow
      [2, 0, 7, 0], // orange
      [4, 0, 4, 6], // teal
      [7, 2, 7, 6], // pink
    ],
    ['blue', 'purple', 'red', 'yellow', 'orange', 'teal', 'pink'],
    8
  ),
];

export default levels;
