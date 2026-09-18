export type UserRole = 'patient' | 'doctor' | 'admin';

export type AppointmentStatus = 'pending' | 'confirmed' | 'completed' | 'cancelled' | 'no_show';

export type NotificationType = 'confirmation' | 'reminder' | 'cancellation' | 'system';

export interface Profile {
  id: string;
  full_name: string;
  email: string;
  role: UserRole;
  phone: string;
  created_at: string;
  medical_history_notes?: string;
  allergies?: string;
  blood_group?: string;
  emergency_contact?: string;
}

export interface Department {
  id: string;
  name: string;
  description: string;
  head_of_department?: string;
  location?: string;
  code: string;
}

export interface Doctor {
  id: string; // Foreign key -> Profile.id
  department_id: string;
  specialty: string;
  bio: string;
  photo_url: string;
  qualification: string;
  room_number: string;
  experience_years: number;
  consultation_fee: number;
}

export interface AvailabilitySlot {
  id: string;
  doctor_id: string;
  date: string; // YYYY-MM-DD
  start_time: string; // HH:mm
  end_time: string; // HH:mm
  is_booked: boolean;
}

export interface Appointment {
  id: string;
  patient_id: string;
  doctor_id: string;
  slot_id: string;
  status: AppointmentStatus;
  notes: string;
  patient_reason: string;
  created_at: string;
  updated_at?: string;
}

export interface NotificationItem {
  id: string;
  user_id: string;
  type: NotificationType;
  message: string;
  sent_at: string;
  read: boolean;
  appointment_id?: string;
}

// Joined views for UI convenience
export interface AppointmentWithDetails extends Appointment {
  doctor_name: string;
  doctor_specialty: string;
  department_name: string;
  patient_name: string;
  patient_phone: string;
  patient_email: string;
  slot_date: string;
  slot_start_time: string;
  slot_end_time: string;
  doctor_room: string;
}

export interface DoctorWithDetails extends Doctor {
  full_name: string;
  email: string;
  phone: string;
  department_name: string;
}
