import { useState } from 'react';
import { motion } from 'framer-motion';
import { useThemeStore } from '../../store/useStore';
import { getUsers, deleteUser } from '../../utils/storage';
import toast from 'react-hot-toast';
import {
  HiOutlineTrash,
  HiOutlineSearch,
  HiOutlineMail,
  HiOutlineLocationMarker,
} from 'react-icons/hi';

export default function AdminUsers() {
  const { isDark } = useThemeStore();
  const [refreshKey, setRefreshKey] = useState(0);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');

  let users = getUsers();

  if (search) {
    const s = search.toLowerCase();
    users = users.filter(u => u.name.toLowerCase().includes(s) || u.email.toLowerCase().includes(s));
  }
  if (roleFilter !== 'all') {
    users = users.filter(u => u.role === roleFilter);
  }

  const handleDelete = (id: string, name: string) => {
    if (confirm(`Are you sure you want to delete ${name}?`)) {
      deleteUser(id);
      setRefreshKey(k => k + 1);
      toast.success('User deleted');
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin': return 'bg-red-500/15 text-red-400 border-red-500/20';
      case 'employer': return 'bg-cyan-500/15 text-cyan-400 border-cyan-500/20';
      case 'seeker': return 'bg-indigo-500/15 text-indigo-400 border-indigo-500/20';
      default: return 'bg-gray-500/15 text-gray-400 border-gray-500/20';
    }
  };

  return (
    <div className={`min-h-screen ${isDark ? 'bg-slate-950 text-white' : 'bg-gray-50 text-gray-900'}`} key={refreshKey}>
      <div style={{ maxWidth: '72rem', margin: '0 auto', padding: '2.5rem 2rem' }}>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ marginBottom: '2rem' }}
        >
          <h1 className="text-3xl font-bold" style={{ marginBottom: '0.5rem' }}>
            Manage <span className="gradient-text">Users</span>
          </h1>
          <p className={isDark ? 'text-gray-400' : 'text-gray-600'} style={{ fontSize: '1rem' }}>
            {users.length} users found
          </p>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          style={{ display: 'flex', gap: '0.875rem', marginBottom: '2rem', alignItems: 'stretch' }}
        >
          <div
            className={isDark ? 'bg-white/[0.04] border border-white/[0.08]' : 'bg-white border border-gray-200'}
            style={{
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              padding: '0.875rem 1.25rem',
              borderRadius: '0.75rem',
            }}
          >
            <HiOutlineSearch className={isDark ? 'text-gray-400' : 'text-gray-500'} style={{ fontSize: '1.125rem', flexShrink: 0 }} />
            <input
              type="text"
              placeholder="Search users..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className={`w-full bg-transparent outline-none text-sm ${isDark ? 'text-white placeholder-gray-500' : 'text-gray-900 placeholder-gray-400'}`}
            />
          </div>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            {['all', 'seeker', 'employer', 'admin'].map((role) => (
              <button
                key={role}
                onClick={() => setRoleFilter(role)}
                className={roleFilter === role
                  ? 'bg-gradient-to-r from-indigo-500/20 to-cyan-500/20 text-indigo-400 border border-indigo-500/30'
                  : isDark ? 'bg-white/5 text-gray-400 border border-white/5' : 'bg-white text-gray-500 border border-gray-200'
                }
                style={{
                  padding: '0.625rem 1rem',
                  borderRadius: '0.75rem',
                  fontSize: '0.875rem',
                  fontWeight: 500,
                  textTransform: 'capitalize',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
              >
                {role}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Users List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
          {users.map((u, i) => (
            <motion.div
              key={u.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.03 }}
              className={isDark ? 'bg-white/[0.04] border border-white/[0.08]' : 'bg-white border border-gray-200 shadow-sm'}
              style={{
                padding: '1.5rem 1.75rem',
                borderRadius: '1rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div
                  style={{
                    width: '3rem',
                    height: '3rem',
                    borderRadius: '0.75rem',
                    background: 'linear-gradient(135deg, #6366f1, #06b6d4)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontWeight: 700,
                    flexShrink: 0,
                  }}
                >
                  {u.name.charAt(0)}
                </div>
                <div>
                  <h3 style={{ fontWeight: 600, fontSize: '1rem', marginBottom: '0.25rem' }}>{u.name}</h3>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <span
                      className={isDark ? 'text-gray-400' : 'text-gray-500'}
                      style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.8rem' }}
                    >
                      <HiOutlineMail /> {u.email}
                    </span>
                    {u.location && (
                      <span
                        className={isDark ? 'text-gray-500' : 'text-gray-400'}
                        style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.8rem' }}
                      >
                        <HiOutlineLocationMarker /> {u.location}
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <span
                  className={getRoleColor(u.role)}
                  style={{ padding: '0.3rem 0.875rem', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: 500, border: '1px solid' }}
                >
                  {u.role}
                </span>
                {u.role !== 'admin' && (
                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={() => handleDelete(u.id, u.name)}
                    className="bg-red-500/10 text-red-400 hover:bg-red-500/20"
                    style={{ padding: '0.5rem', borderRadius: '0.5rem', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                  >
                    <HiOutlineTrash />
                  </motion.button>
                )}
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </div>
  );
}
