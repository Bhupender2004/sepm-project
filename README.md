# 🤖 ResumeAI — AI-Powered Resume Analyzer & Job Matcher

**ResumeAI** is a full-stack web application that helps job seekers improve their resumes using artificial intelligence. Upload your resume, paste a job description, and get an instant AI-powered analysis with a match score, keyword suggestions, and actionable recommendations to land your dream job.

---

## ✨ Features

### 📄 Resume Analysis
- **Upload & Analyze** — Upload your resume (PDF or DOCX) and paste any job description. The AI compares them and returns:
  - **Overall Match Score** — How well your resume fits the job.
  - **ATS Compatibility Score** — How likely your resume is to pass Applicant Tracking Systems.
  - **Category Breakdown** — Scores for Technical Skills, Soft Skills, Experience, Education, and Keywords.
  - **Matched & Missing Elements** — See exactly which skills, experiences, and keywords you have vs. what's missing.
  - **Keyword Suggestions** — Get priority-ranked keywords to add, with example usage for each.
  - **Actionable Recommendations** — Specific tips to improve your resume.
- **View Example** — Try a pre-built demo analysis without uploading anything.

### 🔍 Job Search
- **Search Jobs** — Search for job listings from multiple platforms (powered by JSearch / RapidAPI).
- **Save Jobs** — Bookmark interesting jobs to your personal saved list for later.

### 📊 Dashboard
- **At-a-Glance Overview** — See your latest analysis score, saved jobs count, and quick stats.
- **Recent Activity** — Track your analysis history and saved jobs.

### 👤 User Accounts
- **Register & Login** — Create an account with email and password (JWT-based authentication).
- **Profile Management** — Update your personal details and change your password.
- **Guest Access** — Use the resume analyzer without creating an account.

---

## 🛠️ Tech Stack

### Frontend
| Technology | Purpose |
|---|---|
| **React 18** | UI library |
| **TypeScript** | Type safety |
| **Vite** | Build tool & dev server |
| **Chakra UI** | Component library & styling |
| **React Router** | Client-side routing |
| **Recharts** | Data visualization (score charts) |
| **Framer Motion** | Animations |
| **React Hook Form** | Form handling |

### Backend
| Technology | Purpose |
|---|---|
| **Node.js + Express** | REST API server |
| **TypeScript** | Type safety |
| **Sequelize ORM** | Database management |
| **SQLite** (dev) / **PostgreSQL** (prod) | Database |
| **OpenRouter AI** | AI-powered resume parsing & analysis |
| **JWT** | Authentication |
| **Multer** | File upload handling |
| **pdf-parse + Mammoth** | PDF & DOCX text extraction |
| **Winston** | Logging |
| **Helmet + CORS** | Security |

---

## 📁 Project Structure

```
spem-project/
├── src/                          # Frontend source code
│   ├── components/
│   │   ├── common/               # Shared UI components (Loading, etc.)
│   │   ├── features/             # Feature-specific components (FileUpload, etc.)
│   │   └── layout/               # Layout components (Navbar, Footer, etc.)
│   ├── pages/
│   │   ├── Analysis/             # Resume analysis & results pages
│   │   ├── Auth/                 # Login & Register pages
│   │   ├── Jobs/                 # Job search & saved jobs pages
│   │   ├── Dashboard.tsx         # User dashboard
│   │   ├── Landing.tsx           # Landing/home page
│   │   └── Profile.tsx           # User profile page
│   └── services/                 # API service functions
├── backend/                      # Backend source code
│   ├── src/
│   │   ├── config/               # Environment & database config
│   │   ├── controllers/          # Route handlers
│   │   ├── middleware/           # Auth, upload, error handling
│   │   ├── models/               # Sequelize database models
│   │   ├── routes/               # API route definitions
│   │   ├── services/             # Business logic (AI, document parsing, etc.)
│   │   └── utils/                # Logger, helpers
│   └── .env                      # Backend environment variables
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** v18 or higher
- **npm** v9 or higher
- An **OpenRouter API key** ([Get one free here](https://openrouter.ai/keys))
- *(Optional)* A **RapidAPI key** for job search ([JSearch API](https://rapidapi.com/letscrape-6bRBa3QGgNx/api/jsearch))

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/spem-project.git
cd spem-project
```

### 2. Setup the Backend

```bash
cd backend
npm install
```

Create a `.env` file in the `backend/` directory (or edit the existing one):

```env
NODE_ENV=development
PORT=5000

# Database (SQLite for local dev)
DATABASE_URL=sqlite:./database.sqlite

# JWT — change this to a random string!
JWT_SECRET=your-random-secret-key-here
JWT_EXPIRES_IN=1h
JWT_REFRESH_EXPIRES_IN=7d

# AI (Required — get a free key at https://openrouter.ai/keys)
OPENROUTER_API_KEY=sk-or-v1-your-key-here
OPENROUTER_MODEL=deepseek/deepseek-r1:free

# Job Search (Optional — get a free key at https://rapidapi.com)
RAPIDAPI_KEY=your-rapidapi-key-here

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:5173
```

Start the backend dev server:

```bash
npm run dev
```

The backend will start at **http://localhost:5000**.

### 3. Setup the Frontend

Open a new terminal:

```bash
cd spem-project
npm install
npm run dev
```

The frontend will start at **http://localhost:5173**.

### 4. Use the App

Open **http://localhost:5173** in your browser. You can:

1. **Try the analyzer** — Go to "Analyze", upload a resume, paste a job description, and click "Analyze Now".
2. **View a demo** — Click "View Example" to see a sample analysis without uploading anything.
3. **Search for jobs** — Go to "Jobs" to search for listings.
4. **Create an account** — Register to save jobs and track your history.

---

## 🔑 API Endpoints

### Public (No Auth Required)
| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/public/analyze` | Analyze a resume against a job description |

### Authentication
| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/auth/register` | Register a new user |
| `POST` | `/api/auth/login` | Login and get JWT token |

### Protected (Auth Required)
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/users/profile` | Get user profile |
| `PUT` | `/api/users/profile` | Update user profile |
| `GET` | `/api/saved-jobs` | Get saved jobs |
| `POST` | `/api/saved-jobs` | Save a job |
| `DELETE` | `/api/saved-jobs/:id` | Remove a saved job |
| `GET` | `/api/jobs/search` | Search for jobs |

---

## 🧪 Scripts

### Frontend

| Command | Description |
|---|---|
| `npm run dev` | Start Vite dev server |
| `npm run build` | Build for production |
| `npm run lint` | Run ESLint |
| `npm run preview` | Preview production build |

### Backend

| Command | Description |
|---|---|
| `npm run dev` | Start with hot-reload (nodemon) |
| `npm run build` | Compile TypeScript |
| `npm start` | Run compiled JS (production) |
| `npm test` | Run tests |
| `npm run lint` | Run ESLint |

---

## 📜 License

This project is licensed under the **MIT License**.
