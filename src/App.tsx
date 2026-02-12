import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Landing from './pages/Landing';
import Dashboard from './pages/Dashboard';
import { AuthProvider } from './context/AuthContext';

import ResumeAnalysis from './pages/Analysis/ResumeAnalysis';
import AnalysisResults from './pages/Analysis/AnalysisResults';
import JobSearch from './pages/Jobs/JobSearch';
import SavedJobs from './pages/Jobs/SavedJobs';
import Settings from './pages/Settings';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Navigate to="/dashboard" replace />} />
            <Route path="/register" element={<Navigate to="/dashboard" replace />} />

            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/analyze" element={<ResumeAnalysis />} />
            <Route path="/results" element={<AnalysisResults />} />
            <Route path="/jobs" element={<JobSearch />} />
            <Route path="/saved-jobs" element={<SavedJobs />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </Layout>
      </Router>
    </AuthProvider>
  );
}

export default App;
