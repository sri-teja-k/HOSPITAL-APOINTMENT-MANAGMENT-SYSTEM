import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { storageService } from '../services/storage';
import { StatusBadge } from '../components/StatusBadge';
import { 
  User, 
  Mail, 
  Phone, 
  AlertTriangle, 
  Heart, 
  ShieldAlert, 
  Check, 
  Calendar, 
  Clock, 
  FileText,
  Activity
} from 'lucide-react';

export const PatientProfilePage: React.FC = () => {
  const { currentUser, updateCurrentUserProfile } = useAuth();
  
  const [fullName, setFullName] = useState(currentUser.full_name);
  const [phone, setPhone] = useState(currentUser.phone);
  const [bloodGroup, setBloodGroup] = useState(currentUser.blood_group || 'O Positive');
  const [allergies, setAllergies] = useState(currentUser.allergies || '');
  const [medicalNotes, setMedicalNotes] = useState(currentUser.medical_history_notes || '');
  const [emergencyContact, setEmergencyContact] = useState(currentUser.emergency_contact || '');
  const [saveSuccess, setSaveSuccess] = useState(false);

  const pastAppointments = storageService.getPatientAppointments(currentUser.id);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateCurrentUserProfile({
      full_name: fullName,
      phone,
      blood_group: bloodGroup,
      allergies,
      medical_history_notes: medicalNotes,
      emergency_contact: emergencyContact
    });
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-16">
      
      {/* Header */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <User className="text-[#1E5AA8]" size={24} />
            Patient Clinical Profile
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            Manage your personal medical history, known allergies, and emergency contact information.
          </p>
        </div>

        <div className="text-xs text-slate-500 font-mono bg-slate-50 px-3 py-1.5 rounded-md border border-slate-200 self-start sm:self-auto">
          Patient ID: {currentUser.id}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Profile Edit Form */}
        <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-slate-200">
          <form onSubmit={handleSave} className="space-y-5">
            <h2 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
              <Activity size={18} className="text-[#1E5AA8]" />
              Personal & Clinical Details
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Full Legal Name *
                </label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full text-xs border border-slate-300 rounded-md p-2.5 focus:ring-2 focus:ring-[#1E5AA8] outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  disabled
                  value={currentUser.email}
                  className="w-full text-xs border border-slate-200 bg-slate-100 rounded-md p-2.5 text-slate-500 cursor-not-allowed"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Phone Number
                </label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+1 (555) 234-5678"
                  className="w-full text-xs border border-slate-300 rounded-md p-2.5 focus:ring-2 focus:ring-[#1E5AA8] outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Blood Group
                </label>
                <select
                  value={bloodGroup}
                  onChange={(e) => setBloodGroup(e.target.value)}
                  className="w-full text-xs border border-slate-300 rounded-md p-2.5 focus:ring-2 focus:ring-[#1E5AA8] outline-hidden bg-white"
                >
                  <option value="A Positive">A Positive (A+)</option>
                  <option value="A Negative">A Negative (A-)</option>
                  <option value="B Positive">B Positive (B+)</option>
                  <option value="B Negative">B Negative (B-)</option>
                  <option value="AB Positive">AB Positive (AB+)</option>
                  <option value="AB Negative">AB Negative (AB-)</option>
                  <option value="O Positive">O Positive (O+)</option>
                  <option value="O Negative">O Negative (O-)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Emergency Contact Name & Phone
              </label>
              <input
                type="text"
                value={emergencyContact}
                onChange={(e) => setEmergencyContact(e.target.value)}
                placeholder="e.g. John Doe (Spouse) - +1 (555) 123-4567"
                className="w-full text-xs border border-slate-300 rounded-md p-2.5 focus:ring-2 focus:ring-[#1E5AA8] outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1 text-rose-700">
                <AlertTriangle size={13} />
                Known Allergies & Adverse Drug Reactions
              </label>
              <input
                type="text"
                value={allergies}
                onChange={(e) => setAllergies(e.target.value)}
                placeholder="e.g. Penicillin, Latex, Sulfa drugs, Peanuts"
                className="w-full text-xs border border-slate-300 rounded-md p-2.5 focus:ring-2 focus:ring-[#1E5AA8] outline-hidden"
              />
              <p className="text-[11px] text-slate-400 mt-1">
                Attending physicians will review these allergies before prescribing medication.
              </p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Medical History & Ongoing Conditions
              </label>
              <textarea
                rows={3}
                value={medicalNotes}
                onChange={(e) => setMedicalNotes(e.target.value)}
                placeholder="List chronic conditions, past surgeries, implants, or current daily medications..."
                className="w-full text-xs border border-slate-300 rounded-md p-2.5 focus:ring-2 focus:ring-[#1E5AA8] outline-hidden"
              />
            </div>

            {saveSuccess && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-md text-xs text-emerald-800 flex items-center gap-2">
                <Check size={16} className="text-emerald-600" />
                <span>Clinical profile updated successfully.</span>
              </div>
            )}

            <div className="pt-3 border-t border-slate-100 flex justify-end">
              <button
                type="submit"
                className="px-5 py-2.5 bg-[#1E5AA8] hover:bg-[#164887] text-white text-xs font-bold rounded-lg transition-colors shadow-xs"
              >
                Save Profile Changes
              </button>
            </div>
          </form>
        </div>

        {/* Right column: Patient Visit History */}
        <div className="space-y-6">
          <div className="bg-white p-5 rounded-xl border border-slate-200 space-y-4">
            <h2 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
              <Clock size={16} className="text-[#1E5AA8]" />
              Visit History ({pastAppointments.length})
            </h2>

            {pastAppointments.length === 0 ? (
              <div className="text-xs text-slate-400 py-6 text-center">
                No past consultations recorded.
              </div>
            ) : (
              <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
                {pastAppointments.map(apt => (
                  <div key={apt.id} className="p-3 bg-slate-50 rounded-lg border border-slate-100 text-xs space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-slate-900">{apt.doctor_name}</span>
                      <StatusBadge status={apt.status} size="sm" />
                    </div>
                    <div className="text-[11px] text-slate-500 font-mono">
                      {apt.slot_date} at {apt.slot_start_time}
                    </div>
                    <div className="text-slate-600 line-clamp-2">
                      Reason: {apt.patient_reason}
                    </div>
                    {apt.notes && (
                      <div className="text-[11px] text-slate-500 pt-1 border-t border-slate-200/60">
                        Doctor Note: {apt.notes}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

      </div>

    </div>
  );
};
