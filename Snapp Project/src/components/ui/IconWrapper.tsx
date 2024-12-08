import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/utils/cn';

interface IconWrapperProps {
  icon: LucideIcon;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const sizeMap = {
  sm: 'w-12 h-12 p-2.5',
  md: 'w-16 h-16 p-3.5',
  lg: 'w-20 h-20 p-4'
};

const IconWrapper = ({ icon: Icon, size = 'md', className }: IconWrapperProps) => {
  return (
    <div className="relative group">
      <motion.div
        className="absolute inset-0 bg-indigo-100 rounded-full transform -rotate-6 group-hover:rotate-0 transition-transform duration-300"
        whileHover={{ scale: 1.1 }}
      />
      <div className={cn(
        'relative bg-white rounded-full flex items-center justify-center shadow-sm ring-1 ring-black/5 transition-transform duration-300',
        sizeMap[size],
        className
      )}>
        <Icon className="w-full h-full text-indigo-600" />
      </div>
    </div>
  );
};

export default IconWrapper;