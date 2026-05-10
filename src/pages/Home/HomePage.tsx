import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useThemeStore } from '../../store/useStore';
import { getActiveJobs, getUsers } from '../../utils/storage';
import AnimatedCounter from '../../components/ui/AnimatedCounter';
import {
  HiOutlineSearch,
  HiOutlineBriefcase,
  HiOutlineOfficeBuilding,
  HiOutlineLightningBolt,
  HiOutlineShieldCheck,
  HiOutlineChartBar,
  HiOutlineGlobe,
} from 'react-icons/hi';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function HomePage() {
  const { isDark } = useThemeStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchLocation, setSearchLocation] = useState('');
  const navigate = useNavigate();

  const totalJobs = getActiveJobs().length;
  const totalUsers = getUsers().length;
  const totalCompanies = getUsers().filter(u => u.role === 'employer').length;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchQuery) params.set('keyword', searchQuery);
    if (searchLocation) params.set('location', searchLocation);
    navigate(`/jobs?${params.toString()}`);
  };

  const categories = [
    { name: 'Engineering', icon: HiOutlineLightningBolt, color: 'from-blue-500 to-indigo-600', count: getActiveJobs().filter(j => j.category === 'Engineering').length },
    { name: 'Design', icon: HiOutlineGlobe, color: 'from-pink-500 to-rose-600', count: getActiveJobs().filter(j => j.category === 'Design').length },
    { name: 'Data Science', icon: HiOutlineChartBar, color: 'from-cyan-500 to-teal-600', count: getActiveJobs().filter(j => j.category === 'Data Science').length },
    { name: 'Management', icon: HiOutlineShieldCheck, color: 'from-amber-500 to-orange-600', count: getActiveJobs().filter(j => j.category === 'Management').length },
  ];

  const features = [
    { title: 'Smart Search', desc: 'Find jobs matching your skills with powerful filters', icon: HiOutlineSearch },
    { title: 'Easy Apply', desc: 'Apply to jobs with just one click', icon: HiOutlineBriefcase },
    { title: 'Track Applications', desc: 'Monitor your application status in real-time', icon: HiOutlineChartBar },
    { title: 'Company Profiles', desc: 'Learn about companies before applying', icon: HiOutlineOfficeBuilding },
  ];

  return (
    <div className={isDark ? 'bg-slate-950 text-white' : 'bg-white text-gray-900'}>
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Animated Background */}
        {isDark ? (
          <>
            <div className="absolute inset-0 animated-bg" />
            <div className="absolute inset-0">
              <motion.div
                animate={{ y: [0, -30, 0], x: [0, 20, 0] }}
                transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute top-20 left-[10%] w-72 h-72 bg-indigo-500/20 rounded-full blur-[100px]"
              />
              <motion.div
                animate={{ y: [0, 30, 0], x: [0, -20, 0] }}
                transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute bottom-20 right-[10%] w-96 h-96 bg-cyan-500/15 rounded-full blur-[120px]"
              />
              <motion.div
                animate={{ y: [0, -20, 0] }}
                transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-purple-500/10 rounded-full blur-[80px]"
              />
            </div>
          </>
        ) : (
          <>
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 via-purple-600 to-cyan-500" />
            <div className="absolute inset-0">
              <motion.div
                animate={{ y: [0, -30, 0], x: [0, 20, 0] }}
                transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute top-20 left-[10%] w-72 h-72 bg-white/10 rounded-full blur-[100px]"
              />
              <motion.div
                animate={{ y: [0, 30, 0], x: [0, -20, 0] }}
                transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute bottom-20 right-[10%] w-96 h-96 bg-cyan-300/15 rounded-full blur-[120px]"
              />
              <motion.div
                animate={{ y: [0, -20, 0] }}
                transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-pink-300/10 rounded-full blur-[80px]"
              />
            </div>
            {/* Decorative shapes for light mode */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-72 h-72 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />
          </>
        )}

        <div className="relative" style={{ maxWidth: '80rem', margin: '0 auto', paddingLeft: '2rem', paddingRight: '2rem', paddingTop: '8rem', paddingBottom: '10rem' }}>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-full mb-8 ${
                isDark
                  ? 'bg-indigo-500/10 border border-indigo-500/20'
                  : 'bg-white/15 border border-white/25 backdrop-blur-sm'
              }`}
            >
              <span className={`w-2 h-2 rounded-full animate-pulse ${isDark ? 'bg-indigo-500' : 'bg-emerald-400'}`} />
              <span className={`text-sm font-medium ${isDark ? 'text-indigo-300' : 'text-white'}`}>
                Trusted by 10,000+ professionals
              </span>
            </motion.div>

            <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-white leading-tight tracking-tight">
              Find Your Dream
              <br />
              <span className={isDark ? 'gradient-text' : 'text-yellow-300'}>Career Today</span>
            </h1>

            <p className={`mt-8 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed ${
              isDark ? 'text-gray-400' : 'text-white/80'
            }`}>
              Discover thousands of job opportunities with the finest companies. 
              Your next career move starts here.
            </p>

            {/* Search Box */}
            <motion.form
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              onSubmit={handleSearch}
              className="mt-12 w-full"
              style={{ maxWidth: '48rem', margin: '3rem auto 0 auto' }}
            >
              <div
                className={`flex flex-col md:flex-row items-stretch gap-3 rounded-2xl backdrop-blur-xl ${
                  isDark
                    ? 'border border-white/15 shadow-lg shadow-indigo-500/10'
                    : 'border border-white/30 shadow-lg shadow-black/10'
                }`}
                style={{
                  padding: '0.875rem',
                  background: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.2)',
                }}
              >
                <div
                  className={`flex-1 flex items-center gap-3 rounded-xl ${
                    isDark ? '' : ''
                  }`}
                  style={{
                    padding: '0.875rem 1.25rem',
                    background: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(255,255,255,0.3)',
                    borderRadius: '0.75rem',
                  }}
                >
                  <HiOutlineSearch className={`text-xl flex-shrink-0 ${isDark ? 'text-gray-400' : 'text-white/70'}`} />
                  <input
                    type="text"
                    placeholder="Job title, skills, or company..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className={`w-full bg-transparent outline-none text-sm ${
                      isDark ? 'text-white placeholder-gray-500' : 'text-white placeholder-white/60'
                    }`}
                  />
                </div>
                <div
                  className={`flex-1 flex items-center gap-3 rounded-xl`}
                  style={{
                    padding: '0.875rem 1.25rem',
                    background: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(255,255,255,0.3)',
                    borderRadius: '0.75rem',
                  }}
                >
                  <HiOutlineGlobe className={`text-xl flex-shrink-0 ${isDark ? 'text-gray-400' : 'text-white/70'}`} />
                  <input
                    type="text"
                    placeholder="Location..."
                    value={searchLocation}
                    onChange={(e) => setSearchLocation(e.target.value)}
                    className={`w-full bg-transparent outline-none text-sm ${
                      isDark ? 'text-white placeholder-gray-500' : 'text-white placeholder-white/60'
                    }`}
                  />
                </div>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  className={`rounded-xl font-semibold text-sm whitespace-nowrap shadow-lg transition-all ${
                    isDark
                      ? 'btn-gradient'
                      : 'bg-white text-indigo-600 hover:bg-gray-50 shadow-white/20'
                  }`}
                  style={{ padding: '0.875rem 2rem' }}
                >
                  Search Jobs
                </motion.button>
              </div>
            </motion.form>

            {/* Quick stats */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="flex items-center justify-center"
              style={{ marginTop: '3.5rem', gap: '3rem' }}
            >
              <div className="text-center">
                <AnimatedCounter end={totalJobs} className="text-3xl md:text-4xl font-bold text-white" suffix="+" />
                <p className={`text-sm mt-1 ${isDark ? 'text-gray-400' : 'text-white/70'}`}>Active Jobs</p>
              </div>
              <div className={`h-14 ${isDark ? 'bg-white/10' : 'bg-white/30'}`} style={{ width: '1px' }} />
              <div className="text-center">
                <AnimatedCounter end={totalCompanies} className="text-3xl md:text-4xl font-bold text-white" suffix="+" />
                <p className={`text-sm mt-1 ${isDark ? 'text-gray-400' : 'text-white/70'}`}>Companies</p>
              </div>
              <div className={`h-14 ${isDark ? 'bg-white/10' : 'bg-white/30'}`} style={{ width: '1px' }} />
              <div className="text-center">
                <AnimatedCounter end={totalUsers} className="text-3xl md:text-4xl font-bold text-white" suffix="+" />
                <p className={`text-sm mt-1 ${isDark ? 'text-gray-400' : 'text-white/70'}`}>Users</p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Categories */}
      <section className={isDark ? 'bg-slate-950' : 'bg-white'} style={{ paddingTop: '5rem', paddingBottom: '5rem' }}>
        <div style={{ maxWidth: '80rem', margin: '0 auto', paddingLeft: '2rem', paddingRight: '2rem' }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center"
            style={{ marginBottom: '3rem' }}
          >
            <h2 className="text-3xl md:text-4xl font-bold">
              Browse by <span className="gradient-text">Category</span>
            </h2>
            <p className={`mt-4 text-lg ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
              Explore opportunities across various domains
            </p>
          </motion.div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.5rem' }}>
            {categories.map((cat, i) => (
              <motion.div
                key={cat.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -8 }}
              >
                <Link
                  to={`/jobs?category=${cat.name}`}
                  className={`block rounded-2xl transition-all duration-300 ${
                    isDark
                      ? 'hover:border-indigo-500/30'
                      : 'hover:border-indigo-200 hover:shadow-xl hover:shadow-indigo-500/5'
                  }`}
                  style={{
                    padding: '2rem',
                    background: isDark ? 'rgba(255,255,255,0.03)' : '#f9fafb',
                    border: isDark ? '1px solid rgba(255,255,255,0.06)' : '1px solid #f3f4f6',
                  }}
                >
                  <div className={`rounded-2xl bg-gradient-to-br ${cat.color} flex items-center justify-center shadow-lg`} style={{ width: '3.5rem', height: '3.5rem', marginBottom: '1.25rem' }}>
                    <cat.icon className="text-2xl text-white" />
                  </div>
                  <h3 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>{cat.name}</h3>
                  <p className={`text-sm mt-2 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{cat.count} open positions</p>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className={isDark ? 'bg-slate-900/50' : 'bg-gray-50'} style={{ paddingTop: '5rem', paddingBottom: '5rem' }}>
        <div style={{ maxWidth: '80rem', margin: '0 auto', paddingLeft: '2rem', paddingRight: '2rem' }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center"
            style={{ marginBottom: '3rem' }}
          >
            <h2 className="text-3xl md:text-4xl font-bold">
              Why Choose <span className="gradient-text">JobPortal</span>?
            </h2>
            <p className={`mt-4 text-lg ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
              Features designed to make your job search seamless
            </p>
          </motion.div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.5rem' }}>
            {features.map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -5 }}
                className={`rounded-2xl text-center transition-all duration-300 ${
                  isDark
                    ? 'hover:border-indigo-500/20'
                    : 'hover:shadow-xl hover:shadow-indigo-500/5'
                }`}
                style={{
                  padding: '2rem',
                  background: isDark ? 'rgba(255,255,255,0.03)' : '#ffffff',
                  border: isDark ? '1px solid rgba(255,255,255,0.06)' : '1px solid #f3f4f6',
                }}
              >
                <div
                  className={`rounded-2xl flex items-center justify-center mx-auto ${
                    isDark
                      ? 'bg-gradient-to-br from-indigo-500/20 to-cyan-500/20'
                      : 'bg-gradient-to-br from-indigo-50 to-cyan-50 border border-indigo-100/50'
                  }`}
                  style={{ width: '3.5rem', height: '3.5rem', marginBottom: '1.25rem' }}
                >
                  <feature.icon className={`text-2xl ${isDark ? 'text-indigo-400' : 'text-indigo-600'}`} />
                </div>
                <h3 className={`text-lg font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>{feature.title}</h3>
                <p className={`text-sm mt-3 leading-relaxed ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative overflow-hidden" style={{ paddingTop: '5rem', paddingBottom: '5rem' }}>
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-cyan-600" />
        <div className="absolute inset-0">
          <motion.div
            animate={{ y: [0, -20, 0] }}
            transition={{ duration: 5, repeat: Infinity }}
            className="absolute top-10 left-10 w-32 h-32 bg-white/10 rounded-full blur-xl"
          />
          <motion.div
            animate={{ y: [0, 20, 0] }}
            transition={{ duration: 7, repeat: Infinity }}
            className="absolute bottom-10 right-10 w-48 h-48 bg-white/10 rounded-full blur-xl"
          />
        </div>
        <div className="relative text-center" style={{ maxWidth: '56rem', margin: '0 auto', paddingLeft: '2rem', paddingRight: '2rem' }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-5xl font-bold text-white">
              Ready to Start Your Journey?
            </h2>
            <p className="mt-6 text-lg text-white/80 max-w-2xl mx-auto">
              Join thousands of professionals who found their dream job through JobPortal
            </p>
            <div className="flex items-center justify-center" style={{ marginTop: '2.5rem', gap: '1rem', flexWrap: 'wrap' }}>
              <Link
                to="/signup"
                className="px-10 py-4 rounded-2xl bg-white text-indigo-600 font-bold hover:bg-gray-100 transition-colors shadow-xl text-base"
              >
                Get Started Free
              </Link>
              <Link
                to="/jobs"
                className="px-10 py-4 rounded-2xl bg-white/15 text-white font-bold hover:bg-white/25 transition-colors border border-white/25 text-base"
              >
                Browse Jobs
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
