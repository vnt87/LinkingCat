import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import Home from './pages/Home';
import Game from './pages/Game';
import LevelSelect from './pages/LevelSelect';
import './index.css'

const App = () => {
  useEffect(() => {
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);
    
    // Update page title
    document.title = 'Flow Puzzle Game';
    
    return () => {
      document.head.removeChild(link);
    };
  }, []);

  return (
    <Router>
      <div className="fixed inset-0 bg-gray-50" style={{ fontFamily: 'Inter, sans-serif' }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/game/:levelId" element={<Game />} />
          <Route path="/levels" element={<LevelSelect />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
