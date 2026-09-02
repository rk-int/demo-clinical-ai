import React, { useState } from 'react';
import { 
  Calendar, 
  Clock, 
  UserPlus, 
  Search, 
  Phone, 
  Mail, 
  CheckCircle2, 
  Send, 
  Building2, 
  Stethoscope, 
  Filter, 
  PlusCircle, 
  ArrowLeft,
  Sparkles,
  UserCheck
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { HospitalFacility, NETWORK_HOSPITALS } from '../../data/hospitalNetwork';
import { SyntheticPatient } from '../../types';
import { BookAppointmentModal, AppointmentData } from './BookAppointmentModal';

interface AppointmentsCenterViewProps {
  selectedHospital?: HospitalFacility;
  patients?: SyntheticPatient[];
  onGoBack?: () => void;
}

const INITIAL_APPOINTMENTS: AppointmentData[] = [
  {
    id: 'APT-100881',
    patientName: 'John Doe',
    age: '58',
    phoneNumber: '(555) 234-5678',
    email: 'john.doe@healthnet-patient.org',
    hospitalFacility: 'St. Jude Regional Medical Center',
    department: 'Cardiology Clinic',
    appointmentDate: new Date().toISOString().slice(0, 10),
    appointmentTime: '10:30 AM',
    reasonForVisit: 'Heart Failure SGLT2 titration & eGFR follow-up',
    status: 'CONFIRMED',
    emailSent: true,
    smsSent: true,
    bookedAt: 'Today 08:30 AM'
  },
  {
    id: 'APT-100882',
    patientName: 'Elena Rostova',
    age: '64',
    phoneNumber: '(555) 345-6789',
    email: 'elena.rostova@healthnet-patient.org',
    hospitalFacility: 'Metropolitan General Hospital',
    department: 'Heart Failure Outpatient',
    appointmentDate: new Date().toISOString().slice(0, 10),
    appointmentTime: '01:15 PM',
    reasonForVisit: 'HFpEF post-discharge medication reconciliation',
    status: 'CONFIRMED',
    emailSent: true,
    smsSent: true,
    bookedAt: 'Today 09:15 AM'
  },
  {
    id: 'APT-100883',
    patientName: 'Marcus Vance',
    age: '71',
    phoneNumber: '(555) 456-7890',
    email: 'marcus.vance@healthnet-patient.org',
    hospitalFacility: 'Mercy Community Health System',
    department: 'Nephrology Follow-up',
    appointmentDate: new Date(Date.now() + 86400000).toISOString().slice(0, 10),
    appointmentTime: '11:00 AM',
    reasonForVisit: 'CKD Stage 3b creatinine monitoring',
    status: 'CONFIRMED',
    emailSent: true,
    smsSent: true,
    bookedAt: 'Yesterday 04:20 PM'
  },
  {
    id: 'APT-100884',
    patientName: 'Sarah Jenkins',
    age: '49',
    phoneNumber: '(555) 567-8901',
    email: 'sarah.jenkins@healthnet-patient.org',
    hospitalFacility: 'St. Luke Surgical Pavilion',
    department: 'Post-Surgical Review',
    appointmentDate: new Date(Date.now() + 86400000 * 2).toISOString().slice(0, 10),
    appointmentTime: '02:30 PM',
    reasonForVisit: 'Post-CABG 30-day surgical wound evaluation',
    status: 'CONFIRMED',
    emailSent: true,
    smsSent: true,
    bookedAt: 'Yesterday 05:45 PM'
  }
];

export const AppointmentsCenterView: React.FC<AppointmentsCenterViewProps> = ({
  selectedHospital,
  patients = [],
  onGoBack,
}) => {
  const { isDark } = useTheme();
  const [appointments, setAppointments] = useState<AppointmentData[]>(INITIAL_APPOINTMENTS);
  const [isBookModalOpen, setIsBookModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDepartmentFilter, setSelectedDepartmentFilter] = useState('ALL');

  const handleBookAppointment = (newApt: AppointmentData) => {
    setAppointments((prev) => [newApt, ...prev]);
  };

  const filteredAppointments = appointments.filter((apt) => {
    if (selectedDepartmentFilter !== 'ALL' && !apt.department.includes(selectedDepartmentFilter)) {
      return false;
    }
    if (!searchTerm.trim()) return true;
    const term = searchTerm.toLowerCase().trim();
    return (
      apt.patientName.toLowerCase().includes(term) ||
      apt.email.toLowerCase().includes(term) ||
      apt.phoneNumber.includes(term) ||
      apt.hospitalFacility.toLowerCase().includes(term) ||
      apt.department.toLowerCase().includes(term)
    );
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto p-4 sm:p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          {onGoBack && (
            <button
              onClick={onGoBack}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/15 border border-white/10 text-slate-200 transition-colors cursor-pointer"
              title="Back"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
          )}
          <div>
            <h1 className={`text-2xl font-bold tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
              Clinical Encounters & Appointments
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Direct encounter booking with automated Email & SMS patient notification alerts
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsBookModalOpen(true)}
          className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center gap-2 cursor-pointer shadow-lg shadow-blue-600/30 transition-all"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Book Appointment</span>
        </button>
      </div>

      {/* Lightweight Info Banner */}
      <div className="p-4 rounded-2xl bg-blue-500/10 border border-blue-500/30 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs text-blue-300">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-blue-500/20 text-blue-400 shrink-0">
            <Send className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-white text-sm">Lightweight Appointment Reservation Active</h3>
            <p className="text-[11px] text-slate-300 mt-0.5">
              Booking requires basic details only (Name, Age, Phone, Email, Facility & Time). Instant automated Email confirmation and SMS alert are dispatched upon booking.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 font-mono text-[11px] shrink-0">
          <span className="px-2.5 py-1 rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-bold flex items-center gap-1">
            <Mail className="w-3 h-3" /> Email Dispatch Active
          </span>
          <span className="px-2.5 py-1 rounded-lg bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 font-bold flex items-center gap-1">
            <Phone className="w-3 h-3" /> SMS Gateway Online
          </span>
        </div>
      </div>

      {/* Daily Round Schedule Summaries */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className={`p-4 rounded-2xl border ${isDark ? 'bg-slate-900/80 border-white/10' : 'bg-white border-slate-200 shadow-sm'}`}>
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-blue-500 uppercase tracking-wider">Morning Inpatient Rounds</span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 font-bold">08:00 - 11:30</span>
          </div>
          <p className="text-xs text-slate-300 font-medium">Cardiology Inpatient Ward 4W</p>
          <p className="text-[11px] text-slate-400 mt-1">Elena Rostova, Marcus Vance, Arthur Pendelton</p>
        </div>

        <div className={`p-4 rounded-2xl border ${isDark ? 'bg-slate-900/80 border-white/10' : 'bg-white border-slate-200 shadow-sm'}`}>
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-cyan-500 uppercase tracking-wider">Specialty Clinic Visits</span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 font-bold">13:00 - 16:00</span>
          </div>
          <p className="text-xs text-slate-300 font-medium">Heart Failure & Post-CABG Review</p>
          <p className="text-[11px] text-slate-400 mt-1">John Doe (13:30), Jane Smith (14:15), Robert Brown (15:00)</p>
        </div>

        <div className={`p-4 rounded-2xl border ${isDark ? 'bg-slate-900/80 border-white/10' : 'bg-white border-slate-200 shadow-sm'}`}>
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-purple-500 uppercase tracking-wider">Multi-Disciplinary Handoff</span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-400 font-bold">16:30 - 17:00</span>
          </div>
          <p className="text-xs text-slate-300 font-medium">Care Coordination & Transition Board</p>
          <p className="text-[11px] text-slate-400 mt-1">Nursing supervisor & clinical social worker review</p>
        </div>
      </div>

      {/* Main Appointments Table Card */}
      <div className={`rounded-2xl border p-5 sm:p-6 shadow-xl space-y-4 ${
        isDark ? 'bg-slate-900/90 border-white/10 text-white' : 'bg-white border-slate-200 text-slate-900'
      }`}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
          <div>
            <h2 className="text-lg font-bold tracking-tight">Scheduled Appointments Register</h2>
            <p className="text-xs text-slate-400 mt-0.5 font-mono">
              Total <strong className="text-cyan-400">{filteredAppointments.length}</strong> active appointments
            </p>
          </div>

          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search patient, phone, email..."
                className={`pl-8 pr-3 py-1.5 rounded-xl text-xs focus:outline-none transition-colors border ${
                  isDark ? 'bg-slate-950 border-white/10 text-white focus:border-blue-500' : 'bg-slate-50 border-slate-200 text-slate-900'
                }`}
              />
            </div>

            <select
              value={selectedDepartmentFilter}
              onChange={(e) => setSelectedDepartmentFilter(e.target.value)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold focus:outline-none cursor-pointer border ${
                isDark ? 'bg-slate-950 border-white/10 text-cyan-300' : 'bg-slate-50 border-slate-200 text-slate-700'
              }`}
            >
              <option value="ALL">All Specialties</option>
              <option value="Cardiology">Cardiology</option>
              <option value="Heart Failure">Heart Failure</option>
              <option value="Nephrology">Nephrology</option>
              <option value="General Internal Medicine">General Medicine</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto rounded-xl border border-white/10">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className={`border-b font-mono uppercase tracking-wider text-[11px] ${
                isDark ? 'bg-slate-950/70 border-white/10 text-slate-400' : 'bg-slate-100 border-slate-200 text-slate-600'
              }`}>
                <th className="p-3.5 font-bold">Patient Name & Age</th>
                <th className="p-3.5 font-bold">Contact (Phone & Email)</th>
                <th className="p-3.5 font-bold">Facility & Department</th>
                <th className="p-3.5 font-bold">Date & Time</th>
                <th className="p-3.5 font-bold">Reason for Visit</th>
                <th className="p-3.5 font-bold">Alert Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 font-sans">
              {filteredAppointments.map((apt) => (
                <tr key={apt.id} className={`transition-colors ${isDark ? 'hover:bg-white/5' : 'hover:bg-slate-50'}`}>
                  {/* Patient Name & Age */}
                  <td className="p-3.5 font-semibold">
                    <div className="flex items-center gap-2">
                      <span className="text-white font-bold text-sm">{apt.patientName}</span>
                      <span className="text-[10px] px-1.5 py-0.2 rounded bg-blue-500/20 text-blue-300 font-mono">
                        {apt.age} yrs
                      </span>
                    </div>
                    <span className="text-[10px] text-slate-400 font-mono block mt-0.5">{apt.id}</span>
                  </td>

                  {/* Contact Info */}
                  <td className="p-3.5 text-xs">
                    <div className="flex items-center gap-1.5 text-emerald-300 font-mono font-medium">
                      <Phone className="w-3 h-3 text-emerald-400" />
                      <span>{apt.phoneNumber}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-slate-400 font-mono text-[11px] mt-0.5">
                      <Mail className="w-3 h-3 text-cyan-400" />
                      <span>{apt.email}</span>
                    </div>
                  </td>

                  {/* Facility & Department */}
                  <td className="p-3.5">
                    <div className="font-bold text-slate-200">{apt.hospitalFacility}</div>
                    <div className="text-[11px] text-cyan-300 font-mono mt-0.5">{apt.department}</div>
                  </td>

                  {/* Date & Time */}
                  <td className="p-3.5 font-mono whitespace-nowrap">
                    <div className="text-white font-bold">{apt.appointmentDate}</div>
                    <div className="text-[11px] text-blue-400 font-semibold">{apt.appointmentTime}</div>
                  </td>

                  {/* Reason for Visit */}
                  <td className="p-3.5 text-slate-300 max-w-xs">
                    {apt.reasonForVisit}
                  </td>

                  {/* Alert Delivery Status */}
                  <td className="p-3.5 whitespace-nowrap">
                    <div className="flex flex-col gap-1">
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                        <CheckCircle2 className="w-3 h-3 text-emerald-400" /> Email Sent
                      </span>
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold font-mono px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                        <CheckCircle2 className="w-3 h-3 text-cyan-400" /> SMS Dispatched
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Book Appointment Modal */}
      <BookAppointmentModal
        isOpen={isBookModalOpen}
        onClose={() => setIsBookModalOpen(false)}
        onBookAppointment={handleBookAppointment}
        selectedHospital={selectedHospital}
      />
    </div>
  );
};
