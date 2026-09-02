import { ClinicalTeamNote, UserRole } from '../types';

export const INITIAL_TEAM_NOTES: ClinicalTeamNote[] = [
  // Notes for PT-1002 / pat-1 (Robert Chen / Eleanor Vance)
  {
    id: 'NOTE-DOC-001',
    patientId: 'PT-1002',
    patientName: 'Robert Chen',
    authorId: 'usr-doc-01',
    authorName: 'Dr. Marcus Vance, MD',
    authorRole: 'DOCTOR',
    authorDepartment: 'Inpatient Cardiology',
    noteType: 'DOCTOR_PROGRESS_NOTE',
    title: "Attending Physician Daily Progress Note (SOAP)",
    timestamp: '2026-08-31T08:30:00Z',
    status: 'SIGNED_FINAL',
    content: {
      subjective: 'Patient reports feeling significantly better today. Orthopnea improved from 3 pillows to 1 pillow. Denies acute chest pain, lightheadedness, or palpitations. Tolerating morning cardiac diet without nausea.',
      objective: {
        vitals: 'BP 122/76 mmHg | HR 68 bpm regular | SpO2 98% on Room Air | Temp 98.6°F | Weight 78.4 kg (-1.2 kg net 24h)',
        physicalExam: 'Alert and oriented x4. CV: Normal S1/S2, regular rate and rhythm, no S3/S4 gallop. Lungs: Clear to auscultation bilaterally, bibasilar rales cleared. Abdomen: Soft, nontender. Extremities: Trace 1+ bilateral lower extremity edema (improved from 2+).',
        recentLabs: 'NT-proBNP 1,840 pg/mL (down from 3,200) | Serum Creatinine 1.28 mg/dL | eGFR 58 mL/min/1.73m² | K+ 4.4 mmol/L | Na+ 139 mEq/L'
      },
      assessment: '1. Acute Decompensated Heart Failure (HFrEF, EF 32%) – Euvolemic transition on oral guideline-directed medical therapy.\n2. Non-ischemic dilated cardiomyopathy – Hemodynamically stable.\n3. Type 2 Diabetes Mellitus – Glycemic goals met.',
      plan: '1. Convert IV diuresis to oral Furosemide 40 mg PO daily with breakfast.\n2. Continue Entresto (Sacubitril/Valsartan) 24/26 mg PO BID.\n3. Initiate Empagliflozin 10 mg PO daily for cardiorenal protection.\n4. Repeat renal chemistry panel in 48 hours.\n5. Physical Therapy consult for ambulation assessment.',
      keyRecommendations: [
        'Maintain daily morning dry weight log',
        'Strict 2,000 mg daily sodium and 1.5 L fluid restriction',
        'Follow up with Heart Failure clinic in 7 days'
      ]
    },
    tags: ['Cardiology', 'HFrEF', 'GDMT', 'Progress Note'],
    signatureHash: 'sha256:e9a78f219c0b11e2f7b88410294ab1c3d'
  },
  {
    id: 'NOTE-NURSE-001',
    patientId: 'PT-1002',
    patientName: 'Robert Chen',
    authorId: 'usr-nurse-01',
    authorName: 'Sarah Jenkins, BSN, RN',
    authorRole: 'NURSE',
    authorDepartment: 'Cardiac Telemetry Unit 4B',
    noteType: 'NURSE_ASSESSMENT',
    title: "Registered Nurse 12-Hour Shift Assessment & Care Plan",
    timestamp: '2026-08-31T07:15:00Z',
    status: 'SIGNED_FINAL',
    content: {
      subjective: 'Patient states: "I slept through the night without waking up gasping for air for the first time this week." Requesting assistance to shower this morning.',
      objective: {
        vitals: 'BP 118/74 mmHg | HR 72 bpm (Telemetry: Sinus rhythm with occasional PACs) | RR 16 bpm | SpO2 97% RA | Blood Glucose 138 mg/dL fasting',
        physicalExam: 'Peripheral IV #20G in left forearm intact, clean, dry, patent without erythema or phlebitis. Skin warm and dry. Telemetry strip verified and archived. Voiding spontaneously with clear yellow urine (total 24h output: 2,450 mL against 1,200 mL intake).',
        recentLabs: 'Morning fingerstick glucose 134 mg/dL. Telemetry continuous monitoring active.'
      },
      assessment: 'Patient is clinically stable and exhibiting excellent response to fluid de-escalation. Independent with upper body hygiene; standby assist for transfers to chair. Fall risk Morse score: 25 (Low-Moderate).',
      plan: '1. Administer morning cardiac medications after breakfast tray delivery.\n2. Assist with ambulation in hallway x2 laps with telemetry transmitter.\n3. Reinforce low-sodium diet meal selection and fluid intake tracking log.\n4. Reassess bilateral pedal edema at 14:00.',
      keyRecommendations: [
        'Monitor strict intake and output (I&O) record',
        'Encourage compression socks while out of bed',
        'Report any telemetry rhythm changes to Charge RN'
      ]
    },
    tags: ['Nursing', 'Shift Assessment', 'I&O Tracking', 'Telemetry'],
    signatureHash: 'sha256:7f4a8109d983ec6701ba1254309c0042f'
  },
  {
    id: 'NOTE-SPEC-001',
    patientId: 'PT-1002',
    patientName: 'Robert Chen',
    authorId: 'usr-spec-01',
    authorName: 'Dr. Priya Patel, MD, FACC',
    authorRole: 'SPECIALIST',
    authorDepartment: 'Advanced Heart Failure & Electrophysiology',
    noteType: 'SPECIALIST_CONSULT',
    title: "Cardiology Specialist Consultation & Device Review",
    timestamp: '2026-08-30T14:45:00Z',
    status: 'SIGNED_FINAL',
    content: {
      subjective: 'Requested by primary cardiology team for evaluation of persistent LVEF 32% and candidacy for primary prevention ICD/CRT-D therapy.',
      objective: {
        vitals: 'BP 124/78 mmHg | HR 70 bpm | 12-Lead ECG: Sinus rhythm, QRS duration 138 ms with LBBB morphology.',
        physicalExam: 'JVP estimated at 6 cm H2O. Carotid upstrokes normal. PMI displaced 1 cm lateral to mid-clavicular line. No peripheral cyanosis.',
        recentLabs: 'Transthoracic Echo (2026-08-28): LVEF 32%, moderate global hypokinesis, mild mitral regurgitation (2+), preserved RV systolic function (TAPSE 1.9 cm).'
      },
      assessment: '1. Dilated non-ischemic cardiomyopathy with LVEF 32% on optimal medical therapy for 45 days.\n2. QRS prolongation (138 ms) with LBBB – Candidate for cardiac resynchronization evaluation if LVEF remains <= 35% after 90 days GDMT optimization.\n3. High compliance with quadruple medical therapy (ARNI + Beta-blocker + MRA + SGLT2i).',
      plan: '1. Maximize Entresto titration to target dose (97/103 mg BID) as outpatient blood pressure permits.\n2. Add Spironolactone 25 mg daily provided serum potassium remains <= 5.0 mmol/L.\n3. Schedule repeat TTE in 60 days in Heart Failure device clinic to determine definitive CRT-D indication.',
      keyRecommendations: [
        'Repeat Echocardiogram at 90-day GDMT benchmark',
        'Avoid NSAIDs and OTC decongestants',
        'Enroll in remote cardiopulmonary wearable telemonitoring program'
      ]
    },
    tags: ['Specialist Consult', 'Electrophysiology', 'CRT-D Evaluation', 'Echo Review'],
    signatureHash: 'sha256:8892ca010b98df004123547890bc4123a'
  },
  {
    id: 'NOTE-CARE-001',
    patientId: 'PT-1002',
    patientName: 'Robert Chen',
    authorId: 'usr-coord-01',
    authorName: 'Carlos Mendez, MSW, CCM',
    authorRole: 'CARE_COORDINATOR',
    authorDepartment: 'Transitions of Care & Population Health',
    noteType: 'CARE_COORDINATION',
    title: "Post-Acute Care Coordination & Social Determinants Assessment",
    timestamp: '2026-08-30T16:00:00Z',
    status: 'SIGNED_FINAL',
    content: {
      subjective: 'Met with patient and his daughter (primary caregiver) at bedside. Discussed safe discharge readiness, home environmental setup, and pharmacy prescription delivery.',
      objective: {
        vitals: 'Patient resides in single-story home with 2 entry steps. Daughter lives 10 minutes away and will assist with daily medication administration and meal preparation.',
        physicalExam: 'Patient oriented, demonstrates accurate understanding of daily weights and red flag symptom escalation.',
        recentLabs: 'Medicare Part D copay subsidy authorized for Entresto and Empagliflozin through hospital medication bridge grant.'
      },
      assessment: 'Patient has strong familial support and clear social resources. High likelihood of 30-day readmission reduction with proactive telephone outreach and home nursing visits.',
      plan: '1. Arranged home health nursing visits x2/week for vital signs and cardiopulmonary checks for 3 weeks post-discharge.\n2. Confirmed delivery of 30-day medication supply directly to bedside prior to discharge.\n3. Scheduled 48-hour post-discharge telephone follow-up call for 2026-09-02.\n4. Transport assistance vouchers provided for 7-day clinic follow-up.',
      keyRecommendations: [
        '48-hour care management callback scheduled',
        'Home Health Nursing order sent to St. Jude Home Care',
        'Medication bedside delivery confirmed'
      ]
    },
    tags: ['Care Coordination', 'Social Determinants', 'Discharge Readiness', 'Home Health'],
    signatureHash: 'sha256:33140ab89901dc48810239487501bca90'
  },
  {
    id: 'NOTE-ADMIN-001',
    patientId: 'PT-1002',
    patientName: 'Robert Chen',
    authorId: 'usr-admin-01',
    authorName: 'Alex Rivera, MBA',
    authorRole: 'ADMINISTRATOR',
    authorDepartment: 'Hospital Clinical Quality & Compliance',
    noteType: 'ADMIN_REVIEW',
    title: "Clinical Documentation Quality & Value-Based Care Audit Note",
    timestamp: '2026-08-29T11:00:00Z',
    status: 'SIGNED_FINAL',
    content: {
      subjective: 'Inpatient stay length-of-stay (LOS) review conducted per CMS Quality Payment Program (QPP) and Heart Failure Bundle Metrics.',
      objective: {
        vitals: 'Current Inpatient LOS: Day 3 (Within geometric mean LOS target of 4.2 days for DRG 291).',
        physicalExam: 'Hospital acquired conditions (HAC) screening: Negative for CAUTI, CLABSI, and pressure injury.',
        recentLabs: 'FHIR R4 dataset completeness: 100% (All core USCDI v3 clinical data classes populated).'
      },
      assessment: 'Clinical documentation complies fully with Joint Commission Heart Failure Core Measures (HF-1, HF-2, HF-3). Prior authorization for post-discharge SGLT2i therapy approved.',
      plan: '1. Quality measures cleared for value-based reimbursement reporting.\n2. Inpatient bed utilization optimization validated.\n3. Case documentation verified for compliance sign-off.',
      keyRecommendations: [
        'Ensure discharge medication reconciliation is completed prior to room release',
        'Attach CMS-mandated written educational materials in discharge packet'
      ]
    },
    tags: ['Quality Audit', 'CMS Measures', 'Utilization Review', 'Compliance'],
    signatureHash: 'sha256:4b9101ef2800119283746590128374651'
  },
  {
    id: 'NOTE-PORTAL-001',
    patientId: 'PT-1002',
    patientName: 'Robert Chen',
    authorId: 'usr-portal-01',
    authorName: 'Taylor Reed, CISSP',
    authorRole: 'PORTAL_ADMIN',
    authorDepartment: 'System Security & Interoperability Infrastructure',
    noteType: 'PORTAL_AUDIT',
    title: "FHIR Cryptographic Attestation & ABAC Access Audit Log",
    timestamp: '2026-08-29T09:15:00Z',
    status: 'SIGNED_FINAL',
    content: {
      subjective: 'Automated cryptographic security audit of electronic health record access for patient Robert Chen (MRN-90214).',
      objective: {
        vitals: 'Patient consent status: ACTIVE_CONSENT verified via Master Identity Index. No opt-out restrictions logged.',
        physicalExam: 'Zero unauthorized cross-tenant read events detected in past 72 hours. All access tokens bounded to PURPOSE_OF_USE: TREATMENT.',
        recentLabs: 'FHIR R4 Resource Integrity Check: Passed SHA-256 validation on all 14 observation payloads.'
      },
      assessment: 'Access control compliance score: 100%. Encryption-in-transit (TLS 1.3) and storage-at-rest encryption verified.',
      plan: '1. Maintain automated audit telemetry logging.\n2. Re-verify cryptographic signatures upon encounter close.',
      keyRecommendations: [
        'Audit record mirrored to immutable security ledger',
        'No security anomalies or break-glass overrides observed'
      ]
    },
    tags: ['Security Audit', 'FHIR Cryptography', 'ABAC Compliance', 'Access Ledger'],
    signatureHash: 'sha256:1234567890abcdef1234567890abcdef1'
  },

  // Notes for PT-1001 (Eleanor Vance)
  {
    id: 'NOTE-DOC-002',
    patientId: 'PT-1001',
    patientName: 'Eleanor Vance',
    authorId: 'usr-doc-01',
    authorName: 'Dr. Marcus Vance, MD',
    authorRole: 'DOCTOR',
    authorDepartment: 'Inpatient Cardiology',
    noteType: 'DOCTOR_PROGRESS_NOTE',
    title: "Attending Physician Comprehensive Progress Note",
    timestamp: '2026-09-01T09:15:00Z',
    status: 'SIGNED_FINAL',
    content: {
      subjective: 'Patient reports mild fatigue after morning physical therapy but no shortness of breath at rest. Denies dizziness or orthostatic lightheadedness.',
      objective: {
        vitals: 'BP 128/82 mmHg | HR 74 bpm | SpO2 97% on Room Air | Temp 98.4°F | Weight 64.2 kg',
        physicalExam: 'Alert, pleasant, in no acute distress. Lungs clear to bases. Heart: S1/S2 audible, no murmurs. Extremities without edema.',
        recentLabs: 'eGFR 38 mL/min/1.73m² (stable) | Serum Creatinine 1.42 mg/dL | Serum Potassium 4.6 mmol/L'
      },
      assessment: '1. Heart Failure with Preserved Ejection Fraction (HFpEF, NYHA Class II) - Well compensated.\n2. Chronic Kidney Disease Stage 3a - Stable.\n3. Hypertension - Well controlled.',
      plan: '1. Maintain current regimen: Empagliflozin 10 mg PO daily, Sacubitril/Valsartan 24/26 mg BID, Torsemide 20 mg PO daily.\n2. Outpatient cardio-renal monitoring scheduled in 2 weeks.\n3. Discharge cleared for tomorrow morning.',
      keyRecommendations: ['Continue low-sodium diet', 'Daily weight monitoring with automated Bluetooth scale']
    },
    tags: ['Cardiology', 'HFpEF', 'Inpatient Note'],
    signatureHash: 'sha256:aa9128374659102837465019283746510'
  },
  {
    id: 'NOTE-NURSE-002',
    patientId: 'PT-1001',
    patientName: 'Eleanor Vance',
    authorId: 'usr-nurse-01',
    authorName: 'Sarah Jenkins, BSN, RN',
    authorRole: 'NURSE',
    authorDepartment: 'Heart Failure Stepdown',
    noteType: 'NURSE_ASSESSMENT',
    title: "Nursing Care Plan & Discharge Education Checklist",
    timestamp: '2026-09-01T08:00:00Z',
    status: 'SIGNED_FINAL',
    content: {
      subjective: 'Patient states she feels confident managing her new diuretic medication schedule at home. Son was present for medication teach-back session.',
      objective: {
        vitals: 'BP 126/80 mmHg | HR 72 bpm regular | SpO2 98% RA | Pain 0/10',
        physicalExam: 'Skin intact, dry, warm. Ambulating with walker with steady gait. Good appetite, consumed 85% of breakfast.',
        recentLabs: 'Blood glucose fasting 112 mg/dL.'
      },
      assessment: 'Patient demonstrates successful teach-back for heart failure self-care, daily weight threshold rules (+3 lbs/day or +5 lbs/week), and when to notify clinic.',
      plan: '1. Complete discharge folder with large-print medication summary.\n2. Ensure home scale delivery confirmation.',
      keyRecommendations: ['Teach-back verified with family', 'Walker safety reinforced']
    },
    tags: ['Nursing', 'Discharge Education', 'Teach-Back'],
    signatureHash: 'sha256:bb0192837465102938475601928374651'
  },
  {
    id: 'NOTE-SPEC-002',
    patientId: 'PT-1001',
    patientName: 'Eleanor Vance',
    authorId: 'usr-spec-01',
    authorName: 'Dr. Priya Patel, MD, FACC',
    authorRole: 'SPECIALIST',
    authorDepartment: 'Cardiorenal Metabolic Clinic',
    noteType: 'SPECIALIST_CONSULT',
    title: "Cardiorenal Specialist Consultation Note",
    timestamp: '2026-08-30T15:30:00Z',
    status: 'SIGNED_FINAL',
    content: {
      subjective: 'Cardiorenal consult requested to evaluate optimal SGLT2 inhibitor dosing given borderline eGFR of 38 mL/min/1.73m².',
      objective: {
        vitals: 'Baseline eGFR has remained steady between 36-40 for past 18 months. Urine Albumin-to-Creatinine Ratio (uACR): 180 mg/g.',
        physicalExam: 'Euvolemic status on physical examination. No orthostatic blood pressure drops.',
        recentLabs: 'K+ 4.7 mmol/L, HCO3 24 mEq/L.'
      },
      assessment: '1. EMPEROR-Preserved & DELIVER evidence strongly supports SGLT2i therapy in HFpEF down to eGFR of 20 mL/min/1.73m².\n2. Empagliflozin 10 mg daily is renal protective and will decelerate CKD progression while reducing HF hospitalizations.',
      plan: '1. Continue Empagliflozin 10 mg PO daily without dose reduction.\n2. Monitor serum creatinine at 2-week post-discharge visit; expect minor hemodynamic eGFR dip (<= 15%) which is benign and reversible.\n3. Avoid concomitant NSAID use.',
      keyRecommendations: ['SGLT2i safely continued with eGFR 38', 'Cardiorenal clinic follow-up in 4 weeks']
    },
    tags: ['Specialist Consult', 'Cardiorenal', 'SGLT2i Protocol', 'Renal Protection'],
    signatureHash: 'sha256:cc1234567890abcdef1234567890abcdef1'
  },
  {
    id: 'NOTE-CARE-002',
    patientId: 'PT-1001',
    patientName: 'Eleanor Vance',
    authorId: 'usr-coord-01',
    authorName: 'Carlos Mendez, MSW, CCM',
    authorRole: 'CARE_COORDINATOR',
    authorDepartment: 'Transitions of Care',
    noteType: 'CARE_COORDINATION',
    title: "Care Transition Plan & Home Health Enrollment",
    timestamp: '2026-08-31T14:00:00Z',
    status: 'SIGNED_FINAL',
    content: {
      subjective: 'Coordinated post-acute care transitions with patient and visiting nurse service.',
      objective: {
        vitals: 'Insurance authorization approved for 4 weeks of skilled nursing visits and physical therapy.',
        physicalExam: 'Home environment verified as accessible with main-floor bedroom and walk-in shower.',
        recentLabs: 'Pharmacy delivery set for 10:00 AM on discharge day.'
      },
      assessment: 'Discharge transition plan fully established with zero identified social barriers.',
      plan: '1. Home health initial assessment visit scheduled for Day 1 post-discharge.\n2. Care coordinator telephone follow-up scheduled for Day 2.',
      keyRecommendations: ['Home nursing enrolled', 'Medication co-pay assistance finalized']
    },
    tags: ['Care Coordination', 'Transition of Care', 'Home Support'],
    signatureHash: 'sha256:dd1234567890abcdef1234567890abcdef1'
  },

  // Notes for PT-1000 (John Doe)
  {
    id: 'NOTE-DOC-003',
    patientId: 'PT-1000',
    patientName: 'John Doe',
    authorId: 'usr-doc-01',
    authorName: 'Dr. Sarah Johnson, MD',
    authorRole: 'DOCTOR',
    authorDepartment: 'Inpatient Cardiology',
    noteType: 'DOCTOR_PROGRESS_NOTE',
    title: "Physician Inpatient SOAP Progress Note",
    timestamp: '2026-08-31T09:00:00Z',
    status: 'SIGNED_FINAL',
    content: {
      subjective: 'Patient resting comfortably. Reports no recurrence of chest tightness after diagnostic catheterization. Incision site clean.',
      objective: {
        vitals: 'BP 124/78 mmHg | HR 64 bpm | SpO2 99% on Room Air | Temp 98.2°F',
        physicalExam: 'Right radial artery access site without hematoma, strong distal radial pulse. Heart regular rate and rhythm.',
        recentLabs: 'Cardiac Troponin I < 0.01 ng/mL | Total Cholesterol 172 mg/dL | LDL-C 78 mg/dL'
      },
      assessment: '1. Coronary Artery Disease – Status post diagnostic angiography, non-obstructive disease.\n2. Primary Hypertension – Controlled.\n3. Hyperlipidemia – Controlled on Atorvastatin 40 mg.',
      plan: '1. Continue Atorvastatin 40 mg daily at bedtime.\n2. Continue Metoprolol Succinate 50 mg daily.\n3. Radial puncture dressing removal at 12:00.\n4. Discharge to home this afternoon with outpatient cardiology follow-up in 4 weeks.',
      keyRecommendations: ['Resume light activities tomorrow', 'Avoid heavy lifting > 10 lbs with right arm for 48 hours']
    },
    tags: ['Cardiology', 'Post-Cath', 'CAD', 'SOAP Note'],
    signatureHash: 'sha256:ee1234567890abcdef1234567890abcdef1'
  },
  {
    id: 'NOTE-NURSE-003',
    patientId: 'PT-1000',
    patientName: 'John Doe',
    authorId: 'usr-nurse-01',
    authorName: 'Sarah Jenkins, BSN, RN',
    authorRole: 'NURSE',
    authorDepartment: 'Cath Lab Recovery / Telemetry',
    noteType: 'NURSE_ASSESSMENT',
    title: "Post-Angiography Recovery & Radial Band Protocol",
    timestamp: '2026-08-31T08:15:00Z',
    status: 'SIGNED_FINAL',
    content: {
      subjective: 'Patient reports mild tenderness at right wrist insertion site (1/10). No numbness or tingling in fingers.',
      objective: {
        vitals: 'BP 122/76 mmHg | HR 66 bpm | SpO2 98% RA',
        physicalExam: 'Right radial TR-band deflated gradually per protocol. Puncture site dry with no bleeding, swelling, or hematoma. Capillary refill < 2 seconds in all 5 digits. Radial pulse 2+ palpable.',
        recentLabs: 'Telemetry shows sinus rhythm with normal PR and QTc intervals.'
      },
      assessment: 'Smooth recovery post-procedure. Radial hemostasis fully achieved.',
      plan: '1. Apply light sterile adhesive dressing.\n2. Provide discharge instructions on radial site care.\n3. Review medication schedule with patient.',
      keyRecommendations: ['Keep right wrist dry for 24 hours', 'Notify nurse immediately if wrist swells or bleeds']
    },
    tags: ['Nursing', 'Post-Procedure', 'Radial Hemostasis'],
    signatureHash: 'sha256:ff1234567890abcdef1234567890abcdef1'
  }
];

