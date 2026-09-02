import React, { useState, useRef, useEffect } from 'react';
import { 
  Play, 
  Pause, 
  Sparkles, 
  Sliders, 
  ShieldCheck, 
  Stethoscope, 
  Heart,
  Video,
  Orbit,
  Maximize2,
  Compass,
  CheckCircle2,
  Upload,
  Film,
  Tv
} from 'lucide-react';
import { HospitalBackgroundCanvas } from './HospitalBackgroundCanvas';
import { useTheme } from '../context/ThemeContext';

export interface ClinicalVideoScene {
  id: string;
  title: string;
  subtitle: string;
  category: 'FUTURISTIC_3D' | 'CONSULTATION' | 'INPATIENT_WARD' | 'SURGICAL_OR' | 'DIAGNOSTIC' | 'USER_UPLOAD';
  type: '3D_SIMULATION' | 'VIDEO_STREAM';
  videoUrl?: string;
  fallbackPoster: string;
  location: string;
  activeTelemetry: string;
}

// Curated scenes with the user-uploaded 1080p Smart Hospital Atrium & Holographic AI video as the primary stream
export const CLINICAL_VIDEO_SCENES: ClinicalVideoScene[] = [
  {
    id: 'scene-user-hospital-video',
    title: '2035 Smart Hospital & Holographic Neural AI (1080p)',
    subtitle: 'Doctors, clinicians, and nurses consulting with 3D neural brain holograms and smart telemetry in landscape 1080p',
    category: 'FUTURISTIC_3D',
    type: 'VIDEO_STREAM',
    videoUrl: '/hospital_live_bg.mp4',
    fallbackPoster: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=1920&q=80',
    location: 'Metro Health 2035 Atrium • Central AI Hub',
    activeTelemetry: 'Neural Hologram Stream Active | 1080p 60fps | Zero Variance',
  },
  {
    id: 'scene-futuristic-atrium-3d',
    title: '2035 Procedural 3D Canvas Simulation',
    subtitle: 'Interactive real-time rendered 3D brain hologram, medical drones, and staff',
    category: 'FUTURISTIC_3D',
    type: '3D_SIMULATION',
    fallbackPoster: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=1920&q=80',
    location: 'Metro Health 2035 Atrium • Procedural Engine',
    activeTelemetry: '3D Canvas Mesh Running | 60 FPS',
  },
  {
    id: 'scene-consultation',
    title: 'Doctor & Patient Clinical Consultation',
    subtitle: 'Attending physician reviewing diagnostic history and treatment plan with patient in exam suite',
    category: 'CONSULTATION',
    type: 'VIDEO_STREAM',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-doctor-talking-to-a-patient-in-a-hospital-room-41584-large.mp4',
    fallbackPoster: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=1920&q=80',
    location: 'Metro St. Jude • Outpatient Exam Suite 3B',
    activeTelemetry: 'Pulse: 72 bpm | BP: 120/80 | SpO2: 99%',
  },
  {
    id: 'scene-inpatient-care',
    title: 'Inpatient Ward & Bedside Care',
    subtitle: 'Clinical nursing team administering medication and monitoring telemetry at patient bedside',
    category: 'INPATIENT_WARD',
    type: 'VIDEO_STREAM',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-nurse-checking-a-patient-in-a-hospital-bed-41585-large.mp4',
    fallbackPoster: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=1920&q=80',
    location: 'North River Community • Cardiology 4W',
    activeTelemetry: 'Telemetry: Sinus Rhythm | IV Infusion: Normal',
  },
  {
    id: 'scene-physicians-rounds',
    title: 'Physicians Reviewing Clinical Imaging',
    subtitle: 'Multi-disciplinary medical team collaborating on longitudinal diagnostics and EHR charts',
    category: 'DIAGNOSTIC',
    type: 'VIDEO_STREAM',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-doctors-and-nurses-in-a-hospital-corridor-41582-large.mp4',
    fallbackPoster: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=1920&q=80',
    location: 'Valley General • Diagnostic Imaging Hub',
    activeTelemetry: 'CT/MRI AI Assist: Synced | Zero Variance',
  },
  {
    id: 'scene-surgical-suite',
    title: 'Operating Room & Surgical Team',
    subtitle: 'Surgical specialists and anesthesiologists preparing high-precision clinical intervention',
    category: 'SURGICAL_OR',
    type: 'VIDEO_STREAM',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-surgeons-performing-an-operation-in-an-operating-room-41586-large.mp4',
    fallbackPoster: 'https://images.unsplash.com/photo-1551076805-e1869033e561?auto=format&fit=crop&w=1920&q=80',
    location: 'St. Jude Robotics Pavilion • OR-1',
    activeTelemetry: 'Core Temp: 36.8°C | MAP: 85 mmHg | Stable',
  },
];

