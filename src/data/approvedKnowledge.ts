import { GuidelineDocument } from '../types';

export const APPROVED_GUIDELINES: GuidelineDocument[] = [
  {
    id: 'GUIDE-HF-2025',
    title: 'Clinical Practice Guideline: Management of Heart Failure with Preserved and Reduced Ejection Fraction',
    version: 'v3.2',
    specialty: 'Cardiology',
    hospitalSite: 'Metro St. Jude Academic Medical Center',
    approvalStatus: 'APPROVED',
    publishedDate: '2025-01-15',
    effectiveDate: '2025-02-01',
    summary: 'Comprehensive evidence-based inpatient and outpatient guideline detailing GDMT 4-pillar initiation (ARNI, Beta-Blocker, MRA, SGLT2i), dosing titrations, and renal safety thresholds.',
    chunks: [
      {
        chunkId: 'HF-CHUNK-01',
        documentId: 'GUIDE-HF-2025',
        documentTitle: 'Management of Heart Failure Guideline v3.2',
        documentVersion: 'v3.2',
        approvalStatus: 'APPROVED',
        specialty: 'Cardiology',
        hospitalSite: 'Metro St. Jude Academic Medical Center',
        effectiveDate: '2025-02-01',
        section: 'Section 4.1: SGLT2 Inhibitor Initiation Criteria',
        text: 'SGLT2 inhibitors (Empagliflozin 10 mg daily or Dapagliflozin 10 mg daily) are Class I recommended for all symptomatic HF patients regardless of ejection fraction (HFrEF and HFpEF). Initiation requires eGFR >= 20 mL/min/1.73m2. Temporary withholding is mandated during acute hypovolemia, perioperative fasting (>24h), or acute severe illness due to euglycemic DKA risk. Initial transient dip in eGFR (<30%) is anticipated and does not require discontinuation unless progressive worsening occurs.',
        lexicalTokens: ['sglt2', 'empagliflozin', 'dapagliflozin', 'egfr', 'heart', 'failure', 'hfpef', 'hfref', 'initiation', 'renal', 'kidney', 'threshold'],
      },
      {
        chunkId: 'HF-CHUNK-02',
        documentId: 'GUIDE-HF-2025',
        documentTitle: 'Management of Heart Failure Guideline v3.2',
        documentVersion: 'v3.2',
        approvalStatus: 'APPROVED',
        specialty: 'Cardiology',
        hospitalSite: 'Metro St. Jude Academic Medical Center',
        effectiveDate: '2025-02-01',
        section: 'Section 4.2: ARNI (Sacubitril/Valsartan) Dosing & ACE-I Washout',
        text: 'Sacubitril/Valsartan is preferred over ACE inhibitors or ARBs. A mandatory 36-hour washout period is required when transitioning from any ACE inhibitor (e.g., Lisinopril, Enalapril) to avoid life-threatening angioedema. Starting dose is 24/26 mg BID for patients with severe renal impairment (eGFR < 30) or hepatic impairment, titrating every 2-4 weeks to target 97/103 mg BID as tolerated by systolic blood pressure (target SBP >= 100 mmHg).',
        lexicalTokens: ['arni', 'sacubitril', 'valsartan', 'entresto', 'acei', 'lisinopril', 'washout', '36-hour', 'angioedema', 'dosing', 'hypotension'],
      },
      {
        chunkId: 'HF-CHUNK-03',
        documentId: 'GUIDE-HF-2025',
        documentTitle: 'Management of Heart Failure Guideline v3.2',
        documentVersion: 'v3.2',
        approvalStatus: 'APPROVED',
        specialty: 'Cardiology',
        hospitalSite: 'Metro St. Jude Academic Medical Center',
        effectiveDate: '2025-02-01',
        section: 'Section 6.3: Inpatient Diuretic Titration Protocol',
        text: 'For acute decompensated heart failure with volume overload, initial IV loop diuretic dose should equal or double the home oral daily dose administered as IV bolus. Monitor net urine output targeting > 3.0 L/24h. If inadequate response within 4 hours, escalate with synergistic sequential nephron blockade using Metolazone 2.5-5 mg oral or IV Chlorothiazide 500 mg 30 minutes prior to loop diuretic.',
        lexicalTokens: ['diuretic', 'furosemide', 'lasix', 'bumetanide', 'edema', 'volume', 'overload', 'metolazone', 'diuresis', 'inpatient'],
      }
    ]
  },
  {
    id: 'GUIDE-GLYCEMIC-2025',
    title: 'Hospital Policy: Inpatient Subcutaneous & IV Insulin Glycemic Control Protocol',
    version: 'v4.0',
    specialty: 'Endocrinology',
    hospitalSite: 'Enterprise Health Network',
    approvalStatus: 'APPROVED',
    publishedDate: '2025-03-10',
    effectiveDate: '2025-04-01',
    summary: 'Standardized inpatient glycemic management targets (140-180 mg/dL for non-critically ill), basal-bolus-correction algorithms, and hypoglycemia avoidance protocols.',
    chunks: [
      {
        chunkId: 'GLYC-CHUNK-01',
        documentId: 'GUIDE-GLYCEMIC-2025',
        documentTitle: 'Inpatient Insulin Protocol v4.0',
        documentVersion: 'v4.0',
        approvalStatus: 'APPROVED',
        specialty: 'Endocrinology',
        hospitalSite: 'Enterprise Health Network',
        effectiveDate: '2025-04-01',
        section: 'Section 2: Inpatient Target Blood Glucose & Regimen Selection',
        text: 'Target blood glucose range for general non-ICU inpatients is 140–180 mg/dL (7.8–10.0 mmol/L). Sole sliding-scale insulin (SSI) without basal coverage is strictly discouraged. Standard regimen consists of 50% basal (Glargine/Detemir) and 50% prandial rapid-acting insulin (Lispro/Aspart) divided across meals, with correctional scale for pre-meal readings > 180 mg/dL.',
        lexicalTokens: ['insulin', 'glucose', 'glycemic', 'diabetes', 'glargine', 'lantus', 'sliding', 'scale', 'lispro', 'target', '140-180'],
      },
      {
        chunkId: 'GLYC-CHUNK-02',
        documentId: 'GUIDE-GLYCEMIC-2025',
        documentTitle: 'Inpatient Insulin Protocol v4.0',
        documentVersion: 'v4.0',
        approvalStatus: 'APPROVED',
        specialty: 'Endocrinology',
        hospitalSite: 'Enterprise Health Network',
        effectiveDate: '2025-04-01',
        section: 'Section 5: Rule of 15 Hypoglycemia Rescue Protocol',
        text: 'For blood glucose < 70 mg/dL: Administer 15-20 grams of rapid-acting oral glucose (4 oz fruit juice or 3-4 glucose tablets) if patient is alert and able to swallow. If NPO or impaired consciousness, administer 25 mL 50% Dextrose (D50W) IV push or 1 mg Glucagon IM. Recheck blood glucose in 15 minutes. Repeat until BG > 70 mg/dL.',
        lexicalTokens: ['hypoglycemia', 'rescue', 'glucose', 'rule', 'of', '15', 'd50w', 'glucagon', 'dextrose', '70', 'mg/dl'],
      }
    ]
  },
  {
    id: 'GUIDE-SEPSIS-2025',
    title: 'Hospital Clinical Pathway: Sepsis-3 Recognition and 1-Hour Bundle Resuscitation',
    version: 'v2.8',
    specialty: 'Critical Care',
    hospitalSite: 'Enterprise Health Network',
    approvalStatus: 'APPROVED',
    publishedDate: '2025-02-20',
    effectiveDate: '2025-03-01',
    summary: 'Evidence-based protocol for immediate sepsis identification using qSOFA / NEWS2, 1-hour resuscitation bundle, lactate rechecks, and broad-spectrum antimicrobial timing.',
    chunks: [
      {
        chunkId: 'SEPSIS-CHUNK-01',
        documentId: 'GUIDE-SEPSIS-2025',
        documentTitle: 'Sepsis-3 1-Hour Bundle Protocol v2.8',
        documentVersion: 'v2.8',
        approvalStatus: 'APPROVED',
        specialty: 'Critical Care',
        hospitalSite: 'Enterprise Health Network',
        effectiveDate: '2025-03-01',
        section: 'Section 1: 1-Hour Resuscitation Bundle Mandates',
        text: 'Upon identification of sepsis/septic shock: 1. Measure blood lactate level immediately (recheck within 2-4 hours if initial > 2.0 mmol/L). 2. Obtain blood cultures prior to antibiotic administration (2 sets from separate venipuncture sites). 3. Administer broad-spectrum IV antimicrobials within 60 minutes. 4. Rapidly infuse 30 mL/kg balanced crystalloids (Plasma-Lyte or Lactated Ringers) for hypotension (MAP < 65 mmHg) or lactate >= 4.0 mmol/L. 5. Initiate Norepinephrine as first-line vasopressor if MAP remains < 65 mmHg after fluid bolus.',
        lexicalTokens: ['sepsis', 'shock', 'lactate', 'bundle', 'cultures', 'antibiotics', 'crystalloid', 'norepinephrine', 'map', 'resuscitation', '1-hour'],
      }
    ]
  },
  {
    id: 'GUIDE-AFIB-2025',
    title: 'Clinical Practice Guideline: Stroke Prevention and Anticoagulation in Atrial Fibrillation',
    version: 'v3.1',
    specialty: 'Cardiology',
    hospitalSite: 'Enterprise Health Network',
    approvalStatus: 'APPROVED',
    publishedDate: '2025-01-05',
    effectiveDate: '2025-01-20',
    summary: 'DOAC initiation, CHA2DS2-VASc and HAS-BLED risk stratification, renal dosage modifications for Apixaban, Rivaroxaban, and Dabigatran.',
    chunks: [
      {
        chunkId: 'AFIB-CHUNK-01',
        documentId: 'GUIDE-AFIB-2025',
        documentTitle: 'Anticoagulation in Atrial Fibrillation v3.1',
        documentVersion: 'v3.1',
        approvalStatus: 'APPROVED',
        specialty: 'Cardiology',
        hospitalSite: 'Enterprise Health Network',
        effectiveDate: '2025-01-20',
        section: 'Section 3: Apixaban Renal & Weight Dose Reduction Criteria',
        text: 'Standard Apixaban dose is 5 mg BID. Dose reduction to 2.5 mg BID is mandated if patient meets at least TWO of the following three criteria: 1. Age >= 80 years; 2. Body weight <= 60 kg; 3. Serum creatinine >= 1.5 mg/dL. Direct oral anticoagulants (DOACs) are preferred over Vitamin K antagonists (Warfarin) in non-valvular AF.',
        lexicalTokens: ['apixaban', 'eliquis', 'afib', 'atrial', 'fibrillation', 'anticoagulation', 'dose', 'reduction', 'creatinine', 'weight', 'age'],
      }
    ]
  },
  {
    id: 'GUIDE-COPD-2025',
    title: 'Hospital Clinical Guideline: Management of Acute COPD Exacerbation',
    version: 'v2.4',
    specialty: 'Pulmonology',
    hospitalSite: 'Enterprise Health Network',
    approvalStatus: 'APPROVED',
    publishedDate: '2025-04-18',
    effectiveDate: '2025-05-01',
    summary: 'GOLD 2025 aligned management for acute COPD flares, systemic corticosteroid dosing, targeted oxygen titration (SpO2 88-92%), and non-invasive positive pressure ventilation (NIV).',
    chunks: [
      {
        chunkId: 'COPD-CHUNK-01',
        documentId: 'GUIDE-COPD-2025',
        documentTitle: 'Acute COPD Exacerbation Guideline v2.4',
        documentVersion: 'v2.4',
        approvalStatus: 'APPROVED',
        specialty: 'Pulmonology',
        hospitalSite: 'Enterprise Health Network',
        effectiveDate: '2025-05-01',
        section: 'Section 2.1: Oxygen Titration & Corticosteroid Therapy',
        text: 'Target oxygen saturation is strictly 88%–92% in patients with hypercapnic risk to prevent worsening respiratory acidosis. Systemic corticosteroid therapy: Prednisone 40 mg PO daily for 5 days is equivalent to longer courses and reduces hospital stay. Short-acting beta2-agonists (Albuterol) plus anticholinergic (Ipratropium) nebulizations are given every 4-6 hours as needed.',
        lexicalTokens: ['copd', 'exacerbation', 'oxygen', 'spo2', '88-92', 'prednisone', 'corticosteroid', 'albuterol', 'ipratropium', 'hypercapnia'],
      }
    ]
  },
  {
    id: 'GUIDE-VANCO-2025',
    title: 'Pharmacy Protocol: Vancomycin AUC-Guided Therapeutic Drug Monitoring',
    version: 'v3.0',
    specialty: 'Infectious Disease / Pharmacy',
    hospitalSite: 'Enterprise Health Network',
    approvalStatus: 'APPROVED',
    publishedDate: '2025-02-12',
    effectiveDate: '2025-03-01',
    summary: 'Bayesian AUC/MIC target (400-600 mg*h/L) dosing protocol replacing traditional trough-only monitoring to minimize acute kidney injury risk.',
    chunks: [
      {
        chunkId: 'VANCO-CHUNK-01',
        documentId: 'GUIDE-VANCO-2025',
        documentTitle: 'Vancomycin AUC Protocol v3.0',
        documentVersion: 'v3.0',
        approvalStatus: 'APPROVED',
        specialty: 'Infectious Disease / Pharmacy',
        hospitalSite: 'Enterprise Health Network',
        effectiveDate: '2025-03-01',
        section: 'Section 3: Therapeutic Target & Trough Timing',
        text: 'Target AUC24/MIC ratio is 400–600 mg*h/L for serious MRSA infections assuming MIC <= 1 mg/L. Traditional trough targets of 15-20 mcg/mL are no longer recommended due to nephrotoxicity risk. Serum levels should be drawn at steady-state prior to the 4th dose.',
        lexicalTokens: ['vancomycin', 'auc', 'mic', 'trough', 'therapeutic', 'drug', 'monitoring', 'mrsa', 'nephrotoxicity', 'dosing'],
      }
    ]
  },
  {
    id: 'GUIDE-AKI-2025',
    title: 'Clinical Pathway: Acute Kidney Injury (KDIGO) Prevention & Staging Protocol',
    version: 'v2.1',
    specialty: 'Nephrology',
    hospitalSite: 'Enterprise Health Network',
    approvalStatus: 'APPROVED',
    publishedDate: '2025-01-28',
    effectiveDate: '2025-02-15',
    summary: 'KDIGO staging guidelines, early nephrotoxic medication discontinuation, fluid resuscitation guidelines, and indications for urgent renal replacement therapy.',
    chunks: [
      {
        chunkId: 'AKI-CHUNK-01',
        documentId: 'GUIDE-AKI-2025',
        documentTitle: 'Acute Kidney Injury Guideline v2.1',
        documentVersion: 'v2.1',
        approvalStatus: 'APPROVED',
        specialty: 'Nephrology',
        hospitalSite: 'Enterprise Health Network',
        effectiveDate: '2025-02-15',
        section: 'Section 2: Nephrotoxic Medication Hold Protocol',
        text: 'In patients with Stage 2 or 3 AKI (Creatinine >= 2x baseline or urine output < 0.5 mL/kg/h for >= 12h), immediately hold non-steroidal anti-inflammatory drugs (NSAIDs), ACE inhibitors, ARBs, and SGLT2 inhibitors. Adjust dose of all renally excreted antimicrobials.',
        lexicalTokens: ['aki', 'kidney', 'injury', 'kdigo', 'creatinine', 'nephrotoxic', 'hold', 'nsaids', 'acei', 'renal'],
      }
    ]
  },
  {
    id: 'GUIDE-TRANSFUSION-2025',
    title: 'Hospital Blood Bank Policy: Restrictive Packed Red Blood Cell Transfusion Strategy',
    version: 'v3.5',
    specialty: 'Hematology / Transfusion Medicine',
    hospitalSite: 'Enterprise Health Network',
    approvalStatus: 'APPROVED',
    publishedDate: '2025-03-01',
    effectiveDate: '2025-03-15',
    summary: 'Restrictive transfusion threshold (Hb < 7.0 g/dL for stable hospitalized adults; Hb < 8.0 g/dL for acute coronary syndrome / cardiovascular disease).',
    chunks: [
      {
        chunkId: 'TRANS-CHUNK-01',
        documentId: 'GUIDE-TRANSFUSION-2025',
        documentTitle: 'Blood Transfusion Policy v3.5',
        documentVersion: 'v3.5',
        approvalStatus: 'APPROVED',
        specialty: 'Hematology / Transfusion Medicine',
        hospitalSite: 'Enterprise Health Network',
        effectiveDate: '2025-03-15',
        section: 'Section 1.2: Restrictive Hemoglobin Triggers',
        text: 'Transfusion of PRBCs is indicated at Hemoglobin < 7.0 g/dL for hemodynamically stable inpatient medical and surgical patients. For patients undergoing orthopedic or cardiac surgery, or with acute coronary syndrome, a threshold of Hemoglobin < 8.0 g/dL is recommended. Single-unit transfusion orders followed by clinical re-assessment are mandated.',
        lexicalTokens: ['transfusion', 'blood', 'prbc', 'hemoglobin', 'trigger', 'threshold', '7.0', '8.0', 'restrictive'],
      }
    ]
  },
  // Intentional unapproved guideline for Break-It Scenario 5
  {
    id: 'GUIDE-EXPERIMENTAL-DRAFT',
    title: 'DRAFT Experimental Protocol: High-Dose Intravenous Ascorbic Acid in Septic Shock',
    version: 'v0.1-DRAFT',
    specialty: 'Critical Care',
    hospitalSite: 'Metro St. Jude Academic Medical Center',
    approvalStatus: 'DRAFT', // Not approved!
    publishedDate: '2026-06-01',
    effectiveDate: '2026-07-01',
    summary: 'Unapproved experimental research draft protocol. Not validated for clinical use.',
    chunks: [
      {
        chunkId: 'DRAFT-CHUNK-01',
        documentId: 'GUIDE-EXPERIMENTAL-DRAFT',
        documentTitle: 'DRAFT Experimental Protocol v0.1',
        documentVersion: 'v0.1-DRAFT',
        approvalStatus: 'DRAFT',
        specialty: 'Critical Care',
        hospitalSite: 'Metro St. Jude Academic Medical Center',
        effectiveDate: '2026-07-01',
        section: 'Section 1: Investigational Regimen',
        text: 'Administer Vitamin C 1.5g IV q6h with Hydrocortisone 50mg q6h and Thiamine 200mg q12h. This protocol is strictly under investigational review and NOT APPROVED for clinical deployment.',
        lexicalTokens: ['vitamin', 'c', 'ascorbic', 'thiamine', 'sepsis', 'draft', 'unapproved'],
      }
    ]
  }
];
