import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface CardProps {
  title: string;
  additionalText?: string;
  children?: ReactNode;
  className?: string;
}

export default function Card({ title, additionalText, children, className = '' }: CardProps) {
  return (
    <div className={`overflow-hidden rounded-lg bg-white shadow-sm hover:shadow-md transition-shadow ${className}`}>
      <div className="relative">
        {children}
      </div>
      <div className="p-4 bg-gradient-to-b from-white to-gray-50 flex items-center justify-between gap-4">
        <motion.h3
          className="font-medium text-gray-900 group-hover:text-black transition-colors"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          {title}
        </motion.h3>
        {additionalText && (
          <span className="text-sm text-gray-500">
            {additionalText}
          </span>
        )}
      </div>
    </div>
  );
}