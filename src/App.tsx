import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { LandingPage } from './pages/LandingPage';
import { DoctorDirectoryPage } from './pages/DoctorDirectoryPage';
import { DoctorBookingPage } from './pages/DoctorBookingPage';
import { PatientAppointmentsPage } from './pages/PatientAppointmentsPage';
import { DoctorDashboardPage } from './pages/DoctorDashboardPage';
import { AdminDashboardPage } from './pages/AdminDashboardPage';
import { PatientProfilePage } from './pages/PatientProfilePage';
import { NotificationsPage } from './pages/NotificationsPage';
import { AuthPage } from './pages/AuthPage';
import { HeartPulse, PhoneCall, ShieldCheck } from 'lucide-react';
import { UserRole } from './types';

const MainAppContent: React.FC = () => {
  const { currentUser, role } = useAuth();
  
  // Default tab based on role
  const [currentTab, setCurrentTab] = useState<string>(() => {
    if (role === 'admin') return 'admin-dashboard';
    if (role === 'doctor') return 'doctor-dashboard';
    return 'landing';
  });

  const [bookingDoctorId, setBookingDoctorId] = useState<string>('');

  // Handle navigation
  const handleSelectTab = (tab: string) => {
    setCurrentTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleStartBooking = (doctorId: string) => {
    setBookingDoctorId(doctorId);
    setCurrentTab('booking');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBookingCompleted = () => {
    setCurrentTab('my-appointments');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAuthSuccess = (newRole: UserRole) => {
    if (newRole === 'admin') {
      setCurrentTab('admin-dashboard');
    } else if (newRole === 'doctor') {
      setCurrentTab('doctor-dashboard');
    } else {
      setCurrentTab('landing');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F7F8FA] text-[#1A1D21]">
      
      {/* Top Navigation */}
      <Navbar
        currentTab={currentTab}
        onSelectTab={handleSelectTab}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        {currentTab === 'landing' && (
          <LandingPage
            onNavigate={(tab, docId) => {
              if (docId) {
                handleStartBooking(docId);
              } else {
                handleSelectTab(tab);
              }
            }}
          />
        )}

        {currentTab === 'directory' && (
          <DoctorDirectoryPage
            onSelectDoctorToBook={handleStartBooking}
          />
        )}

        {currentTab === 'booking' && (
          <DoctorBookingPage
            doctorId={bookingDoctorId || 'doc-1'}
            onBack={() => handleSelectTab('directory')}
            onBookingSuccess={handleBookingCompleted}
          />
        )}

        {currentTab === 'my-appointments' && (
          <PatientAppointmentsPage
            onBookNew={() => handleSelectTab('directory')}
          />
        )}

        {currentTab === 'patient-profile' && (
          <PatientProfilePage />
        )}

        {currentTab === 'doctor-dashboard' && (
          <DoctorDashboardPage />
        )}

        {currentTab === 'admin-dashboard' && (
          <AdminDashboardPage />
        )}

        {currentTab === 'notifications' && (
          <NotificationsPage />
        )}

        {currentTab === 'auth' && (
          <AuthPage
            onSuccess={handleAuthSuccess}
          />
        )}
      </main>

      {/* Clinical Footer */}
      <footer className="bg-white border-t border-slate-200 mt-auto py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-xs text-slate-500">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-md bg-[#1E5AA8] text-white flex items-center justify-center font-bold">
                <HeartPulse size={14} />
              </div>
              <span className="font-bold text-slate-800">MetroHealth Hospital Appointment Management System</span>
            </div>

            <div className="flex items-center gap-6">
              <span className="flex items-center gap-1.5">
                <ShieldCheck size={14} className="text-emerald-600" />
                HIPAA-Compliant Architecture
              </span>
              <span className="flex items-center gap-1.5">
                <PhoneCall size={14} className="text-[#1E5AA8]" />
                Support: +1 (555) 890-4267
              </span>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between text-slate-400 text-[11px] gap-2">
            <div>
              &copy; {new Date().getFullYear()} MetroHealth Clinical Hospital System. All clinical records and scheduling data strictly encrypted.
            </div>
            <div>
              Active User: <span className="font-semibold text-slate-600">{currentUser.full_name}</span> ({role})
            </div>
          </div>
        </div>
      </footer>

    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <MainAppContent />
    </AuthProvider>
  );
}
