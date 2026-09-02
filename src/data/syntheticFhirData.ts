import { SyntheticPatient } from '../types';

export const SYNTHETIC_PATIENTS: SyntheticPatient[] = [
  {
    id: 'PT-1000',
    mrn: '1000123',
    uprId: 'UPR-2024-CITY-1000123',
    fullName: 'John Doe',
    birthDate: '1979-05-18',
    age: 45,
    gender: 'MALE',
    assignedPhysicianId: 'usr-doc-01',
    hospitalSite: 'City Hospital – Main Campus',
    roomBed: 'Cardiology 2E - Bed 214',
    consentStatus: 'ACTIVE_CONSENT',
    provenance: {
      sourceSystem: 'Epic Systems EHR / FHIR Bridge R4',
      ingestionTimestamp: '2024-05-12T14:30:00Z',
      recordedBy: 'Dr. Sarah Johnson, MD',
      verificationStatus: 'VERIFIED',
      checksum: 'sha256-jd1000123a',
    },
    completenessAlerts: [],
    conditions: [
      {
        id: 'COND-101',
        code: 'I25.10',
        name: 'Atherosclerotic heart disease of native coronary artery',
        category: 'CHRONIC',
        onsetDate: '2021-03-10',
        clinicalStatus: 'ACTIVE',
        severity: 'MODERATE',
      },
      {
        id: 'COND-102',
        code: 'I10',
        name: 'Essential primary hypertension',
        category: 'CHRONIC',
        onsetDate: '2019-08-14',
        clinicalStatus: 'ACTIVE',
        severity: 'MODERATE',
      }
    ],
    medications: [
      {
        id: 'MED-101',
        code: 'RX-1001',
        name: 'Atorvastatin',
        dosage: '40 mg',
        route: 'Oral',
        frequency: 'Once daily at bedtime',
        status: 'ACTIVE',
        prescribedDate: '2024-02-10',
        prescribingProvider: 'Dr. Sarah Johnson, MD',
        indications: 'Hyperlipidemia & secondary coronary prevention',
      },
      {
        id: 'MED-102',
        code: 'RX-1002',
        name: 'Metoprolol Succinate',
        dosage: '50 mg',
        route: 'Oral',
        frequency: 'Daily in morning',
        status: 'ACTIVE',
        prescribedDate: '2024-03-01',
        prescribingProvider: 'Dr. Sarah Johnson, MD',
        indications: 'Rate control and cardioprotection',
      }
    ],
    allergies: [
      {
        id: 'ALG-101',
        substance: 'Penicillin G',
        category: 'MEDICATION',
        severity: 'SEVERE',
        reaction: 'Urticaria & facial angioedema',
        status: 'ACTIVE',
        recordedDate: '2023-04-10',
      }
    ],
    observations: [
      {
        id: 'LAB-101',
        code: '2093-3',
        name: 'Total Cholesterol',
        value: 172,
        unit: 'mg/dL',
        referenceRange: '< 200 mg/dL',
        status: 'NORMAL',
        effectiveDateTime: '2024-05-12T09:00:00Z',
        trend: [210, 195, 184, 172],
        provenance: {
          sourceSystem: 'Central Clinical Chemistry Lab',
          ingestionTimestamp: '2024-05-12T10:00:00Z',
          recordedBy: 'Clinical Chemistry Analyzer',
          verificationStatus: 'VERIFIED',
          checksum: 'sha256-chol101',
        }
      },
      {
        id: 'LAB-102',
        code: '8480-6',
        name: 'Systolic Blood Pressure',
        value: 124,
        unit: 'mmHg',
        referenceRange: '90 - 120 mmHg',
        status: 'NORMAL',
        effectiveDateTime: '2024-05-12T09:00:00Z',
        trend: [138, 132, 128, 124],
        provenance: {
          sourceSystem: 'Bedside Vitals Monitor',
          ingestionTimestamp: '2024-05-12T09:05:00Z',
          recordedBy: 'Jennifer Walsh, RN',
          verificationStatus: 'VERIFIED',
          checksum: 'sha256-bp101',
        }
      }
    ],
    encounters: [
      {
        id: 'ENC-101',
        type: 'OUTPATIENT',
        admissionDate: '2024-05-12T09:30:00Z',
        dischargeDate: '2024-05-12T10:45:00Z',
        department: 'Cardiology Clinic',
        attendingPhysician: 'Dr. Sarah Johnson, MD',
        chiefComplaint: 'Routine 6-month coronary artery disease follow-up. Patient reports good exercise tolerance.',
      }
    ]
  },
  {
    id: 'PT-1001',
    mrn: '1000134',
    uprId: 'UPR-2024-CITY-1000134',
    fullName: 'Jane Smith',
    birthDate: '1962-09-04',
    age: 62,
    gender: 'FEMALE',
    assignedPhysicianId: 'usr-doc-01',
    hospitalSite: 'City Hospital – Main Campus',
    roomBed: 'Internal Medicine 3W - Bed 308',
    consentStatus: 'ACTIVE_CONSENT',
    provenance: {
      sourceSystem: 'Cerner EHR / FHIR Bridge R4',
      ingestionTimestamp: '2024-05-11T16:00:00Z',
      recordedBy: 'Dr. Sarah Johnson, MD',
      verificationStatus: 'VERIFIED',
      checksum: 'sha256-js1000134b',
    },
    completenessAlerts: [],
    conditions: [
      {
        id: 'COND-111',
        code: 'E11.9',
        name: 'Type 2 diabetes mellitus without complications',
        category: 'CHRONIC',
        onsetDate: '2017-11-20',
        clinicalStatus: 'ACTIVE',
        severity: 'MODERATE',
      },
      {
        id: 'COND-112',
        code: 'M17.11',
        name: 'Primary osteoarthritis of right knee',
        category: 'CHRONIC',
        onsetDate: '2020-04-15',
        clinicalStatus: 'ACTIVE',
        severity: 'MILD',
      }
    ],
    medications: [
      {
        id: 'MED-111',
        code: 'RX-1011',
        name: 'Metformin Hydrochloride',
        dosage: '1000 mg',
        route: 'Oral',
        frequency: 'Twice daily with meals',
        status: 'ACTIVE',
        prescribedDate: '2024-01-18',
        prescribingProvider: 'Dr. Sarah Johnson, MD',
        indications: 'Glycemic control in Type 2 DM',
      }
    ],
    allergies: [],
    observations: [
      {
        id: 'LAB-111',
        code: '4548-4',
        name: 'Hemoglobin A1c',
        value: 6.8,
        unit: '%',
        referenceRange: '< 5.7 %',
        status: 'ABNORMAL_HIGH',
        effectiveDateTime: '2024-05-11T10:00:00Z',
        trend: [7.4, 7.1, 6.9, 6.8],
        provenance: {
          sourceSystem: 'Clinical Pathology Core',
          ingestionTimestamp: '2024-05-11T11:00:00Z',
          recordedBy: 'Automated Analyzer',
          verificationStatus: 'VERIFIED',
          checksum: 'sha256-a1c111',
        }
      }
    ],
    encounters: [
      {
        id: 'ENC-111',
        type: 'OUTPATIENT',
        admissionDate: '2024-05-11T11:00:00Z',
        dischargeDate: '2024-05-11T11:50:00Z',
        department: 'Endocrinology & Primary Care',
        attendingPhysician: 'Dr. Sarah Johnson, MD',
        chiefComplaint: 'Quarterly diabetic wellness review. HbA1c improved to 6.8%.',
      }
    ]
  },
  {
    id: 'PT-1004B',
    mrn: '1000105',
    uprId: 'UPR-2024-CITY-1000105',
    fullName: 'Robert Brown',
    birthDate: '1966-01-22',
    age: 58,
    gender: 'MALE',
    assignedPhysicianId: 'usr-doc-01',
    hospitalSite: 'City Hospital – Main Campus',
    roomBed: 'Pulmonary Observation - Bed 102',
    consentStatus: 'ACTIVE_CONSENT',
    provenance: {
      sourceSystem: 'Epic Systems EHR / FHIR Bridge R4',
      ingestionTimestamp: '2024-05-10T11:20:00Z',
      recordedBy: 'Dr. Gregory Ross, MD',
      verificationStatus: 'VERIFIED',
      checksum: 'sha256-rb1000105c',
    },
    completenessAlerts: [],
    conditions: [
      {
        id: 'COND-121',
        code: 'J44.9',
        name: 'Chronic obstructive pulmonary disease, unspecified',
        category: 'CHRONIC',
        onsetDate: '2021-06-08',
        clinicalStatus: 'ACTIVE',
        severity: 'MODERATE',
      }
    ],
    medications: [
      {
        id: 'MED-121',
        code: 'RX-1021',
        name: 'Tiotropium Bromide (Spiriva Respimat)',
        dosage: '2.5 mcg/actuation',
        route: 'Inhalation',
        frequency: '2 inhalations once daily',
        status: 'ACTIVE',
        prescribedDate: '2024-02-28',
        prescribingProvider: 'Dr. Gregory Ross, MD',
        indications: 'Long-term bronchodilation in COPD',
      }
    ],
    allergies: [
      {
        id: 'ALG-121',
        substance: 'Sulfa Antibiotics',
        category: 'MEDICATION',
        severity: 'MODERATE',
        reaction: 'Diffuse maculopapular rash',
        status: 'ACTIVE',
        recordedDate: '2022-09-15',
      }
    ],
    observations: [
      {
        id: 'LAB-121',
        code: '2708-6',
        name: 'Oxygen Saturation (SpO2)',
        value: 95,
        unit: '%',
        referenceRange: '95 - 100 %',
        status: 'NORMAL',
        effectiveDateTime: '2024-05-10T08:30:00Z',
        trend: [91, 93, 94, 95],
        provenance: {
          sourceSystem: 'Pulse Oximeter Hub',
          ingestionTimestamp: '2024-05-10T08:35:00Z',
          recordedBy: 'Respiratory Therapy Team',
          verificationStatus: 'VERIFIED',
          checksum: 'sha256-spo2121',
        }
      }
    ],
    encounters: [
      {
        id: 'ENC-121',
        type: 'OUTPATIENT',
        admissionDate: '2024-05-10T14:15:00Z',
        dischargeDate: '2024-05-10T15:00:00Z',
        department: 'Pulmonary Care Clinic',
        attendingPhysician: 'Dr. Gregory Ross, MD',
        chiefComplaint: 'Post-exacerbation checkup; lung sounds clear bilaterally, SpO2 stable on room air.',
      }
    ]
  },
  {
    id: 'PT-1002',
    mrn: 'MRN-884920',
    uprId: 'UPR-2026-STJ-884920',
    fullName: 'Elena Rostova',
    birthDate: '1959-04-12',
    age: 67,
    gender: 'FEMALE',
    assignedPhysicianId: 'usr-doc-01',
    hospitalSite: 'Metro St. Jude Academic Medical Center',
    roomBed: 'Cardiology 4W - Bed 412',
    consentStatus: 'ACTIVE_CONSENT',
    provenance: {
      sourceSystem: 'Epic EHR / Metro St. Jude FHIR Bridge',
      ingestionTimestamp: '2026-08-25T14:30:00Z',
      recordedBy: 'Dr. Sarah Chen, MD',
      verificationStatus: 'VERIFIED',
      checksum: 'sha256-8f92a10b47e2c91d8f1e4b',
    },
    completenessAlerts: [
      {
        id: 'CA-101',
        field: 'Observation.eGFR',
        severity: 'INFO',
        message: 'eGFR tested 14 days ago; recommended recheck before initiating SGLT2i',
        detectedAt: '2026-08-25T14:30:00Z',
      }
    ],
    conditions: [
      {
        id: 'COND-201',
        code: 'I50.32',
        name: 'Chronic diastolic heart failure (HFpEF) with NYHA Class III',
        category: 'CHRONIC',
        onsetDate: '2022-03-15',
        clinicalStatus: 'ACTIVE',
        severity: 'SEVERE',
      },
      {
        id: 'COND-202',
        code: 'E11.22',
        name: 'Type 2 Diabetes Mellitus with diabetic chronic kidney disease Stage 3a',
        category: 'CHRONIC',
        onsetDate: '2018-09-20',
        clinicalStatus: 'ACTIVE',
        severity: 'MODERATE',
      },
      {
        id: 'COND-203',
        code: 'I10',
        name: 'Essential primary hypertension',
        category: 'CHRONIC',
        onsetDate: '2015-06-11',
        clinicalStatus: 'ACTIVE',
        severity: 'MODERATE',
      }
    ],
    medications: [
      {
        id: 'MED-301',
        code: 'RX-7382',
        name: 'Empagliflozin (Jardiance)',
        dosage: '10 mg',
        route: 'Oral',
        frequency: 'Daily in morning',
        status: 'ACTIVE',
        prescribedDate: '2025-11-04',
        prescribingProvider: 'Dr. Sarah Chen, MD',
        indications: 'Cardioprotection & glycemic control',
      },
      {
        id: 'MED-302',
        code: 'RX-1928',
        name: 'Sacubitril / Valsartan (Entresto)',
        dosage: '24/26 mg',
        route: 'Oral',
        frequency: 'Twice daily',
        status: 'ACTIVE',
        prescribedDate: '2026-01-15',
        prescribingProvider: 'Dr. Sarah Chen, MD',
        indications: 'Heart failure with reduced/preserved ejection fraction',
      },
      {
        id: 'MED-303',
        code: 'RX-4491',
        name: 'Furosemide (Lasix)',
        dosage: '40 mg',
        route: 'Oral',
        frequency: 'Daily',
        status: 'ACTIVE',
        prescribedDate: '2026-02-10',
        prescribingProvider: 'Dr. Sarah Chen, MD',
        indications: 'Fluid retention & edema management',
      }
    ],
    allergies: [
      {
        id: 'ALG-401',
        substance: 'Lisinopril (ACE Inhibitors)',
        category: 'MEDICATION',
        severity: 'SEVERE',
        reaction: 'Angioedema & acute laryngeal edema',
        status: 'ACTIVE',
        recordedDate: '2021-08-19',
      }
    ],
    observations: [
      {
        id: 'LAB-501',
        code: '33914-3',
        name: 'NT-proBNP (B-Type Natriuretic Peptide)',
        value: 2450,
        unit: 'pg/mL',
        referenceRange: '< 300 pg/mL',
        status: 'ABNORMAL_HIGH',
        effectiveDateTime: '2026-08-24T08:15:00Z',
        trend: [1420, 1680, 2100, 2800, 2450],
        provenance: {
          sourceSystem: 'Quest Clinical LIS',
          ingestionTimestamp: '2026-08-24T10:00:00Z',
          recordedBy: 'Automated Analyzer Roche Cobas',
          verificationStatus: 'VERIFIED',
          checksum: 'sha256-b827f',
        }
      },
      {
        id: 'LAB-502',
        code: '33914-9',
        name: 'eGFR (Estimated Glomerular Filtration Rate)',
        value: 38,
        unit: 'mL/min/1.73m2',
        referenceRange: '> 60 mL/min/1.73m2',
        status: 'ABNORMAL_LOW',
        effectiveDateTime: '2026-08-24T08:15:00Z',
        trend: [48, 44, 42, 36, 38],
        provenance: {
          sourceSystem: 'Quest Clinical LIS',
          ingestionTimestamp: '2026-08-24T10:00:00Z',
          recordedBy: 'Automated Analyzer',
          verificationStatus: 'VERIFIED',
          checksum: 'sha256-c771a',
        }
      },
      {
        id: 'LAB-503',
        code: '4548-4',
        name: 'Hemoglobin A1c (HbA1c)',
        value: 7.4,
        unit: '%',
        referenceRange: '< 5.7 %',
        status: 'ABNORMAL_HIGH',
        effectiveDateTime: '2026-08-24T08:15:00Z',
        trend: [8.1, 7.9, 7.6, 7.5, 7.4],
        provenance: {
          sourceSystem: 'Quest Clinical LIS',
          ingestionTimestamp: '2026-08-24T10:00:00Z',
          recordedBy: 'Automated Analyzer',
          verificationStatus: 'VERIFIED',
          checksum: 'sha256-a991b',
        }
      },
      {
        id: 'LAB-504',
        code: '2823-3',
        name: 'Serum Potassium (K+)',
        value: 4.8,
        unit: 'mmol/L',
        referenceRange: '3.5 - 5.1 mmol/L',
        status: 'NORMAL',
        effectiveDateTime: '2026-08-24T08:15:00Z',
        trend: [4.4, 4.6, 4.7, 4.9, 4.8],
        provenance: {
          sourceSystem: 'Quest Clinical LIS',
          ingestionTimestamp: '2026-08-24T10:00:00Z',
          recordedBy: 'Automated Analyzer',
          verificationStatus: 'VERIFIED',
          checksum: 'sha256-k882c',
        }
      }
    ],
    encounters: [
      {
        id: 'ENC-601',
        type: 'INPATIENT',
        admissionDate: '2026-08-23T06:40:00Z',
        department: 'Cardiovascular Inpatient Unit',
        attendingPhysician: 'Dr. Sarah Chen, MD',
        chiefComplaint: 'Worsening dyspnea on exertion and bilateral lower extremity edema (2+ pitting)',
        dischargeSummaryNote: 'Patient admitted for acute decompensated heart failure exacerbation on background of HFpEF. Responded well to IV diuresis.',
      },
      {
        id: 'ENC-602',
        type: 'OUTPATIENT',
        admissionDate: '2026-06-14T10:00:00Z',
        dischargeDate: '2026-06-14T11:15:00Z',
        department: 'Heart Failure Specialty Clinic',
        attendingPhysician: 'Dr. Sarah Chen, MD',
        chiefComplaint: 'Routine 3-month follow-up for chronic HF management',
      }
    ]
  },
  {
    id: 'PT-1003',
    mrn: 'MRN-912044',
    uprId: 'UPR-2026-STJ-912044',
    fullName: 'Marcus Vance',
    birthDate: '1978-11-23',
    age: 47,
    gender: 'MALE',
    assignedPhysicianId: 'usr-doc-01',
    hospitalSite: 'Metro St. Jude Academic Medical Center',
    roomBed: 'Pulmonology Step-Down - Bed 204',
    consentStatus: 'ACTIVE_CONSENT',
    provenance: {
      sourceSystem: 'Epic EHR',
      ingestionTimestamp: '2026-08-25T11:00:00Z',
      recordedBy: 'Dr. James Wilson, MD',
      verificationStatus: 'VERIFIED',
      checksum: 'sha256-4b8c9d',
    },
    completenessAlerts: [],
    conditions: [
      {
        id: 'COND-211',
        code: 'J44.1',
        name: 'Chronic Obstructive Pulmonary Disease with acute exacerbation',
        category: 'ACUTE',
        onsetDate: '2026-08-21',
        clinicalStatus: 'ACTIVE',
        severity: 'SEVERE',
      },
      {
        id: 'COND-212',
        code: 'J45.901',
        name: 'Severe persistent asthma with acute exacerbation',
        category: 'CHRONIC',
        onsetDate: '2010-04-12',
        clinicalStatus: 'ACTIVE',
        severity: 'MODERATE',
      }
    ],
    medications: [
      {
        id: 'MED-311',
        code: 'RX-5512',
        name: 'Fluticasone / Vilanterol (Breo Ellipta)',
        dosage: '100/25 mcg',
        route: 'Inhalation',
        frequency: '1 puff daily',
        status: 'ACTIVE',
        prescribedDate: '2026-08-22',
        prescribingProvider: 'Dr. James Wilson, MD',
        indications: 'COPD maintenance therapy',
      },
      {
        id: 'MED-312',
        code: 'RX-8841',
        name: 'Prednisone',
        dosage: '40 mg',
        route: 'Oral',
        frequency: 'Daily (5-day taper)',
        status: 'ACTIVE',
        prescribedDate: '2026-08-22',
        prescribingProvider: 'Dr. James Wilson, MD',
        indications: 'Acute COPD flare mitigation',
      }
    ],
    allergies: [
      {
        id: 'ALG-411',
        substance: 'Penicillin G / Amoxicillin',
        category: 'MEDICATION',
        severity: 'SEVERE',
        reaction: 'Urticaria & systemic anaphylaxis',
        status: 'ACTIVE',
        recordedDate: '2014-02-18',
      }
    ],
    observations: [
      {
        id: 'LAB-511',
        code: '2708-6',
        name: 'Oxygen Saturation (SpO2 on Room Air)',
        value: 91,
        unit: '%',
        referenceRange: '95 - 100 %',
        status: 'ABNORMAL_LOW',
        effectiveDateTime: '2026-08-26T06:00:00Z',
        trend: [88, 89, 90, 93, 91],
        provenance: {
          sourceSystem: 'Philips IntelliVue Telemetry',
          ingestionTimestamp: '2026-08-26T06:05:00Z',
          recordedBy: 'Staff Nurse Jennifer, RN',
          verificationStatus: 'VERIFIED',
          checksum: 'sha256-sp881',
        }
      }
    ],
    encounters: [
      {
        id: 'ENC-611',
        type: 'INPATIENT',
        admissionDate: '2026-08-21T22:15:00Z',
        department: 'Pulmonary Medicine Inpatient',
        attendingPhysician: 'Dr. James Wilson, MD',
        chiefComplaint: 'Acute onset of productive cough, wheezing, and hypoxemia',
      }
    ]
  },
  {
    id: 'PT-1004',
    mrn: 'MRN-773199',
    uprId: 'UPR-2026-NRH-773199',
    fullName: 'Sarah Jenkins',
    birthDate: '1984-07-30',
    age: 42,
    gender: 'FEMALE',
    assignedPhysicianId: 'usr-doc-02', // Assigned to Dr. Emily Vance (used for Break-It unauthorized access test)
    hospitalSite: 'North River Community Hospital',
    roomBed: 'Post-Op Surgical - Bed 108',
    consentStatus: 'RESTRICTED_RESEARCH',
    provenance: {
      sourceSystem: 'Cerner Millennium',
      ingestionTimestamp: '2026-08-24T09:10:00Z',
      recordedBy: 'Dr. Emily Vance, MD',
      verificationStatus: 'VERIFIED',
      checksum: 'sha256-cn993',
    },
    completenessAlerts: [],
    conditions: [
      {
        id: 'COND-221',
        code: 'K80.00',
        name: 'Calculus of gallbladder with acute cholecystitis',
        category: 'ACUTE',
        onsetDate: '2026-08-23',
        clinicalStatus: 'ACTIVE',
        severity: 'SEVERE',
      }
    ],
    medications: [
      {
        id: 'MED-321',
        code: 'RX-9912',
        name: 'Cefazolin',
        dosage: '2 g',
        route: 'Intravenous',
        frequency: 'Every 8 hours',
        status: 'ACTIVE',
        prescribedDate: '2026-08-23',
        prescribingProvider: 'Dr. Emily Vance, MD',
        indications: 'Post-operative surgical prophylaxis',
      }
    ],
    allergies: [],
    observations: [
      {
        id: 'LAB-521',
        code: '6690-2',
        name: 'White Blood Cell Count (WBC)',
        value: 13.8,
        unit: 'x10^3/uL',
        referenceRange: '4.5 - 11.0 x10^3/uL',
        status: 'ABNORMAL_HIGH',
        effectiveDateTime: '2026-08-25T07:00:00Z',
        trend: [18.2, 16.5, 14.8, 13.8],
        provenance: {
          sourceSystem: 'Hospital Central Lab',
          ingestionTimestamp: '2026-08-25T08:00:00Z',
          recordedBy: 'Hematology Analyzer',
          verificationStatus: 'VERIFIED',
          checksum: 'sha256-wbc99',
        }
      }
    ],
    encounters: [
      {
        id: 'ENC-621',
        type: 'INPATIENT',
        admissionDate: '2026-08-23T14:00:00Z',
        department: 'General Surgery',
        attendingPhysician: 'Dr. Emily Vance, MD',
        chiefComplaint: 'Severe right upper quadrant abdominal pain radiating to scapula',
      }
    ]
  },
  {
    id: 'PT-1005',
    mrn: 'MRN-449102',
    uprId: 'UPR-2026-STJ-449102',
    fullName: 'Arthur Pendelton',
    birthDate: '1948-02-14',
    age: 78,
    gender: 'MALE',
    assignedPhysicianId: 'usr-doc-01',
    hospitalSite: 'Metro St. Jude Academic Medical Center',
    roomBed: 'Geriatric Intermediate - Bed 302',
    consentStatus: 'ACTIVE_CONSENT',
    provenance: {
      sourceSystem: 'Epic EHR',
      ingestionTimestamp: '2026-08-25T16:00:00Z',
      recordedBy: 'Dr. Sarah Chen, MD',
      verificationStatus: 'VERIFIED',
      checksum: 'sha256-arthur77',
    },
    completenessAlerts: [
      {
        id: 'CA-102',
        field: 'MedicationRequest.Dosage',
        severity: 'CRITICAL',
        message: 'Duplicate active anticoagulation records detected (Apixaban + Warfarin flagged for clinical review)',
        detectedAt: '2026-08-25T16:00:00Z',
      }
    ],
    conditions: [
      {
        id: 'COND-231',
        code: 'I48.0',
        name: 'Paroxysmal Atrial Fibrillation (CHA2DS2-VASc = 4)',
        category: 'CHRONIC',
        onsetDate: '2019-11-05',
        clinicalStatus: 'ACTIVE',
        severity: 'MODERATE',
      },
      {
        id: 'COND-232',
        code: 'N18.32',
        name: 'Chronic Kidney Disease, Stage 3b (eGFR 32)',
        category: 'CHRONIC',
        onsetDate: '2021-04-18',
        clinicalStatus: 'ACTIVE',
        severity: 'MODERATE',
      }
    ],
    medications: [
      {
        id: 'MED-331',
        code: 'RX-2201',
        name: 'Apixaban (Eliquis)',
        dosage: '2.5 mg',
        route: 'Oral',
        frequency: 'Twice daily',
        status: 'ACTIVE',
        prescribedDate: '2026-01-10',
        prescribingProvider: 'Dr. Sarah Chen, MD',
        indications: 'Thromboembolism prophylaxis for Non-valvular Atrial Fibrillation',
      },
      {
        id: 'MED-332',
        code: 'RX-2202',
        name: 'Warfarin Sodium',
        dosage: '5 mg',
        route: 'Oral',
        frequency: 'Daily (Flagged: Historical Overlap)',
        status: 'HELD',
        prescribedDate: '2023-04-10',
        prescribingProvider: 'Prior PCP',
        indications: 'Anticoagulation - Held upon transition to Eliquis',
      }
    ],
    allergies: [
      {
        id: 'ALG-431',
        substance: 'Sulfa Antibiotics',
        category: 'MEDICATION',
        severity: 'MODERATE',
        reaction: 'Maculopapular rash & pruritus',
        status: 'ACTIVE',
        recordedDate: '2017-09-12',
      }
    ],
    observations: [
      {
        id: 'LAB-531',
        code: '2160-0',
        name: 'Serum Creatinine',
        value: 1.85,
        unit: 'mg/dL',
        referenceRange: '0.7 - 1.3 mg/dL',
        status: 'ABNORMAL_HIGH',
        effectiveDateTime: '2026-08-25T09:30:00Z',
        trend: [1.6, 1.7, 1.8, 1.9, 1.85],
        provenance: {
          sourceSystem: 'Central Chem Lab',
          ingestionTimestamp: '2026-08-25T10:00:00Z',
          recordedBy: 'Analyzer',
          verificationStatus: 'VERIFIED',
          checksum: 'sha256-creat88',
        }
      }
    ],
    encounters: [
      {
        id: 'ENC-631',
        type: 'INPATIENT',
        admissionDate: '2026-08-24T18:00:00Z',
        department: 'Geriatric Medicine',
        attendingPhysician: 'Dr. Sarah Chen, MD',
        chiefComplaint: 'Palpitations, lightheadedness, and elevated resting heart rate (118 bpm)',
      }
    ]
  },
  {
    id: 'PT-1006',
    mrn: 'MRN-338291',
    uprId: 'UPR-2026-MGH-338291',
    fullName: 'Aaliyah Khan',
    birthDate: '1995-09-18',
    age: 30,
    gender: 'FEMALE',
    assignedPhysicianId: 'usr-doc-01',
    hospitalSite: 'Metro St. Jude Academic Medical Center',
    consentStatus: 'ACTIVE_CONSENT',
    provenance: {
      sourceSystem: 'Epic Ambulatory',
      ingestionTimestamp: '2026-08-20T14:00:00Z',
      recordedBy: 'Dr. Sarah Chen, MD',
      verificationStatus: 'VERIFIED',
      checksum: 'sha256-aaliyah99',
    },
    completenessAlerts: [],
    conditions: [
      {
        id: 'COND-241',
        code: 'E03.9',
        name: 'Hypothyroidism, unspecified',
        category: 'CHRONIC',
        onsetDate: '2020-01-14',
        clinicalStatus: 'ACTIVE',
        severity: 'MILD',
      }
    ],
    medications: [
      {
        id: 'MED-341',
        code: 'RX-7711',
        name: 'Levothyroxine Sodium',
        dosage: '75 mcg',
        route: 'Oral',
        frequency: 'Daily 30 min before breakfast',
        status: 'ACTIVE',
        prescribedDate: '2024-03-10',
        prescribingProvider: 'Dr. Sarah Chen, MD',
        indications: 'Thyroid hormone replacement',
      }
    ],
    allergies: [],
    observations: [
      {
        id: 'LAB-541',
        code: '3016-3',
        name: 'Thyroid Stimulating Hormone (TSH)',
        value: 2.1,
        unit: 'uIU/mL',
        referenceRange: '0.4 - 4.0 uIU/mL',
        status: 'NORMAL',
        effectiveDateTime: '2026-08-15T08:00:00Z',
        trend: [4.8, 3.2, 2.5, 2.1],
        provenance: {
          sourceSystem: 'Quest LIS',
          ingestionTimestamp: '2026-08-15T09:00:00Z',
          recordedBy: 'Analyzer',
          verificationStatus: 'VERIFIED',
          checksum: 'sha256-tsh11',
        }
      }
    ],
    encounters: [
      {
        id: 'ENC-641',
        type: 'OUTPATIENT',
        admissionDate: '2026-08-15T09:00:00Z',
        dischargeDate: '2026-08-15T09:45:00Z',
        department: 'Endocrinology Clinic',
        attendingPhysician: 'Dr. Sarah Chen, MD',
        chiefComplaint: 'Annual wellness and thyroid panel review',
      }
    ]
  },
  {
    id: 'PT-1007',
    mrn: 'MRN-662819',
    uprId: 'UPR-2026-STJ-662819',
    fullName: 'Mateo Morales',
    birthDate: '1965-03-08',
    age: 61,
    gender: 'MALE',
    assignedPhysicianId: 'usr-doc-01',
    hospitalSite: 'Metro St. Jude Academic Medical Center',
    consentStatus: 'ACTIVE_CONSENT',
    provenance: {
      sourceSystem: 'Epic EHR',
      ingestionTimestamp: '2026-08-22T10:00:00Z',
      recordedBy: 'Dr. Sarah Chen, MD',
      verificationStatus: 'VERIFIED',
      checksum: 'sha256-mateo88',
    },
    completenessAlerts: [],
    conditions: [
      {
        id: 'COND-251',
        code: 'I25.10',
        name: 'Atherosclerotic heart disease of native coronary artery',
        category: 'CHRONIC',
        onsetDate: '2019-05-12',
        clinicalStatus: 'ACTIVE',
        severity: 'MODERATE',
      }
    ],
    medications: [
      {
        id: 'MED-351',
        code: 'RX-1192',
        name: 'Atorvastatin Calcium',
        dosage: '80 mg',
        route: 'Oral',
        frequency: 'Nightly',
        status: 'ACTIVE',
        prescribedDate: '2025-06-01',
        prescribingProvider: 'Dr. Sarah Chen, MD',
        indications: 'High-intensity lipid lowering',
      }
    ],
    allergies: [],
    observations: [
      {
        id: 'LAB-551',
        code: '13457-7',
        name: 'LDL Cholesterol',
        value: 58,
        unit: 'mg/dL',
        referenceRange: '< 70 mg/dL (High Risk Target)',
        status: 'NORMAL',
        effectiveDateTime: '2026-08-10T08:00:00Z',
        trend: [112, 88, 72, 58],
        provenance: {
          sourceSystem: 'Quest LIS',
          ingestionTimestamp: '2026-08-10T10:00:00Z',
          recordedBy: 'Analyzer',
          verificationStatus: 'VERIFIED',
          checksum: 'sha256-ldl58',
        }
      }
    ],
    encounters: []
  },
  {
    id: 'PT-1008',
    mrn: 'MRN-551982',
    uprId: 'UPR-2026-VMH-551982',
    fullName: 'Chloe Zhang',
    birthDate: '2001-12-05',
    age: 24,
    gender: 'FEMALE',
    assignedPhysicianId: 'usr-doc-01',
    hospitalSite: 'Metro St. Jude Academic Medical Center',
    consentStatus: 'ACTIVE_CONSENT',
    provenance: {
      sourceSystem: 'Epic EHR',
      ingestionTimestamp: '2026-08-18T11:00:00Z',
      recordedBy: 'Dr. Sarah Chen, MD',
      verificationStatus: 'VERIFIED',
      checksum: 'sha256-chloe22',
    },
    completenessAlerts: [],
    conditions: [
      {
        id: 'COND-261',
        code: 'K50.90',
        name: "Crohn's disease, unspecified",
        category: 'CHRONIC',
        onsetDate: '2023-08-14',
        clinicalStatus: 'ACTIVE',
        severity: 'MODERATE',
      }
    ],
    medications: [
      {
        id: 'MED-361',
        code: 'RX-9901',
        name: 'Adalimumab (Humira)',
        dosage: '40 mg / 0.8 mL',
        route: 'Subcutaneous',
        frequency: 'Every 14 days',
        status: 'ACTIVE',
        prescribedDate: '2024-01-20',
        prescribingProvider: 'Dr. Sarah Chen, MD',
        indications: 'TNF-alpha biologic suppression for IBD',
      }
    ],
    allergies: [],
    observations: [],
    encounters: []
  },
  {
    id: 'PT-1009',
    mrn: 'MRN-774921',
    uprId: 'UPR-2026-NRH-774921',
    fullName: 'Darnell Washington',
    birthDate: '1970-05-19',
    age: 56,
    gender: 'MALE',
    assignedPhysicianId: 'usr-doc-01',
    hospitalSite: 'Metro St. Jude Academic Medical Center',
    consentStatus: 'ACTIVE_CONSENT',
    provenance: {
      sourceSystem: 'Epic EHR',
      ingestionTimestamp: '2026-08-20T08:00:00Z',
      recordedBy: 'Dr. Sarah Chen, MD',
      verificationStatus: 'VERIFIED',
      checksum: 'sha256-darnell77',
    },
    completenessAlerts: [],
    conditions: [
      {
        id: 'COND-271',
        code: 'M10.9',
        name: 'Gout, unspecified',
        category: 'CHRONIC',
        onsetDate: '2016-07-22',
        clinicalStatus: 'ACTIVE',
        severity: 'MILD',
      }
    ],
    medications: [
      {
        id: 'MED-371',
        code: 'RX-4481',
        name: 'Allopurinol',
        dosage: '300 mg',
        route: 'Oral',
        frequency: 'Daily',
        status: 'ACTIVE',
        prescribedDate: '2023-09-15',
        prescribingProvider: 'Dr. Sarah Chen, MD',
        indications: 'Uric acid reduction',
      }
    ],
    allergies: [],
    observations: [],
    encounters: []
  },
  {
    id: 'PT-1010',
    mrn: 'MRN-228190',
    uprId: 'UPR-2026-STJ-228190',
    fullName: 'Brigitte Dubois',
    birthDate: '1952-10-14',
    age: 73,
    gender: 'FEMALE',
    assignedPhysicianId: 'usr-doc-01',
    hospitalSite: 'Metro St. Jude Academic Medical Center',
    consentStatus: 'ACTIVE_CONSENT',
    provenance: {
      sourceSystem: 'Epic EHR',
      ingestionTimestamp: '2026-08-19T14:20:00Z',
      recordedBy: 'Dr. Sarah Chen, MD',
      verificationStatus: 'VERIFIED',
      checksum: 'sha256-brigitte52',
    },
    completenessAlerts: [],
    conditions: [
      {
        id: 'COND-281',
        code: 'M81.0',
        name: 'Age-related osteoporosis without current pathological fracture',
        category: 'CHRONIC',
        onsetDate: '2021-02-11',
        clinicalStatus: 'ACTIVE',
        severity: 'MILD',
      }
    ],
    medications: [],
    allergies: [],
    observations: [],
    encounters: []
  },
  {
    id: 'PT-1011',
    mrn: 'MRN-881923',
    uprId: 'UPR-2026-STJ-881923',
    fullName: 'Liam Gallagher',
    birthDate: '1990-01-28',
    age: 36,
    gender: 'MALE',
    assignedPhysicianId: 'usr-doc-01',
    hospitalSite: 'Metro St. Jude Academic Medical Center',
    consentStatus: 'EXPIRED_CONSENT', // Intentional for Break-It Scenario 9
    provenance: {
      sourceSystem: 'Epic EHR',
      ingestionTimestamp: '2026-08-10T12:00:00Z',
      recordedBy: 'Dr. Sarah Chen, MD',
      verificationStatus: 'VERIFIED',
      checksum: 'sha256-liam90',
    },
    completenessAlerts: [
      {
        id: 'CA-103',
        field: 'Consent.status',
        severity: 'CRITICAL',
        message: 'Patient General Treatment & Information Release Consent EXPIRED on 2026-08-01',
        detectedAt: '2026-08-10T12:00:00Z',
      }
    ],
    conditions: [
      {
        id: 'COND-291',
        code: 'G43.909',
        name: 'Migraine, unspecified, not intractable',
        category: 'CHRONIC',
        onsetDate: '2015-11-20',
        clinicalStatus: 'ACTIVE',
        severity: 'MODERATE',
      }
    ],
    medications: [],
    allergies: [],
    observations: [],
    encounters: []
  },
  {
    id: 'PT-1012',
    mrn: 'MRN-667104',
    uprId: 'UPR-2026-STJ-667104',
    fullName: 'Sophia Martinez',
    birthDate: '2012-08-03',
    age: 14,
    gender: 'FEMALE',
    assignedPhysicianId: 'usr-doc-01',
    hospitalSite: 'Metro St. Jude Academic Medical Center',
    consentStatus: 'ACTIVE_CONSENT',
    provenance: {
      sourceSystem: 'Epic Pediatric EHR',
      ingestionTimestamp: '2026-08-21T15:00:00Z',
      recordedBy: 'Dr. Sarah Chen, MD',
      verificationStatus: 'VERIFIED',
      checksum: 'sha256-sophia12',
    },
    completenessAlerts: [],
    conditions: [
      {
        id: 'COND-301',
        code: 'E10.9',
        name: 'Type 1 diabetes mellitus without complications',
        category: 'CHRONIC',
        onsetDate: '2022-06-15',
        clinicalStatus: 'ACTIVE',
        severity: 'MODERATE',
      }
    ],
    medications: [
      {
        id: 'MED-381',
        code: 'RX-1289',
        name: 'Insulin Glargine (Lantus)',
        dosage: '18 units',
        route: 'Subcutaneous',
        frequency: 'Once daily at bedtime',
        status: 'ACTIVE',
        prescribedDate: '2025-10-01',
        prescribingProvider: 'Dr. Sarah Chen, MD',
        indications: 'Basal glycemic management',
      }
    ],
    allergies: [],
    observations: [],
    encounters: []
  },
  {
    id: 'PT-1013',
    mrn: 'MRN-990142',
    uprId: 'UPR-2026-STJ-990142',
    fullName: 'Robert Tanaka',
    birthDate: '1960-09-02',
    age: 65,
    gender: 'MALE',
    assignedPhysicianId: 'usr-doc-01',
    hospitalSite: 'Metro St. Jude Academic Medical Center',
    consentStatus: 'ACTIVE_CONSENT',
    provenance: {
      sourceSystem: 'Epic EHR',
      ingestionTimestamp: '2026-08-22T09:00:00Z',
      recordedBy: 'Dr. Sarah Chen, MD',
      verificationStatus: 'VERIFIED',
      checksum: 'sha256-tanaka60',
    },
    completenessAlerts: [],
    conditions: [
      {
        id: 'COND-311',
        code: 'C34.90',
        name: 'Malignant neoplasm of unspecified part of bronchus or lung',
        category: 'CHRONIC',
        onsetDate: '2025-04-12',
        clinicalStatus: 'ACTIVE',
        severity: 'SEVERE',
      }
    ],
    medications: [],
    allergies: [],
    observations: [],
    encounters: []
  }
];

