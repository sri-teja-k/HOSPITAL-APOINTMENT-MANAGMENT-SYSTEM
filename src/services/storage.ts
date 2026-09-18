import { 
  Profile, 
  Department, 
  Doctor, 
  AvailabilitySlot, 
  Appointment, 
  NotificationItem,
  DoctorWithDetails,
  AppointmentWithDetails,
  AppointmentStatus,
  UserRole
} from '../types';
import { supabaseService } from './supabase';

const STORAGE_KEYS = {
  PROFILES: 'hams_profiles_v1',
  DEPARTMENTS: 'hams_departments_v1',
  DOCTORS: 'hams_doctors_v1',
  SLOTS: 'hams_slots_v1',
  APPOINTMENTS: 'hams_appointments_v1',
  NOTIFICATIONS: 'hams_notifications_v1',
  CURRENT_USER_ID: 'hams_current_user_id_v1'
};

// Generate future dates in YYYY-MM-DD
export function getRelativeDate(dayOffset: number): string {
  const d = new Date();
  d.setDate(d.getDate() + dayOffset);
  return d.toISOString().split('T')[0];
}

// Initial Seed Data
const INITIAL_DEPARTMENTS: Department[] = [
  {
    id: 'dept-1',
    name: 'Cardiology',
    description: 'Diagnosis, monitoring, and treatment of congenital heart defects and coronary artery disease.',
    head_of_department: 'Dr. Marcus Vance',
    location: 'Building A, 3rd Floor',
    code: 'CARD'
  },
  {
    id: 'dept-2',
    name: 'Neurology',
    description: 'Specialized diagnosis and treatment of disorders affecting the central and peripheral nervous system.',
    head_of_department: 'Dr. Elena Rostova',
    location: 'Building B, 2nd Floor',
    code: 'NEUR'
  },
  {
    id: 'dept-3',
    name: 'Pediatrics',
    description: 'Comprehensive medical care for infants, children, and adolescents with acute and chronic conditions.',
    head_of_department: 'Dr. Sarah Chen',
    location: 'Building A, 1st Floor',
    code: 'PEDI'
  },
  {
    id: 'dept-4',
    name: 'Orthopedics',
    description: 'Treatment of musculoskeletal system injuries, spine disorders, joint replacements, and sports injuries.',
    head_of_department: 'Dr. James Wilson',
    location: 'Building C, Ground Floor',
    code: 'ORTH'
  },
  {
    id: 'dept-5',
    name: 'General Medicine',
    description: 'Primary care, preventive health screenings, chronic disease management, and initial diagnostic triage.',
    head_of_department: 'Dr. Rachel Adams',
    location: 'Building A, 2nd Floor',
    code: 'GENM'
  }
];

const INITIAL_PROFILES: Profile[] = [
  // Patients
  {
    id: 'pat-1',
    full_name: 'Emily Watson',
    email: 'emily.watson@metrohealth.org',
    role: 'patient',
    phone: '+1 (555) 234-5678',
    created_at: '2026-01-10T09:00:00Z',
    medical_history_notes: 'Mild asthma, managed with occasional albuterol inhaler. Regular annual cardiovascular checkups.',
    allergies: 'Penicillin, Tree nuts',
    blood_group: 'O Positive',
    emergency_contact: 'Mark Watson (Spouse) - +1 (555) 234-9988'
  },
  {
    id: 'pat-2',
    full_name: 'Alex Rivera',
    email: 'alex.rivera@metrohealth.org',
    role: 'patient',
    phone: '+1 (555) 345-6789',
    created_at: '2026-01-15T10:30:00Z',
    medical_history_notes: 'Previous meniscus repair in left knee (2023). No chronic cardiac or neurological conditions.',
    allergies: 'None known',
    blood_group: 'A Positive',
    emergency_contact: 'Carla Rivera (Sister) - +1 (555) 345-0012'
  },
  // Doctors
  {
    id: 'doc-1',
    full_name: 'Dr. Marcus Vance, MD, FACC',
    email: 'marcus.vance@metrohealth.org',
    role: 'doctor',
    phone: '+1 (555) 890-1122',
    created_at: '2025-06-01T08:00:00Z'
  },
  {
    id: 'doc-2',
    full_name: 'Dr. Elena Rostova, MD, PhD',
    email: 'elena.rostova@metrohealth.org',
    role: 'doctor',
    phone: '+1 (555) 890-2233',
    created_at: '2025-06-01T08:00:00Z'
  },
  {
    id: 'doc-3',
    full_name: 'Dr. James Wilson, MD',
    email: 'james.wilson@metrohealth.org',
    role: 'doctor',
    phone: '+1 (555) 890-3344',
    created_at: '2025-07-15T08:00:00Z'
  },
  {
    id: 'doc-4',
    full_name: 'Dr. Sarah Chen, MD, FAAP',
    email: 'sarah.chen@metrohealth.org',
    role: 'doctor',
    phone: '+1 (555) 890-4455',
    created_at: '2025-08-20T08:00:00Z'
  },
  // Admin
  {
    id: 'adm-1',
    full_name: 'Sarah Jenkins',
    email: 'admin.jenkins@metrohealth.org',
    role: 'admin',
    phone: '+1 (555) 890-0001',
    created_at: '2025-01-01T08:00:00Z'
  }
];