interface HospitalVideoBackgroundProps {
  initialSceneIndex?: number;
  showOverlayControls?: boolean;
}

export const HospitalVideoBackground: React.FC<HospitalVideoBackgroundProps> = ({
  initialSceneIndex = 0,
  showOverlayControls = true,
}) => {
  const [currentSceneIndex, setCurrentSceneIndex] = useState(initialSceneIndex);
  const [customVideoUrl, setCustomVideoUrl] = useState<string | null>(null);
  const [aspectMode, setAspectMode] = useState<'16:9' | 'fill' | '21:9'>('16:9');
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [videoError, setVideoError] = useState(false);
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const [blurLevel, setBlurLevel] = useState<'none' | 'subtle' | 'medium' | 'deep'>('none');
  const [dimLevel, setDimLevel] = useState<'crystal' | 'light' | 'balanced' | 'deep'>('crystal');
  const [showSettings, setShowSettings] = useState(false);
  const [liveHr, setLiveHr] = useState(72);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const activeScene = CLINICAL_VIDEO_SCENES[currentSceneIndex] || CLINICAL_VIDEO_SCENES[0];
  const { isDark } = useTheme();

  const currentVideoSrc = customVideoUrl || activeScene.videoUrl;

  // Dynamic subtle heart rate tick for realism
  useEffect(() => {
    const timer = setInterval(() => {
      setLiveHr((prev) => {
        const delta = (Math.random() - 0.5) * 3;
        return Math.max(68, Math.min(80, Math.round(prev + delta)));
      });
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  // Robust autoplay and loading listener
  useEffect(() => {
    const video = videoRef.current;
    if (video && (activeScene.type === 'VIDEO_STREAM' || customVideoUrl)) {
      video.muted = true;
      video.defaultMuted = true;
      video.playsInline = true;

      const triggerPlay = () => {
        setIsVideoLoaded(true);
        if (isPlaying) {
          video.play().catch((err) => {
            console.log('Autoplay waiting for user gesture or policy:', err);
          });
        }
      };

      if (video.readyState >= 2) {
        triggerPlay();
      } else {
        video.addEventListener('canplay', triggerPlay, { once: true });
        video.addEventListener('loadeddata', triggerPlay, { once: true });
        video.addEventListener('playing', triggerPlay, { once: true });
      }
    }
  }, [currentVideoSrc, isPlaying, activeScene.type, customVideoUrl]);

  // Handle play/pause toggle sync
  useEffect(() => {
    const video = videoRef.current;
    if (video && (activeScene.type === 'VIDEO_STREAM' || customVideoUrl)) {
      if (isPlaying) {
        video.play().catch(() => {});
      } else {
        video.pause();
      }
    }
  }, [isPlaying]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setCustomVideoUrl(url);
      setIsVideoLoaded(true);
      setVideoError(false);
      setIsPlaying(true);
    }
  };

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  // Blur class mapping for frosted glass tuning
  const blurClasses = {
    none: 'backdrop-blur-none',
    subtle: 'backdrop-blur-[2px]',
    medium: 'backdrop-blur-[6px]',
    deep: 'backdrop-blur-md',
  };

  // Dim gradient class mapping - crystal-clear to ensure high visibility of live background
  const dimClasses = {
    crystal: isDark 
      ? 'bg-gradient-to-b from-slate-950/15 via-slate-900/20 to-[#0a0f1d]/35' 
      : 'bg-gradient-to-b from-white/15 via-slate-50/20 to-slate-100/35',
    light: isDark 
      ? 'bg-gradient-to-b from-slate-950/30 via-slate-900/35 to-[#0a0f1d]/50' 
      : 'bg-gradient-to-b from-white/30 via-slate-50/35 to-slate-100/50',
    balanced: isDark 
      ? 'bg-gradient-to-b from-slate-950/50 via-slate-900/55 to-[#0a0f1d]/70' 
      : 'bg-gradient-to-b from-white/55 via-slate-50/60 to-slate-100/75',
    deep: isDark 
      ? 'bg-gradient-to-b from-slate-950/75 via-slate-900/80 to-[#0a0f1d]/90' 
      : 'bg-gradient-to-b from-white/80 via-slate-50/85 to-slate-100/90',
  };

  return (
    <div className="fixed inset-0 w-full h-full overflow-hidden pointer-events-none z-0 select-none bg-slate-950">
      {/* ========================================================================= */}
      {/* 1. PRIMARY CINEMATIC BACKGROUND LAYER (3D SIMULATION OR 4K VIDEO STREAM) */}
      {/* ========================================================================= */}
      {(!customVideoUrl && activeScene.type === '3D_SIMULATION') ? (
        <HospitalBackgroundCanvas 
          sceneMode="ATRIUM_3D" 
          showTelemetry={true} 
          showHologram={true} 
          cameraSpeed={isPlaying ? 1 : 0} 
        />
      ) : (
        <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
          {/* Exact 16:9 Landscape Aspect Ratio Framing Container */}
          <div className={`relative transition-all duration-700 ${
            aspectMode === '16:9'
              ? 'w-full h-full min-w-[100vw] min-h-[56.25vw] sm:min-h-[100vh] sm:min-w-[177.77vh] flex items-center justify-center'
              : aspectMode === '21:9'
              ? 'w-full h-full min-w-[100vw] min-h-[42.85vw] sm:min-h-[100vh] sm:min-w-[233.33vh] flex items-center justify-center'
              : 'w-full h-full'
          }`}>
            <video
              ref={videoRef}
              key={currentVideoSrc}
              poster={activeScene.fallbackPoster}
              autoPlay
              loop
              muted
              playsInline
              preload="auto"
              onLoadedData={() => setIsVideoLoaded(true)}
              onCanPlay={() => setIsVideoLoaded(true)}
              onPlaying={() => setIsVideoLoaded(true)}
              className="w-full h-full object-cover object-center transform-gpu will-change-transform opacity-100"
            >
              {customVideoUrl ? (
                <source src={customVideoUrl} type="video/mp4" />
              ) : (
                <>
                  <source src="/hospital_live_bg.mp4" type="video/mp4" />
                  <source src="/Animations/Hospital_staff_consulting_digita…_1080p_202608270046.mp4" type="video/mp4" />
                  {activeScene.videoUrl && <source src={activeScene.videoUrl} type="video/mp4" />}
                </>
              )}
            </video>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. MEDICAL HUD GRID & SCANLINE SUBTLE TEXTURE OVERLAY                     */}
      {/* ========================================================================= */}
      <div 
        className="absolute inset-0 opacity-[0.03] pointer-events-none mix-blend-overlay"
        style={{
          backgroundImage: `radial-gradient(circle, #38bdf8 1px, transparent 1px)`,
          backgroundSize: '24px 24px',
        }}
      />

      {/* ========================================================================= */}
      {/* 3. FROSTED GLASS TINT & VIGNETTE GRADIENTS (SAFE ZONE FOR WEBSITE TEXT)   */}
      {/* ========================================================================= */}
      <div className={`absolute inset-0 ${dimClasses[dimLevel]} ${blurClasses[blurLevel]} transition-all duration-500`} />

      {/* ========================================================================= */}
      {/* 4. AMBIENT VOLUMETRIC LIGHTING CONES                                      */}
      {/* ========================================================================= */}
      <div className={`absolute top-0 left-1/4 w-[500px] h-[500px] rounded-full blur-3xl pointer-events-none ${
        isDark ? 'bg-cyan-500/10' : 'bg-cyan-400/10'
      }`} />
      <div className={`absolute top-1/3 right-10 w-[600px] h-[600px] rounded-full blur-3xl pointer-events-none ${
        isDark ? 'bg-blue-600/10' : 'bg-blue-400/10'
      }`} />
      <div className={`absolute bottom-10 left-10 w-[500px] h-[500px] rounded-full blur-3xl pointer-events-none ${
        isDark ? 'bg-emerald-500/10' : 'bg-emerald-400/10'
      }`} />

      {/* ========================================================================= */}
      {/* 5. FLOATING INTERACTIVE ATMOSPHERE & SCENE CONTROLLER (TOP RIGHT)         */}
      {/* ========================================================================= */}
      {showOverlayControls && (
        <div className="absolute top-4 right-4 pointer-events-auto z-30 flex items-center gap-2">
          {/* Live Hospital Telemetry Pill */}
          <div className={`hidden sm:flex items-center gap-2.5 px-3.5 py-1.5 rounded-full backdrop-blur-2xl shadow-xl text-xs ${
            isDark 
              ? 'bg-slate-950/80 border border-white/15 text-slate-200' 
              : 'bg-white/90 border border-slate-200 text-slate-800'
          }`}>
            <span className={`flex items-center gap-1.5 font-bold font-mono ${isDark ? 'text-emerald-400' : 'text-emerald-600'}`}>
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <Heart className={`w-3.5 h-3.5 ${isDark ? 'text-emerald-400' : 'text-emerald-600'}`} />
              {liveHr} BPM
            </span>
            <span className={isDark ? 'text-white/20' : 'text-slate-300'}>|</span>
            <span className={`font-mono text-[10px] px-1.5 py-0.5 rounded ${isDark ? 'bg-cyan-500/20 text-cyan-300' : 'bg-cyan-100 text-cyan-800'}`}>
              {aspectMode} Aspect
            </span>
            <span className={isDark ? 'text-white/20' : 'text-slate-300'}>|</span>
            <span className={`font-medium text-[11px] truncate max-w-[180px] ${isDark ? 'text-slate-200' : 'text-slate-700'}`}>
              {customVideoUrl ? 'Custom Video Active' : activeScene.location}
            </span>
          </div>

          {/* Quick Play/Pause Button */}
          <button
            onClick={togglePlay}
            className={`p-2 rounded-xl backdrop-blur-2xl transition-all shadow-lg cursor-pointer ${
              isDark 
                ? 'bg-slate-950/80 hover:bg-slate-900 border border-white/15 text-slate-300 hover:text-white' 
                : 'bg-white/90 hover:bg-slate-100 border border-slate-200 text-slate-700 hover:text-slate-900'
            }`}
            title={isPlaying ? 'Pause Hospital Cinematic Animation' : 'Resume Hospital Cinematic Animation'}
          >
            {isPlaying ? <Pause className="w-4 h-4 text-cyan-500" /> : <Play className="w-4 h-4 text-emerald-500" />}
          </button>

          {/* Settings & Scene Switcher Dropdown Toggle */}
          <button
            onClick={() => setShowSettings(!showSettings)}
            className={`p-2 rounded-xl border backdrop-blur-2xl transition-all shadow-lg cursor-pointer ${
              showSettings
                ? 'bg-blue-600 border-blue-400 text-white'
                : isDark
                  ? 'bg-slate-950/80 hover:bg-slate-900 border border-white/15 text-slate-300 hover:text-white'
                  : 'bg-white/90 hover:bg-slate-100 border border-slate-200 text-slate-700 hover:text-slate-900'
            }`}
            title="Hospital Cinematic Environment Switcher"
          >
            <Orbit className={`w-4 h-4 ${isDark ? 'text-cyan-300' : 'text-blue-600'}`} />
          </button>

          {/* Settings Flyout Menu */}
          {showSettings && (
            <div className={`absolute right-0 top-12 w-88 backdrop-blur-2xl border rounded-2xl p-4 shadow-2xl z-40 space-y-4 pointer-events-auto animate-in fade-in zoom-in-95 duration-200 ${
              isDark
                ? 'bg-slate-950/95 border-white/15 text-slate-100'
                : 'bg-white/95 border-slate-200 text-slate-900'
            }`}>
              <div className={`flex items-center justify-between border-b pb-2.5 ${isDark ? 'border-white/10' : 'border-slate-200'}`}>
                <div className="flex items-center gap-2">
                  <div className={`p-1.5 rounded-lg ${isDark ? 'bg-cyan-500/20 text-cyan-300' : 'bg-cyan-100 text-cyan-700'}`}>
                    <Stethoscope className="w-4 h-4" />
                  </div>
                  <div>
                    <span className={`text-xs font-bold block ${isDark ? 'text-white' : 'text-slate-900'}`}>Cinematic Healthcare Video</span>
                    <span className={`text-[10px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>16:9 Aspect Ratio & 3D Simulation</span>
                  </div>
                </div>
                <button
                  onClick={togglePlay}
                  className={`text-[11px] px-2 py-0.5 rounded-lg transition-colors flex items-center gap-1 cursor-pointer ${
                    isDark ? 'bg-white/10 hover:bg-white/20 text-slate-200' : 'bg-slate-100 hover:bg-slate-200 text-slate-800'
                  }`}
                >
                  {isPlaying ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
                  {isPlaying ? 'Pause' : 'Play'}
                </button>
              </div>

              {/* Aspect Ratio Mode Selector */}
              <div className="space-y-1.5">
                <label className={`text-[11px] font-bold uppercase tracking-wider block ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                  Aspect Ratio Fit:
                </label>
                <div className="grid grid-cols-3 gap-1.5">
                  {[
                    { id: '16:9', label: '16:9 Landscape', icon: Tv },
                    { id: 'fill', label: 'Fill Viewport', icon: Maximize2 },
                    { id: '21:9', label: '21:9 Cinema', icon: Film },
                  ].map((mode) => {
                    const isSelected = aspectMode === mode.id;
                    const Icon = mode.icon;
                    return (
                      <button
                        key={mode.id}
                        onClick={() => setAspectMode(mode.id as any)}
                        className={`p-2 rounded-xl border text-center transition-all cursor-pointer flex flex-col items-center gap-1 ${
                          isSelected
                            ? isDark
                              ? 'bg-blue-600 border-blue-400 text-white shadow-md'
                              : 'bg-blue-600 border-blue-600 text-white shadow-md'
                            : isDark
                              ? 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10'
                              : 'bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200'
                        }`}
                      >
                        <Icon className="w-3.5 h-3.5" />
                        <span className="text-[10px] font-bold">{mode.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Video File Upload (Custom Video Input) */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className={`text-[11px] font-bold uppercase tracking-wider block ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                    Upload Video Stream:
                  </label>
                  {customVideoUrl && (
                    <button
                      onClick={() => setCustomVideoUrl(null)}
                      className="text-[10px] text-cyan-400 hover:underline cursor-pointer"
                    >
                      Reset Default
                    </button>
                  )}
                </div>
                <input
                  type="file"
                  ref={fileInputRef}
                  accept="video/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className={`w-full py-2 px-3 rounded-xl border border-dashed text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                    isDark
                      ? 'bg-cyan-500/10 hover:bg-cyan-500/20 border-cyan-500/40 text-cyan-300'
                      : 'bg-cyan-50 hover:bg-cyan-100 border-cyan-300 text-cyan-800'
                  }`}
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>{customVideoUrl ? 'Replace Custom Video File' : 'Select Local Video File (.mp4)'}</span>
                </button>
              </div>

              {/* Scene Switcher */}
              <div className="space-y-1.5">
                <label className={`text-[11px] font-bold uppercase tracking-wider block ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                  Select Hospital Scene:
                </label>
                <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1 no-scrollbar">
                  {CLINICAL_VIDEO_SCENES.map((scene, idx) => {
                    const isSelected = !customVideoUrl && currentSceneIndex === idx;
                    return (
                      <button
                        key={scene.id}
                        onClick={() => {
                          setCustomVideoUrl(null);
                          setCurrentSceneIndex(idx);
                          setIsVideoLoaded(false);
                          setVideoError(false);
                        }}
                        className={`w-full text-left p-2.5 rounded-xl border transition-all cursor-pointer flex items-start justify-between gap-2 ${
                          isSelected
                            ? isDark
                              ? 'bg-cyan-500/20 border-cyan-400 text-white shadow-md'
                              : 'bg-cyan-50 border-cyan-300 text-slate-900 shadow-sm'
                            : isDark
                              ? 'bg-white/5 hover:bg-white/10 border-white/10 text-slate-300'
                              : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-700'
                        }`}
                      >
                        <div>
                          <div className="text-xs font-bold flex items-center gap-1.5">
                            <span className={isDark ? 'text-cyan-400' : 'text-cyan-600'}>
                              {scene.type === '3D_SIMULATION' ? '★' : `#${idx + 1}`}
                            </span>
                            <span className={isDark ? 'text-white' : 'text-slate-900'}>{scene.title}</span>
                          </div>
                          <div className={`text-[10px] mt-0.5 line-clamp-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                            {scene.subtitle}
                          </div>
                        </div>
                        <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded border shrink-0 ${
                          scene.type === '3D_SIMULATION'
                            ? 'bg-blue-600 text-white border-blue-500'
                            : isSelected
                              ? isDark
                                ? 'bg-cyan-500/30 text-cyan-300 border-cyan-400/40'
                                : 'bg-cyan-100 text-cyan-800 border-cyan-300'
                              : isDark
                                ? 'bg-white/5 text-slate-400 border-white/10'
                                : 'bg-slate-200 text-slate-600 border-slate-300'
                        }`}>
                          {scene.type === '3D_SIMULATION' ? '3D HERO' : '4K VIDEO'}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Frosted Glass Overlay Adjustment */}
              <div className={`space-y-2 pt-2 border-t ${isDark ? 'border-white/10' : 'border-slate-200'}`}>
                <div className="flex items-center justify-between text-xs">
                  <span className={`font-medium ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Frosted Glass Blur:</span>
                  <div className={`flex items-center gap-1 rounded-lg p-0.5 border ${isDark ? 'bg-slate-900 border-white/10' : 'bg-slate-100 border-slate-200'}`}>
                    {(['none', 'subtle', 'medium', 'deep'] as const).map((lvl) => (
                      <button
                        key={lvl}
                        onClick={() => setBlurLevel(lvl)}
                        className={`px-2 py-0.5 rounded text-[10px] font-bold capitalize transition-colors cursor-pointer ${
                          blurLevel === lvl
                            ? 'bg-blue-600 text-white'
                            : isDark ? 'text-slate-400 hover:text-slate-200' : 'text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        {lvl}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs">
                  <span className={`font-medium ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Dimming Tint:</span>
                  <div className={`flex items-center gap-1 rounded-lg p-0.5 border ${isDark ? 'bg-slate-900 border-white/10' : 'bg-slate-100 border-slate-200'}`}>
                    {(['crystal', 'light', 'balanced', 'deep'] as const).map((lvl) => (
                      <button
                        key={lvl}
                        onClick={() => setDimLevel(lvl)}
                        className={`px-2 py-0.5 rounded text-[10px] font-bold capitalize transition-colors cursor-pointer ${
                          dimLevel === lvl
                            ? 'bg-blue-600 text-white'
                            : isDark ? 'text-slate-400 hover:text-slate-200' : 'text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        {lvl}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Status Note */}
              <div className={`text-[10px] rounded-xl p-2 flex items-center gap-1.5 border ${
                isDark ? 'text-slate-400 bg-white/5 border-white/5' : 'text-slate-600 bg-slate-100 border-slate-200'
              }`}>
                <ShieldCheck className={`w-3.5 h-3.5 shrink-0 ${isDark ? 'text-emerald-400' : 'text-emerald-600'}`} />
                <span>Perfect 16:9 Landscape Aspect Ratio with responsive focal centering.</span>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

