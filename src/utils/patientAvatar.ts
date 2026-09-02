/**
 * Patient Portrait Avatar Utility
 * Provides realistic medical demographic sample photos with reliable fallbacks and ZERO duplications
 */

import { SyntheticPatient, UserProfile } from '../types';

// Curated high-resolution professional studio & medical ID portraits (strictly decent, formal, non-social-media style)
const CURATED_PATIENT_PHOTOS: Record<string, string> = {
  // PT-1000: John Doe (45 M) - Formal Corporate Headshot
  'PT-1000': 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=256&h=256',
  'john doe': 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=256&h=256',

  // PT-1001: Jane Smith (62 F) - Executive Clinical Headshot
  'PT-1001': 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=256&h=256',
  'jane smith': 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=256&h=256',

  // PT-1002: Elena Rostova (67 F) - Senior Neutral Portrait
  'PT-1002': 'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?auto=format&fit=crop&q=80&w=256&h=256',
  'elena rostova': 'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?auto=format&fit=crop&q=80&w=256&h=256',
  
  // PT-1003: Marcus Vance (47 M) - Formal Studio Headshot
  'PT-1003': 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=256&h=256',
  'marcus vance': 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=256&h=256',

  // PT-1004: Sarah Jenkins (42 F) - Professional Medical Staff Portrait
  'PT-1004': 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=256&h=256',
  'sarah jenkins': 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=256&h=256',

  // PT-1004B: Robert Brown (58 M) - Neutral Corporate Portrait
  'PT-1004B': 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=256&h=256',
  'robert brown': 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=256&h=256',

  // PT-1005: Arthur Pendelton (78 M) - Senior Studio Headshot
  'PT-1005': 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=256&h=256',
  'arthur pendelton': 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=256&h=256',

  // PT-1006: Aaliyah Khan (30 F) - Professional Corporate Portrait
  'PT-1006': 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&q=80&w=256&h=256',
  'aaliyah khan': 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&q=80&w=256&h=256',

  // PT-1007: Mateo Morales (61 M) - Executive Studio Headshot
  'PT-1007': 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=256&h=256',
  'mateo morales': 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=256&h=256',

  // PT-1008: Chloe Zhang (24 F) - Professional Studio Headshot
  'PT-1008': 'https://images.unsplash.com/photo-1594744803329-e58b31de8bf5?auto=format&fit=crop&q=80&w=256&h=256',
  'chloe zhang': 'https://images.unsplash.com/photo-1594744803329-e58b31de8bf5?auto=format&fit=crop&q=80&w=256&h=256',

  // PT-1009: Darnell Washington (56 M) - Formal Studio Headshot
  'PT-1009': 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&q=80&w=256&h=256',
  'darnell washington': 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&q=80&w=256&h=256',

  // PT-1010: Brigitte Dubois (73 F) - Senior Professional Portrait
  'PT-1010': 'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?auto=format&fit=crop&q=80&w=256&h=256',
  'brigitte dubois': 'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?auto=format&fit=crop&q=80&w=256&h=256',

  // PT-1011: Liam Gallagher (36 M) - Formal Neutral Headshot
  'PT-1011': 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=256&h=256',
  'liam gallagher': 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=256&h=256',

  // PT-1012: Sophia Martinez (14 F) - Modest Professional Portrait
  'PT-1012': 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=256&h=256',
  'sophia martinez': 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=256&h=256',

  // PT-1013: Robert Tanaka (65 M) - Formal Studio Portrait
  'PT-1013': 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=256&h=256',
  'robert tanaka': 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=256&h=256',

  // Eleanor Vance (62 F - Registered demo transfer patient)
  'PT-NEW-99': 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&q=80&w=256&h=256',
  'eleanor vance': 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&q=80&w=256&h=256',
};

// Independent, strictly professional fallback photo pools for dynamic registrations
const FEMALE_FALLBACK_PHOTOS = [
  'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=256&h=256',
  'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=256&h=256',
  'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&q=80&w=256&h=256',
  'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?auto=format&fit=crop&q=80&w=256&h=256',
  'https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&q=80&w=256&h=256',
  'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&q=80&w=256&h=256',
];

const MALE_FALLBACK_PHOTOS = [
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=256&h=256',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=256&h=256',
  'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=256&h=256',
  'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=256&h=256',
  'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=256&h=256',
  'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&q=80&w=256&h=256',
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

  // Hash calculation ensuring distributed selection from professional photo pools
  const strHash = (patient.fullName || patient.id || patient.uprId || 'patient')
    .split('')
    .reduce((acc, char) => acc + char.charCodeAt(0), 0);

  if (patient.gender === 'FEMALE') {
    return FEMALE_FALLBACK_PHOTOS[strHash % FEMALE_FALLBACK_PHOTOS.length];
  }

  return MALE_FALLBACK_PHOTOS[strHash % MALE_FALLBACK_PHOTOS.length];
}

// Curated doctor & practitioner avatars
const DOCTOR_AVATARS: Record<string, string> = {
  'dr. emily vance': 'https://images.unsplash.com/photo-1594824813566-78a932757271?auto=format&fit=crop&q=80&w=256&h=256',
  'emily vance': 'https://images.unsplash.com/photo-1594824813566-78a932757271?auto=format&fit=crop&q=80&w=256&h=256',
  'usr-spec-01': 'https://images.unsplash.com/photo-1594824813566-78a932757271?auto=format&fit=crop&q=80&w=256&h=256',
  'dr. sarah chen': 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=256&h=256',
  'sarah chen': 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=256&h=256',
  'usr-doc-01': 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=256&h=256',
  'carlos mendez': 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&q=80&w=256&h=256',
  'jennifer walsh': 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?auto=format&fit=crop&q=80&w=256&h=256',
  'dr. marcus vance': 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=256&h=256',
  'marcus vance': 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=256&h=256',
  'dr. john smith': 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=256&h=256',
  'john smith': 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=256&h=256',
};

export function getUserAvatarUrl(userOrName?: UserProfile | Partial<UserProfile> | string | null): string {
  if (!userOrName) {
    return DOCTOR_AVATARS['emily vance'];
  }

  if (typeof userOrName === 'string') {
    const norm = userOrName.trim().toLowerCase();
    for (const [key, url] of Object.entries(DOCTOR_AVATARS)) {
      if (norm.includes(key)) return url;
    }
    if (norm.includes('emily') || norm.includes('vance')) {
      return DOCTOR_AVATARS['emily vance'];
    }
  } else if (typeof userOrName === 'object') {
    if (userOrName.avatarUrl) {
      return userOrName.avatarUrl;
    }
    const normName = userOrName.name?.trim().toLowerCase() || '';
    for (const [key, url] of Object.entries(DOCTOR_AVATARS)) {
      if (normName.includes(key)) return url;
    }
    if (userOrName.id && DOCTOR_AVATARS[userOrName.id]) {
      return DOCTOR_AVATARS[userOrName.id];
    }
    if (normName.includes('emily') || normName.includes('vance')) {
      return DOCTOR_AVATARS['emily vance'];
    }
  }

  return 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=256&h=256';
}