const INITIAL_DOCTORS: Doctor[] = [
  {
    id: 'doc-1',
    department_id: 'dept-1',
    specialty: 'Interventional Cardiology',
    bio: 'Board-certified cardiologist with over 16 years of clinical leadership in coronary interventions, hypertension management, and non-invasive cardiovascular diagnostics.',
    photo_url: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=400',
    qualification: 'MD, Johns Hopkins University; Fellowship at Mayo Clinic',
    room_number: 'Consultation Suite 304',
    experience_years: 16,
    consultation_fee: 175
  },
  {
    id: 'doc-2',
    department_id: 'dept-2',
    specialty: 'Clinical Neurology & Epilepsy',
    bio: 'Senior neurologist focusing on advanced migraine treatment, neuromuscular disorders, EEG interpretations, and post-stroke rehabilitation protocols.',
    photo_url: 'https://images.unsplash.com/photo-1594824813629-450f36f36611?auto=format&fit=crop&q=80&w=400',
    qualification: 'MD, PhD, Harvard Medical School',
    room_number: 'Neurology Wing 212',
    experience_years: 14,
    consultation_fee: 190
  },
  {
    id: 'doc-3',
    department_id: 'dept-4',
    specialty: 'Orthopedic Surgery & Sports Medicine',
    bio: 'Specialist in minimally invasive arthroscopic surgeries, joint preservation, fracture stabilization, and athlete rehabilitation.',
    photo_url: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&q=80&w=400',
    qualification: 'MD, Stanford University Medical Center',
    room_number: 'Surgical Pavilion 108',
    experience_years: 12,
    consultation_fee: 160
  },
  {
    id: 'doc-4',
    department_id: 'dept-3',
    specialty: 'General Pediatrics & Adolescent Medicine',
    bio: 'Dedicated pediatrician providing developmental assessments, pediatric immunizations, childhood respiratory care, and parental counseling.',
    photo_url: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=400',
    qualification: 'MD, Columbia University Vagelos College of Physicians and Surgeons',
    room_number: 'Pediatric Care Center 102',
    experience_years: 10,
    consultation_fee: 140
  }
];

// Helper to create slots for next 5 days
function generateSeedSlots(): AvailabilitySlot[] {
  const slots: AvailabilitySlot[] = [];
  const doctorIds = ['doc-1', 'doc-2', 'doc-3', 'doc-4'];
  const times = [
    { start: '09:00', end: '09:45' },
    { start: '10:00', end: '10:45' },
    { start: '11:15', end: '12:00' },
    { start: '14:00', end: '14:45' },
    { start: '15:15', end: '16:00' },
    { start: '16:30', end: '17:15' }
  ];

  let counter = 1;
  // Today through 4 days ahead
  for (let offset = 0; offset <= 5; offset++) {
    const dateStr = getRelativeDate(offset);
    for (const docId of doctorIds) {
      for (const t of times) {
        // Mark a couple as pre-booked
        const isPreBooked = (docId === 'doc-1' && offset === 1 && t.start === '10:00') ||
                            (docId === 'doc-2' && offset === 2 && t.start === '14:00') ||
                            (docId === 'doc-3' && offset === 0 && t.start === '11:15');

        slots.push({
          id: `slot-${counter++}`,
          doctor_id: docId,
          date: dateStr,
          start_time: t.start,
          end_time: t.end,
          is_booked: isPreBooked
        });
      }
    }
  }

  return slots;
}

