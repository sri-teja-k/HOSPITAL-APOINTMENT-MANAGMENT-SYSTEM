import React, { useState } from 'react';
import { storageService, getRelativeDate } from '../services/storage';
import { DoctorWithDetails, Department, AppointmentWithDetails, AppointmentStatus } from '../types';
import { StatusBadge } from '../components/StatusBadge';
import { ConfirmationModal } from '../components/ConfirmationModal';
import { 
  LayoutDashboard, 
  Stethoscope, 
  Building2, 
  Calendar, 
  Users, 
  TrendingUp, 
  Plus, 
  Trash2, 
  Edit3, 
  Search, 
  Filter, 
  CheckCircle2, 
  AlertTriangle, 
  ShieldCheck,
  MapPin,
  X,
  Clock
} from 'lucide-react';

export const AdminDashboardPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'doctors' | 'departments' | 'appointments'>('overview');
  
  // Add Doctor Modal
  const [isAddDoctorOpen, setIsAddDoctorOpen] = useState(false);
  const [newDocName, setNewDocName] = useState('');
  const [newDocEmail, setNewDocEmail] = useState('');
  const [newDocPhone, setNewDocPhone] = useState('');
  const [newDocDeptId, setNewDocDeptId] = useState('');
  const [newDocSpecialty, setNewDocSpecialty] = useState('');
  const [newDocBio, setNewDocBio] = useState('');
  const [newDocQualification, setNewDocQualification] = useState('');
  const [newDocRoom, setNewDocRoom] = useState('');
  const [newDocExperience, setNewDocExperience] = useState(8);
  const [newDocFee, setNewDocFee] = useState(150);
  const [doctorFormError, setDoctorFormError] = useState('');

  // Delete Doctor Confirmation
  const [deleteDoctorModalOpen, setDeleteDoctorModalOpen] = useState(false);
  const [doctorToDelete, setDoctorToDelete] = useState<DoctorWithDetails | null>(null);

  // Add Department Modal
  const [isAddDeptOpen, setIsAddDeptOpen] = useState(false);
  const [newDeptName, setNewDeptName] = useState('');
  const [newDeptCode, setNewDeptCode] = useState('');
  const [newDeptDesc, setNewDeptDesc] = useState('');
  const [newDeptLoc, setNewDeptLoc] = useState('');

  // Master Appointments Filter
  const [aptStatusFilter, setAptStatusFilter] = useState<string>('all');
  const [aptDeptFilter, setAptDeptFilter] = useState<string>('all');
  const [aptSearch, setAptSearch] = useState<string>('');

  const analytics = storageService.getHospitalAnalytics();
  const doctors = storageService.getAllDoctorsWithDetails();
  const departments = storageService.getDepartments();
  const appointments = storageService.getAllAppointmentsWithDetails();

  // Set default department for new doctor
  React.useEffect(() => {
    if (departments.length > 0 && !newDocDeptId) {
      setNewDocDeptId(departments[0].id);
    }
  }, [departments, newDocDeptId]);

  const handleCreateDoctor = (e: React.FormEvent) => {
    e.preventDefault();
    setDoctorFormError('');

    if (!newDocName || !newDocEmail || !newDocSpecialty) {
      setDoctorFormError('Please fill in required physician details.');
      return;
    }

    try {
      storageService.createDoctor(
        {
          full_name: newDocName,
          email: newDocEmail,
          phone: newDocPhone || '+1 (555) 000-0000'
        },
        {
          department_id: newDocDeptId,
          specialty: newDocSpecialty,
          bio: newDocBio || 'Clinical specialist serving in hospital outpatient department.',
          photo_url: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=400',
          qualification: newDocQualification || 'MD, Board Certified',
          room_number: newDocRoom || 'Clinic Suite 201',
          experience_years: Number(newDocExperience) || 5,
          consultation_fee: Number(newDocFee) || 150
        }
      );

      setIsAddDoctorOpen(false);
      // Reset
      setNewDocName('');
      setNewDocEmail('');
      setNewDocPhone('');
      setNewDocSpecialty('');
      setNewDocBio('');
      setNewDocQualification('');
      setNewDocRoom('');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error adding doctor';
      setDoctorFormError(msg);
    }
  };

  const handleConfirmDeleteDoctor = () => {
    if (!doctorToDelete) return;
    storageService.deleteDoctor(doctorToDelete.id);
    setDeleteDoctorModalOpen(false);
    setDoctorToDelete(null);
  };

  const handleCreateDepartment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDeptName || !newDeptCode) return;
    storageService.createDepartment({
      name: newDeptName,
      code: newDeptCode.toUpperCase(),
      description: newDeptDesc || 'Clinical outpatient department.',
      location: newDeptLoc || 'Hospital Main Pavilion'
    });
    setIsAddDeptOpen(false);
    setNewDeptName('');
    setNewDeptCode('');
    setNewDeptDesc('');
    setNewDeptLoc('');
  };

  const filteredAppointments = appointments.filter(a => {
    const matchesStatus = aptStatusFilter === 'all' || a.status === aptStatusFilter;
    const matchesDept = aptDeptFilter === 'all' || a.department_name === aptDeptFilter;
    const q = aptSearch.toLowerCase().trim();
    const matchesSearch = !q ||
      a.patient_name.toLowerCase().includes(q) ||
      a.doctor_name.toLowerCase().includes(q) ||
      a.id.toLowerCase().includes(q);
    return matchesStatus && matchesDept && matchesSearch;
  });

  return (
    <div className="space-y-6 pb-16">
      
      {/* Admin Header */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 text-xs font-bold uppercase tracking-wider bg-purple-50 text-purple-700 rounded-sm border border-purple-200 flex items-center gap-1">
              <ShieldCheck size={12} />
              Hospital Administration
            </span>
            <span className="text-xs text-slate-500">
              MetroHealth Central Hospital System
            </span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 mt-1 flex items-center gap-2">
            <LayoutDashboard className="text-[#1E5AA8]" size={24} />
            Operations & Scheduling Command Center
          </h1>
          <p className="text-xs text-slate-600 mt-0.5">
            Monitor hospital capacity, configure clinical departments, manage physician rosters, and oversee appointment queues.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsAddDoctorOpen(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-white bg-[#1E5AA8] hover:bg-[#164887] rounded-lg transition-colors shadow-xs"
          >
            <Plus size={14} />
            <span>Add Doctor</span>
          </button>
          <button
            onClick={() => setIsAddDeptOpen(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
          >
            <Plus size={14} />
            <span>Add Department</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 bg-white px-6 rounded-t-xl overflow-x-auto">
        <button
          onClick={() => setActiveTab('overview')}
          className={`py-3.5 px-4 text-xs font-bold border-b-2 transition-colors flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'overview'
              ? 'border-[#1E5AA8] text-[#1E5AA8]'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <TrendingUp size={15} />
          <span>System Overview & Analytics</span>
        </button>

        <button
          onClick={() => setActiveTab('doctors')}
          className={`py-3.5 px-4 text-xs font-bold border-b-2 transition-colors flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'doctors'
              ? 'border-[#1E5AA8] text-[#1E5AA8]'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Stethoscope size={15} />
          <span>Physician Roster ({doctors.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('departments')}
          className={`py-3.5 px-4 text-xs font-bold border-b-2 transition-colors flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'departments'
              ? 'border-[#1E5AA8] text-[#1E5AA8]'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Building2 size={15} />
          <span>Departments ({departments.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('appointments')}
          className={`py-3.5 px-4 text-xs font-bold border-b-2 transition-colors flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'appointments'
              ? 'border-[#1E5AA8] text-[#1E5AA8]'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Calendar size={15} />
          <span>Master Appointments ({appointments.length})</span>
        </button>
      </div>

      {/* TAB 1: Overview & Analytics */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          
          {/* Key Metric Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-xl border border-slate-200">
              <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Total Appointments
              </div>
              <div className="text-2xl font-bold text-slate-900 mt-2">
                {analytics.totalAppointments}
              </div>
              <div className="flex items-center gap-2 mt-2 text-xs text-slate-600">
                <span className="font-semibold text-emerald-600">{analytics.confirmedCount} confirmed</span>
                <span>•</span>
                <span>{analytics.completedCount} completed</span>
              </div>
            </div>

            <div className="bg-white p-5 rounded-xl border border-slate-200">
              <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Active Physicians
              </div>
              <div className="text-2xl font-bold text-slate-900 mt-2">
                {analytics.activeDoctorsCount}
              </div>
              <div className="text-xs text-slate-600 mt-2">
                Across {analytics.departmentsCount} clinical departments
              </div>
            </div>

            <div className="bg-white p-5 rounded-xl border border-slate-200">
              <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Slot Booking Rate
              </div>
              <div className="text-2xl font-bold text-[#1E5AA8] mt-2">
                {analytics.slotOccupancyRate}%
              </div>
              <div className="text-xs text-slate-600 mt-2">
                {analytics.bookedSlotsCount} of {analytics.totalSlotsCount} slots reserved
              </div>
            </div>

            <div className="bg-white p-5 rounded-xl border border-slate-200">
              <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Cancellation Rate
              </div>
              <div className="text-2xl font-bold text-slate-700 mt-2">
                {analytics.totalAppointments > 0 
                  ? Math.round((analytics.cancelledCount / analytics.totalAppointments) * 100) 
                  : 0}%
              </div>
              <div className="text-xs text-slate-500 mt-2">
                {analytics.cancelledCount} total cancellations recorded
              </div>
            </div>
          </div>

          {/* Department Consultation Load */}
          <div className="bg-white p-6 rounded-xl border border-slate-200 space-y-4">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Building2 size={16} className="text-[#1E5AA8]" />
              Consultation Volume by Department
            </h3>
            <p className="text-xs text-slate-500">
              Distribution of scheduled appointments across hospital clinical units.
            </p>

            <div className="space-y-3 pt-2">
              {analytics.deptDistribution.map(dept => {
                const percentage = analytics.totalAppointments > 0 
                  ? Math.round((dept.count / analytics.totalAppointments) * 100) 
                  : 0;
                return (
                  <div key={dept.name} className="space-y-1">
                    <div className="flex justify-between text-xs font-semibold">
                      <span className="text-slate-800">{dept.name} ({dept.code})</span>
                      <span className="text-slate-600">{dept.count} appointments ({percentage}%)</span>
                    </div>
                    <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[#1E5AA8] rounded-full transition-all duration-500"
                        style={{ width: `${Math.max(percentage, 3)}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      )}

      {/* TAB 2: Doctors Management */}
      {activeTab === 'doctors' && (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <div className="p-5 border-b border-slate-200 flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900">Physician Roster</h3>
              <p className="text-xs text-slate-500 mt-0.5">Manage physician profiles, assignments, and consultation fees.</p>
            </div>
            <button
              onClick={() => setIsAddDoctorOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-white bg-[#1E5AA8] hover:bg-[#164887] rounded-md transition-colors"
            >
              <Plus size={14} />
              <span>Add New Physician</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200 uppercase tracking-wider">
                <tr>
                  <th className="p-4">Physician</th>
                  <th className="p-4">Department</th>
                  <th className="p-4">Specialty</th>
                  <th className="p-4">Room</th>
                  <th className="p-4">Fee</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {doctors.map(doc => (
                  <tr key={doc.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="p-4 font-semibold text-slate-900">
                      <div className="flex items-center gap-3">
                        <img
                          src={doc.photo_url}
                          alt={doc.full_name}
                          referrerPolicy="no-referrer"
                          className="w-9 h-9 rounded-full object-cover bg-slate-100 border border-slate-200"
                        />
                        <div>
                          <div>{doc.full_name}</div>
                          <div className="text-[11px] text-slate-400 font-normal">{doc.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="px-2 py-0.5 rounded-sm bg-blue-50 text-[#1E5AA8] font-semibold text-[11px] border border-blue-100">
                        {doc.department_name}
                      </span>
                    </td>
                    <td className="p-4">{doc.specialty}</td>
                    <td className="p-4">{doc.room_number}</td>
                    <td className="p-4 font-mono font-semibold text-slate-900">${doc.consultation_fee}</td>
                    <td className="p-4 text-right">
                      <button
                        onClick={() => {
                          setDoctorToDelete(doc);
                          setDeleteDoctorModalOpen(true);
                        }}
                        className="p-1.5 text-slate-400 hover:text-rose-600 rounded-md transition-colors"
                        title="Delete doctor"
                      >
                        <Trash2 size={15} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: Departments Management */}
      {activeTab === 'departments' && (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <div className="p-5 border-b border-slate-200 flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900">Clinical Departments</h3>
              <p className="text-xs text-slate-500 mt-0.5">Hospital departments, codes, and pavilion locations.</p>
            </div>
            <button
              onClick={() => setIsAddDeptOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-white bg-[#1E5AA8] hover:bg-[#164887] rounded-md transition-colors"
            >
              <Plus size={14} />
              <span>Add Department</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200 uppercase tracking-wider">
                <tr>
                  <th className="p-4">Code</th>
                  <th className="p-4">Department Name</th>
                  <th className="p-4">Description</th>
                  <th className="p-4">Location</th>
                  <th className="p-4">Assigned Doctors</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {departments.map(dept => {
                  const docCount = doctors.filter(d => d.department_id === dept.id).length;
                  return (
                    <tr key={dept.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="p-4 font-mono font-bold text-[#1E5AA8]">{dept.code}</td>
                      <td className="p-4 font-bold text-slate-900">{dept.name}</td>
                      <td className="p-4 max-w-sm text-slate-600 line-clamp-2">{dept.description}</td>
                      <td className="p-4 text-slate-600">{dept.location || 'Central Pavilion'}</td>
                      <td className="p-4 font-semibold text-slate-800">{docCount}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 4: Master Appointments */}
      {activeTab === 'appointments' && (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden space-y-4 p-5">
          <div>
            <h3 className="text-base font-bold text-slate-900">Hospital Master Schedule</h3>
            <p className="text-xs text-slate-500 mt-0.5">Real-time centralized log of all patient bookings across all departments.</p>
          </div>

          {/* Filter Bar */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2">
            <div className="relative">
              <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={aptSearch}
                onChange={(e) => setAptSearch(e.target.value)}
                placeholder="Search patient, doctor, or ID..."
                className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-md outline-hidden focus:bg-white focus:ring-1 focus:ring-[#1E5AA8]"
              />
            </div>

            <div>
              <select
                value={aptStatusFilter}
                onChange={(e) => setAptStatusFilter(e.target.value)}
                className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-md outline-hidden text-slate-700 cursor-pointer"
              >
                <option value="all">All Statuses</option>
                <option value="confirmed">Confirmed</option>
                <option value="completed">Completed</option>
                <option value="pending">Pending</option>
                <option value="cancelled">Cancelled</option>
                <option value="no_show">No-Show</option>
              </select>
            </div>

            <div>
              <select
                value={aptDeptFilter}
                onChange={(e) => setAptDeptFilter(e.target.value)}
                className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-md outline-hidden text-slate-700 cursor-pointer"
              >
                <option value="all">All Departments</option>
                {departments.map(d => (
                  <option key={d.id} value={d.name}>{d.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="overflow-x-auto border border-slate-200 rounded-lg">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200 uppercase tracking-wider">
                <tr>
                  <th className="p-3">Ref ID</th>
                  <th className="p-3">Patient</th>
                  <th className="p-3">Doctor</th>
                  <th className="p-3">Department</th>
                  <th className="p-3">Date & Slot</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Reason</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredAppointments.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="p-6 text-center text-slate-400">
                      No matching appointments found.
                    </td>
                  </tr>
                ) : (
                  filteredAppointments.map(a => (
                    <tr key={a.id} className="hover:bg-slate-50 transition-colors">
                      <td className="p-3 font-mono text-slate-500">{a.id}</td>
                      <td className="p-3 font-semibold text-slate-900">
                        {a.patient_name}
                        <div className="text-[10px] text-slate-400 font-normal">{a.patient_phone}</div>
                      </td>
                      <td className="p-3 font-semibold text-slate-800">{a.doctor_name}</td>
                      <td className="p-3">
                        <span className="px-2 py-0.5 rounded-sm bg-blue-50 text-[#1E5AA8] font-semibold text-[10px]">
                          {a.department_name}
                        </span>
                      </td>
                      <td className="p-3 font-mono text-slate-700">
                        {a.slot_date} {a.slot_start_time}
                      </td>
                      <td className="p-3">
                        <StatusBadge status={a.status} />
                      </td>
                      <td className="p-3 text-slate-600 max-w-xs truncate">
                        {a.patient_reason}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add Doctor Modal */}
      {isAddDoctorOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-lg w-full border border-slate-200 overflow-hidden">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900">Add New Attending Physician</h3>
              <button onClick={() => setIsAddDoctorOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateDoctor} className="p-5 space-y-4 max-h-[75vh] overflow-y-auto">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={newDocName}
                    onChange={(e) => setNewDocName(e.target.value)}
                    placeholder="e.g. Dr. Robert Blake, MD"
                    className="w-full text-xs border border-slate-300 rounded-md p-2 focus:ring-2 focus:ring-[#1E5AA8] outline-hidden"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Email *</label>
                  <input
                    type="email"
                    required
                    value={newDocEmail}
                    onChange={(e) => setNewDocEmail(e.target.value)}
                    placeholder="r.blake@metrohealth.org"
                    className="w-full text-xs border border-slate-300 rounded-md p-2 focus:ring-2 focus:ring-[#1E5AA8] outline-hidden"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Department *</label>
                  <select
                    value={newDocDeptId}
                    onChange={(e) => setNewDocDeptId(e.target.value)}
                    className="w-full text-xs border border-slate-300 rounded-md p-2 focus:ring-2 focus:ring-[#1E5AA8] outline-hidden bg-white"
                  >
                    {departments.map(d => (
                      <option key={d.id} value={d.id}>{d.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Specialty *</label>
                  <input
                    type="text"
                    required
                    value={newDocSpecialty}
                    onChange={(e) => setNewDocSpecialty(e.target.value)}
                    placeholder="e.g. Vascular Surgery"
                    className="w-full text-xs border border-slate-300 rounded-md p-2 focus:ring-2 focus:ring-[#1E5AA8] outline-hidden"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Room / Suite</label>
                  <input
                    type="text"
                    value={newDocRoom}
                    onChange={(e) => setNewDocRoom(e.target.value)}
                    placeholder="Suite 302"
                    className="w-full text-xs border border-slate-300 rounded-md p-2 focus:ring-2 focus:ring-[#1E5AA8] outline-hidden"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Experience (Yrs)</label>
                  <input
                    type="number"
                    value={newDocExperience}
                    onChange={(e) => setNewDocExperience(Number(e.target.value))}
                    className="w-full text-xs border border-slate-300 rounded-md p-2 focus:ring-2 focus:ring-[#1E5AA8] outline-hidden"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Fee ($)</label>
                  <input
                    type="number"
                    value={newDocFee}
                    onChange={(e) => setNewDocFee(Number(e.target.value))}
                    className="w-full text-xs border border-slate-300 rounded-md p-2 focus:ring-2 focus:ring-[#1E5AA8] outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Qualifications</label>
                <input
                  type="text"
                  value={newDocQualification}
                  onChange={(e) => setNewDocQualification(e.target.value)}
                  placeholder="MD, Stanford; Fellow American College of Surgeons"
                  className="w-full text-xs border border-slate-300 rounded-md p-2 focus:ring-2 focus:ring-[#1E5AA8] outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Clinical Biography</label>
                <textarea
                  rows={2}
                  value={newDocBio}
                  onChange={(e) => setNewDocBio(e.target.value)}
                  placeholder="Clinical background, research interests, patient focus..."
                  className="w-full text-xs border border-slate-300 rounded-md p-2 focus:ring-2 focus:ring-[#1E5AA8] outline-hidden"
                />
              </div>

              {doctorFormError && (
                <div className="text-xs text-rose-600 bg-rose-50 p-2 rounded-md border border-rose-200">
                  {doctorFormError}
                </div>
              )}

              <div className="pt-2 flex justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddDoctorOpen(false)}
                  className="px-4 py-2 text-xs font-medium text-slate-700 bg-white border border-slate-300 rounded-md hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold text-white bg-[#1E5AA8] hover:bg-[#164887] rounded-md"
                >
                  Create Physician Profile
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Department Modal */}
      {isAddDeptOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full border border-slate-200 overflow-hidden">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900">Add Clinical Department</h3>
              <button onClick={() => setIsAddDeptOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateDepartment} className="p-5 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Department Name *</label>
                <input
                  type="text"
                  required
                  value={newDeptName}
                  onChange={(e) => setNewDeptName(e.target.value)}
                  placeholder="e.g. Dermatology & Skin Surgery"
                  className="w-full text-xs border border-slate-300 rounded-md p-2 focus:ring-2 focus:ring-[#1E5AA8] outline-hidden"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Code *</label>
                  <input
                    type="text"
                    required
                    maxLength={4}
                    value={newDeptCode}
                    onChange={(e) => setNewDeptCode(e.target.value)}
                    placeholder="DERM"
                    className="w-full text-xs uppercase font-mono border border-slate-300 rounded-md p-2 focus:ring-2 focus:ring-[#1E5AA8] outline-hidden"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Location</label>
                  <input
                    type="text"
                    value={newDeptLoc}
                    onChange={(e) => setNewDeptLoc(e.target.value)}
                    placeholder="Building B, 3rd Floor"
                    className="w-full text-xs border border-slate-300 rounded-md p-2 focus:ring-2 focus:ring-[#1E5AA8] outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Description</label>
                <textarea
                  rows={2}
                  value={newDeptDesc}
                  onChange={(e) => setNewDeptDesc(e.target.value)}
                  placeholder="Clinical scope, specialties, diagnostic labs..."
                  className="w-full text-xs border border-slate-300 rounded-md p-2 focus:ring-2 focus:ring-[#1E5AA8] outline-hidden"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddDeptOpen(false)}
                  className="px-4 py-2 text-xs font-medium text-slate-700 bg-white border border-slate-300 rounded-md hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold text-white bg-[#1E5AA8] hover:bg-[#164887] rounded-md"
                >
                  Add Department
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Doctor Confirmation Modal (Rule R5) */}
      <ConfirmationModal
        isOpen={deleteDoctorModalOpen}
        title="Remove Physician Profile"
        message={`Are you sure you want to remove ${doctorToDelete?.full_name} from the active medical roster? Active unbooked availability slots will be deleted.`}
        confirmText="Remove Physician"
        cancelText="Cancel"
        isDestructive={true}
        onConfirm={handleConfirmDeleteDoctor}
        onCancel={() => {
          setDeleteDoctorModalOpen(false);
          setDoctorToDelete(null);
        }}
      />

    </div>
  );
};
