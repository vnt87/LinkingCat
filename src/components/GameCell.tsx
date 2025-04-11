import React from 'react';
import { Cell } from '../types/game';
import ColorDot from './ColorDot';

interface GameCellProps {
  row: number;
  col: number;
  hasEndpoint: boolean;
  endpointColor?: string;
  pathColor?: string;
  isHighlighted: boolean;
  onCellEnter: (cell: Cell) => void;
  onCellDown: (cell: Cell) => void;
  onCellUp: () => void;
}

const GameCell: React.FC<GameCellProps> = ({
  row,
  col,
  hasEndpoint,
  endpointColor,
  pathColor,
  isHighlighted,
  onCellEnter,
  onCellDown,
  onCellUp,
}) => {
  const handleMouseEnter = () => {
    onCellEnter({ row, col });
  };

  const handleMouseDown = () => {
    onCellDown({ row, col });
  };

  const handleMouseUp = () => {
    onCellUp();
  };

  return (
    <div
      className={`border border-gray-200 flex items-center justify-center
        ${pathColor ? `bg-${pathColor}-100` : ''}
        ${isHighlighted ? 'bg-gray-100' : ''}`}
      onMouseEnter={handleMouseEnter}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onTouchStart={() => onCellDown({ row, col })}
      onTouchMove={(e) => {
        const touch = e.touches[0];
        const element = document.elementFromPoint(touch.clientX, touch.clientY);
        const cellElement = element?.closest('.cell');
        if (cellElement) {
          const cellRow = parseInt(cellElement.getAttribute('data-row') || '0');
          const cellCol = parseInt(cellElement.getAttribute('data-col') || '0');
          onCellEnter({ row: cellRow, col: cellCol });
        }
      }}
      onTouchEnd={onCellUp}
      data-row={row}
      data-col={col}
      className="cell"
    >
      {hasEndpoint && endpointColor && (
        <ColorDot color={endpointColor as any} isEndpoint={true} />
      )}
    </div>
  );
};

export default GameCell;
