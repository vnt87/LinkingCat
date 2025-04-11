import React from 'react';
import { Path } from '../types/game';

interface StatsProps {
  timeElapsed: number;
  paths: Path[];
  totalFlows: number;
  coins: number;
}

const Stats: React.FC<StatsProps> = ({ timeElapsed, paths, totalFlows, coins }) => {
  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600).toString().padStart(2, '0');
    const mins = Math.floor((seconds % 3600) / 60).toString().padStart(2, '0');
    const secs = Math.floor(seconds % 60).toString().padStart(2, '0');
    return `${hrs}:${mins}:${secs}`;
  };

  const completedFlows = paths.filter(path => path.isComplete).length;
  const pipePercentage = paths.length > 0 
    ? Math.round((completedFlows / paths.length) * 100) 
    : 0;
  
  const bestPipe = Math.round(pipePercentage / 2); // Mock calculation for "best pipe"

  return (
    <div className="w-full text-gray-600">
      <div className="flex justify-between mb-2">
        <div className="text-center px-4 border-r border-gray-200">
          <div className="text-sm uppercase">FLOWS</div>
          <div className="text-3xl font-semibold">{completedFlows}/{totalFlows}</div>
        </div>
        
        <div className="text-center px-4 border-r border-gray-200">
          <div className="text-sm uppercase">PIPE</div>
          <div className="text-3xl font-semibold">{pipePercentage}%</div>
        </div>
        
        <div className="text-center px-4 border-r border-gray-200">
          <div className="text-sm uppercase">BEST PIPE</div>
          <div className="text-3xl font-semibold">{bestPipe}%</div>
        </div>
        
        <div className="text-center px-4 flex items-center">
          <div className="mr-2">
            <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" fill="none">
              <circle cx="12" cy="12" r="10" strokeWidth="1.5" />
              <path d="M12 6v6l4 2" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </div>
          <div className="text-3xl font-semibold">{coins}</div>
        </div>
      </div>
      
      <div className="text-center text-3xl py-4 font-mono">
        {formatTime(timeElapsed)}
      </div>
    </div>
  );
};

export default Stats;
