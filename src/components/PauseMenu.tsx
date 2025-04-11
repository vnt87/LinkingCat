import React from 'react';
import { House, Play, RotateCcw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface PauseMenuProps {
  onResume: () => void;
  onRestart: () => void;
  timeElapsed: number;
}

const PauseMenu: React.FC<PauseMenuProps> = ({ onResume, onRestart, timeElapsed }) => {
  const navigate = useNavigate();
  
  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600).toString().padStart(2, '0');
    const mins = Math.floor((seconds % 3600) / 60).toString().padStart(2, '0');
    const secs = Math.floor(seconds % 60).toString().padStart(2, '0');
    return `${hrs}:${mins}:${secs}`;
  };
  
  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 w-4/5 max-w-sm">
        <h2 className="text-2xl font-bold text-center mb-4">Game Paused</h2>
        <p className="text-center text-gray-600 mb-6">
          Time: {formatTime(timeElapsed)}
        </p>
        
        <div className="flex justify-around mb-6">
          <button 
            onClick={onResume}
            className="flex flex-col items-center"
          >
            <div className="w-12 h-12 rounded-full bg-blue-500 flex items-center justify-center text-white mb-2">
              <Play size={24} />
            </div>
            <span className="text-sm">Resume</span>
          </button>
          
          <button 
            onClick={onRestart}
            className="flex flex-col items-center"
          >
            <div className="w-12 h-12 rounded-full bg-yellow-500 flex items-center justify-center text-white mb-2">
              <RotateCcw size={24} />
            </div>
            <span className="text-sm">Restart</span>
          </button>
          
          <button 
            onClick={() => navigate('/')}
            className="flex flex-col items-center"
          >
            <div className="w-12 h-12 rounded-full bg-gray-500 flex items-center justify-center text-white mb-2">
              <House size={24} />
            </div>
            <span className="text-sm">House</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default PauseMenu;
