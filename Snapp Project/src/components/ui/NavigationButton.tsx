import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';

interface NavigationButtonProps {
  onClick: () => void;
  label?: string;
}

const NavigationButton: React.FC<NavigationButtonProps> = ({ 
  onClick, 
  label = 'Back' 
}) => {
  return (
    <motion.button
      onClick={onClick}
      whileHover={{ x: -2 }}
      whileTap={{ scale: 0.95 }}
      className="group flex items-center gap-2 p-2 hover:bg-white/10 rounded-full transition-colors"
      aria-label={label}
    >
      <ArrowLeft className="w-6 h-6 text-white" />
      <span className="sr-only">{label}</span>
    </motion.button>
  );
};

export default NavigationButton;