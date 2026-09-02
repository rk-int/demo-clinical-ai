/**
 * Multi-Hospital Healthcare Network Registry
 * Serves multi-hospital network operations with dynamic site selection, EHR system interop & facility analytics
 */

export interface HospitalFacility {
  id: string;
  name: string;
  shortName: string;
  code: string;
  type: string;
  city: string;
  state: string;
  totalBeds: number;
  occupiedBeds: number;
  ehrSystem: string;
  fhirEndpoint: string;
  status: 'ACTIVE' | 'HIGH_CAPACITY' | 'CRITICAL';
  color: string;
  badgeBg: string;
}

export const NETWORK_HOSPITALS: HospitalFacility[] = [
  {
    id: 'hosp-all',
    name: 'All Network Hospitals (Healthcare Network)',
    shortName: 'All Network Sites',
    code: 'NET-ALL',
    type: 'Multi-Hospital Enterprise Network',
    city: 'Metropolitan Area',
    state: 'NY',
    totalBeds: 1850,
    occupiedBeds: 1542,
    ehrSystem: 'Enterprise FHIR Federated Mesh R4',
    fhirEndpoint: 'https://fhir.healthnet-network.org/r4',
    status: 'ACTIVE',
    color: 'text-blue-400 border-blue-500/40',
    badgeBg: 'bg-blue-500/15 text-blue-300 border-blue-500/30',
  },
  {
    id: 'hosp-01',
    name: 'St. Jude Regional Medical Center',
    shortName: 'St. Jude Regional',
    code: 'STJ-MAIN',
    type: 'Tertiary Referral & Cardiac Specialty Center',
    city: 'New York',
    state: 'NY',
    totalBeds: 650,
    occupiedBeds: 540,
    ehrSystem: 'Epic Systems EHR (R4 Interop)',
    fhirEndpoint: 'https://epic-fhir.stjude-health.org/api/FHIR/R4',
    status: 'ACTIVE',
    color: 'text-emerald-400 border-emerald-500/40',
    badgeBg: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
  },
  {
    id: 'hosp-02',
    name: 'Metropolitan General Hospital',
    shortName: 'Metropolitan General',
    code: 'MET-GEN',
    type: 'Level 1 Trauma & Academic Medical Center',
    city: 'Brooklyn',
    state: 'NY',
    totalBeds: 520,
    occupiedBeds: 468,
    ehrSystem: 'Cerner Millennium FHIR API',
    fhirEndpoint: 'https://cerner-fhir.metropolitan-gen.org/r4',
    status: 'HIGH_CAPACITY',
    color: 'text-cyan-400 border-cyan-500/40',
    badgeBg: 'bg-cyan-500/15 text-cyan-300 border-cyan-500/30',
  },
  {
    id: 'hosp-03',
    name: 'Mercy Community Health System',
    shortName: 'Mercy Community',
    code: 'MER-COMM',
    type: 'Outpatient & Ambulatory Care Network',
    city: 'Queens',
    state: 'NY',
    totalBeds: 380,
    occupiedBeds: 295,
    ehrSystem: 'MEDITECH Expanse FHIR',
    fhirEndpoint: 'https://meditech-fhir.mercy-health.org/v1/fhir',
    status: 'ACTIVE',
    color: 'text-purple-400 border-purple-500/40',
    badgeBg: 'bg-purple-500/15 text-purple-300 border-purple-500/30',
  },
  {
    id: 'hosp-04',
    name: 'St. Luke Surgical & Cardiac Pavilion',
    shortName: 'St. Luke Surgical',
    code: 'STL-SURG',
    type: 'Specialized Cardiovascular & Surgical Institute',
    city: 'Manhattan',
    state: 'NY',
    totalBeds: 300,
    occupiedBeds: 239,
    ehrSystem: 'Allscripts TouchWorks FHIR',
    fhirEndpoint: 'https://fhir.stluke-surgical.org/open',
    status: 'ACTIVE',
    color: 'text-amber-400 border-amber-500/40',
    badgeBg: 'bg-amber-500/15 text-amber-300 border-amber-500/30',
  },
];
