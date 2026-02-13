import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/layout/Layout';
// import Landing from './pages/Landing'; // Removed as ResumeAnalysis is now default
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
            <Route path="/" element={<ResumeAnalysis />} />
            <Route path="/login" element={<Navigate to="/" replace />} />
            <Route path="/register" element={<Navigate to="/" replace />} />

            <Route path="/dashboard" element={<Dashboard />} />
            {/* <Route path="/analyze" element={<ResumeAnalysis />} />  Removed as it is now root */}
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
