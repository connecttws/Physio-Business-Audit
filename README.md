# KineticFix · Clinical Physiotherapy & Biomechanical Audit

A high-performance clinical intake, musculoskeletal diagnostic screening, and 3-phase rehabilitation protocol generator built with Next.js 16, TypeScript, Tailwind CSS, Prisma 6, and Lucide Icons.

---

## 🔗 Repository

- **GitHub Repository**: [https://github.com/connecttws/Physio-Business-Audit](https://github.com/connecttws/Physio-Business-Audit)

---

## 🏥 Clinical Diagnostic Features

### 1. 7 Pain & Injury Tracks
- 🦴 **`lumbar` — Lower Back & Sciatica**: Flexion/extension tolerance, nerve root tension, core brace stability.
- 💻 **`cervical` — Neck, Upper Back & Tech-Neck**: Forward head posture, thoracic mobility, suboccipital tension.
- 🦵 **`knee` — Knee Joint & Patellofemoral Dysfunction**: Patellar tracking, valgus collapse, meniscal load screen.
- 🎾 **`shoulder` — Shoulder Impingement & Rotator Cuff Screen**: Subacromial clearance, scapular dyskinesis, rotator cuff strength.
- 🦶 **`ankle` — Ankle Joint, Heel Pain & Plantar Fascia**: Dorsiflexion restriction, Achilles load, arch collapse.
- ⌨️ **`elbow` — Elbow, Wrist & Repetitive Strain (RSI / Carpal Tunnel)**: Epicondylitis triggers, median nerve entrapment, wrist extensor fatigue.
- 🩹 **`postop` — Post-Surgical, Post-Fracture & Trauma Rehab**: Scar tissue mobility, arthrofibrosis risk, progressive weight-bearing.

### 2. Universal Safety & Red Flag Screening
- Identifies neurological red flags (progressive motor deficit, saddle numbness, bilateral symptoms).
- Evaluates previous interventions (temporary pain relief vs. structured mechanical rehabilitation).

### 3. Dynamic Scoring & Radar Visualizer
- Instant 0–100 Kinetic Dysfunction Score calculation.
- 5-Pillar Kinetic Chain Balance SVG visualization comparing Patient Baseline vs. 95% Optimal Functional Target.
- Automated triage of mechanical breakdowns into `critical`, `moderate`, and `optimal` bands.

### 4. 3-Phase Clinical Rehabilitation Protocol
- **Phase 1: Sessions 1–4**: Decompression & Pain Modulation (Gentle mobilization, inflammation relief).
- **Phase 2: Sessions 5–8**: Motor Control & Stabilizer Activation (Targeted neuromuscular re-education).
- **Phase 3: Sessions 9–12+**: Load Tolerance & Recurrence Prevention (Progressive resistance, functional movement patterns).

### 5. Seamless Patient Sharing & Communication
- **Clean Short URLs**: Direct routing via `/r/[id]` with optimized query payload fallback (`?d=...`).
- **1-Tap WhatsApp Dispatch**: Sends personalized patient summary with interactive digital report link.
- **Clinic Direct Booking**: Quick connection to the clinical team.

---

## 📁 Directory Architecture

```
Physio-Business-Audit/
├── prisma/
│   ├── schema.prisma                        # Prisma schema (Audit record with JSON metrics)
│   └── migrations/                          # Database migration history
├── public/                                  # Static medical icons and graphics
├── scripts/
│   └── init-db.mjs                          # Database initialization utility
├── src/
│   ├── app/
│   │   ├── api/audits/                      # REST API for audit submission & retrieval
│   │   │   ├── [id]/route.ts
│   │   │   └── route.ts
│   │   ├── r/[id]/route.ts                  # Clean short URL redirection handler
│   │   ├── report/page.tsx                  # Interactive patient report presentation
│   │   ├── globals.css                      # Tailwind theme, medical badges, dark slate styling
│   │   ├── layout.tsx                       # Root layout with scroll-behavior normalization
│   │   └── page.tsx                         # Main clinical intake wizard
│   ├── components/
│   │   ├── AuditCompleteStep.tsx            # Post-audit completion banner
│   │   ├── AuditorNav.tsx                   # Top navigation with audit switcher
│   │   ├── ClinicalQuestionnaire.tsx        # Multi-track diagnostic questionnaire
│   │   ├── RecentAuditsModal.tsx            # Patient history with pagination & search
│   │   └── report/
│   │       ├── ReportCover.tsx              # Patient demographics & dysfunction score gauge
│   │       ├── ReportBreakdown.tsx          # 5-Pillar SVG radar chart & balance meter
│   │       ├── ReportDangerCards.tsx        # Safety screen & red flag alerts
│   │       ├── ReportHeader.tsx             # Medical header & printable export controls
│   │       ├── ReportPhysioScript.tsx       # Clinical diagnostic summary & doctor notes
│   │       ├── ReportRehabProtocol.tsx      # 3-Phase rehabilitation schedule
│   │       └── ReportWhatsAppCta.tsx        # WhatsApp shareable action trigger
│   └── lib/
│       ├── audit-storage.ts                 # Database persistence with local storage fallback
│       ├── physio-data.ts                   # Diagnostic tracks, clinical questions & protocol mapping
│       └── prisma.ts                        # Singleton Prisma client instance
├── .env.example                             # Environment variable template
├── package.json
└── tsconfig.json
```

---

## 🚀 Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org/) (App Router)
- **Language**: [TypeScript 5](https://www.typescriptlang.org/)
- **Database & ORM**: [Prisma 6](https://www.prisma.io/) + PostgreSQL (Supabase) with LocalStorage fallback
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/) (Teal, Emerald, Slate dark clinical palette)
- **Icons**: [Lucide React](https://lucide.dev/)

---

## 🛠️ Getting Started

### 1. Clone & Install Dependencies
```bash
git clone https://github.com/connecttws/Physio-Business-Audit.git
cd Physio-Business-Audit
npm install
```

### 2. Configure Environment Variables
Copy `.env.example` to `.env` and set your PostgreSQL connection string:
```bash
DATABASE_URL="postgresql://user:password@host:5432/dbname?schema=public"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

### 3. Initialize Prisma Database
```bash
npx prisma generate
npx prisma db push
```

### 4. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to begin a clinical patient assessment.

### 5. Build for Production
```bash
npm run build
npm start
```

---

## 📄 License

All rights reserved © KineticFix / TWS. Built for clinical physiotherapy diagnostics and patient rehabilitation tracking.
