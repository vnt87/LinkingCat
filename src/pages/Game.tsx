import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import GameBoard from '../components/GameBoard';
import Stats from '../components/Stats';
import Controls from '../components/Controls';
import PauseMenu from '../components/PauseMenu';
import { Path, ColorType } from '../types/game';
import levels from '../data/levels';

const Game: React.FC = () => {
  const { levelId } = useParams<{ levelId: string }>();
  const navigate = useNavigate();
  
  const level = levels[Number(levelId) || 0] || levels[0];
  
  const [paths, setPaths] = useState<Path[]>([]);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [coins, setCoins] = useState(640); // Mock value from the reference image
  
  const timerRef = useRef<number | null>(null);
  
  useEffect(() => {
    // Reset game state when level changes
    setPaths([]);
    setTimeElapsed(0);
    setIsPaused(false);
    setIsCompleted(false);
  }, [levelId]);
  
  useEffect(() => {
    if (!isPaused && !isCompleted) {
      timerRef.current = window.setInterval(() => {
        setTimeElapsed(prev => prev + 1);
      }, 1000);
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPaused, isCompleted]);
  
  const handlePathComplete = (color: ColorType) => {
    // Calculate points based on time and grid size
    const pointsEarned = Math.max(10, 100 - timeElapsed);
    setCoins(prev => prev + pointsEarned);
  };
  
  const handlePuzzleComplete = () => {
    setIsCompleted(true);
    // Add completion logic here - celebration, stats saving, etc.
    
    // Save best time to localStorage
    const bestTimes = JSON.parse(localStorage.getItem('flowBestTimes') || '{}');
    const currentBest = bestTimes[levelId || '0'] || Infinity;
    
    if (timeElapsed < currentBest) {
      bestTimes[levelId || '0'] = timeElapsed;
      localStorage.setItem('flowBestTimes', JSON.stringify(bestTimes));
    }
    
    // Bonus points for completion
    setCoins(prev => prev + 100);
    
    // After a delay, offer to go to next level
    setTimeout(() => {
      if (confirm('Level completed! Continue to next level?')) {
        const nextLevelId = (Number(levelId) || 0) + 1;
        if (nextLevelId < levels.length) {
          navigate(`/game/${nextLevelId}`);
        } else {
          navigate('/levels');
        }
      }
    }, 1500);
  };
  
  const handlePause = () => {
    setIsPaused(prev => !prev);
  };
  
  const handleRestartLevel = () => {
    setPaths([]);
    setTimeElapsed(0);
    setIsPaused(false);
    setIsCompleted(false);
  };
  
  const handlePrevLevel = () => {
    const prevLevelId = Math.max(0, (Number(levelId) || 0) - 1);
    navigate(`/game/${prevLevelId}`);
  };
  
  const handleNextLevel = () => {
    const nextLevelId = Math.min(levels.length - 1, (Number(levelId) || 0) + 1);
    navigate(`/game/${nextLevelId}`);
  };
  
  return (
    <div className="flex flex-col h-full bg-gray-50 py-4">
      <div className="p-4">
        <Stats 
          timeElapsed={timeElapsed}
          paths={paths}
          totalFlows={level.endpoints.length / 2}
          coins={coins}
        />
      </div>
      
      <div className="flex-1 flex justify-center px-4">
        <GameBoard
          gridSize={level.gridSize}
          endpoints={level.endpoints}
          onPathComplete={handlePathComplete}
          onPuzzleComplete={handlePuzzleComplete}
          paths={paths}
          setPaths={setPaths}
        />
      </div>
      
      <div className="p-4">
        <Controls
          onPrevious={handlePrevLevel}
          onNext={handleNextLevel}
          onPause={handlePause}
          isPaused={isPaused}
        />
      </div>
      
      {isPaused && (
        <PauseMenu
          onResume={() => setIsPaused(false)}
          onRestart={handleRestartLevel}
          timeElapsed={timeElapsed}
        />
      )}
    </div>
  );
};

export default Game;
