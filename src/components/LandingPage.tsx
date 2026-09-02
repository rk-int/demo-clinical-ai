import React from 'react';
import { 
  ShieldCheck, 
  FileCheck, 
  LogIn, 
  UserCheck, 
  Cpu,
  ArrowRight,
  Download
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

  return (
    <div className={`relative min-h-screen overflow-hidden font-sans transition-colors duration-300 ${
      isDark ? 'text-slate-100' : 'text-slate-900'
    }`}>
      {/* Full-Screen Hospital Video Background */}
      <HospitalVideoBackground initialSceneIndex={0} showOverlayControls={true} />

      {/* Main Content Layout */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-20">
        
        {/* ========================================================================= */}
        {/* HERO SECTION                                                              */}
        {/* ========================================================================= */}
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

          {/* Quick Action CTAs (Hidden when not logged in since top Navbar Sign In exists) */}
          {currentUser && (
            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <button
                onClick={() => onEnterClinicianPortal(currentUser)}
                className="px-7 py-3.5 rounded-2xl bg-blue-600 hover:bg-blue-500 active:scale-[0.99] text-white font-extrabold text-sm shadow-xl shadow-blue-600/30 transition-all flex items-center gap-2.5 cursor-pointer hover:scale-105"
              >
                <LogIn className="w-4 h-4" />
                <span>Enter Clinical Workspace</span>
                <ArrowRight className="w-4 h-4 ml-0.5" />
              </button>

              {/* Direct Export ZIP Source Code Download Link (Portal Admin Only) */}
              {currentUser.role === 'PORTAL_ADMIN' && (
                <a
                  href="/api/export/zip"
                  download="healthnet-clinical-ai-v1.zip"
                  className="px-5 py-3.5 rounded-2xl bg-slate-900/80 hover:bg-slate-800/90 active:scale-[0.99] text-cyan-300 hover:text-cyan-200 border border-cyan-500/30 hover:border-cyan-500/60 font-semibold text-sm shadow-xl backdrop-blur-xl transition-all flex items-center gap-2 cursor-pointer"
                  title="Download clean repository source code archive"
                >
                  <Download className="w-4 h-4 text-cyan-400" />
                  <span>Export Source ZIP (v1.0)</span>
                </a>
              )}
            </div>
          )}
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
      </div>
    </div>
  );
};
