import React from 'react';
import { ChevronLeft, ChevronRight, KeyRound, Map, MapPin, Pause } from 'lucide-react';

interface ControlsProps {
  onPrevious: () => void;
  onNext: () => void;
  onPause: () => void;
  onHint?: () => void;
  isPaused: boolean;
}

const Controls: React.FC<ControlsProps> = ({
  onPrevious,
  onNext,
  onPause,
  onHint,
  isPaused,
}) => {
  return (
    <div className="w-full py-6">
      <div className="flex justify-center space-x-4 mb-4">
        <button
          onClick={onPrevious}
          className="w-12 h-12 rounded-full border border-gray-300 flex items-center justify-center text-gray-500 hover:bg-gray-100"
        >
          <ChevronLeft size={20} />
        </button>
        
        <button
          onClick={onPause}
          className="w-14 h-14 rounded-full bg-gray-500 flex items-center justify-center text-white"
        >
          <Pause size={24} />
        </button>
        
        <button
          onClick={onNext}
          className="w-12 h-12 rounded-full border border-gray-300 flex items-center justify-center text-gray-500 hover:bg-gray-100"
        >
          <ChevronRight size={20} />
        </button>
      </div>
      
      <div className="flex justify-center space-x-4">
        <button className="w-12 h-12 rounded border border-gray-300 flex items-center justify-center text-gray-500">
          <Map size={16} />
        </button>
        
        <button className="w-12 h-12 rounded border border-gray-300 flex items-center justify-center text-gray-500">
          <MapPin size={16} />
        </button>
        
        <button 
          onClick={onHint}
          className="w-12 h-12 rounded border border-gray-300 flex items-center justify-center text-gray-500"
        >
          <KeyRound size={16} />
        </button>
      </div>
    </div>
  );
};

export default Controls;
