import React, { useEffect, useRef, useState } from 'react';
import { 
  Heart, 
  Activity, 
  Sparkles, 
  Eye, 
  Play, 
  Pause, 
  Sliders, 
  Layers, 
  Compass, 
  Maximize2, 
  ShieldCheck, 
  Zap, 
  RefreshCw,
  Orbit,
  Stethoscope,
  ChevronRight
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export interface HospitalCanvasProps {
  sceneMode?: 'ATRIUM_3D' | 'DIAGNOSTIC_ORBIT' | 'ELEVATED_WALKWAY' | 'CONSULTATION_PODS';
  showTelemetry?: boolean;
  showHologram?: boolean;
  cameraSpeed?: number;
}

export const HospitalBackgroundCanvas: React.FC<HospitalCanvasProps> = ({
  sceneMode: initialScene = 'ATRIUM_3D',
  showTelemetry: initialTelemetry = true,
  showHologram: initialHologram = true,
  cameraSpeed: initialSpeed = 1,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const { isDark } = useTheme();
  
  const [sceneMode, setSceneMode] = useState<'ATRIUM_3D' | 'DIAGNOSTIC_ORBIT' | 'ELEVATED_WALKWAY' | 'CONSULTATION_PODS'>(initialScene);
  const [showTelemetry, setShowTelemetry] = useState(initialTelemetry);
  const [showHologram, setShowHologram] = useState(initialHologram);
  const [cameraSpeed, setCameraSpeed] = useState(initialSpeed);
  const [isPaused, setIsPaused] = useState(false);
  const [showControls, setShowControls] = useState(false);
  const [activeAnatomyLayer, setActiveAnatomyLayer] = useState<'ALL' | 'NEURAL' | 'CARDIO' | 'SKELETAL'>('ALL');
  const [vitalsBpm, setVitalsBpm] = useState(72);
  const [spO2, setSpO2] = useState(99);

  // Live physiological fluctuation
  useEffect(() => {
    const interval = setInterval(() => {
      setVitalsBpm((prev) => {
        const delta = (Math.random() - 0.5) * 3;
        return Math.max(68, Math.min(78, Math.round(prev + delta)));
      });
      setSpO2((prev) => (Math.random() > 0.8 ? (prev === 99 ? 100 : 99) : prev));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    
    // Pixel-perfect High-DPI handling and true landscape viewport scaling
    const updateDimensions = () => {
      if (!canvas) return { width: 0, height: 0, dpr: 1 };
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const displayWidth = canvas.clientWidth || window.innerWidth;
      const displayHeight = canvas.clientHeight || window.innerHeight;
      
      canvas.width = Math.round(displayWidth * dpr);
      canvas.height = Math.round(displayHeight * dpr);
      
      return { width: displayWidth, height: displayHeight, dpr };
    };

    let { width, height, dpr } = updateDimensions();

    const handleResize = () => {
      const dims = updateDimensions();
      width = dims.width;
      height = dims.height;
      dpr = dims.dpr;
    };
    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', handleResize);

    // =========================================================================
    // 3D HOLOGRAPHIC ANATOMY MATHEMATICAL VERTICES (THE HERO VISUAL)
    // =========================================================================
    interface Point3D {
      x: number;
      y: number;
      z: number;
      type: 'HEAD' | 'SPINE' | 'CHEST' | 'HEART' | 'PELVIS' | 'ARM_L' | 'ARM_R' | 'LEG_L' | 'LEG_R' | 'BRAIN_NODE';
      pulseOffset?: number;
    }

    const anatomyNodes: Point3D[] = [];
    // Cranium & Brain neural cluster
    for (let i = 0; i < 22; i++) {
      const theta = (i / 22) * Math.PI * 2;
      const phi = ((i % 5) / 5) * Math.PI - Math.PI / 2;
      const r = 24;
      anatomyNodes.push({
        x: r * Math.cos(phi) * Math.cos(theta),
        y: -140 + r * Math.sin(phi),
        z: r * Math.cos(phi) * Math.sin(theta),
        type: i % 3 === 0 ? 'BRAIN_NODE' : 'HEAD',
        pulseOffset: i * 0.2,
      });
    }

    // Spine & Vertebrae column
    for (let y = -115; y <= 15; y += 10) {
      anatomyNodes.push({
        x: Math.sin(y * 0.05) * 3,
        y: y,
        z: 0,
        type: 'SPINE',
      });
    }

    // Ribcage & Chest Cavity
    for (let r = 0; r < 5; r++) {
      const ribY = -95 + r * 14;
      const ribRadius = 28 - Math.abs(r - 2) * 4;
      for (let j = 0; j < 8; j++) {
        const angle = (j / 8) * Math.PI * 2;
        anatomyNodes.push({
          x: Math.cos(angle) * ribRadius,
          y: ribY,
          z: Math.sin(angle) * ribRadius * 0.7,
          type: 'CHEST',
        });
      }
    }

    // Beating Heart Core (Cardiovascular System)
    anatomyNodes.push(
      { x: -5, y: -72, z: 6, type: 'HEART', pulseOffset: 0 },
      { x: -9, y: -70, z: 4, type: 'HEART', pulseOffset: 0.1 },
      { x: -3, y: -78, z: 8, type: 'HEART', pulseOffset: 0.2 }
    );

    // Pelvis & Lower Abdomen
    for (let p = 0; p < 8; p++) {
      const angle = (p / 8) * Math.PI * 2;
      anatomyNodes.push({
        x: Math.cos(angle) * 22,
        y: 20,
        z: Math.sin(angle) * 15,
        type: 'PELVIS',
      });
    }

    // Limbs (Left/Right Arms & Legs)
    const limbOffsets = [
      { type: 'ARM_L' as const, start: { x: -30, y: -95, z: 0 }, end: { x: -48, y: -10, z: 5 } },
      { type: 'ARM_R' as const, start: { x: 30, y: -95, z: 0 }, end: { x: 48, y: -10, z: 5 } },
      { type: 'LEG_L' as const, start: { x: -14, y: 22, z: 0 }, end: { x: -18, y: 130, z: 0 } },
      { type: 'LEG_R' as const, start: { x: 14, y: 22, z: 0 }, end: { x: 18, y: 130, z: 0 } },
    ];

    limbOffsets.forEach((limb) => {
      for (let s = 0; s <= 6; s++) {
        const ratio = s / 6;
        anatomyNodes.push({
          x: limb.start.x + (limb.end.x - limb.start.x) * ratio,
          y: limb.start.y + (limb.end.y - limb.start.y) * ratio,
          z: limb.start.z + (limb.end.z - limb.start.z) * ratio,
          type: limb.type,
        });
      }
    });

    // =========================================================================
    // DIVERSE 3D MEDICAL CHARACTERS (DOCTORS, NURSES, PATIENTS, TECHS)
    // =========================================================================
    interface Character3D {
      x: number;
      y: number;
      z: number; // 0 (far background) to 1 (foreground)
      targetX: number;
      speed: number;
      direction: 1 | -1;
      role: 'ATTENDING_PHYSICIAN' | 'CHIEF_SURGEON' | 'ICU_NURSE' | 'RADIOLOGIST' | 'PATIENT_MOBILE' | 'PATIENT_WHEELCHAIR' | 'CAREGIVER' | 'CLINICAL_TECH';
      coatColor: string;
      scrubColor: string;
      accentColor: string;
      stepPhase: number;
      state: 'WALKING' | 'CONSULTING_HUD' | 'REVIEWING_CHART' | 'CONVERSATION';
      interactionTimer: number;
      name: string;
      elevatedTier: 0 | 1 | 2; // 0 = main floor, 1 = skybridge, 2 = upper balcony
    }

    const characterPool: Character3D[] = [
      { x: 0.15, y: 0.72, z: 0.85, targetX: 0.8, speed: 0.35, direction: 1, role: 'ATTENDING_PHYSICIAN', coatColor: '#ffffff', scrubColor: '#0284c7', accentColor: '#38bdf8', stepPhase: 0, state: 'CONSULTING_HUD', interactionTimer: 120, name: 'Dr. Sarah Lin, MD (Cardiology)', elevatedTier: 0 },
      { x: 0.45, y: 0.74, z: 0.9, targetX: 0.1, speed: 0.3, direction: -1, role: 'CHIEF_SURGEON', coatColor: '#f8fafc', scrubColor: '#7c3aed', accentColor: '#c084fc', stepPhase: 2.1, state: 'CONVERSATION', interactionTimer: 80, name: 'Dr. Marcus Vance, MD (Neurosurgery)', elevatedTier: 0 },
      { x: 0.48, y: 0.74, z: 0.9, targetX: 0.9, speed: 0.28, direction: 1, role: 'ICU_NURSE', coatColor: '#059669', scrubColor: '#10b981', accentColor: '#34d399', stepPhase: 4.2, state: 'CONVERSATION', interactionTimer: 80, name: 'Elena Rostova, RN (Lead Triage)', elevatedTier: 0 },
      { x: 0.82, y: 0.68, z: 0.75, targetX: 0.2, speed: 0.4, direction: -1, role: 'RADIOLOGIST', coatColor: '#ffffff', scrubColor: '#0891b2', accentColor: '#22d3ee', stepPhase: 1.5, state: 'REVIEWING_CHART', interactionTimer: 150, name: 'Dr. Aaron Patel, MD (Imaging AI)', elevatedTier: 0 },
      { x: 0.28, y: 0.70, z: 0.8, targetX: 0.7, speed: 0.22, direction: 1, role: 'PATIENT_WHEELCHAIR', coatColor: '#d97706', scrubColor: '#f59e0b', accentColor: '#fbbf24', stepPhase: 0, state: 'WALKING', interactionTimer: 0, name: 'David Kim (Patient • Suite 4B)', elevatedTier: 0 },
      { x: 0.26, y: 0.70, z: 0.8, targetX: 0.7, speed: 0.22, direction: 1, role: 'CAREGIVER', coatColor: '#334155', scrubColor: '#475569', accentColor: '#94a3b8', stepPhase: 0.4, state: 'WALKING', interactionTimer: 0, name: 'Nurse Clara (Care Escort)', elevatedTier: 0 },
      // Elevated Skybridge Level 1 Characters
      { x: 0.2, y: 0.42, z: 0.55, targetX: 0.9, speed: 0.25, direction: 1, role: 'ATTENDING_PHYSICIAN', coatColor: '#ffffff', scrubColor: '#2563eb', accentColor: '#60a5fa', stepPhase: 1.1, state: 'WALKING', interactionTimer: 0, name: 'Dr. Michael Thorne, MD', elevatedTier: 1 },
      { x: 0.75, y: 0.42, z: 0.55, targetX: 0.1, speed: 0.25, direction: -1, role: 'ICU_NURSE', coatColor: '#059669', scrubColor: '#10b981', accentColor: '#34d399', stepPhase: 3.3, state: 'WALKING', interactionTimer: 0, name: 'Nurse David Becker, BSN', elevatedTier: 1 },
      { x: 0.5, y: 0.42, z: 0.55, targetX: 0.8, speed: 0.2, direction: 1, role: 'CLINICAL_TECH', coatColor: '#0284c7', scrubColor: '#0369a1', accentColor: '#38bdf8', stepPhase: 5.1, state: 'CONSULTING_HUD', interactionTimer: 90, name: 'AI Systems Engineer Li', elevatedTier: 1 },
      // Upper Terrace Level 2 Characters
      { x: 0.35, y: 0.25, z: 0.35, targetX: 0.7, speed: 0.18, direction: 1, role: 'ATTENDING_PHYSICIAN', coatColor: '#ffffff', scrubColor: '#0284c7', accentColor: '#38bdf8', stepPhase: 0.8, state: 'WALKING', interactionTimer: 0, name: 'Dr. Chloe Vance, Chief of Medicine', elevatedTier: 2 },
      { x: 0.65, y: 0.25, z: 0.35, targetX: 0.2, speed: 0.18, direction: -1, role: 'PATIENT_MOBILE', coatColor: '#ea580c', scrubColor: '#f97316', accentColor: '#fdba74', stepPhase: 2.7, state: 'WALKING', interactionTimer: 0, name: 'Patient M. Davies', elevatedTier: 2 },
    ];

    // =========================================================================
    // GLASS ELEVATOR SIMULATION
    // =========================================================================
    const glassElevators = [
      { x: 0.12, y: 0.4, speed: 0.0015, direction: 1, top: 0.18, bottom: 0.72 },
      { x: 0.88, y: 0.6, speed: 0.0012, direction: -1, top: 0.18, bottom: 0.72 },
    ];

    // =========================================================================
    // HOLOGRAPHIC DATA STREAMS & PARTICLES (PATIENT -> AI -> DOCTOR -> DECISION)
    // =========================================================================
    interface DataStreamParticle {
      x: number;
      y: number;
      z: number;
      targetX: number;
      targetY: number;
      progress: number;
      speed: number;
      color: string;
      size: number;
      label?: string;
    }

    const dataStreams: DataStreamParticle[] = Array.from({ length: 45 }, (_, i) => ({
      x: Math.random() * width,
      y: Math.random() * height * 0.7,
      z: 0.3 + Math.random() * 0.7,
      targetX: width * 0.5 + (Math.random() - 0.5) * 300,
      targetY: height * 0.45 + (Math.random() - 0.5) * 200,
      progress: Math.random(),
      speed: 0.002 + Math.random() * 0.004,
      color: i % 3 === 0 ? '#38bdf8' : i % 3 === 1 ? '#34d399' : '#818cf8',
      size: 1.5 + Math.random() * 2,
    }));

    let tick = 0;

    // Helper to draw realistic heartbeat ECG waveform
    const drawEcgTrace = (sx: number, sy: number, w: number, h: number, phase: number, strokeColor: string) => {
      ctx.save();
      ctx.strokeStyle = strokeColor;
      ctx.lineWidth = 1.6;
      ctx.beginPath();
      for (let i = 0; i < w; i += 2) {
        const t = (i + phase) % 110;
        let dy = 0;
        if (t > 30 && t < 38) dy = -Math.sin((t - 30) / 8 * Math.PI) * (h * 0.35); // P wave
        else if (t >= 38 && t < 42) dy = (t - 38) * (h * 0.2); // Q dip
        else if (t >= 42 && t < 50) dy = -Math.sin((t - 42) / 8 * Math.PI) * (h * 1.3); // R peak
        else if (t >= 50 && t < 55) dy = (t - 50) * (h * 0.3); // S dip
        else if (t >= 65 && t < 85) dy = -Math.sin((t - 65) / 20 * Math.PI) * (h * 0.45); // T wave
        
        if (i === 0) ctx.moveTo(sx + i, sy + dy);
        else ctx.lineTo(sx + i, sy + dy);
      }
      ctx.stroke();
      ctx.restore();
    };

    // =========================================================================
    // MAIN CINEMATIC RENDER LOOP (16-SECOND SEAMLESS CAMERA CHOREOGRAPHY)
    // =========================================================================
    const render = () => {
      if (!isPaused) {
        tick += 0.8 * cameraSpeed;
      }

      ctx.save();
      // Scale for crisp high-DPI rendering
      ctx.scale(dpr, dpr);
      ctx.clearRect(0, 0, width, height);

      // Camera choreography phase (16-second loop: ~960 ticks at 60fps)
      const loopPeriod = 960;
      const loopPhase = (tick % loopPeriod) / loopPeriod;
      
      // Camera sway & gentle orbital pan tuned for cinematic widescreen landscape
      const isLandscape = width > height;
      const cameraPanX = Math.sin(loopPhase * Math.PI * 2) * (width * 0.035);
      const cameraTiltY = Math.cos(loopPhase * Math.PI * 2) * (isLandscape ? 10 : 6);
      const cameraZoom = 1 + Math.sin(loopPhase * Math.PI * 2) * 0.025;

      ctx.save();
      ctx.translate(width / 2 + cameraPanX, height / 2 + cameraTiltY);
      ctx.scale(cameraZoom, cameraZoom);
      ctx.translate(-width / 2, -height / 2);

      // =======================================================================
      // 1. ARCHITECTURAL SKYLINE & VOLUMETRIC DAYLIGHT (2035 FUTURISTIC CITY)
      // =======================================================================
      const skyGrad = ctx.createLinearGradient(0, 0, 0, height * 0.5);
      if (isDark) {
        skyGrad.addColorStop(0, '#060a14');
        skyGrad.addColorStop(0.5, '#0b1329');
        skyGrad.addColorStop(1, '#0f172a');
      } else {
        skyGrad.addColorStop(0, '#e0f2fe');
        skyGrad.addColorStop(0.5, '#f0f9ff');
        skyGrad.addColorStop(1, '#ffffff');
      }
      ctx.fillStyle = skyGrad;
      ctx.fillRect(0, 0, width, height * 0.55);

      // Distant futuristic smart city spires visible through grand windows
      ctx.save();
      const numSpires = 12;
      for (let s = 0; s < numSpires; s++) {
        const sx = (width / numSpires) * s + 20;
        const sw = 30 + (s % 3) * 18;
        const sh = 120 + ((s * 37) % 160);
        const sy = height * 0.42 - sh;

        ctx.fillStyle = isDark ? 'rgba(30, 41, 59, 0.4)' : 'rgba(186, 230, 253, 0.35)';
        ctx.fillRect(sx, sy, sw, sh);

        // Tower beacon lights
        ctx.fillStyle = isDark ? 'rgba(56, 189, 248, 0.6)' : 'rgba(2, 132, 199, 0.5)';
        ctx.beginPath();
        ctx.arc(sx + sw / 2, sy, 2, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();

      // Grand Volumetric Sunlight Beams streaming through smart glass
      ctx.save();
      const numBeams = 5;
      for (let b = 0; b < numBeams; b++) {
        const beamX = width * (0.15 + b * 0.18);
        const beamGrad = ctx.createLinearGradient(beamX, 0, beamX + 180, height * 0.85);
        if (isDark) {
          beamGrad.addColorStop(0, 'rgba(56, 189, 248, 0.08)');
          beamGrad.addColorStop(0.6, 'rgba(255, 255, 255, 0.03)');
          beamGrad.addColorStop(1, 'transparent');
        } else {
          beamGrad.addColorStop(0, 'rgba(255, 255, 255, 0.65)');
          beamGrad.addColorStop(0.5, 'rgba(186, 230, 253, 0.25)');
          beamGrad.addColorStop(1, 'transparent');
        }
        ctx.fillStyle = beamGrad;
        ctx.beginPath();
        ctx.moveTo(beamX, 0);
        ctx.lineTo(beamX + 120, 0);
        ctx.lineTo(beamX + 280, height * 0.9);
        ctx.lineTo(beamX + 80, height * 0.9);
        ctx.closePath();
        ctx.fill();
      }
      ctx.restore();

      // =======================================================================
      // 2. MULTI-LEVEL ATRIUM ARCHITECTURE, SKYBRIDGES & LIVING GREEN WALLS
      // =======================================================================
      const floorY = height * 0.58;

      // Upper Balcony Level 2 (y ~ 0.25 * height)
      const balconyY = height * 0.26;
      ctx.fillStyle = isDark ? '#0f172a' : '#f8fafc';
      ctx.fillRect(0, balconyY, width, 14);
      // Balcony Glass Railing
      ctx.fillStyle = isDark ? 'rgba(56, 189, 248, 0.15)' : 'rgba(2, 132, 199, 0.12)';
      ctx.fillRect(0, balconyY - 26, width, 26);
      ctx.strokeStyle = isDark ? 'rgba(56, 189, 248, 0.4)' : 'rgba(2, 132, 199, 0.3)';
      ctx.lineWidth = 1.5;
      ctx.strokeRect(0, balconyY - 26, width, 26);

      // Elevated Glass Skybridge Level 1 (y ~ 0.42 * height)
      const skybridgeY = height * 0.43;
      // Curved architectural arch support
      ctx.beginPath();
      ctx.strokeStyle = isDark ? 'rgba(56, 189, 248, 0.3)' : 'rgba(2, 132, 199, 0.25)';
      ctx.lineWidth = 3;
      ctx.moveTo(0, skybridgeY + 30);
      ctx.bezierCurveTo(width * 0.3, skybridgeY - 20, width * 0.7, skybridgeY - 20, width, skybridgeY + 30);
      ctx.stroke();

      // Skybridge Walking Platform
      ctx.fillStyle = isDark ? '#1e293b' : '#ffffff';
      ctx.fillRect(0, skybridgeY, width, 18);
      // Smart Glass Balustrade
      ctx.fillStyle = isDark ? 'rgba(56, 189, 248, 0.12)' : 'rgba(14, 165, 233, 0.1)';
      ctx.fillRect(0, skybridgeY - 32, width, 32);
      ctx.strokeStyle = isDark ? 'rgba(56, 189, 248, 0.45)' : 'rgba(2, 132, 199, 0.35)';
      ctx.lineWidth = 1.5;
      ctx.strokeRect(0, skybridgeY - 32, width, 32);

      // Biophilic Indoor Living Green Walls & Planters
      const greenWalls = [
        { x: 30, y: balconyY - 40, w: 90, h: 220 },
        { x: width - 120, y: balconyY - 40, w: 90, h: 220 },
      ];
      greenWalls.forEach((gw) => {
        // Vertical Garden Planter Frame
        ctx.fillStyle = isDark ? '#022c22' : '#ecfdf5';
        ctx.fillRect(gw.x, gw.y, gw.w, gw.h);
        ctx.strokeStyle = '#10b98144';
        ctx.strokeRect(gw.x, gw.y, gw.w, gw.h);

        // Stylized natural foliage clusters
        for (let row = 0; row < 12; row++) {
          for (let col = 0; col < 5; col++) {
            const leafX = gw.x + 12 + col * 16 + Math.sin(row * 0.8) * 3;
            const leafY = gw.y + 12 + row * 17;
            ctx.fillStyle = row % 2 === 0 ? '#10b981' : '#059669';
            ctx.beginPath();
            ctx.arc(leafX, leafY, 6, 0, Math.PI * 2);
            ctx.fill();
          }
        }
      });

      // Glass Elevators moving smoothly vertically
      glassElevators.forEach((elev) => {
        elev.y += elev.speed * elev.direction * cameraSpeed;
        if (elev.y > elev.bottom || elev.y < elev.top) {
          elev.direction *= -1;
        }

        const elX = elev.x * width;
        const elY = elev.y * height;
        const elW = 54;
        const elH = 75;

        // Elevator Shaft Guide Rails
        ctx.strokeStyle = isDark ? 'rgba(56, 189, 248, 0.25)' : 'rgba(2, 132, 199, 0.2)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(elX - elW / 2, height * 0.15);
        ctx.lineTo(elX - elW / 2, height * 0.85);
        ctx.moveTo(elX + elW / 2, height * 0.15);
        ctx.lineTo(elX + elW / 2, height * 0.85);
        ctx.stroke();

        // Glass Elevator Capsule
        ctx.fillStyle = isDark ? 'rgba(15, 23, 42, 0.85)' : 'rgba(255, 255, 255, 0.9)';
        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 1.8;
        ctx.fillRect(elX - elW / 2, elY - elH / 2, elW, elH);
        ctx.strokeRect(elX - elW / 2, elY - elH / 2, elW, elH);

        // Internal Ambient Glow & Passengers
        ctx.fillStyle = '#38bdf833';
        ctx.fillRect(elX - elW / 2 + 4, elY - elH / 2 + 4, elW - 8, elH - 8);

        // Passenger silhouettes inside elevator
        ctx.fillStyle = isDark ? '#e2e8f0' : '#1e293b';
        ctx.beginPath();
        ctx.arc(elX - 8, elY - 12, 4.5, 0, Math.PI * 2);
        ctx.arc(elX + 8, elY - 12, 4.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillRect(elX - 14, elY - 6, 12, 20);
        ctx.fillRect(elX + 2, elY - 6, 12, 20);
      });

      // =======================================================================
      // AUTONOMOUS MEDICAL DELIVERY DRONES (HOVERING IN HIGH ATRIUM)
      // =======================================================================
      const drones = [
        {
          x: width * 0.65 + Math.sin(tick * 0.02) * 60,
          y: height * 0.22 + Math.cos(tick * 0.03) * 15,
          scale: 0.85,
        },
        {
          x: width * 0.3 + Math.cos(tick * 0.015) * 45,
          y: height * 0.15 + Math.sin(tick * 0.025) * 10,
          scale: 0.6,
        },
      ];

      drones.forEach((drone) => {
        ctx.save();
        ctx.translate(drone.x, drone.y);
        ctx.scale(drone.scale, drone.scale);

        // Drone central fuselage (sleek white medical chassis)
        ctx.fillStyle = isDark ? '#ffffff' : '#f8fafc';
        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.roundRect ? ctx.roundRect(-16, -6, 32, 12, 4) : ctx.rect(-16, -6, 32, 12);
        ctx.fill();
        ctx.stroke();

        // Medical Cross Symbol on Drone
        ctx.fillStyle = '#ef4444';
        ctx.fillRect(-2, -4, 4, 8);
        ctx.fillRect(-4, -2, 8, 4);

        // Quad-Rotor Arms
        ctx.strokeStyle = '#64748b';
        ctx.lineWidth = 1.8;
        // Left arm
        ctx.beginPath();
        ctx.moveTo(-16, 0);
        ctx.lineTo(-26, -4);
        ctx.moveTo(-16, 0);
        ctx.lineTo(-26, 4);
        // Right arm
        ctx.moveTo(16, 0);
        ctx.lineTo(26, -4);
        ctx.moveTo(16, 0);
        ctx.lineTo(26, 4);
        ctx.stroke();

        // Rotating Propellers (Blur discs)
        ctx.fillStyle = 'rgba(56, 189, 248, 0.4)';
        ctx.beginPath();
        ctx.ellipse(-26, -4, 10, 2.5, tick * 0.4, 0, Math.PI * 2);
        ctx.ellipse(-26, 4, 10, 2.5, -tick * 0.4, 0, Math.PI * 2);
        ctx.ellipse(26, -4, 10, 2.5, tick * 0.4, 0, Math.PI * 2);
        ctx.ellipse(26, 4, 10, 2.5, -tick * 0.4, 0, Math.PI * 2);
        ctx.fill();

        // Status Nav Beacons (Flashing Green & Cyan LEDs)
        const beaconGlow = Math.sin(tick * 0.1) > 0;
        ctx.fillStyle = beaconGlow ? '#10b981' : '#059669';
        ctx.beginPath();
        ctx.arc(-14, 0, 1.8, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = beaconGlow ? '#38bdf8' : '#0284c7';
        ctx.beginPath();
        ctx.arc(14, 0, 1.8, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
      });

      // Floating Clinical Holographic Medical Crosses & Vitals in Atrium
      const floatingMarkers = [
        { x: width * 0.58, y: height * 0.48, label: '36.0°C', symbol: '+' },
        { x: width * 0.52, y: height * 0.52, label: '+', symbol: '+' },
      ];
      floatingMarkers.forEach((fm, fIdx) => {
        const floatY = fm.y + Math.sin(tick * 0.03 + fIdx) * 6;
        ctx.save();
        ctx.fillStyle = isDark ? 'rgba(56, 189, 248, 0.15)' : 'rgba(2, 132, 199, 0.12)';
        ctx.strokeStyle = 'rgba(56, 189, 248, 0.4)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.roundRect ? ctx.roundRect(fm.x - 22, floatY - 10, 44, 20, 6) : ctx.rect(fm.x - 22, floatY - 10, 44, 20);
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = '#38bdf8';
        ctx.font = 'bold 9px ui-monospace, SFMono-Regular, monospace';
        ctx.textAlign = 'center';
        ctx.fillText(fm.label, fm.x, floatY + 3.5);
        ctx.restore();
      });

      // =======================================================================
      // 3. POLISHED MARBLE / EPOXY FLOOR & RAY-TRACED SPECULAR REFLECTIONS
      // =======================================================================
      const floorGrad = ctx.createLinearGradient(0, floorY, 0, height);
      if (isDark) {
        floorGrad.addColorStop(0, 'rgba(10, 15, 29, 0.95)');
        floorGrad.addColorStop(0.3, 'rgba(15, 23, 42, 0.85)');
        floorGrad.addColorStop(1, 'rgba(6, 10, 20, 0.98)');
      } else {
        floorGrad.addColorStop(0, 'rgba(255, 255, 255, 0.92)');
        floorGrad.addColorStop(0.3, 'rgba(241, 245, 249, 0.88)');
        floorGrad.addColorStop(1, 'rgba(226, 232, 240, 0.95)');
      }
      ctx.fillStyle = floorGrad;
      ctx.fillRect(0, floorY, width, height - floorY);

      // Floor Architectural Grid Lines with Dynamic Perspective
      ctx.save();
      ctx.strokeStyle = isDark ? 'rgba(56, 189, 248, 0.08)' : 'rgba(2, 132, 199, 0.07)';
      ctx.lineWidth = 1;
      const numGridCols = 18;
      for (let c = -4; c <= numGridCols + 4; c++) {
        const topX = (width / numGridCols) * c;
        const botX = ((width / numGridCols) * c - width / 2) * 2.4 + width / 2;
        ctx.beginPath();
        ctx.moveTo(topX, floorY);
        ctx.lineTo(botX, height);
        ctx.stroke();
      }
      // Transverse floor lines
      for (let r = 1; r <= 10; r++) {
        const progress = Math.pow(r / 10, 2.2);
        const y = floorY + progress * (height - floorY);
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }
      ctx.restore();

      // =======================================================================
      // 4. THE HERO VISUAL: ROTATING 3D HOLOGRAPHIC HUMAN ANATOMY ENGINE
      // =======================================================================
      if (showHologram) {
        // Hologram positioning in the upper-mid atrium
        const holoCenterX = width * 0.5;
        const holoCenterY = height * 0.36;
        const holoRotationAngle = tick * 0.015;

        // Base Hologram Projector Platform on Atrium Floor
        ctx.save();
        const baseProjY = floorY + 18;
        ctx.fillStyle = isDark ? 'rgba(15, 23, 42, 0.9)' : 'rgba(241, 245, 249, 0.95)';
        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.ellipse(holoCenterX, baseProjY, 90, 24, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        // Projector Concentric Rings
        ctx.strokeStyle = 'rgba(56, 189, 248, 0.5)';
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.ellipse(holoCenterX, baseProjY, 65, 17, 0, 0, Math.PI * 2);
        ctx.ellipse(holoCenterX, baseProjY, 40, 10, 0, 0, Math.PI * 2);
        ctx.stroke();

        // Upward Volumetric Holographic Emission Beam
        const coneGrad = ctx.createLinearGradient(holoCenterX, baseProjY, holoCenterX, holoCenterY - 140);
        coneGrad.addColorStop(0, 'rgba(56, 189, 248, 0.25)');
        coneGrad.addColorStop(0.5, 'rgba(56, 189, 248, 0.08)');
        coneGrad.addColorStop(1, 'transparent');
        ctx.fillStyle = coneGrad;
        ctx.beginPath();
        ctx.moveTo(holoCenterX - 85, baseProjY);
        ctx.lineTo(holoCenterX + 85, baseProjY);
        ctx.lineTo(holoCenterX + 160, holoCenterY - 160);
        ctx.lineTo(holoCenterX - 160, holoCenterY - 160);
        ctx.closePath();
        ctx.fill();

        // Multi-Planar Orbital Scan Rings around Anatomy
        const orbitalRings = [
          { radius: 110, tilt: 0.35, speed: 0.02, color: '#38bdf8' },
          { radius: 130, tilt: -0.45, speed: -0.015, color: '#34d399' },
          { radius: 95, tilt: 0.15, speed: 0.025, color: '#a78bfa' },
        ];
        orbitalRings.forEach((ring, rIdx) => {
          const ringAngle = tick * ring.speed;
          ctx.save();
          ctx.translate(holoCenterX, holoCenterY);
          ctx.rotate(ring.tilt);
          ctx.strokeStyle = `${ring.color}66`;
          ctx.lineWidth = 1.2;
          ctx.setLineDash([6, 8]);
          ctx.beginPath();
          ctx.ellipse(0, 0, ring.radius, ring.radius * 0.35, ringAngle, 0, Math.PI * 2);
          ctx.stroke();

          // Diagnostic Data Marker orbiting on the ring
          const markerX = Math.cos(ringAngle) * ring.radius;
          const markerY = Math.sin(ringAngle) * ring.radius * 0.35;
          ctx.fillStyle = ring.color;
          ctx.beginPath();
          ctx.arc(markerX, markerY, 3.5, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        });

        // 3D Mathematical Projection of Human Anatomical Nodes
        const cosY = Math.cos(holoRotationAngle);
        const sinY = Math.sin(holoRotationAngle);

        const projectedNodes = anatomyNodes.map((node) => {
          // 3D Y-axis rotation
          const rotX = node.x * cosY - node.z * sinY;
          const rotZ = node.x * sinY + node.z * cosY;
          const rotY = node.y;

          // Perspective depth calculation
          const fov = 320;
          const distance = fov + rotZ;
          const projScale = fov / distance;
          const screenX = holoCenterX + rotX * projScale;
          const screenY = holoCenterY + rotY * projScale;

          return {
            ...node,
            screenX,
            screenY,
            depth: rotZ,
            projScale,
          };
        });

        // Sort nodes by Z depth for realistic optical occlusion
        projectedNodes.sort((a, b) => a.depth - b.depth);

        // Draw Interconnecting Holographic Neural / Vascular Pathways
        ctx.strokeStyle = 'rgba(56, 189, 248, 0.35)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        for (let i = 0; i < projectedNodes.length - 1; i++) {
          const n1 = projectedNodes[i];
          const n2 = projectedNodes[i + 1];
          const dist = Math.hypot(n1.screenX - n2.screenX, n1.screenY - n2.screenY);
          if (dist < 38) {
            ctx.moveTo(n1.screenX, n1.screenY);
            ctx.lineTo(n2.screenX, n2.screenY);
          }
        }
        ctx.stroke();

        // Render Anatomical Nodes (Heart Pulse, Brain Synapses, Bones)
        projectedNodes.forEach((pNode) => {
          let nodeColor = '#38bdf8';
          let nodeSize = 2.2 * pNode.projScale;

          if (pNode.type === 'HEART') {
            // Heartbeat pulsation
            const heartPulse = Math.sin(tick * 0.12 + (pNode.pulseOffset || 0)) * 2;
            nodeColor = '#ef4444';
            nodeSize = (4 + heartPulse) * pNode.projScale;
          } else if (pNode.type === 'BRAIN_NODE') {
            nodeColor = '#a855f7';
            nodeSize = 3 * pNode.projScale;
          } else if (pNode.type === 'CHEST') {
            nodeColor = '#06b6d4';
          }

          ctx.fillStyle = nodeColor;
          ctx.beginPath();
          ctx.arc(pNode.screenX, pNode.screenY, Math.max(1, nodeSize), 0, Math.PI * 2);
          ctx.fill();
        });

        // Floating CT/MRI Diagnostic Slice Plates hovering beside anatomy
        const ctSlices = [
          { ox: 140, oy: -60, label: 'MRI T2 Coronal View • Normal', val: 'Ventricles Normal' },
          { ox: -170, oy: 20, label: 'Cardiac 3D Doppler Flow', val: `LVEF: 62% • Sinus ${vitalsBpm} BPM` },
        ];
        ctSlices.forEach((slice) => {
          const sx = holoCenterX + slice.ox;
          const sy = holoCenterY + slice.oy;

          // Holographic Diagnostic Card
          ctx.fillStyle = isDark ? 'rgba(15, 23, 42, 0.85)' : 'rgba(255, 255, 255, 0.9)';
          ctx.strokeStyle = '#38bdf888';
          ctx.lineWidth = 1.2;
          ctx.fillRect(sx, sy, 150, 48);
          ctx.strokeRect(sx, sy, 150, 48);

          // Miniature ECG inside Doppler Card
          drawEcgTrace(sx + 10, sy + 34, 130, 8, tick * 2, '#38bdf8');

          ctx.fillStyle = isDark ? '#ffffff' : '#0f172a';
          ctx.font = 'bold 8.5px ui-sans-serif, system-ui, sans-serif';
          ctx.fillText(slice.label, sx + 8, sy + 14);

          ctx.fillStyle = '#38bdf8';
          ctx.font = 'bold 8px ui-sans-serif, system-ui, sans-serif';
          ctx.fillText(slice.val, sx + 8, sy + 25);
        });

        ctx.restore();
      }

      // =======================================================================
      // 5. ANIMATED MEDICAL PERSONNEL & NATURAL HUMAN ACTIVITY
      // =======================================================================
      // Sort characters by Y position for proper 3D depth overlap
      characterPool.sort((a, b) => a.y - b.y);

      characterPool.forEach((char) => {
        // Continuous smooth movement
        char.x += (char.speed * 0.001 * char.direction) * cameraSpeed;
        char.stepPhase += 0.06 * cameraSpeed;

        // Turn around or wrap smoothly
        if (char.x > 0.96) {
          char.x = 0.96;
          char.direction = -1;
        } else if (char.x < 0.04) {
          char.x = 0.04;
          char.direction = 1;
        }

        const cx = char.x * width;
        const cy = char.y * height;
        const scale = char.z * 1.05;

        ctx.save();
        ctx.translate(cx, cy);
        ctx.scale(scale * (char.direction === 1 ? 1 : -1), scale);

        // Ground Contact Soft Shadow
        ctx.fillStyle = 'rgba(0, 0, 0, 0.35)';
        ctx.beginPath();
        ctx.ellipse(0, 26, 14, 4.5, 0, 0, Math.PI * 2);
        ctx.fill();

        const legSwing = Math.sin(char.stepPhase) * 8;
        const armSwing = Math.cos(char.stepPhase) * 7;

        // 1. Natural Human Head & Profile
        ctx.fillStyle = '#fce7f3'; // Natural skin tone
        ctx.beginPath();
        ctx.arc(0, -18, 5.5, 0, Math.PI * 2);
        ctx.fill();

        // Hair styling
        ctx.fillStyle = '#334155';
        ctx.beginPath();
        ctx.arc(0, -20, 5.8, Math.PI * 0.8, Math.PI * 2.2);
        ctx.fill();

        // 2. Uniform / Lab Coat / Scrubs
        ctx.fillStyle = char.coatColor;
        ctx.beginPath();
        ctx.moveTo(-5, -12);
        ctx.lineTo(5, -12);
        ctx.lineTo(7, 10);
        ctx.lineTo(-7, 10);
        ctx.closePath();
        ctx.fill();
        ctx.strokeStyle = char.accentColor;
        ctx.lineWidth = 1.2;
        ctx.stroke();

        // Stethoscope for Doctors
        if (char.role === 'ATTENDING_PHYSICIAN' || char.role === 'CHIEF_SURGEON') {
          ctx.strokeStyle = char.accentColor;
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.moveTo(-3, -11);
          ctx.lineTo(0, -3);
          ctx.lineTo(3, -11);
          ctx.stroke();
        }

        // 3. Legs with walking gait
        if (char.role !== 'PATIENT_WHEELCHAIR') {
          ctx.strokeStyle = char.scrubColor;
          ctx.lineWidth = 3.2;
          ctx.lineCap = 'round';
          // Left Leg
          ctx.beginPath();
          ctx.moveTo(-3, 10);
          ctx.lineTo(-3 + legSwing, 25);
          ctx.stroke();
          // Right Leg
          ctx.beginPath();
          ctx.moveTo(3, 10);
          ctx.lineTo(3 - legSwing, 25);
          ctx.stroke();
        } else {
          // Wheelchair Patient Rendering
          ctx.strokeStyle = '#64748b';
          ctx.lineWidth = 2.5;
          // Wheelchair Wheel
          ctx.beginPath();
          ctx.arc(0, 14, 10, 0, Math.PI * 2);
          ctx.stroke();
          // Wheel hub
          ctx.fillStyle = '#38bdf8';
          ctx.beginPath();
          ctx.arc(0, 14, 2.5, 0, Math.PI * 2);
          ctx.fill();
        }

        // 4. Arms & AR Holographic Tablet Interaction
        ctx.strokeStyle = char.coatColor;
        ctx.lineWidth = 2.8;
        if (char.state === 'CONSULTING_HUD' || char.state === 'REVIEWING_CHART') {
          // Raising arm to hold holographic glass tablet
          ctx.beginPath();
          ctx.moveTo(4, -8);
          ctx.lineTo(10, 0);
          ctx.stroke();

          // Floating semi-transparent tablet
          ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
          ctx.strokeStyle = char.accentColor;
          ctx.lineWidth = 1;
          ctx.fillRect(8, -5, 11, 9);
          ctx.strokeRect(8, -5, 11, 9);

          // Micro-Holographic Emission from Tablet
          ctx.save();
          const miniHoloGrad = ctx.createRadialGradient(13, -12, 1, 13, -12, 16);
          miniHoloGrad.addColorStop(0, `${char.accentColor}99`);
          miniHoloGrad.addColorStop(1, 'transparent');
          ctx.fillStyle = miniHoloGrad;
          ctx.beginPath();
          ctx.arc(13, -12, 12, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        } else {
          // Natural walking arm swing
          ctx.beginPath();
          ctx.moveTo(4, -8);
          ctx.lineTo(5 + armSwing, 7);
          ctx.stroke();
        }

        // Clinician Name Badge Tag
        ctx.save();
        ctx.scale(char.direction === 1 ? 1 : -1, 1);
        ctx.fillStyle = isDark ? 'rgba(15, 23, 42, 0.85)' : 'rgba(255, 255, 255, 0.9)';
        ctx.strokeStyle = `${char.accentColor}88`;
        ctx.lineWidth = 1;
        const tagW = 76;
        ctx.fillRect(-tagW / 2, -32, tagW, 11);
        ctx.strokeRect(-tagW / 2, -32, tagW, 11);

        ctx.fillStyle = isDark ? '#f8fafc' : '#0f172a';
        ctx.font = 'bold 6.5px ui-sans-serif, system-ui, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(char.name, 0, -24);
        ctx.restore();

        ctx.restore();
      });

      // =======================================================================
      // 6. CLINICAL DATA STREAM FLOW ARTERIES (PATIENT -> AI -> CARE DECISION)
      // =======================================================================
      dataStreams.forEach((dp) => {
        dp.progress += dp.speed * cameraSpeed;
        if (dp.progress > 1) {
          dp.progress = 0;
          dp.x = Math.random() * width;
        }

        const currX = dp.x + (dp.targetX - dp.x) * dp.progress;
        const currY = dp.y + (dp.targetY - dp.y) * dp.progress;

        ctx.fillStyle = dp.color;
        ctx.shadowColor = dp.color;
        ctx.shadowBlur = 4;
        ctx.beginPath();
        ctx.arc(currX, currY, dp.size * dp.z, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
      });

      ctx.restore(); // Restore camera translation
      ctx.restore(); // Restore dpr scaling

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [isDark, isPaused, cameraSpeed, showHologram, activeAnatomyLayer]);

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
      {/* 3D Real-time Simulation Canvas */}
      <canvas ref={canvasRef} className="w-full h-full" />

      {/* Floating Atmosphere Customizer Overlay */}
      <div className="absolute top-4 right-4 pointer-events-auto z-20 flex items-center gap-2">
        {/* Live Hospital Telemetry Pill */}
        <div className={`hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full backdrop-blur-xl border text-xs shadow-lg transition-colors ${
          isDark 
            ? 'bg-slate-900/80 border-white/10 text-slate-200' 
            : 'bg-white/90 border-slate-200 text-slate-800'
        }`}>
          <span className="flex items-center gap-1.5 text-emerald-500 font-bold font-mono">
            <Heart className="w-3.5 h-3.5 animate-pulse text-emerald-500" />
            Live ICU Sync: {vitalsBpm} BPM
          </span>
          <span className={isDark ? 'text-white/20' : 'text-slate-300'}>|</span>
          <span className="text-cyan-500 font-mono text-[11px]">
            SpO2: {spO2}% • 2035 Smart Atrium
          </span>
        </div>

        {/* Atmosphere Tuning Menu Toggle */}
        <button
          onClick={() => setShowControls(!showControls)}
          className={`p-2 rounded-xl border backdrop-blur-xl transition-all shadow-lg cursor-pointer ${
            showControls
              ? 'bg-blue-600 border-blue-400 text-white'
              : isDark
                ? 'bg-slate-900/80 hover:bg-slate-800 border-white/10 text-slate-300 hover:text-white'
                : 'bg-white/90 hover:bg-slate-100 border-slate-200 text-slate-700 hover:text-slate-900'
          }`}
          title="Hospital 3D World Settings"
        >
          <Sliders className="w-4 h-4 text-cyan-400" />
        </button>

        {/* Settings Flyout Modal */}
        {showControls && (
          <div className={`absolute right-0 top-12 w-80 backdrop-blur-2xl border rounded-2xl p-4 shadow-2xl z-40 space-y-4 pointer-events-auto animate-in fade-in zoom-in-95 duration-200 ${
            isDark 
              ? 'bg-slate-950/95 border-white/15 text-slate-100' 
              : 'bg-white/95 border-slate-200 text-slate-900'
          }`}>
            <div className={`flex items-center justify-between border-b pb-2.5 ${isDark ? 'border-white/10' : 'border-slate-200'}`}>
              <div className="flex items-center gap-2">
                <div className={`p-1.5 rounded-lg ${isDark ? 'bg-cyan-500/20 text-cyan-300' : 'bg-cyan-100 text-cyan-700'}`}>
                  <Orbit className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs font-bold block">3D Smart Hospital Engine</span>
                  <span className="text-[10px] text-slate-400">Cinematic 2035 Hospital Ecosystem</span>
                </div>
              </div>
              <button
                onClick={() => setIsPaused(!isPaused)}
                className={`text-[11px] px-2 py-0.5 rounded-lg transition-colors flex items-center gap-1 cursor-pointer ${
                  isDark ? 'bg-white/10 hover:bg-white/20 text-slate-200' : 'bg-slate-100 hover:bg-slate-200 text-slate-800'
                }`}
              >
                {isPaused ? <Play className="w-3 h-3 text-emerald-400" /> : <Pause className="w-3 h-3 text-cyan-400" />}
                {isPaused ? 'Resume' : 'Freeze'}
              </button>
            </div>

            {/* Hologram Toggle & Layers */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                  3D Anatomical Hologram:
                </span>
                <button
                  onClick={() => setShowHologram(!showHologram)}
                  className={`w-9 h-5 rounded-full transition-colors relative cursor-pointer ${
                    showHologram ? 'bg-blue-600' : isDark ? 'bg-slate-800' : 'bg-slate-300'
                  }`}
                >
                  <div
                    className={`w-3.5 h-3.5 rounded-full bg-white transition-transform absolute top-0.5 ${
                      showHologram ? 'left-5' : 'left-0.5'
                    }`}
                  />
                </button>
              </div>

              {showHologram && (
                <div className="grid grid-cols-4 gap-1 pt-1">
                  {(['ALL', 'NEURAL', 'CARDIO', 'SKELETAL'] as const).map((layer) => (
                    <button
                      key={layer}
                      onClick={() => setActiveAnatomyLayer(layer)}
                      className={`px-1.5 py-1 rounded-lg text-[9.5px] font-bold tracking-wider capitalize transition-all cursor-pointer ${
                        activeAnatomyLayer === layer
                          ? 'bg-blue-600 text-white'
                          : isDark ? 'bg-white/5 hover:bg-white/10 text-slate-300' : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                      }`}
                    >
                      {layer}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Camera Motion Velocity */}
            <div className="space-y-1.5 pt-2 border-t border-white/10">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-300 font-medium flex items-center gap-1.5">
                  <Compass className="w-3.5 h-3.5 text-cyan-400" />
                  Camera Glide Velocity:
                </span>
                <span className="font-mono text-cyan-400 font-bold">{cameraSpeed}x</span>
              </div>
              <div className="flex items-center gap-1.5">
                {[0.5, 1, 1.5, 2].map((spd) => (
                  <button
                    key={spd}
                    onClick={() => setCameraSpeed(spd)}
                    className={`flex-1 py-1 rounded-lg text-[10px] font-bold transition-all cursor-pointer ${
                      cameraSpeed === spd
                        ? 'bg-blue-600 text-white'
                        : isDark ? 'bg-white/5 hover:bg-white/10 text-slate-300' : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                    }`}
                  >
                    {spd}x
                  </button>
                ))}
              </div>
            </div>

            {/* Architecture Details Footer */}
            <div className={`text-[10px] rounded-xl p-2.5 flex items-start gap-2 border ${
              isDark ? 'text-slate-400 bg-white/5 border-white/5' : 'text-slate-600 bg-slate-100 border-slate-200'
            }`}>
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span>Multi-level open atrium with smart glass, elevator physics, and seamless 16s looping.</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
