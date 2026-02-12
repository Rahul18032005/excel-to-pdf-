
import React from 'react';

interface HeroProps {
  onNavigate: () => void;
}

const Hero: React.FC<HeroProps> = ({ onNavigate }) => {
  const scrollToMethodology = () => {
    const element = document.getElementById('features');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative pt-32 pb-20 overflow-hidden bg-[#0f172a]">
      <div className="max-w-7xl mx-auto px-6">
        <div className="relative rounded-[2.5rem] overflow-hidden hero-gradient p-12 md:p-24 flex flex-col items-start gap-8 min-h-[600px] justify-center shadow-2xl">
          {/* Background Image Overlay - Car Interior Theme */}
          <div className="absolute inset-0 opacity-60 mix-blend-overlay">
            <img 
              src="https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&q=80&w=2000" 
              alt="Premium dashboard" 
              className="w-full h-full object-cover"
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-900/40 to-transparent"></div>
          
          <div className="relative z-10 max-w-2xl text-left">
            <span className="text-orange-500 font-semibold tracking-wider uppercase text-sm mb-4 block">Performance Driven Data</span>
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
              Convert PDFs with High-Octane Speed
            </h1>
            <p className="text-lg text-gray-300 mb-8 leading-relaxed">
              Precision-tuned extraction engine for your most complex documents. Turbocharge your workflow from static PDF to dynamic Excel sheets in seconds.
            </p>
            
            <div className="flex flex-wrap gap-4">
              <button 
                onClick={onNavigate}
                className="bg-orange-500 text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-orange-600 transition-all flex items-center gap-2 shadow-lg shadow-orange-500/20"
              >
                Launch Converter
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </button>
              <button 
                onClick={scrollToMethodology}
                className="bg-white/10 backdrop-blur-md text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-white/20 transition-all border border-white/10"
              >
                Learn Methodology
              </button>
            </div>
          </div>
          
          {/* Dashboard Inspired Stats */}
          <div className="relative z-10 mt-auto pt-12 flex gap-12 text-white border-t border-white/10 w-full">
            <div>
              <p className="text-3xl font-bold text-orange-500">30ms</p>
              <p className="text-xs text-gray-400 uppercase tracking-widest">Latency</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-orange-500">99.9%</p>
              <p className="text-xs text-gray-400 uppercase tracking-widest">Accuracy</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-orange-500">v4.2</p>
              <p className="text-xs text-gray-400 uppercase tracking-widest">Engine</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
