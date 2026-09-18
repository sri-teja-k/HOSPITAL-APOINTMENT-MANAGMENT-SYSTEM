import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { UserRole } from '../types';
import { 
  HeartPulse, 
  User, 
  Stethoscope, 
  ShieldCheck, 
  Mail, 
  Lock, 
  ArrowRight, 
  CheckCircle2, 
  AlertCircle 
} from 'lucide-react';

interface AuthPageProps {
  onSuccess: (role: UserRole) => void;
}

export const AuthPage: React.FC<AuthPageProps> = ({ onSuccess }) => {
  const { allProfiles, switchUser, registerUser } = useAuth();
  const [isRegisterMode, setIsRegisterMode] = useState(false);

  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [selectedRole, setSelectedRole] = useState<UserRole>('patient');
  const [errorMsg, setErrorMsg] = useState('');

  const handleQuickLogin = (profileId: string) => {
    switchUser(profileId);
    const p = allProfiles.find(item => item.id === profileId);
    if (p) {
      onSuccess(p.role);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (isRegisterMode) {
      if (!fullName.trim() || !email.trim()) {
        setErrorMsg('Please enter your full name and email.');
        return;
      }

      const newProfile = registerUser({
        full_name: fullName.trim(),
        email: email.trim(),
        phone: phone.trim() || '+1 (555) 000-0000',
        role: selectedRole
      });

      onSuccess(newProfile.role);
    } else {
      // Find existing user by email
      const matched = allProfiles.find(p => p.email.toLowerCase().trim() === email.toLowerCase().trim());
      if (matched) {
        switchUser(matched.id);
        onSuccess(matched.role);
      } else {
        setErrorMsg('No user account found with this email. Please check your credentials or create a new account.');
      }
    }
  };

  return (
    <div className="max-w-md mx-auto py-8 px-4 pb-16 space-y-6">
      
      {/* Brand Header */}
      <div className="text-center space-y-2">
        <div className="w-12 h-12 rounded-xl bg-[#1E5AA8] text-white flex items-center justify-center font-bold mx-auto shadow-sm">
          <HeartPulse size={26} />
        </div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
          MetroHealth HAMS
        </h1>
        <p className="text-xs text-slate-500 font-medium">
          Hospital Appointment Management System Authentication
        </p>
      </div>

      {/* Main Auth Card */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-5">
        
        {/* Toggle Mode */}
        <div className="flex border-b border-slate-200">
          <button
            type="button"
            onClick={() => { setIsRegisterMode(false); setErrorMsg(''); }}
            className={`flex-1 py-2.5 text-xs font-bold border-b-2 text-center transition-colors ${
              !isRegisterMode
                ? 'border-[#1E5AA8] text-[#1E5AA8]'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => { setIsRegisterMode(true); setErrorMsg(''); }}
            className={`flex-1 py-2.5 text-xs font-bold border-b-2 text-center transition-colors ${
              isRegisterMode
                ? 'border-[#1E5AA8] text-[#1E5AA8]'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Create Account
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {isRegisterMode && (
            <>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Full Name *
                </label>
                <div className="relative">
                  <User size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Rachel Foster"
                    className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#1E5AA8] outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Phone Number
                </label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+1 (555) 345-6789"
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#1E5AA8] outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Account Role
                </label>
                <select
                  value={selectedRole}
                  onChange={(e) => setSelectedRole(e.target.value as UserRole)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#1E5AA8] outline-hidden bg-white text-slate-700"
                >
                  <option value="patient">Patient</option>
                  <option value="doctor">Doctor / Physician</option>
                  <option value="admin">Hospital Administrator</option>
                </select>
              </div>
            </>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Email Address *
            </label>
            <div className="relative">
              <Mail size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@metrohealth.org"
                className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#1E5AA8] outline-hidden"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Password
            </label>
            <div className="relative">
              <Lock size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#1E5AA8] outline-hidden"
              />
            </div>
          </div>

          {errorMsg && (
            <div className="p-2.5 bg-rose-50 border border-rose-200 rounded-md text-xs text-rose-700 flex items-start gap-1.5">
              <AlertCircle size={14} className="shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          <button
            type="submit"
            className="w-full py-2.5 px-4 bg-[#1E5AA8] hover:bg-[#164887] text-white text-xs font-bold rounded-lg transition-colors shadow-xs"
          >
            {isRegisterMode ? 'Register & Sign In' : 'Sign In'}
          </button>
        </form>

        {/* Quick Role-Based Access Section */}
        <div className="pt-4 border-t border-slate-100 space-y-3">
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider text-center">
            Or Select Quick Role Access
          </div>

          <div className="space-y-2">
            <button
              type="button"
              onClick={() => handleQuickLogin('pat-1')}
              className="w-full p-2.5 text-left rounded-lg border border-slate-200 hover:border-[#1E5AA8] hover:bg-blue-50/50 transition-colors flex items-center justify-between text-xs"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center">
                  <User size={14} />
                </div>
                <div>
                  <div className="font-bold text-slate-900">Emily Watson</div>
                  <div className="text-[11px] text-slate-500">Patient Role</div>
                </div>
              </div>
              <ArrowRight size={14} className="text-slate-400" />
            </button>

            <button
              type="button"
              onClick={() => handleQuickLogin('doc-1')}
              className="w-full p-2.5 text-left rounded-lg border border-slate-200 hover:border-[#1E5AA8] hover:bg-blue-50/50 transition-colors flex items-center justify-between text-xs"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-full bg-blue-100 text-[#1E5AA8] flex items-center justify-center">
                  <Stethoscope size={14} />
                </div>
                <div>
                  <div className="font-bold text-slate-900">Dr. Marcus Vance</div>
                  <div className="text-[11px] text-slate-500">Doctor / Cardiology</div>
                </div>
              </div>
              <ArrowRight size={14} className="text-slate-400" />
            </button>

            <button
              type="button"
              onClick={() => handleQuickLogin('adm-1')}
              className="w-full p-2.5 text-left rounded-lg border border-slate-200 hover:border-purple-300 hover:bg-purple-50/50 transition-colors flex items-center justify-between text-xs"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center">
                  <ShieldCheck size={14} />
                </div>
                <div>
                  <div className="font-bold text-slate-900">Sarah Jenkins</div>
                  <div className="text-[11px] text-slate-500">Hospital Administrator</div>
                </div>
              </div>
              <ArrowRight size={14} className="text-slate-400" />
            </button>
          </div>
        </div>

      </div>

    </div>
  );
};
