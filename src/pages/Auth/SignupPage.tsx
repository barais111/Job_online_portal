import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuthStore, useThemeStore } from '../../store/useStore';
import toast from 'react-hot-toast';
import type { UserRole } from '../../types';
import {
  HiOutlineMail,
  HiOutlineLockClosed,
  HiOutlineUser,
  HiOutlineBriefcase,
  HiOutlineOfficeBuilding,
} from 'react-icons/hi';

export default function SignupPage() {
  const { isDark } = useThemeStore();
  const { signup } = useAuthStore();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'seeker' as UserRole,
    companyName: '',
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.name || !form.email || !form.password || !form.confirmPassword) {
      toast.error('Please fill all required fields');
      return;
    }
    if (form.password !== form.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    if (form.password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }
    if (form.role === 'employer' && !form.companyName) {
      toast.error('Company name is required for employers');
      return;
    }

    setLoading(true);
    await new Promise(r => setTimeout(r, 800));

    const user = signup({
      name: form.name,
      email: form.email,
      password: form.password,
      role: form.role,
      companyName: form.role === 'employer' ? form.companyName : undefined,
    });

    setLoading(false);

    if (user) {
      toast.success('Account created successfully!');
      if (user.role === 'employer') navigate('/employer/dashboard');
      else navigate('/seeker/dashboard');
    } else {
      toast.error('Email already exists');
    }
  };

  const roles: { value: UserRole; label: string; icon: typeof HiOutlineUser; desc: string }[] = [
    { value: 'seeker', label: 'Job Seeker', icon: HiOutlineUser, desc: 'Find your dream job' },
    { value: 'employer', label: 'Employer', icon: HiOutlineOfficeBuilding, desc: 'Hire top talent' },
  ];

  return (
    <div
      className={isDark ? 'bg-slate-950' : 'bg-gray-50'}
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '3rem 1.5rem',
      }}
    >
      <div className="fixed inset-0 pointer-events-none">
        <motion.div
          animate={{ y: [0, -30, 0] }}
          transition={{ duration: 8, repeat: Infinity }}
          className="absolute top-1/4 right-1/4 w-64 h-64 bg-purple-500/10 rounded-full blur-[100px]"
        />
        <motion.div
          animate={{ y: [0, 30, 0] }}
          transition={{ duration: 10, repeat: Infinity }}
          className="absolute bottom-1/4 left-1/4 w-80 h-80 bg-indigo-500/10 rounded-full blur-[120px]"
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative"
        style={{ width: '100%', maxWidth: '28rem' }}
      >
        {/* Logo & Header */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none' }}>
            <div
              style={{
                width: '3.25rem',
                height: '3.25rem',
                borderRadius: '0.875rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'linear-gradient(135deg, #6366f1, #06b6d4)',
                boxShadow: '0 8px 24px rgba(99, 102, 241, 0.3)',
              }}
            >
              <HiOutlineBriefcase className="text-white" style={{ fontSize: '1.5rem' }} />
            </div>
          </Link>
          <h1
            className={isDark ? 'text-white' : 'text-gray-900'}
            style={{ fontSize: '1.875rem', fontWeight: 700, marginTop: '1.25rem', marginBottom: '0.5rem' }}
          >
            Create Account
          </h1>
          <p
            className={isDark ? 'text-gray-400' : 'text-gray-600'}
            style={{ fontSize: '0.95rem' }}
          >
            Join our community today
          </p>
        </div>

        {/* Form Card */}
        <div
          className={isDark
            ? 'bg-white/[0.04] border border-white/[0.08] backdrop-blur-xl'
            : 'bg-white border border-gray-200 shadow-xl'
          }
          style={{
            padding: '2.25rem',
            borderRadius: '1.25rem',
          }}
        >
          {/* Role Selection */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.875rem', marginBottom: '1.75rem' }}>
            {roles.map((r) => (
              <motion.button
                key={r.value}
                whileTap={{ scale: 0.97 }}
                type="button"
                onClick={() => setForm({ ...form, role: r.value })}
                className={form.role === r.value
                  ? 'bg-gradient-to-r from-indigo-500/20 to-cyan-500/20'
                  : isDark
                    ? 'hover:bg-white/[0.06]'
                    : 'hover:bg-gray-100'
                }
                style={{
                  padding: '1rem',
                  borderRadius: '0.75rem',
                  textAlign: 'center',
                  cursor: 'pointer',
                  border: form.role === r.value
                    ? '2px solid rgba(99, 102, 241, 0.4)'
                    : isDark
                      ? '1px solid rgba(255,255,255,0.08)'
                      : '1px solid #e5e7eb',
                  background: form.role === r.value
                    ? undefined
                    : isDark
                      ? 'rgba(255,255,255,0.03)'
                      : '#f9fafb',
                  transition: 'all 0.2s ease',
                }}
              >
                <r.icon
                  className={form.role === r.value ? 'text-indigo-400' : isDark ? 'text-gray-400' : 'text-gray-500'}
                  style={{ fontSize: '1.5rem', margin: '0 auto 0.5rem' }}
                />
                <div
                  className={form.role === r.value ? 'text-indigo-400' : isDark ? 'text-gray-300' : 'text-gray-700'}
                  style={{ fontSize: '0.875rem', fontWeight: 500 }}
                >
                  {r.label}
                </div>
                <div
                  className={isDark ? 'text-gray-500' : 'text-gray-400'}
                  style={{ fontSize: '0.75rem', marginTop: '0.25rem' }}
                >
                  {r.desc}
                </div>
              </motion.button>
            ))}
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {/* Full Name */}
            <div>
              <label
                className={isDark ? 'text-gray-300' : 'text-gray-700'}
                style={{ fontSize: '0.875rem', fontWeight: 500, display: 'block', marginBottom: '0.5rem' }}
              >
                Full Name
              </label>
              <div style={{ position: 'relative' }}>
                <HiOutlineUser
                  className={isDark ? 'text-gray-500' : 'text-gray-400'}
                  style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', fontSize: '1.125rem' }}
                />
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Your full name"
                  className={isDark ? 'input-glass' : 'input-light'}
                  style={{
                    width: '100%',
                    paddingLeft: '3rem',
                    paddingRight: '1rem',
                    paddingTop: '0.875rem',
                    paddingBottom: '0.875rem',
                    borderRadius: '0.75rem',
                    fontSize: '0.875rem',
                  }}
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label
                className={isDark ? 'text-gray-300' : 'text-gray-700'}
                style={{ fontSize: '0.875rem', fontWeight: 500, display: 'block', marginBottom: '0.5rem' }}
              >
                Email
              </label>
              <div style={{ position: 'relative' }}>
                <HiOutlineMail
                  className={isDark ? 'text-gray-500' : 'text-gray-400'}
                  style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', fontSize: '1.125rem' }}
                />
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="you@example.com"
                  className={isDark ? 'input-glass' : 'input-light'}
                  style={{
                    width: '100%',
                    paddingLeft: '3rem',
                    paddingRight: '1rem',
                    paddingTop: '0.875rem',
                    paddingBottom: '0.875rem',
                    borderRadius: '0.75rem',
                    fontSize: '0.875rem',
                  }}
                />
              </div>
            </div>

            {/* Company Name (Employer only) */}
            {form.role === 'employer' && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}>
                <label
                  className={isDark ? 'text-gray-300' : 'text-gray-700'}
                  style={{ fontSize: '0.875rem', fontWeight: 500, display: 'block', marginBottom: '0.5rem' }}
                >
                  Company Name
                </label>
                <div style={{ position: 'relative' }}>
                  <HiOutlineOfficeBuilding
                    className={isDark ? 'text-gray-500' : 'text-gray-400'}
                    style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', fontSize: '1.125rem' }}
                  />
                  <input
                    type="text"
                    value={form.companyName}
                    onChange={(e) => setForm({ ...form, companyName: e.target.value })}
                    placeholder="Your company name"
                    className={isDark ? 'input-glass' : 'input-light'}
                    style={{
                      width: '100%',
                      paddingLeft: '3rem',
                      paddingRight: '1rem',
                      paddingTop: '0.875rem',
                      paddingBottom: '0.875rem',
                      borderRadius: '0.75rem',
                      fontSize: '0.875rem',
                    }}
                  />
                </div>
              </motion.div>
            )}

            {/* Password */}
            <div>
              <label
                className={isDark ? 'text-gray-300' : 'text-gray-700'}
                style={{ fontSize: '0.875rem', fontWeight: 500, display: 'block', marginBottom: '0.5rem' }}
              >
                Password
              </label>
              <div style={{ position: 'relative' }}>
                <HiOutlineLockClosed
                  className={isDark ? 'text-gray-500' : 'text-gray-400'}
                  style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', fontSize: '1.125rem' }}
                />
                <input
                  type="password"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  placeholder="Min 6 characters"
                  className={isDark ? 'input-glass' : 'input-light'}
                  style={{
                    width: '100%',
                    paddingLeft: '3rem',
                    paddingRight: '1rem',
                    paddingTop: '0.875rem',
                    paddingBottom: '0.875rem',
                    borderRadius: '0.75rem',
                    fontSize: '0.875rem',
                  }}
                />
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label
                className={isDark ? 'text-gray-300' : 'text-gray-700'}
                style={{ fontSize: '0.875rem', fontWeight: 500, display: 'block', marginBottom: '0.5rem' }}
              >
                Confirm Password
              </label>
              <div style={{ position: 'relative' }}>
                <HiOutlineLockClosed
                  className={isDark ? 'text-gray-500' : 'text-gray-400'}
                  style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', fontSize: '1.125rem' }}
                />
                <input
                  type="password"
                  value={form.confirmPassword}
                  onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
                  placeholder="Repeat password"
                  className={isDark ? 'input-glass' : 'input-light'}
                  style={{
                    width: '100%',
                    paddingLeft: '3rem',
                    paddingRight: '1rem',
                    paddingTop: '0.875rem',
                    paddingBottom: '0.875rem',
                    borderRadius: '0.75rem',
                    fontSize: '0.875rem',
                  }}
                />
              </div>
            </div>

            {/* Create Account Button */}
            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              type="submit"
              disabled={loading}
              className="btn-gradient"
              style={{
                width: '100%',
                padding: '0.9rem',
                borderRadius: '0.75rem',
                fontWeight: 500,
                fontSize: '0.9rem',
                marginTop: '0.25rem',
                cursor: 'pointer',
                opacity: loading ? 0.5 : 1,
              }}
            >
              {loading ? (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Creating account...
                </div>
              ) : (
                'Create Account'
              )}
            </motion.button>
          </form>

          {/* Sign In Link */}
          <p
            className={isDark ? 'text-gray-400' : 'text-gray-600'}
            style={{ textAlign: 'center', fontSize: '0.875rem', marginTop: '1.75rem' }}
          >
            Already have an account?{' '}
            <Link to="/login" className="text-indigo-400 hover:text-indigo-300" style={{ fontWeight: 500 }}>
              Sign In
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
