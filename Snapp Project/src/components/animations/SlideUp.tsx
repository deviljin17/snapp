import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface SlideUpProps {
  children: ReactNode;
  delay?: number;
  duration?: number;
  className?: string;
}

export const SlideUp = ({ children, delay = 0, duration = 0.6, className = '' }: SlideUpProps) => (
  <motion.div
    initial={{ y: 50, opacity: 0 }}
    animate={{ y: 0, opacity: 1 }}
    transition={{ duration, delay, ease: "easeOut" }}
    className={className}
  >
    {children}
  </motion.div>
);