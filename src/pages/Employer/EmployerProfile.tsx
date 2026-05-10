import { useState } from 'react';
import { motion } from 'framer-motion';
import { useThemeStore, useAuthStore } from '../../store/useStore';
import toast from 'react-hot-toast';
import {
  HiOutlineOfficeBuilding,
  HiOutlineGlobe,
  HiOutlineLocationMarker,
  HiOutlineUserGroup,
  HiOutlinePencil,
} from 'react-icons/hi';

export default function EmployerProfile() {
  const { isDark } = useThemeStore();
  const { user, updateProfile } = useAuthStore();
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    companyName: user?.companyName || '',
    companyDescription: user?.companyDescription || '',
    companyWebsite: user?.companyWebsite || '',
    companySize: user?.companySize || '',
    companyIndustry: user?.companyIndustry || '',
    location: user?.location || '',
    phone: user?.phone || '',
  });

  if (!user) return null;

  const handleSave = () => {
    updateProfile(form);
    setEditing(false);
    toast.success('Company profile updated!');
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
              Company <span className="gradient-text">Profile</span>
            </h1>
            <p className={isDark ? 'text-gray-400' : 'text-gray-600'} style={{ fontSize: '1rem' }}>
              Manage your company information
            </p>
          </div>
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => editing ? handleSave() : setEditing(true)}
            className={editing ? 'btn-gradient' : isDark ? 'bg-white/5 border border-white/10 text-gray-300' : 'bg-white border border-gray-200 text-gray-600 shadow-sm'}
            style={{
              padding: '0.625rem 1.5rem', borderRadius: '0.75rem',
              fontSize: '0.875rem', fontWeight: 500,
              display: 'flex', alignItems: 'center', gap: '0.5rem',
              cursor: 'pointer', border: editing ? 'none' : undefined,
            }}
          >
            {editing ? 'Save Changes' : <><HiOutlinePencil /> Edit</>}
          </motion.button>
        </motion.div>

        {/* Company Header Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className={isDark ? 'bg-white/[0.04] border border-white/[0.08]' : 'bg-white border border-gray-200 shadow-sm'}
          style={{ position: 'relative', overflow: 'hidden', padding: '2rem 2.25rem', borderRadius: '1rem', marginBottom: '1.5rem' }}
        >
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '5.5rem', background: 'linear-gradient(90deg, rgba(6,182,212,0.2), rgba(99,102,241,0.2))' }} />
          <div style={{ position: 'relative', display: 'flex', alignItems: 'flex-end', gap: '1.25rem' }}>
            <div style={{
              width: '5rem', height: '5rem', borderRadius: '1rem',
              background: 'linear-gradient(135deg, #06b6d4, #6366f1)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 8px 24px rgba(6, 182, 212, 0.3)', flexShrink: 0,
            }}>
              <HiOutlineOfficeBuilding className="text-3xl text-white" />
            </div>
            <div style={{ paddingBottom: '0.25rem' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.25rem' }}>{user.companyName || 'Your Company'}</h2>
              <p className={isDark ? 'text-gray-400' : 'text-gray-500'} style={{ fontSize: '0.875rem', marginBottom: '0.375rem' }}>{user.email}</p>
              <span style={{ display: 'inline-block', padding: '0.2rem 0.75rem', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: 500, background: 'rgba(6,182,212,0.15)', color: '#22d3ee' }}>
                Employer
              </span>
            </div>
          </div>
        </motion.div>

        {/* Form */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className={isDark ? 'bg-white/[0.04] border border-white/[0.08]' : 'bg-white border border-gray-200 shadow-sm'}
            style={{ padding: '2rem 2.25rem', borderRadius: '1rem' }}
          >
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <HiOutlineOfficeBuilding className="text-cyan-400" /> Company Details
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
              <div>
                <label className={isDark ? 'text-gray-300' : 'text-gray-700'} style={{ fontSize: '0.875rem', fontWeight: 500, display: 'block', marginBottom: '0.5rem' }}>Company Name</label>
                <input disabled={!editing} value={form.companyName} onChange={(e) => setForm({ ...form, companyName: e.target.value })} className={inputClass} />
              </div>
              <div>
                <label className={isDark ? 'text-gray-300' : 'text-gray-700'} style={{ fontSize: '0.875rem', fontWeight: 500, display: 'block', marginBottom: '0.5rem' }}>
                  <HiOutlineGlobe className="inline mr-1" style={{ verticalAlign: 'middle' }} />Website
                </label>
                <input disabled={!editing} value={form.companyWebsite} onChange={(e) => setForm({ ...form, companyWebsite: e.target.value })} placeholder="https://..." className={inputClass} />
              </div>
              <div>
                <label className={isDark ? 'text-gray-300' : 'text-gray-700'} style={{ fontSize: '0.875rem', fontWeight: 500, display: 'block', marginBottom: '0.5rem' }}>
                  <HiOutlineUserGroup className="inline mr-1" style={{ verticalAlign: 'middle' }} />Company Size
                </label>
                <select disabled={!editing} value={form.companySize} onChange={(e) => setForm({ ...form, companySize: e.target.value })} className={inputClass}>
                  <option value="">Select size</option>
                  <option value="1-10">1-10</option>
                  <option value="10-50">10-50</option>
                  <option value="50-200">50-200</option>
                  <option value="200-500">200-500</option>
                  <option value="500-1000">500-1000</option>
                  <option value="1000+">1000+</option>
                </select>
              </div>
              <div>
                <label className={isDark ? 'text-gray-300' : 'text-gray-700'} style={{ fontSize: '0.875rem', fontWeight: 500, display: 'block', marginBottom: '0.5rem' }}>Industry</label>
                <input disabled={!editing} value={form.companyIndustry} onChange={(e) => setForm({ ...form, companyIndustry: e.target.value })} placeholder="Technology" className={inputClass} />
              </div>
              <div>
                <label className={isDark ? 'text-gray-300' : 'text-gray-700'} style={{ fontSize: '0.875rem', fontWeight: 500, display: 'block', marginBottom: '0.5rem' }}>
                  <HiOutlineLocationMarker className="inline mr-1" style={{ verticalAlign: 'middle' }} />Location
                </label>
                <input disabled={!editing} value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} className={inputClass} />
              </div>
              <div>
                <label className={isDark ? 'text-gray-300' : 'text-gray-700'} style={{ fontSize: '0.875rem', fontWeight: 500, display: 'block', marginBottom: '0.5rem' }}>Phone</label>
                <input disabled={!editing} value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className={inputClass} />
              </div>
              <div style={{ gridColumn: '1 / -1' }}>
                <label className={isDark ? 'text-gray-300' : 'text-gray-700'} style={{ fontSize: '0.875rem', fontWeight: 500, display: 'block', marginBottom: '0.5rem' }}>Company Description</label>
                <textarea disabled={!editing} rows={4} value={form.companyDescription} onChange={(e) => setForm({ ...form, companyDescription: e.target.value })} placeholder="Tell candidates about your company..." className={`${inputClass} resize-none`} />
              </div>
            </div>
          </motion.div>
        </div>

      </div>
    </div>
  );
}