const INITIAL_SLOTS = generateSeedSlots();

const INITIAL_APPOINTMENTS: Appointment[] = [
  {
    id: 'apt-101',
    patient_id: 'pat-1',
    doctor_id: 'doc-1',
    slot_id: INITIAL_SLOTS.find(s => s.doctor_id === 'doc-1' && s.is_booked)?.id || 'slot-2',
    status: 'confirmed',
    notes: 'Patient reports mild shortness of breath during brisk walking. Requesting EKG assessment.',
    patient_reason: 'Routine cardiovascular evaluation and blood pressure check',
    created_at: new Date(Date.now() - 86400000).toISOString(),
    updated_at: new Date(Date.now() - 86400000).toISOString()
  },
  {
    id: 'apt-102',
    patient_id: 'pat-2',
    doctor_id: 'doc-2',
    slot_id: INITIAL_SLOTS.find(s => s.doctor_id === 'doc-2' && s.is_booked)?.id || 'slot-10',
    status: 'confirmed',
    notes: 'Recurring tension migraines occurring 3 times weekly.',
    patient_reason: 'Neurological headache consultation and treatment adjustment',
    created_at: new Date(Date.now() - 172800000).toISOString(),
    updated_at: new Date(Date.now() - 172800000).toISOString()
  },
  {
    id: 'apt-100',
    patient_id: 'pat-1',
    doctor_id: 'doc-3',
    slot_id: INITIAL_SLOTS.find(s => s.doctor_id === 'doc-3' && s.is_booked)?.id || 'slot-15',
    status: 'completed',
    notes: 'Left wrist strain resolved after 3 weeks of splinting. Range of motion restored to 100%.',
    patient_reason: 'Follow-up consultation for left wrist rehabilitation',
    created_at: new Date(Date.now() - 864000000).toISOString(),
    updated_at: new Date(Date.now() - 86400000).toISOString()
  }
];

const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif-1',
    user_id: 'pat-1',
    type: 'confirmation',
    message: 'Your appointment with Dr. Marcus Vance on ' + getRelativeDate(1) + ' at 10:00 is confirmed.',
    sent_at: new Date(Date.now() - 86400000).toISOString(),
    read: false,
    appointment_id: 'apt-101'
  },
  {
    id: 'notif-2',
    user_id: 'doc-1',
    type: 'confirmation',
    message: 'New appointment scheduled: Emily Watson on ' + getRelativeDate(1) + ' at 10:00.',
    sent_at: new Date(Date.now() - 86400000).toISOString(),
    read: false,
    appointment_id: 'apt-101'
  },
  {
    id: 'notif-3',
    user_id: 'pat-2',
    type: 'confirmation',
    message: 'Your appointment with Dr. Elena Rostova on ' + getRelativeDate(2) + ' at 14:00 is confirmed.',
    sent_at: new Date(Date.now() - 172800000).toISOString(),
    read: true,
    appointment_id: 'apt-102'
  },
  {
    id: 'notif-4',
    user_id: 'adm-1',
    type: 'system',
    message: 'Daily queue generated: 8 appointments scheduled across 4 departments today.',
    sent_at: new Date(Date.now() - 3600000).toISOString(),
    read: false
  }
];

// LocalStorage helpers with type safety
function getStored<T>(key: string, fallback: T): T {
  try {
    const item = localStorage.getItem(key);
    if (!item) return fallback;
    return JSON.parse(item) as T;
  } catch (err) {
    console.warn(`Failed to parse ${key} from localStorage:`, err);
    return fallback;
  }
}

function setStored<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    window.dispatchEvent(new Event('hams_storage_updated'));
  } catch (err) {
    console.error(`Failed to write ${key} to localStorage:`, err);
  }
}

