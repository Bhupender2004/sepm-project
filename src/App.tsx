import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Landing from './pages/Landing';
import Dashboard from './pages/Dashboard';
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/common/ProtectedRoute';
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
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            <Route element={<ProtectedRoute />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/analyze" element={<ResumeAnalysis />} />
              <Route path="/results" element={<AnalysisResults />} />
              <Route path="/jobs" element={<JobSearch />} />
              <Route path="/saved-jobs" element={<SavedJobs />} />
              <Route path="/settings" element={<Settings />} />
            </Route>
          </Routes>
        </Layout>
      </Router>
    </AuthProvider>
  );
}

export default App;
