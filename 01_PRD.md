# Product Requirements Document (PRD)
## Hospital Appointment Management System (HAMS)

### 1. Overview
The Hospital Appointment Management System (HAMS) is a web-based platform that lets patients book, reschedule, and cancel appointments with doctors, while giving hospital staff and doctors tools to manage schedules, patient records, and appointment queues in one place.

### 2. Problem Statement
Patients currently book appointments by calling the hospital or walking in, which leads to long queues, double bookings, and no-shows. Staff manage schedules manually on paper or spreadsheets, which is slow and error-prone.

### 3. Goals
- Let patients book/manage appointments online in under 2 minutes.
- Give doctors a clear daily/weekly schedule view.
- Give admins a dashboard to manage doctors, departments, and appointment load.
- Reduce no-shows with automated reminders.
- Provide a single source of truth for appointment data.

### 4. Non-Goals (out of scope for v1)
- Billing / insurance claims processing.
- Video consultation (telemedicine) — may be a future phase.
- Pharmacy / lab report integration.

### 5. User Personas
| Persona | Description | Key Needs |
|---|---|---|
| Patient | Books appointments, views history | Fast booking, reminders, easy rescheduling |
| Doctor | Views/manages their schedule | Clear day view, patient info, mark completed/no-show |
| Receptionist/Admin | Manages doctors, departments, walk-ins | Full calendar control, manual booking, reports |
| Super Admin | Manages the whole system | User roles, analytics, system settings |

### 6. Core Features (v1)
1. **Authentication & Roles** — Sign up/login for Patient, Doctor, Admin (role-based access).
2. **Doctor & Department Directory** — Browse doctors by department/specialty, view availability.
3. **Appointment Booking** — Patient selects doctor, date, time slot; system prevents double-booking.
4. **Appointment Management** — Reschedule, cancel, view upcoming/past appointments.
5. **Doctor Schedule View** — Calendar/list of the doctor's appointments per day/week.
6. **Admin Dashboard** — Manage doctors, departments, time slots, view all appointments.
7. **Notifications** — Email/SMS/in-app reminders before appointment (confirmation, reminder, cancellation).
8. **Patient Profile & History** — Basic medical history notes, past visits.

### 7. Future Features (v2+)
- Telemedicine / video consultation.
- Online payments.
- Prescription & report uploads.
- Multi-hospital / multi-branch support.

### 8. Functional Requirements
- FR1: A patient must be able to register and log in securely.
- FR2: A patient must be able to search doctors by department, name, or availability.
- FR3: The system must prevent two patients from booking the same doctor at the same time slot.
- FR4: A doctor must be able to view and update the status of each appointment (completed, no-show, cancelled).
- FR5: An admin must be able to add/edit/remove doctors and their available time slots.
- FR6: The system must send a notification when an appointment is booked, rescheduled, or cancelled.

### 9. Non-Functional Requirements
- Responsive design (mobile + desktop).
- Page load under 2 seconds on average.
- Role-based access control (RBAC) — a patient cannot access admin routes.
- Data validation on all forms (no invalid dates, no past-date bookings).
- **No emoji anywhere in the UI, copy, notifications, or code comments** — use icon libraries (e.g., Lucide) instead of emoji for visual cues. (See Design doc, Rule R1.)

### 10. Success Metrics
- Average booking time under 2 minutes.
- No-show rate reduced by X% after reminders are enabled.
- Zero double-bookings in production.

### 11. Assumptions & Constraints
- Single hospital / single branch for v1.
- Supabase is used for auth + database + storage.
- Frontend generated/assembled via Arena AI, refined in Google AI Studio, backend wired to Supabase.
