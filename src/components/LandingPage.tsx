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
        <section id="hero-section" className="text-center max-w-3xl mx-auto space-y-6 mb-12 min-h-[260px] pt-8">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-xs font-semibold text-cyan-300 backdrop-blur-md">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
            </span>
            Clinical Decision Intelligence • Version 1.0 Enterprise Baseline
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.15]">
            AI-Powered Clinical <br />
            <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-300 bg-clip-text text-transparent">
              Intelligence for
            </span> <br />
            Better Patient Care
          </h1>

          <p className="text-sm sm:text-base text-slate-300 max-w-xl mx-auto leading-relaxed font-normal">
            Secure. Reliable. Evidence-based. Built for clinicians. Backed by trust.
          </p>

          {/* Quick Action CTAs */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              onClick={() => {
                if (currentUser) {
                  onEnterClinicianPortal(currentUser);
                } else if (onOpenSignInModal) {
                  onOpenSignInModal();
                } else {
                  onEnterClinicianPortal();
                }
              }}
              className="px-6 py-3 rounded-2xl bg-blue-600 hover:bg-blue-500 active:scale-[0.99] text-white font-bold text-sm shadow-xl shadow-blue-600/30 transition-all flex items-center gap-2 cursor-pointer"
            >
              <LogIn className="w-4 h-4" />
              <span>{currentUser ? 'Enter Clinical Workspace' : 'Sign In to Workspace'}</span>
              <ArrowRight className="w-4 h-4 ml-0.5" />
            </button>

            {/* Direct Export ZIP Source Code Download Link */}
            <a
              href="/api/export/zip"
              download="healthnet-clinical-ai-v1.zip"
              className="px-5 py-3 rounded-2xl bg-slate-900/80 hover:bg-slate-800/90 active:scale-[0.99] text-cyan-300 hover:text-cyan-200 border border-cyan-500/30 hover:border-cyan-500/60 font-semibold text-sm shadow-xl backdrop-blur-xl transition-all flex items-center gap-2 cursor-pointer"
              title="Download clean repository source code archive"
            >
              <Download className="w-4 h-4 text-cyan-400" />
              <span>Export Source ZIP (v1.0)</span>
            </a>
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
