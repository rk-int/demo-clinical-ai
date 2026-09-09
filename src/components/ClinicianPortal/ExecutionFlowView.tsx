import React, { useState } from 'react';
import { 
  Activity, 
  ZoomIn, 
  ZoomOut, 
  RotateCcw, 
  ArrowLeft, 
  Info, 
  Sparkles, 
  CheckCircle2, 
  Layers, 
  ShieldCheck, 
  Bot, 
  FileText, 
  Database 
} from 'lucide-react';
import { UserProfile, PurposeOfUse } from '../../types';

interface ExecutionFlowViewProps {
  currentUser: UserProfile;
  purposeOfUse: PurposeOfUse;
  onGoBack?: () => void;
}

export const ExecutionFlowView: React.FC<ExecutionFlowViewProps> = ({
  currentUser,
  purposeOfUse,
  onGoBack,
}) => {
  const [zoomScale, setZoomScale] = useState<number>(1.0);

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header Bar & Control Panel */}
      <div className="p-6 rounded-3xl bg-slate-900/90 border border-cyan-500/40 backdrop-blur-2xl shadow-2xl flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          {onGoBack && (
            <button
              onClick={onGoBack}
              className="p-2.5 rounded-2xl bg-white/10 hover:bg-white/15 text-slate-200 border border-white/10 transition-colors cursor-pointer shrink-0"
              title="Back to Previous View"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
          )}

          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-cyan-600 to-blue-600 flex items-center justify-center text-white shrink-0 shadow-lg shadow-cyan-500/30 border border-white/20">
            <Activity className="w-6 h-6 animate-pulse" />
          </div>

          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-xl font-extrabold text-white tracking-tight">System Execution Flow Blueprint</h1>
              <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 text-[10px] font-mono font-bold uppercase tracking-wider">
                Admin Architecture View
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-0.5">
              Sequence diagram demonstrating end-to-end user interactions, API gateway routing, NeMo guardrails, and Gemini LLM synthesis.
            </p>
          </div>
        </div>

        {/* Zoom & Canvas Controls */}
        <div className="flex items-center gap-3 shrink-0 flex-wrap">
          <div className="flex items-center bg-slate-950 border border-cyan-500/30 rounded-2xl p-1 gap-1 shadow-inner">
            <button
              type="button"
              onClick={() => setZoomScale(prev => Math.max(0.5, Number((prev - 0.15).toFixed(2))))}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 hover:text-white transition-colors cursor-pointer"
              title="Zoom Out"
            >
              <ZoomOut className="w-4 h-4" />
            </button>

            <span className="px-3 font-mono text-xs font-bold text-cyan-300 min-w-[55px] text-center">
              {Math.round(zoomScale * 100)}%
            </span>

            <button
              type="button"
              onClick={() => setZoomScale(prev => Math.min(3.0, Number((prev + 0.15).toFixed(2))))}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 hover:text-white transition-colors cursor-pointer"
              title="Zoom In"
            >
              <ZoomIn className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={() => setZoomScale(1.0)}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors cursor-pointer border-l border-white/10"
              title="Reset Zoom to 100%"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>

          <div className="px-3 py-2 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 font-mono text-xs font-bold flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-400 animate-pulse" />
            <span>Full Landscape Canvas</span>
          </div>
        </div>
      </div>

      {/* Navigation Hint Bar */}
      <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-white/10 text-xs font-mono text-slate-300 flex items-center justify-between gap-3">
        <span className="flex items-center gap-2 text-cyan-300 font-bold">
          <Info className="w-4 h-4 text-cyan-400 shrink-0" />
          <span>Use scrollbars or Shift + Mouse wheel to navigate across all 5 execution phases.</span>
        </span>
        <span className="text-[11px] text-slate-400 hidden sm:inline font-sans">
          Click zoom controls to adjust diagram scale from 50% to 300%.
        </span>
      </div>

      {/* Crystal Clear Full-Page Landscape Diagram Canvas */}
      <div className="overflow-auto min-h-[650px] max-h-[82vh] w-full rounded-3xl border-2 border-cyan-500/50 bg-slate-950 p-6 shadow-[0_25px_70px_rgba(0,0,0,0.98)] custom-scrollbar relative">
        <div 
          className="inline-block min-w-full transition-transform duration-150 ease-out origin-top-left"
          style={{ transform: `scale(${zoomScale})` }}
        >
          <img
            src="/images/execution_flow_diagram.png"
            alt="End-to-End System Execution Flow Diagram (Mermaid Sequence Blueprint)"
            className="max-w-none w-auto h-auto rounded-2xl shadow-2xl"
            style={{
              imageRendering: '-webkit-optimize-contrast',
              backfaceVisibility: 'hidden',
            }}
          />
        </div>
      </div>

      {/* 5 Sequential Phase Breakdown Cards */}
      <div className="space-y-3 pt-2">
        <h3 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
          <Layers className="w-4 h-4 text-cyan-400" />
          <span>Execution Phase Breakdown & Sequence Summary</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-3 text-xs">
          <div className="p-4 rounded-2xl bg-slate-900/80 border border-blue-500/30 space-y-1.5">
            <span className="text-[10px] font-mono font-bold text-blue-400 block uppercase">Phase 1</span>
            <h4 className="font-bold text-white flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-blue-400" />
              <span>Launch & Health</span>
            </h4>
            <p className="text-[11px] text-slate-300 leading-relaxed font-sans">
              Gateway health check (`GET /api/health`), Gemini LLM model discovery (`GET /api/gemini/models`), and video streaming.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/80 border border-cyan-500/30 space-y-1.5">
            <span className="text-[10px] font-mono font-bold text-cyan-400 block uppercase">Phase 2</span>
            <h4 className="font-bold text-white flex items-center gap-1.5">
              <Bot className="w-3.5 h-3.5 text-cyan-400" />
              <span>Patient Search</span>
            </h4>
            <p className="text-[11px] text-slate-300 leading-relaxed font-sans">
              Retrieves FHIR R4 record (`GET /api/patients/PT-1002`) and attaches context to the AI Assistant window.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/80 border border-amber-500/30 space-y-1.5">
            <span className="text-[10px] font-mono font-bold text-amber-400 block uppercase">Phase 3</span>
            <h4 className="font-bold text-white flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
              <span>AI & RAG QA</span>
            </h4>
            <p className="text-[11px] text-slate-300 leading-relaxed font-sans">
              Runs NeMo guardrails, DLP PHI masking, BM25 + pgvector hybrid retrieval, and Gemini LLM reasoning.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/80 border border-emerald-500/30 space-y-1.5">
            <span className="text-[10px] font-mono font-bold text-emerald-400 block uppercase">Phase 4</span>
            <h4 className="font-bold text-white flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-emerald-400" />
              <span>Note Sign-Off</span>
            </h4>
            <p className="text-[11px] text-slate-300 leading-relaxed font-sans">
              Transfers draft note to workspace, requires clinician digital signature sign-off, or enables state rollback.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/80 border border-purple-500/30 space-y-1.5">
            <span className="text-[10px] font-mono font-bold text-purple-400 block uppercase">Phase 5</span>
            <h4 className="font-bold text-white flex items-center gap-1.5">
              <Database className="w-3.5 h-3.5 text-purple-400" />
              <span>Audit & Telemetry</span>
            </h4>
            <p className="text-[11px] text-slate-300 leading-relaxed font-sans">
              Logs SHA-256 audit events (`GET /api/telemetry/traces`) and tracks daily token telemetry costs.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
