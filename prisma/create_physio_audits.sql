-- Create the physio_audit table inside the business_audit schema
CREATE SCHEMA IF NOT EXISTS business_audit;

CREATE TABLE IF NOT EXISTS business_audit.physio_audit (
    id VARCHAR(50) PRIMARY KEY,
    slug VARCHAR(150) UNIQUE,
    patient_name VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    whatsapp_number VARCHAR(50),
    age VARCHAR(20),
    occupation VARCHAR(255),
    auditor_name VARCHAR(150) DEFAULT 'Dr. KineticFix' NOT NULL,
    track_id VARCHAR(50) NOT NULL,
    track_badge VARCHAR(100) NOT NULL,
    red_flag VARCHAR(20) DEFAULT 'safe' NOT NULL,
    past_history VARCHAR(50) DEFAULT 'pills_heat' NOT NULL,
    total_score INTEGER NOT NULL,
    max_score INTEGER DEFAULT 100 NOT NULL,
    percentage INTEGER DEFAULT 0 NOT NULL,
    status_title VARCHAR(150) NOT NULL,
    status_level VARCHAR(50) NOT NULL,
    status_summary TEXT NOT NULL,
    consultation_script TEXT NOT NULL,
    pillars JSONB NOT NULL,
    answers JSONB NOT NULL,
    flags JSONB NOT NULL,
    rehab_protocol JSONB,
    view_count INTEGER DEFAULT 0 NOT NULL,
    last_viewed_at TIMESTAMPTZ,
    status VARCHAR(50) DEFAULT 'active' NOT NULL,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_physio_audits_patient_name ON business_audit.physio_audit (patient_name);
CREATE INDEX IF NOT EXISTS idx_physio_audits_whatsapp ON business_audit.physio_audit (whatsapp_number);
CREATE INDEX IF NOT EXISTS idx_physio_audits_track_id ON business_audit.physio_audit (track_id);
CREATE INDEX IF NOT EXISTS idx_physio_audits_total_score ON business_audit.physio_audit (total_score);
CREATE INDEX IF NOT EXISTS idx_physio_audits_created_at ON business_audit.physio_audit (created_at DESC);
