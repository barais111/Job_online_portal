import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuthStore, useThemeStore } from '../../store/useStore';
import toast from 'react-hot-toast';
import { HiOutlineMail, HiOutlineLockClosed, HiOutlineBriefcase } from 'react-icons/hi';

export default function LoginPage() {
  const { isDark } = useThemeStore();
  const { login } = useAuthStore();
  const navigate = useNavigate();

  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.email || !form.password) {
      toast.error('Please fill all fields');
      return;
    }

    setLoading(true);
    // Simulate delay
    await new Promise(r => setTimeout(r, 800));

    const user = login(form.email, form.password);
    setLoading(false);

    if (user) {
      toast.success(`Welcome back, ${user.name}!`);
      if (user.role === 'admin') navigate('/admin');
      else if (user.role === 'employer') navigate('/employer/dashboard');
      else navigate('/seeker/dashboard');
    } else {
      toast.error('Invalid email or password');
    }
  };

  const demoAccounts = [
    { role: 'Job Seeker', email: 'john@email.com', password: 'seeker123', color: 'from-indigo-500 to-purple-500' },
    { role: 'Employer', email: 'hr@techcorp.com', password: 'employer123', color: 'from-cyan-500 to-teal-500' },
    { role: 'Admin', email: 'admin@jobportal.com', password: 'admin123', color: 'from-rose-500 to-pink-500' },
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
      {/* Background effects */}
      <div className="fixed inset-0 pointer-events-none">
        <motion.div
          animate={{ y: [0, -30, 0], x: [0, 20, 0] }}
          transition={{ duration: 8, repeat: Infinity }}
          className="absolute top-1/4 left-1/4 w-64 h-64 bg-indigo-500/10 rounded-full blur-[100px]"
        />
        <motion.div
          animate={{ y: [0, 30, 0] }}
          transition={{ duration: 10, repeat: Infinity }}
          className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-cyan-500/10 rounded-full blur-[120px]"
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative"
        style={{ width: '100%', maxWidth: '26rem' }}
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
            Welcome Back
          </h1>
          <p
            className={isDark ? 'text-gray-400' : 'text-gray-600'}
            style={{ fontSize: '0.95rem' }}
          >
            Sign in to your account
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
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {/* Email Field */}
            <div>
              <label
                className={isDark ? 'text-gray-300' : 'text-gray-700'}
                style={{ fontSize: '0.875rem', fontWeight: 500, display: 'block', marginBottom: '0.5rem' }}
              >
                Email Address
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

            {/* Password Field */}
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
                  placeholder="••••••••"
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

            {/* Sign In Button */}
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
                  <span>Signing in...</span>
                </div>
              ) : (
                'Sign In'
              )}
            </motion.button>
          </form>

          {/* Sign Up Link */}
          <p
            className={isDark ? 'text-gray-400' : 'text-gray-600'}
            style={{ textAlign: 'center', fontSize: '0.875rem', marginTop: '1.75rem' }}
          >
            Don't have an account?{' '}
            <Link to="/signup" className="text-indigo-400 hover:text-indigo-300" style={{ fontWeight: 500 }}>
              Sign Up
            </Link>
          </p>
        </div>

        {/* Demo Accounts */}
        <div style={{ marginTop: '1.75rem' }}>
          <p
            className={isDark ? 'text-gray-500' : 'text-gray-400'}
            style={{ textAlign: 'center', fontSize: '0.8rem', marginBottom: '0.875rem' }}
          >
            Quick login with demo accounts
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem' }}>
            {demoAccounts.map((acc) => (
              <motion.button
                key={acc.role}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => setForm({ email: acc.email, password: acc.password })}
                className={`bg-gradient-to-r ${acc.color}`}
                style={{
                  padding: '0.75rem 0.5rem',
                  borderRadius: '0.75rem',
                  textAlign: 'center',
                  fontSize: '0.8rem',
                  fontWeight: 500,
                  color: 'white',
                  border: 'none',
                  cursor: 'pointer',
                  boxShadow: '0 4px 15px rgba(0,0,0,0.15)',
                }}
              >
                {acc.role}
              </motion.button>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
