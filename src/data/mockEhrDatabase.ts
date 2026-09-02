import { SyntheticPatient, LabObservation, Medication, ClinicalCondition, ClinicalEncounter } from '../types';
import { SYNTHETIC_PATIENTS } from './syntheticFhirData';
import { SYNTHETIC_TEAM_NOTES } from './syntheticTeamNotes';
import { APPROVED_GUIDELINES } from './approvedKnowledge';

export class MockEHRDatabase {
  private static patients: SyntheticPatient[] = [...SYNTHETIC_PATIENTS];

  public static getAllPatients(): SyntheticPatient[] {
    return [...this.patients];
  }

  public static findPatient(query: string): SyntheticPatient[] {
    const q = query.toLowerCase().trim();
    if (!q) return this.patients;
    return this.patients.filter(p => 
      p.fullName.toLowerCase().includes(q) ||
      p.mrn.toLowerCase().includes(q) ||
      (p.uprId && p.uprId.toLowerCase().includes(q)) ||
      p.conditions.some(c => c.name.toLowerCase().includes(q))
    );
  }

  public static getPatientById(id: string): SyntheticPatient | undefined {
    return this.patients.find(p => p.id === id);
  }

  public static addPatient(patient: SyntheticPatient): void {
    this.patients = [patient, ...this.patients.filter(p => p.id !== patient.id)];
  }

  public static getTeamNotes(patientId?: string) {
    if (!patientId) return SYNTHETIC_TEAM_NOTES;
    return SYNTHETIC_TEAM_NOTES.filter(n => n.patientId === patientId);
  }

  public static getGuidelines() {
    return APPROVED_GUIDELINES;
  }
}