// Ensure seed data initialized
export function initializeStorage(): void {
  if (!localStorage.getItem(STORAGE_KEYS.PROFILES)) {
    setStored(STORAGE_KEYS.PROFILES, INITIAL_PROFILES);
  }
  if (!localStorage.getItem(STORAGE_KEYS.DEPARTMENTS)) {
    setStored(STORAGE_KEYS.DEPARTMENTS, INITIAL_DEPARTMENTS);
  }
  if (!localStorage.getItem(STORAGE_KEYS.DOCTORS)) {
    setStored(STORAGE_KEYS.DOCTORS, INITIAL_DOCTORS);
  }
  if (!localStorage.getItem(STORAGE_KEYS.SLOTS)) {
    setStored(STORAGE_KEYS.SLOTS, INITIAL_SLOTS);
  }
  if (!localStorage.getItem(STORAGE_KEYS.APPOINTMENTS)) {
    setStored(STORAGE_KEYS.APPOINTMENTS, INITIAL_APPOINTMENTS);
  }
  if (!localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS)) {
    setStored(STORAGE_KEYS.NOTIFICATIONS, INITIAL_NOTIFICATIONS);
  }
  if (!localStorage.getItem(STORAGE_KEYS.CURRENT_USER_ID)) {
    // Default logged in as first patient
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER_ID, 'pat-1');
  }

  // If Supabase credentials are configured, sync initial data from remote in the background
  if (supabaseService.isConfigured()) {
    supabaseService.fetchAppointments().then(remoteApts => {
      if (remoteApts && remoteApts.length > 0) {
        const local = getStored<Appointment[]>(STORAGE_KEYS.APPOINTMENTS, []);
        const mergedMap = new Map<string, Appointment>();
        local.forEach(a => mergedMap.set(a.id, a));
        remoteApts.forEach(a => mergedMap.set(a.id, a));
        setStored(STORAGE_KEYS.APPOINTMENTS, Array.from(mergedMap.values()));
      }
    }).catch(() => {
      // Graceful fallback to local store
    });
  }
}

