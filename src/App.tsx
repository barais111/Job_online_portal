import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useEffect } from 'react';
import { useAuthStore, useThemeStore } from './store/useStore';

// Layout
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';

// Pages
import HomePage from './pages/Home/HomePage';
import LoginPage from './pages/Auth/LoginPage';
import SignupPage from './pages/Auth/SignupPage';
import JobsListPage from './pages/Jobs/JobsListPage';
import JobDetailPage from './pages/Jobs/JobDetailPage';

// Seeker
import SeekerDashboard from './pages/Seeker/SeekerDashboard';
import SeekerProfile from './pages/Seeker/SeekerProfile';
import SeekerApplications from './pages/Seeker/SeekerApplications';
import SeekerSavedJobs from './pages/Seeker/SeekerSavedJobs';

// Employer
import EmployerDashboard from './pages/Employer/EmployerDashboard';
import PostJob from './pages/Employer/PostJob';
import EmployerApplicants from './pages/Employer/EmployerApplicants';
import EmployerProfile from './pages/Employer/EmployerProfile';

// Admin
import AdminDashboard from './pages/Admin/AdminDashboard';
import AdminUsers from './pages/Admin/AdminUsers';
import AdminJobs from './pages/Admin/AdminJobs';

function ProtectedRoute({
  children,
  allowedRoles,
}: {
  children: React.ReactNode;
  allowedRoles: string[];
}) {
  const { user, isAuthenticated } = useAuthStore();

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}

export default function App() {
  const { isDark } = useThemeStore();

  // Apply dark mode class to html
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  return (
    <BrowserRouter>
      <div className={`min-h-screen flex flex-col ${isDark ? 'bg-slate-950 text-white' : 'bg-gray-50 text-gray-900'}`}>
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: {
              background: isDark ? '#1e1b4b' : '#fff',
              color: isDark ? '#e2e8f0' : '#1e293b',
              borderRadius: '12px',
              border: isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid #e2e8f0',
              boxShadow: '0 10px 40px rgba(0,0,0,0.2)',
            },
            success: {
              iconTheme: {
                primary: '#10b981',
                secondary: '#fff',
              },
            },
            error: {
              iconTheme: {
                primary: '#ef4444',
                secondary: '#fff',
              },
            },
          }}
        />

        <Navbar />

        <main className="flex-1">
          <Routes>
            {/* Public */}
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/jobs" element={<JobsListPage />} />
            <Route path="/jobs/:id" element={<JobDetailPage />} />

            {/* Seeker */}
            <Route path="/seeker/dashboard" element={
              <ProtectedRoute allowedRoles={['seeker']}><SeekerDashboard /></ProtectedRoute>
            } />
            <Route path="/seeker/profile" element={
              <ProtectedRoute allowedRoles={['seeker']}><SeekerProfile /></ProtectedRoute>
            } />
            <Route path="/seeker/applications" element={
              <ProtectedRoute allowedRoles={['seeker']}><SeekerApplications /></ProtectedRoute>
            } />
            <Route path="/seeker/saved" element={
              <ProtectedRoute allowedRoles={['seeker']}><SeekerSavedJobs /></ProtectedRoute>
            } />

            {/* Employer */}
            <Route path="/employer/dashboard" element={
              <ProtectedRoute allowedRoles={['employer']}><EmployerDashboard /></ProtectedRoute>
            } />
            <Route path="/employer/post-job" element={
              <ProtectedRoute allowedRoles={['employer']}><PostJob /></ProtectedRoute>
            } />
            <Route path="/employer/applicants" element={
              <ProtectedRoute allowedRoles={['employer']}><EmployerApplicants /></ProtectedRoute>
            } />
            <Route path="/employer/profile" element={
              <ProtectedRoute allowedRoles={['employer']}><EmployerProfile /></ProtectedRoute>
            } />

            {/* Admin */}
            <Route path="/admin" element={
              <ProtectedRoute allowedRoles={['admin']}><AdminDashboard /></ProtectedRoute>
            } />
            <Route path="/admin/users" element={
              <ProtectedRoute allowedRoles={['admin']}><AdminUsers /></ProtectedRoute>
            } />
            <Route path="/admin/jobs" element={
              <ProtectedRoute allowedRoles={['admin']}><AdminJobs /></ProtectedRoute>
            } />

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>

        <Footer />
      </div>
    </BrowserRouter>
  );
}
