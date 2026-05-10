import { motion } from 'framer-motion';
import { useThemeStore } from '../../store/useStore';
import { getAnalytics } from '../../utils/storage';
import AnimatedCounter from '../../components/ui/AnimatedCounter';
import {
  HiOutlineUserGroup,
  HiOutlineBriefcase,
  HiOutlineDocumentText,
  HiOutlineCheckCircle,
  HiOutlineClock,
  HiOutlineXCircle,
  HiOutlineStar,
  HiOutlineTrendingUp,
} from 'react-icons/hi';
import { Link } from 'react-router-dom';

export default function AdminDashboard() {
  const { isDark } = useThemeStore();
  const analytics = getAnalytics();

  const mainStats = [
    { label: 'Total Users', value: analytics.totalUsers, icon: HiOutlineUserGroup, color: 'from-indigo-500 to-purple-500' },
    { label: 'Total Jobs', value: analytics.totalJobs, icon: HiOutlineBriefcase, color: 'from-cyan-500 to-blue-500' },
    { label: 'Applications', value: analytics.totalApplications, icon: HiOutlineDocumentText, color: 'from-emerald-500 to-teal-500' },
    { label: 'Active Jobs', value: analytics.activeJobs, icon: HiOutlineTrendingUp, color: 'from-amber-500 to-orange-500' },
  ];

  const detailedStats = [
    { label: 'Job Seekers', value: analytics.totalSeekers, icon: HiOutlineUserGroup, color: 'text-indigo-400' },
    { label: 'Employers', value: analytics.totalEmployers, icon: HiOutlineBriefcase, color: 'text-cyan-400' },
    { label: 'Pending', value: analytics.pendingApplications, icon: HiOutlineClock, color: 'text-yellow-400' },
    { label: 'Shortlisted', value: analytics.shortlistedApplications, icon: HiOutlineStar, color: 'text-emerald-400' },
    { label: 'Hired', value: analytics.hiredApplications, icon: HiOutlineCheckCircle, color: 'text-indigo-400' },
    { label: 'Rejected', value: analytics.rejectedApplications, icon: HiOutlineXCircle, color: 'text-red-400' },
  ];

  return (
    <div className={`min-h-screen ${isDark ? 'bg-slate-950 text-white' : 'bg-gray-50 text-gray-900'}`}>
      <div style={{ maxWidth: '76rem', margin: '0 auto', padding: '2.5rem 2rem' }}>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ marginBottom: '2rem' }}
        >
          <h1 className="text-3xl font-bold" style={{ marginBottom: '0.5rem' }}>
            Admin <span className="gradient-text">Dashboard</span>
          </h1>
          <p className={isDark ? 'text-gray-400' : 'text-gray-600'} style={{ fontSize: '1rem' }}>
            Platform overview and analytics
          </p>
        </motion.div>

        {/* Main Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.25rem', marginBottom: '2rem' }}>
          {mainStats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className={isDark ? 'bg-white/[0.04] border border-white/[0.08]' : 'bg-white border border-gray-200 shadow-sm'}
              style={{ position: 'relative', overflow: 'hidden', padding: '1.5rem 1.75rem', borderRadius: '1rem' }}
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
              <p className={isDark ? 'text-gray-400' : 'text-gray-500'} style={{ fontSize: '0.875rem', marginTop: '0.375rem' }}>
                {stat.label}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Bottom Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>

          {/* Detailed Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className={isDark ? 'bg-white/[0.04] border border-white/[0.08]' : 'bg-white border border-gray-200 shadow-sm'}
            style={{ padding: '2rem 2.25rem', borderRadius: '1rem' }}
          >
            <h2 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1.5rem' }}>Detailed Analytics</h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              {detailedStats.map((stat) => (
                <div
                  key={stat.label}
                  className={isDark ? 'bg-white/[0.03] border border-white/[0.05]' : 'bg-gray-50 border border-gray-100'}
                  style={{ padding: '1.25rem', borderRadius: '0.75rem' }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.625rem' }}>
                    <stat.icon className={stat.color} />
                    <span className={isDark ? 'text-gray-400' : 'text-gray-500'} style={{ fontSize: '0.8rem' }}>{stat.label}</span>
                  </div>
                  <AnimatedCounter end={stat.value} className="text-2xl font-bold" />
                </div>
              ))}
            </div>
          </motion.div>

          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}
          >
            <h2 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.5rem' }}>Manage Platform</h2>
            {[
              { to: '/admin/users', label: 'Manage Users', desc: 'View and manage all users', icon: HiOutlineUserGroup, color: 'from-indigo-500 to-purple-500' },
              { to: '/admin/jobs', label: 'Manage Jobs', desc: 'View and moderate job listings', icon: HiOutlineBriefcase, color: 'from-cyan-500 to-blue-500' },
            ].map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={isDark
                  ? 'bg-white/[0.04] border border-white/[0.08] hover:bg-white/[0.06]'
                  : 'bg-white border border-gray-200 hover:bg-gray-50 shadow-sm'
                }
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1.25rem',
                  padding: '1.5rem 1.75rem',
                  borderRadius: '1rem',
                  textDecoration: 'none',
                  color: 'inherit',
                  transition: 'background-color 0.2s',
                }}
              >
                <div
                  className={`bg-gradient-to-br ${link.color}`}
                  style={{
                    width: '3.5rem',
                    height: '3.5rem',
                    borderRadius: '0.75rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <link.icon className="text-2xl text-white" />
                </div>
                <div>
                  <h4 style={{ fontWeight: 600, fontSize: '1rem', marginBottom: '0.25rem' }}>{link.label}</h4>
                  <p className={isDark ? 'text-gray-400' : 'text-gray-500'} style={{ fontSize: '0.875rem' }}>{link.desc}</p>
                </div>
              </Link>
            ))}
          </motion.div>

        </div>
      </div>
    </div>
  );
}
