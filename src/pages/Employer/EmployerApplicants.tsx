import { useState } from 'react';
import { motion } from 'framer-motion';
import { useThemeStore, useAuthStore } from '../../store/useStore';
import { getApplicationsByEmployer, updateApplicationStatus, getUserById } from '../../utils/storage';
import toast from 'react-hot-toast';
import {
  HiOutlineUserGroup,
  HiOutlineMail,
  HiOutlineDocumentText,
  HiOutlineCheckCircle,
  HiOutlineXCircle,
  HiOutlineStar,
  HiOutlineEye,
} from 'react-icons/hi';

export default function EmployerApplicants() {
  const { isDark } = useThemeStore();
  const { user } = useAuthStore();
  const [filter, setFilter] = useState('all');
  const [refreshKey, setRefreshKey] = useState(0);
  const [selectedApp, setSelectedApp] = useState<string | null>(null);

  if (!user) return null;

  const allApplications = getApplicationsByEmployer(user.id).sort(
    (a, b) => new Date(b.appliedAt).getTime() - new Date(a.appliedAt).getTime()
  );

  const applications = filter === 'all'
    ? allApplications
    : allApplications.filter(a => a.status === filter);

  const handleStatusUpdate = (appId: string, status: 'shortlisted' | 'rejected' | 'hired' | 'reviewed') => {
    updateApplicationStatus(appId, status);
    setRefreshKey(k => k + 1);
    toast.success(`Application ${status}`);
  };

  const filters = [
    { value: 'all', label: 'All', count: allApplications.length },
    { value: 'pending', label: 'Pending', count: allApplications.filter(a => a.status === 'pending').length },
    { value: 'shortlisted', label: 'Shortlisted', count: allApplications.filter(a => a.status === 'shortlisted').length },
    { value: 'rejected', label: 'Rejected', count: allApplications.filter(a => a.status === 'rejected').length },
    { value: 'hired', label: 'Hired', count: allApplications.filter(a => a.status === 'hired').length },
  ];

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
            Manage <span className="gradient-text">Applicants</span>
          </h1>
          <p className={isDark ? 'text-gray-400' : 'text-gray-600'} style={{ fontSize: '1rem' }}>
            Review and manage job applications
          </p>
        </motion.div>

        {/* Filter Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '2rem' }}
        >
          {filters.map((f) => (
            <button
              key={f.value}
              onClick={() => setFilter(f.value)}
              className={filter === f.value
                ? 'bg-gradient-to-r from-indigo-500/20 to-cyan-500/20 text-indigo-400 border border-indigo-500/30'
                : isDark
                  ? 'bg-white/5 text-gray-400 hover:bg-white/10 border border-white/5'
                  : 'bg-white text-gray-500 hover:bg-gray-50 border border-gray-200'
              }
              style={{
                padding: '0.625rem 1rem', borderRadius: '0.75rem',
                fontSize: '0.875rem', fontWeight: 500,
                cursor: 'pointer', transition: 'all 0.2s',
              }}
            >
              {f.label} ({f.count})
            </button>
          ))}
        </motion.div>

        {/* Applications */}
        {applications.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{ textAlign: 'center', padding: '5rem 0' }}
          >
            <HiOutlineUserGroup
              className={isDark ? 'text-gray-600' : 'text-gray-300'}
              style={{ fontSize: '3.5rem', margin: '0 auto 1rem' }}
            />
            <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '0.5rem' }}>No applicants found</h3>
            <p className={isDark ? 'text-gray-500' : 'text-gray-400'} style={{ fontSize: '0.95rem' }}>
              {filter !== 'all' ? 'Try a different filter' : 'Applications will appear here'}
            </p>
          </motion.div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {applications.map((app, i) => {
              const seeker = getUserById(app.seekerId);
              const isExpanded = selectedApp === app.id;

              return (
                <motion.div
                  key={app.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className={isDark ? 'bg-white/[0.04] border border-white/[0.08]' : 'bg-white border border-gray-200 shadow-sm'}
                  style={{ borderRadius: '1rem', overflow: 'hidden' }}
                >
                  <div style={{ padding: '1.5rem 1.75rem' }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '1rem' }}>
                      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                        <div style={{
                          width: '3rem', height: '3rem', borderRadius: '0.75rem',
                          background: 'linear-gradient(135deg, #6366f1, #06b6d4)',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          color: 'white', fontWeight: 700, flexShrink: 0,
                        }}>
                          {app.seekerName.charAt(0)}
                        </div>
                        <div>
                          <h3 style={{ fontWeight: 600, fontSize: '1rem', marginBottom: '0.25rem' }}>{app.seekerName}</h3>
                          <p className={isDark ? 'text-gray-400' : 'text-gray-500'} style={{ fontSize: '0.875rem', marginBottom: '0.375rem' }}>
                            Applied for: {app.jobTitle}
                          </p>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem' }}>
                            <span className={isDark ? 'text-gray-500' : 'text-gray-400'} style={{ fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                              <HiOutlineMail /> {app.seekerEmail}
                            </span>
                            <span className={isDark ? 'text-gray-500' : 'text-gray-400'} style={{ fontSize: '0.8rem' }}>
                              {new Date(app.appliedAt).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexShrink: 0 }}>
                        <button
                          onClick={() => setSelectedApp(isExpanded ? null : app.id)}
                          className={isDark ? 'hover:bg-white/5' : 'hover:bg-gray-50'}
                          style={{ padding: '0.5rem', borderRadius: '0.5rem', border: 'none', cursor: 'pointer', background: 'transparent', display: 'flex', alignItems: 'center' }}
                        >
                          <HiOutlineEye className={isDark ? 'text-gray-400' : 'text-gray-500'} />
                        </button>

                        {app.status === 'pending' || app.status === 'reviewed' ? (
                          <>
                            <motion.button
                              whileTap={{ scale: 0.9 }}
                              onClick={() => handleStatusUpdate(app.id, 'shortlisted')}
                              className="bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20"
                              title="Shortlist"
                              style={{ padding: '0.5rem', borderRadius: '0.5rem', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
                            >
                              <HiOutlineStar />
                            </motion.button>
                            <motion.button
                              whileTap={{ scale: 0.9 }}
                              onClick={() => handleStatusUpdate(app.id, 'rejected')}
                              className="bg-red-500/10 text-red-400 hover:bg-red-500/20"
                              title="Reject"
                              style={{ padding: '0.5rem', borderRadius: '0.5rem', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
                            >
                              <HiOutlineXCircle />
                            </motion.button>
                          </>
                        ) : app.status === 'shortlisted' ? (
                          <motion.button
                            whileTap={{ scale: 0.9 }}
                            onClick={() => handleStatusUpdate(app.id, 'hired')}
                            className="bg-indigo-500/10 text-indigo-400 hover:bg-indigo-500/20"
                            style={{ padding: '0.375rem 1rem', borderRadius: '0.5rem', border: 'none', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '0.25rem' }}
                          >
                            <HiOutlineCheckCircle /> Hire
                          </motion.button>
                        ) : null}
                      </div>
                    </div>
                  </div>

                  {/* Expanded Details */}
                  {isExpanded && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className={isDark ? 'border-white/5' : 'border-gray-100'}
                      style={{ padding: '0 1.75rem 1.75rem', borderTop: '1px solid' }}
                    >
                      <div style={{ paddingTop: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                        <div>
                          <h4 style={{ fontSize: '0.875rem', fontWeight: 500, marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <HiOutlineDocumentText className="text-indigo-400" /> Cover Letter
                          </h4>
                          <p className={isDark ? 'text-gray-300' : 'text-gray-600'} style={{ fontSize: '0.875rem', lineHeight: 1.6 }}>
                            {app.coverLetter}
                          </p>
                        </div>
                        {seeker && (
                          <div>
                            <h4 style={{ fontSize: '0.875rem', fontWeight: 500, marginBottom: '0.75rem' }}>Candidate Details</h4>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem' }}>
                              {seeker.experience && (
                                <div className={isDark ? 'bg-white/[0.03]' : 'bg-gray-50'} style={{ padding: '1rem', borderRadius: '0.75rem' }}>
                                  <p className={isDark ? 'text-gray-500' : 'text-gray-400'} style={{ fontSize: '0.75rem', marginBottom: '0.25rem' }}>Experience</p>
                                  <p style={{ fontSize: '0.875rem', fontWeight: 500 }}>{seeker.experience}</p>
                                </div>
                              )}
                              {seeker.education && (
                                <div className={isDark ? 'bg-white/[0.03]' : 'bg-gray-50'} style={{ padding: '1rem', borderRadius: '0.75rem' }}>
                                  <p className={isDark ? 'text-gray-500' : 'text-gray-400'} style={{ fontSize: '0.75rem', marginBottom: '0.25rem' }}>Education</p>
                                  <p style={{ fontSize: '0.875rem', fontWeight: 500 }}>{seeker.education}</p>
                                </div>
                              )}
                              {seeker.location && (
                                <div className={isDark ? 'bg-white/[0.03]' : 'bg-gray-50'} style={{ padding: '1rem', borderRadius: '0.75rem' }}>
                                  <p className={isDark ? 'text-gray-500' : 'text-gray-400'} style={{ fontSize: '0.75rem', marginBottom: '0.25rem' }}>Location</p>
                                  <p style={{ fontSize: '0.875rem', fontWeight: 500 }}>{seeker.location}</p>
                                </div>
                              )}
                              {seeker.phone && (
                                <div className={isDark ? 'bg-white/[0.03]' : 'bg-gray-50'} style={{ padding: '1rem', borderRadius: '0.75rem' }}>
                                  <p className={isDark ? 'text-gray-500' : 'text-gray-400'} style={{ fontSize: '0.75rem', marginBottom: '0.25rem' }}>Phone</p>
                                  <p style={{ fontSize: '0.875rem', fontWeight: 500 }}>{seeker.phone}</p>
                                </div>
                              )}
                            </div>
                            {seeker.skills && seeker.skills.length > 0 && (
                              <div style={{ marginTop: '0.875rem' }}>
                                <p className={isDark ? 'text-gray-500' : 'text-gray-400'} style={{ fontSize: '0.75rem', marginBottom: '0.5rem' }}>Skills</p>
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                                  {seeker.skills.map(skill => (
                                    <span
                                      key={skill}
                                      className={isDark ? 'bg-indigo-500/10 text-indigo-300' : 'bg-indigo-50 text-indigo-600'}
                                      style={{ padding: '0.3rem 0.75rem', borderRadius: '0.5rem', fontSize: '0.75rem', fontWeight: 500 }}
                                    >
                                      {skill}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </motion.div>
              );
            })}
          </div>
        )}

      </div>
    </div>
  );
}
