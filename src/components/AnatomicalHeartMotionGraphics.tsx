import React, { useState } from 'react';
import { Heart, Activity, Volume2, VolumeX, Sparkles } from 'lucide-react';

export const AnatomicalHeartMotionGraphics: React.FC = () => {
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  const toggleAudioSimulation = () => {
    setIsPlayingAudio(!isPlayingAudio);
  };

  return (
    <div className="relative w-full overflow-hidden py-12 my-8 rounded-3xl bg-transparent border border-cyan-400/10 backdrop-blur-[1px] transition-all">
      
      {/* Background Radial Glow & Cardiac Grid Overlay (Semi-transparent so background video is visible) */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-900/20 via-purple-900/10 to-transparent pointer-events-none" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />

      {/* CONTINUOUS TRAVELLING EKG HEART RATE MONITOR LINE */}
      <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-48 pointer-events-none overflow-hidden opacity-90">
        <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 1200 120">
          <defs>
            <linearGradient id="ecgWaveGradCentered" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.1" />
              <stop offset="25%" stopColor="#38bdf8" stopOpacity="0.9" />
              <stop offset="50%" stopColor="#c084fc" stopOpacity="1" />
              <stop offset="75%" stopColor="#3b82f6" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#38bdf8" stopOpacity="0.1" />
            </linearGradient>
            <filter id="waveGlowCentered" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3.5" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Primary Travelling EKG Wave Pattern */}
          <path
            d="M 0 60 L 150 60 L 170 55 L 185 65 L 195 60 L 210 60 L 220 15 L 235 105 L 250 35 L 260 60 L 280 60 L 300 50 L 320 60 L 450 60 L 470 55 L 485 65 L 495 60 L 510 60 L 520 15 L 535 105 L 550 35 L 560 60 L 580 60 L 600 50 L 620 60 L 750 60 L 770 55 L 785 65 L 795 60 L 810 60 L 820 15 L 835 105 L 850 35 L 860 60 L 880 60 L 900 50 L 920 60 L 1050 60 L 1070 55 L 1085 65 L 1095 60 L 1110 60 L 1120 15 L 1135 105 L 1150 35 L 1160 60 L 1200 60"
            fill="none"
            stroke="url(#ecgWaveGradCentered)"
            strokeWidth="3.5"
            strokeLinecap="round"
            filter="url(#waveGlowCentered)"
            className="animate-ecg-travel-fast"
          />

          {/* Secondary Ambient Wave Pattern */}
          <path
            d="M 0 60 L 150 60 L 170 55 L 185 65 L 195 60 L 210 60 L 220 15 L 235 105 L 250 35 L 260 60 L 280 60 L 300 50 L 320 60 L 450 60 L 470 55 L 485 65 L 495 60 L 510 60 L 520 15 L 535 105 L 550 35 L 560 60 L 580 60 L 600 50 L 620 60 L 750 60 L 770 55 L 785 65 L 795 60 L 810 60 L 820 15 L 835 105 L 850 35 L 860 60 L 880 60 L 900 50 L 920 60 L 1050 60 L 1070 55 L 1085 65 L 1095 60 L 1110 60 L 1120 15 L 1135 105 L 1150 35 L 1160 60 L 1200 60"
            fill="none"
            stroke="#a855f7"
            strokeWidth="1.5"
            strokeOpacity="0.45"
            className="animate-ecg-travel-slow"
          />
        </svg>
      </div>

      {/* TOP HEADER CONTROLS */}
      <div className="relative z-10 max-w-6xl mx-auto px-6 mb-6 flex items-center justify-between">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-cyan-500/15 border border-cyan-400/40 text-xs font-extrabold text-cyan-300 backdrop-blur-xl">
          <Activity className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
          <span>Real-Time Cardiac Motion & EKG Telemetry Waveform</span>
        </div>

        {/* Ambient Technological Audio Toggle Button */}
        <button
          onClick={toggleAudioSimulation}
          className={`px-3.5 py-1 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer border ${
            isPlayingAudio 
              ? 'bg-purple-500/20 text-purple-300 border-purple-400 shadow-md shadow-purple-500/30' 
              : 'bg-slate-900/80 text-slate-400 border-white/10 hover:text-white'
          }`}
          title="Toggle Technological Ambient & Cardiac Rhythm Sound"
        >
          {isPlayingAudio ? (
            <>
              <Volume2 className="w-3.5 h-3.5 text-purple-400 animate-pulse" />
              <span>Ambient Sound Active</span>
            </>
          ) : (
            <>
              <VolumeX className="w-3.5 h-3.5 text-slate-500" />
              <span>Audio Muted</span>
            </>
          )}
        </button>
      </div>

      {/* CENTERED 3D METALLIC HEART WITH REALISTIC BEATING MOTION GRAPHICS */}
      <div className="relative z-10 max-w-6xl mx-auto px-6 flex flex-col items-center justify-center text-center space-y-6">
        
        {/* CENTERED 3D ANATOMICAL HEART (No text on heart) */}
        <div className="relative flex items-center justify-center group my-2">
          
          {/* Multi-layered Glowing Radial Aura */}
          <div className="absolute w-80 h-80 sm:w-[420px] sm:h-[420px] rounded-full bg-gradient-to-tr from-cyan-500/35 via-purple-600/35 to-blue-600/25 blur-3xl animate-pulse-glow pointer-events-none" />
          <div className="absolute w-64 h-64 sm:w-84 sm:h-84 rounded-full bg-purple-500/25 blur-2xl animate-ping opacity-25 pointer-events-none" />

          {/* Glowing Vascular Orbit Rings */}
          <div className="absolute w-72 h-72 sm:w-96 sm:h-96 rounded-full border border-cyan-400/25 border-dashed animate-spin-slow pointer-events-none" />
          <div className="absolute w-80 h-80 sm:w-[440px] sm:h-[440px] rounded-full border border-purple-500/15 border-dotted animate-spin-reverse pointer-events-none" />
          
          {/* THE GENERATED 1024x1024 3D METALLIC HEART SYMBOL */}
          <div className="relative z-10 transition-transform duration-300 group-hover:scale-105">
            <img
              src="/3d_heart_centered.png"
              alt="3D Anatomical Metallic Beating Heart Motion Graphics"
              className="w-64 sm:w-80 md:w-96 h-auto object-contain filter drop-shadow-[0_0_35px_rgba(56,189,248,0.65)] drop-shadow-[0_0_70px_rgba(168,85,247,0.5)] animate-cardiac-beat"
            />
          </div>

          {/* Traveling Heart Sync Marker on top right of Heart */}
          <div className="absolute top-6 right-2 sm:right-6 bg-slate-950/90 border border-cyan-400/40 text-cyan-300 text-[10px] font-mono font-bold px-3 py-1.5 rounded-full shadow-2xl flex items-center gap-2 backdrop-blur-xl animate-bounce-soft">
            <Heart className="w-3.5 h-3.5 text-cyan-300 fill-cyan-300 animate-ping" />
            <span>Cardiac Sync 72 BPM</span>
          </div>
        </div>

        {/* BOTTOM CENTERED TELEMETRY & HEMODYNAMIC CAPABILITY BADGES */}
        <div className="max-w-2xl mx-auto space-y-3">
          <h3 className="text-2xl sm:text-3xl font-black text-white leading-tight">
            Precision Cardiac Intelligence & <br />
            <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
              Hemodynamic Wave Telemetry
            </span>
          </h3>

          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal">
            Continuous real-time physiological wave tracking, multi-agent cardiac risk synthesis, and evidence-grounded decision support across hospital networks.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2 font-mono text-xs">
            <div className="px-4 py-2 rounded-2xl bg-slate-950/40 border border-white/10 backdrop-blur-md flex items-center gap-2 text-slate-200 shadow-md">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping"></span>
              <span>Sinus Rhythm: <strong className="text-cyan-300">Synchronized</strong></span>
            </div>
            <div className="px-4 py-2 rounded-2xl bg-slate-950/40 border border-white/10 backdrop-blur-md flex items-center gap-2 text-slate-200 shadow-md">
              <span className="w-2 h-2 rounded-full bg-purple-400 animate-ping"></span>
              <span>Cardiac Output: <strong className="text-purple-300">5.2 L/min</strong></span>
            </div>
            <div className="px-4 py-2 rounded-2xl bg-slate-950/40 border border-white/10 backdrop-blur-md flex items-center gap-2 text-slate-200 shadow-md">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
              <span>Vector Grounding: <strong className="text-emerald-300">99.98%</strong></span>
            </div>
          </div>
        </div>

      </div>

      {/* Embedded CSS Animations for Cardiac Beat & Traveling ECG Wave */}
      <style>{`
        @keyframes ecg-travel-fast {
          0% { stroke-dasharray: 1200; stroke-dashoffset: 1200; }
          100% { stroke-dasharray: 1200; stroke-dashoffset: 0; }
        }
        @keyframes ecg-travel-slow {
          0% { stroke-dasharray: 1200; stroke-dashoffset: -1200; }
          100% { stroke-dasharray: 1200; stroke-dashoffset: 0; }
        }
        @keyframes cardiac-beat {
          0%, 100% { 
            transform: scale(1) rotate(0deg) translateY(0px); 
          }
          14% { 
            transform: scale(1.14) rotate(-1.5deg) translateY(-5px); 
          }
          28% { 
            transform: scale(0.96) rotate(1deg) translateY(2px); 
          }
          42% { 
            transform: scale(1.10) rotate(1deg) translateY(-3px); 
          }
          56% { 
            transform: scale(0.98) rotate(-0.5deg) translateY(0px); 
          }
        }
        @keyframes pulse-glow {
          0%, 100% { opacity: 0.45; transform: scale(1); }
          14% { opacity: 0.9; transform: scale(1.18); }
          50% { opacity: 0.5; transform: scale(1.02); }
        }
        @keyframes bounce-soft {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-5px); }
        }
        @keyframes spin-reverse {
          0% { transform: rotate(360deg); }
          100% { transform: rotate(0deg); }
        }
        .animate-ecg-travel-fast {
          animation: ecg-travel-fast 3.2s linear infinite;
        }
        .animate-ecg-travel-slow {
          animation: ecg-travel-slow 6s linear infinite;
        }
        .animate-cardiac-beat {
          animation: cardiac-beat 1.15s cubic-bezier(0.25, 0.1, 0.25, 1) infinite;
        }
        .animate-pulse-glow {
          animation: pulse-glow 1.15s ease-in-out infinite;
        }
        .animate-bounce-soft {
          animation: bounce-soft 1.8s ease-in-out infinite;
        }
        .animate-spin-slow {
          animation: spin 18s linear infinite;
        }
        .animate-spin-reverse {
          animation: spin-reverse 25s linear infinite;
        }
      `}</style>

    </div>
  );
};
