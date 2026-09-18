import React, { useState } from 'react';
import { storageService } from '../services/storage';
import { DoctorWithDetails } from '../types';
import { 
  Search, 
  Filter, 
  Calendar, 
  MapPin, 
  Clock, 
  Award, 
  ArrowRight, 
  DollarSign, 
  Stethoscope,
  Briefcase
} from 'lucide-react';

interface DoctorDirectoryPageProps {
  onSelectDoctorToBook: (doctorId: string) => void;
}

export const DoctorDirectoryPage: React.FC<DoctorDirectoryPageProps> = ({ onSelectDoctorToBook }) => {
  const [selectedDeptId, setSelectedDeptId] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const departments = storageService.getDepartments();
  const doctors = storageService.getAllDoctorsWithDetails();
  const allSlots = storageService.getAvailabilitySlots();

  // Filter doctors
  const filteredDoctors = doctors.filter(doc => {
    const matchesDept = selectedDeptId === 'all' || doc.department_id === selectedDeptId;
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch = !q || 
      doc.full_name.toLowerCase().includes(q) ||
      doc.specialty.toLowerCase().includes(q) ||
      doc.department_name.toLowerCase().includes(q);
    return matchesDept && matchesSearch;
  });

  const getNextAvailableSlot = (doctorId: string) => {
    const todayStr = new Date().toISOString().split('T')[0];
    const openSlots = allSlots
      .filter(s => s.doctor_id === doctorId && !s.is_booked && s.date >= todayStr)
      .sort((a, b) => a.date.localeCompare(b.date) || a.start_time.localeCompare(b.start_time));

    return openSlots.length > 0 ? openSlots[0] : null;
  };

  return (
    <div className="space-y-6 pb-16">
      
      {/* Page Header */}
      <div className="bg-white p-6 rounded-xl border border-slate-200">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <Stethoscope className="text-[#1E5AA8]" size={24} />
              Hospital Physician Directory
            </h1>
            <p className="text-sm text-slate-600 mt-1">
              Select an attending specialist, review qualifications and clinic location, then schedule a consultation.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs font-medium text-slate-500 bg-slate-50 px-3 py-2 rounded-lg border border-slate-200">
            <Calendar size={15} className="text-[#1E5AA8]" />
            <span>Real-time appointment availability</span>
          </div>
        </div>

        {/* Filter and Search Bar */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-6 pt-5 border-t border-slate-100">
          
          {/* Search Input */}
          <div className="relative md:col-span-2">
            <Search size={17} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by physician name, specialty, or condition..."
              className="w-full pl-10 pr-4 py-2 text-sm bg-slate-50 border border-slate-300 rounded-lg focus:bg-white focus:ring-2 focus:ring-[#1E5AA8] focus:border-[#1E5AA8] outline-hidden transition-colors"
            />
          </div>

          {/* Department Selector */}
          <div className="relative">
            <select
              value={selectedDeptId}
              onChange={(e) => setSelectedDeptId(e.target.value)}
              className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-lg focus:bg-white focus:ring-2 focus:ring-[#1E5AA8] focus:border-[#1E5AA8] outline-hidden transition-colors cursor-pointer text-slate-700"
            >
              <option value="all">All Departments ({doctors.length} Doctors)</option>
              {departments.map(dept => (
                <option key={dept.id} value={dept.id}>
                  {dept.name}
                </option>
              ))}
            </select>
          </div>

        </div>
      </div>

      {/* Doctor Cards Grid */}
      {filteredDoctors.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
          <Stethoscope size={40} className="mx-auto text-slate-300 mb-3" />
          <h3 className="text-base font-semibold text-slate-900">No physicians found</h3>
          <p className="text-sm text-slate-500 mt-1 max-w-sm mx-auto">
            Try adjusting your search criteria or select &quot;All Departments&quot; to see all available physicians.
          </p>
          <button
            onClick={() => { setSelectedDeptId('all'); setSearchQuery(''); }}
            className="mt-4 px-4 py-2 text-xs font-semibold text-[#1E5AA8] bg-blue-50 rounded-md hover:bg-blue-100"
          >
            Clear Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {filteredDoctors.map(doc => {
            const nextSlot = getNextAvailableSlot(doc.id);
            return (
              <div
                key={doc.id}
                className="bg-white rounded-xl border border-slate-200 overflow-hidden hover:border-[#1E5AA8] hover:shadow-sm transition-all flex flex-col justify-between"
              >
                <div className="p-6">
                  <div className="flex items-start gap-4">
                    <img
                      src={doc.photo_url}
                      alt={doc.full_name}
                      referrerPolicy="no-referrer"
                      className="w-20 h-20 rounded-lg object-cover border border-slate-200 shrink-0 bg-slate-100"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded-sm bg-blue-50 text-[#1E5AA8] border border-blue-100">
                          {doc.department_name}
                        </span>
                        <span className="text-xs text-slate-500 flex items-center gap-1">
                          <Briefcase size={12} />
                          {doc.experience_years} yrs experience
                        </span>
                      </div>

                      <h3 className="text-lg font-bold text-slate-900 mt-1.5 truncate">
                        {doc.full_name}
                      </h3>
                      <p className="text-xs font-medium text-slate-600">
                        {doc.specialty}
                      </p>
                      <p className="text-xs text-slate-500 mt-0.5">
                        {doc.qualification}
                      </p>
                    </div>
                  </div>

                  {/* Bio snippet */}
                  <p className="mt-4 text-xs text-slate-600 leading-relaxed line-clamp-2">
                    {doc.bio}
                  </p>

                  {/* Clinical Location & Consultation details */}
                  <div className="grid grid-cols-2 gap-2 mt-4 pt-3 border-t border-slate-100 text-xs text-slate-600">
                    <div className="flex items-center gap-1.5">
                      <MapPin size={13} className="text-slate-400 shrink-0" />
                      <span className="truncate">{doc.room_number}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <DollarSign size={13} className="text-slate-400 shrink-0" />
                      <span>Consultation: ${doc.consultation_fee}</span>
                    </div>
                  </div>
                </div>

                {/* Card Action & Availability Footer */}
                <div className="bg-slate-50 px-6 py-3.5 border-t border-slate-100 flex items-center justify-between">
                  <div className="text-xs">
                    <span className="text-slate-500">Next Slot: </span>
                    {nextSlot ? (
                      <span className="font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-sm border border-emerald-200">
                        {nextSlot.date} at {nextSlot.start_time}
                      </span>
                    ) : (
                      <span className="font-medium text-slate-400">
                        Fully Booked
                      </span>
                    )}
                  </div>

                  <button
                    onClick={() => onSelectDoctorToBook(doc.id)}
                    className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-[#1E5AA8] hover:bg-[#164887] rounded-md transition-colors shadow-xs"
                  >
                    <span>Book Appointment</span>
                    <ArrowRight size={13} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

    </div>
  );
};
