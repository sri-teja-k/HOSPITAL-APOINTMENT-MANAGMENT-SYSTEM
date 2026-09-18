import React, { useState } from 'react';
import { storageService, getRelativeDate } from '../services/storage';
import { useAuth } from '../context/AuthContext';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  DollarSign, 
  ArrowLeft, 
  CheckCircle2, 
  AlertCircle, 
  FileText, 
  User,
  ShieldAlert,
  Stethoscope
} from 'lucide-react';

interface DoctorBookingPageProps {
  doctorId: string;
  onBack: () => void;
  onBookingSuccess: () => void;
}

export const DoctorBookingPage: React.FC<DoctorBookingPageProps> = ({
  doctorId,
  onBack,
  onBookingSuccess
}) => {
  const { currentUser } = useAuth();
  const doctor = storageService.getDoctorWithDetails(doctorId);

  // Default to tomorrow or today
  const [selectedDate, setSelectedDate] = useState<string>(getRelativeDate(1));
  const [selectedSlotId, setSelectedSlotId] = useState<string>('');
  const [reason, setReason] = useState<string>('');
  const [symptomsNotes, setSymptomsNotes] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [bookingConfirmed, setBookingConfirmed] = useState<boolean>(false);

  if (!doctor) {
    return (
      <div className="bg-white p-8 rounded-xl border border-slate-200 text-center">
        <AlertCircle size={32} className="mx-auto text-rose-500 mb-2" />
        <h2 className="text-lg font-bold text-slate-900">Physician Record Not Found</h2>
        <p className="text-sm text-slate-500 mt-1">The requested physician profile could not be loaded.</p>
        <button
          onClick={onBack}
          className="mt-4 px-4 py-2 bg-[#1E5AA8] text-white text-xs font-semibold rounded-md"
        >
          Return to Directory
        </button>
      </div>
    );
  }

  // Get available slots for the selected date
  const doctorSlots = storageService.getDoctorSlots(doctor.id, selectedDate);
  const morningSlots = doctorSlots.filter(s => parseInt(s.start_time.split(':')[0], 10) < 13);
  const afternoonSlots = doctorSlots.filter(s => parseInt(s.start_time.split(':')[0], 10) >= 13);

  // Date selection tabs (today through next 5 days)
  const availableDates = [0, 1, 2, 3, 4, 5].map(offset => {
    const dStr = getRelativeDate(offset);
    const dateObj = new Date(dStr + 'T00:00:00');
    const dayName = offset === 0 ? 'Today' : offset === 1 ? 'Tomorrow' : dateObj.toLocaleDateString('en-US', { weekday: 'short' });
    const monthDay = dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    return { dateStr: dStr, dayName, monthDay };
  });

  const handleConfirmBooking = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!selectedSlotId) {
      setErrorMsg('Please select an available time slot.');
      return;
    }

    if (!reason.trim()) {
      setErrorMsg('Please specify the primary reason for this clinical visit.');
      return;
    }

    setIsSubmitting(true);
    try {
      storageService.bookAppointment({
        patient_id: currentUser.id,
        doctor_id: doctor.id,
        slot_id: selectedSlotId,
        patient_reason: reason.trim(),
        notes: symptomsNotes.trim()
      });

      setBookingConfirmed(true);
      setTimeout(() => {
        onBookingSuccess();
      }, 1500);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'An error occurred while confirming appointment.';
      setErrorMsg(msg);
      setIsSubmitting(false);
    }
  };

  const selectedSlot = doctorSlots.find(s => s.id === selectedSlotId);

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-16">
      
      {/* Top Breadcrumb / Back Button */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-[#1E5AA8] transition-colors"
        >
          <ArrowLeft size={16} />
          <span>Back to Physician Directory</span>
        </button>
        <span className="text-xs text-slate-500 font-medium">
          Step 2 of 2: Select Date, Slot, and Reason
        </span>
      </div>

      {bookingConfirmed && (
        <div className="bg-emerald-50 border border-emerald-200 p-6 rounded-xl text-center space-y-2 animate-fadeIn">
          <CheckCircle2 size={36} className="mx-auto text-emerald-600" />
          <h2 className="text-lg font-bold text-emerald-900">
            Appointment Successfully Confirmed
          </h2>
          <p className="text-sm text-emerald-700">
            Your appointment with {doctor.full_name} has been booked. Redirecting to your appointments...
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Cols: Slot Picker & Consultation Details */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Doctor Header Card */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 flex items-start gap-4">
            <img
              src={doctor.photo_url}
              alt={doctor.full_name}
              referrerPolicy="no-referrer"
              className="w-16 h-16 rounded-lg object-cover border border-slate-200 shrink-0 bg-slate-100"
            />
            <div className="flex-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#1E5AA8] bg-blue-50 px-2 py-0.5 rounded-sm border border-blue-100">
                {doctor.department_name}
              </span>
              <h2 className="text-lg font-bold text-slate-900 mt-1">
                {doctor.full_name}
              </h2>
              <p className="text-xs font-medium text-slate-600">
                {doctor.specialty}
              </p>
              <div className="flex items-center gap-4 mt-2 text-xs text-slate-500">
                <span className="flex items-center gap-1">
                  <MapPin size={12} />
                  {doctor.room_number}
                </span>
                <span className="flex items-center gap-1">
                  <DollarSign size={12} />
                  Fee: ${doctor.consultation_fee}
                </span>
              </div>
            </div>
          </div>

          {/* Date Selector */}
          <div className="bg-white p-6 rounded-xl border border-slate-200 space-y-4">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Calendar size={16} className="text-[#1E5AA8]" />
              Select Appointment Date
            </h3>

            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
              {availableDates.map(item => {
                const isSelected = selectedDate === item.dateStr;
                return (
                  <button
                    key={item.dateStr}
                    type="button"
                    onClick={() => {
                      setSelectedDate(item.dateStr);
                      setSelectedSlotId(''); // Reset slot selection when date changes
                    }}
                    className={`p-3 rounded-lg border text-center transition-all focus:outline-hidden ${
                      isSelected
                        ? 'border-[#1E5AA8] bg-blue-50 text-[#1E5AA8] font-bold shadow-xs'
                        : 'border-slate-200 hover:border-slate-300 bg-white text-slate-700'
                    }`}
                  >
                    <div className="text-xs font-medium">{item.dayName}</div>
                    <div className="text-xs mt-0.5 opacity-80">{item.monthDay}</div>
                  </button>
                );
              })}
            </div>

            {/* Time Slot Picker */}
            <div className="pt-4 border-t border-slate-100 space-y-5">
              
              {/* Morning Slots */}
              <div>
                <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                  <Clock size={13} />
                  Morning Availability (09:00 - 12:00)
                </div>
                {morningSlots.length === 0 ? (
                  <div className="text-xs text-slate-400 italic py-1">
                    No morning slots available on this date.
                  </div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {morningSlots.map(slot => {
                      const isSelected = selectedSlotId === slot.id;
                      return (
                        <button
                          key={slot.id}
                          type="button"
                          disabled={slot.is_booked}
                          onClick={() => setSelectedSlotId(slot.id)}
                          className={`px-3 py-2 text-xs font-semibold rounded-md border text-center transition-all ${
                            slot.is_booked
                              ? 'bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed line-through'
                              : isSelected
                              ? 'bg-[#1E5AA8] text-white border-[#1E5AA8] shadow-xs'
                              : 'bg-white text-slate-700 border-slate-300 hover:border-[#1E5AA8] hover:text-[#1E5AA8]'
                          }`}
                        >
                          <div>{slot.start_time} - {slot.end_time}</div>
                          {slot.is_booked && (
                            <div className="text-[10px] uppercase tracking-wider font-normal">Booked</div>
                          )}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Afternoon Slots */}
              <div>
                <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                  <Clock size={13} />
                  Afternoon Availability (14:00 - 17:30)
                </div>
                {afternoonSlots.length === 0 ? (
                  <div className="text-xs text-slate-400 italic py-1">
                    No afternoon slots available on this date.
                  </div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {afternoonSlots.map(slot => {
                      const isSelected = selectedSlotId === slot.id;
                      return (
                        <button
                          key={slot.id}
                          type="button"
                          disabled={slot.is_booked}
                          onClick={() => setSelectedSlotId(slot.id)}
                          className={`px-3 py-2 text-xs font-semibold rounded-md border text-center transition-all ${
                            slot.is_booked
                              ? 'bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed line-through'
                              : isSelected
                              ? 'bg-[#1E5AA8] text-white border-[#1E5AA8] shadow-xs'
                              : 'bg-white text-slate-700 border-slate-300 hover:border-[#1E5AA8] hover:text-[#1E5AA8]'
                          }`}
                        >
                          <div>{slot.start_time} - {slot.end_time}</div>
                          {slot.is_booked && (
                            <div className="text-[10px] uppercase tracking-wider font-normal">Booked</div>
                          )}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

            </div>
          </div>

          {/* Consultation Reason & Symptoms Form */}
          <div className="bg-white p-6 rounded-xl border border-slate-200 space-y-4">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <FileText size={16} className="text-[#1E5AA8]" />
              Consultation Details & Symptoms
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Primary Reason for Visit *
                </label>
                <input
                  type="text"
                  required
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="e.g. Chronic chest tightness, annual cardiology checkup, medication renewal"
                  className="w-full text-sm border border-slate-300 rounded-lg p-2.5 focus:ring-2 focus:ring-[#1E5AA8] focus:border-[#1E5AA8] outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Specific Symptoms or Medical History Notes (Optional)
                </label>
                <textarea
                  value={symptomsNotes}
                  onChange={(e) => setSymptomsNotes(e.target.value)}
                  placeholder="Describe when symptoms started, previous diagnoses, current medications, or specific physician questions..."
                  rows={3}
                  className="w-full text-sm border border-slate-300 rounded-lg p-2.5 focus:ring-2 focus:ring-[#1E5AA8] focus:border-[#1E5AA8] outline-hidden"
                />
              </div>
            </div>
          </div>

        </div>

        {/* Right 1 Col: Booking Confirmation Summary */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-xl border border-slate-200 space-y-5 sticky top-20">
            <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
              <User size={16} className="text-[#1E5AA8]" />
              Booking Summary
            </h3>

            {/* Patient Info */}
            <div className="space-y-2 text-xs">
              <div className="text-slate-500 font-medium">Patient Details</div>
              <div className="font-semibold text-slate-800">{currentUser.full_name}</div>
              <div className="text-slate-600">{currentUser.email}</div>
              <div className="text-slate-600">{currentUser.phone}</div>
            </div>

            {/* Appointment Details */}
            <div className="space-y-2.5 text-xs pt-3 border-t border-slate-100">
              <div className="flex justify-between">
                <span className="text-slate-500">Department:</span>
                <span className="font-medium text-slate-800">{doctor.department_name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Physician:</span>
                <span className="font-semibold text-slate-800">{doctor.full_name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Date:</span>
                <span className="font-semibold text-slate-800">{selectedDate}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Time Slot:</span>
                {selectedSlot ? (
                  <span className="font-bold text-[#1E5AA8]">
                    {selectedSlot.start_time} - {selectedSlot.end_time}
                  </span>
                ) : (
                  <span className="text-slate-400 italic">Not selected</span>
                )}
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Location:</span>
                <span className="font-medium text-slate-800">{doctor.room_number}</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-slate-100">
                <span className="text-slate-500 font-semibold">Consultation Fee:</span>
                <span className="text-base font-bold text-slate-900">${doctor.consultation_fee}</span>
              </div>
            </div>

            {/* Conflict-Free Guarantee Notice */}
            <div className="p-3 bg-blue-50/60 rounded-lg border border-blue-100 flex items-start gap-2 text-xs text-blue-900">
              <CheckCircle2 size={15} className="text-[#1E5AA8] shrink-0 mt-0.5" />
              <span>
                Zero double-booking guarantee: Confirmed instantly upon submission with conflict-free slot reservation.
              </span>
            </div>

            {errorMsg && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg flex items-start gap-2 text-xs text-rose-700">
                <AlertCircle size={15} className="shrink-0 mt-0.5" />
                <span>{errorMsg}</span>
              </div>
            )}

            <button
              type="button"
              disabled={isSubmitting || !selectedSlotId || bookingConfirmed}
              onClick={handleConfirmBooking}
              className={`w-full py-3 px-4 text-sm font-bold text-white rounded-lg transition-all shadow-xs flex items-center justify-center gap-2 ${
                isSubmitting || !selectedSlotId || bookingConfirmed
                  ? 'bg-slate-400 cursor-not-allowed'
                  : 'bg-[#1E5AA8] hover:bg-[#164887] active:scale-[0.99]'
              }`}
            >
              {isSubmitting ? (
                <span>Confirming Booking...</span>
              ) : (
                <>
                  <CheckCircle2 size={16} />
                  <span>Confirm Appointment</span>
                </>
              )}
            </button>

            <p className="text-[11px] text-slate-400 text-center">
              Free rescheduling or cancellation up to 4 hours prior to consultation time.
            </p>
          </div>
        </div>

      </div>

    </div>
  );
};
