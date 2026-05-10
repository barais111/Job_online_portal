import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useThemeStore, useAuthStore } from '../../store/useStore';
import { getJobById, hasApplied, createApplication, isJobSaved, saveJob, unsaveJob } from '../../utils/storage';
import { useState } from 'react';
import toast from 'react-hot-toast';
import {
  HiOutlineLocationMarker,
  HiOutlineBriefcase,
  HiOutlineCurrencyRupee,
  HiOutlineClock,
  HiOutlineHeart,
  HiHeart,
  HiOutlineOfficeBuilding,
  HiOutlineArrowLeft,
  HiOutlineCheckCircle,
  HiOutlineUserGroup,
} from 'react-icons/hi';

export default function JobDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isDark } = useThemeStore();
  const { user, isAuthenticated } = useAuthStore();

  const job = id ? getJobById(id) : undefined;
  const [coverLetter, setCoverLetter] = useState('');
  const [showApplyForm, setShowApplyForm] = useState(false);
  const [applying, setApplying] = useState(false);

  if (!job) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${isDark ? 'bg-slate-950 text-white' : 'bg-gray-50'}`}>
        <div className="text-center">
          <HiOutlineBriefcase className={`text-6xl mx-auto mb-4 ${isDark ? 'text-gray-600' : 'text-gray-300'}`} />
          <h2 className="text-2xl font-bold">Job Not Found</h2>
          <button onClick={() => navigate('/jobs')} className="mt-4 px-6 py-2 rounded-xl btn-gradient text-sm">
            Browse Jobs
          </button>
        </div>
      </div>
    );
  }

  const alreadyApplied = user ? hasApplied(user.id, job.id) : false;
  const saved = user ? isJobSaved(user.id, job.id) : false;

  const handleApply = async () => {
    if (!isAuthenticated || !user) {
      toast.error('Please login to apply');
      navigate('/login');
      return;
    }
    if (user.role !== 'seeker') {
      toast.error('Only job seekers can apply');
      return;
    }
    if (!coverLetter.trim()) {
      toast.error('Please write a cover letter');
      return;
    }

    setApplying(true);
    await new Promise(r => setTimeout(r, 800));

    createApplication({
      jobId: job.id,
      seekerId: user.id,
      employerId: job.employerId,
      coverLetter,
      seekerName: user.name,
      seekerEmail: user.email,
      jobTitle: job.title,
      companyName: job.companyName,
    });

    setApplying(false);
    setShowApplyForm(false);
    toast.success('Application submitted successfully!');
  };

  const handleSave = () => {
    if (!isAuthenticated || !user) {
      toast.error('Please login to save jobs');
      return;
    }
    if (saved) {
      unsaveJob(user.id, job.id);
      toast.success('Removed from saved');
    } else {
      saveJob(user.id, job.id);
      toast.success('Job saved!');
    }
  };

  const formatSalary = (min: number, max: number) => {
    if (min >= 100000) {
      return `₹${(min / 100000).toFixed(1)}L - ₹${(max / 100000).toFixed(1)}L per annum`;
    }
    return `₹${min.toLocaleString()} - ₹${max.toLocaleString()} per month`;
  };

  return (
    <div className={`min-h-screen ${isDark ? 'bg-slate-950 text-white' : 'bg-gray-50 text-gray-900'}`}>
      <div style={{ maxWidth: '64rem', margin: '0 auto', padding: '2rem' }}>
        {/* Back Button */}
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => navigate(-1)}
          className={`flex items-center gap-2 mb-6 text-sm font-medium ${isDark ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-900'} transition-colors`}
        >
          <HiOutlineArrowLeft /> Back to Jobs
        </motion.button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="lg:col-span-2 space-y-6"
          >
            {/* Header */}
            <div className={`p-8 rounded-2xl ${isDark ? 'bg-white/[0.04] border border-white/[0.08]' : 'bg-white border border-gray-200 shadow-sm'}`}>
              <div className="flex items-start gap-5">
                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center flex-shrink-0 ${
                  isDark ? 'bg-gradient-to-br from-indigo-500/20 to-cyan-500/20' : 'bg-gradient-to-br from-indigo-50 to-cyan-50'
                }`}>
                  <HiOutlineOfficeBuilding className={`text-3xl ${isDark ? 'text-indigo-400' : 'text-indigo-600'}`} />
                </div>
                <div className="flex-1">
                  <h1 className="text-2xl md:text-3xl font-bold">{job.title}</h1>
                  <p className={`text-lg mt-1 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{job.companyName}</p>
                </div>
              </div>

              <div className="flex flex-wrap gap-4 mt-6">
                <InfoBadge icon={HiOutlineLocationMarker} label={job.location} isDark={isDark} />
                <InfoBadge icon={HiOutlineBriefcase} label={job.experience} isDark={isDark} />
                <InfoBadge icon={HiOutlineCurrencyRupee} label={formatSalary(job.salaryMin, job.salaryMax)} isDark={isDark} />
                <InfoBadge icon={HiOutlineClock} label={job.type.replace('-', ' ')} isDark={isDark} />
                <InfoBadge icon={HiOutlineUserGroup} label={`${job.applicationsCount} applicants`} isDark={isDark} />
              </div>
            </div>

            {/* Description */}
            <div className={`p-8 rounded-2xl ${isDark ? 'bg-white/[0.04] border border-white/[0.08]' : 'bg-white border border-gray-200 shadow-sm'}`}>
              <h2 className="text-xl font-bold mb-4">Job Description</h2>
              <p className={`leading-relaxed ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                {job.description}
              </p>
            </div>

            {/* Requirements */}
            <div className={`p-8 rounded-2xl ${isDark ? 'bg-white/[0.04] border border-white/[0.08]' : 'bg-white border border-gray-200 shadow-sm'}`}>
              <h2 className="text-xl font-bold mb-4">Requirements</h2>
              <ul className="space-y-3">
                {job.requirements.map((req, i) => (
                  <motion.li
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className={`flex items-start gap-3 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}
                  >
                    <HiOutlineCheckCircle className="text-emerald-500 text-lg mt-0.5 flex-shrink-0" />
                    {req}
                  </motion.li>
                ))}
              </ul>
            </div>

            {/* Skills */}
            <div className={`p-8 rounded-2xl ${isDark ? 'bg-white/[0.04] border border-white/[0.08]' : 'bg-white border border-gray-200 shadow-sm'}`}>
              <h2 className="text-xl font-bold mb-4">Required Skills</h2>
              <div className="flex flex-wrap gap-2">
                {job.skills.map((skill) => (
                  <span
                    key={skill}
                    className={`px-4 py-2 rounded-xl text-sm font-medium ${
                      isDark
                        ? 'bg-indigo-500/10 text-indigo-300 border border-indigo-500/20'
                        : 'bg-indigo-50 text-indigo-600 border border-indigo-100'
                    }`}
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Apply Form */}
            {showApplyForm && !alreadyApplied && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={`p-8 rounded-2xl ${isDark ? 'bg-white/[0.04] border border-white/[0.08]' : 'bg-white border border-gray-200 shadow-sm'}`}
              >
                <h2 className="text-xl font-bold mb-4">Apply for this Position</h2>
                <div>
                  <label className={`text-sm font-medium mb-2 block ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Cover Letter</label>
                  <textarea
                    rows={6}
                    value={coverLetter}
                    onChange={(e) => setCoverLetter(e.target.value)}
                    placeholder="Tell the employer why you're a great fit for this role..."
                    className={`w-full px-4 py-3 rounded-xl text-sm resize-none ${isDark ? 'input-glass' : 'input-light'}`}
                  />
                </div>
                <div className="flex gap-3 mt-4">
                  <motion.button
                    whileTap={{ scale: 0.98 }}
                    onClick={handleApply}
                    disabled={applying}
                    className="px-8 py-3 rounded-xl btn-gradient font-medium text-sm disabled:opacity-50"
                  >
                    {applying ? 'Submitting...' : 'Submit Application'}
                  </motion.button>
                  <button
                    onClick={() => setShowApplyForm(false)}
                    className={`px-6 py-3 rounded-xl text-sm font-medium ${isDark ? 'bg-white/5 text-gray-300' : 'bg-gray-100 text-gray-600'}`}
                  >
                    Cancel
                  </button>
                </div>
              </motion.div>
            )}
          </motion.div>

          {/* Sidebar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-4"
          >
            {/* Action Buttons */}
            <div className={`p-6 rounded-2xl ${isDark ? 'bg-white/[0.04] border border-white/[0.08]' : 'bg-white border border-gray-200 shadow-sm'}`}>
              {alreadyApplied ? (
                <div className="text-center py-2">
                  <HiOutlineCheckCircle className="text-4xl text-emerald-500 mx-auto mb-2" />
                  <p className="text-emerald-500 font-medium">Already Applied</p>
                  <p className={`text-xs mt-1 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                    You've already applied for this job
                  </p>
                </div>
              ) : (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    if (!isAuthenticated) {
                      toast.error('Please login to apply');
                      navigate('/login');
                      return;
                    }
                    setShowApplyForm(true);
                  }}
                  className="w-full py-3.5 rounded-xl btn-gradient font-medium text-sm"
                >
                  Apply Now
                </motion.button>
              )}

              {isAuthenticated && user?.role === 'seeker' && (
                <motion.button
                  whileTap={{ scale: 0.98 }}
                  onClick={handleSave}
                  className={`w-full mt-3 py-3 rounded-xl font-medium text-sm flex items-center justify-center gap-2 transition-colors ${
                    saved
                      ? 'bg-red-500/10 text-red-400 border border-red-500/20'
                      : isDark
                        ? 'bg-white/5 text-gray-300 border border-white/10 hover:bg-white/10'
                        : 'bg-gray-50 text-gray-600 border border-gray-200 hover:bg-gray-100'
                  }`}
                >
                  {saved ? <HiHeart className="text-lg" /> : <HiOutlineHeart className="text-lg" />}
                  {saved ? 'Saved' : 'Save Job'}
                </motion.button>
              )}
            </div>

            {/* Job Info */}
            <div className={`p-6 rounded-2xl ${isDark ? 'bg-white/[0.04] border border-white/[0.08]' : 'bg-white border border-gray-200 shadow-sm'}`}>
              <h3 className="text-lg font-bold mb-4">Job Overview</h3>
              <div className="space-y-4">
                <SidebarItem label="Category" value={job.category} isDark={isDark} />
                <SidebarItem label="Job Type" value={job.type.replace('-', ' ')} isDark={isDark} />
                <SidebarItem label="Experience" value={job.experience} isDark={isDark} />
                <SidebarItem label="Location" value={job.location} isDark={isDark} />
                <SidebarItem label="Salary" value={formatSalary(job.salaryMin, job.salaryMax)} isDark={isDark} />
                <SidebarItem label="Posted" value={new Date(job.postedAt).toLocaleDateString()} isDark={isDark} />
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

function InfoBadge({ icon: Icon, label, isDark }: { icon: typeof HiOutlineLocationMarker; label: string; isDark: boolean }) {
  return (
    <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm ${
      isDark
        ? 'bg-white/5 text-gray-300 border border-white/5'
        : 'bg-gray-50 text-gray-600 border border-gray-100'
    }`}>
      <Icon className={isDark ? 'text-indigo-400' : 'text-indigo-500'} />
      {label}
    </span>
  );
}

function SidebarItem({ label, value, isDark }: { label: string; value: string; isDark: boolean }) {
  return (
    <div>
      <p className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>{label}</p>
      <p className={`text-sm font-medium mt-0.5 capitalize ${isDark ? 'text-gray-200' : 'text-gray-800'}`}>{value}</p>
    </div>
  );
}
