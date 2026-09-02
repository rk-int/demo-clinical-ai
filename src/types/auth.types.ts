export type UserRole = 
  | 'DOCTOR'
  | 'PHYSICIAN'
  | 'CLINICIAN' 
  | 'NURSE' 
  | 'SPECIALIST' 
  | 'CARE_COORDINATOR' 
  | 'ADMINISTRATOR' 
  | 'PORTAL_ADMIN'
  | 'AUDITOR';

export type PurposeOfUse = 
  | 'TREATMENT' 
  | 'CARE_COORDINATION' 
  | 'CLINICAL_AUDIT' 
  | 'EMERGENCY_OVERRIDE';

export interface UserProfile {
  id: string;
  name: string;
  role: UserRole;
  department: string;
  hospitalSite: string;
  licenseNumber: string;
  assignedPatientIds: string[];
  mfaVerified: boolean;
  avatarUrl?: string;
}
