import { useThemeStore } from '../../store/useStore';
import { HiOutlineHeart } from 'react-icons/hi';

export default function Footer() {
  const { isDark } = useThemeStore();

  return (
    <footer className={`border-t ${isDark ? 'bg-slate-900/50 border-white/10' : 'bg-gray-50 border-gray-200'}`}>
      <div style={{ maxWidth: '80rem', margin: '0 auto', paddingLeft: '2rem', paddingRight: '2rem', paddingTop: '3rem', paddingBottom: '3rem' }}>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-1">
            <h3 className={`text-xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Job<span className="gradient-text">Portal</span>
            </h3>
            <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              Your gateway to amazing career opportunities. Find your dream job or hire top talent.
            </p>
          </div>

          <div>
            <h4 className={`font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>For Seekers</h4>
            <ul className={`space-y-2 text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              <li><span className="hover:text-indigo-400 cursor-pointer transition-colors">Browse Jobs</span></li>
              <li><span className="hover:text-indigo-400 cursor-pointer transition-colors">Career Advice</span></li>
              <li><span className="hover:text-indigo-400 cursor-pointer transition-colors">Resume Builder</span></li>
              <li><span className="hover:text-indigo-400 cursor-pointer transition-colors">Salary Guide</span></li>
            </ul>
          </div>

          <div>
            <h4 className={`font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>For Employers</h4>
            <ul className={`space-y-2 text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              <li><span className="hover:text-indigo-400 cursor-pointer transition-colors">Post a Job</span></li>
              <li><span className="hover:text-indigo-400 cursor-pointer transition-colors">Browse Resumes</span></li>
              <li><span className="hover:text-indigo-400 cursor-pointer transition-colors">Recruiting Solutions</span></li>
              <li><span className="hover:text-indigo-400 cursor-pointer transition-colors">Pricing Plans</span></li>
            </ul>
          </div>

          <div>
            <h4 className={`font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>Support</h4>
            <ul className={`space-y-2 text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              <li><span className="hover:text-indigo-400 cursor-pointer transition-colors">Help Center</span></li>
              <li><span className="hover:text-indigo-400 cursor-pointer transition-colors">Privacy Policy</span></li>
              <li><span className="hover:text-indigo-400 cursor-pointer transition-colors">Terms of Service</span></li>
              <li><span className="hover:text-indigo-400 cursor-pointer transition-colors">Contact Us</span></li>
            </ul>
          </div>
        </div>

        <div className={`mt-8 pt-8 border-t ${isDark ? 'border-white/10' : 'border-gray-200'} flex flex-col md:flex-row items-center justify-between gap-4`}>
          <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
            © 2026 JobPortal. All rights reserved.
          </p>
          <p className={`text-sm flex items-center gap-1 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
            Made with <HiOutlineHeart className="text-red-500" /> for job seekers everywhere
          </p>
        </div>
      </div>
    </footer>
  );
}
