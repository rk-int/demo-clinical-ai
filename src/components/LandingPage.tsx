import React, { useState } from 'react';
import { 
  ShieldCheck, 
  FileCheck, 
  LogIn, 
  UserCheck, 
  Cpu,
  ArrowRight,
  Download,
  ToggleLeft,
  ToggleRight,
  Sparkles,
  Info,
  Layers,
  Database,
  X,
  BookOpen,
  CheckCircle2,
  Server,
  Lock,
  Activity,
  Zap,
  Globe,
  Check,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Target,
  XCircle,
  ShieldAlert
} from 'lucide-react';
import { UserProfile } from '../types';
import { HospitalVideoBackground } from './HospitalVideoBackground';
import { useTheme } from '../context/ThemeContext';

interface LandingPageProps {
  onEnterClinicianPortal: (user?: UserProfile) => void;
  onEnterOperations?: (user?: UserProfile) => void;
  onTriggerBreakIt?: () => void;
  currentUser?: UserProfile | null;
  onSelectUser?: (user: UserProfile) => void;
  onOpenSignInModal?: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onEnterClinicianPortal,
  currentUser,
  onOpenSignInModal,
}) => {
  const { isDark } = useTheme();

  // Floating Navigator Pane & Modal States
  const [isPaneEnabled, setIsPaneEnabled] = useState(false);
  const [activeModal, setActiveModal] = useState<'INTRO' | 'ARCHITECTURE' | 'SCOPE' | 'TECH_STACK' | 'RAG' | null>(null);
  const [archZoomLevel, setArchZoomLevel] = useState<number>(1);

  // Handle toggle click to open panel on first click and close panel on second click
  const handleTogglePane = () => {
    setIsPaneEnabled(prev => {
      const nextState = !prev;
      if (!nextState) {
        setActiveModal(null);
      }
      return nextState;
    });
  };

  return (
    <div className={`relative min-h-screen overflow-hidden font-sans transition-colors duration-300 ${
      isDark ? 'text-slate-100' : 'text-slate-900'
    }`}>
      {/* Full-Screen Hospital Video Background */}
      <HospitalVideoBackground initialSceneIndex={0} showOverlayControls={true} />

      {/* FIXED TOGGLE BUTTON (ALWAYS ACCESSIBLE TO OPEN/CLOSE PANEL ON CLICK) */}
      <div className="fixed top-20 right-6 z-50">
        <button
          onClick={handleTogglePane}
          className={`px-3.5 py-2 rounded-full border text-xs font-mono font-bold flex items-center gap-2 transition-all cursor-pointer shadow-2xl backdrop-blur-2xl ${
            isPaneEnabled 
              ? 'bg-cyan-500/20 text-cyan-300 border-cyan-400/60 ring-2 ring-cyan-500/40' 
              : 'bg-slate-950/90 text-slate-300 border-white/20 hover:text-white hover:border-cyan-500/50'
          }`}
          title={isPaneEnabled ? "Click to close presentation panel" : "Click to open presentation panel"}
        >
          <div className={`w-2.5 h-2.5 rounded-full ${isPaneEnabled ? 'bg-cyan-400 animate-pulse' : 'bg-slate-500'}`} />
          <span>Presentation Pane</span>
          {isPaneEnabled ? (
            <ToggleRight className="w-5 h-5 text-cyan-400" />
          ) : (
            <ToggleLeft className="w-5 h-5 text-slate-400" />
          )}
        </button>
      </div>

      {/* Main Content Layout */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-20">

        {/* ========================================================================= */}
        {/* HORIZONTAL FLOATING PANE (WHEN TOGGLE IS ENABLED)                          */}
        {/* ========================================================================= */}
        {isPaneEnabled && (
          <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-slate-950/95 border border-cyan-500/40 rounded-2xl p-2 shadow-2xl backdrop-blur-2xl flex items-center gap-2 animate-in fade-in slide-in-from-top-4 duration-300">
            <div className="flex items-center gap-1.5 px-3 py-1 text-[11px] font-mono font-bold text-cyan-400 border-r border-white/10 shrink-0">
              <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
              <span>PRESENTATION</span>
            </div>

            <div className="flex items-center gap-1.5 overflow-x-auto py-0.5 px-1">
              <button
                onClick={() => setActiveModal('INTRO')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-mono font-bold flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap ${
                  activeModal === 'INTRO' 
                    ? 'bg-blue-600 text-white shadow-lg ring-1 ring-cyan-400/50' 
                    : 'bg-white/5 hover:bg-white/10 text-slate-200 border border-white/10 hover:border-cyan-500/40'
                }`}
              >
                <Info className="w-3.5 h-3.5 text-cyan-300" />
                <span>Intro</span>
              </button>

              <button
                onClick={() => setActiveModal('ARCHITECTURE')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-mono font-bold flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap ${
                  activeModal === 'ARCHITECTURE' 
                    ? 'bg-blue-600 text-white shadow-lg ring-1 ring-purple-400/50' 
                    : 'bg-white/5 hover:bg-white/10 text-slate-200 border border-white/10 hover:border-purple-500/40'
                }`}
              >
                <Layers className="w-3.5 h-3.5 text-purple-300" />
                <span>Architecture</span>
              </button>

              <button
                onClick={() => setActiveModal('SCOPE')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-mono font-bold flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap ${
                  activeModal === 'SCOPE' 
                    ? 'bg-blue-600 text-white shadow-lg ring-1 ring-cyan-400/50' 
                    : 'bg-white/5 hover:bg-white/10 text-slate-200 border border-white/10 hover:border-cyan-500/40'
                }`}
              >
                <Target className="w-3.5 h-3.5 text-cyan-300" />
                <span>Scope (In/Out)</span>
              </button>

              <button
                onClick={() => setActiveModal('TECH_STACK')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-mono font-bold flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap ${
                  activeModal === 'TECH_STACK' 
                    ? 'bg-blue-600 text-white shadow-lg ring-1 ring-emerald-400/50' 
                    : 'bg-white/5 hover:bg-white/10 text-slate-200 border border-white/10 hover:border-emerald-500/40'
                }`}
              >
                <Cpu className="w-3.5 h-3.5 text-emerald-300" />
                <span>Tech Stack</span>
              </button>

              <button
                onClick={() => setActiveModal('RAG')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-mono font-bold flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap ${
                  activeModal === 'RAG' 
                    ? 'bg-blue-600 text-white shadow-lg ring-1 ring-amber-400/50' 
                    : 'bg-white/5 hover:bg-white/10 text-slate-200 border border-white/10 hover:border-amber-500/40'
                }`}
              >
                <Database className="w-3.5 h-3.5 text-amber-300" />
                <span>RAG</span>
              </button>
            </div>

            <button
              onClick={() => {
                setIsPaneEnabled(false);
                setActiveModal(null);
              }}
              className="p-1.5 rounded-xl hover:bg-white/10 text-slate-400 hover:text-white transition-colors ml-1 cursor-pointer shrink-0"
              title="Close Presentation Pane"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
        {/* ========================================================================= */}
        {/* HERO SECTION (CENTERED PROPER HEADING PLACEMENT)                         */}
        {/* ========================================================================= */}
        <section id="hero-section" className="text-center max-w-4xl mx-auto space-y-6 mb-10 pt-4">
          
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-xs font-semibold text-cyan-300 backdrop-blur-md">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
            </span>
            Clinical Decision Intelligence
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-[1.12] drop-shadow-[0_4px_20px_rgba(0,0,0,0.8)]">
            <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-300 bg-clip-text text-transparent drop-shadow-[0_0_25px_rgba(56,189,248,0.4)]">
              Enterprise AI
            </span>{' '}
            <span className="text-white drop-shadow-[0_0_30px_rgba(59,130,246,0.5)]">
              Clinical Assistant
            </span>
            <span className="block mt-3 text-xl sm:text-2xl lg:text-3xl font-extrabold bg-gradient-to-r from-blue-200 via-indigo-200 to-cyan-300 bg-clip-text text-transparent tracking-wide">
              Multi-Hospital Healthcare Network
            </span>
          </h1>

        </section>

        {/* ========================================================================= */}
        {/* COMPACT BEATING 3D HEART (99.5% TRANSPARENT BACKGROUND - VIDEO FULLY VISIBLE) */}
        {/* ========================================================================= */}
        <section className="relative w-full max-w-4xl mx-auto my-6 py-6 rounded-3xl bg-transparent border border-cyan-400/10 backdrop-blur-[1px] overflow-hidden flex flex-col items-center justify-center">
          
          {/* EMBEDDED ANIMATION KEYFRAMES FOR CARDIAC BEAT & TRAVELLING ECG WAVE */}
          <style>{`
            @keyframes ecg-travel-fast {
              0% { stroke-dasharray: 1200; stroke-dashoffset: 1200; }
              100% { stroke-dasharray: 1200; stroke-dashoffset: 0; }
            }
            @keyframes cardiac-beat {
              0%, 100% { 
                transform: scale(1) rotate(0deg) translateY(0px); 
              }
              14% { 
                transform: scale(1.15) rotate(-1.5deg) translateY(-5px); 
              }
              28% { 
                transform: scale(0.95) rotate(1deg) translateY(2px); 
              }
              42% { 
                transform: scale(1.10) rotate(1deg) translateY(-3px); 
              }
              56% { 
                transform: scale(0.98) rotate(-0.5deg) translateY(0px); 
              }
            }
            .animate-ecg-travel-fast {
              animation: ecg-travel-fast 3.2s linear infinite;
            }
            .animate-cardiac-beat {
              animation: cardiac-beat 1.15s cubic-bezier(0.25, 0.1, 0.25, 1) infinite;
            }
          `}</style>
          
          {/* TRAVELLING EKG HEART WAVE LINES PASSING THROUGH BEHIND THE HEART */}
          <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-32 pointer-events-none overflow-hidden opacity-85">
            <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 1200 120">
              <defs>
                <linearGradient id="heroEcgGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.1" />
                  <stop offset="25%" stopColor="#38bdf8" stopOpacity="0.95" />
                  <stop offset="50%" stopColor="#c084fc" stopOpacity="1" />
                  <stop offset="75%" stopColor="#3b82f6" stopOpacity="0.95" />
                  <stop offset="100%" stopColor="#38bdf8" stopOpacity="0.1" />
                </linearGradient>
                <filter id="heroEcgGlow" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="3" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
              </defs>
              <path
                d="M 0 60 L 150 60 L 170 55 L 185 65 L 195 60 L 210 60 L 220 15 L 235 105 L 250 35 L 260 60 L 280 60 L 300 50 L 320 60 L 450 60 L 470 55 L 485 65 L 495 60 L 510 60 L 520 15 L 535 105 L 550 35 L 560 60 L 580 60 L 600 50 L 620 60 L 750 60 L 770 55 L 785 65 L 795 60 L 810 60 L 820 15 L 835 105 L 850 35 L 860 60 L 880 60 L 900 50 L 920 60 L 1050 60 L 1070 55 L 1085 65 L 1095 60 L 1110 60 L 1120 15 L 1135 105 L 1150 35 L 1160 60 L 1200 60"
                fill="none"
                stroke="url(#heroEcgGrad)"
                strokeWidth="3.5"
                strokeLinecap="round"
                filter="url(#heroEcgGlow)"
                className="animate-ecg-travel-fast"
              />
            </svg>
          </div>

          {/* COMPACT BEATING 3D HEART SYMBOL */}
          <div className="relative z-10 flex flex-col items-center justify-center group cursor-pointer">
            <img
              src="/3d_heart_centered.png"
              alt="3D Anatomical Metallic Beating Heart"
              className="w-36 sm:w-44 md:w-48 h-auto object-contain animate-cardiac-beat transition-transform duration-300 group-hover:scale-110"
            />

            {/* Live Cardiac Sync Badge */}
            <div className="mt-2 bg-cyan-950/40 border border-cyan-400/40 text-cyan-300 text-[10px] font-mono font-bold px-3 py-1 rounded-full shadow-md flex items-center gap-1.5 backdrop-blur-md">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping"></span>
              <span>Cardiac Sync 72 BPM</span>
            </div>
          </div>

        </section>

        {/* ========================================================================= */}
        {/* 4 CORE TRUST FEATURE CARDS                                                */}
        {/* ========================================================================= */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-16">
          {/* Card 1: Trusted & Secure */}
          <div className="bg-slate-950/75 border border-white/10 hover:border-cyan-500/40 rounded-2xl p-5 backdrop-blur-xl shadow-xl transition-all hover:scale-[1.02] flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-blue-500/15 border border-blue-500/30 flex items-center justify-center text-blue-400 shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="font-extrabold text-sm text-white">Trusted & Secure</div>
              <div className="text-xs text-slate-300 mt-0.5">HIPAA + GDPR Compliant</div>
            </div>
          </div>

          {/* Card 2: Evidence-Based */}
          <div className="bg-slate-950/75 border border-white/10 hover:border-cyan-500/40 rounded-2xl p-5 backdrop-blur-xl shadow-xl transition-all hover:scale-[1.02] flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shrink-0">
              <FileCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="font-extrabold text-sm text-white">Evidence-Based</div>
              <div className="text-xs text-slate-300 mt-0.5">Grounded in Clinical Knowledge</div>
            </div>
          </div>

          {/* Card 3: AI Agents */}
          <div className="bg-slate-950/75 border border-white/10 hover:border-cyan-500/40 rounded-2xl p-5 backdrop-blur-xl shadow-xl transition-all hover:scale-[1.02] flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
              <Cpu className="w-6 h-6" />
            </div>
            <div>
              <div className="font-extrabold text-sm text-white">AI Agents</div>
              <div className="text-xs text-slate-300 mt-0.5">Multi-Agent Architecture</div>
            </div>
          </div>

          {/* Card 4: Human-in-the-Loop */}
          <div className="bg-slate-950/75 border border-white/10 hover:border-cyan-500/40 rounded-2xl p-5 backdrop-blur-xl shadow-xl transition-all hover:scale-[1.02] flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-purple-500/15 border border-purple-500/30 flex items-center justify-center text-purple-400 shrink-0">
              <UserCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="font-extrabold text-sm text-white">Human-in-the-Loop</div>
              <div className="text-xs text-slate-300 mt-0.5">Clinician Always in Control</div>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* MODAL DIALOGS FOR INTRO, ARCHITECTURE, TECH STACK, RAG                     */}
        {/* ========================================================================= */}
        {activeModal && (
          <div className={`fixed inset-0 z-50 flex items-center justify-center bg-slate-950/95 backdrop-blur-md animate-in fade-in duration-200 ${
            activeModal === 'ARCHITECTURE' ? 'p-1 sm:p-2' : 'p-4'
          }`}>
            <div className={`relative bg-slate-900/98 border border-cyan-500/30 rounded-3xl shadow-2xl overflow-y-auto text-slate-100 transition-all ${
              activeModal === 'ARCHITECTURE'
                ? 'w-full h-[98vh] max-w-[99vw] max-h-[98vh] flex flex-col p-3 sm:p-5 space-y-3 border-purple-500/50'
                : activeModal === 'SCOPE' || activeModal === 'TECH_STACK'
                ? 'w-full max-w-5xl max-h-[88vh] p-6 sm:p-8 space-y-6'
                : 'w-full max-w-3xl max-h-[85vh] p-6 sm:p-8 space-y-6'
            }`}>
              
              {/* Modal Header */}
              <div className="flex items-center justify-between border-b border-white/10 pb-3 shrink-0">
                <div className="flex items-center gap-3">
                  {activeModal === 'INTRO' && <Info className="w-6 h-6 text-cyan-400" />}
                  {activeModal === 'ARCHITECTURE' && <Layers className="w-6 h-6 text-purple-400" />}
                  {activeModal === 'SCOPE' && <Target className="w-6 h-6 text-cyan-400" />}
                  {activeModal === 'TECH_STACK' && <Cpu className="w-6 h-6 text-emerald-400" />}
                  {activeModal === 'RAG' && <Database className="w-6 h-6 text-amber-400" />}

                  <h2 className="text-xl font-extrabold text-white tracking-tight">
                    {activeModal === 'INTRO' && 'Platform Overview & Clinical Vision'}
                    {activeModal === 'ARCHITECTURE' && 'Enterprise System Architecture Blueprint (Full Presentation View)'}
                    {activeModal === 'SCOPE' && 'Executive Demo Scope Matrix (In-Scope vs. Out-of-Scope)'}
                    {activeModal === 'TECH_STACK' && 'Technology Stack & Cloud Infrastructure'}
                    {activeModal === 'RAG' && 'Governed Clinical RAG & Knowledge Pipeline'}
                  </h2>
                </div>

                <button
                  onClick={() => setActiveModal(null)}
                  className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors cursor-pointer"
                  title="Close modal (Esc)"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* MODAL CONTENT: INTRO */}
              {activeModal === 'INTRO' && (
                <div className="space-y-5 text-xs leading-relaxed text-slate-300">
                  {/* High-Resolution Infographic Presentation Banner */}
                  <div className="overflow-hidden rounded-2xl border border-cyan-500/40 shadow-2xl bg-slate-950 group relative">
                    <img
                      src="/intro_presentation_banner.jpg"
                      alt="Enterprise AI Clinical Assistant Architecture Banner"
                      className="w-full h-auto object-cover rounded-2xl transition-transform duration-500 group-hover:scale-[1.015]"
                    />
                    <div className="absolute bottom-3 right-3 bg-slate-950/85 backdrop-blur-md px-3 py-1.5 rounded-xl border border-cyan-400/30 text-[10px] font-mono text-cyan-300 flex items-center gap-1.5 shadow-lg">
                      <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
                      <span>Clinical Intelligence Ecosystem Blueprint</span>
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-cyan-950/40 border border-cyan-500/30 space-y-2">
                    <h3 className="text-sm font-bold text-cyan-300 flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-amber-400" />
                      <span>Multi-Hospital Healthcare Network Clinical AI</span>
                    </h3>
                    <p>
                      Enterprise AI Clinical Assistant empowers clinicians with real-time, evidence-based decision support, automated documentation, and patient record synthesis while maintaining strict HIPAA compliance and zero-trust security.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="p-3.5 rounded-xl bg-black/40 border border-white/10 space-y-1.5">
                      <div className="font-bold text-white flex items-center gap-1.5">
                        <ShieldCheck className="w-4 h-4 text-emerald-400" />
                        <span>Zero-Trust Privacy</span>
                      </div>
                      <p className="text-[11px] text-slate-400">
                        Automatic DLP PHI tokenization masks patient names (`[REDACTED_PATIENT_NAME]`) before sending prompts to external cloud models.
                      </p>
                    </div>

                    <div className="p-3.5 rounded-xl bg-black/40 border border-white/10 space-y-1.5">
                      <div className="font-bold text-white flex items-center gap-1.5">
                        <UserCheck className="w-4 h-4 text-purple-400" />
                        <span>Human-in-the-Loop</span>
                      </div>
                      <p className="text-[11px] text-slate-400">
                        Physician review mandate enforced on all AI outputs. Non-autonomous design guarantees clinicians retain complete decision authority.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* MODAL CONTENT: ARCHITECTURE (FULL SCREEN COVERAGE FOR AUDIENCE PRESENTATION) */}
              {activeModal === 'ARCHITECTURE' && (
                <div className="flex-1 flex flex-col min-h-0 space-y-3 text-xs leading-relaxed text-slate-300">
                  {/* Floating Interactive Zoom Control Toolbar */}
                  <div className="flex items-center justify-between bg-slate-950/90 border border-purple-500/40 rounded-2xl px-4 py-2.5 shadow-xl backdrop-blur-md shrink-0">
                    <div className="flex items-center gap-2 font-mono text-[11px] text-purple-300 font-bold">
                      <Layers className="w-4 h-4 text-purple-400" />
                      <span>Enterprise Reference Architecture Diagram</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setArchZoomLevel((prev) => Math.max(0.6, prev - 0.25))}
                        className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/10 transition-colors cursor-pointer flex items-center gap-1.5 text-xs font-semibold"
                        title="Zoom Out (-25%)"
                      >
                        <ZoomOut className="w-4 h-4" />
                        <span className="hidden sm:inline">Zoom Out</span>
                      </button>

                      <div className="px-3.5 py-1.5 rounded-xl bg-purple-500/20 border border-purple-500/40 text-purple-300 font-mono text-xs font-bold min-w-[65px] text-center shadow-inner">
                        {Math.round(archZoomLevel * 100)}%
                      </div>

                      <button
                        onClick={() => setArchZoomLevel((prev) => Math.min(3.0, prev + 0.25))}
                        className="p-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white transition-colors cursor-pointer flex items-center gap-1.5 text-xs font-semibold shadow-md shadow-purple-600/30"
                        title="Zoom In (+25%)"
                      >
                        <ZoomIn className="w-4 h-4" />
                        <span className="hidden sm:inline">Zoom In</span>
                      </button>

                      <button
                        onClick={() => setArchZoomLevel(1)}
                        className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white border border-white/10 transition-colors cursor-pointer"
                        title="Reset Zoom to 100%"
                      >
                        <RotateCcw className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Full-Screen Zoomable & Scrollable Diagram Viewport */}
                  <div className="flex-1 overflow-auto rounded-2xl border border-purple-500/40 shadow-2xl bg-white p-3 relative custom-scrollbar flex items-start justify-center">
                    <div
                      className="transition-transform duration-200 ease-out origin-top-center flex items-center justify-center min-w-full"
                      style={{
                        transform: `scale(${archZoomLevel})`,
                        width: archZoomLevel > 1 ? `${archZoomLevel * 100}%` : '100%',
                      }}
                    >
                      <img
                        src="/architecture_reference_blueprint.png"
                        alt="Enterprise AI Clinical Assistant - Reference Architecture Blueprint"
                        className="w-full h-auto object-contain rounded-xl shadow-md"
                        style={{
                          imageRendering: '-webkit-optimize-contrast',
                          backfaceVisibility: 'hidden',
                        }}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* MODAL CONTENT: SCOPE (IN-SCOPE VS OUT-OF-SCOPE) */}
              {activeModal === 'SCOPE' && (
                <div className="space-y-5 text-xs leading-relaxed text-slate-300">
                  <div className="p-4 rounded-2xl bg-cyan-950/40 border border-cyan-500/30 space-y-1.5">
                    <h3 className="text-sm font-bold text-cyan-300 flex items-center gap-2">
                      <Target className="w-4 h-4 text-cyan-400" />
                      <span>Executive Management Scope Matrix</span>
                    </h3>
                    <p className="text-slate-300">
                      Clear operational boundaries defining implemented technical features versus intentional platform safeguards.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                    {/* IN SCOPE BOX */}
                    <div className="p-4 rounded-2xl bg-emerald-950/30 border border-emerald-500/40 space-y-3.5 shadow-xl">
                      <div className="flex items-center gap-2 text-emerald-400 font-extrabold text-sm border-b border-emerald-500/30 pb-2.5">
                        <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                        <span>5 IN-SCOPE TECHNICAL HIGHLIGHTS</span>
                      </div>
                      
                      <div className="space-y-2.5">
                        <div className="p-3 rounded-xl bg-black/50 border border-emerald-500/20 space-y-1">
                          <div className="font-bold text-emerald-300 text-xs flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />
                            <span>1. Clinician Workspaces & Synthetic FHIR 360</span>
                          </div>
                          <p className="text-slate-300 text-[11px] leading-relaxed pl-3">
                            Multi-hospital patient search directory and Patient 360 workspace running on synthetic FHIR R4 medical records (vitals, labs, active conditions) with context-aware prompt injection.
                          </p>
                        </div>

                        <div className="p-3 rounded-xl bg-black/50 border border-emerald-500/20 space-y-1">
                          <div className="font-bold text-emerald-300 text-xs flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />
                            <span>2. Contextual Hybrid RAG & Evidence-Backed Q&A</span>
                          </div>
                          <p className="text-slate-300 text-[11px] leading-relaxed pl-3">
                            Dual-engine retrieval (pgvector + BM25) querying institutional guidelines to generate clinical answers backed by explicit document citations and source attribution.
                          </p>
                        </div>

                        <div className="p-3 rounded-xl bg-black/50 border border-emerald-500/20 space-y-1">
                          <div className="font-bold text-emerald-300 text-xs flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />
                            <span>3. Multi-Role RBAC & Purpose-Driven PHI Governance</span>
                          </div>
                          <p className="text-slate-300 text-[11px] leading-relaxed pl-3">
                            Role-based access control supporting 6 clinical personas with Purpose-of-Use authorization (<code className="text-emerald-400 font-mono">TREATMENT</code>, <code className="text-emerald-400 font-mono">CLINICAL_AUDIT</code>, <code className="text-emerald-400 font-mono">EMERGENCY</code>) and automated pre/post DLP PHI token masking.
                          </p>
                        </div>

                        <div className="p-3 rounded-xl bg-black/50 border border-emerald-500/20 space-y-1">
                          <div className="font-bold text-emerald-300 text-xs flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />
                            <span>4. Safety Guardrails, Confidence Metrics & Fallback</span>
                          </div>
                          <p className="text-slate-300 text-[11px] leading-relaxed pl-3">
                            Calibrated evidence confidence scoring with NeMo safety guardrails that automatically trigger physician escalation whenever retrieval confidence falls below 85%.
                          </p>
                        </div>

                        <div className="p-3 rounded-xl bg-black/50 border border-emerald-500/20 space-y-1">
                          <div className="font-bold text-emerald-300 text-xs flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />
                            <span>5. Multi-Agent Orchestration & Live Audit Telemetry</span>
                          </div>
                          <p className="text-slate-300 text-[11px] leading-relaxed pl-3">
                            Real-time visual graph tracking agent collaboration (<em>Triage → Patient Data → Knowledge → Workflow</em>) alongside live token stream metrics, latency tracking, and SHA-256 encrypted immutable audit trails.
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* OUT OF SCOPE BOX */}
                    <div className="p-4 rounded-2xl bg-rose-950/30 border border-rose-500/40 space-y-3.5 shadow-xl">
                      <div className="flex items-center gap-2 text-rose-400 font-extrabold text-sm border-b border-rose-500/30 pb-2.5">
                        <XCircle className="w-5 h-5 text-rose-400 shrink-0" />
                        <span>5 OUT-OF-SCOPE BOUNDARIES</span>
                      </div>
                      
                      <div className="space-y-2.5">
                        <div className="p-3 rounded-xl bg-black/50 border border-rose-500/20 space-y-1">
                          <div className="font-bold text-rose-300 text-xs flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-rose-400 shrink-0" />
                            <span>1. Autonomous Medical Treatment & Order Execution</span>
                          </div>
                          <p className="text-slate-300 text-[11px] leading-relaxed pl-3">
                            System operates strictly as a <strong>Clinical Decision Support System (CDSS)</strong>; no autonomous clinical ordering or prescribing can occur without mandatory physician digital sign-off.
                          </p>
                        </div>

                        <div className="p-3 rounded-xl bg-black/50 border border-rose-500/20 space-y-1">
                          <div className="font-bold text-rose-300 text-xs flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-rose-400 shrink-0" />
                            <span>2. Direct Production EHR Database Write-Back</span>
                          </div>
                          <p className="text-slate-300 text-[11px] leading-relaxed pl-3">
                            Sandboxed to synthetic FHIR R4 data models for zero-risk demonstration; live production EPIC/Cerner database mutations are intentionally excluded.
                          </p>
                        </div>

                        <div className="p-3 rounded-xl bg-black/50 border border-rose-500/20 space-y-1">
                          <div className="font-bold text-rose-300 text-xs flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-rose-400 shrink-0" />
                            <span>3. Unchecked Generative AI Output (No Ungrounded Responses)</span>
                          </div>
                          <p className="text-slate-300 text-[11px] leading-relaxed pl-3">
                            The platform strictly forbids ungrounded model guessing; queries exceeding safety parameters or lacking verified literature automatically defer to human clinical evaluation.
                          </p>
                        </div>

                        <div className="p-3 rounded-xl bg-black/50 border border-rose-500/20 space-y-1">
                          <div className="font-bold text-rose-300 text-xs flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-rose-400 shrink-0" />
                            <span>4. Physical ICU Hardware & IoT Device Interfacing</span>
                          </div>
                          <p className="text-slate-300 text-[11px] leading-relaxed pl-3">
                            Ingests structured digital telemetry feeds, but does not connect directly to physical bedside ICU monitors, ventilator hardware, or wearable sensor serial ports.
                          </p>
                        </div>

                        <div className="p-3 rounded-xl bg-black/50 border border-rose-500/20 space-y-1">
                          <div className="font-bold text-rose-300 text-xs flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-rose-400 shrink-0" />
                            <span>5. Automated Billing Claims & Unthrottled Cloud Quotas</span>
                          </div>
                          <p className="text-slate-300 text-[11px] leading-relaxed pl-3">
                            Tracks token usage and infrastructure costs, but excludes automated insurance claim filings, binding financial transactions, and unthrottled cloud compute quotas.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* MODAL CONTENT: TECH STACK */}
              {activeModal === 'TECH_STACK' && (
                <div className="space-y-4 text-xs leading-relaxed text-slate-300">
                  <div className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-500/30 space-y-1.5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                    <div>
                      <h3 className="text-sm font-bold text-emerald-300 flex items-center gap-2">
                        <Cpu className="w-4 h-4 text-emerald-400" />
                        <span>Enterprise Tech Stack & Framework Architecture</span>
                      </h3>
                      <p className="text-slate-300 text-[11px] mt-0.5">
                        Comprehensive mapping of developer tools, AI frameworks, data standards, and cloud infrastructure components powering this application.
                      </p>
                    </div>
                    <div className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-[10px] font-mono text-emerald-300 font-bold shrink-0 self-start sm:self-auto">
                      15 Technical Layers
                    </div>
                  </div>

                  {/* STRUCTURED TECH STACK TABLE */}
                  <div className="overflow-x-auto rounded-2xl border border-emerald-500/30 shadow-2xl bg-slate-950/80 backdrop-blur-md custom-scrollbar">
                    <table className="w-full text-left border-collapse min-w-[640px]">
                      <thead>
                        <tr className="bg-gradient-to-r from-slate-900 via-emerald-950/60 to-slate-900 border-b border-emerald-500/40 text-[11px] font-mono font-bold text-emerald-300">
                          <th className="py-3 px-4 border-r border-white/10 w-1/4">Layer</th>
                          <th className="py-3 px-4 border-r border-white/10 w-1/3">Dev tools / frameworks</th>
                          <th className="py-3 px-4 w-5/12">What it is used for</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/10 text-[11px]">
                        <tr className="hover:bg-slate-800/60 transition-colors">
                          <td className="py-2.5 px-4 font-bold text-cyan-300 border-r border-white/10 flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shrink-0" />
                            <span>Frontend</span>
                          </td>
                          <td className="py-2.5 px-4 font-mono font-bold text-slate-100 border-r border-white/10">
                            React 19 + Vite 6 + TailwindCSS v4
                          </td>
                          <td className="py-2.5 px-4 text-slate-300">
                            Clinician portal UI, Patient 360 dashboards, AI Assistant chat & Presentation Pane
                          </td>
                        </tr>

                        <tr className="hover:bg-slate-800/60 transition-colors bg-white/[0.02]">
                          <td className="py-2.5 px-4 font-bold text-cyan-300 border-r border-white/10 flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shrink-0" />
                            <span>Backend / APIs</span>
                          </td>
                          <td className="py-2.5 px-4 font-mono font-bold text-slate-100 border-r border-white/10">
                            Node.js + Express + tsx + REST APIs
                          </td>
                          <td className="py-2.5 px-4 text-slate-300">
                            FHIR data search endpoints, code ZIP exporter, token analytics & fallback routing
                          </td>
                        </tr>

                        <tr className="hover:bg-slate-800/60 transition-colors">
                          <td className="py-2.5 px-4 font-bold text-amber-300 border-r border-white/10 flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0" />
                            <span>AI Framework</span>
                          </td>
                          <td className="py-2.5 px-4 font-mono font-bold text-slate-100 border-r border-white/10">
                            Google GenAI SDK (@google/genai)
                          </td>
                          <td className="py-2.5 px-4 text-slate-300">
                            Multimodal model interactions, structured JSON extraction & multi-turn clinical chat
                          </td>
                        </tr>

                        <tr className="hover:bg-slate-800/60 transition-colors bg-white/[0.02]">
                          <td className="py-2.5 px-4 font-bold text-purple-300 border-r border-white/10 flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-purple-400 shrink-0" />
                            <span>Agent Workflows</span>
                          </td>
                          <td className="py-2.5 px-4 font-mono font-bold text-slate-100 border-r border-white/10">
                            Custom Multi-Agent State Graph Engine
                          </td>
                          <td className="py-2.5 px-4 text-slate-300">
                            Agent orchestration (<em>Triage, Patient Info, Knowledge Q&A, Workflow</em>) & state transitions
                          </td>
                        </tr>

                        <tr className="hover:bg-slate-800/60 transition-colors">
                          <td className="py-2.5 px-4 font-bold text-amber-300 border-r border-white/10 flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0" />
                            <span>RAG Framework</span>
                          </td>
                          <td className="py-2.5 px-4 font-mono font-bold text-slate-100 border-r border-white/10">
                            Hybrid Contextual RAG (pgvector + BM25)
                          </td>
                          <td className="py-2.5 px-4 text-slate-300">
                            Medical guidelines ingestion, semantic chunking, keyword indexing & similarity retrieval
                          </td>
                        </tr>

                        <tr className="hover:bg-slate-800/60 transition-colors bg-white/[0.02]">
                          <td className="py-2.5 px-4 font-bold text-purple-300 border-r border-white/10 flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-purple-400 shrink-0" />
                            <span>LLM</span>
                          </td>
                          <td className="py-2.5 px-4 font-mono font-bold text-slate-100 border-r border-white/10">
                            Gemini 3.6 Flash / 3.1 Flash-Lite / 3.7 Flash
                          </td>
                          <td className="py-2.5 px-4 text-slate-300">
                            Clinical reasoning, medical summarization, note generation & diagnostic Q&A
                          </td>
                        </tr>

                        <tr className="hover:bg-slate-800/60 transition-colors">
                          <td className="py-2.5 px-4 font-bold text-indigo-300 border-r border-white/10 flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 shrink-0" />
                            <span>Embeddings</span>
                          </td>
                          <td className="py-2.5 px-4 font-mono font-bold text-slate-100 border-r border-white/10">
                            Gecko / Text Embedding 004 (768-dim)
                          </td>
                          <td className="py-2.5 px-4 text-slate-300">
                            Clinical guideline chunk vector embeddings & real-time query vector generation
                          </td>
                        </tr>

                        <tr className="hover:bg-slate-800/60 transition-colors bg-white/[0.02]">
                          <td className="py-2.5 px-4 font-bold text-emerald-300 border-r border-white/10 flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />
                            <span>Vector DB</span>
                          </td>
                          <td className="py-2.5 px-4 font-mono font-bold text-slate-100 border-r border-white/10">
                            PostgreSQL + pgvector / Chroma DB
                          </td>
                          <td className="py-2.5 px-4 text-slate-300">
                            High-dimensional vector similarity search & hybrid BM25 lexical ranking
                          </td>
                        </tr>

                        <tr className="hover:bg-slate-800/60 transition-colors">
                          <td className="py-2.5 px-4 font-bold text-blue-300 border-r border-white/10 flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-blue-400 shrink-0" />
                            <span>Data Standards</span>
                          </td>
                          <td className="py-2.5 px-4 font-mono font-bold text-slate-100 border-r border-white/10">
                            Synthetic HL7 FHIR R4 JSON Schema
                          </td>
                          <td className="py-2.5 px-4 text-slate-300">
                            Standardized patient records (Patient, Condition, Observation, MedicationRequest)
                          </td>
                        </tr>

                        <tr className="hover:bg-slate-800/60 transition-colors bg-white/[0.02]">
                          <td className="py-2.5 px-4 font-bold text-rose-300 border-r border-white/10 flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-rose-400 shrink-0" />
                            <span>Guardrails</span>
                          </td>
                          <td className="py-2.5 px-4 font-mono font-bold text-slate-100 border-r border-white/10">
                            NVIDIA NeMo Guardrails + DLP PHI Engine
                          </td>
                          <td className="py-2.5 px-4 text-slate-300">
                            Automatic PHI token masking (<code className="text-rose-300 font-mono text-[10px]">[REDACTED_PATIENT_NAME]</code>), input/output policy validation
                          </td>
                        </tr>

                        <tr className="hover:bg-slate-800/60 transition-colors">
                          <td className="py-2.5 px-4 font-bold text-amber-300 border-r border-white/10 flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0" />
                            <span>Evaluation</span>
                          </td>
                          <td className="py-2.5 px-4 font-mono font-bold text-slate-100 border-r border-white/10">
                            LLM-as-a-Judge + Ragas Framework
                          </td>
                          <td className="py-2.5 px-4 text-slate-300">
                            Groundedness testing, citation accuracy verification & fallback triggers (&lt;85% confidence)
                          </td>
                        </tr>

                        <tr className="hover:bg-slate-800/60 transition-colors bg-white/[0.02]">
                          <td className="py-2.5 px-4 font-bold text-cyan-300 border-r border-white/10 flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shrink-0" />
                            <span>Observability</span>
                          </td>
                          <td className="py-2.5 px-4 font-mono font-bold text-slate-100 border-r border-white/10">
                            Real-Time LLM Token Telemetry + SHA-256 Logs
                          </td>
                          <td className="py-2.5 px-4 text-slate-300">
                            Tracing prompt/completion tokens, latency metrics, cloud costs & HIPAA audit trails
                          </td>
                        </tr>

                        <tr className="hover:bg-slate-800/60 transition-colors">
                          <td className="py-2.5 px-4 font-bold text-emerald-300 border-r border-white/10 flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />
                            <span>Authentication</span>
                          </td>
                          <td className="py-2.5 px-4 font-mono font-bold text-slate-100 border-r border-white/10">
                            Enterprise SSO Gateway + Purpose-of-Use ABAC
                          </td>
                          <td className="py-2.5 px-4 text-slate-300">
                            Role-based login (6 personas) with Purpose-of-Use checks (<code className="text-emerald-300 font-mono text-[10px]">TREATMENT</code>, <code className="text-emerald-300 font-mono text-[10px]">AUDIT</code>, <code className="text-emerald-300 font-mono text-[10px]">EMERGENCY</code>)
                          </td>
                        </tr>

                        <tr className="hover:bg-slate-800/60 transition-colors bg-white/[0.02]">
                          <td className="py-2.5 px-4 font-bold text-blue-300 border-r border-white/10 flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-blue-400 shrink-0" />
                            <span>Containerization</span>
                          </td>
                          <td className="py-2.5 px-4 font-mono font-bold text-slate-100 border-r border-white/10">
                            Docker + Google Cloud Run / AWS Containers
                          </td>
                          <td className="py-2.5 px-4 text-slate-300">
                            Scalable, high-availability microservice container deployment with TLS 1.3 ALB termination
                          </td>
                        </tr>

                        <tr className="hover:bg-slate-800/60 transition-colors">
                          <td className="py-2.5 px-4 font-bold text-purple-300 border-r border-white/10 flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-purple-400 shrink-0" />
                            <span>Development</span>
                          </td>
                          <td className="py-2.5 px-4 font-mono font-bold text-slate-100 border-r border-white/10">
                            TypeScript 5.8 + Lucide Icons + Git / GitHub
                          </td>
                          <td className="py-2.5 px-4 text-slate-300">
                            Type-safe development, modern icon system & version control on GitHub (<code className="text-purple-300 font-mono text-[10px]">main</code> branch)
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* MODAL CONTENT: RAG */}
              {activeModal === 'RAG' && (
                <div className="space-y-4 text-xs leading-relaxed text-slate-300">
                  <div className="p-4 rounded-2xl bg-amber-950/40 border border-amber-500/30 space-y-2">
                    <h3 className="text-sm font-bold text-amber-300 flex items-center gap-2">
                      <Database className="w-4 h-4 text-amber-400" />
                      <span>Governed Clinical RAG Pipeline Architecture</span>
                    </h3>
                    <p>
                      Retrieval-Augmented Generation (RAG) grounds LLM responses in real-time FHIR clinical observations, active conditions, and institutional clinical practice guidelines.
                    </p>
                  </div>

                  <div className="space-y-2 font-mono text-[11px]">
                    <div className="p-3 rounded-xl bg-black/50 border border-white/10 space-y-1">
                      <div className="flex items-center justify-between text-cyan-300 font-bold">
                        <span>Step 1: Patient FHIR Context Ingestion</span>
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      </div>
                      <p className="text-slate-400 font-sans text-[11px]">
                        Loads patient vitals, eGFR, meds, and team notes directly from PostgreSQL store.
                      </p>
                    </div>

                    <div className="p-3 rounded-xl bg-black/50 border border-white/10 space-y-1">
                      <div className="flex items-center justify-between text-purple-300 font-bold">
                        <span>Step 2: DLP PHI Tokenization & Masking</span>
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      </div>
                      <p className="text-slate-400 font-sans text-[11px]">
                        Replaces patient full name (`[REDACTED_PATIENT_NAME]`) and direct identifiers before LLM transmission.
                      </p>
                    </div>

                    <div className="p-3 rounded-xl bg-black/50 border border-white/10 space-y-1">
                      <div className="flex items-center justify-between text-amber-300 font-bold">
                        <span>Step 3: Hybrid Lexical (BM25) + Vector Retrieval</span>
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      </div>
                      <p className="text-slate-400 font-sans text-[11px]">
                        Retrieves top matching AHA/ACC, ADA, and GOLD clinical guideline chunks via pgvector.
                      </p>
                    </div>

                    <div className="p-3 rounded-xl bg-black/50 border border-white/10 space-y-1">
                      <div className="flex items-center justify-between text-emerald-300 font-bold">
                        <span>Step 4: Gemini LLM Synthesis & Groundedness Audit</span>
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      </div>
                      <p className="text-slate-400 font-sans text-[11px]">
                        Synthesizes response, validates claims against citations, and outputs live token consumption metrics.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Modal Footer */}
              <div className="pt-2 flex justify-end">
                <button
                  onClick={() => setActiveModal(null)}
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs transition-colors cursor-pointer"
                >
                  Close Overview
                </button>
              </div>

            </div>
          </div>
        )}
      </div>
    </div>
  );
};
