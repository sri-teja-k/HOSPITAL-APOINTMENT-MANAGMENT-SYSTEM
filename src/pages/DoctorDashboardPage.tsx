import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { storageService, getRelativeDate } from '../services/storage';
import { AppointmentWithDetails, AppointmentStatus, AvailabilitySlot } from '../types';
import { StatusBadge } from '../components/StatusBadge';
import { ConfirmationModal } from '../components/ConfirmationModal';
import { 
  CalendarClock, 
  Calendar, 
  Clock, 
  User, 
  Phone, 
  FileText, 
  Check, 
  X, 
  AlertCircle, 
  CheckCircle2, 
  Plus, 
  Trash2, 
  Stethoscope,
  ChevronRight,
  ClipboardList
} from 'lucide-react';

export const DoctorDashboardPage: React.FC = () => {
  const { currentUser } = useAuth();
  const doctor = storageService.getDoctorWithDetails(currentUser.id);

  const [activeTab, setActiveTab] = useState<'queue' | 'slots'>('queue');
  const [selectedDateFilter, setSelectedDateFilter] = useState<string>('all');
  
  // Status modal
  const [editingApt, setEditingApt] = useState<AppointmentWithDetails | null>(null);
  const [physicianNotes, setPhysicianNotes] = useState<string>('');

  // Cancel modal
  const [cancelModalOpen, setCancelModalOpen] = useState<boolean>(false);
  const [aptToCancel, setAptToCancel] = useState<AppointmentWithDetails | null>(null);

  // New slot form
  const [newSlotDate, setNewSlotDate] = useState<string>(getRelativeDate(1));
  const [newSlotStartTime, setNewSlotStartTime] = useState<string>('09:00');
  const [newSlotEndTime, setNewSlotEndTime] = useState<string>('09:45');
  const [slotCreateMsg, setSlotCreateMsg] = useState<string>('');

  const appointments = storageService.getDoctorAppointments(currentUser.id);
  const allSlots = storageService.getDoctorSlots(currentUser.id);

  const filteredAppointments = appointments.filter(a => {
    if (selectedDateFilter === 'all') return true;
    return a.slot_date === selectedDateFilter;
  });

  // Doctor metrics
  const todayStr = getRelativeDate(0);
  const todayAppointments = appointments.filter(a => a.slot_date === todayStr);
  const completedCount = appointments.filter(a => a.status === 'completed').length;
  const confirmedCount = appointments.filter(a => a.status === 'confirmed').length;

  const handleUpdateStatus = (apt: AppointmentWithDetails, newStatus: AppointmentStatus) => {
    if (newStatus === 'completed') {
      setEditingApt(apt);
      setPhysicianNotes(apt.notes || '');
      return;
    }
    storageService.updateAppointmentStatus(apt.id, newStatus);
  };

  const handleSaveCompletedWithNotes = () => {
    if (!editingApt) return;
    storageService.updateAppointmentStatus(editingApt.id, 'completed', physicianNotes);
    setEditingApt(null);
  };

  const handleOpenCancel = (apt: AppointmentWithDetails) => {
    setAptToCancel(apt);
    setCancelModalOpen(true);
  };

  const handleConfirmCancel = () => {
    if (!aptToCancel) return;
    storageService.cancelAppointment(aptToCancel.id, 'Physician clinical schedule adjustment');
    setCancelModalOpen(false);
    setAptToCancel(null);
  };

  const handleCreateSlot = (e: React.FormEvent) => {
    e.preventDefault();
    setSlotCreateMsg('');
    try {
      storageService.createAvailabilitySlot({
        doctor_id: currentUser.id,
        date: newSlotDate,
        start_time: newSlotStartTime,
        end_time: newSlotEndTime,
        is_booked: false
      });
      setSlotCreateMsg('Time slot created successfully.');
      setTimeout(() => setSlotCreateMsg(''), 3000);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error creating slot';
      setSlotCreateMsg(msg);
    }
  };

  const handleDeleteSlot = (slotId: string) => {
    try {
      storageService.deleteAvailabilitySlot(slotId);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Cannot delete slot';
      alert(msg);
    }
  };

  return (
    <div className="space-y-6 pb-16">
      
      {/* Header Banner */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 text-xs font-bold uppercase tracking-wider bg-blue-50 text-[#1E5AA8] rounded-sm border border-blue-100">
              Physician Portal
            </span>
            <span className="text-xs text-slate-500">
              {doctor?.department_name} - {doctor?.room_number}
            </span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 mt-1 flex items-center gap-2">
            <CalendarClock className="text-[#1E5AA8]" size={24} />
            {currentUser.full_name}
          </h1>
          <p className="text-xs text-slate-600 mt-0.5">
            {doctor?.specialty} | {doctor?.qualification}
          </p>
        </div>

        {/* Quick KPI stats */}
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 text-center min-w-[90px]">
            <div className="text-lg font-bold text-slate-900">{todayAppointments.length}</div>
            <div className="text-[11px] text-slate-500 font-medium">Today&apos;s Visits</div>
          </div>
          <div className="bg-emerald-50 p-3 rounded-lg border border-emerald-200 text-center min-w-[90px]">
            <div className="text-lg font-bold text-emerald-700">{confirmedCount}</div>
            <div className="text-[11px] text-emerald-800 font-medium">Confirmed</div>
          </div>
          <div className="bg-blue-50 p-3 rounded-lg border border-blue-200 text-center min-w-[90px]">
            <div className="text-lg font-bold text-[#1E5AA8]">{completedCount}</div>
            <div className="text-[11px] text-blue-800 font-medium">Completed</div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 bg-white px-6 rounded-t-xl">
        <button
          onClick={() => setActiveTab('queue')}
          className={`py-3.5 px-4 text-xs font-bold border-b-2 transition-colors flex items-center gap-2 ${
            activeTab === 'queue'
              ? 'border-[#1E5AA8] text-[#1E5AA8]'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <ClipboardList size={15} />
          <span>Patient Appointment Queue ({appointments.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('slots')}
          className={`py-3.5 px-4 text-xs font-bold border-b-2 transition-colors flex items-center gap-2 ${
            activeTab === 'slots'
              ? 'border-[#1E5AA8] text-[#1E5AA8]'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Clock size={15} />
          <span>Manage Availability Slots ({allSlots.length})</span>
        </button>
      </div>

      {/* TAB 1: Queue */}
      {activeTab === 'queue' && (
        <div className="space-y-4">
          
          {/* Filter Bar */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-slate-700">Filter by Consultation Date:</span>
              <select
                value={selectedDateFilter}
                onChange={(e) => setSelectedDateFilter(e.target.value)}
                className="px-3 py-1.5 bg-slate-50 border border-slate-300 rounded-md font-medium text-slate-800 outline-hidden"
              >
                <option value="all">All Dates ({appointments.length})</option>
                <option value={getRelativeDate(0)}>Today ({todayAppointments.length})</option>
                <option value={getRelativeDate(1)}>Tomorrow</option>
                <option value={getRelativeDate(2)}>In 2 Days</option>
                <option value={getRelativeDate(3)}>In 3 Days</option>
              </select>
            </div>

            <div className="text-slate-500 font-medium">
              Showing {filteredAppointments.length} appointment records
            </div>
          </div>

          {filteredAppointments.length === 0 ? (
            <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
              <CalendarClock size={40} className="mx-auto text-slate-300 mb-3" />
              <h3 className="text-base font-semibold text-slate-900">No appointments scheduled</h3>
              <p className="text-sm text-slate-500 mt-1">
                There are no patient consultations booked for the selected timeframe.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredAppointments.map(apt => {
                const patientProfile = storageService.getProfileById(apt.patient_id);
                return (
                  <div
                    key={apt.id}
                    className="bg-white rounded-xl border border-slate-200 p-6 hover:shadow-xs transition-shadow flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6"
                  >
                    <div className="space-y-3 flex-1">
                      <div className="flex flex-wrap items-center gap-2.5">
                        <StatusBadge status={apt.status} />
                        <span className="text-xs font-bold text-slate-900 bg-slate-100 px-2.5 py-0.5 rounded-sm">
                          {apt.slot_date} at {apt.slot_start_time} - {apt.slot_end_time}
                        </span>
                        <span className="text-xs font-mono text-slate-400">
                          ID: {apt.id}
                        </span>
                      </div>

                      {/* Patient Details */}
                      <div>
                        <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                          <User size={16} className="text-[#1E5AA8]" />
                          {apt.patient_name}
                        </h3>
                        <div className="flex flex-wrap items-center gap-4 text-xs text-slate-600 mt-1">
                          <span className="flex items-center gap-1">
                            <Phone size={12} className="text-slate-400" />
                            {apt.patient_phone || 'No phone recorded'}
                          </span>
                          <span>Email: {apt.patient_email}</span>
                          {patientProfile?.blood_group && (
                            <span className="text-slate-500 font-semibold">
                              Blood: {patientProfile.blood_group}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Consultation reason & Medical context */}
                      <div className="p-3 bg-slate-50 rounded-lg border border-slate-100 text-xs space-y-1.5">
                        <div>
                          <span className="font-semibold text-slate-700">Patient Chief Complaint: </span>
                          <span className="text-slate-800 font-medium">{apt.patient_reason}</span>
                        </div>
                        {patientProfile?.allergies && (
                          <div>
                            <span className="font-semibold text-rose-700">Allergies: </span>
                            <span className="text-rose-600">{patientProfile.allergies}</span>
                          </div>
                        )}
                        {apt.notes && (
                          <div className="pt-1 border-t border-slate-200/60">
                            <span className="font-semibold text-slate-700">Physician Visit Notes: </span>
                            <span className="text-slate-700">{apt.notes}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Status Management Actions */}
                    <div className="lg:w-48 shrink-0 flex flex-col gap-2 pt-3 lg:pt-0 border-t lg:border-t-0 border-slate-100">
                      <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                        Update Status
                      </div>

                      {apt.status !== 'completed' && (
                        <button
                          onClick={() => handleUpdateStatus(apt, 'completed')}
                          className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-bold text-white bg-[#1E5AA8] hover:bg-[#164887] rounded-md transition-colors shadow-2xs"
                        >
                          <Check size={14} />
                          <span>Mark Completed</span>
                        </button>
                      )}

                      {apt.status !== 'confirmed' && apt.status !== 'completed' && (
                        <button
                          onClick={() => handleUpdateStatus(apt, 'confirmed')}
                          className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-md border border-emerald-200 transition-colors"
                        >
                          <CheckCircle2 size={13} />
                          <span>Confirm Booking</span>
                        </button>
                      )}

                      {apt.status !== 'no_show' && apt.status !== 'completed' && (
                        <button
                          onClick={() => handleUpdateStatus(apt, 'no_show')}
                          className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-50 hover:bg-slate-100 rounded-md border border-slate-200 transition-colors"
                        >
                          <AlertCircle size={13} />
                          <span>Mark No-Show</span>
                        </button>
                      )}

                      {apt.status !== 'cancelled' && apt.status !== 'completed' && (
                        <button
                          onClick={() => handleOpenCancel(apt)}
                          className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-rose-600 bg-rose-50 hover:bg-rose-100 rounded-md border border-rose-200 transition-colors"
                        >
                          <X size={13} />
                          <span>Cancel Consultation</span>
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: Availability Slots Manager */}
      {activeTab === 'slots' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Create New Slot Form */}
          <div className="bg-white p-6 rounded-xl border border-slate-200 space-y-4">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Plus size={16} className="text-[#1E5AA8]" />
              Create Availability Slot
            </h3>
            <p className="text-xs text-slate-500">
              Add individual consultation windows to your public schedule.
            </p>

            <form onSubmit={handleCreateSlot} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Consultation Date
                </label>
                <input
                  type="date"
                  required
                  value={newSlotDate}
                  onChange={(e) => setNewSlotDate(e.target.value)}
                  className="w-full text-xs border border-slate-300 rounded-md p-2 focus:ring-2 focus:ring-[#1E5AA8] outline-hidden"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Start Time
                  </label>
                  <input
                    type="time"
                    required
                    value={newSlotStartTime}
                    onChange={(e) => setNewSlotStartTime(e.target.value)}
                    className="w-full text-xs border border-slate-300 rounded-md p-2 focus:ring-2 focus:ring-[#1E5AA8] outline-hidden"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    End Time
                  </label>
                  <input
                    type="time"
                    required
                    value={newSlotEndTime}
                    onChange={(e) => setNewSlotEndTime(e.target.value)}
                    className="w-full text-xs border border-slate-300 rounded-md p-2 focus:ring-2 focus:ring-[#1E5AA8] outline-hidden"
                  />
                </div>
              </div>

              {slotCreateMsg && (
                <div className="text-xs text-blue-700 bg-blue-50 p-2 rounded-md border border-blue-200">
                  {slotCreateMsg}
                </div>
              )}

              <button
                type="submit"
                className="w-full py-2.5 px-4 bg-[#1E5AA8] hover:bg-[#164887] text-white text-xs font-bold rounded-md transition-colors"
              >
                Add Availability Slot
              </button>
            </form>
          </div>

          {/* Existing Slots List */}
          <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Clock size={16} className="text-[#1E5AA8]" />
                Active Availability Slots ({allSlots.length})
              </h3>
              <span className="text-xs text-slate-500">
                Booked slots cannot be removed while active.
              </span>
            </div>

            <div className="max-h-[500px] overflow-y-auto divide-y divide-slate-100 border border-slate-200 rounded-lg">
              {allSlots.length === 0 ? (
                <div className="p-8 text-center text-xs text-slate-500">
                  No slots currently generated.
                </div>
              ) : (
                allSlots.map(slot => (
                  <div key={slot.id} className="p-3.5 flex items-center justify-between hover:bg-slate-50 text-xs">
                    <div className="flex items-center gap-3">
                      <span className="font-semibold text-slate-900">{slot.date}</span>
                      <span className="text-slate-600 font-mono">
                        {slot.start_time} - {slot.end_time}
                      </span>
                      {slot.is_booked ? (
                        <span className="px-2 py-0.5 rounded-sm bg-rose-50 text-rose-700 font-semibold text-[11px] border border-rose-200">
                          Booked by Patient
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-sm bg-emerald-50 text-emerald-700 font-semibold text-[11px] border border-emerald-200">
                          Open Slot
                        </span>
                      )}
                    </div>

                    {!slot.is_booked && (
                      <button
                        onClick={() => handleDeleteSlot(slot.id)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 rounded-md transition-colors"
                        title="Delete slot"
                      >
                        <Trash2 size={14} />
                      </button>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>

        </div>
      )}

      {/* Modal to complete appointment with notes */}
      {editingApt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-lg w-full border border-slate-200 overflow-hidden">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Complete Visit & Add Clinical Notes
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Patient: {editingApt.patient_name} ({editingApt.slot_date} at {editingApt.slot_start_time})
                </p>
              </div>
              <button
                onClick={() => setEditingApt(null)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X size={18} />
              </button>
            </div>

            <div className="p-5 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Physician Consultation & Prescription Notes
                </label>
                <textarea
                  rows={4}
                  value={physicianNotes}
                  onChange={(e) => setPhysicianNotes(e.target.value)}
                  placeholder="Record diagnosis summary, treatment instructions, prescribed pharmaceuticals, or follow-up recommendations..."
                  className="w-full text-xs border border-slate-300 rounded-md p-2.5 focus:ring-2 focus:ring-[#1E5AA8] outline-hidden"
                />
              </div>
            </div>

            <div className="bg-slate-50 px-5 py-3.5 flex justify-end gap-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setEditingApt(null)}
                className="px-4 py-2 text-xs font-medium text-slate-700 bg-white border border-slate-300 rounded-md hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveCompletedWithNotes}
                className="px-4 py-2 text-xs font-bold text-white bg-[#1E5AA8] hover:bg-[#164887] rounded-md"
              >
                Save & Mark Completed
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Modal for destructive cancel (Rule R5) */}
      <ConfirmationModal
        isOpen={cancelModalOpen}
        title="Cancel Patient Consultation"
        message={`Are you sure you want to cancel the appointment with ${aptToCancel?.patient_name} on ${aptToCancel?.slot_date} at ${aptToCancel?.slot_start_time}? The patient will receive an automated cancellation notification.`}
        confirmText="Confirm Cancellation"
        cancelText="Keep Consultation"
        isDestructive={true}
        onConfirm={handleConfirmCancel}
        onCancel={() => {
          setCancelModalOpen(false);
          setAptToCancel(null);
        }}
      />

    </div>
  );
};
