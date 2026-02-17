# 🚀 Quick Start - Database Setup

Choose the method that works best for you:

## Method 1: Docker (Recommended) ⭐

**Prerequisites:** Docker Desktop installed

```bash
# Navigate to backend directory
cd backend

# Start PostgreSQL, Redis, and pgAdmin
docker-compose up -d

# Wait a few seconds for containers to start
# Database will be automatically created with the schema!
```

**Access:**
- PostgreSQL: `localhost:5432`
- Redis: `localhost:6379`
- pgAdmin: `http://localhost:5050`
  - Email: `admin@resumeanalyzer.com`
  - Password: `admin123`

**Environment Variables:**
```env
DATABASE_URL=postgresql://postgres:postgres123@localhost:5432/resume_analyzer
DB_HOST=localhost
DB_PORT=5432
DB_NAME=resume_analyzer
DB_USER=postgres
DB_PASSWORD=postgres123
```

---

## Method 2: Automated Script

**Windows:**
```cmd
cd backend\database
setup.bat
```

**Linux/Mac:**
```bash
cd backend/database
chmod +x setup.sh
./setup.sh
```

The script will guide you through the setup process.

---

## Method 3: Manual Setup

**Step 1: Create Database**
```bash
# Connect to PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE resume_analyzer;

# Exit
\q
```

**Step 2: Run Schema**
```bash
# Apply schema
psql -U postgres -d resume_analyzer -f backend/database/schema.sql
```

**Step 3: Update .env**
```env
DATABASE_URL=postgresql://postgres:YOUR_PASSWORD@localhost:5432/resume_analyzer
DB_NAME=resume_analyzer
DB_USER=postgres
DB_PASSWORD=YOUR_PASSWORD
```

---

## Verify Setup

**Check if database is running:**
```bash
# Using psql
psql -U postgres -d resume_analyzer -c "\dt"

# Or using Docker
docker-compose exec postgres psql -U postgres -d resume_analyzer -c "\dt"
```

You should see 6 tables:
- users
- resumes
- job_descriptions
- analyses
- jobs
- saved_jobs

---

## Start the Application

```bash
# Navigate to backend directory
cd backend

# Install dependencies (if not already done)
npm install

# Start the server
npm run dev
```

The backend will automatically connect to the database and sync the schema.

---

## Troubleshooting

**Port already in use:**
```bash
# Change ports in docker-compose.yml or .env file
DB_PORT=5433  # Use different port
```

**Connection refused:**
```bash
# Check if PostgreSQL is running
docker-compose ps
# or
sudo systemctl status postgresql
```

**Permission denied:**
```bash
# Grant permissions
psql -U postgres -d resume_analyzer
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO postgres;
```

---

## Next Steps

1. ✅ Database is set up
2. ✅ Environment variables configured
3. 🚀 Start backend: `npm run dev`
4. 🎨 Start frontend: `cd ../frontend && npm run dev`

Your Resume Analyzer is ready to use! 🎉
