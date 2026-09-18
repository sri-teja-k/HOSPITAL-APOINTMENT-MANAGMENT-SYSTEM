import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { 
  Profile, 
  Department, 
  Doctor, 
  AvailabilitySlot, 
  Appointment, 
  NotificationItem 
} from '../types';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = (): boolean => {
  return Boolean(supabaseUrl && supabaseAnonKey && supabaseUrl.trim() !== '' && supabaseAnonKey.trim() !== '');
};

export const supabase: SupabaseClient | null = isSupabaseConfigured()
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true
      }
    })
  : null;

// Safe Supabase sync operations that never throw unhandled errors to the console
export const supabaseService = {
  isConfigured(): boolean {
    return isSupabaseConfigured();
  },

  async fetchAppointments(): Promise<Appointment[] | null> {
    if (!supabase) return null;
    try {
      const { data, error } = await supabase
        .from('appointments')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        return null;
      }
      return data as Appointment[];
    } catch {
      return null;
    }
  },

  async syncAppointment(appointment: Appointment): Promise<boolean> {
    if (!supabase) return false;
    try {
      const { error } = await supabase
        .from('appointments')
        .upsert({
          id: appointment.id,
          patient_id: appointment.patient_id,
          doctor_id: appointment.doctor_id,
          slot_id: appointment.slot_id,
          status: appointment.status,
          notes: appointment.notes,
          patient_reason: appointment.patient_reason,
          created_at: appointment.created_at,
          updated_at: appointment.updated_at || new Date().toISOString()
        });
      return !error;
    } catch {
      return false;
    }
  },

  async syncSlot(slot: AvailabilitySlot): Promise<boolean> {
    if (!supabase) return false;
    try {
      const { error } = await supabase
        .from('availability_slots')
        .upsert({
          id: slot.id,
          doctor_id: slot.doctor_id,
          date: slot.date,
          start_time: slot.start_time,
          end_time: slot.end_time,
          is_booked: slot.is_booked
        });
      return !error;
    } catch {
      return false;
    }
  },

  async syncProfile(profile: Profile): Promise<boolean> {
    if (!supabase) return false;
    try {
      const { error } = await supabase
        .from('profiles')
        .upsert({
          id: profile.id,
          full_name: profile.full_name,
          email: profile.email,
          role: profile.role,
          phone: profile.phone,
          created_at: profile.created_at,
          medical_history_notes: profile.medical_history_notes || '',
          allergies: profile.allergies || '',
          blood_group: profile.blood_group || '',
          emergency_contact: profile.emergency_contact || ''
        });
      return !error;
    } catch {
      return false;
    }
  },

  async syncNotification(notification: NotificationItem): Promise<boolean> {
    if (!supabase) return false;
    try {
      const { error } = await supabase
        .from('notifications')
        .upsert({
          id: notification.id,
          user_id: notification.user_id,
          type: notification.type,
          message: notification.message,
          sent_at: notification.sent_at,
          read: notification.read,
          appointment_id: notification.appointment_id || null
        });
      return !error;
    } catch {
      return false;
    }
  }
};
