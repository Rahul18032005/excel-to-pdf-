
import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import FeatureGrid from './components/FeatureGrid';
import AIAssistant from './components/AIAssistant';
import WebConverter from './components/WebConverter';
import Footer from './components/Footer';

const App: React.FC = () => {
  const [view, setView] = useState<'home' | 'workspace'>('home');
  const [format, setFormat] = useState<'excel' | 'word'>('excel');
  const [pendingScroll, setPendingScroll] = useState<string | null>(null);
  const [workspaceKey, setWorkspaceKey] = useState(0);
  const [lastError, setLastError] = useState<string | null>(null);

  useEffect(() => {
    if (pendingScroll) {
      const element = document.getElementById(pendingScroll);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        setPendingScroll(null);
      }
    }
  }, [view, pendingScroll]);

  const navigateTo = (targetView: 'home' | 'workspace', targetId?: string) => {
    if (view !== targetView) {
      setView(targetView);
      if (targetId) {
        setPendingScroll(targetId);
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    } else {
      if (targetId) {
        const element = document.getElementById(targetId);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
        if (targetId === 'converter-section' && view === 'workspace') {
          setWorkspaceKey(prev => prev + 1);
          setLastError(null);
        }
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
  };

  const renderHome = () => (
    <>
      <Hero onNavigate={() => navigateTo('workspace', 'converter-section')} />
      <section id="features" className="py-24 bg-[#0f172a] scroll-mt-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4 text-white uppercase tracking-tighter">Core Technologies</h2>
            <p className="text-slate-400 max-w-2xl mx-auto font-medium">
              A precision-engineered stack designed for high-fidelity document reproduction and data hygiene.
            </p>
          </div>
          <FeatureGrid />
        </div>
      </section>
      <Footer />
    </>
  );

  const renderWorkspace = () => (
    <div className="pt-32 pb-24 bg-[#0f172a] min-h-screen">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12">
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2 text-sm text-slate-500">
              <button onClick={() => navigateTo('home')} className="hover:text-orange-500 transition-colors uppercase font-bold tracking-widest text-[10px]">System</button>
              <span>/</span>
              <span className="text-orange-500 font-bold uppercase tracking-wider text-[10px]">Processing Unit</span>
            </div>
            <h1 className="text-4xl font-black text-white tracking-tighter">DATA EXTRACTION HUB</h1>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div id="converter-section" className="lg:col-span-2 space-y-8 scroll-mt-32">
            <WebConverter 
              key={workspaceKey} 
              format={format} 
              setFormat={setFormat} 
              onErrorUpdate={setLastError}
            />
          </div>
          <div id="ai-section" className="lg:col-span-1 h-fit sticky top-32 scroll-mt-32">
            <AIAssistant errorState={lastError} />
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col transition-all duration-300 bg-[#0f172a]">
      <Navbar currentView={view} onNavigate={navigateTo} />
      <main className="flex-grow">
        {view === 'home' ? renderHome() : renderWorkspace()}
      </main>
      {view === 'workspace' && <Footer />}
    </div>
  );
};

export default App;
