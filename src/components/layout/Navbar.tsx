import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { useAuthStore, useThemeStore } from '../../store/useStore';
import {
  HiOutlineBriefcase,
  HiOutlineUser,
  HiOutlineSun,
  HiOutlineMoon,
  HiOutlineMenu,
  HiOutlineX,
  HiOutlineLogout,
  HiOutlineHome,
  HiOutlineViewGrid,
  HiOutlineDocumentText,
  HiOutlineHeart,
  HiOutlineOfficeBuilding,
  HiOutlineUserGroup,
  HiOutlineChartBar,
} from 'react-icons/hi';

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuthStore();
  const { isDark, toggleTheme } = useThemeStore();
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsMobileMenuOpen(false);
  };

  const navLinks = isAuthenticated
    ? user?.role === 'admin'
      ? [
          { to: '/admin', label: 'Dashboard', icon: HiOutlineChartBar },
          { to: '/admin/users', label: 'Users', icon: HiOutlineUserGroup },
          { to: '/admin/jobs', label: 'Jobs', icon: HiOutlineBriefcase },
        ]
      : user?.role === 'employer'
        ? [
            { to: '/employer/dashboard', label: 'Dashboard', icon: HiOutlineViewGrid },
            { to: '/employer/post-job', label: 'Post Job', icon: HiOutlineDocumentText },
            { to: '/employer/applicants', label: 'Applicants', icon: HiOutlineUserGroup },
            { to: '/employer/profile', label: 'Company', icon: HiOutlineOfficeBuilding },
          ]
        : [
            { to: '/jobs', label: 'Find Jobs', icon: HiOutlineBriefcase },
            { to: '/seeker/dashboard', label: 'Dashboard', icon: HiOutlineViewGrid },
            { to: '/seeker/applications', label: 'Applications', icon: HiOutlineDocumentText },
            { to: '/seeker/saved', label: 'Saved', icon: HiOutlineHeart },
            { to: '/seeker/profile', label: 'Profile', icon: HiOutlineUser },
          ]
    : [
        { to: '/', label: 'Home', icon: HiOutlineHome },
        { to: '/jobs', label: 'Find Jobs', icon: HiOutlineBriefcase },
      ];

  return (
    <nav
      className={`sticky top-0 z-50 backdrop-blur-xl border-b transition-colors duration-300 ${
        isDark
          ? 'bg-slate-900/80 border-white/10'
          : 'bg-white/90 border-gray-200/80 shadow-sm'
      }`}
    >
      <div style={{ maxWidth: '80rem', margin: '0 auto', paddingLeft: '2rem', paddingRight: '2rem' }}>
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 flex-shrink-0">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-indigo-500 to-cyan-500 flex items-center justify-center shadow-md">
              <HiOutlineBriefcase className="text-white text-lg" />
            </div>
            <span className={`text-lg font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Job<span className="gradient-text">Portal</span>
            </span>
          </Link>

          {/* Desktop Nav — Center */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.to;
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`relative px-3.5 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-1.5 ${
                    isActive
                      ? isDark ? 'text-white' : 'text-indigo-600'
                      : isDark ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="nav-indicator"
                      className={`absolute inset-0 rounded-lg ${
                        isDark
                          ? 'bg-white/[0.08] border border-white/10'
                          : 'bg-indigo-50 border border-indigo-100'
                      }`}
                      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                    />
                  )}
                  <link.icon className="text-[1.1rem] relative z-10" />
                  <span className="relative z-10">{link.label}</span>
                </Link>
              );
            })}
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-2">
            {/* Theme Toggle */}
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={toggleTheme}
              className={`w-9 h-9 rounded-lg flex items-center justify-center transition-colors ${
                isDark
                  ? 'bg-white/5 hover:bg-white/10 text-yellow-400'
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-600'
              }`}
            >
              <AnimatePresence mode="wait">
                {isDark ? (
                  <motion.div key="sun" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }}>
                    <HiOutlineSun className="text-lg" />
                  </motion.div>
                ) : (
                  <motion.div key="moon" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }}>
                    <HiOutlineMoon className="text-lg" />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>

            {isAuthenticated ? (
              <div className="hidden md:flex items-center gap-2.5">
                <div className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  <span className="font-medium">{user?.name}</span>
                  <span className={`ml-1.5 px-2 py-0.5 rounded-full text-[0.65rem] font-semibold uppercase tracking-wide ${
                    user?.role === 'admin'
                      ? isDark ? 'bg-red-500/20 text-red-400' : 'bg-red-50 text-red-600'
                      : user?.role === 'employer'
                        ? isDark ? 'bg-cyan-500/20 text-cyan-400' : 'bg-cyan-50 text-cyan-600'
                        : isDark ? 'bg-indigo-500/20 text-indigo-400' : 'bg-indigo-50 text-indigo-600'
                  }`}>
                    {user?.role}
                  </span>
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleLogout}
                  className={`w-9 h-9 rounded-lg flex items-center justify-center transition-colors ${
                    isDark
                      ? 'bg-red-500/10 hover:bg-red-500/20 text-red-400'
                      : 'bg-red-50 hover:bg-red-100 text-red-500'
                  }`}
                >
                  <HiOutlineLogout className="text-lg" />
                </motion.button>
              </div>
            ) : (
              <div className="hidden md:flex items-center gap-2">
                <Link
                  to="/login"
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isDark
                      ? 'text-gray-300 hover:text-white hover:bg-white/5'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="px-5 py-2 rounded-lg text-sm font-medium btn-gradient"
                >
                  Sign Up
                </Link>
              </div>
            )}

            {/* Mobile Menu Toggle */}
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className={`md:hidden w-9 h-9 rounded-lg flex items-center justify-center ${
                isDark ? 'bg-white/5 text-white' : 'bg-gray-100 text-gray-600'
              }`}
            >
              {isMobileMenuOpen ? <HiOutlineX className="text-lg" /> : <HiOutlineMenu className="text-lg" />}
            </motion.button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className={`md:hidden border-t overflow-hidden ${
              isDark ? 'border-white/10 bg-slate-900/95' : 'border-gray-200 bg-white/95'
            } backdrop-blur-xl`}
          >
            <div className="px-4 py-3 space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    location.pathname === link.to
                      ? isDark
                        ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20'
                        : 'bg-indigo-50 text-indigo-600 border border-indigo-100'
                      : isDark
                        ? 'text-gray-400 hover:bg-white/5 hover:text-white'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <link.icon className="text-lg" />
                  {link.label}
                </Link>
              ))}

              <div className={`pt-2 mt-2 border-t ${isDark ? 'border-white/10' : 'border-gray-100'}`}>
                {isAuthenticated ? (
                  <button
                    onClick={handleLogout}
                    className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium ${
                      isDark ? 'text-red-400 hover:bg-red-500/10' : 'text-red-500 hover:bg-red-50'
                    }`}
                  >
                    <HiOutlineLogout className="text-lg" />
                    Logout
                  </button>
                ) : (
                  <div className="space-y-2">
                    <Link
                      to="/login"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`block w-full text-center px-4 py-2.5 rounded-lg text-sm font-medium ${
                        isDark ? 'bg-white/5 text-white' : 'bg-gray-100 text-gray-900'
                      }`}
                    >
                      Login
                    </Link>
                    <Link
                      to="/signup"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="block w-full text-center px-4 py-2.5 rounded-lg text-sm font-medium btn-gradient"
                    >
                      Sign Up
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
