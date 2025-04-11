import React from 'react';
import { ColorType } from '../types/game';

interface ColorDotProps {
  color: ColorType;
  size?: 'small' | 'large';
  isEndpoint?: boolean;
  onClick?: () => void;
}

const colorMap: Record<ColorType, string> = {
  red: 'bg-rose-500',
  blue: 'bg-blue-500',
  green: 'bg-emerald-400',
  yellow: 'bg-yellow-400',
  purple: 'bg-purple-400',
  orange: 'bg-orange-400',
  teal: 'bg-teal-400',
  pink: 'bg-pink-400'
};

const ColorDot: React.FC<ColorDotProps> = ({ 
  color, 
  size = 'large',
  isEndpoint = true,
  onClick 
}) => {
  const sizeClass = size === 'large' ? 'w-5 h-5' : 'w-3 h-3';
  
  return (
    <div 
      className={`rounded-full ${colorMap[color]} ${sizeClass} ${isEndpoint ? 'z-10' : 'z-5'}`}
      onClick={onClick}
    />
  );
};

export default ColorDot;
