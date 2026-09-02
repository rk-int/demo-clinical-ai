import React, { useState, useRef, useEffect } from 'react';
import { Building2, ChevronDown, Check, ShieldCheck, Server, Activity, Globe } from 'lucide-react';
import { NETWORK_HOSPITALS, HospitalFacility } from '../data/hospitalNetwork';

interface HospitalNetworkSelectorProps {
  selectedHospitalId: string;
  onSelectHospital: (hospital: HospitalFacility) => void;
  isDark?: boolean;
}

export const HospitalNetworkSelector: React.FC<HospitalNetworkSelectorProps> = ({
  selectedHospitalId,
  onSelectHospital,
  isDark = true,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const currentHospital = NETWORK_HOSPITALS.find((h) => h.id === selectedHospitalId) || NETWORK_HOSPITALS[0];

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-3 px-3.5 py-2 rounded-2xl border backdrop-blur-md transition-all cursor-pointer shadow-sm group ${
          isDark
            ? 'bg-slate-900/90 border-white/10 hover:border-blue-500/50 text-white'
            : 'bg-white border-slate-200 hover:border-blue-300 text-slate-900'
        }`}
      >
        <div className="w-8 h-8 rounded-xl bg-blue-600/15 border border-blue-500/30 text-blue-400 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
          <Building2 className="w-4 h-4" />
        </div>

        <div className="text-left">
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-bold leading-tight truncate max-w-[200px] sm:max-w-[260px]">
              {currentHospital.shortName}
            </span>
            <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-blue-500/20 text-blue-300 border border-blue-500/30 font-bold">
              {currentHospital.code}
            </span>
          </div>
          <p className="text-[10px] text-slate-400 leading-tight truncate max-w-[220px]">
            {currentHospital.ehrSystem}
          </p>
        </div>

        <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-200 ml-1 ${isOpen ? 'rotate-180 text-blue-400' : ''}`} />
      </button>

      {/* DROPDOWN MENU */}
      {isOpen && (
        <div className={`absolute right-0 mt-2 w-80 sm:w-96 rounded-3xl border shadow-2xl overflow-hidden z-50 animate-fade-in ${
          isDark ? 'bg-slate-950 border-white/10 text-white' : 'bg-white border-slate-200 text-slate-900'
        }`}>
          {/* Header */}
          <div className="p-4 border-b border-white/10 bg-slate-900/80">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-cyan-400" />
                <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-200">
                  Multi-Hospital Network Switcher
                </h4>
              </div>
              <span className="text-[9px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-bold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                FHIR Mesh Active
              </span>
            </div>
            <p className="text-[10px] text-slate-400 mt-1">
              Switch clinical context across regional network hospitals & federated FHIR endpoints.
            </p>
          </div>

          {/* List of Network Hospitals */}
          <div className="p-2 space-y-1.5 max-h-[360px] overflow-y-auto">
            {NETWORK_HOSPITALS.map((hosp) => {
              const isSelected = hosp.id === currentHospital.id;
              const occPercent = Math.round((hosp.occupiedBeds / hosp.totalBeds) * 100);
              return (
                <button
                  key={hosp.id}
                  onClick={() => {
                    onSelectHospital(hosp);
                    setIsOpen(false);
                  }}
                  className={`w-full p-3 rounded-2xl border text-left transition-all cursor-pointer flex items-center justify-between group ${
                    isSelected
                      ? 'bg-blue-600/20 border-blue-500 ring-1 ring-blue-500/40 text-white shadow-lg'
                      : isDark
                      ? 'bg-slate-900/40 border-white/5 hover:bg-white/5 text-slate-300 hover:text-white'
                      : 'bg-slate-50 border-slate-200 hover:bg-slate-100 text-slate-800'
                  }`}
                >
                  <div className="flex items-start gap-3 min-w-0">
                    <div className={`p-2 rounded-xl border shrink-0 mt-0.5 ${
                      isSelected ? 'bg-blue-500/20 border-blue-400 text-blue-300' : 'bg-slate-800/60 border-white/10 text-slate-400'
                    }`}>
                      <Building2 className="w-4 h-4" />
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-bold truncate group-hover:text-cyan-300 transition-colors">
                          {hosp.name}
                        </span>
                      </div>
                      <p className="text-[10px] text-slate-400 truncate mt-0.5">
                        {hosp.type} • {hosp.city}, {hosp.state}
                      </p>
                      
                      <div className="flex items-center gap-3 mt-1.5 text-[9px] font-mono text-slate-400">
                        <span className="flex items-center gap-1">
                          <Server className="w-3 h-3 text-cyan-400" />
                          <span>{hosp.ehrSystem}</span>
                        </span>
                        <span className="flex items-center gap-1">
                          <Activity className="w-3 h-3 text-emerald-400" />
                          <span>Beds: {hosp.occupiedBeds}/{hosp.totalBeds} ({occPercent}%)</span>
                        </span>
                      </div>
                    </div>
                  </div>

                  {isSelected && (
                    <div className="w-6 h-6 rounded-full bg-blue-500 text-white flex items-center justify-center shrink-0 shadow-md">
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          {/* Footer Note */}
          <div className="p-3 border-t border-white/10 bg-slate-900/60 flex items-center justify-between text-[10px] text-slate-400 font-mono">
            <span>Network Gateway ID: NET-HUB-4091</span>
            <span className="text-emerald-400 font-bold">4/4 Nodes Online</span>
          </div>
        </div>
      )}
    </div>
  );
};
