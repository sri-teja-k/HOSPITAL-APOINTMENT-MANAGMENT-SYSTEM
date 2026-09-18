# Architecture Document
## Hospital Appointment Management System (HAMS)

### 1. Tech Stack
- **Frontend**: React (or Next.js) — generated/scaffolded via Arena AI, refined in Google AI Studio.
- **Backend / DB / Auth / Storage**: Supabase (Postgres + Auth + Row Level Security + Storage).
- **Hosting**: Vercel/Netlify (frontend), Supabase (backend) — or wherever Google AI Studio deploys to.
- **Version Control**: GitHub (connected to Google AI Studio for iterative builds).

### 2. High-Level System Flow
```
Patient/Doctor/Admin (Browser)
        |
        v
   Frontend (React) 
        |
        v
   Supabase Client SDK
        |
        v
 Supabase (Auth + Postgres DB + Storage)
```

### 3. Authentication & Roles
- Supabase Auth handles sign up / login (email + password, optionally OAuth).
- A `profiles` table stores `role` (patient | doctor | admin) linked to `auth.users.id`.
- Row Level Security (RLS) policies enforce that:
  - Patients can only read/write their own appointments and profile.
  - Doctors can only read appointments assigned to them.
  - Admins can read/write all records.

### 4. Core Database Tables (Supabase / Postgres)

**profiles**
| Column | Type | Notes |
|---|---|---|
| id | uuid (PK, FK -> auth.users.id) | |
| full_name | text | |
| role | text | patient / doctor / admin |
| phone | text | |
| created_at | timestamp | |

**departments**
| Column | Type | Notes |
|---|---|---|
| id | uuid (PK) | |
| name | text | e.g. Cardiology |
| description | text | |

**doctors**
| Column | Type | Notes |
|---|---|---|
| id | uuid (PK, FK -> profiles.id) | |
| department_id | uuid (FK -> departments.id) | |
| specialty | text | |
| bio | text | |
| photo_url | text | |

**availability_slots**
| Column | Type | Notes |
|---|---|---|
| id | uuid (PK) | |
| doctor_id | uuid (FK -> doctors.id) | |
| day_of_week / date | int / date | recurring or specific date |
| start_time | time | |
| end_time | time | |
| is_booked | boolean | |

**appointments**
| Column | Type | Notes |
|---|---|---|
| id | uuid (PK) | |
| patient_id | uuid (FK -> profiles.id) | |
| doctor_id | uuid (FK -> doctors.id) | |
| slot_id | uuid (FK -> availability_slots.id) | |
| status | text | pending / confirmed / completed / cancelled / no_show |
| notes | text | |
| created_at | timestamp | |

**notifications**
| Column | Type | Notes |
|---|---|---|
| id | uuid (PK) | |
| user_id | uuid (FK -> profiles.id) | |
| type | text | confirmation / reminder / cancellation |
| message | text | |
| sent_at | timestamp | |
| read | boolean | |

### 5. API / Data Access Pattern
- Frontend talks directly to Supabase via the Supabase JS client (no custom backend server needed for v1).
- Complex logic (e.g., preventing double-booking, sending reminders) handled via **Supabase Edge Functions** or **Postgres functions/triggers**.
- Example: a Postgres trigger on `appointments` insert checks `availability_slots.is_booked` before allowing the insert; sets it to `true` on success.

### 6. Security
- RLS enabled on every table — no table is publicly readable/writable by default.
- Admin-only actions double-checked server-side (Edge Function or RLS policy), never trusted from frontend alone.
- Environment variables (Supabase URL/anon key) stored securely, never committed to GitHub in plaintext for the service role key.

### 7. Deployment / Workflow Notes (for this workshop)
1. Draft PRD, Design, Architecture, Phases docs (these 4 files).
2. Feed relevant files + a clear prompt into Arena AI to generate the initial frontend.
3. Download the frontend ZIP from Arena AI.
4. Push the code to a GitHub repository.
5. Connect that GitHub repo to Google AI Studio.
6. In Google AI Studio: connect Supabase project (URL + anon key), wire up auth, database calls, and finish remaining screens/logic iteratively.
7. Test each role (patient/doctor/admin) end-to-end before calling a phase "done."

### 8. Scalability Notes (kept light for v1)
- Single hospital branch — no multi-tenant logic needed yet.
- If multi-branch is added later, add a `branches` table and a `branch_id` foreign key across departments/doctors/appointments.
