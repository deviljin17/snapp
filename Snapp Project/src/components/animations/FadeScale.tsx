import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface FadeScaleProps {
  children: ReactNode;
  delay?: number;
  duration?: number;
}

export const FadeScale = ({ children, delay = 0, duration = 0.5 }: FadeScaleProps) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration, delay }}
  >
    {children}
  </motion.div>
);