// In-memory store of team notes (supports adding newly drafted/signed notes during session)
let ALL_TEAM_NOTES: ClinicalTeamNote[] = [...INITIAL_TEAM_NOTES];

export function getTeamNotesForPatient(patientId?: string): ClinicalTeamNote[] {
  if (!patientId) return ALL_TEAM_NOTES;
  // Match by exact ID or normalize (e.g. PT-1002 vs pat-1)
  const normalizedId = patientId.toLowerCase();
  const directMatches = ALL_TEAM_NOTES.filter(n => 
    n.patientId.toLowerCase() === normalizedId ||
    (normalizedId === 'pat-1' && n.patientId === 'PT-1002') ||
    (normalizedId === 'pat-2' && n.patientId === 'PT-1001') ||
    (normalizedId === 'pat-3' && n.patientId === 'PT-1003') ||
    (normalizedId === 'pat-4' && n.patientId === 'PT-1004') ||
    (normalizedId === 'pat-5' && n.patientId === 'PT-1005') ||
    (normalizedId === 'pat-6' && n.patientId === 'PT-1006') ||
    (normalizedId === 'pt-1002' && n.patientId === 'pat-1') ||
    (normalizedId === 'pt-1001' && n.patientId === 'pat-2')
  );

  if (directMatches.length > 0) return directMatches;

  // If specific patient doesn't have custom notes yet, provide standard patient-adapted team notes
  return ALL_TEAM_NOTES.filter(n => n.patientId === 'PT-1002');
}

