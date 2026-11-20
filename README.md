# KineticFix · Clinical Physiotherapy & Biomechanical Audit

A high-performance clinical intake, musculoskeletal diagnostic screening, and 3-phase rehabilitation protocol generator built with Next.js 16, TypeScript, Tailwind CSS, and Lucide Icons.

## Clinical Features

- **7 Pain & Injury Tracks**:
  - `lumbar`: Lower Back & Sciatica (6 clinical diagnostic checks)
  - `cervical`: Neck, Upper Back & Tech-Neck (6 checks)
  - `knee`: Knee Joint & Patellofemoral Dysfunction (6 checks)
  - `shoulder`: Shoulder Impingement & Rotator Cuff Screen (6 checks)
  - `ankle`: Ankle Joint, Heel Pain & Plantar Fascia (6 checks)
  - `elbow`: Elbow, Wrist & Repetitive Strain (RSI / Carpal Tunnel) (6 checks)
  - `postop`: Post-Surgical, Post-Fracture & Trauma Rehab (6 checks)
- **Universal Safety & Red Flag Screen**:
  - Neurological red flag screen (Saddle anesthesia, motor loss alerts)
  - Past treatment history analysis (pills/heat vs short machine therapy vs first assessment)
- **Dynamic Scoring & Radar Visualizer**:
  - Instant 0–100 Kinetic Dysfunction Score calculation
  - 5-Pillar Kinetic Chain Balance SVG visualization comparing Patient Baseline vs 95% Optimal Functional Target
  - Automatic detection of Core Mechanical Breakdowns
- **Prescribed 3-Phase Clinical Rehabilitation Protocol**:
  - Phase 1: Sessions 1–4 (Decompression & Pain Modulation)
  - Phase 2: Sessions 5–8 (Motor Control & Stabilizer Activation)
  - Phase 3: Sessions 9–12+ (Load Tolerance & Recurrence Prevention)
- **Direct WhatsApp Integration**:
  - Instant dispatch to patient's WhatsApp with full interactive report link
  - One-click patient booking with Clinic Direct Line (**+91 8368052044**)
- **History Modal with Pagination**:
  - Real-time search by patient name, track, or occupation
  - Paginated by 5 records with "View More (+5 Records)" button
- **Zero-Database URL Sharing**:
  - Encoded `?d=...` payload enables instantaneous cross-device sharing on any phone without requiring a remote database

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS (Medical Teal, Emerald, Slate dark theme)
- **Icons**: Lucide React
- **ORM / Database**: Prisma 6 + PostgreSQL (Supabase) with seamless LocalStorage fallback

## Getting Started

```bash
# Run local development server
npm run dev

# Run production build
npm run build
```
