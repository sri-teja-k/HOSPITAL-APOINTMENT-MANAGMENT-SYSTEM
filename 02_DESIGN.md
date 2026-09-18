# Design Document
## Hospital Appointment Management System (HAMS)

### 1. Design Principles
- Clean, clinical, trustworthy — this is a healthcare product, not a consumer app.
- Calm color palette, high readability, generous whitespace.
- Accessibility first: proper contrast, readable font sizes, clear focus states.
- Consistency: same components (buttons, cards, forms) reused across every page.

### 2. Global Rules (paste these into your AI tool / Cursor / Arena AI as project rules)
- **R1 — No emoji anywhere.** No emoji in UI text, buttons, headings, notifications, error messages, placeholder text, or code comments. Use a proper icon set (e.g., Lucide, Heroicons, Font Awesome) for any visual symbol instead of emoji.
- **R2 — No lorem ipsum in final UI.** Use realistic hospital-context placeholder text (doctor names, department names, times).
- **R3 — Consistent spacing scale.** Use a single spacing scale (4/8/12/16/24/32px) across all components.
- **R4 — Role-aware UI.** Never show admin-only or doctor-only actions to a patient, even if hidden via CSS — gate at the route/component level.
- **R5 — Every destructive action needs confirmation.** Cancelling an appointment, deleting a doctor, etc. must show a confirm step.

### 3. Color Palette
| Role | Color | Usage |
|---|---|---|
| Primary | Deep blue (#1E5AA8 or similar) | Buttons, links, headers |
| Secondary | Teal/green (#2FA88A) | Success states, "confirmed" tags |
| Warning | Amber (#E8A33D) | Pending/reschedule states |
| Danger | Red (#D64545) | Cancel/errors |
| Neutral | Gray scale (#F7F8FA to #1A1D21) | Backgrounds, text, borders |

### 4. Typography
- Font: a clean sans-serif (Inter, or system default).
- Headings: bold, clear hierarchy (H1 > H2 > H3).
- Body text: minimum 14–16px for readability.

### 5. Core Pages / Screens
1. **Landing Page** — hospital name, quick "Book Appointment" CTA, department highlights.
2. **Login / Sign Up** — role selection happens automatically based on account type (patient by default; doctor/admin accounts created by admin).
3. **Doctor Directory** — filter by department, search by name, view doctor card (photo, specialty, next available slot).
4. **Doctor Profile / Booking Page** — doctor bio, available time slots calendar, "Book" button.
5. **My Appointments (Patient)** — upcoming, past, cancelled tabs; reschedule/cancel actions.
6. **Doctor Dashboard** — today's appointments, weekly calendar, mark appointment status.
7. **Admin Dashboard** — manage doctors, departments, time slots, view all appointments, basic analytics (appointments per day/department).
8. **Patient Profile** — personal info, medical history notes, contact info.
9. **Notifications Center** — list of past reminders/confirmations sent.

### 6. Components Needed
- Navbar (role-aware)
- Doctor Card
- Appointment Card / Row
- Calendar / Time Slot Picker
- Status Badge (Confirmed / Pending / Cancelled / Completed / No-show) — colors, not emoji
- Modal (for confirmations)
- Form inputs (input, select, date picker, textarea)
- Data table (admin dashboard)
- Toast/notification component

### 7. Responsive Behavior
- Mobile: single-column layout, bottom nav or hamburger menu.
- Tablet/Desktop: sidebar navigation, multi-column dashboard layout.

### 8. Accessibility Checklist
- All interactive elements reachable by keyboard.
- Color is never the only signal (pair status colors with text labels, e.g. "Confirmed").
- Alt text on all images/icons.
