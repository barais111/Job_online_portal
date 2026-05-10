import { useState } from 'react';
import { motion } from 'framer-motion';
import { useThemeStore, useAuthStore } from '../../store/useStore';
import toast from 'react-hot-toast';
import {
  HiOutlineUser,
  HiOutlinePhone,
  HiOutlineLocationMarker,
  HiOutlineAcademicCap,
  HiOutlineBriefcase,
  HiOutlineLink,
  HiOutlineDocumentText,
  HiOutlineCurrencyRupee,
  HiOutlinePencil,
} from 'react-icons/hi';

export default function SeekerProfile() {
  const { isDark } = useThemeStore();
  const { user, updateProfile } = useAuthStore();
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    location: user?.location || '',
    bio: user?.bio || '',
    education: user?.education || '',
    experience: user?.experience || '',
    skills: user?.skills?.join(', ') || '',
    expectedSalary: user?.expectedSalary || '',
    linkedIn: user?.linkedIn || '',
    github: user?.github || '',
    portfolio: user?.portfolio || '',
    resumeFileName: user?.resumeFileName || '',
  });

  if (!user) return null;

  const handleSave = () => {
    updateProfile({
      name: form.name,
      phone: form.phone,
      location: form.location,
      bio: form.bio,
      education: form.education,
      experience: form.experience,
      skills: form.skills.split(',').map(s => s.trim()).filter(Boolean),
      expectedSalary: form.expectedSalary,
      linkedIn: form.linkedIn,
      github: form.github,
      portfolio: form.portfolio,
    });
    setEditing(false);
    toast.success('Profile updated!');
  };

  const handleResumeUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('File too large. Max 5MB');
        return;
      }
      const reader = new FileReader();
      reader.onload = () => {
        updateProfile({
          resumeFileName: file.name,
          resumeData: reader.result as string,
        });
        setForm({ ...form, resumeFileName: file.name });
        toast.success('Resume uploaded!');
      };
      reader.readAsDataURL(file);
    }
  };

  const inputClass = `w-full px-4 py-3 rounded-xl text-sm ${isDark ? 'input-glass' : 'input-light'}`;


  return (
    <div className={`min-h-screen ${isDark ? 'bg-slate-950 text-white' : 'bg-gray-50 text-gray-900'}`}>
      <div style={{ maxWidth: '56rem', margin: '0 auto', padding: '2.5rem 2rem' }}>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '2rem' }}
        >
          <div>
            <h1 className="text-3xl font-bold" style={{ marginBottom: '0.5rem' }}>
              My <span className="gradient-text">Profile</span>
            </h1>
            <p className={isDark ? 'text-gray-400' : 'text-gray-600'} style={{ fontSize: '1rem' }}>
              Manage your personal information
            </p>
          </div>
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => editing ? handleSave() : setEditing(true)}
            className={editing ? 'btn-gradient' : isDark ? 'bg-white/5 border border-white/10 text-gray-300 hover:bg-white/10' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 shadow-sm'}
            style={{
              padding: '0.625rem 1.5rem',
              borderRadius: '0.75rem',
              fontSize: '0.875rem',
              fontWeight: 500,
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              cursor: 'pointer',
              border: editing ? 'none' : undefined,
            }}
          >
            {editing ? 'Save Changes' : <><HiOutlinePencil /> Edit Profile</>}
          </motion.button>
        </motion.div>

        {/* Profile Header Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className={isDark ? 'bg-white/[0.04] border border-white/[0.08]' : 'bg-white border border-gray-200 shadow-sm'}
          style={{
            position: 'relative',
            overflow: 'hidden',
            padding: '2rem 2.25rem',
            borderRadius: '1rem',
            marginBottom: '1.5rem',
          }}
        >
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '5.5rem',
              background: 'linear-gradient(90deg, rgba(99,102,241,0.2), rgba(6,182,212,0.2))',
            }}
          />
          <div style={{ position: 'relative', display: 'flex', alignItems: 'flex-end', gap: '1.25rem' }}>
            <div
              style={{
                width: '5rem',
                height: '5rem',
                borderRadius: '1rem',
                background: 'linear-gradient(135deg, #6366f1, #06b6d4)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontSize: '1.5rem',
                fontWeight: 700,
                boxShadow: '0 8px 24px rgba(99, 102, 241, 0.3)',
                flexShrink: 0,
              }}
            >
              {user.name?.charAt(0).toUpperCase()}
            </div>
            <div style={{ paddingBottom: '0.25rem' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.25rem' }}>{user.name}</h2>
              <p className={isDark ? 'text-gray-400' : 'text-gray-500'} style={{ fontSize: '0.875rem', marginBottom: '0.375rem' }}>
                {user.email}
              </p>
              <span
                style={{
                  display: 'inline-block',
                  padding: '0.2rem 0.75rem',
                  borderRadius: '9999px',
                  fontSize: '0.75rem',
                  fontWeight: 500,
                  background: 'rgba(99,102,241,0.15)',
                  color: '#818cf8',
                }}
              >
                Job Seeker
              </span>
            </div>
          </div>
        </motion.div>

        {/* Form Sections */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

          {/* Personal Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className={isDark ? 'bg-white/[0.04] border border-white/[0.08]' : 'bg-white border border-gray-200 shadow-sm'}
            style={{ padding: '2rem 2.25rem', borderRadius: '1rem' }}
          >
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <HiOutlineUser className="text-indigo-400" /> Personal Information
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
              <div>
                <label className={isDark ? 'text-gray-300' : 'text-gray-700'} style={{ fontSize: '0.875rem', fontWeight: 500, display: 'block', marginBottom: '0.5rem' }}>
                  Full Name
                </label>
                <input disabled={!editing} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className={inputClass} />
              </div>
              <div>
                <label className={isDark ? 'text-gray-300' : 'text-gray-700'} style={{ fontSize: '0.875rem', fontWeight: 500, display: 'block', marginBottom: '0.5rem' }}>
                  Email
                </label>
                <input disabled value={form.email} className={`${inputClass} opacity-50`} />
              </div>
              <div>
                <label className={isDark ? 'text-gray-300' : 'text-gray-700'} style={{ fontSize: '0.875rem', fontWeight: 500, display: 'block', marginBottom: '0.5rem' }}>
                  <HiOutlinePhone className="inline mr-1" style={{ verticalAlign: 'middle' }} />Phone
                </label>
                <input disabled={!editing} value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="+91 9876543210" className={inputClass} />
              </div>
              <div>
                <label className={isDark ? 'text-gray-300' : 'text-gray-700'} style={{ fontSize: '0.875rem', fontWeight: 500, display: 'block', marginBottom: '0.5rem' }}>
                  <HiOutlineLocationMarker className="inline mr-1" style={{ verticalAlign: 'middle' }} />Location
                </label>
                <input disabled={!editing} value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} placeholder="City, Country" className={inputClass} />
              </div>
            </div>
            <div style={{ marginTop: '1.25rem' }}>
              <label className={isDark ? 'text-gray-300' : 'text-gray-700'} style={{ fontSize: '0.875rem', fontWeight: 500, display: 'block', marginBottom: '0.5rem' }}>
                Bio
              </label>
              <textarea disabled={!editing} rows={3} value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} placeholder="Tell employers about yourself..." className={`${inputClass} resize-none`} />
            </div>
          </motion.div>

          {/* Professional Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className={isDark ? 'bg-white/[0.04] border border-white/[0.08]' : 'bg-white border border-gray-200 shadow-sm'}
            style={{ padding: '2rem 2.25rem', borderRadius: '1rem' }}
          >
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <HiOutlineBriefcase className="text-cyan-400" /> Professional Details
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
              <div>
                <label className={isDark ? 'text-gray-300' : 'text-gray-700'} style={{ fontSize: '0.875rem', fontWeight: 500, display: 'block', marginBottom: '0.5rem' }}>
                  <HiOutlineAcademicCap className="inline mr-1" style={{ verticalAlign: 'middle' }} />Education
                </label>
                <input disabled={!editing} value={form.education} onChange={(e) => setForm({ ...form, education: e.target.value })} placeholder="B.Tech in CS" className={inputClass} />
              </div>
              <div>
                <label className={isDark ? 'text-gray-300' : 'text-gray-700'} style={{ fontSize: '0.875rem', fontWeight: 500, display: 'block', marginBottom: '0.5rem' }}>
                  Experience Level
                </label>
                <select disabled={!editing} value={form.experience} onChange={(e) => setForm({ ...form, experience: e.target.value })} className={inputClass}>
                  <option value="">Select level</option>
                  <option value="0-1 years">0-1 years</option>
                  <option value="1-3 years">1-3 years</option>
                  <option value="3-5 years">3-5 years</option>
                  <option value="5-10 years">5-10 years</option>
                  <option value="10+ years">10+ years</option>
                </select>
              </div>
              <div style={{ gridColumn: '1 / -1' }}>
                <label className={isDark ? 'text-gray-300' : 'text-gray-700'} style={{ fontSize: '0.875rem', fontWeight: 500, display: 'block', marginBottom: '0.5rem' }}>
                  Skills (comma separated)
                </label>
                <input disabled={!editing} value={form.skills} onChange={(e) => setForm({ ...form, skills: e.target.value })} placeholder="React, TypeScript, Node.js" className={inputClass} />
              </div>
              <div>
                <label className={isDark ? 'text-gray-300' : 'text-gray-700'} style={{ fontSize: '0.875rem', fontWeight: 500, display: 'block', marginBottom: '0.5rem' }}>
                  <HiOutlineCurrencyRupee className="inline mr-1" style={{ verticalAlign: 'middle' }} />Expected Salary
                </label>
                <input disabled={!editing} value={form.expectedSalary} onChange={(e) => setForm({ ...form, expectedSalary: e.target.value })} placeholder="12-15 LPA" className={inputClass} />
              </div>
            </div>
          </motion.div>

          {/* Links & Resume */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className={isDark ? 'bg-white/[0.04] border border-white/[0.08]' : 'bg-white border border-gray-200 shadow-sm'}
            style={{ padding: '2rem 2.25rem', borderRadius: '1rem' }}
          >
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <HiOutlineLink className="text-emerald-400" /> Links & Resume
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
              <div>
                <label className={isDark ? 'text-gray-300' : 'text-gray-700'} style={{ fontSize: '0.875rem', fontWeight: 500, display: 'block', marginBottom: '0.5rem' }}>
                  LinkedIn
                </label>
                <input disabled={!editing} value={form.linkedIn} onChange={(e) => setForm({ ...form, linkedIn: e.target.value })} placeholder="linkedin.com/in/..." className={inputClass} />
              </div>
              <div>
                <label className={isDark ? 'text-gray-300' : 'text-gray-700'} style={{ fontSize: '0.875rem', fontWeight: 500, display: 'block', marginBottom: '0.5rem' }}>
                  GitHub
                </label>
                <input disabled={!editing} value={form.github} onChange={(e) => setForm({ ...form, github: e.target.value })} placeholder="github.com/..." className={inputClass} />
              </div>
              <div>
                <label className={isDark ? 'text-gray-300' : 'text-gray-700'} style={{ fontSize: '0.875rem', fontWeight: 500, display: 'block', marginBottom: '0.5rem' }}>
                  Portfolio
                </label>
                <input disabled={!editing} value={form.portfolio} onChange={(e) => setForm({ ...form, portfolio: e.target.value })} placeholder="yourportfolio.com" className={inputClass} />
              </div>
              <div>
                <label className={isDark ? 'text-gray-300' : 'text-gray-700'} style={{ fontSize: '0.875rem', fontWeight: 500, display: 'block', marginBottom: '0.5rem' }}>
                  <HiOutlineDocumentText className="inline mr-1" style={{ verticalAlign: 'middle' }} />Resume
                </label>
                {form.resumeFileName ? (
                  <div
                    className={isDark ? 'bg-emerald-500/10 border border-emerald-500/20' : 'bg-emerald-50 border border-emerald-100'}
                    style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.875rem 1rem', borderRadius: '0.75rem' }}
                  >
                    <HiOutlineDocumentText className="text-emerald-500" />
                    <span className="text-emerald-400" style={{ fontSize: '0.875rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{form.resumeFileName}</span>
                  </div>
                ) : null}
                {editing && (
                  <label
                    className={isDark ? 'bg-white/5 border border-white/10 text-gray-300 hover:bg-white/10' : 'bg-gray-50 border border-gray-200 text-gray-600 hover:bg-gray-100'}
                    style={{
                      display: 'block',
                      cursor: 'pointer',
                      padding: '0.875rem 1rem',
                      borderRadius: '0.75rem',
                      fontSize: '0.875rem',
                      textAlign: 'center',
                      fontWeight: 500,
                      marginTop: form.resumeFileName ? '0.5rem' : 0,
                    }}
                  >
                    Upload Resume (PDF, max 5MB)
                    <input type="file" accept=".pdf,.doc,.docx" onChange={handleResumeUpload} className="hidden" />
                  </label>
                )}
              </div>
            </div>
          </motion.div>

          {/* Action Buttons */}
          {editing && (
            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
              <button
                onClick={() => setEditing(false)}
                className={isDark ? 'bg-white/5 text-gray-300' : 'bg-gray-100 text-gray-600'}
                style={{ padding: '0.625rem 1.5rem', borderRadius: '0.75rem', fontSize: '0.875rem', fontWeight: 500, border: 'none', cursor: 'pointer' }}
              >
                Cancel
              </button>
              <motion.button
                whileTap={{ scale: 0.98 }}
                onClick={handleSave}
                className="btn-gradient"
                style={{ padding: '0.625rem 2rem', borderRadius: '0.75rem', fontSize: '0.875rem', fontWeight: 500, cursor: 'pointer' }}
              >
                Save Changes
              </motion.button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