export const DEMO_USERS = [
  {
    id: 'usr-doc-01',
    name: 'Dr. Sarah Chen, MD',
    role: 'DOCTOR' as const,
    department: 'Chief of Cardiology & Attending Doctor',
    hospitalSite: 'Metro St. Jude Academic Medical Center',
    licenseNumber: 'MD-CA-992148',
    assignedPatientIds: ['PT-1002', 'PT-1003', 'PT-1005', 'PT-1006', 'PT-1007', 'PT-1008', 'PT-1009', 'PT-1010', 'PT-1011', 'PT-1012', 'PT-1013'],
    mfaVerified: true,
  },
  {
    id: 'usr-spec-01',
    name: 'Dr. Emily Vance, MD',
    role: 'SPECIALIST' as const,
    department: 'Clinical Specialist & Surgical Consult',
    hospitalSite: 'North River Community Hospital',
    licenseNumber: 'MD-CA-449102',
    assignedPatientIds: ['PT-1004', 'PT-1008'],
    mfaVerified: true,
  },
  {
    id: 'usr-coord-01',
    name: 'Carlos Mendez, MSW',
    role: 'CARE_COORDINATOR' as const,
    department: 'Transitional Care & Discharge Navigation',
    hospitalSite: 'Metro St. Jude Academic Medical Center',
    licenseNumber: 'LCSW-CA-338192',
    assignedPatientIds: ['PT-1002', 'PT-1005', 'PT-1010'],
    mfaVerified: true,
  },
  {
    id: 'usr-rn-01',
    name: 'Jennifer Walsh, RN, BSN',
    role: 'NURSE' as const,
    department: 'Inpatient Cardiology 4W & Acute Care',
    hospitalSite: 'Metro St. Jude Academic Medical Center',
    licenseNumber: 'RN-CA-771920',
    assignedPatientIds: ['PT-1002', 'PT-1003', 'PT-1005'],
    mfaVerified: true,
  },
  {
    id: 'usr-admin-01',
    name: 'Rebecca Thorne, MBA',
    role: 'ADMINISTRATOR' as const,
    department: 'Hospital Network Operations & Clinical Informatics',
    hospitalSite: 'Metro St. Jude Academic Medical Center',
    licenseNumber: 'N/A',
    assignedPatientIds: [],
    mfaVerified: true,
  },
  {
    id: 'usr-portal-admin-01',
    name: 'Elena Rostova, PhD',
    role: 'PORTAL_ADMIN' as const,
    department: 'Enterprise AI Governance & Self-Improvement Council',
    hospitalSite: 'Enterprise Health Intelligence Network',
    licenseNumber: 'AI-GOV-9901',
    assignedPatientIds: ['PT-1000', 'PT-1001', 'PT-1002', 'PT-1003', 'PT-1004', 'PT-1005'],
    mfaVerified: true,
  },
  {
    id: 'usr-audit-01',
    name: 'Arthur Sterling, CISA, HCISPP',
    role: 'AUDITOR' as const,
    department: 'Compliance & HIPAA Data Governance',
    hospitalSite: 'Enterprise Health Network',
    licenseNumber: 'AUD-88210',
    assignedPatientIds: [],
    mfaVerified: true,
  }
];
