import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useThemeStore, useAuthStore } from '../../store/useStore';
import { getApplicationsBySeeker, getSavedJobsBySeeker, getActiveJobs } from '../../utils/storage';
import AnimatedCounter from '../../components/ui/AnimatedCounter';
import {
  HiOutlineBriefcase,
  HiOutlineDocumentText,
  HiOutlineHeart,
  HiOutlineCheckCircle,
  HiOutlineClock,
  HiOutlineChartBar,
  HiOutlineArrowRight,
} from 'react-icons/hi';

export default function SeekerDashboard() {
  const { isDark } = useThemeStore();
  const { user } = useAuthStore();

  if (!user) return null;

  const applications = getApplicationsBySeeker(user.id);
  const savedJobs = getSavedJobsBySeeker(user.id);
  const totalJobs = getActiveJobs().length;

  const stats = [
    { label: 'Total Applications', value: applications.length, icon: HiOutlineDocumentText, color: 'from-indigo-500 to-purple-500' },
    { label: 'Shortlisted', value: applications.filter(a => a.status === 'shortlisted').length, icon: HiOutlineCheckCircle, color: 'from-emerald-500 to-teal-500' },
    { label: 'Saved Jobs', value: savedJobs.length, icon: HiOutlineHeart, color: 'from-pink-500 to-rose-500' },
    { label: 'Available Jobs', value: totalJobs, icon: HiOutlineBriefcase, color: 'from-cyan-500 to-blue-500' },
  ];

  const getStatusColor = (status: string) => {
    if (isDark) {
      switch (status) {
        case 'pending': return 'bg-yellow-500/15 text-yellow-400';
        case 'reviewed': return 'bg-blue-500/15 text-blue-400';
        case 'shortlisted': return 'bg-emerald-500/15 text-emerald-400';
        case 'rejected': return 'bg-red-500/15 text-red-400';
        case 'hired': return 'bg-indigo-500/15 text-indigo-400';
        default: return 'bg-gray-500/15 text-gray-400';
      }
    }
    switch (status) {
      case 'pending': return 'bg-amber-50 text-amber-700 border border-amber-200';
      case 'reviewed': return 'bg-blue-50 text-blue-700 border border-blue-200';
      case 'shortlisted': return 'bg-emerald-50 text-emerald-700 border border-emerald-200';
      case 'rejected': return 'bg-red-50 text-red-700 border border-red-200';
      case 'hired': return 'bg-indigo-50 text-indigo-700 border border-indigo-200';
      default: return 'bg-gray-50 text-gray-700 border border-gray-200';
    }
  };

  return (
    <div className={`min-h-screen ${isDark ? 'bg-slate-950 text-white' : 'bg-gray-50 text-gray-900'}`}>
      <div style={{ maxWidth: '76rem', margin: '0 auto', padding: '2.5rem 2rem' }}>

        {/* Welcome */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ marginBottom: '2.5rem' }}
        >
          <h1 className="text-3xl font-bold" style={{ marginBottom: '0.5rem' }}>
            Welcome back, <span className="gradient-text">{user.name?.split(' ')[0]}</span> 👋
          </h1>
          <p className={isDark ? 'text-gray-400' : 'text-gray-600'} style={{ fontSize: '1rem' }}>
            Here's what's happening with your job search
          </p>
        </motion.div>

        {/* Stats Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '1.5rem',
          marginBottom: '2.5rem',
        }}>
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className={isDark
                ? 'bg-white/[0.04] border border-white/[0.08]'
                : 'bg-white border border-gray-200 shadow-sm'
              }
              style={{
                position: 'relative',
                overflow: 'hidden',
                padding: '1.5rem',
                borderRadius: '1rem',
              }}
            >
              <div className={`absolute top-0 right-0 w-24 h-24 rounded-full bg-gradient-to-br ${stat.color} opacity-10 blur-xl -translate-y-4 translate-x-4`} />
              <div
                className={`bg-gradient-to-br ${stat.color}`}
                style={{
                  width: '3rem',
                  height: '3rem',
                  borderRadius: '0.75rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '1rem',
                }}
              >
                <stat.icon className="text-xl text-white" />
              </div>
              <AnimatedCounter end={stat.value} className="text-3xl font-bold" />
              <p className={isDark ? 'text-gray-400' : 'text-gray-500'} style={{ fontSize: '0.875rem', marginTop: '0.5rem' }}>{stat.label}</p>
            </motion.div>
          ))}
        </div>

        {/* Main Content: Recent Applications + Quick Actions */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '2rem',
        }}>
          {/* Recent Applications */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className={isDark ? 'bg-white/[0.04] border border-white/[0.08]' : 'bg-white border border-gray-200 shadow-sm'}
            style={{ padding: '1.75rem', borderRadius: '1rem' }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
              <h2 className="text-lg font-bold" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <HiOutlineChartBar className="text-indigo-400" />
                Recent Applications
              </h2>
              <Link to="/seeker/applications" className="text-sm text-indigo-400 hover:text-indigo-300" style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                View all <HiOutlineArrowRight />
              </Link>
            </div>

            {applications.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '2.5rem 0' }}>
                <HiOutlineDocumentText className={`text-4xl mx-auto ${isDark ? 'text-gray-600' : 'text-gray-300'}`} style={{ marginBottom: '0.75rem' }} />
                <p className={`text-sm ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>No applications yet</p>
                <Link to="/jobs" className="text-sm text-indigo-400 hover:text-indigo-300" style={{ marginTop: '0.75rem', display: 'inline-block' }}>
                  Browse Jobs →
                </Link>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {applications.slice(0, 5).map((app) => (
                  <div
                    key={app.id}
                    className={isDark ? 'bg-white/[0.03] border border-white/[0.05]' : 'bg-gray-50 border border-gray-100'}
                    style={{
                      padding: '1rem 1.25rem',
                      borderRadius: '0.75rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}
                  >
                    <div>
                      <h4 className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`} style={{ fontSize: '0.9rem', marginBottom: '0.25rem' }}>{app.jobTitle}</h4>
                      <p className={isDark ? 'text-gray-400' : 'text-gray-500'} style={{ fontSize: '0.8rem' }}>{app.companyName}</p>
                    </div>
                    <span className={`${getStatusColor(app.status)}`} style={{ padding: '0.25rem 0.75rem', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: 500 }}>
                      {app.status}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </motion.div>

          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className={isDark ? 'bg-white/[0.04] border border-white/[0.08]' : 'bg-white border border-gray-200 shadow-sm'}
            style={{ padding: '1.75rem', borderRadius: '1rem' }}
          >
            <h2 className="text-lg font-bold" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
              <HiOutlineClock className="text-cyan-400" />
              Quick Actions
            </h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {[
                { to: '/jobs', label: 'Browse Jobs', desc: 'Find your next opportunity', icon: HiOutlineBriefcase, color: 'from-indigo-500 to-purple-500' },
                { to: '/seeker/applications', label: 'My Applications', desc: 'Track your application status', icon: HiOutlineDocumentText, color: 'from-emerald-500 to-teal-500' },
                { to: '/seeker/saved', label: 'Saved Jobs', desc: 'View your saved jobs', icon: HiOutlineHeart, color: 'from-pink-500 to-rose-500' },
                { to: '/seeker/profile', label: 'Update Profile', desc: 'Keep your profile up to date', icon: HiOutlineCheckCircle, color: 'from-cyan-500 to-blue-500' },
              ].map((action) => (
                <motion.div
                  key={action.to}
                  whileHover={{ x: 4 }}
                  transition={{ type: 'spring', stiffness: 300 }}
                >
                  <Link
                    to={action.to}
                    className={isDark
                      ? 'hover:bg-white/[0.06]'
                      : 'hover:bg-gray-50'
                    }
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '1rem',
                      padding: '1rem 1.25rem',
                      borderRadius: '0.75rem',
                      textDecoration: 'none',
                      color: 'inherit',
                      border: isDark ? '1px solid rgba(255,255,255,0.06)' : '1px solid #e5e7eb',
                      background: isDark ? 'rgba(255,255,255,0.02)' : '#fafafa',
                      transition: 'all 0.2s ease',
                    }}
                  >
                    <div
                      className={`bg-gradient-to-br ${action.color}`}
                      style={{
                        width: '2.75rem',
                        height: '2.75rem',
                        borderRadius: '0.75rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                      }}
                    >
                      <action.icon className="text-xl text-white" />
                    </div>
                    <div style={{ flex: 1 }}>
                      <h4 className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`} style={{ fontSize: '0.95rem', marginBottom: '0.15rem' }}>{action.label}</h4>
                      <p className={isDark ? 'text-gray-500' : 'text-gray-400'} style={{ fontSize: '0.8rem' }}>{action.desc}</p>
                    </div>
                    <HiOutlineArrowRight className={isDark ? 'text-gray-500' : 'text-gray-400'} style={{ flexShrink: 0 }} />
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

      </div>
    </div>
  );
}
