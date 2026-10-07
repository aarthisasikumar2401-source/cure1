# CureLink — AI-Based Digitalized Healthcare Platform

CureLink is an integrated digitalized healthcare support platform focused on community medical equipment sharing, localized care discovery, explainable symptom triaging, smart health reminders, and an offline personal health record locker.

> **Crucial Disclaimer:** CureLink frontend-only demo stores application data in browser localStorage. It does not use a production backend or secure medical database. This application is an educational and community support tool. It does NOT diagnose diseases, prescribe medications, or provide medication dosage instructions.

---

## 🌟 Key Platform Features

1. **Medical Equipment Sharing & Borrowing**
   - Community inventory featuring wheelchairs, oxygen concentrators, hospital beds, walkers, crutches, and nebulizers.
   - Live availability tracking, daily contribution rates, sanitized condition verification, and pickup locations.
   - Community members can list their own medical equipment or update existing inventory.

2. **Borrow Request Workflow**
   - Modal booking form with date validation, requester contact details, clinical purpose, and estimated duration/contribution calculations.
   - Interactive demo status controls (Pending, Approved, Rejected, Completed) allowing full lifecycle simulation.
   - Automatic synchronization with equipment availability and platform notification center.

3. **Healthcare Resource Locator ("Find Care")**
   - Searchable directory of emergency hospitals, community clinics, 24-hour pharmacies, and diagnostic laboratories.
   - One-tap phone dialing (`tel:` links), direct Google Maps directions, and 24/7 ER filters.
   - Optional browser geolocation proximity calculation via the Haversine formula (graceful fallback if location is denied).

4. **Explainable Symptom Guidance**
   - Deterministic, rule-based clinical triaging logic operating 100% offline in the browser without external AI latency or downtime.
   - Immediate red-flag screening for life-threatening emergencies (e.g. chest pain, breathing difficulty, stroke symptoms, severe bleeding).
   - Structured explainability sections:
     - **Triage Urgency Level** (*Routine*, *Soon*, *Urgent*)
     - **Detected Factors**
     - **Why This Guidance?**
     - **Recommended Next Steps**
     - **Warning Signs & Red Flags**
     - **When to Seek In-Person Clinical Care**

5. **Smart Health Reminders**
   - Manage prescription medication doses, upcoming doctor appointments, equipment return dates, and routine health checks.
   - Quick one-click completion checkboxes and overdue filtering.
   - Live synchronization with the Dashboard overview.

6. **Personal Health Record Locker**
   - Organize prescriptions, laboratory panels, specialist consultations, and discharge notes in local browser storage.
   - Search by clinical note text, provider name, or record classification.
   - Transparent local storage privacy notice regarding non-HIPAA demo scope.

7. **Notification Center**
   - Real-time event notifications generated whenever requests are placed, approved, reminders are completed, or equipment is listed.
   - Badge counter and mark-as-read controls.

8. **User Profile & Demonstration Data Reset**
   - Configurable patient demo profile (Sarah Mitchell) auto-populating contact details across borrow requests.
   - "Reset Demo Data" feature that instantly restores initial showcase records.

---

## 🏗️ Architecture

```
GitHub
   ↓
Vercel (Zero Serverless Backend / Static Output)
   ↓
React + Vite (Single Deployable SPA)
   ↓
Frontend Service / Data Abstraction Layer
   ↓
Browser LocalStorage Database
```

### LocalStorage Database Keys

All data persists in browser `localStorage` and survives full page refreshes:

- `curelink_equipment` — Community medical equipment inventory
- `curelink_borrow_requests` — User borrow requests with approval lifecycle
- `curelink_resources` — Hospitals, clinics, pharmacies, diagnostic centers
- `curelink_reminders` — Scheduled doses, visits, and returns
- `curelink_health_records` — Local personal medical summaries
- `curelink_notifications` — Platform alerts and status changes
- `curelink_user` — Active profile settings
- `curelink_initialized` — Seed flag for zero-configuration startup

---

## 🛠️ Technology Stack

- **Framework**: React 19 + TypeScript
- **Bundler & Dev Server**: Vite 8
- **Styling**: Tailwind CSS v4 + Plus Jakarta Sans typography
- **Icons**: Lucide React
- **Storage**: Browser LocalStorage Abstraction API
- **Routing & Navigation**: Client-side single-page tab architecture

---

## 🚀 Local Development Setup

### 1. Clone & Install Dependencies
```bash
git clone <repository-url>
cd curelink
npm install
```

### 2. Run the Development Server
```bash
npm run dev
```
Open `http://localhost:3000` in your web browser.

### 3. Production Build
```bash
npm run build
```
Generates a static production bundle in the `dist/` directory.

### 4. Preview Build
```bash
npm run preview
```

---

## ☁️ Vercel Deployment Instructions

CureLink is architected specifically as **ONE deployable frontend** requiring NO external backend, NO database credentials, and NO API keys.

1. Push this repository to **GitHub**.
2. Go to [Vercel](https://vercel.com) and click **"Add New Project"**.
3. Import your GitHub repository.
4. Framework Preset: **Vite** (detected automatically).
5. Build Settings:
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`
6. Click **Deploy**.

The included `vercel.json` provides client-side SPA rewrites so that refreshes work seamlessly.

---

## ⚠️ Limitations & Clinical Notice

- **No Diagnostic Authority**: CureLink is an informational support tool and must never be considered medical advice or an automated doctor.
- **No Remote Syncing**: Because data is saved locally to the browser's `localStorage`, clearing browser data or using a different browser/device will not share data between devices.
- **Privacy Notice**: Never input real-world Protected Health Information (PHI) or confidential medical records into this demo.
