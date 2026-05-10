import { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useThemeStore } from '../../store/useStore';
import { searchJobs } from '../../utils/storage';
import JobCard from '../../components/jobs/JobCard';
import { JobCardSkeleton } from '../../components/ui/Skeleton';
import type { Job } from '../../types';
import {
  HiOutlineSearch,
  HiOutlineLocationMarker,
  HiOutlineFilter,
  HiOutlineX,
  HiOutlineBriefcase,
} from 'react-icons/hi';

const JOB_TYPES = ['full-time', 'part-time', 'contract', 'internship', 'remote'];
const EXPERIENCE_LEVELS = ['0-1 years', '1-3 years', '3-5 years', '5-10 years', '10+ years'];
const CATEGORIES = ['Engineering', 'Design', 'Data Science', 'Management', 'Marketing', 'Sales'];
const ITEMS_PER_PAGE = 6;

export default function JobsListPage() {
  const { isDark } = useThemeStore();
  const [searchParams, setSearchParams] = useSearchParams();

  const [keyword, setKeyword] = useState(searchParams.get('keyword') || '');
  const [location, setLocation] = useState(searchParams.get('location') || '');
  const [type, setType] = useState(searchParams.get('type') || '');
  const [experience, setExperience] = useState(searchParams.get('experience') || '');
  const [category, setCategory] = useState(searchParams.get('category') || '');
  const [salaryMin, setSalaryMin] = useState(searchParams.get('salaryMin') || '');
  const [salaryMax, setSalaryMax] = useState(searchParams.get('salaryMax') || '');
  const [showFilters, setShowFilters] = useState(false);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [refreshKey, setRefreshKey] = useState(0);

  const jobs = useMemo(() => {
    return searchJobs({
      keyword: keyword || undefined,
      location: location || undefined,
      type: type || undefined,
      experience: experience || undefined,
      category: category || undefined,
      salaryMin: salaryMin ? parseInt(salaryMin) : undefined,
      salaryMax: salaryMax ? parseInt(salaryMax) : undefined,
    });
  }, [keyword, location, type, experience, category, salaryMin, salaryMax, refreshKey]);

  const paginatedJobs = jobs.slice(0, page * ITEMS_PER_PAGE);

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => setLoading(false), 600);
    return () => clearTimeout(timer);
  }, [keyword, location, type, experience, category, salaryMin, salaryMax]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    const params = new URLSearchParams();
    if (keyword) params.set('keyword', keyword);
    if (location) params.set('location', location);
    if (type) params.set('type', type);
    if (experience) params.set('experience', experience);
    if (category) params.set('category', category);
    setSearchParams(params);
  };

  const clearFilters = () => {
    setKeyword('');
    setLocation('');
    setType('');
    setExperience('');
    setCategory('');
    setSalaryMin('');
    setSalaryMax('');
    setSearchParams({});
    setPage(1);
  };

  const hasActiveFilters = keyword || location || type || experience || category || salaryMin || salaryMax;

  return (
    <div className={`min-h-screen ${isDark ? 'bg-slate-950 text-white' : 'bg-gray-50 text-gray-900'}`}>
      {/* Hero Search */}
      <div className="relative overflow-hidden">
        <div className={`absolute inset-0 ${isDark ? 'bg-gradient-to-br from-indigo-600/20 to-cyan-600/10' : 'bg-gradient-to-br from-indigo-600 via-purple-600 to-cyan-500'}`} />
        <div className="relative" style={{ maxWidth: '76rem', margin: '0 auto', padding: '3rem 2rem 3.5rem 2rem' }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className={`text-3xl md:text-4xl font-bold ${isDark ? 'text-white' : 'text-white'}`}>
              Find Your <span className={isDark ? 'gradient-text' : 'text-yellow-300'}>Perfect Job</span>
            </h1>
            <p className={isDark ? 'text-gray-400' : 'text-white/75'} style={{ marginTop: '0.625rem', fontSize: '1rem' }}>
              {jobs.length} jobs found
            </p>
          </motion.div>

          {/* Search Bar */}
          <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            onSubmit={handleSearch}
            style={{ marginTop: '1.75rem' }}
          >
            <div className={`flex flex-col md:flex-row items-stretch gap-3 rounded-2xl backdrop-blur-xl ${
              isDark
                ? 'border border-white/15 shadow-lg shadow-indigo-500/10'
                : 'border border-white/30 shadow-lg shadow-black/10'
            }`}
            style={{ padding: '0.875rem', background: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.2)' }}
            >
              <div className="flex-1 flex items-center gap-3 rounded-xl" style={{ padding: '0.875rem 1.25rem', background: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(255,255,255,0.3)' }}>
                <HiOutlineSearch className={`text-lg flex-shrink-0 ${isDark ? 'text-gray-400' : 'text-white/70'}`} />
                <input
                  type="text"
                  placeholder="Job title, skills, or company..."
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  className={`w-full bg-transparent outline-none text-sm ${isDark ? 'text-white placeholder-gray-500' : 'text-white placeholder-white/60'}`}
                />
              </div>
              <div className="flex-1 flex items-center gap-3 rounded-xl" style={{ padding: '0.875rem 1.25rem', background: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(255,255,255,0.3)' }}>
                <HiOutlineLocationMarker className={`text-lg flex-shrink-0 ${isDark ? 'text-gray-400' : 'text-white/70'}`} />
                <input
                  type="text"
                  placeholder="Location..."
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className={`w-full bg-transparent outline-none text-sm ${isDark ? 'text-white placeholder-gray-500' : 'text-white placeholder-white/60'}`}
                />
              </div>
              <div className="flex gap-2">
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  type="button"
                  onClick={() => setShowFilters(!showFilters)}
                  className={`px-4 py-3 rounded-xl text-sm font-medium flex items-center gap-2 ${
                    isDark
                      ? 'bg-white/5 hover:bg-white/10 text-gray-300'
                      : 'bg-white/25 hover:bg-white/35 text-white'
                  }`}
                >
                  <HiOutlineFilter className="text-base" />
                  Filters
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  className={`px-8 py-3 rounded-xl font-semibold text-sm whitespace-nowrap shadow-lg ${
                    isDark ? 'btn-gradient' : 'bg-white text-indigo-600 hover:bg-gray-50'
                  }`}
                >
                  Search
                </motion.button>
              </div>
            </div>
          </motion.form>

          {/* Filters Panel */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <div className={`mt-4 p-6 rounded-2xl grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 ${
                  isDark ? 'bg-white/[0.03] border border-white/[0.06]' : 'bg-white/90 border border-white/40 shadow-lg backdrop-blur-xl'
                }`}>
                  <div>
                    <label className={`text-xs font-semibold mb-2 block uppercase tracking-wide ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Job Type</label>
                    <select value={type} onChange={(e) => setType(e.target.value)} className={`w-full px-4 py-3 rounded-xl text-sm ${isDark ? 'input-glass' : 'input-light'}`}>
                      <option value="">All Types</option>
                      {JOB_TYPES.map(t => (
                        <option key={t} value={t}>{t.replace('-', ' ')}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className={`text-xs font-semibold mb-2 block uppercase tracking-wide ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Experience</label>
                    <select value={experience} onChange={(e) => setExperience(e.target.value)} className={`w-full px-4 py-3 rounded-xl text-sm ${isDark ? 'input-glass' : 'input-light'}`}>
                      <option value="">All Levels</option>
                      {EXPERIENCE_LEVELS.map(e => (
                        <option key={e} value={e}>{e}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className={`text-xs font-semibold mb-2 block uppercase tracking-wide ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Category</label>
                    <select value={category} onChange={(e) => setCategory(e.target.value)} className={`w-full px-4 py-3 rounded-xl text-sm ${isDark ? 'input-glass' : 'input-light'}`}>
                      <option value="">All Categories</option>
                      {CATEGORIES.map(c => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className={`text-xs font-semibold mb-2 block uppercase tracking-wide ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Salary Range (₹)</label>
                    <div className="flex gap-2">
                      <input
                        type="number"
                        placeholder="Min"
                        value={salaryMin}
                        onChange={(e) => setSalaryMin(e.target.value)}
                        className={`w-1/2 px-3 py-3 rounded-xl text-sm ${isDark ? 'input-glass' : 'input-light'}`}
                      />
                      <input
                        type="number"
                        placeholder="Max"
                        value={salaryMax}
                        onChange={(e) => setSalaryMax(e.target.value)}
                        className={`w-1/2 px-3 py-3 rounded-xl text-sm ${isDark ? 'input-glass' : 'input-light'}`}
                      />
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Active Filters */}
          {hasActiveFilters && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-4 flex flex-wrap items-center gap-2"
            >
              <span className={`text-xs ${isDark ? 'text-gray-400' : 'text-white/70'}`}>Active filters:</span>
              {keyword && <FilterTag label={`"${keyword}"`} onRemove={() => setKeyword('')} isDark={isDark} />}
              {location && <FilterTag label={location} onRemove={() => setLocation('')} isDark={isDark} />}
              {type && <FilterTag label={type} onRemove={() => setType('')} isDark={isDark} />}
              {experience && <FilterTag label={experience} onRemove={() => setExperience('')} isDark={isDark} />}
              {category && <FilterTag label={category} onRemove={() => setCategory('')} isDark={isDark} />}
              <button onClick={clearFilters} className={`text-xs font-medium ${isDark ? 'text-red-400 hover:text-red-300' : 'text-white/80 hover:text-white underline'}`}>
                Clear all
              </button>
            </motion.div>
          )}
        </div>
      </div>

      {/* Jobs List */}
      <div style={{ maxWidth: '76rem', margin: '0 auto', padding: '2.5rem 2rem 3rem 2rem' }}>
        {loading ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1.5rem' }}>
            {Array.from({ length: 4 }).map((_, i) => (
              <JobCardSkeleton key={i} />
            ))}
          </div>
        ) : jobs.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-24"
          >
            <HiOutlineBriefcase className={`text-6xl mx-auto mb-4 ${isDark ? 'text-gray-600' : 'text-gray-300'}`} />
            <h3 className={`text-xl font-semibold ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>No jobs found</h3>
            <p className={`mt-2 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>Try adjusting your search filters</p>
            <button onClick={clearFilters} className="mt-6 px-6 py-2.5 rounded-xl btn-gradient text-sm font-medium">
              Clear Filters
            </button>
          </motion.div>
        ) : (
          <>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1.5rem' }}>
              <AnimatePresence>
                {paginatedJobs.map((job: Job, i: number) => (
                  <JobCard key={job.id} job={job} index={i} onSaveToggle={() => setRefreshKey(k => k + 1)} />
                ))}
              </AnimatePresence>
            </div>

            {/* Load More */}
            {page * ITEMS_PER_PAGE < jobs.length && (
              <div className="text-center mt-12">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setPage(p => p + 1)}
                  className={`px-8 py-3 rounded-xl font-medium text-sm ${
                    isDark
                      ? 'bg-white/5 hover:bg-white/10 text-gray-300 border border-white/10'
                      : 'bg-white hover:bg-gray-50 text-gray-700 border border-gray-200 shadow-sm'
                  }`}
                >
                  Load More ({jobs.length - page * ITEMS_PER_PAGE} remaining)
                </motion.button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

function FilterTag({ label, onRemove, isDark }: { label: string; onRemove: () => void; isDark: boolean }) {
  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${
      isDark
        ? 'bg-indigo-500/15 text-indigo-300 border border-indigo-500/20'
        : 'bg-white/20 text-white border border-white/30'
    }`}>
      {label}
      <button onClick={onRemove}><HiOutlineX className="text-sm" /></button>
    </span>
  );
}
