import { motion } from 'framer-motion';

interface ProgressBarProps {
  progress: number;
  className?: string;
  color?: 'indigo' | 'white';
  showLabel?: boolean;
  animate?: boolean;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ 
  progress, 
  className = '', 
  color = 'white',
  showLabel = false,
  animate = true
}) => {
  const bgColor = color === 'white' ? 'bg-white' : 'bg-indigo-500';
  const bgOpacity = color === 'white' ? 'bg-white/20' : 'bg-indigo-100';

  return (
    <div className="relative">
      <div className={`${bgOpacity} rounded-full overflow-hidden ${className}`}>
        <motion.div
          className={`h-full ${bgColor} rounded-full`}
          initial={animate ? { width: '0%' } : { width: `${progress}%` }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
        />
      </div>
      {showLabel && (
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-xs font-medium">
            {Math.round(progress)}%
          </span>
        </div>
      )}
    </div>
  );
};

export default ProgressBar;