import { useState } from 'react';
import { motion } from 'framer-motion';
import { useThemeStore } from '../../store/useStore';
import { getJobs, deleteJob, updateJob } from '../../utils/storage';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';
import {
  HiOutlineBriefcase,
  HiOutlineTrash,
  HiOutlineSearch,
  HiOutlineLocationMarker,
  HiOutlineEye,
  HiOutlineEyeOff,
  HiOutlineExternalLink,
} from 'react-icons/hi';

export default function AdminJobs() {
  const { isDark } = useThemeStore();
  const [refreshKey, setRefreshKey] = useState(0);
  const [search, setSearch] = useState('');

  let jobs = getJobs().sort((a, b) => new Date(b.postedAt).getTime() - new Date(a.postedAt).getTime());

  if (search) {
    const s = search.toLowerCase();
    jobs = jobs.filter(j =>
      j.title.toLowerCase().includes(s) ||
      j.companyName.toLowerCase().includes(s)
    );
  }

  const handleDelete = (id: string, title: string) => {
    if (confirm(`Delete "${title}"? This action cannot be undone.`)) {
      deleteJob(id);
      setRefreshKey(k => k + 1);
      toast.success('Job deleted');
    }
  };

  const handleToggleActive = (id: string, isActive: boolean) => {
    updateJob(id, { isActive: !isActive });
    setRefreshKey(k => k + 1);
    toast.success(isActive ? 'Job deactivated' : 'Job activated');
  };

  return (
    <div className={`min-h-screen ${isDark ? 'bg-slate-950 text-white' : 'bg-gray-50 text-gray-900'}`} key={refreshKey}>
      <div style={{ maxWidth: '72rem', margin: '0 auto', padding: '2.5rem 2rem' }}>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ marginBottom: '2rem' }}
        >
          <h1 className="text-3xl font-bold" style={{ marginBottom: '0.5rem' }}>
            Manage <span className="gradient-text">Jobs</span>
          </h1>
          <p className={isDark ? 'text-gray-400' : 'text-gray-600'} style={{ fontSize: '1rem' }}>
            {jobs.length} jobs found
          </p>
        </motion.div>

        {/* Search */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className={isDark ? 'bg-white/[0.04] border border-white/[0.08]' : 'bg-white border border-gray-200'}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            padding: '0.875rem 1.25rem',
            borderRadius: '0.75rem',
            marginBottom: '2rem',
          }}
        >
          <HiOutlineSearch className={isDark ? 'text-gray-400' : 'text-gray-500'} style={{ fontSize: '1.125rem', flexShrink: 0 }} />
          <input
            type="text"
            placeholder="Search jobs..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className={`w-full bg-transparent outline-none text-sm ${isDark ? 'text-white placeholder-gray-500' : 'text-gray-900 placeholder-gray-400'}`}
          />
        </motion.div>

        {/* Jobs List */}
        {jobs.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '5rem 0' }}>
            <HiOutlineBriefcase
              className={isDark ? 'text-gray-600' : 'text-gray-300'}
              style={{ fontSize: '3.5rem', margin: '0 auto 1rem' }}
            />
            <h3 style={{ fontSize: '1.25rem', fontWeight: 600 }}>No jobs found</h3>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
            {jobs.map((job, i) => (
              <motion.div
                key={job.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.03 }}
                className={isDark ? 'bg-white/[0.04] border border-white/[0.08]' : 'bg-white border border-gray-200 shadow-sm'}
                style={{ padding: '1.5rem 1.75rem', borderRadius: '1rem' }}
              >
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '1rem' }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                      <div
                        className={isDark ? 'bg-indigo-500/10' : 'bg-indigo-50'}
                        style={{
                          width: '2.75rem',
                          height: '2.75rem',
                          borderRadius: '0.625rem',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0,
                        }}
                      >
                        <HiOutlineBriefcase className={isDark ? 'text-indigo-400' : 'text-indigo-600'} />
                      </div>
                      <div>
                        <h3 style={{ fontWeight: 600, fontSize: '1rem', marginBottom: '0.25rem' }}>{job.title}</h3>
                        <p className={isDark ? 'text-gray-400' : 'text-gray-500'} style={{ fontSize: '0.875rem' }}>
                          {job.companyName}
                        </p>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem', marginTop: '0.625rem' }}>
                          <span
                            className={isDark ? 'text-gray-500' : 'text-gray-400'}
                            style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.8rem' }}
                          >
                            <HiOutlineLocationMarker /> {job.location}
                          </span>
                          <span className={isDark ? 'text-gray-500' : 'text-gray-400'} style={{ fontSize: '0.8rem' }}>
                            {job.type} • {job.applicationsCount} applicants
                          </span>
                          <span className={isDark ? 'text-gray-500' : 'text-gray-400'} style={{ fontSize: '0.8rem' }}>
                            {new Date(job.postedAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexShrink: 0 }}>
                    <span
                      className={job.isActive ? 'bg-emerald-500/15 text-emerald-400' : 'bg-red-500/15 text-red-400'}
                      style={{ padding: '0.3rem 0.875rem', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: 500 }}
                    >
                      {job.isActive ? 'Active' : 'Inactive'}
                    </span>
                    <Link
                      to={`/jobs/${job.id}`}
                      className={isDark ? 'hover:bg-white/5' : 'hover:bg-gray-50'}
                      style={{ padding: '0.5rem', borderRadius: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                    >
                      <HiOutlineExternalLink className={isDark ? 'text-gray-400' : 'text-gray-500'} />
                    </Link>
                    <motion.button
                      whileTap={{ scale: 0.9 }}
                      onClick={() => handleToggleActive(job.id, job.isActive)}
                      className={job.isActive
                        ? 'bg-yellow-500/10 text-yellow-400 hover:bg-yellow-500/20'
                        : 'bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20'
                      }
                      title={job.isActive ? 'Deactivate' : 'Activate'}
                      style={{ padding: '0.5rem', borderRadius: '0.5rem', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                    >
                      {job.isActive ? <HiOutlineEyeOff /> : <HiOutlineEye />}
                    </motion.button>
                    <motion.button
                      whileTap={{ scale: 0.9 }}
                      onClick={() => handleDelete(job.id, job.title)}
                      className="bg-red-500/10 text-red-400 hover:bg-red-500/20"
                      style={{ padding: '0.5rem', borderRadius: '0.5rem', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                    >
                      <HiOutlineTrash />
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}
