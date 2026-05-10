import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useThemeStore, useAuthStore } from '../../store/useStore';
import { createJob } from '../../utils/storage';
import toast from 'react-hot-toast';
import {
  HiOutlineBriefcase,
  HiOutlineLocationMarker,
  HiOutlineCurrencyRupee,
  HiOutlineTag,
  HiOutlineDocumentText,
} from 'react-icons/hi';

const JOB_TYPES = ['full-time', 'part-time', 'contract', 'internship', 'remote'] as const;
const EXPERIENCE_LEVELS = ['0-1 years', '1-3 years', '3-5 years', '5-10 years', '10+ years'];
const CATEGORIES = ['Engineering', 'Design', 'Data Science', 'Management', 'Marketing', 'Sales', 'Finance', 'HR'];

export default function PostJob() {
  const { isDark } = useThemeStore();
  const { user } = useAuthStore();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: '',
    description: '',
    requirements: '',
    location: '',
    type: 'full-time' as typeof JOB_TYPES[number],
    salaryMin: '',
    salaryMax: '',
    experience: '',
    skills: '',
    category: '',
    deadline: '',
  });
  const [loading, setLoading] = useState(false);

  if (!user) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.title || !form.description || !form.location || !form.category || !form.experience) {
      toast.error('Please fill all required fields');
      return;
    }

    setLoading(true);
    await new Promise(r => setTimeout(r, 800));

    createJob({
      employerId: user.id,
      companyName: user.companyName || user.name,
      title: form.title,
      description: form.description,
      requirements: form.requirements.split('\n').filter(Boolean),
      location: form.location,
      type: form.type,
      salaryMin: parseInt(form.salaryMin) || 0,
      salaryMax: parseInt(form.salaryMax) || 0,
      experience: form.experience,
      skills: form.skills.split(',').map(s => s.trim()).filter(Boolean),
      category: form.category,
      deadline: form.deadline || undefined,
      isActive: true,
    });

    setLoading(false);
    toast.success('Job posted successfully!');
    navigate('/employer/dashboard');
  };

  const inputClass = `w-full px-4 py-3 rounded-xl text-sm ${isDark ? 'input-glass' : 'input-light'}`;


  return (
    <div className={`min-h-screen ${isDark ? 'bg-slate-950 text-white' : 'bg-gray-50 text-gray-900'}`}>
      <div style={{ maxWidth: '48rem', margin: '0 auto', padding: '2.5rem 2rem' }}>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ marginBottom: '2rem' }}
        >
          <h1 className="text-3xl font-bold" style={{ marginBottom: '0.5rem' }}>
            Post a <span className="gradient-text">New Job</span>
          </h1>
          <p className={isDark ? 'text-gray-400' : 'text-gray-600'} style={{ fontSize: '1rem' }}>
            Fill in the details to create a job listing
          </p>
        </motion.div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Basic Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className={isDark ? 'bg-white/[0.04] border border-white/[0.08]' : 'bg-white border border-gray-200 shadow-sm'}
            style={{ padding: '2rem 2.25rem', borderRadius: '1rem' }}
          >
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <HiOutlineBriefcase className="text-indigo-400" /> Job Details
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div>
                <label className={isDark ? 'text-gray-300' : 'text-gray-700'} style={{ fontSize: '0.875rem', fontWeight: 500, display: 'block', marginBottom: '0.5rem' }}>Job Title *</label>
                <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="e.g. Senior React Developer" className={inputClass} />
              </div>
              <div>
                <label className={isDark ? 'text-gray-300' : 'text-gray-700'} style={{ fontSize: '0.875rem', fontWeight: 500, display: 'block', marginBottom: '0.5rem' }}>Description *</label>
                <textarea rows={5} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Describe the role and responsibilities..." className={`${inputClass} resize-none`} />
              </div>
              <div>
                <label className={isDark ? 'text-gray-300' : 'text-gray-700'} style={{ fontSize: '0.875rem', fontWeight: 500, display: 'block', marginBottom: '0.5rem' }}>Requirements (one per line)</label>
                <textarea rows={4} value={form.requirements} onChange={(e) => setForm({ ...form, requirements: e.target.value })} placeholder={"5+ years React experience\nStrong TypeScript skills\n..."} className={`${inputClass} resize-none`} />
              </div>
            </div>
          </motion.div>

          {/* Job Specs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className={isDark ? 'bg-white/[0.04] border border-white/[0.08]' : 'bg-white border border-gray-200 shadow-sm'}
            style={{ padding: '2rem 2.25rem', borderRadius: '1rem' }}
          >
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <HiOutlineTag className="text-cyan-400" /> Specifications
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
              <div>
                <label className={isDark ? 'text-gray-300' : 'text-gray-700'} style={{ fontSize: '0.875rem', fontWeight: 500, display: 'block', marginBottom: '0.5rem' }}>
                  <HiOutlineLocationMarker className="inline mr-1" style={{ verticalAlign: 'middle' }} />Location *
                </label>
                <input value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} placeholder="Bangalore, India" className={inputClass} />
              </div>
              <div>
                <label className={isDark ? 'text-gray-300' : 'text-gray-700'} style={{ fontSize: '0.875rem', fontWeight: 500, display: 'block', marginBottom: '0.5rem' }}>Job Type *</label>
                <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value as any })} className={inputClass}>
                  {JOB_TYPES.map(t => (
                    <option key={t} value={t}>{t.replace('-', ' ')}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className={isDark ? 'text-gray-300' : 'text-gray-700'} style={{ fontSize: '0.875rem', fontWeight: 500, display: 'block', marginBottom: '0.5rem' }}>Experience *</label>
                <select value={form.experience} onChange={(e) => setForm({ ...form, experience: e.target.value })} className={inputClass}>
                  <option value="">Select level</option>
                  {EXPERIENCE_LEVELS.map(e => (
                    <option key={e} value={e}>{e}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className={isDark ? 'text-gray-300' : 'text-gray-700'} style={{ fontSize: '0.875rem', fontWeight: 500, display: 'block', marginBottom: '0.5rem' }}>Category *</label>
                <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className={inputClass}>
                  <option value="">Select category</option>
                  {CATEGORIES.map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
            </div>
          </motion.div>

          {/* Salary & Skills */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className={isDark ? 'bg-white/[0.04] border border-white/[0.08]' : 'bg-white border border-gray-200 shadow-sm'}
            style={{ padding: '2rem 2.25rem', borderRadius: '1rem' }}
          >
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <HiOutlineCurrencyRupee className="text-emerald-400" /> Salary & Skills
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
              <div>
                <label className={isDark ? 'text-gray-300' : 'text-gray-700'} style={{ fontSize: '0.875rem', fontWeight: 500, display: 'block', marginBottom: '0.5rem' }}>Minimum Salary (₹/year)</label>
                <input type="number" value={form.salaryMin} onChange={(e) => setForm({ ...form, salaryMin: e.target.value })} placeholder="800000" className={inputClass} />
              </div>
              <div>
                <label className={isDark ? 'text-gray-300' : 'text-gray-700'} style={{ fontSize: '0.875rem', fontWeight: 500, display: 'block', marginBottom: '0.5rem' }}>Maximum Salary (₹/year)</label>
                <input type="number" value={form.salaryMax} onChange={(e) => setForm({ ...form, salaryMax: e.target.value })} placeholder="1500000" className={inputClass} />
              </div>
              <div style={{ gridColumn: '1 / -1' }}>
                <label className={isDark ? 'text-gray-300' : 'text-gray-700'} style={{ fontSize: '0.875rem', fontWeight: 500, display: 'block', marginBottom: '0.5rem' }}>
                  <HiOutlineDocumentText className="inline mr-1" style={{ verticalAlign: 'middle' }} />Skills (comma separated)
                </label>
                <input value={form.skills} onChange={(e) => setForm({ ...form, skills: e.target.value })} placeholder="React, TypeScript, Node.js, CSS" className={inputClass} />
              </div>
              <div>
                <label className={isDark ? 'text-gray-300' : 'text-gray-700'} style={{ fontSize: '0.875rem', fontWeight: 500, display: 'block', marginBottom: '0.5rem' }}>Application Deadline</label>
                <input type="date" value={form.deadline} onChange={(e) => setForm({ ...form, deadline: e.target.value })} className={inputClass} />
              </div>
            </div>
          </motion.div>

          {/* Submit */}
          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', paddingTop: '0.5rem' }}>
            <button
              type="button"
              onClick={() => navigate(-1)}
              className={isDark ? 'bg-white/5 text-gray-300' : 'bg-gray-100 text-gray-600'}
              style={{ padding: '0.75rem 1.5rem', borderRadius: '0.75rem', fontSize: '0.875rem', fontWeight: 500, cursor: 'pointer', border: 'none' }}
            >
              Cancel
            </button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading}
              className="btn-gradient disabled:opacity-50"
              style={{ padding: '0.75rem 2rem', borderRadius: '0.75rem', fontSize: '0.875rem', fontWeight: 500, cursor: 'pointer', border: 'none' }}
            >
              {loading ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Posting...
                </div>
              ) : (
                'Post Job'
              )}
            </motion.button>
          </div>
        </form>

      </div>
    </div>
  );
}
