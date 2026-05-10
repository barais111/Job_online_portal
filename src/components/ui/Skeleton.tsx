import { motion } from 'framer-motion';
import { useThemeStore } from '../../store/useStore';

interface SkeletonProps {
  className?: string;
  count?: number;
}

export default function Skeleton({ className = '', count = 1 }: SkeletonProps) {
  const { isDark } = useThemeStore();

  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className={`${isDark ? 'skeleton' : 'skeleton-light'} ${className}`}
        />
      ))}
    </>
  );
}

export function JobCardSkeleton() {
  const { isDark } = useThemeStore();
  const skeletonClass = isDark ? 'skeleton' : 'skeleton-light';

  return (
    <div className={`rounded-2xl p-6 ${isDark ? 'bg-white/5 border border-white/10' : 'bg-white border border-gray-200'}`}>
      <div className="flex items-start gap-4">
        <div className={`w-14 h-14 rounded-xl ${skeletonClass}`} />
        <div className="flex-1 space-y-3">
          <div className={`h-5 w-3/4 ${skeletonClass}`} />
          <div className={`h-4 w-1/2 ${skeletonClass}`} />
        </div>
      </div>
      <div className="mt-4 space-y-2">
        <div className={`h-4 w-full ${skeletonClass}`} />
        <div className={`h-4 w-5/6 ${skeletonClass}`} />
      </div>
      <div className="mt-4 flex gap-2">
        <div className={`h-8 w-20 rounded-full ${skeletonClass}`} />
        <div className={`h-8 w-24 rounded-full ${skeletonClass}`} />
        <div className={`h-8 w-16 rounded-full ${skeletonClass}`} />
      </div>
      <div className="mt-4 flex justify-between items-center">
        <div className={`h-5 w-28 ${skeletonClass}`} />
        <div className={`h-10 w-24 rounded-xl ${skeletonClass}`} />
      </div>
    </div>
  );
}

export function DashboardSkeleton() {
  const { isDark } = useThemeStore();
  const skeletonClass = isDark ? 'skeleton' : 'skeleton-light';

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className={`rounded-2xl p-6 ${isDark ? 'bg-white/5 border border-white/10' : 'bg-white border border-gray-200'}`}>
            <div className={`h-4 w-24 mb-4 ${skeletonClass}`} />
            <div className={`h-8 w-16 ${skeletonClass}`} />
          </div>
        ))}
      </div>
      <div className={`rounded-2xl p-6 ${isDark ? 'bg-white/5 border border-white/10' : 'bg-white border border-gray-200'}`}>
        <div className={`h-6 w-48 mb-6 ${skeletonClass}`} />
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className={`h-20 w-full ${skeletonClass}`} />
          ))}
        </div>
      </div>
    </div>
  );
}
