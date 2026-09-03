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
  UserCheck,
  XCircle,
  X,
  AlertTriangle,
  FileCheck2,
  Check
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
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<'ALL' | 'CONFIRMED' | 'CLOSED'>('ALL');

  // Close Appointment Modal state
  const [aptToClose, setAptToClose] = useState<AppointmentData | null>(null);
  const [closeReason, setCloseReason] = useState('Encounter Completed Successfully');
  const [closureToast, setClosureToast] = useState<string | null>(null);

  const handleBookAppointment = (newApt: AppointmentData) => {
    setAppointments((prev) => [newApt, ...prev]);
  };

  const handleConfirmClose = (e: React.FormEvent) => {
    e.preventDefault();
    if (!aptToClose) return;

    const currentTimeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    setAppointments((prev) =>
      prev.map((apt) =>
        apt.id === aptToClose.id
          ? {
              ...apt,
              status: 'CLOSED',
              closeReason: closeReason || 'Encounter Completed',
              closedAt: `Today ${currentTimeStr}`,
            }
          : apt
      )
    );

    setClosureToast(`Appointment ${aptToClose.id} for ${aptToClose.patientName} has been closed. Email & SMS closure alerts dispatched.`);
    setTimeout(() => setClosureToast(null), 5000);

    setAptToClose(null);
    setCloseReason('Encounter Completed Successfully');
  };

  const filteredAppointments = appointments.filter((apt) => {
    if (selectedStatusFilter === 'CONFIRMED' && apt.status !== 'CONFIRMED') return false;
    if (selectedStatusFilter === 'CLOSED' && apt.status !== 'CLOSED' && apt.status !== 'COMPLETED') return false;
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

  const activeCount = appointments.filter(a => a.status === 'CONFIRMED' || a.status === 'PENDING').length;
  const closedCount = appointments.filter(a => a.status === 'CLOSED' || a.status === 'COMPLETED').length;

  return (
    <div className="space-y-6 max-w-7xl mx-auto p-4 sm:p-6">
      {/* Toast Notification */}
      {closureToast && (
        <div className="fixed top-6 right-6 z-50 p-4 rounded-2xl bg-emerald-950 border border-emerald-500/50 text-white shadow-2xl flex items-center gap-3 animate-fadeIn">
          <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <p className="text-xs font-semibold">{closureToast}</p>
        </div>
      )}

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

      {/* Main Appointments Table Card */}
      <div className={`rounded-2xl border p-5 sm:p-6 shadow-xl space-y-4 ${
        isDark ? 'bg-slate-900/90 border-white/10 text-white' : 'bg-white border-slate-200 text-slate-900'
      }`}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
          <div>
            <h2 className="text-lg font-bold tracking-tight">Scheduled Appointments Register</h2>
            <div className="flex items-center gap-2 mt-1 font-mono text-xs text-slate-400">
              <span>Active: <strong className="text-emerald-400">{activeCount}</strong></span>
              <span>•</span>
              <span>Closed: <strong className="text-slate-400">{closedCount}</strong></span>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
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

            {/* Status Filter */}
            <select
              value={selectedStatusFilter}
              onChange={(e) => setSelectedStatusFilter(e.target.value as any)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold focus:outline-none cursor-pointer border ${
                isDark ? 'bg-slate-950 border-white/10 text-emerald-400' : 'bg-slate-50 border-slate-200 text-slate-700'
              }`}
            >
              <option value="ALL">All Statuses ({appointments.length})</option>
              <option value="CONFIRMED">Active Only ({activeCount})</option>
              <option value="CLOSED">Closed Only ({closedCount})</option>
            </select>

            {/* Specialty Filter */}
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
                <th className="p-3.5 font-bold">Status & Alerts</th>
                <th className="p-3.5 font-bold text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 font-sans">
              {filteredAppointments.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-slate-400 text-xs">
                    No appointments match the current search or status filter.
                  </td>
                </tr>
              ) : (
                filteredAppointments.map((apt) => {
                  const isClosed = apt.status === 'CLOSED' || apt.status === 'COMPLETED';

                  return (
                    <tr key={apt.id} className={`transition-colors ${isClosed ? 'opacity-65 bg-slate-950/30' : isDark ? 'hover:bg-white/5' : 'hover:bg-slate-50'}`}>
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

                      {/* Status & Alerts */}
                      <td className="p-3.5 whitespace-nowrap">
                        {isClosed ? (
                          <div className="flex flex-col gap-1">
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold font-mono px-2.5 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                              <Check className="w-3 h-3 text-slate-400" /> Closed
                            </span>
                            <span className="text-[10px] text-slate-400 font-mono block">
                              {apt.closeReason || 'Encounter Completed'}
                            </span>
                          </div>
                        ) : (
                          <div className="flex flex-col gap-1">
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                              <CheckCircle2 className="w-3 h-3 text-emerald-400" /> Email Dispatched
                            </span>
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold font-mono px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                              <CheckCircle2 className="w-3 h-3 text-cyan-400" /> SMS Dispatched
                            </span>
                          </div>
                        )}
                      </td>

                      {/* Action Button */}
                      <td className="p-3.5 text-right whitespace-nowrap">
                        {isClosed ? (
                          <span className="text-[10px] font-mono text-slate-500 italic">
                            Completed ({apt.closedAt || 'Closed'})
                          </span>
                        ) : (
                          <button
                            onClick={() => setAptToClose(apt)}
                            className="px-3 py-1.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-300 border border-red-500/30 font-mono text-[11px] font-bold flex items-center gap-1.5 ml-auto transition-all cursor-pointer shadow-sm hover:scale-105"
                            title="Close / Cancel Appointment"
                          >
                            <XCircle className="w-3.5 h-3.5 text-red-400" />
                            <span>Close Appointment</span>
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
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

      {/* Close Appointment Modal */}
      {aptToClose && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
          <div className={`w-full max-w-md rounded-3xl border shadow-2xl overflow-hidden p-6 space-y-5 ${
            isDark ? 'bg-slate-900 border-white/10 text-white' : 'bg-white border-slate-200 text-slate-900'
          }`}>
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2 text-red-400">
                <XCircle className="w-5 h-5" />
                <h3 className="font-bold text-base text-white">Close Clinical Appointment</h3>
              </div>
              <button
                onClick={() => setAptToClose(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-3.5 rounded-2xl bg-red-500/10 border border-red-500/30 text-xs text-red-200">
              Closing appointment <strong className="text-white font-mono">{aptToClose.id}</strong> for{' '}
              <strong className="text-white">{aptToClose.patientName}</strong> ({aptToClose.appointmentDate} at {aptToClose.appointmentTime}).
            </div>

            <form onSubmit={handleConfirmClose} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1.5">
                  Select Closure / Completion Reason:
                </label>
                <select
                  value={closeReason}
                  onChange={(e) => setCloseReason(e.target.value)}
                  className={`w-full px-3.5 py-2.5 rounded-xl text-xs font-semibold focus:outline-none cursor-pointer border ${
                    isDark ? 'bg-slate-950 border-white/10 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
                  }`}
                >
                  <option value="Encounter Completed Successfully">Encounter Completed Successfully</option>
                  <option value="Patient Requested Cancellation">Patient Requested Cancellation</option>
                  <option value="No-Show / Patient Did Not Arrive">No-Show / Patient Did Not Arrive</option>
                  <option value="Rescheduled to Future Date">Rescheduled to Future Date</option>
                </select>
              </div>

              <div className="p-3 rounded-xl bg-slate-950/60 border border-white/10 text-[11px] text-slate-400 space-y-1 font-mono">
                <div className="flex items-center gap-1.5 text-emerald-400 font-bold">
                  <Mail className="w-3.5 h-3.5" /> Automated Closure Email Alert Will Be Sent
                </div>
                <div className="flex items-center gap-1.5 text-cyan-400 font-bold">
                  <Phone className="w-3.5 h-3.5" /> SMS Cancellation Receipt Will Be Sent
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setAptToClose(null)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-400 hover:text-white transition-colors cursor-pointer"
                >
                  Keep Active
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs shadow-lg shadow-red-600/30 transition-all cursor-pointer flex items-center gap-2"
                >
                  <XCircle className="w-4 h-4" />
                  <span>Confirm & Close Appointment</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
