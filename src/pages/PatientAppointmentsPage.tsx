import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { storageService, getRelativeDate } from '../services/storage';
import { AppointmentWithDetails, AvailabilitySlot } from '../types';
import { StatusBadge } from '../components/StatusBadge';
import { ConfirmationModal } from '../components/ConfirmationModal';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  FileText, 
  RotateCcw, 
  X, 
  AlertCircle, 
  CheckCircle2, 
  CalendarPlus,
  Stethoscope,
  ChevronRight
} from 'lucide-react';

interface PatientAppointmentsPageProps {
  onBookNew: () => void;
}

export const PatientAppointmentsPage: React.FC<PatientAppointmentsPageProps> = ({ onBookNew }) => {
  const { currentUser } = useAuth();
  const [activeTab, setActiveTab] = useState<'upcoming' | 'completed' | 'cancelled'>('upcoming');
  
  // Modals state
  const [cancelModalOpen, setCancelModalOpen] = useState<boolean>(false);
  const [appointmentToCancel, setAppointmentToCancel] = useState<AppointmentWithDetails | null>(null);
  const [cancelReason, setCancelReason] = useState<string>('');
  const [cancelError, setCancelError] = useState<string>('');

  const [rescheduleModalOpen, setRescheduleModalOpen] = useState<boolean>(false);
  const [appointmentToReschedule, setAppointmentToReschedule] = useState<AppointmentWithDetails | null>(null);
  const [rescheduleDate, setRescheduleDate] = useState<string>(getRelativeDate(1));
  const [rescheduleSlotId, setRescheduleSlotId] = useState<string>('');
  const [rescheduleError, setRescheduleError] = useState<string>('');

  const appointments = storageService.getPatientAppointments(currentUser.id);

  const upcomingAppointments = appointments.filter(a => a.status === 'confirmed' || a.status === 'pending');
  const completedAppointments = appointments.filter(a => a.status === 'completed');
  const cancelledAppointments = appointments.filter(a => a.status === 'cancelled' || a.status === 'no_show');

  const displayedAppointments = 
    activeTab === 'upcoming' 
      ? upcomingAppointments 
      : activeTab === 'completed' 
      ? completedAppointments 
      : cancelledAppointments;

  // Handle Cancel Action
  const handleOpenCancel = (apt: AppointmentWithDetails) => {
    setAppointmentToCancel(apt);
    setCancelReason('');
    setCancelError('');
    setCancelModalOpen(true);
  };

  const handleConfirmCancel = () => {
    if (!appointmentToCancel) return;
    try {
      storageService.cancelAppointment(appointmentToCancel.id, cancelReason);
      setCancelModalOpen(false);
      setAppointmentToCancel(null);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to cancel appointment.';
      setCancelError(msg);
    }
  };

  // Handle Reschedule Action
  const handleOpenReschedule = (apt: AppointmentWithDetails) => {
    setAppointmentToReschedule(apt);
    setRescheduleDate(getRelativeDate(1));
    setRescheduleSlotId('');
    setRescheduleError('');
    setRescheduleModalOpen(true);
  };

  const handleConfirmReschedule = () => {
    if (!appointmentToReschedule || !rescheduleSlotId) {
      setRescheduleError('Please select a new time slot.');
      return;
    }

    try {
      storageService.rescheduleAppointment(appointmentToReschedule.id, rescheduleSlotId);
      setRescheduleModalOpen(false);
      setAppointmentToReschedule(null);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to reschedule appointment.';
      setRescheduleError(msg);
    }
  };

  // Get slots for rescheduling doctor
  const rescheduleDoctorSlots = appointmentToReschedule
    ? storageService.getDoctorSlots(appointmentToReschedule.doctor_id, rescheduleDate).filter(s => !s.is_booked)
    : [];

  const availableRescheduleDates = [1, 2, 3, 4, 5, 6].map(offset => {
    const dStr = getRelativeDate(offset);
    const dateObj = new Date(dStr + 'T00:00:00');
    return {
      dateStr: dStr,
      label: dateObj.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })
    };
  });

  return (
    <div className="space-y-6 pb-16">
      
      {/* Header */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Calendar className="text-[#1E5AA8]" size={24} />
            My Clinical Appointments
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            Review scheduled consultations, reschedule time slots, or view physician visit summaries.
          </p>
        </div>

        <button
          onClick={onBookNew}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#1E5AA8] hover:bg-[#164887] text-white text-xs font-bold rounded-lg transition-colors shadow-xs shrink-0 self-start sm:self-auto"
        >
          <CalendarPlus size={15} />
          <span>Book New Consultation</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex border-b border-slate-200 bg-white px-6 rounded-t-xl">
        <button
          onClick={() => setActiveTab('upcoming')}
          className={`py-3.5 px-4 text-xs font-bold border-b-2 transition-colors flex items-center gap-2 ${
            activeTab === 'upcoming'
              ? 'border-[#1E5AA8] text-[#1E5AA8]'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <span>Upcoming & Confirmed</span>
          <span className="px-2 py-0.5 rounded-full text-[10px] bg-blue-100 text-[#1E5AA8]">
            {upcomingAppointments.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('completed')}
          className={`py-3.5 px-4 text-xs font-bold border-b-2 transition-colors flex items-center gap-2 ${
            activeTab === 'completed'
              ? 'border-[#1E5AA8] text-[#1E5AA8]'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <span>Completed Visits</span>
          <span className="px-2 py-0.5 rounded-full text-[10px] bg-slate-100 text-slate-700">
            {completedAppointments.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('cancelled')}
          className={`py-3.5 px-4 text-xs font-bold border-b-2 transition-colors flex items-center gap-2 ${
            activeTab === 'cancelled'
              ? 'border-[#1E5AA8] text-[#1E5AA8]'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <span>Cancelled / Past</span>
          <span className="px-2 py-0.5 rounded-full text-[10px] bg-slate-100 text-slate-700">
            {cancelledAppointments.length}
          </span>
        </button>
      </div>

      {/* Appointments List */}
      {displayedAppointments.length === 0 ? (
        <div className="bg-white rounded-b-xl border-x border-b border-slate-200 p-12 text-center">
          <Calendar size={40} className="mx-auto text-slate-300 mb-3" />
          <h3 className="text-base font-semibold text-slate-900">
            No {activeTab} appointments found
          </h3>
          <p className="text-sm text-slate-500 mt-1 max-w-sm mx-auto">
            {activeTab === 'upcoming'
              ? 'You do not have any active appointments scheduled. Select a physician to book your next consultation.'
              : `You have no ${activeTab} visits in your patient log.`}
          </p>
          {activeTab === 'upcoming' && (
            <button
              onClick={onBookNew}
              className="mt-4 px-4 py-2 bg-[#1E5AA8] text-white text-xs font-semibold rounded-md hover:bg-[#164887]"
            >
              Book an Appointment
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {displayedAppointments.map(apt => (
            <div
              key={apt.id}
              className="bg-white rounded-xl border border-slate-200 p-6 hover:shadow-xs transition-shadow flex flex-col md:flex-row md:items-center md:justify-between gap-6"
            >
              <div className="flex-1 space-y-3">
                <div className="flex flex-wrap items-center gap-2.5">
                  <StatusBadge status={apt.status} />
                  <span className="text-xs font-bold uppercase tracking-wider text-[#1E5AA8] bg-blue-50 px-2 py-0.5 rounded-sm border border-blue-100">
                    {apt.department_name}
                  </span>
                  <span className="text-xs text-slate-500 font-mono">
                    Ref: {apt.id}
                  </span>
                </div>

                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    {apt.doctor_name}
                  </h3>
                  <p className="text-xs text-slate-600 font-medium">
                    {apt.doctor_specialty}
                  </p>
                </div>

                {/* Date, Time, Room Row */}
                <div className="flex flex-wrap items-center gap-4 text-xs text-slate-700 pt-1">
                  <div className="flex items-center gap-1.5 font-semibold text-slate-900">
                    <Calendar size={14} className="text-[#1E5AA8]" />
                    <span>{apt.slot_date}</span>
                  </div>
                  <div className="flex items-center gap-1.5 font-semibold text-slate-900">
                    <Clock size={14} className="text-[#1E5AA8]" />
                    <span>{apt.slot_start_time} - {apt.slot_end_time}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-slate-600">
                    <MapPin size={14} className="text-slate-400" />
                    <span>{apt.doctor_room}</span>
                  </div>
                </div>

                {/* Reason for Visit */}
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-100 text-xs">
                  <span className="font-semibold text-slate-700">Reason: </span>
                  <span className="text-slate-600">{apt.patient_reason}</span>
                  {apt.notes && (
                    <div className="mt-1.5 pt-1.5 border-t border-slate-200/60 text-slate-600">
                      <span className="font-semibold text-slate-700">Clinical Notes: </span>
                      <span>{apt.notes}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              {(apt.status === 'confirmed' || apt.status === 'pending') && (
                <div className="flex sm:flex-col gap-2 shrink-0 border-t md:border-t-0 md:border-l border-slate-100 pt-4 md:pt-0 md:pl-6">
                  <button
                    onClick={() => handleOpenReschedule(apt)}
                    className="flex-1 inline-flex items-center justify-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 rounded-lg transition-colors focus:outline-hidden"
                  >
                    <RotateCcw size={13} />
                    <span>Reschedule</span>
                  </button>

                  <button
                    onClick={() => handleOpenCancel(apt)}
                    className="flex-1 inline-flex items-center justify-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-rose-600 bg-rose-50 hover:bg-rose-100 rounded-lg transition-colors border border-rose-200 focus:outline-hidden"
                  >
                    <X size={13} />
                    <span>Cancel Visit</span>
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Confirmation Modal for Destructive Cancel Action (Rule R5) */}
      <ConfirmationModal
        isOpen={cancelModalOpen}
        title="Cancel Scheduled Appointment"
        message={`Are you sure you want to cancel your appointment with ${appointmentToCancel?.doctor_name} on ${appointmentToCancel?.slot_date} at ${appointmentToCancel?.slot_start_time}? This will release your time slot for other waiting patients.`}
        confirmText="Confirm Cancellation"
        cancelText="Keep Appointment"
        isDestructive={true}
        reasonPrompt={true}
        reasonValue={cancelReason}
        onReasonChange={setCancelReason}
        errorMessage={cancelError}
        onConfirm={handleConfirmCancel}
        onCancel={() => {
          setCancelModalOpen(false);
          setAppointmentToCancel(null);
          setCancelError('');
        }}
      />

      {/* Reschedule Modal */}
      {rescheduleModalOpen && appointmentToReschedule && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-lg w-full border border-slate-200 overflow-hidden">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Reschedule Appointment
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Select a new available slot with {appointmentToReschedule.doctor_name}
                </p>
              </div>
              <button
                onClick={() => setRescheduleModalOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X size={18} />
              </button>
            </div>

            <div className="p-5 space-y-4 max-h-[70vh] overflow-y-auto">
              
              {/* Select Date */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Select New Date
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {availableRescheduleDates.map(d => (
                    <button
                      key={d.dateStr}
                      type="button"
                      onClick={() => {
                        setRescheduleDate(d.dateStr);
                        setRescheduleSlotId('');
                      }}
                      className={`p-2 text-xs rounded-md border text-center font-medium transition-colors ${
                        rescheduleDate === d.dateStr
                          ? 'border-[#1E5AA8] bg-blue-50 text-[#1E5AA8] font-bold'
                          : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                      }`}
                    >
                      {d.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Available Slots */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Available Slots ({rescheduleDoctorSlots.length})
                </label>
                {rescheduleDoctorSlots.length === 0 ? (
                  <div className="text-xs text-slate-500 italic p-3 bg-slate-50 rounded-md border border-slate-100 text-center">
                    No open slots found on this date. Please select another date.
                  </div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {rescheduleDoctorSlots.map(slot => (
                      <button
                        key={slot.id}
                        type="button"
                        onClick={() => setRescheduleSlotId(slot.id)}
                        className={`p-2 text-xs rounded-md border text-center font-semibold transition-colors ${
                          rescheduleSlotId === slot.id
                            ? 'bg-[#1E5AA8] text-white border-[#1E5AA8]'
                            : 'bg-white text-slate-700 border-slate-300 hover:border-[#1E5AA8]'
                        }`}
                      >
                        {slot.start_time} - {slot.end_time}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {rescheduleError && (
                <div className="text-xs text-rose-600 bg-rose-50 p-2.5 rounded-md border border-rose-200">
                  {rescheduleError}
                </div>
              )}
            </div>

            <div className="bg-slate-50 px-5 py-3.5 flex justify-end gap-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setRescheduleModalOpen(false)}
                className="px-4 py-2 text-xs font-medium text-slate-700 bg-white border border-slate-300 rounded-md hover:bg-slate-100"
              >
                Keep Current Time
              </button>
              <button
                type="button"
                disabled={!rescheduleSlotId}
                onClick={handleConfirmReschedule}
                className="px-4 py-2 text-xs font-bold text-white bg-[#1E5AA8] hover:bg-[#164887] rounded-md disabled:bg-slate-400"
              >
                Confirm Reschedule
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
