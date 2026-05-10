import { useState } from 'react';
import { motion } from 'framer-motion';
import { useThemeStore, useAuthStore } from '../../store/useStore';
import { getSavedJobsBySeeker, getJobById } from '../../utils/storage';
import JobCard from '../../components/jobs/JobCard';
import { HiOutlineHeart } from 'react-icons/hi';
import { Link } from 'react-router-dom';

export default function SeekerSavedJobs() {
  const { isDark } = useThemeStore();
  const { user } = useAuthStore();
  const [refreshKey, setRefreshKey] = useState(0);

  if (!user) return null;

  const savedJobs = getSavedJobsBySeeker(user.id);
  const jobs = savedJobs
    .map(s => getJobById(s.jobId))
    .filter(Boolean);

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
            Saved <span className="gradient-text">Jobs</span>
          </h1>
          <p className={isDark ? 'text-gray-400' : 'text-gray-600'} style={{ fontSize: '1rem' }}>
            {jobs.length} jobs saved
          </p>
        </motion.div>

        {/* Content */}
        {jobs.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{ textAlign: 'center', padding: '5rem 0' }}
          >
            <HiOutlineHeart
              className={isDark ? 'text-gray-600' : 'text-gray-300'}
              style={{ fontSize: '3.5rem', margin: '0 auto 1.25rem' }}
            />
            <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '0.5rem' }}>No saved jobs</h3>
            <p
              className={isDark ? 'text-gray-500' : 'text-gray-400'}
              style={{ fontSize: '0.95rem', marginBottom: '1.5rem' }}
            >
              Browse jobs and save the ones you like!
            </p>
            <Link
              to="/jobs"
              className="btn-gradient"
              style={{
                display: 'inline-block',
                padding: '0.625rem 1.5rem',
                borderRadius: '0.75rem',
                fontSize: '0.875rem',
                fontWeight: 500,
                textDecoration: 'none',
                color: 'white',
              }}
            >
              Browse Jobs
            </Link>
          </motion.div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1.5rem' }} key={refreshKey}>
            {jobs.map((job, i) => (
              job && <JobCard key={job.id} job={job} index={i} onSaveToggle={() => setRefreshKey(k => k + 1)} />
            ))}
          </div>
        )}

      </div>
    </div>
  );
}
