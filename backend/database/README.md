# Resume Analyzer Database Setup

This directory contains the database schema and setup instructions for the Resume Analyzer application.

## Prerequisites

- PostgreSQL 12 or higher installed
- PostgreSQL command-line tools (psql)
- Appropriate database user permissions

## Quick Setup

### Option 1: Using psql Command Line

1. **Create the database:**
   ```bash
   # Connect to PostgreSQL as superuser
   psql -U postgres
   
   # Create the database
   CREATE DATABASE resume_analyzer;
   
   # Exit psql
   \q
   ```

2. **Run the schema script:**
   ```bash
   # Execute the schema file
   psql -U postgres -d resume_analyzer -f database/schema.sql
   ```

### Option 2: Using pgAdmin

1. Open pgAdmin and connect to your PostgreSQL server
2. Right-click on "Databases" and select "Create" → "Database"
3. Name it `resume_analyzer` and click "Save"
4. Right-click on the new database and select "Query Tool"
5. Open the `schema.sql` file and execute it

### Option 3: Using Docker (Recommended for Development)

1. **Create a docker-compose.yml file** (if not already present):
   ```yaml
   version: '3.8'
   services:
     postgres:
       image: postgres:15-alpine
       container_name: resume_analyzer_db
       environment:
         POSTGRES_DB: resume_analyzer
         POSTGRES_USER: postgres
         POSTGRES_PASSWORD: your_password_here
       ports:
         - "5432:5432"
       volumes:
         - postgres_data:/var/lib/postgresql/data
         - ./database/schema.sql:/docker-entrypoint-initdb.d/schema.sql
   
   volumes:
     postgres_data:
   ```

2. **Start the database:**
   ```bash
   docker-compose up -d
   ```

## Database Configuration

After creating the database, update your `.env` file with the correct credentials:

```env
DATABASE_URL=postgresql://postgres:your_password@localhost:5432/resume_analyzer
DB_HOST=localhost
DB_PORT=5432
DB_NAME=resume_analyzer
DB_USER=postgres
DB_PASSWORD=your_password_here
```

## Database Schema Overview

The database consists of 6 main tables:

### 1. **users**
Stores user account information including authentication details and preferences.

**Key Fields:**
- `id` (UUID) - Primary key
- `email` (VARCHAR) - Unique user email
- `password_hash` (VARCHAR) - Hashed password
- `preferences` (JSONB) - User preferences and settings

### 2. **resumes**
Stores uploaded resume files and their parsed content.

**Key Fields:**
- `id` (UUID) - Primary key
- `user_id` (UUID) - Foreign key to users
- `file_path` (VARCHAR) - Path to uploaded file
- `extracted_text` (TEXT) - Extracted resume text
- `parsed_sections` (JSONB) - Structured resume data

### 3. **job_descriptions**
Stores job descriptions for matching against resumes.

**Key Fields:**
- `id` (UUID) - Primary key
- `user_id` (UUID) - Foreign key to users
- `job_title` (VARCHAR) - Job title
- `full_text` (TEXT) - Complete job description
- `parsed_requirements` (JSONB) - Extracted requirements

### 4. **analyses**
Stores resume-job matching analysis results.

**Key Fields:**
- `id` (UUID) - Primary key
- `resume_id` (UUID) - Foreign key to resumes
- `job_description_id` (UUID) - Foreign key to job_descriptions
- `overall_score` (INTEGER) - Match score (0-100)
- `recommendations` (TEXT[]) - AI-generated recommendations

### 5. **jobs**
Stores job postings from external platforms.

**Key Fields:**
- `id` (UUID) - Primary key
- `external_job_id` (VARCHAR) - External platform job ID
- `source_platform` (VARCHAR) - Source platform name
- `job_title` (VARCHAR) - Job title
- `posting_url` (VARCHAR) - Link to original posting

### 6. **saved_jobs**
Tracks jobs saved by users.

**Key Fields:**
- `id` (UUID) - Primary key
- `user_id` (UUID) - Foreign key to users
- `job_id` (UUID) - Foreign key to jobs
- `application_status` (ENUM) - Status: saved, applied, interested, not_interested

## Automatic Features

The schema includes several automatic features:

1. **UUID Generation**: All primary keys use UUID v4 for better security
2. **Timestamps**: Automatic `created_at` and `updated_at` tracking
3. **Triggers**: Auto-update `updated_at` on record modification
4. **Indexes**: Optimized indexes for common queries
5. **Constraints**: Data validation and referential integrity
6. **Cascading Deletes**: Automatic cleanup of related records

## Sequelize Auto-Sync

The application uses Sequelize ORM which can automatically sync the schema in development mode. However, for production, it's recommended to use the SQL schema file.

**Development Mode:**
```javascript
// In src/config/database.ts
if (config.nodeEnv === 'development') {
    await sequelize.sync({ alter: true });
}
```

This will automatically create/update tables based on your models.

## Verification

After setup, verify the database is working:

```bash
# Connect to the database
psql -U postgres -d resume_analyzer

# List all tables
\dt

# Check a specific table
\d users

# Exit
\q
```

You should see all 6 tables listed.

## Troubleshooting

### Connection Issues

If you can't connect to the database:

1. Check PostgreSQL is running:
   ```bash
   # Windows
   Get-Service postgresql*
   
   # Linux/Mac
   sudo systemctl status postgresql
   ```

2. Verify connection settings in `.env`
3. Check firewall settings (port 5432)
4. Ensure PostgreSQL accepts connections from localhost

### Permission Issues

If you get permission errors:

```sql
-- Grant all privileges to your user
GRANT ALL PRIVILEGES ON DATABASE resume_analyzer TO your_username;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO your_username;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO your_username;
```

### Schema Already Exists

If tables already exist and you want to recreate them:

```sql
-- Drop all tables (WARNING: This deletes all data!)
DROP SCHEMA public CASCADE;
CREATE SCHEMA public;
GRANT ALL ON SCHEMA public TO postgres;
GRANT ALL ON SCHEMA public TO public;

-- Then run the schema.sql file again
```

## Backup and Restore

### Backup
```bash
pg_dump -U postgres -d resume_analyzer > backup.sql
```

### Restore
```bash
psql -U postgres -d resume_analyzer < backup.sql
```

## Next Steps

1. ✅ Create the database using one of the methods above
2. ✅ Update your `.env` file with database credentials
3. ✅ Start your backend server: `npm run dev`
4. ✅ The application will connect and verify the database

## Support

For issues or questions:
- Check the main project README
- Review PostgreSQL documentation: https://www.postgresql.org/docs/
- Review Sequelize documentation: https://sequelize.org/
