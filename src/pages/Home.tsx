import React from 'react';
import { Link } from 'react-router-dom';
import { Grid2x2, Info, Play, Settings, Trophy } from 'lucide-react';

const Home: React.FC = () => {
  return (
    <div className="flex flex-col h-full bg-gradient-to-b from-blue-50 to-purple-50">
      <header className="p-6 pt-12 text-center">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">Flow Puzzle</h1>
        <p className="text-gray-600 mt-2">Connect matching colors</p>
      </header>
      
      <main className="flex-1 flex flex-col items-center justify-center p-6 gap-6">
        <Link 
          to="/game/0" 
          className="w-full max-w-xs bg-gradient-to-r from-blue-500 to-purple-500 text-white py-4 rounded-full flex items-center justify-center text-xl font-semibold shadow-lg"
        >
          <Play size={24} className="mr-2" />
          Play Now
        </Link>
        
        <Link 
          to="/levels" 
          className="w-full max-w-xs bg-white text-gray-800 py-4 rounded-full flex items-center justify-center text-xl font-semibold shadow border"
        >
          <Grid2x2 size={24} className="mr-2" />
          Levels
        </Link>
        
        <div className="w-full max-w-xs mt-6 flex justify-between">
          <button className="w-16 h-16 bg-white rounded-full shadow flex items-center justify-center">
            <Settings size={24} className="text-gray-600" />
          </button>
          
          <button className="w-16 h-16 bg-white rounded-full shadow flex items-center justify-center">
            <Trophy size={24} className="text-gray-600" />
          </button>
          
          <button className="w-16 h-16 bg-white rounded-full shadow flex items-center justify-center">
            <Info size={24} className="text-gray-600" />
          </button>
        </div>
      </main>
      
      <footer className="p-4 text-center text-sm text-gray-500">
        Inspired by Flow Free &copy; 2012
      </footer>
    </div>
  );
};

export default Home;
