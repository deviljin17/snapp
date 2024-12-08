import { Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import React from 'react';
import { cn } from '@/utils/cn';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  color?: 'white' | 'black' | 'indigo';
  className?: string;
  centered?: boolean;
}

const sizeMap = {
  sm: 'w-4 h-4',
  md: 'w-8 h-8',
  lg: 'w-12 h-12'
};

const colorMap = {
  white: 'text-white',
  black: 'text-black',
  indigo: 'text-indigo-600'
};

export default function LoadingSpinner({
  size = 'md',
  color = 'black',
  className,
  centered = false
}: LoadingSpinnerProps) {
  const Wrapper = centered ? CenteredWrapper : React.Fragment;

  return (
    <Wrapper>
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ 
          duration: 1.2,
          repeat: Infinity,
          ease: "linear",
          repeatType: "loop"
        }}
        className={cn(sizeMap[size], colorMap[color], className)}
      >
        <Loader2 className="w-full h-full" />
      </motion.div>
    </Wrapper>
  );
}

const CenteredWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="flex items-center justify-center min-h-[200px]">
    {children}
  </div>
);