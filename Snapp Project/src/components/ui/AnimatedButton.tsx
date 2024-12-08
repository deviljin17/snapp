import { motion } from 'framer-motion';
import { ReactNode } from 'react';
import { cn } from '@/utils/cn';

interface AnimatedButtonProps {
  onClick?: () => void;
  children: ReactNode;
  className?: string;
  variant?: 'default' | 'outline';
  size?: 'sm' | 'md' | 'lg';
}

const AnimatedButton = ({
  onClick,
  children,
  className = '',
  variant = 'default',
  size = 'md'
}: AnimatedButtonProps) => {
  const baseStyles = 'inline-flex items-center justify-center font-medium relative rounded-full transition-all duration-300';
  
  const variants = {
    default: 'bg-black text-white hover:bg-gray-900 shadow-md hover:shadow-xl',
    outline: 'border-2 border-black text-black hover:bg-black hover:text-white'
  };
  
  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3',
    lg: 'px-8 py-4 text-lg'
  };

  return (
    <motion.button
      onClick={onClick}
      whileHover={{ scale: 1.05, y: -2 }}
      whileTap={{ scale: 0.95 }}
      initial={false}
      className={cn(
        baseStyles,
        variants[variant],
        sizes[size],
        className
      )}
    >
      <motion.div
        className="absolute inset-0 rounded-full bg-gradient-to-r from-indigo-600/20 to-blue-600/20 opacity-0 transition-opacity duration-300"
        whileHover={{ opacity: 1, scale: 1.1 }}
        animate={{ 
          background: [
            "radial-gradient(circle at 0% 0%, rgba(99, 102, 241, 0.15) 0%, transparent 50%)",
            "radial-gradient(circle at 100% 100%, rgba(99, 102, 241, 0.15) 0%, transparent 50%)"
          ]
        }}
        transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
      />
      <span className="relative z-10">
      {children}
      </span>
    </motion.button>
  );
};

export default AnimatedButton;