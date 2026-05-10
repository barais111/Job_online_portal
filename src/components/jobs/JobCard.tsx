import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useThemeStore, useAuthStore } from '../../store/useStore';
import type { Job } from '../../types';
import { isJobSaved, saveJob, unsaveJob } from '../../utils/storage';
import { useState } from 'react';
import toast from 'react-hot-toast';
import {
  HiOutlineLocationMarker,
  HiOutlineClock,
  HiOutlineCurrencyRupee,
  HiOutlineHeart,
  HiHeart,
  HiOutlineBriefcase,
  HiOutlineOfficeBuilding,
} from 'react-icons/hi';

interface JobCardProps {
  job: Job;
  index?: number;
  onSaveToggle?: () => void;
}

export default function JobCard({ job, index = 0, onSaveToggle }: JobCardProps) {
  const { isDark } = useThemeStore();
  const { user, isAuthenticated } = useAuthStore();
  const [saved, setSaved] = useState(
    user ? isJobSaved(user.id, job.id) : false
  );

  const handleSaveToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isAuthenticated || !user) {
      toast.error('Please login to save jobs');
      return;
    }
    if (user.role !== 'seeker') {
      toast.error('Only job seekers can save jobs');
      return;
    }

    if (saved) {
      unsaveJob(user.id, job.id);
      setSaved(false);
      toast.success('Job removed from saved');
    } else {
      saveJob(user.id, job.id);
      setSaved(true);
      toast.success('Job saved successfully');
    }
    onSaveToggle?.();
  };

  const formatSalary = (min: number, max: number) => {
    if (min >= 100000) {
      return `₹${(min / 100000).toFixed(1)}L - ₹${(max / 100000).toFixed(1)}L`;
    }
    return `₹${min.toLocaleString()} - ₹${max.toLocaleString()}`;
  };

  const getTypeColor = (type: string) => {
    if (isDark) {
      switch (type) {
        case 'full-time': return 'bg-emerald-500/15 text-emerald-400 border-emerald-500/20';
        case 'part-time': return 'bg-blue-500/15 text-blue-400 border-blue-500/20';
        case 'contract': return 'bg-orange-500/15 text-orange-400 border-orange-500/20';
        case 'internship': return 'bg-purple-500/15 text-purple-400 border-purple-500/20';
        case 'remote': return 'bg-cyan-500/15 text-cyan-400 border-cyan-500/20';
        default: return 'bg-gray-500/15 text-gray-400 border-gray-500/20';
      }
    }
    switch (type) {
      case 'full-time': return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'part-time': return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'contract': return 'bg-orange-50 text-orange-700 border-orange-200';
      case 'internship': return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'remote': return 'bg-cyan-50 text-cyan-700 border-cyan-200';
      default: return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const getTimeSince = (date: string) => {
    const seconds = Math.floor((new Date().getTime() - new Date(date).getTime()) / 1000);
    if (seconds < 60) return 'just now';
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    if (days < 30) return `${days}d ago`;
    return `${Math.floor(days / 30)}mo ago`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
    >
      <Link
        to={`/jobs/${job.id}`}
        className={`block transition-all duration-300 group ${
          isDark
            ? 'bg-white/[0.04] border border-white/[0.08] hover:bg-white/[0.07] hover:border-indigo-500/30 hover:shadow-lg hover:shadow-indigo-500/5'
            : 'bg-white border border-gray-200 hover:border-indigo-300 hover:shadow-xl hover:shadow-indigo-500/10'
        }`}
        style={{
          display: 'block',
          borderRadius: '1rem',
          padding: '1.5rem 1.75rem',
          textDecoration: 'none',
          color: 'inherit',
        }}
      >
        {/* Header: Avatar + Title + Save */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem', flex: 1, minWidth: 0 }}>
            {/* Company Avatar */}
            <div
              className={isDark ? 'bg-gradient-to-br from-indigo-500/20 to-cyan-500/20' : 'bg-gradient-to-br from-indigo-50 to-cyan-50'}
              style={{
                width: '3.25rem',
                height: '3.25rem',
                borderRadius: '0.75rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <HiOutlineOfficeBuilding className={`${isDark ? 'text-indigo-400' : 'text-indigo-600'}`} style={{ fontSize: '1.375rem' }} />
            </div>

            <div style={{ flex: 1, minWidth: 0 }}>
              <h3
                className={`group-hover:text-indigo-400 transition-colors ${isDark ? 'text-white' : 'text-gray-900'}`}
                style={{ fontSize: '1.05rem', fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
              >
                {job.title}
              </h3>
              <p
                className={isDark ? 'text-gray-400' : 'text-gray-500'}
                style={{ fontSize: '0.875rem', marginTop: '0.25rem' }}
              >
                {job.companyName}
              </p>
            </div>
          </div>

          {/* Save Button */}
          {isAuthenticated && user?.role === 'seeker' && (
            <motion.button
              whileTap={{ scale: 0.8 }}
              onClick={handleSaveToggle}
              className={saved
                ? 'bg-red-500/10 text-red-500'
                : isDark
                  ? 'bg-white/5 text-gray-400 hover:text-red-400 hover:bg-red-500/10'
                  : 'bg-gray-100 text-gray-400 hover:text-red-500 hover:bg-red-50'
              }
              style={{
                padding: '0.5rem',
                borderRadius: '0.75rem',
                flexShrink: 0,
                border: 'none',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
            >
              {saved ? <HiHeart className="text-xl" /> : <HiOutlineHeart className="text-xl" />}
            </motion.button>
          )}
        </div>

        {/* Job Meta */}
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '0.875rem', marginTop: '1rem' }}>
          <span className={isDark ? 'text-gray-400' : 'text-gray-500'} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.375rem', fontSize: '0.8rem' }}>
            <HiOutlineLocationMarker style={{ fontSize: '0.875rem' }} />
            {job.location}
          </span>
          <span className={isDark ? 'text-gray-400' : 'text-gray-500'} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.375rem', fontSize: '0.8rem' }}>
            <HiOutlineBriefcase style={{ fontSize: '0.875rem' }} />
            {job.experience}
          </span>
          <span className={isDark ? 'text-gray-400' : 'text-gray-500'} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.375rem', fontSize: '0.8rem' }}>
            <HiOutlineCurrencyRupee style={{ fontSize: '0.875rem' }} />
            {formatSalary(job.salaryMin, job.salaryMax)}
          </span>
        </div>

        {/* Skills */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: '1rem' }}>
          {job.skills.slice(0, 4).map((skill) => (
            <span
              key={skill}
              className={isDark
                ? 'bg-indigo-500/10 text-indigo-300 border border-indigo-500/20'
                : 'bg-indigo-50 text-indigo-600 border border-indigo-100'
              }
              style={{ padding: '0.25rem 0.625rem', borderRadius: '0.5rem', fontSize: '0.75rem', fontWeight: 500 }}
            >
              {skill}
            </span>
          ))}
          {job.skills.length > 4 && (
            <span className={isDark ? 'text-gray-500' : 'text-gray-400'} style={{ padding: '0.25rem 0.625rem', borderRadius: '0.5rem', fontSize: '0.75rem' }}>
              +{job.skills.length - 4} more
            </span>
          )}
        </div>

        {/* Footer */}
        <div
          className={isDark ? 'border-white/10' : 'border-gray-200'}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginTop: '1.25rem',
            paddingTop: '1rem',
            borderTop: '1px dashed',
            borderColor: 'inherit',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <span
              className={getTypeColor(job.type)}
              style={{ display: 'inline-flex', alignItems: 'center', padding: '0.25rem 0.75rem', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: 500, border: '1px solid' }}
            >
              {job.type.replace('-', ' ')}
            </span>
            <span className={isDark ? 'text-gray-500' : 'text-gray-400'} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.75rem' }}>
              <HiOutlineClock style={{ fontSize: '0.875rem' }} />
              {getTimeSince(job.postedAt)}
            </span>
          </div>

          <motion.span
            className="text-sm font-medium text-indigo-400 opacity-0 group-hover:opacity-100 transition-opacity"
          >
            View Details →
          </motion.span>
        </div>
      </Link>
    </motion.div>
  );
}
