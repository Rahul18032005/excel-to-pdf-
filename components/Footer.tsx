
import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-[#1a2e1a] text-white py-20 px-6">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between gap-12">
        <div className="max-w-xs">
          <div className="flex items-center gap-2 mb-6">
            <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <span className="text-xl font-bold tracking-tight">Excelconverter</span>
          </div>
          <p className="text-green-200/60 text-sm leading-relaxed">
            Empowering data analysts and researchers with high-performance tools for document automation.
          </p>
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-12">
          <div>
            <h4 className="font-bold mb-4">Resources</h4>
            <ul className="text-sm text-green-200/60 space-y-2">
              <li><a href="#" className="hover:text-white transition-colors">Documentation</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Tutorials</a></li>
              <li><a href="#" className="hover:text-white transition-colors">API Reference</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-4">Company</h4>
            <ul className="text-sm text-green-200/60 space-y-2">
              <li><a href="#" className="hover:text-white transition-colors">About</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Security</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Terms</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-4">Community</h4>
            <ul className="text-sm text-green-200/60 space-y-2">
              <li><a href="#" className="hover:text-white transition-colors">GitHub</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Discord</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Contribute</a></li>
            </ul>
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto border-t border-white/10 mt-20 pt-8 text-center text-xs text-green-200/40">
        © 2024 Excelconverter. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
