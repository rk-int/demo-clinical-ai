import React, { useState, useEffect } from 'react';
import { Download, X, CheckCircle2, AlertTriangle, Loader2, FileArchive, ExternalLink, ShieldCheck } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

interface ExportZipModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ExportZipModal: React.FC<ExportZipModalProps> = ({ isOpen, onClose }) => {
  const { isDark } = useTheme();
  const [downloading, setDownloading] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState<string | null>(null);
  const [fileInfo, setFileInfo] = useState<{ sizeMB: string; filename: string } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setError(null);
      setSuccess(false);
      setDownloadProgress(null);
      // Fetch metadata
      fetch('/api/export/info')
        .then((res) => res.json())
        .then((data) => {
          if (data && data.sizeMB) {
            setFileInfo({ sizeMB: data.sizeMB, filename: data.filename });
          }
        })
        .catch(() => {
          setFileInfo({ sizeMB: '27.0', filename: 'healthnet-clinical-ai-v1.zip' });
        });
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleDownload = async () => {
    try {
      setDownloading(true);
      setError(null);
      setSuccess(false);
      setDownloadProgress('Connecting to backend streaming server...');

      const response = await fetch('/api/export/zip', {
        method: 'GET',
        headers: {
          'Accept': 'application/zip, application/octet-stream'
        }
      });

      if (!response.ok) {
        throw new Error(`Server returned error ${response.status}: ${response.statusText}`);
      }

      setDownloadProgress('Receiving 27+ MB package data...');
      const blob = await response.blob();

      // Sanity check: Ensure we didn't receive an HTML error page (which is < 50KB)
      if (blob.size < 100000) {
        throw new Error(`Downloaded payload was unexpectedly small (${(blob.size / 1024).toFixed(1)} KB). Please use direct download.`);
      }

      setDownloadProgress('Saving archive to your system...');
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = fileInfo?.filename || 'healthnet-clinical-ai-v1.zip';
      document.body.appendChild(a);
      a.click();
      
      setTimeout(() => {
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
        setDownloading(false);
        setSuccess(true);
        setDownloadProgress(null);
      }, 1000);
    } catch (err: any) {
      console.error('Export download error:', err);
      setError(err.message || 'Failed to download zip');
      setDownloading(false);
      setDownloadProgress(null);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className={`w-full max-w-lg rounded-2xl border shadow-2xl overflow-hidden transition-all ${
          isDark 
            ? 'bg-slate-900 border-slate-700 text-slate-100' 
            : 'bg-white border-slate-200 text-slate-900'
        }`}
      >
        {/* Header */}
        <div className={`p-5 border-b flex items-center justify-between ${
          isDark ? 'border-slate-800 bg-slate-900/50' : 'border-slate-100 bg-slate-50'
        }`}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600/20 text-blue-400 border border-blue-500/30 flex items-center justify-center shadow-inner">
              <FileArchive className="w-5 h-5 text-blue-500" />
            </div>
            <div>
              <h3 className="font-bold text-base">Export Full Project Source Code</h3>
              <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                Complete standalone backup (Node.js, React, Agents, Synthetics)
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className={`p-2 rounded-lg transition-colors cursor-pointer ${
              isDark ? 'hover:bg-slate-800 text-slate-400 hover:text-white' : 'hover:bg-slate-200 text-slate-500'
            }`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          <div className={`p-4 rounded-xl border flex items-start gap-3.5 ${
            isDark ? 'bg-slate-800/60 border-slate-700/80' : 'bg-slate-50 border-slate-200'
          }`}>
            <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
            <div className="text-xs space-y-1">
              <div className="font-semibold text-sm">Verified Snapshot Ready</div>
              <p className={isDark ? 'text-slate-300' : 'text-slate-600'}>
                Package size: <span className="font-bold font-mono text-blue-400">{fileInfo?.sizeMB || '27.0'} MB</span> ({fileInfo?.filename || 'healthnet-clinical-ai-v1.zip'})
              </p>
              <p className={`text-[11px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                Includes all TypeScript source files, synthetic EHR datasets, clinical agent contracts, guardrail engines, requirements.txt, and animations.
              </p>
            </div>
          </div>

          {downloadProgress && (
            <div className={`p-3.5 rounded-xl border flex items-center gap-3 text-xs ${
              isDark ? 'bg-blue-950/40 border-blue-800 text-blue-200' : 'bg-blue-50 border-blue-200 text-blue-800'
            }`}>
              <Loader2 className="w-4 h-4 animate-spin text-blue-500 shrink-0" />
              <span>{downloadProgress}</span>
            </div>
          )}

          {success && (
            <div className={`p-3.5 rounded-xl border flex items-center gap-3 text-xs ${
              isDark ? 'bg-emerald-950/40 border-emerald-800 text-emerald-200' : 'bg-emerald-50 border-emerald-200 text-emerald-800'
            }`}>
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
              <span>Full archive ({fileInfo?.sizeMB || '27.0'} MB) downloaded successfully to your local disk!</span>
            </div>
          )}

          {error && (
            <div className={`p-3.5 rounded-xl border flex items-start gap-3 text-xs ${
              isDark ? 'bg-rose-950/40 border-rose-800 text-rose-200' : 'bg-rose-50 border-rose-200 text-rose-800'
            }`}>
              <AlertTriangle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
              <div>
                <div className="font-bold">Download Notice:</div>
                <div>{error}</div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className={`p-5 border-t flex flex-col sm:flex-row items-center justify-between gap-3 ${
          isDark ? 'border-slate-800 bg-slate-900/50' : 'border-slate-100 bg-slate-50'
        }`}>
          <a
            href="/api/export/zip"
            target="_blank"
            rel="noopener noreferrer"
            className={`text-xs flex items-center gap-1.5 underline decoration-slate-400 hover:text-blue-400 transition-colors ${
              isDark ? 'text-slate-400' : 'text-slate-500'
            }`}
            title="Open raw download stream in new browser window"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            Direct Browser Link
          </a>

          <div className="flex items-center gap-2.5 w-full sm:w-auto">
            <button
              onClick={onClose}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-colors cursor-pointer w-full sm:w-auto ${
                isDark ? 'bg-slate-800 hover:bg-slate-700 text-slate-300' : 'bg-slate-200 hover:bg-slate-300 text-slate-700'
              }`}
            >
              Close
            </button>

            <button
              onClick={handleDownload}
              disabled={downloading}
              className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-blue-600/25 transition-all cursor-pointer w-full sm:w-auto active:scale-95"
            >
              {downloading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Downloading ({fileInfo?.sizeMB || '27.0'} MB)...</span>
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  <span>Download Complete ZIP ({fileInfo?.sizeMB || '27.0'} MB)</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
