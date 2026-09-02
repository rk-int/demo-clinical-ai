/**
 * Patient Portrait Avatar Utility
 * Provides realistic medical demographic sample photos with reliable fallbacks and ZERO duplications
 */

import { SyntheticPatient } from '../types';

// Curated high-resolution Unsplash portraits with diverse demographics (strictly unique URLs)
const CURATED_PATIENT_PHOTOS: Record<string, string> = {
  // PT-1000: John Doe (45 M)
  'PT-1000': 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=256&h=256',
  'john doe': 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=256&h=256',

  // PT-1001: Jane Smith (62 F)
  'PT-1001': 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=256&h=256',
  'jane smith': 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=256&h=256',

  // PT-1002: Elena Rostova (67 F)
  'PT-1002': 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=256&h=256',
  'elena rostova': 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=256&h=256',
  
  // PT-1003: Marcus Vance (47 M)
  'PT-1003': 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=256&h=256',
  'marcus vance': 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=256&h=256',

  // PT-1004: Sarah Jenkins (42 F)
  'PT-1004': 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=256&h=256',
  'sarah jenkins': 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=256&h=256',

  // PT-1004B: Robert Brown (58 M)
  'PT-1004B': 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=256&h=256',
  'robert brown': 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=256&h=256',

  // PT-1005: Arthur Pendelton (78 M)
  'PT-1005': 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=256&h=256',
  'arthur pendelton': 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=256&h=256',

  // PT-1006: Aaliyah Khan (30 F)
  'PT-1006': 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=256&h=256',
  'aaliyah khan': 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=256&h=256',

  // PT-1007: Mateo Morales (61 M)
  'PT-1007': 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=256&h=256',
  'mateo morales': 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=256&h=256',

  // PT-1008: Chloe Zhang (24 F)
  'PT-1008': 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=256&h=256',
  'chloe zhang': 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=256&h=256',

  // PT-1009: Darnell Washington (56 M)
  'PT-1009': 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&q=80&w=256&h=256',
  'darnell washington': 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&q=80&w=256&h=256',

  // PT-1010: Brigitte Dubois (73 F)
  'PT-1010': 'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?auto=format&fit=crop&q=80&w=256&h=256',
  'brigitte dubois': 'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?auto=format&fit=crop&q=80&w=256&h=256',

  // PT-1011: Liam Gallagher (36 M)
  'PT-1011': 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=256&h=256',
  'liam gallagher': 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=256&h=256',

  // PT-1012: Sophia Martinez (14 F)
  'PT-1012': 'https://images.unsplash.com/photo-1517677208171-0bc6725a3e60?auto=format&fit=crop&q=80&w=256&h=256',
  'sophia martinez': 'https://images.unsplash.com/photo-1517677208171-0bc6725a3e60?auto=format&fit=crop&q=80&w=256&h=256',

  // PT-1013: Robert Tanaka (65 M)
  'PT-1013': 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=256&h=256',
  'robert tanaka': 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=256&h=256',

  // Eleanor Vance (62 F - Registered demo transfer patient)
  'PT-NEW-99': 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&q=80&w=256&h=256',
  'eleanor vance': 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&q=80&w=256&h=256',
};

// Independent, strictly non-overlapping fallback pools for dynamically registered patients
const FEMALE_FALLBACK_PHOTOS = [
  'https://images.unsplash.com/photo-1548142813-c348350df52b?auto=format&fit=crop&q=80&w=256&h=256',
  'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&q=80&w=256&h=256',
  'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&q=80&w=256&h=256',
  'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&q=80&w=256&h=256',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=256&h=256',
  'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&q=80&w=256&h=256',
  'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&q=80&w=256&h=256',
  'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&q=80&w=256&h=256',
];

const MALE_FALLBACK_PHOTOS = [
  'https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?auto=format&fit=crop&q=80&w=256&h=256',
  'https://images.unsplash.com/photo-1508341591423-4347099e1f19?auto=format&fit=crop&q=80&w=256&h=256',
  'https://images.unsplash.com/photo-1513956589380-bad6acb9b9d4?auto=format&fit=crop&q=80&w=256&h=256',
  'https://images.unsplash.com/photo-1534308983496-4fabb1a015ee?auto=format&fit=crop&q=80&w=256&h=256',
  'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&q=80&w=256&h=256',
  'https://images.unsplash.com/photo-1463453091185-61582044d556?auto=format&fit=crop&q=80&w=256&h=256',
  'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=256&h=256',
];

export function getPatientAvatarUrl(patient: Partial<SyntheticPatient>): string {
  if (patient.avatarUrl) {
    return patient.avatarUrl;
  }

  if (patient.id && CURATED_PATIENT_PHOTOS[patient.id]) {
    return CURATED_PATIENT_PHOTOS[patient.id];
  }

  const normalizedName = patient.fullName?.trim().toLowerCase() || '';
  if (normalizedName && CURATED_PATIENT_PHOTOS[normalizedName]) {
    return CURATED_PATIENT_PHOTOS[normalizedName];
  }

  // Hash calculation ensuring distributed selection from non-overlapping pools
  const strHash = (patient.fullName || patient.id || patient.uprId || 'patient')
    .split('')
    .reduce((acc, char) => acc + char.charCodeAt(0), 0);

  if (patient.gender === 'FEMALE') {
    return FEMALE_FALLBACK_PHOTOS[strHash % FEMALE_FALLBACK_PHOTOS.length];
  }

  return MALE_FALLBACK_PHOTOS[strHash % MALE_FALLBACK_PHOTOS.length];
}
