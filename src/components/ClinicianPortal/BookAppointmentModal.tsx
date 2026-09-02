import React, { useState } from 'react';
import { 
  X, 
  Calendar, 
  Clock, 
  User, 
  Phone, 
  Mail, 
  Building2, 
  Stethoscope, 
  FileText, 
  Send, 
  CheckCircle2, 
  MessageSquare, 
  Sparkles,
  ShieldCheck
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { NETWORK_HOSPITALS, HospitalFacility } from '../../data/hospitalNetwork';

export interface AppointmentData {
  id: string;
  patientName: string;
  age: number | string;
  phoneNumber: string;
  email: string;
  hospitalFacility: string;
  department: string;
  appointmentDate: string;
  appointmentTime: string;
  reasonForVisit: string;
  status: 'CONFIRMED' | 'PENDING';
  emailSent: boolean;
  smsSent: boolean;
  bookedAt: string;
}

interface BookAppointmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onBookAppointment: (appointment: AppointmentData) => void;
  selectedHospital?: HospitalFacility;
}

export const BookAppointmentModal: React.FC<BookAppointmentModalProps> = ({
  isOpen,
  onClose,
  onBookAppointment,
  selectedHospital,
}) => {
  const { isDark } = useTheme();

  // Form State
  const [patientName, setPatientName] = useState('');
  const [age, setAge] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [hospitalFacility, setHospitalFacility] = useState(
    selectedHospital?.name || NETWORK_HOSPITALS[1].name
  );
  const [department, setDepartment] = useState('General Internal Medicine');
  const [appointmentDate, setAppointmentDate] = useState(
    new Date(Date.now() + 86400000).toISOString().slice(0, 10)
  );
  const [appointmentTime, setAppointmentTime] = useState('10:30 AM');
  const [reasonForVisit, setReasonForVisit] = useState('');
  
  // Submission & Confirmation state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookedConfirmation, setBookedConfirmation] = useState<AppointmentData | null>(null);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!patientName.trim() || !phoneNumber.trim() || !email.trim()) return;

    setIsSubmitting(true);

    setTimeout(() => {
      const newAppointment: AppointmentData = {
        id: `APT-${Math.floor(100000 + Math.random() * 900000)}`,
        patientName: patientName.trim(),
        age: age || '35',
        phoneNumber: phoneNumber.trim(),
        email: email.trim(),
        hospitalFacility,
        department,
        appointmentDate,
        appointmentTime,
        reasonForVisit: reasonForVisit.trim() || 'General Clinical Follow-up',
        status: 'CONFIRMED',
        emailSent: true,
        smsSent: true,
        bookedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      onBookAppointment(newAppointment);
      setIsSubmitting(false);
      setBookedConfirmation(newAppointment);
    }, 800);
  };

  const handleDone = () => {
    setBookedConfirmation(null);
    onClose();
  };

  return (
    <div className="fixed inset-[#000000_0px] z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className={`w-full max-w-lg rounded-3xl border shadow-2xl overflow-hidden transition-all ${
        isDark ? 'bg-slate-900 border-white/10 text-white' : 'bg-white border-slate-200 text-slate-900'
      }`}>
        
        {/* Header */}
        <div className="p-5 border-b border-white/10 flex items-center justify-between bg-blue-600/10">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-blue-600 text-white shadow-md">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold tracking-tight">Book Clinical Appointment</h2>
              <p className="text-xs text-slate-400">Quick encounter booking with automated Email & SMS notification</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Confirmation Screen after booking */}
        {bookedConfirmation ? (
          <div className="p-6 space-y-6 text-center">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center mx-auto shadow-xl">
              <CheckCircle2 className="w-8 h-8 stroke-[2.5]" />
            </div>

            <div>
              <h3 className="text-xl font-extrabold text-emerald-400">Appointment Booked & Confirmed!</h3>
              <p className="text-xs text-slate-300 mt-1">
                Encounter reserved for <strong className="text-white">{bookedConfirmation.patientName}</strong> on{' '}
                <span className="text-cyan-300 font-bold">{bookedConfirmation.appointmentDate} at {bookedConfirmation.appointmentTime}</span>
              </p>
            </div>

            {/* Notification Delivery Badges */}
            <div className="space-y-2 text-left p-4 rounded-2xl bg-slate-950/60 border border-white/10 font-mono text-xs">
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                Automated Notifications Sent:
              </div>
              
              <div className="flex items-center justify-between p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300">
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Email Confirmation Sent</span>
                </div>
                <strong className="text-white text-[11px] truncate max-w-[180px]">{bookedConfirmation.email}</strong>
              </div>

              <div className="flex items-center justify-between p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-300">
                <div className="flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-cyan-400 shrink-0" />
                  <span>SMS Alert Dispatched</span>
                </div>
                <strong className="text-white text-[11px]">{bookedConfirmation.phoneNumber}</strong>
              </div>
            </div>

            {/* Appointment Summary Box */}
            <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 text-left text-xs space-y-1 font-sans">
              <div className="flex justify-between">
                <span className="text-slate-400">Facility:</span>
                <span className="font-bold text-white">{bookedConfirmation.hospitalFacility}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Specialty:</span>
                <span className="font-bold text-cyan-300">{bookedConfirmation.department}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Reason for Visit:</span>
                <span className="font-bold text-slate-200">{bookedConfirmation.reasonForVisit}</span>
              </div>
            </div>

            <button
              onClick={handleDone}
              className="w-full py-3 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm shadow-xl shadow-blue-600/30 cursor-pointer transition-all"
            >
              Done & Return to Appointments
            </button>
          </div>
        ) : (
          /* Form Screen */
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Patient Name */}
              <div>
                <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5 mb-1">
                  <User className="w-3.5 h-3.5 text-blue-400" /> Patient Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={patientName}
                  onChange={(e) => setPatientName(e.target.value)}
                  placeholder="e.g. John Smith"
                  className={`w-full px-3.5 py-2.5 rounded-xl text-xs font-semibold focus:outline-none border ${
                    isDark ? 'bg-slate-950 border-white/10 text-white focus:border-blue-500' : 'bg-slate-50 border-slate-200 text-slate-900'
                  }`}
                />
              </div>

              {/* Patient Age */}
              <div>
                <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5 mb-1">
                  <Calendar className="w-3.5 h-3.5 text-blue-400" /> Patient Age
                </label>
                <input
                  type="number"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  placeholder="e.g. 42"
                  className={`w-full px-3.5 py-2.5 rounded-xl text-xs font-semibold focus:outline-none border ${
                    isDark ? 'bg-slate-950 border-white/10 text-white focus:border-blue-500' : 'bg-slate-50 border-slate-200 text-slate-900'
                  }`}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Phone Number */}
              <div>
                <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5 mb-1">
                  <Phone className="w-3.5 h-3.5 text-emerald-400" /> Phone Number (SMS Alert) *
                </label>
                <input
                  type="tel"
                  required
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="e.g. (555) 234-5678"
                  className={`w-full px-3.5 py-2.5 rounded-xl text-xs font-semibold focus:outline-none border ${
                    isDark ? 'bg-slate-950 border-white/10 text-white focus:border-emerald-500' : 'bg-slate-50 border-slate-200 text-slate-900'
                  }`}
                />
              </div>

              {/* Email Address */}
              <div>
                <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5 mb-1">
                  <Mail className="w-3.5 h-3.5 text-cyan-400" /> Email Address (Confirmation) *
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. patient@example.com"
                  className={`w-full px-3.5 py-2.5 rounded-xl text-xs font-semibold focus:outline-none border ${
                    isDark ? 'bg-slate-950 border-white/10 text-white focus:border-cyan-500' : 'bg-slate-50 border-slate-200 text-slate-900'
                  }`}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Hospital Facility */}
              <div>
                <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5 mb-1">
                  <Building2 className="w-3.5 h-3.5 text-purple-400" /> Hospital Facility
                </label>
                <select
                  value={hospitalFacility}
                  onChange={(e) => setHospitalFacility(e.target.value)}
                  className={`w-full px-3.5 py-2.5 rounded-xl text-xs font-semibold focus:outline-none cursor-pointer border ${
                    isDark ? 'bg-slate-950 border-white/10 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
                  }`}
                >
                  {NETWORK_HOSPITALS.filter(h => h.id !== 'hosp-all').map((hosp) => (
                    <option key={hosp.id} value={hosp.name}>
                      {hosp.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Department / Specialty */}
              <div>
                <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5 mb-1">
                  <Stethoscope className="w-3.5 h-3.5 text-amber-400" /> Department / Clinic
                </label>
                <select
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className={`w-full px-3.5 py-2.5 rounded-xl text-xs font-semibold focus:outline-none cursor-pointer border ${
                    isDark ? 'bg-slate-950 border-white/10 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
                  }`}
                >
                  <option value="General Internal Medicine">General Internal Medicine</option>
                  <option value="Cardiology Clinic">Cardiology Clinic</option>
                  <option value="Heart Failure Outpatient">Heart Failure Outpatient</option>
                  <option value="Pulmonology & Respiratory">Pulmonology & Respiratory</option>
                  <option value="Nephrology Follow-up">Nephrology Follow-up</option>
                  <option value="Post-Surgical Review">Post-Surgical Review</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Date */}
              <div>
                <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5 mb-1">
                  <Calendar className="w-3.5 h-3.5 text-blue-400" /> Appointment Date
                </label>
                <input
                  type="date"
                  value={appointmentDate}
                  onChange={(e) => setAppointmentDate(e.target.value)}
                  className={`w-full px-3.5 py-2.5 rounded-xl text-xs font-semibold focus:outline-none border ${
                    isDark ? 'bg-slate-950 border-white/10 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
                  }`}
                />
              </div>

              {/* Time Slot */}
              <div>
                <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5 mb-1">
                  <Clock className="w-3.5 h-3.5 text-blue-400" /> Time Slot
                </label>
                <select
                  value={appointmentTime}
                  onChange={(e) => setAppointmentTime(e.target.value)}
                  className={`w-full px-3.5 py-2.5 rounded-xl text-xs font-semibold focus:outline-none cursor-pointer border ${
                    isDark ? 'bg-slate-950 border-white/10 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
                  }`}
                >
                  <option value="09:00 AM">09:00 AM</option>
                  <option value="10:30 AM">10:30 AM</option>
                  <option value="11:15 AM">11:15 AM</option>
                  <option value="01:30 PM">01:30 PM</option>
                  <option value="02:45 PM">02:45 PM</option>
                  <option value="04:00 PM">04:00 PM</option>
                </select>
              </div>
            </div>

            {/* Reason for Visit */}
            <div>
              <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5 mb-1">
                <FileText className="w-3.5 h-3.5 text-slate-400" /> Reason for Visit / Chief Complaint
              </label>
              <textarea
                rows={2}
                value={reasonForVisit}
                onChange={(e) => setReasonForVisit(e.target.value)}
                placeholder="e.g. Routine 3-month cardiology follow-up & blood pressure check..."
                className={`w-full px-3.5 py-2 rounded-xl text-xs font-medium focus:outline-none border ${
                  isDark ? 'bg-slate-950 border-white/10 text-white focus:border-blue-500' : 'bg-slate-50 border-slate-200 text-slate-900'
                }`}
              />
            </div>

            {/* Automated Dispatch Note */}
            <div className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/30 text-[11px] text-blue-300 flex items-center gap-2">
              <Send className="w-4 h-4 shrink-0 text-blue-400" />
              <span>
                Booking will automatically dispatch an <strong>Email confirmation</strong> and <strong>SMS alert</strong> directly to the patient.
              </span>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-400 hover:text-white transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-lg shadow-blue-600/30 transition-all cursor-pointer flex items-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-3.5 h-3.5 rounded-full border-2 border-white border-t-transparent animate-spin" />
                    <span>Booking & Dispatching Alerts...</span>
                  </>
                ) : (
                  <>
                    <Calendar className="w-4 h-4" />
                    <span>Confirm & Book Appointment</span>
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
