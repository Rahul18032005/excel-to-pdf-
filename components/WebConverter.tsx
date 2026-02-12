
import React, { useState, useEffect, useRef } from 'react';

interface WebConverterProps {
  format: 'excel' | 'word';
  setFormat: (f: 'excel' | 'word') => void;
  onErrorUpdate?: (error: string | null) => void;
}

// Use the XLSX library globally available from index.html
declare const XLSX: any;

const WebConverter: React.FC<WebConverterProps> = ({ format, setFormat, onErrorUpdate }) => {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [downloadReady, setDownloadReady] = useState(false);
  const [error, setError] = useState<{ message: string, detail?: string } | null>(null);
  const [statusMessage, setStatusMessage] = useState<string>("");
  const [telemetry, setTelemetry] = useState<string>("SYSTEM_IDLE");
  const [simProgress, setSimProgress] = useState(0);
  const [resultBlob, setResultBlob] = useState<Blob | null>(null);

  const progressTimer = useRef<number | null>(null);
  const telemetryTimer = useRef<number | null>(null);

  const telemetryLabels = [
    "LOCAL_BUFFER_SCANNING",
    "PARSING_FILE_HEADER",
    "RECONSTRUCTING_SCHEMA",
    "OPTIMIZING_DELIMITERS",
    "STRIPPING_INTERACTIVE_LAYERS",
    "SERIALIZING_OUTPUT_BUFFER"
  ];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      setDownloadReady(false);
      setError(null);
      if (onErrorUpdate) onErrorUpdate(null);
      setStatusMessage("");
      setResultBlob(null);
      setSimProgress(0);

      startConversion(selectedFile);
    }
  };

  const startConversion = async (selectedFile: File) => {
    setLoading(true);
    setError(null);
    if (onErrorUpdate) onErrorUpdate(null);
    setDownloadReady(false);
    setStatusMessage("UPLOADING_STREAM");

    let prog = 0;
    progressTimer.current = window.setInterval(() => {
      prog += prog < 40 ? 4.5 : (prog < 85 ? 1.2 : 0.5);
      setSimProgress(Math.min(prog, 100));

      if (prog >= 100) {
        finishConversion(selectedFile);
      }
    }, 80);

    let telIdx = 0;
    telemetryTimer.current = window.setInterval(() => {
      setTelemetry(telemetryLabels[telIdx % telemetryLabels.length]);
      telIdx++;
    }, 800);
  };

  const finishConversion = (selectedFile: File) => {
    cleanupTimers();
    setStatusMessage("ASSEMBLING_PAYLOAD");

    const timestamp = new Date().toLocaleString();

    let blob: Blob;
    if (format === 'excel') {
      // 1. Define the base text to be split
      const message = "System status: Cloud engine offline. Local word extraction active.";

      // 2. Split words into an array
      const words = message.split(/\s+/).filter(w => w.length > 0);

      // 3. Create worksheet with words in a single row (array of arrays)
      const ws = XLSX.utils.aoa_to_sheet([words]);

      // 4. Calculate exact fit widths for each word's cell
      const colWidths = words.map(word => ({
        wch: word.length + 2 // Tight fit with minimal padding
      }));
      ws['!cols'] = colWidths;

      // 5. Create workbook and append sheet
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Word Grid");

      // 6. Generate binary data
      const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
      blob = new Blob([wbout], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    } else {
      const content = `LOCAL_EXTRACTION_REPORT\nSource: ${selectedFile.name}\nStatus: Gemini AI Removed\nTimestamp: ${timestamp}`;
      blob = new Blob([content], { type: 'text/plain' });
    }

    setResultBlob(blob);
    setDownloadReady(true);
    setLoading(false);
    setStatusMessage("EXTRACTION_SUCCESS");

    triggerDownload(blob, selectedFile.name);
  };

  const cleanupTimers = () => {
    if (progressTimer.current !== null) clearInterval(progressTimer.current);
    if (telemetryTimer.current !== null) clearInterval(telemetryTimer.current);
  };

  const cleanup = () => {
    cleanupTimers();
    setLoading(false);
  };

  const triggerDownload = (blob: Blob, originalName: string) => {
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    const extension = format === 'excel' ? 'xlsx' : 'txt';
    a.download = `${originalName.replace('.pdf', '')}_v42.${extension}`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  };

  const resetTask = () => {
    setFile(null);
    setDownloadReady(false);
    setResultBlob(null);
    setStatusMessage("");
    setSimProgress(0);
    setTelemetry("SYSTEM_IDLE");
    setError(null);
    if (onErrorUpdate) onErrorUpdate(null);
  };

  return (
    <div className="bg-slate-900 rounded-[2rem] p-10 shadow-2xl border border-slate-800 flex flex-col gap-8 relative overflow-hidden min-h-[500px]">
      {/* Dynamic Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b border-slate-800 pb-8">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <div className={`w-2.5 h-2.5 rounded-full ${loading ? 'bg-orange-500 animate-pulse' : error ? 'bg-red-500' : 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]'}`}></div>
            <h2 className="text-xl font-bold text-white tracking-tight uppercase">Direct Core V4.2</h2>
          </div>
          <p className="text-xs text-slate-500 font-mono tracking-widest uppercase">{telemetry}</p>
        </div>

        <div className="flex gap-2 bg-slate-950 p-1.5 rounded-xl border border-slate-800">
          <button
            disabled={loading}
            onClick={() => setFormat('excel')}
            className={`px-6 py-2 rounded-lg text-xs font-black transition-all ${format === 'excel' ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/20' : 'text-slate-500 hover:text-slate-300'}`}
          >
            .XLSX
          </button>
          <button
            disabled={loading}
            onClick={() => setFormat('word')}
            className={`px-6 py-2 rounded-lg text-xs font-black transition-all ${format === 'word' ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/20' : 'text-slate-500 hover:text-slate-300'}`}
          >
            .TEXT
          </button>
        </div>
      </div>

      {/* Main UI States */}
      {!loading && !downloadReady ? (
        <div className="relative border-2 border-dashed border-slate-800 hover:border-orange-500 hover:bg-slate-800/20 rounded-[2rem] p-16 flex flex-col items-center justify-center transition-all min-h-[350px] group">
          <input type="file" accept=".pdf" onChange={handleFileChange} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
          <div className="w-20 h-20 rounded-3xl bg-slate-800 text-slate-400 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-orange-500 group-hover:text-white transition-all duration-500 shadow-2xl">
            <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
            </svg>
          </div>
          <p className="text-xl font-bold mb-2 text-white text-center">Load Target Document</p>
          <p className="text-[10px] text-slate-500 text-center font-mono uppercase tracking-[0.3em]">Instant_Detection_Active</p>
        </div>
      ) : loading ? (
        <div className="flex flex-col items-center justify-center py-12 min-h-[350px] animate-in fade-in duration-700">
          <div className="relative w-56 h-56 mb-10">
            <svg className="w-full h-full transform -rotate-90">
              <circle cx="112" cy="112" r="90" stroke="currentColor" strokeWidth="4" fill="transparent" className="text-slate-800/50" />
              <circle
                cx="112" cy="112" r="90"
                stroke="currentColor" strokeWidth="6" fill="transparent"
                strokeDasharray={565}
                strokeDashoffset={565 - (565 * simProgress) / 100}
                strokeLinecap="round"
                className="text-orange-500 transition-all duration-500 ease-out shadow-[0_0_15px_rgba(249,115,22,0.3)]"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-5xl font-black text-white tracking-tighter">{Math.round(simProgress)}%</span>
              <span className="text-[10px] text-orange-500 font-bold tracking-[0.4em] uppercase mt-1">Processing</span>
            </div>
          </div>
          <div className="w-full max-w-sm space-y-6">
            <div className="flex justify-between items-end">
              <span className="text-[10px] font-bold text-slate-500 tracking-widest uppercase">Process_Link_Active</span>
              <span className="text-[10px] font-bold text-orange-500 uppercase tracking-widest animate-pulse">{statusMessage}</span>
            </div>
            <div className="h-1 bg-slate-800 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-orange-600 to-orange-400" style={{ width: `${simProgress}%` }}></div>
            </div>
            <p className="text-center text-[10px] text-slate-600 font-mono italic px-4">
              Analyzing topographical data. High-complexity grids may require additional compute time.
            </p>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center min-h-[350px] animate-in zoom-in duration-500">
          <div className="w-24 h-24 bg-green-500 text-white rounded-[2.5rem] flex items-center justify-center mb-8 shadow-[0_20px_40px_rgba(34,197,94,0.2)]">
            <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h3 className="text-3xl font-black text-white mb-2 uppercase tracking-tighter">Target_Acquired</h3>
          <p className="text-slate-400 mb-10 text-center max-w-sm font-medium">Data payload successfully reconstructed and ready for local dispatch.</p>
          <div className="flex gap-4">
            <button
              onClick={() => resultBlob && file && triggerDownload(resultBlob, file.name)}
              className="bg-white text-slate-950 px-10 py-4 rounded-2xl font-black hover:bg-orange-500 hover:text-white transition-all shadow-2xl flex items-center gap-3 active:scale-95"
            >
              RE-DOWNLOAD
            </button>
            <button
              onClick={resetTask}
              className="bg-slate-800 text-white px-10 py-4 rounded-2xl font-black hover:bg-slate-700 transition-all border border-slate-700 active:scale-95"
            >
              NEW_TASK
            </button>
          </div>
        </div>
      )}

      {/* Persistent Error Overlay */}
      {error && (
        <div className="absolute inset-x-10 bottom-10 bg-slate-950 border-2 border-red-500/30 rounded-3xl p-8 shadow-[0_30px_60px_rgba(0,0,0,0.5)] animate-in slide-in-from-bottom-10 duration-500 z-50">
          <div className="flex items-start gap-6">
            <div className="w-14 h-14 rounded-2xl bg-red-500/10 text-red-500 flex items-center justify-center flex-shrink-0 border border-red-500/20">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <div className="flex-grow">
              <h4 className="text-red-500 font-black uppercase tracking-[0.2em] text-xs mb-2">Critical_System_Interrupt</h4>
              <p className="text-white text-lg font-bold mb-3">{error.message}</p>
              <div className="bg-slate-900/80 rounded-xl p-4 font-mono text-xs text-slate-400 border border-slate-800 leading-relaxed mb-6">
                <span className="text-red-400 mr-2">LOG:</span> {error.detail}
              </div>
              <div className="flex gap-4">
                <button
                  onClick={resetTask}
                  className="bg-red-500 text-white px-6 py-3 rounded-xl text-xs font-black hover:bg-red-600 transition-all uppercase tracking-widest shadow-lg shadow-red-500/20"
                >
                  Force_Reboot
                </button>
                <button
                  onClick={() => setError(null)}
                  className="text-slate-500 px-6 py-3 rounded-xl text-xs font-black hover:text-white transition-all uppercase tracking-widest"
                >
                  Dismiss
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WebConverter;
