import { GuardrailEvent, UserProfile, PurposeOfUse } from '../types';

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  userId: string;
  userName: string;
  role: string;
  purposeOfUse: PurposeOfUse;
  patientId?: string;
  action: string;
  status: 'SUCCESS' | 'BLOCKED' | 'FLAGGED' | 'WARNING';
  details?: Record<string, any>;
}

class AuditLogger {
  private logs: AuditLogEntry[] = [];

  constructor() {
    // Seed initial audit log entries
    this.logs = [
      {
        id: 'LOG-1001',
        timestamp: new Date(Date.now() - 3600000).toISOString(),
        userId: 'USR-DOC-01',
        userName: 'Dr. Sarah Jenkins, MD',
        role: 'CLINICIAN',
        purposeOfUse: 'TREATMENT',
        patientId: 'PT-1000',
        action: 'PATIENT_360_VIEW',
        status: 'SUCCESS',
      },
      {
        id: 'LOG-1002',
        timestamp: new Date(Date.now() - 1800000).toISOString(),
        userId: 'USR-AUD-01',
        userName: 'Robert Chen, JD',
        role: 'AUDITOR',
        purposeOfUse: 'CLINICAL_AUDIT',
        patientId: 'PT-1001',
        action: 'COMPLIANCE_REVIEW',
        status: 'SUCCESS',
      }
    ];
  }

  public logAccess(user: UserProfile, purpose: PurposeOfUse, action: string, patientId?: string, status: 'SUCCESS' | 'BLOCKED' | 'FLAGGED' | 'WARNING' = 'SUCCESS', details?: Record<string, any>): AuditLogEntry {
    const entry: AuditLogEntry = {
      id: `LOG-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      timestamp: new Date().toISOString(),
      userId: user.id,
      userName: user.name,
      role: user.role,
      purposeOfUse: purpose,
      patientId,
      action,
      status,
      details,
    };
    this.logs.unshift(entry);
    return entry;
  }

  public getLogs(): AuditLogEntry[] {
    return [...this.logs];
  }
}

export const auditLogger = new AuditLogger();
