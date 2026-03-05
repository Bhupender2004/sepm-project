import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Dashboard from './pages/Dashboard';
import { AuthProvider } from './context/AuthContext';
import ResumeAnalysis from './pages/Analysis/ResumeAnalysis';
import AnalysisResults from './pages/Analysis/AnalysisResults';
import JobSearch from './pages/Jobs/JobSearch';
import SavedJobs from './pages/Jobs/SavedJobs';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Layout>
          <Routes>
            {/* Core analysis flow */}
            <Route path="/" element={<ResumeAnalysis />} />
            <Route path="/results" element={<AnalysisResults />} />

            {/* Auth redirects — no login/register pages as per user requirement */}
            <Route path="/login" element={<Navigate to="/" replace />} />
            <Route path="/register" element={<Navigate to="/" replace />} />

            {/* Dashboard */}
            <Route path="/dashboard" element={<Dashboard />} />

            {/* Jobs */}
            <Route path="/jobs" element={<JobSearch />} />
            <Route path="/saved-jobs" element={<SavedJobs />} />

            {/* Profile — removed, redirect to home */}
            <Route path="/profile" element={<Navigate to="/" replace />} />
          </Routes>
        </Layout>
      </Router>
    </AuthProvider>
  );
}

export default App;
