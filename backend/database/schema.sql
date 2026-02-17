-- ================================================
-- Resume Analyzer Database Schema
-- PostgreSQL Database Setup Script
-- ================================================

-- Create database (run this separately as superuser)
-- CREATE DATABASE resume_analyzer;

-- Connect to the database
-- \c resume_analyzer;

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ================================================
-- USERS TABLE
-- ================================================
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    email_verified BOOLEAN DEFAULT FALSE,
    email_verification_token VARCHAR(255),
    email_verification_expires TIMESTAMP,
    password_reset_token VARCHAR(255),
    password_reset_expires TIMESTAMP,
    profile_picture VARCHAR(500),
    phone VARCHAR(20),
    location VARCHAR(200),
    linkedin_url VARCHAR(500),
    portfolio_url VARCHAR(500),
    preferences JSONB DEFAULT '{"emailNotifications": true, "jobAlerts": true, "weeklyDigest": false, "marketingEmails": false, "preferredLocations": [], "preferredJobTypes": [], "industriesOfInterest": []}'::jsonb,
    last_login_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP
);

-- Create index on email for faster lookups
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_deleted_at ON users(deleted_at);

-- ================================================
-- RESUMES TABLE
-- ================================================
CREATE TABLE IF NOT EXISTS resumes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    label VARCHAR(200) NOT NULL DEFAULT 'My Resume',
    file_name VARCHAR(255) NOT NULL,
    file_path VARCHAR(500) NOT NULL,
    extracted_text TEXT NOT NULL,
    parsed_sections JSONB DEFAULT '{"contact": {}, "experience": [], "education": [], "skills": [], "certifications": []}'::jsonb,
    file_size INTEGER NOT NULL,
    file_type VARCHAR(100) NOT NULL,
    is_default BOOLEAN DEFAULT FALSE,
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_resumes_user_id ON resumes(user_id);
CREATE INDEX IF NOT EXISTS idx_resumes_is_default ON resumes(is_default);

-- ================================================
-- JOB DESCRIPTIONS TABLE
-- ================================================
CREATE TABLE IF NOT EXISTS job_descriptions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    job_title VARCHAR(200) NOT NULL,
    company VARCHAR(200) NOT NULL,
    full_text TEXT NOT NULL,
    parsed_requirements JSONB DEFAULT '{"requiredSkills": [], "desiredSkills": [], "experienceLevel": "", "educationRequirements": [], "responsibilities": [], "keywords": []}'::jsonb,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create index for user lookups
CREATE INDEX IF NOT EXISTS idx_job_descriptions_user_id ON job_descriptions(user_id);

-- ================================================
-- ANALYSES TABLE
-- ================================================
CREATE TABLE IF NOT EXISTS analyses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    resume_id UUID NOT NULL REFERENCES resumes(id) ON DELETE CASCADE,
    job_description_id UUID NOT NULL REFERENCES job_descriptions(id) ON DELETE CASCADE,
    status VARCHAR(20) NOT NULL DEFAULT 'processing' CHECK (status IN ('processing', 'completed', 'failed')),
    overall_score INTEGER DEFAULT 0 CHECK (overall_score >= 0 AND overall_score <= 100),
    category_scores JSONB DEFAULT '{"technicalSkills": 0, "softSkills": 0, "experience": 0, "education": 0, "keywords": 0}'::jsonb,
    matched_elements JSONB DEFAULT '{"skills": [], "experience": [], "education": [], "keywords": []}'::jsonb,
    missing_elements JSONB DEFAULT '{"skills": [], "experience": [], "keywords": []}'::jsonb,
    keyword_suggestions JSONB DEFAULT '[]'::jsonb,
    ats_score INTEGER DEFAULT 0 CHECK (ats_score >= 0 AND ats_score <= 100),
    recommendations TEXT[] DEFAULT '{}',
    summary TEXT DEFAULT '',
    error_message TEXT,
    completed_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_analyses_user_id ON analyses(user_id);