export function addTeamNote(note: ClinicalTeamNote): void {
  ALL_TEAM_NOTES.unshift(note);
}

export function getAllTeamNotes(): ClinicalTeamNote[] {
  return ALL_TEAM_NOTES;
}

export function getRoleBadgeStyle(role: UserRole): { bg: string; text: string; border: string; label: string } {
  switch (role) {
    case 'DOCTOR':
    case 'PHYSICIAN':
    case 'CLINICIAN':
      return { bg: 'bg-blue-500/15', text: 'text-blue-300', border: 'border-blue-500/30', label: 'Doctor / Attending' };
    case 'NURSE':
      return { bg: 'bg-emerald-500/15', text: 'text-emerald-300', border: 'border-emerald-500/30', label: 'Registered Nurse' };
    case 'SPECIALIST':
      return { bg: 'bg-purple-500/15', text: 'text-purple-300', border: 'border-purple-500/30', label: 'Cardiology Specialist' };
    case 'CARE_COORDINATOR':
      return { bg: 'bg-amber-500/15', text: 'text-amber-300', border: 'border-amber-500/30', label: 'Care Coordinator' };
    case 'ADMINISTRATOR':
      return { bg: 'bg-rose-500/15', text: 'text-rose-300', border: 'border-rose-500/30', label: 'Hospital Administrator' };
    case 'PORTAL_ADMIN':
      return { bg: 'bg-cyan-500/15', text: 'text-cyan-300', border: 'border-cyan-500/30', label: 'Portal Admin / Security' };
    case 'AUDITOR':
      return { bg: 'bg-indigo-500/15', text: 'text-indigo-300', border: 'border-indigo-500/30', label: 'Clinical Auditor' };
    default:
      return { bg: 'bg-slate-500/15', text: 'text-slate-300', border: 'border-slate-500/30', label: 'Clinician' };
  }
}

export function getDraftNoteButtonLabel(role: UserRole): string {
  switch (role) {
    case 'DOCTOR':
    case 'PHYSICIAN':
    case 'CLINICIAN':
      return "Draft Doctors Note";
    case 'NURSE':
      return "Draft Nurses Note";
    case 'SPECIALIST':
      return "Draft Specialist Note";
    case 'CARE_COORDINATOR':
      return "Draft Care Coordinator Note";
    case 'ADMINISTRATOR':
      return "Draft Administrator Note";
    case 'PORTAL_ADMIN':
      return "Draft Portal Admin Note";
    case 'AUDITOR':
      return "Draft Auditor Note";
    default:
      return "Draft Clinical Note";
  }
}

export const SYNTHETIC_TEAM_NOTES = INITIAL_TEAM_NOTES;
