import React, { createContext, useContext, useState, ReactNode } from 'react';
import { PurposeOfUse } from '../types';

interface PurposeOfUseContextType {
  purposeOfUse: PurposeOfUse;
  setPurposeOfUse: (purpose: PurposeOfUse) => void;
  isEmergencyOverride: boolean;
  triggerEmergencyOverride: () => void;
  clearEmergencyOverride: () => void;
}

const PurposeOfUseContext = createContext<PurposeOfUseContextType | undefined>(undefined);

export const PurposeOfUseProvider: React.FC<{ children: ReactNode; initialPurpose?: PurposeOfUse }> = ({
  children,
  initialPurpose = 'TREATMENT',
}) => {
  const [purposeOfUse, setPurposeOfUse] = useState<PurposeOfUse>(initialPurpose);

  const triggerEmergencyOverride = () => {
    setPurposeOfUse('EMERGENCY_OVERRIDE');
  };

  const clearEmergencyOverride = () => {
    setPurposeOfUse('TREATMENT');
  };

  return (
    <PurposeOfUseContext.Provider
      value={{
        purposeOfUse,
        setPurposeOfUse,
        isEmergencyOverride: purposeOfUse === 'EMERGENCY_OVERRIDE',
        triggerEmergencyOverride,
        clearEmergencyOverride,
      }}
    >
      {children}
    </PurposeOfUseContext.Provider>
  );
};

export const usePurposeOfUse = () => {
  const context = useContext(PurposeOfUseContext);
  if (!context) {
    throw new Error('usePurposeOfUse must be used within a PurposeOfUseProvider');
  }
  return context;
};