CREATE INDEX IF NOT EXISTS idx_analyses_resume_id ON analyses(resume_id);
CREATE INDEX IF NOT EXISTS idx_analyses_job_description_id ON analyses(job_description_id);
CREATE INDEX IF NOT EXISTS idx_analyses_status ON analyses(status);

-- ================================================
-- JOBS TABLE
-- ================================================
CREATE TABLE IF NOT EXISTS jobs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    external_job_id VARCHAR(255) NOT NULL,
    source_platform VARCHAR(100) NOT NULL,
    job_title VARCHAR(200) NOT NULL,
    company VARCHAR(200) NOT NULL,
    location VARCHAR(200) NOT NULL,
    job_type VARCHAR(50) NOT NULL,
    experience_level VARCHAR(50) NOT NULL,
    description TEXT NOT NULL,
    posting_url VARCHAR(500) NOT NULL,
    posted_date TIMESTAMP NOT NULL,
    salary_range VARCHAR(100),
    company_logo VARCHAR(500),
    expiration_date TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT unique_external_job UNIQUE (external_job_id, source_platform)
);

-- Create indexes for job searches
CREATE INDEX IF NOT EXISTS idx_jobs_job_title ON jobs(job_title);
CREATE INDEX IF NOT EXISTS idx_jobs_company ON jobs(company);
CREATE INDEX IF NOT EXISTS idx_jobs_location ON jobs(location);
CREATE INDEX IF NOT EXISTS idx_jobs_posted_date ON jobs(posted_date DESC);

-- ================================================
-- SAVED JOBS TABLE
-- ================================================
CREATE TABLE IF NOT EXISTS saved_jobs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    job_id UUID NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
    application_status VARCHAR(20) NOT NULL DEFAULT 'saved' CHECK (application_status IN ('saved', 'applied', 'interested', 'not_interested')),
    notes TEXT,
    reminder_date TIMESTAMP,
    saved_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT unique_user_job UNIQUE (user_id, job_id)
);

-- Create indexes for saved jobs
CREATE INDEX IF NOT EXISTS idx_saved_jobs_user_id ON saved_jobs(user_id);
CREATE INDEX IF NOT EXISTS idx_saved_jobs_job_id ON saved_jobs(job_id);
CREATE INDEX IF NOT EXISTS idx_saved_jobs_application_status ON saved_jobs(application_status);

-- ================================================
-- TRIGGERS FOR UPDATED_AT TIMESTAMPS
-- ================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for all tables
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_resumes_updated_at BEFORE UPDATE ON resumes
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_job_descriptions_updated_at BEFORE UPDATE ON job_descriptions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_analyses_updated_at BEFORE UPDATE ON analyses
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_jobs_updated_at BEFORE UPDATE ON jobs
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_saved_jobs_updated_at BEFORE UPDATE ON saved_jobs
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ================================================
-- SAMPLE DATA (Optional - for testing)
-- ================================================

-- Uncomment to insert sample user
-- INSERT INTO users (full_name, email, password_hash, email_verified)
-- VALUES ('Test User', 'test@example.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyYIiIiIiIiI', true);

-- ================================================
-- VIEWS (Optional - for common queries)
-- ================================================

-- View for user statistics
CREATE OR REPLACE VIEW user_statistics AS
SELECT 
    u.id,
    u.full_name,
    u.email,
    COUNT(DISTINCT r.id) as total_resumes,
    COUNT(DISTINCT jd.id) as total_job_descriptions,
    COUNT(DISTINCT a.id) as total_analyses,
    COUNT(DISTINCT sj.id) as total_saved_jobs
FROM users u
LEFT JOIN resumes r ON u.id = r.user_id
LEFT JOIN job_descriptions jd ON u.id = jd.user_id
LEFT JOIN analyses a ON u.id = a.user_id
LEFT JOIN saved_jobs sj ON u.id = sj.user_id
GROUP BY u.id, u.full_name, u.email;

-- ================================================
-- GRANT PERMISSIONS (adjust as needed)
-- ================================================

-- Example: Grant permissions to application user
-- GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO resume_analyzer_user;
-- GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO resume_analyzer_user;

-- ================================================
-- DATABASE SETUP COMPLETE
-- ================================================
