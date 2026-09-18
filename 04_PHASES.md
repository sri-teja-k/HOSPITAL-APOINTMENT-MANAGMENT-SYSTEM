# Development Phases
## Hospital Appointment Management System (HAMS)

### Phase 0 — Prep (this workshop)
- [ ] Finalize PRD, Design, Architecture docs.
- [ ] Write the "no emoji + design rules" prompt/ruleset for Arena AI.
- [ ] Generate initial frontend in Arena AI using PRD + Design doc as context.
- [ ] Download the frontend ZIP.
- [ ] Push ZIP contents to a new GitHub repository.

### Phase 1 — Foundation
- [ ] Connect GitHub repo to Google AI Studio.
- [ ] Create Supabase project; set up `profiles`, `departments`, `doctors` tables with RLS.
- [ ] Wire up Supabase Auth (sign up / login / logout) in the frontend.
- [ ] Confirm role-based redirect works (patient vs doctor vs admin land on different dashboards).

### Phase 2 — Core Booking Flow
- [ ] Build Doctor Directory page (list + filter by department).
- [ ] Build Doctor Profile + Availability Slot picker.
- [ ] Implement booking logic (create appointment, prevent double-booking via trigger/RLS).
- [ ] Build "My Appointments" page (patient view: upcoming/past/cancelled, reschedule/cancel).

### Phase 3 — Doctor & Admin Tools
- [ ] Build Doctor Dashboard (today's + weekly schedule, update appointment status).
- [ ] Build Admin Dashboard (manage doctors, departments, availability slots).
- [ ] Add basic admin analytics (appointments per day/department).

### Phase 4 — Notifications & Polish
- [ ] Add notification records on booking/reschedule/cancel (in-app minimum; email/SMS if time allows).
- [ ] Add confirmation modals for destructive actions (cancel appointment, delete doctor).
- [ ] Full responsive pass (mobile/tablet/desktop).
- [ ] Accessibility pass (contrast, keyboard nav, labels).
- [ ] Remove any placeholder/lorem ipsum content; verify zero emoji anywhere in UI/code.

### Phase 5 — Testing & Deployment
- [ ] Test all three roles end-to-end (patient books → doctor sees it → admin sees it).
- [ ] Test edge cases: double-booking attempt, cancelling twice, expired slots.
- [ ] Deploy frontend (Vercel/Netlify or via Google AI Studio's deploy option).
- [ ] Final walkthrough / demo prep for the workshop presentation.

### Phase 6 — Stretch Goals (if time permits)
- [ ] Telemedicine/video call links.
- [ ] SMS/email reminders via a scheduled Edge Function.
- [ ] Patient medical history uploads.
- [ ] Multi-branch support.

### Suggested Time Allocation (adjust to your workshop schedule)
| Phase | Focus | Rough Effort |
|---|---|---|
| 0 | Docs + Arena AI generation | Low |
| 1 | Auth + Supabase setup | Medium |
| 2 | Booking flow | High |
| 3 | Doctor/Admin tools | High |
| 4 | Notifications + polish | Medium |
| 5 | Testing + deploy | Medium |
