export type ColorType = 
  | 'red' 
  | 'blue' 
  | 'green' 
  | 'yellow' 
  | 'purple' 
  | 'orange' 
  | 'teal' 
  | 'pink';

export interface Cell {
  row: number;
  col: number;
}

export interface Endpoint {
  position: Cell;
  color: ColorType;
  isConnected: boolean;
}

export interface Path {
  color: ColorType;
  cells: Cell[];
  isComplete: boolean;
}

export interface Level {
  id: number;
  gridSize: number;
  endpoints: Endpoint[];
}
