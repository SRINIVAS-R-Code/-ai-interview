import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

import Login from './pages/Login';
import Register from './pages/Register';
import Landing from './pages/Landing';
import Dashboard from './pages/Dashboard';
import MockTest from './pages/MockTest';
import MockTestResult from './pages/MockTestResult';
import CodingChallenge from './pages/CodingChallenge';
import AptitudeTest from './pages/AptitudeTest';
import ResumeUpload from './pages/ResumeUpload';
import InterviewSchedule from './pages/InterviewSchedule';
import AIFeedback from './pages/AIFeedback';
import Analytics from './pages/Analytics';
import Leaderboard from './pages/Leaderboard';
import AIInterviewSimulator from './pages/AIInterviewSimulator';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: '#1E293B',
              color: '#F1F5F9',
              border: '1px solid rgba(6,182,212,0.3)',
              borderRadius: '10px',
              fontFamily: 'Inter, sans-serif',
              fontSize: '0.875rem',
            },
            success: { iconTheme: { primary: '#10B981', secondary: '#F1F5F9' } },
            error: { iconTheme: { primary: '#EF4444', secondary: '#F1F5F9' } },
          }}
        />
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/tests" element={<MockTest />} />
            <Route path="/tests/result/:id" element={<MockTestResult />} />
            <Route path="/coding" element={<CodingChallenge />} />
            <Route path="/aptitude" element={<AptitudeTest />} />
            <Route path="/resume" element={<ResumeUpload />} />
            <Route path="/schedule" element={<InterviewSchedule />} />
            <Route path="/ai-interview" element={<AIInterviewSimulator />} />
            <Route path="/feedback" element={<AIFeedback />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/leaderboard" element={<Leaderboard />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
