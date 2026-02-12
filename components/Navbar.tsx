
import React from 'react';

interface NavbarProps {
  currentView: 'home' | 'workspace';
  onNavigate: (view: 'home' | 'workspace', targetId?: string) => void;
}

const Navbar: React.FC<NavbarProps> = ({ currentView, onNavigate }) => {
  return (
    <nav className="fixed w-full z-50 top-0 px-6 py-4">
      <div className="max-w-7xl mx-auto dark-glass rounded-2xl px-6 py-3 flex items-center justify-between shadow-2xl">
        <button 
          onClick={() => onNavigate('home')}
          className="flex items-center gap-2 hover:opacity-80 transition-opacity"
        >
          <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <span className="text-xl font-bold tracking-tight text-white">Excelconverter</span>
        </button>
        
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-300">
          <button 
            onClick={() => onNavigate('home', 'features')} 
            className="hover:text-orange-500 transition-colors"
          >
            Features
          </button>
          <button 
            onClick={() => onNavigate('workspace', 'converter-section')} 
            className="hover:text-orange-500 transition-colors"
          >
            Online Converter
          </button>
          <button 
            onClick={() => onNavigate('workspace', 'ai-section')} 
            className="hover:text-orange-500 transition-colors"
          >
            AI Help
          </button>
          
          <button 
            onClick={() => onNavigate('workspace', 'converter-section')}
            className="bg-orange-500 text-white px-5 py-2 rounded-full hover:bg-orange-600 transition-all shadow-lg shadow-orange-500/20"
          >
            {currentView === 'home' ? 'Launch Tool' : 'New Task'}
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
