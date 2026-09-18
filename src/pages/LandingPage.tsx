import React from 'react';
import { 
  Stethoscope, 
  Calendar, 
  Clock, 
  ShieldCheck, 
  ArrowRight, 
  Building2, 
  CheckCircle2, 
  PhoneCall, 
  UserCheck,
  HeartPulse,
  Activity,
  Award
} from 'lucide-react';
import { storageService } from '../services/storage';

interface LandingPageProps {
  onNavigate: (tab: string, doctorId?: string) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onNavigate }) => {
  const departments = storageService.getDepartments();
  const doctors = storageService.getAllDoctorsWithDetails();

  return (
    <div className="space-y-12 pb-16">
      
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-blue-900 via-[#1E5AA8] to-[#164887] text-white rounded-2xl shadow-sm overflow-hidden p-8 sm:p-12">
        <div className="max-w-3xl space-y-5">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-blue-100 text-xs font-semibold backdrop-blur-xs border border-white/20">
            <HeartPulse size={14} className="text-teal-300" />
            Accredited Tertiary Healthcare Facility
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight">
            Schedule Clinical Consultations with Verified Specialists
          </h1>
          <p className="text-blue-100 text-base sm:text-lg leading-relaxed">
            The MetroHealth Appointment Management System guarantees fast booking in under two minutes, verified availability time slots, and zero double-booking conflicts.
          </p>
          
          <div className="flex flex-wrap items-center gap-3 pt-3">
            <button
              onClick={() => onNavigate('directory')}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-white text-[#1E5AA8] font-bold text-sm hover:bg-blue-50 transition-colors shadow-sm focus:outline-hidden focus:ring-2 focus:ring-white"
            >
              <Calendar size={18} />
              <span>Book Appointment Online</span>
              <ArrowRight size={16} />
            </button>
            <button
              onClick={() => onNavigate('my-appointments')}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-white/10 hover:bg-white/20 text-white font-semibold text-sm transition-colors border border-white/20 focus:outline-hidden"
            >
              <span>Manage Existing Bookings</span>
            </button>
          </div>
        </div>

        {/* Quick Clinical Metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-10 pt-8 border-t border-white/15 text-white">
          <div>
            <div className="text-2xl font-bold text-white">{doctors.length}</div>
            <div className="text-xs text-blue-200 mt-0.5">Board-Certified Physicians</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-white">{departments.length}</div>
            <div className="text-xs text-blue-200 mt-0.5">Specialized Clinical Units</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-teal-300">&lt; 2 min</div>
            <div className="text-xs text-blue-200 mt-0.5">Average Booking Duration</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-white">100%</div>
            <div className="text-xs text-blue-200 mt-0.5">Conflict-Free Slot Guarantee</div>
          </div>
        </div>
      </section>

      {/* Clinical Departments */}
      <section className="space-y-6">
        <div className="flex items-end justify-between">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
              Clinical Departments & Centers of Excellence
            </h2>
            <p className="text-sm text-slate-600 mt-1">
              Select a clinical department to explore our available physician roster and schedule consultation.
            </p>
          </div>
          <button
            onClick={() => onNavigate('directory')}
            className="hidden sm:inline-flex items-center gap-1.5 text-sm font-semibold text-[#1E5AA8] hover:text-[#164887]"
          >
            <span>View all doctors</span>
            <ArrowRight size={15} />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {departments.map(dept => {
            const deptDoctors = doctors.filter(d => d.department_id === dept.id);
            return (
              <div 
                key={dept.id}
                className="bg-white rounded-xl border border-slate-200 p-5 hover:border-[#1E5AA8] hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wider bg-blue-50 text-[#1E5AA8] rounded-md border border-blue-100">
                      {dept.code}
                    </span>
                    <span className="text-xs text-slate-500 font-medium">
                      {dept.location}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mb-1.5">
                    {dept.name}
                  </h3>
                  <p className="text-sm text-slate-600 leading-relaxed line-clamp-3">
                    {dept.description}
                  </p>
                </div>

                <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-slate-500 font-medium">
                    {deptDoctors.length} {deptDoctors.length === 1 ? 'Doctor Available' : 'Doctors Available'}
                  </span>
                  <button
                    onClick={() => onNavigate('directory')}
                    className="font-semibold text-[#1E5AA8] hover:text-[#164887] flex items-center gap-1"
                  >
                    <span>Browse</span>
                    <ArrowRight size={13} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Hospital Care Standards */}
      <section className="bg-white rounded-2xl border border-slate-200 p-8 sm:p-10">
        <div className="max-w-2xl">
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
            Integrated Patient Experience Standards
          </h2>
          <p className="text-sm text-slate-600 mt-1">
            Built following strict hospital clinical workflow standards and reliable scheduling architectures.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <div className="space-y-3">
            <div className="w-10 h-10 rounded-lg bg-blue-50 text-[#1E5AA8] flex items-center justify-center">
              <ShieldCheck size={22} />
            </div>
            <h3 className="font-bold text-slate-900 text-base">
              Conflict-Free Slot Locking
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Every appointment slot is atomically verified at time of booking to strictly prevent double-bookings and ensure zero wait conflicts.
            </p>
          </div>

          <div className="space-y-3">
            <div className="w-10 h-10 rounded-lg bg-teal-50 text-teal-700 flex items-center justify-center">
              <Clock size={22} />
            </div>
            <h3 className="font-bold text-slate-900 text-base">
              Real-Time Notifications
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Automated in-app reminders, instant status confirmations, and timely alerts keep patients and attending physicians aligned.
            </p>
          </div>

          <div className="space-y-3">
            <div className="w-10 h-10 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center">
              <UserCheck size={22} />
            </div>
            <h3 className="font-bold text-slate-900 text-base">
              Role-Governed Clinical Workflows
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Dedicated interfaces tailored specifically for patient self-service, physician queue management, and hospital administrators.
            </p>
          </div>
        </div>
      </section>

      {/* Emergency Assistance Footer Card */}
      <section className="bg-slate-900 text-white rounded-xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4 text-left">
          <div className="w-12 h-12 rounded-full bg-rose-600/20 text-rose-400 border border-rose-500/30 flex items-center justify-center shrink-0">
            <PhoneCall size={22} />
          </div>
          <div>
            <div className="text-base font-bold text-white">Emergency Medical Services</div>
            <div className="text-xs text-slate-400">For life-threatening conditions, contact emergency dispatch or visit Level 1 Trauma Center immediately.</div>
          </div>
        </div>
        <div className="text-right shrink-0">
          <div className="text-xs text-slate-400">Emergency Dispatch Hotline</div>
          <div className="text-lg font-mono font-bold text-rose-400">+1 (555) 911-CARE</div>
        </div>
      </section>

    </div>
  );
};
