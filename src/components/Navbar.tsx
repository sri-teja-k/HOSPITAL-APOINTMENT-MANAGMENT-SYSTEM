import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  Building2, 
  Calendar, 
  User, 
  Bell, 
  Stethoscope, 
  ShieldCheck, 
  Users, 
  ChevronDown, 
  Check, 
  LogOut, 
  CalendarClock,
  LayoutDashboard,
  Layers,
  HeartPulse
} from 'lucide-react';

interface NavbarProps {
  currentTab: string;
  onSelectTab: (tab: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentTab, onSelectTab }) => {
  const { currentUser, role, allProfiles, switchUser, unreadCount } = useAuth();
  const [isRoleDropdownOpen, setIsRoleDropdownOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const patientLinks = [
    { id: 'directory', label: 'Doctor Directory', icon: Stethoscope },
    { id: 'my-appointments', label: 'My Appointments', icon: Calendar },
    { id: 'patient-profile', label: 'Medical Profile', icon: User }
  ];

  const doctorLinks = [
    { id: 'doctor-dashboard', label: "Doctor Schedule", icon: CalendarClock },
    { id: 'directory', label: 'All Doctors', icon: Stethoscope }
  ];

  const adminLinks = [
    { id: 'admin-dashboard', label: 'Admin Dashboard', icon: LayoutDashboard },
    { id: 'directory', label: 'Doctor Directory', icon: Stethoscope }
  ];

  const links = role === 'admin' ? adminLinks : role === 'doctor' ? doctorLinks : patientLinks;

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-2xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo & Clinical Branding */}
          <div className="flex items-center gap-6">
            <button 
              onClick={() => onSelectTab(role === 'admin' ? 'admin-dashboard' : role === 'doctor' ? 'doctor-dashboard' : 'landing')}
              className="flex items-center gap-2.5 text-left group focus:outline-hidden"
            >
              <div className="w-9 h-9 rounded-md bg-[#1E5AA8] text-white flex items-center justify-center font-bold shadow-xs">
                <HeartPulse size={20} />
              </div>
              <div>
                <div className="font-bold text-slate-900 text-base leading-tight tracking-tight">
                  MetroHealth HAMS
                </div>
                <div className="text-[11px] text-slate-500 font-medium">
                  Hospital Appointment System
                </div>
              </div>
            </button>

            {/* Navigation Tabs */}
            <nav className="hidden md:flex items-center space-x-1 pl-4 border-l border-slate-200">
              {links.map(link => {
                const Icon = link.icon;
                const isActive = currentTab === link.id;
                return (
                  <button
                    key={link.id}
                    onClick={() => onSelectTab(link.id)}
                    className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-blue-50 text-[#1E5AA8]'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                    }`}
                  >
                    <Icon size={16} />
                    <span>{link.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Right Action Bar: Quick Role Switcher + Notification Bell + User Menu */}
          <div className="flex items-center gap-3">
            
            {/* User Account / Role Switcher */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsRoleDropdownOpen(!isRoleDropdownOpen)}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-full border border-slate-300 bg-slate-50 hover:bg-slate-100 text-slate-700 transition-colors focus:outline-hidden"
                title="Switch active user profile"
              >
                <span className={`w-2 h-2 rounded-full ${
                  role === 'admin' ? 'bg-purple-600' : role === 'doctor' ? 'bg-[#1E5AA8]' : 'bg-[#2FA88A]'
                }`} />
                <span className="capitalize">{role}: {currentUser.full_name.split(' ')[0]}</span>
                <ChevronDown size={13} className="text-slate-500" />
              </button>

              {isRoleDropdownOpen && (
                <div className="absolute right-0 mt-2 w-64 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 py-1 z-50 border border-slate-200 divide-y divide-slate-100">
                  <div className="px-3 py-2 text-xs font-medium text-slate-500 bg-slate-50">
                    Switch User Account
                  </div>
                  
                  {/* Patients */}
                  <div className="py-1">
                    <div className="px-3 py-1 text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                      <Users size={12} />
                      Patients
                    </div>
                    {allProfiles.filter(p => p.role === 'patient').map(p => (
                      <button
                        key={p.id}
                        onClick={() => {
                          switchUser(p.id);
                          setIsRoleDropdownOpen(false);
                          onSelectTab('my-appointments');
                        }}
                        className={`w-full text-left px-3 py-1.5 text-xs flex items-center justify-between hover:bg-slate-50 ${
                          currentUser.id === p.id ? 'font-semibold text-[#1E5AA8] bg-blue-50/50' : 'text-slate-700'
                        }`}
                      >
                        <div>
                          <div>{p.full_name}</div>
                          <div className="text-[10px] text-slate-400">{p.email}</div>
                        </div>
                        {currentUser.id === p.id && <Check size={14} className="text-[#1E5AA8]" />}
                      </button>
                    ))}
                  </div>

                  {/* Doctors */}
                  <div className="py-1">
                    <div className="px-3 py-1 text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                      <Stethoscope size={12} />
                      Doctors
                    </div>
                    {allProfiles.filter(p => p.role === 'doctor').map(p => (
                      <button
                        key={p.id}
                        onClick={() => {
                          switchUser(p.id);
                          setIsRoleDropdownOpen(false);
                          onSelectTab('doctor-dashboard');
                        }}
                        className={`w-full text-left px-3 py-1.5 text-xs flex items-center justify-between hover:bg-slate-50 ${
                          currentUser.id === p.id ? 'font-semibold text-[#1E5AA8] bg-blue-50/50' : 'text-slate-700'
                        }`}
                      >
                        <div>
                          <div>{p.full_name}</div>
                          <div className="text-[10px] text-slate-400">{p.email}</div>
                        </div>
                        {currentUser.id === p.id && <Check size={14} className="text-[#1E5AA8]" />}
                      </button>
                    ))}
                  </div>

                  {/* Admin */}
                  <div className="py-1">
                    <div className="px-3 py-1 text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                      <ShieldCheck size={12} />
                      Administration
                    </div>
                    {allProfiles.filter(p => p.role === 'admin').map(p => (
                      <button
                        key={p.id}
                        onClick={() => {
                          switchUser(p.id);
                          setIsRoleDropdownOpen(false);
                          onSelectTab('admin-dashboard');
                        }}
                        className={`w-full text-left px-3 py-1.5 text-xs flex items-center justify-between hover:bg-slate-50 ${
                          currentUser.id === p.id ? 'font-semibold text-[#1E5AA8] bg-blue-50/50' : 'text-slate-700'
                        }`}
                      >
                        <div>
                          <div>{p.full_name}</div>
                          <div className="text-[10px] text-slate-400">Hospital Director</div>
                        </div>
                        {currentUser.id === p.id && <Check size={14} className="text-[#1E5AA8]" />}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Notification Bell */}
            <button
              onClick={() => onSelectTab('notifications')}
              className={`relative p-2 text-slate-600 hover:text-slate-900 rounded-full hover:bg-slate-100 transition-colors focus:outline-hidden ${
                currentTab === 'notifications' ? 'bg-blue-50 text-[#1E5AA8]' : ''
              }`}
              title="Notifications Center"
              aria-label="View notifications"
            >
              <Bell size={18} />
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-rose-600 text-white rounded-full text-[10px] font-bold flex items-center justify-center">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </button>

            {/* User Profile dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="flex items-center gap-2 p-1.5 rounded-full hover:bg-slate-100 transition-colors focus:outline-hidden"
              >
                <div className="w-8 h-8 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center font-semibold text-xs border border-slate-300">
                  {currentUser.full_name.charAt(0)}
                </div>
              </button>

              {isUserMenuOpen && (
                <div className="absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 py-1 z-50 border border-slate-200">
                  <div className="px-4 py-2.5 border-b border-slate-100">
                    <p className="text-xs font-semibold text-slate-900 truncate">
                      {currentUser.full_name}
                    </p>
                    <p className="text-[11px] text-slate-500 truncate">
                      {currentUser.email}
                    </p>
                    <span className="inline-block mt-1 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider rounded-sm bg-slate-100 text-slate-700">
                      Role: {role}
                    </span>
                  </div>

                  {role === 'patient' && (
                    <button
                      onClick={() => {
                        onSelectTab('patient-profile');
                        setIsUserMenuOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                    >
                      <User size={14} />
                      Medical History & Profile
                    </button>
                  )}

                  <button
                    onClick={() => {
                      onSelectTab('auth');
                      setIsUserMenuOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2 border-t border-slate-100"
                  >
                    <LogOut size={14} />
                    Account Login / Register
                  </button>
                </div>
              )}
            </div>

          </div>
        </div>

        {/* Mobile Sub-Navigation Bar */}
        <div className="md:hidden flex items-center space-x-1 py-2 overflow-x-auto border-t border-slate-100">
          {links.map(link => {
            const Icon = link.icon;
            const isActive = currentTab === link.id;
            return (
              <button
                key={link.id}
                onClick={() => onSelectTab(link.id)}
                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium whitespace-nowrap ${
                  isActive
                    ? 'bg-blue-50 text-[#1E5AA8]'
                    : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                <Icon size={14} />
                <span>{link.label}</span>
              </button>
            );
          })}
        </div>

      </div>
    </header>
  );
};
