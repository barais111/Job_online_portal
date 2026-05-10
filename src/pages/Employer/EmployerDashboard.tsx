import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useThemeStore, useAuthStore } from '../../store/useStore';
import { getJobsByEmployer, getApplicationsByEmployer } from '../../utils/storage';
import AnimatedCounter from '../../components/ui/AnimatedCounter';
import {
  HiOutlineBriefcase,
  HiOutlineDocumentText,
  HiOutlineUserGroup,
  HiOutlineCheckCircle,
  HiOutlinePlusCircle,
  HiOutlineArrowRight,
  HiOutlineEye,
  HiOutlineTrendingUp,
} from 'react-icons/hi';

export default function EmployerDashboard() {
  const { isDark } = useThemeStore();
  const { user } = useAuthStore();

  if (!user) return null;

  const jobs = getJobsByEmployer(user.id);
  const applications = getApplicationsByEmployer(user.id);

  const stats = [
    { label: 'Posted Jobs', value: jobs.length, icon: HiOutlineBriefcase, color: 'from-indigo-500 to-purple-500' },
    { label: 'Active Jobs', value: jobs.filter(j => j.isActive).length, icon: HiOutlineEye, color: 'from-cyan-500 to-blue-500' },
    { label: 'Total Applicants', value: applications.length, icon: HiOutlineUserGroup, color: 'from-emerald-500 to-teal-500' },
    { label: 'Shortlisted', value: applications.filter(a => a.status === 'shortlisted').length, icon: HiOutlineCheckCircle, color: 'from-amber-500 to-orange-500' },
  ];

  return (
    <div className={`min-h-screen ${isDark ? 'bg-slate-950 text-white' : 'bg-gray-50 text-gray-900'}`}>
      <div style={{ maxWidth: '76rem', margin: '0 auto', padding: '2.5rem 2rem' }}>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '2rem' }}
        >
          <div>
            <h1 className="text-3xl font-bold" style={{ marginBottom: '0.5rem' }}>
              <span className="gradient-text">{user.companyName || 'Employer'}</span> Dashboard
            </h1>
            <p className={isDark ? 'text-gray-400' : 'text-gray-600'} style={{ fontSize: '1rem' }}>
              Manage your job postings and applicants
            </p>
          </div>
          <Link to="/employer/post-job" style={{ textDecoration: 'none' }}>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="btn-gradient"
              style={{
                padding: '0.75rem 1.5rem', borderRadius: '0.75rem',
                fontSize: '0.875rem', fontWeight: 500,
                display: 'flex', alignItems: 'center', gap: '0.5rem',
                cursor: 'pointer', border: 'none',
              }}
            >
              <HiOutlinePlusCircle className="text-lg" />
              Post New Job
            </motion.button>
          </Link>
        </motion.div>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.25rem', marginBottom: '2rem' }}>
          {stats.map((stat, i) => (
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
                style={{ width: '3rem', height: '3rem', borderRadius: '0.75rem', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}
              >
                <stat.icon className="text-xl text-white" />
              </div>
              <AnimatedCounter end={stat.value} className="text-3xl font-bold" />
              <p className={isDark ? 'text-gray-400' : 'text-gray-500'} style={{ fontSize: '0.875rem', marginTop: '0.375rem' }}>{stat.label}</p>
            </motion.div>
          ))}
        </div>

        {/* Bottom Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>

          {/* Recent Jobs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className={isDark ? 'bg-white/[0.04] border border-white/[0.08]' : 'bg-white border border-gray-200 shadow-sm'}
            style={{ padding: '2rem 2.25rem', borderRadius: '1rem' }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
              <h2 style={{ fontSize: '1.1rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <HiOutlineTrendingUp className="text-indigo-400" /> Your Jobs
              </h2>
            </div>
            {jobs.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '2.5rem 0' }}>
                <HiOutlineBriefcase className={isDark ? 'text-gray-600' : 'text-gray-300'} style={{ fontSize: '2.5rem', margin: '0 auto 0.75rem' }} />
                <p className={isDark ? 'text-gray-500' : 'text-gray-400'} style={{ fontSize: '0.875rem', marginBottom: '0.5rem' }}>No jobs posted yet</p>
                <Link to="/employer/post-job" className="text-indigo-400" style={{ fontSize: '0.875rem', textDecoration: 'none' }}>Post your first job →</Link>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {jobs.slice(0, 5).map((job) => (
                  <Link
                    key={job.id}
                    to={`/jobs/${job.id}`}
                    className={isDark ? 'bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.05]' : 'bg-gray-50 hover:bg-gray-100 border border-gray-100'}
                    style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem 1.25rem', borderRadius: '0.75rem', textDecoration: 'none', color: 'inherit', transition: 'background-color 0.2s' }}
                  >
                    <div>
                      <h4 className={isDark ? 'text-white' : 'text-gray-900'} style={{ fontSize: '0.875rem', fontWeight: 500, marginBottom: '0.25rem' }}>{job.title}</h4>
                      <p className={isDark ? 'text-gray-500' : 'text-gray-400'} style={{ fontSize: '0.75rem' }}>
                        {job.applicationsCount} applicant{job.applicationsCount !== 1 ? 's' : ''} • {job.type}
                      </p>
                    </div>
                    <span className={job.isActive ? 'bg-emerald-500/15 text-emerald-400' : 'bg-red-500/15 text-red-400'}
                      style={{ padding: '0.25rem 0.75rem', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: 500 }}>
                      {job.isActive ? 'Active' : 'Closed'}
                    </span>
                  </Link>
                ))}
              </div>
            )}
          </motion.div>

          {/* Recent Applications */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className={isDark ? 'bg-white/[0.04] border border-white/[0.08]' : 'bg-white border border-gray-200 shadow-sm'}
            style={{ padding: '2rem 2.25rem', borderRadius: '1rem' }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
              <h2 style={{ fontSize: '1.1rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <HiOutlineDocumentText className="text-cyan-400" /> Recent Applicants
              </h2>
              <Link to="/employer/applicants" className="text-indigo-400 hover:text-indigo-300" style={{ fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '0.25rem', textDecoration: 'none' }}>
                View all <HiOutlineArrowRight />
              </Link>
            </div>
            {applications.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '2.5rem 0' }}>
                <HiOutlineUserGroup className={isDark ? 'text-gray-600' : 'text-gray-300'} style={{ fontSize: '2.5rem', margin: '0 auto 0.75rem' }} />
                <p className={isDark ? 'text-gray-500' : 'text-gray-400'} style={{ fontSize: '0.875rem' }}>No applications yet</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {applications.slice(0, 5).map((app) => (
                  <div
                    key={app.id}
                    className={isDark ? 'bg-white/[0.03] border border-white/[0.05]' : 'bg-gray-50 border border-gray-100'}
                    style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem 1.25rem', borderRadius: '0.75rem' }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem' }}>
                      <div style={{ width: '2.5rem', height: '2.5rem', borderRadius: '9999px', background: 'linear-gradient(135deg, #6366f1, #06b6d4)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '0.875rem', fontWeight: 700, flexShrink: 0 }}>
                        {app.seekerName.charAt(0)}
                      </div>
                      <div>
                        <h4 className={isDark ? 'text-white' : 'text-gray-900'} style={{ fontSize: '0.875rem', fontWeight: 500, marginBottom: '0.125rem' }}>{app.seekerName}</h4>
                        <p className={isDark ? 'text-gray-500' : 'text-gray-400'} style={{ fontSize: '0.75rem' }}>{app.jobTitle}</p>
                      </div>
                    </div>
                    <span className={
                      app.status === 'pending' ? 'bg-yellow-500/15 text-yellow-400' :
                      app.status === 'shortlisted' ? 'bg-emerald-500/15 text-emerald-400' :
                      app.status === 'rejected' ? 'bg-red-500/15 text-red-400' :
                      'bg-indigo-500/15 text-indigo-400'
                    } style={{ padding: '0.25rem 0.75rem', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: 500 }}>
                      {app.status}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </motion.div>

        </div>
      </div>
    </div>
  );
}