// Storage API
export const storageService = {
  // Profiles & Auth
  getProfiles(): Profile[] {
    return getStored<Profile[]>(STORAGE_KEYS.PROFILES, INITIAL_PROFILES);
  },
  
  getProfileById(id: string): Profile | undefined {
    return this.getProfiles().find(p => p.id === id);
  },

  getCurrentUserId(): string {
    return localStorage.getItem(STORAGE_KEYS.CURRENT_USER_ID) || 'pat-1';
  },

  setCurrentUserId(id: string): void {
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER_ID, id);
    window.dispatchEvent(new Event('hams_auth_changed'));
  },

  getCurrentUser(): Profile {
    const id = this.getCurrentUserId();
    const profile = this.getProfileById(id);
    if (profile) return profile;
    return this.getProfiles()[0];
  },

  updateProfile(id: string, updates: Partial<Profile>): Profile {
    const profiles = this.getProfiles();
    const idx = profiles.findIndex(p => p.id === id);
    if (idx === -1) throw new Error('Profile not found');
    profiles[idx] = { ...profiles[idx], ...updates };
    setStored(STORAGE_KEYS.PROFILES, profiles);
    supabaseService.syncProfile(profiles[idx]).catch(() => {});
    return profiles[idx];
  },

  createProfile(data: Omit<Profile, 'id' | 'created_at'>): Profile {
    const profiles = this.getProfiles();
    const newProfile: Profile = {
      ...data,
      id: `usr-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      created_at: new Date().toISOString()
    };
    profiles.push(newProfile);
    setStored(STORAGE_KEYS.PROFILES, profiles);
    supabaseService.syncProfile(newProfile).catch(() => {});
    return newProfile;
  },

  // Departments
  getDepartments(): Department[] {
    return getStored<Department[]>(STORAGE_KEYS.DEPARTMENTS, INITIAL_DEPARTMENTS);
  },

  createDepartment(dept: Omit<Department, 'id'>): Department {
    const depts = this.getDepartments();
    const newDept: Department = {
      ...dept,
      id: `dept-${Date.now()}`
    };
    depts.push(newDept);
    setStored(STORAGE_KEYS.DEPARTMENTS, depts);
    return newDept;
  },

  updateDepartment(id: string, updates: Partial<Department>): Department {
    const depts = this.getDepartments();
    const idx = depts.findIndex(d => d.id === id);
    if (idx === -1) throw new Error('Department not found');
    depts[idx] = { ...depts[idx], ...updates };
    setStored(STORAGE_KEYS.DEPARTMENTS, depts);
    return depts[idx];
  },

  deleteDepartment(id: string): void {
    const depts = this.getDepartments().filter(d => d.id !== id);
    setStored(STORAGE_KEYS.DEPARTMENTS, depts);
  },

  // Doctors
  getDoctors(): Doctor[] {
    return getStored<Doctor[]>(STORAGE_KEYS.DOCTORS, INITIAL_DOCTORS);
  },

  getDoctorWithDetails(id: string): DoctorWithDetails | undefined {
    const doctors = this.getDoctors();
    const doc = doctors.find(d => d.id === id);
    if (!doc) return undefined;
    const profile = this.getProfileById(doc.id);
    const dept = this.getDepartments().find(d => d.id === doc.department_id);
    return {
      ...doc,
      full_name: profile?.full_name || 'Dr. Medical Staff',
      email: profile?.email || '',
      phone: profile?.phone || '',
      department_name: dept?.name || 'General'
    };
  },

  getAllDoctorsWithDetails(): DoctorWithDetails[] {
    const doctors = this.getDoctors();
    const profiles = this.getProfiles();
    const depts = this.getDepartments();

    return doctors.map(doc => {
      const profile = profiles.find(p => p.id === doc.id);
      const dept = depts.find(d => d.id === doc.department_id);
      return {
        ...doc,
        full_name: profile?.full_name || 'Dr. Medical Staff',
        email: profile?.email || '',
        phone: profile?.phone || '',
        department_name: dept?.name || 'General'
      };
    });
  },

  createDoctor(
    profileData: { full_name: string; email: string; phone: string },
    docData: Omit<Doctor, 'id'>
  ): DoctorWithDetails {
    // Create Doctor Profile first
    const profile = this.createProfile({
      ...profileData,
      role: 'doctor'
    });

    const doctors = this.getDoctors();
    const newDoctor: Doctor = {
      ...docData,
      id: profile.id
    };
    doctors.push(newDoctor);
    setStored(STORAGE_KEYS.DOCTORS, doctors);

    // Auto-generate some slots for the new doctor for the upcoming week
    const times = ['09:00', '10:00', '11:00', '14:00', '15:00'];
    for (let offset = 1; offset <= 5; offset++) {
      const dateStr = getRelativeDate(offset);
      for (const t of times) {
        this.createAvailabilitySlot({
          doctor_id: newDoctor.id,
          date: dateStr,
          start_time: t,
          end_time: t === '09:00' ? '09:45' : t === '10:00' ? '10:45' : t === '11:00' ? '11:45' : t === '14:00' ? '14:45' : '15:45',
          is_booked: false
        });
      }
    }

    return this.getDoctorWithDetails(newDoctor.id)!;
  },

  updateDoctor(id: string, updates: Partial<Doctor>): Doctor {
    const doctors = this.getDoctors();
    const idx = doctors.findIndex(d => d.id === id);
    if (idx === -1) throw new Error('Doctor not found');
    doctors[idx] = { ...doctors[idx], ...updates };
    setStored(STORAGE_KEYS.DOCTORS, doctors);
    return doctors[idx];
  },

  deleteDoctor(id: string): void {
    const doctors = this.getDoctors().filter(d => d.id !== id);
    setStored(STORAGE_KEYS.DOCTORS, doctors);
    // Also remove their profile
    const profiles = this.getProfiles().filter(p => p.id !== id);
    setStored(STORAGE_KEYS.PROFILES, profiles);
    // Remove unbooked availability slots
    const slots = this.getAvailabilitySlots().filter(s => s.doctor_id !== id || s.is_booked);
    setStored(STORAGE_KEYS.SLOTS, slots);
  },

  // Availability Slots
  getAvailabilitySlots(): AvailabilitySlot[] {
    return getStored<AvailabilitySlot[]>(STORAGE_KEYS.SLOTS, INITIAL_SLOTS);
  },

  getDoctorSlots(doctorId: string, dateFilter?: string): AvailabilitySlot[] {
    return this.getAvailabilitySlots().filter(s => {
      if (s.doctor_id !== doctorId) return false;
      if (dateFilter && s.date !== dateFilter) return false;
      return true;
    }).sort((a, b) => a.date.localeCompare(b.date) || a.start_time.localeCompare(b.start_time));
  },

  createAvailabilitySlot(slot: Omit<AvailabilitySlot, 'id'>): AvailabilitySlot {
    const slots = this.getAvailabilitySlots();
    // Check for existing slot at same time
    const existing = slots.find(s => s.doctor_id === slot.doctor_id && s.date === slot.date && s.start_time === slot.start_time);
    if (existing) {
      return existing;
    }
    const newSlot: AvailabilitySlot = {
      ...slot,
      id: `slot-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`
    };
    slots.push(newSlot);
    setStored(STORAGE_KEYS.SLOTS, slots);
    return newSlot;
  },

  deleteAvailabilitySlot(id: string): void {
    const slots = this.getAvailabilitySlots();
    const target = slots.find(s => s.id === id);
    if (target?.is_booked) {
      throw new Error('Cannot delete an active booked slot. Cancel the appointment first.');
    }
    const filtered = slots.filter(s => s.id !== id);
    setStored(STORAGE_KEYS.SLOTS, filtered);
  },

  // Appointments
  getAppointments(): Appointment[] {
    return getStored<Appointment[]>(STORAGE_KEYS.APPOINTMENTS, INITIAL_APPOINTMENTS);
  },

  getAllAppointmentsWithDetails(): AppointmentWithDetails[] {
    const appointments = this.getAppointments();
    const profiles = this.getProfiles();
    const doctors = this.getDoctors();
    const depts = this.getDepartments();
    const slots = this.getAvailabilitySlots();

    return appointments.map(apt => {
      const patient = profiles.find(p => p.id === apt.patient_id);
      const doctorProfile = profiles.find(p => p.id === apt.doctor_id);
      const doctorData = doctors.find(d => d.id === apt.doctor_id);
      const dept = depts.find(d => d.id === doctorData?.department_id);
      const slot = slots.find(s => s.id === apt.slot_id);

      return {
        ...apt,
        doctor_name: doctorProfile?.full_name || 'Dr. Medical Staff',
        doctor_specialty: doctorData?.specialty || 'General Care',
        department_name: dept?.name || 'Outpatient Clinic',
        patient_name: patient?.full_name || 'Patient',
        patient_phone: patient?.phone || '',
        patient_email: patient?.email || '',
        slot_date: slot?.date || 'Unscheduled',
        slot_start_time: slot?.start_time || '--:--',
        slot_end_time: slot?.end_time || '--:--',
        doctor_room: doctorData?.room_number || 'Room 101'
      };
    }).sort((a, b) => b.slot_date.localeCompare(a.slot_date) || b.slot_start_time.localeCompare(a.slot_start_time));
  },

  getPatientAppointments(patientId: string): AppointmentWithDetails[] {
    return this.getAllAppointmentsWithDetails().filter(a => a.patient_id === patientId);
  },

  getDoctorAppointments(doctorId: string): AppointmentWithDetails[] {
    return this.getAllAppointmentsWithDetails().filter(a => a.doctor_id === doctorId);
  },

  // Core Booking with Strict Double-Booking Prevention (FR3)
  bookAppointment(data: {
    patient_id: string;
    doctor_id: string;
    slot_id: string;
    patient_reason: string;
    notes?: string;
  }): AppointmentWithDetails {
    const slots = this.getAvailabilitySlots();
    const slotIndex = slots.findIndex(s => s.id === data.slot_id);

    if (slotIndex === -1) {
      throw new Error('Selected time slot does not exist.');
    }

    const slot = slots[slotIndex];

    // Check double-booking constraint
    if (slot.is_booked) {
      throw new Error('This time slot is already booked. Please choose another time.');
    }

    // Mark slot as booked
    slots[slotIndex].is_booked = true;
    setStored(STORAGE_KEYS.SLOTS, slots);
    supabaseService.syncSlot(slots[slotIndex]).catch(() => {});

    // Create appointment
    const appointments = this.getAppointments();
    const newAppointment: Appointment = {
      id: `apt-${Date.now()}`,
      patient_id: data.patient_id,
      doctor_id: data.doctor_id,
      slot_id: data.slot_id,
      status: 'confirmed',
      notes: data.notes || '',
      patient_reason: data.patient_reason || 'Medical consultation',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    appointments.push(newAppointment);
    setStored(STORAGE_KEYS.APPOINTMENTS, appointments);
    supabaseService.syncAppointment(newAppointment).catch(() => {});

    // Create notifications for patient & doctor
    const docProfile = this.getProfileById(data.doctor_id);
    const patProfile = this.getProfileById(data.patient_id);

    this.createNotification({
      user_id: data.patient_id,
      type: 'confirmation',
      message: `Appointment confirmed with ${docProfile?.full_name || 'the doctor'} on ${slot.date} at ${slot.start_time}.`,
      appointment_id: newAppointment.id
    });

    this.createNotification({
      user_id: data.doctor_id,
      type: 'confirmation',
      message: `New booking: ${patProfile?.full_name || 'Patient'} on ${slot.date} at ${slot.start_time}. Reason: ${data.patient_reason}`,
      appointment_id: newAppointment.id
    });

    return this.getAllAppointmentsWithDetails().find(a => a.id === newAppointment.id)!;
  },

  // Reschedule Appointment
  rescheduleAppointment(appointmentId: string, newSlotId: string): AppointmentWithDetails {
    const appointments = this.getAppointments();
    const aptIndex = appointments.findIndex(a => a.id === appointmentId);
    if (aptIndex === -1) throw new Error('Appointment not found');

    const apt = appointments[aptIndex];
    const slots = this.getAvailabilitySlots();
    
    // Check new slot
    const newSlotIndex = slots.findIndex(s => s.id === newSlotId);
    if (newSlotIndex === -1) throw new Error('New time slot not found');
    if (slots[newSlotIndex].is_booked) throw new Error('New time slot is already booked');

    // Free old slot
    const oldSlotIndex = slots.findIndex(s => s.id === apt.slot_id);
    if (oldSlotIndex !== -1) {
      slots[oldSlotIndex].is_booked = false;
    }

    // Reserve new slot
    slots[newSlotIndex].is_booked = true;
    setStored(STORAGE_KEYS.SLOTS, slots);

    // Update appointment
    appointments[aptIndex].slot_id = newSlotId;
    appointments[aptIndex].status = 'confirmed';
    appointments[aptIndex].updated_at = new Date().toISOString();
    setStored(STORAGE_KEYS.APPOINTMENTS, appointments);

    const newSlot = slots[newSlotIndex];
    const docProfile = this.getProfileById(apt.doctor_id);

    this.createNotification({
      user_id: apt.patient_id,
      type: 'reminder',
      message: `Your appointment with ${docProfile?.full_name || 'the doctor'} has been rescheduled to ${newSlot.date} at ${newSlot.start_time}.`,
      appointment_id: apt.id
    });

    return this.getAllAppointmentsWithDetails().find(a => a.id === apt.id)!;
  },

  // Cancel Appointment
  cancelAppointment(appointmentId: string, cancellationReason?: string): AppointmentWithDetails {
    const appointments = this.getAppointments();
    const aptIndex = appointments.findIndex(a => a.id === appointmentId);
    if (aptIndex === -1) throw new Error('Appointment not found');

    const apt = appointments[aptIndex];
    if (apt.status === 'cancelled') {
      throw new Error('Appointment is already cancelled.');
    }

    // Free slot
    const slots = this.getAvailabilitySlots();
    const slotIndex = slots.findIndex(s => s.id === apt.slot_id);
    if (slotIndex !== -1) {
      slots[slotIndex].is_booked = false;
      setStored(STORAGE_KEYS.SLOTS, slots);
      supabaseService.syncSlot(slots[slotIndex]).catch(() => {});
    }

    // Update status
    appointments[aptIndex].status = 'cancelled';
    if (cancellationReason) {
      appointments[aptIndex].notes = (appointments[aptIndex].notes ? appointments[aptIndex].notes + ' | ' : '') + `Cancelled: ${cancellationReason}`;
    }
    appointments[aptIndex].updated_at = new Date().toISOString();
    setStored(STORAGE_KEYS.APPOINTMENTS, appointments);
    supabaseService.syncAppointment(appointments[aptIndex]).catch(() => {});

    // Notify parties
    const docProfile = this.getProfileById(apt.doctor_id);
    const patProfile = this.getProfileById(apt.patient_id);

    this.createNotification({
      user_id: apt.patient_id,
      type: 'cancellation',
      message: `Your appointment with ${docProfile?.full_name || 'the doctor'} was cancelled.`,
      appointment_id: apt.id
    });

    this.createNotification({
      user_id: apt.doctor_id,
      type: 'cancellation',
      message: `Appointment with ${patProfile?.full_name || 'Patient'} has been cancelled.`,
      appointment_id: apt.id
    });

    return this.getAllAppointmentsWithDetails().find(a => a.id === apt.id)!;
  },

  // Update Status (doctor/admin action)
  updateAppointmentStatus(appointmentId: string, status: AppointmentStatus, doctorNotes?: string): AppointmentWithDetails {
    const appointments = this.getAppointments();
    const idx = appointments.findIndex(a => a.id === appointmentId);
    if (idx === -1) throw new Error('Appointment not found');

    appointments[idx].status = status;
    if (doctorNotes !== undefined) {
      appointments[idx].notes = doctorNotes;
    }
    appointments[idx].updated_at = new Date().toISOString();
    setStored(STORAGE_KEYS.APPOINTMENTS, appointments);
    supabaseService.syncAppointment(appointments[idx]).catch(() => {});

    const apt = appointments[idx];
    if (status === 'completed') {
      this.createNotification({
        user_id: apt.patient_id,
        type: 'system',
        message: `Your appointment has been marked as completed. Follow-up notes have been recorded in your clinical visit history.`,
        appointment_id: apt.id
      });
    }

    return this.getAllAppointmentsWithDetails().find(a => a.id === appointmentId)!;
  },

  // Notifications
  getNotifications(): NotificationItem[] {
    return getStored<NotificationItem[]>(STORAGE_KEYS.NOTIFICATIONS, INITIAL_NOTIFICATIONS);
  },

  getUserNotifications(userId: string): NotificationItem[] {
    return this.getNotifications()
      .filter(n => n.user_id === userId)
      .sort((a, b) => b.sent_at.localeCompare(a.sent_at));
  },

  createNotification(item: Omit<NotificationItem, 'id' | 'sent_at' | 'read'>): NotificationItem {
    const notifs = this.getNotifications();
    const newNotif: NotificationItem = {
      ...item,
      id: `notif-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      sent_at: new Date().toISOString(),
      read: false
    };
    notifs.unshift(newNotif);
    setStored(STORAGE_KEYS.NOTIFICATIONS, notifs);
    supabaseService.syncNotification(newNotif).catch(() => {});
    return newNotif;
  },

  markNotificationAsRead(id: string): void {
    const notifs = this.getNotifications();
    const idx = notifs.findIndex(n => n.id === id);
    if (idx !== -1) {
      notifs[idx].read = true;
      setStored(STORAGE_KEYS.NOTIFICATIONS, notifs);
    }
  },

  markAllNotificationsAsRead(userId: string): void {
    const notifs = this.getNotifications();
    for (const n of notifs) {
      if (n.user_id === userId) {
        n.read = true;
      }
    }
    setStored(STORAGE_KEYS.NOTIFICATIONS, notifs);
  },

  clearNotifications(userId: string): void {
    const notifs = this.getNotifications().filter(n => n.user_id !== userId);
    setStored(STORAGE_KEYS.NOTIFICATIONS, notifs);
  },

  // Analytics helper for admin
  getHospitalAnalytics() {
    const appointments = this.getAllAppointmentsWithDetails();
    const doctors = this.getDoctors();
    const depts = this.getDepartments();
    const slots = this.getAvailabilitySlots();

    const totalAppointments = appointments.length;
    const confirmedCount = appointments.filter(a => a.status === 'confirmed').length;
    const completedCount = appointments.filter(a => a.status === 'completed').length;
    const cancelledCount = appointments.filter(a => a.status === 'cancelled').length;
    const pendingCount = appointments.filter(a => a.status === 'pending').length;

    const bookedSlotsCount = slots.filter(s => s.is_booked).length;
    const totalSlotsCount = slots.length;
    const slotOccupancyRate = totalSlotsCount > 0 ? Math.round((bookedSlotsCount / totalSlotsCount) * 100) : 0;

    // By department
    const deptDistribution = depts.map(d => {
      const count = appointments.filter(a => a.department_name === d.name).length;
      return {
        name: d.name,
        code: d.code,
        count
      };
    });

    return {
      totalAppointments,
      confirmedCount,
      completedCount,
      cancelledCount,
      pendingCount,
      activeDoctorsCount: doctors.length,
      departmentsCount: depts.length,
      totalSlotsCount,
      bookedSlotsCount,
      slotOccupancyRate,
      deptDistribution
    };
  }
};
