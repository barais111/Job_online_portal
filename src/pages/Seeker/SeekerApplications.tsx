import { motion } from 'framer-motion';
import { useThemeStore, useAuthStore } from '../../store/useStore';
import { getApplicationsBySeeker } from '../../utils/storage';
import { Link } from 'react-router-dom';
import {
  HiOutlineBriefcase,
  HiOutlineClock,
  HiOutlineOfficeBuilding,
  HiOutlineExternalLink,
} from 'react-icons/hi';

export default function SeekerApplications() {
  const { isDark } = useThemeStore();
  const { user } = useAuthStore();

  if (!user) return null;

  const applications = getApplicationsBySeeker(user.id).sort(
    (a, b) => new Date(b.appliedAt).getTime() - new Date(a.appliedAt).getTime()
  );

  const getStatusColor = (status: string) => {
    if (isDark) {
      switch (status) {
        case 'pending': return { bg: 'bg-yellow-500/15', text: 'text-yellow-400', border: 'border-yellow-500/20' };
        case 'reviewed': return { bg: 'bg-blue-500/15', text: 'text-blue-400', border: 'border-blue-500/20' };
        case 'shortlisted': return { bg: 'bg-emerald-500/15', text: 'text-emerald-400', border: 'border-emerald-500/20' };
        case 'rejected': return { bg: 'bg-red-500/15', text: 'text-red-400', border: 'border-red-500/20' };
        case 'hired': return { bg: 'bg-indigo-500/15', text: 'text-indigo-400', border: 'border-indigo-500/20' };
        default: return { bg: 'bg-gray-500/15', text: 'text-gray-400', border: 'border-gray-500/20' };
      }
    }
    switch (status) {
      case 'pending': return { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200' };
      case 'reviewed': return { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200' };
      case 'shortlisted': return { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200' };
      case 'rejected': return { bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200' };
      case 'hired': return { bg: 'bg-indigo-50', text: 'text-indigo-700', border: 'border-indigo-200' };
      default: return { bg: 'bg-gray-50', text: 'text-gray-700', border: 'border-gray-200' };
    }
  };

  const statusCounts = {
    all: applications.length,
    pending: applications.filter(a => a.status === 'pending').length,
    shortlisted: applications.filter(a => a.status === 'shortlisted').length,
    rejected: applications.filter(a => a.status === 'rejected').length,
    hired: applications.filter(a => a.status === 'hired').length,
  };

  return (
    <div className={`min-h-screen ${isDark ? 'bg-slate-950 text-white' : 'bg-gray-50 text-gray-900'}`}>
      <div style={{ maxWidth: '64rem', margin: '0 auto', padding: '2.5rem 2rem' }}>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ marginBottom: '2rem' }}
        >
          <h1 className="text-3xl font-bold" style={{ marginBottom: '0.5rem' }}>
            My <span className="gradient-text">Applications</span>
          </h1>
          <p className={isDark ? 'text-gray-400' : 'text-gray-600'} style={{ fontSize: '1rem' }}>
            Track your job applications
          </p>
        </motion.div>

        {/* Status Summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(5, 1fr)',
            gap: '1rem',
            marginBottom: '2rem',
          }}
        >
          {Object.entries(statusCounts).map(([status, count]) => (
            <div
              key={status}
              className={isDark ? 'bg-white/[0.04] border border-white/[0.08]' : 'bg-white border border-gray-200 shadow-sm'}
              style={{
                textAlign: 'center',
                padding: '1.25rem 1rem',
                borderRadius: '0.875rem',
              }}
            >
              <p style={{ fontSize: '1.75rem', fontWeight: 700, lineHeight: 1 }}>{count}</p>
              <p
                className={isDark ? 'text-gray-400' : 'text-gray-500'}
                style={{ fontSize: '0.8rem', textTransform: 'capitalize', marginTop: '0.5rem' }}
              >
                {status}
              </p>
            </div>
          ))}
        </motion.div>

        {/* Applications List */}
        {applications.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{ textAlign: 'center', padding: '5rem 0' }}
          >
            <HiOutlineBriefcase
              className={isDark ? 'text-gray-600' : 'text-gray-300'}
              style={{ fontSize: '3.5rem', margin: '0 auto 1rem' }}
            />
            <h3 style={{ fontSize: '1.25rem', fontWeight: 600 }}>No applications yet</h3>
            <p className={isDark ? 'text-gray-500' : 'text-gray-400'} style={{ marginTop: '0.5rem' }}>
              Start applying for jobs!
            </p>
            <Link
              to="/jobs"
              className="btn-gradient"
              style={{
                marginTop: '1.25rem',
                display: 'inline-block',
                padding: '0.625rem 1.5rem',
                borderRadius: '0.75rem',
                fontSize: '0.875rem',
                textDecoration: 'none',
                color: 'white',
              }}
            >
              Browse Jobs
            </Link>
          </motion.div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {applications.map((app, i) => {
              const colors = getStatusColor(app.status);
              return (
                <motion.div
                  key={app.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className={isDark ? 'bg-white/[0.04] border border-white/[0.08]' : 'bg-white border border-gray-200 shadow-sm'}
                  style={{ padding: '1.5rem 1.75rem', borderRadius: '1rem' }}
                >
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem', flex: 1 }}>
                      {/* Company Icon */}
                      <div
                        className={isDark ? 'bg-indigo-500/10' : 'bg-indigo-50'}
                        style={{
                          width: '3rem',
                          height: '3rem',
                          borderRadius: '0.75rem',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0,
                        }}
                      >
                        <HiOutlineOfficeBuilding className={isDark ? 'text-indigo-400' : 'text-indigo-600'} style={{ fontSize: '1.25rem' }} />
                      </div>

                      {/* Job Info */}
                      <div>
                        <h3 style={{ fontWeight: 600, fontSize: '1rem', marginBottom: '0.25rem' }}>{app.jobTitle}</h3>
                        <p className={isDark ? 'text-gray-400' : 'text-gray-500'} style={{ fontSize: '0.875rem' }}>
                          {app.companyName}
                        </p>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginTop: '0.625rem' }}>
                          <span
                            className={isDark ? 'text-gray-500' : 'text-gray-400'}
                            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.8rem' }}
                          >
                            <HiOutlineClock />
                            {new Date(app.appliedAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Status & Link */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexShrink: 0 }}>
                      <span
                        className={`${colors.bg} ${colors.text} ${colors.border}`}
                        style={{
                          padding: '0.375rem 1rem',
                          borderRadius: '9999px',
                          fontSize: '0.75rem',
                          fontWeight: 500,
                          border: '1px solid',
                        }}
                      >
                        {app.status}
                      </span>
                      <Link
                        to={`/jobs/${app.jobId}`}
                        className={isDark ? 'hover:bg-white/5' : 'hover:bg-gray-50'}
                        style={{
                          padding: '0.5rem',
                          borderRadius: '0.5rem',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <HiOutlineExternalLink className={isDark ? 'text-gray-400' : 'text-gray-500'} />
                      </Link>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}

      </div>
    </div>
  );
}
