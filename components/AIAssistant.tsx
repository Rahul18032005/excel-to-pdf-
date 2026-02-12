
import React, { useState, useRef, useEffect } from 'react';

interface AIAssistantProps {
  errorState?: string | null;
}

const AIAssistant: React.FC<AIAssistantProps> = ({ errorState }) => {
  const [messages, setMessages] = useState<{ role: 'user' | 'ai'; text: string }[]>([
    { role: 'ai', text: 'System Guide active. I can assist with your document conversion parameters.' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const errorAcknowledged = useRef<string | null>(null);

  // Static response logic to replace Gemini
  const getStaticResponse = (query: string): string => {
    const q = query.toLowerCase();
    if (q.includes('error') || q.includes('fail')) {
      return "I recommend verifying the PDF structure. If the extraction fails, try flattening the PDF or ensuring it's not password protected.";
    }
    if (q.includes('excel') || q.includes('word')) {
      return "The system uses high-fidelity extraction for both formats. Excel is optimized for tabular data, while Word preserves layout structures.";
    }
    if (q.includes('how') || q.includes('help')) {
      return "Upload your document in the Processing Unit, select your target format (.XLSX or .DOCX), and initiate the conversion.";
    }
    return "Command received. The system is operating within normal parameters. Please proceed with your document conversion.";
  };

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages]);

  // Proactive error help
  useEffect(() => {
    if (errorState && errorState !== errorAcknowledged.current) {
      errorAcknowledged.current = errorState;
      setMessages(prev => [
        ...prev,
        { role: 'ai', text: `SYSTEM_ALERT: Detected an extraction anomaly. Status: "${errorState}".\n\nSuggested Protocol:\n1. Check document integrity.\n2. Verify format compatibility.\n3. Retry the operation.` }
      ]);
    }
  }, [errorState]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;
    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMessage }]);
    setLoading(true);

    // Simulate processing time
    setTimeout(() => {
      const response = getStaticResponse(userMessage);
      setMessages(prev => [...prev, { role: 'ai', text: response }]);
      setLoading(false);
    }, 600);
  };

  return (
    <div className="w-full h-[600px] flex flex-col bg-slate-900 rounded-[2rem] border border-slate-800 shadow-2xl overflow-hidden">
      <div className="bg-slate-950 border-b border-slate-800 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={`w-3 h-3 rounded-full ${loading ? 'bg-orange-500 animate-pulse' : 'bg-orange-500'} shadow-[0_0_8px_#f97316]`}></div>
          <span className="font-bold text-white uppercase tracking-tighter text-sm">System Guide</span>
        </div>
        <span className="text-[10px] uppercase tracking-widest text-slate-500 font-black">Link_Status: Active</span>
      </div>

      <div ref={scrollRef} className="flex-grow p-6 overflow-y-auto space-y-4 bg-slate-900/50 scrollbar-hide">
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] p-4 rounded-2xl ${m.role === 'user'
                ? 'bg-orange-500 text-white rounded-tr-none shadow-lg shadow-orange-500/10 font-medium'
                : 'bg-slate-800 border border-slate-700 text-slate-200 rounded-tl-none shadow-md font-medium'
              }`}>
              <p className="text-sm leading-relaxed whitespace-pre-wrap">{m.text}</p>
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-slate-800 border border-slate-700 p-4 rounded-2xl rounded-tl-none flex gap-1">
              <div className="w-1.5 h-1.5 bg-slate-500 rounded-full animate-bounce"></div>
              <div className="w-1.5 h-1.5 bg-slate-500 rounded-full animate-bounce delay-100"></div>
              <div className="w-1.5 h-1.5 bg-slate-500 rounded-full animate-bounce delay-200"></div>
            </div>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="p-4 bg-slate-950 border-t border-slate-800">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Transmit command..."
            className="flex-grow bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-orange-500 transition-all font-mono"
          />
          <button type="submit" disabled={loading} className="bg-orange-500 text-white px-4 rounded-xl hover:bg-orange-600 shadow-lg shadow-orange-500/20 disabled:opacity-50 transition-all">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </button>
        </div>
      </form>
    </div>
  );
};

export default AIAssistant;
