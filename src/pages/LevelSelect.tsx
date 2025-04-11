import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, Grid3x3 } from 'lucide-react';

const LevelSelect: React.FC = () => {
  return (
    <div className="flex flex-col h-full bg-gray-50">
      <header className="p-4 flex items-center border-b">
        <Link to="/" className="text-gray-600">
          <ChevronLeft size={24} />
        </Link>
        <h1 className="text-xl font-semibold mx-auto">Select Level</h1>
      </header>
      
      <main className="flex-1 p-4 overflow-auto">
        <div className="grid grid-cols-4 gap-4">
          {Array.from({ length: 16 }).map((_, index) => (
            <Link 
              key={index}
              to={`/game/${index}`}
              className={`aspect-square rounded-lg flex items-center justify-center text-lg font-bold 
              ${index < 4 ? 'bg-blue-100 text-blue-600' : 'bg-gray-200 text-gray-500'}`}
            >
              {index + 1}
            </Link>
          ))}
        </div>
        
        <div className="mt-8">
          <h2 className="text-lg font-semibold mb-4">Choose Grid3x3 Size</h2>
          <div className="flex flex-wrap gap-4">
            {[5, 6, 7, 8, 9, 10].map(size => (
              <button 
                key={size}
                className="flex items-center justify-center p-3 bg-white border rounded-lg shadow-sm"
              >
                <Grid3x3 size={16} className="mr-2" />
                <span>{size}×{size}</span>
              </button>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default LevelSelect;
