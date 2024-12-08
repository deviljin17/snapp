import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';
import IconWrapper from '../ui/IconWrapper';

interface TimelineStepProps {
  number: number;
  title: string;
  description: string;
  icon: LucideIcon;
  isLast?: boolean;
  delay?: number;
}

const TimelineStep = ({ number, title, description, icon: Icon, isLast, delay = 0 }: TimelineStepProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
      className="relative group"
    >
      {/* Connecting Line */}
      {!isLast && (
        <div className="absolute left-[2.4rem] top-24 bottom-0 w-0.5 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-indigo-200/50 to-transparent" />
          <motion.div
            className="absolute inset-0 bg-gradient-to-b from-indigo-500 to-indigo-400"
            initial={{ scaleY: 0, opacity: 0 }}
            whileInView={{ scaleY: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: delay + 0.3, ease: "easeOut" }}
            style={{ transformOrigin: 'top' }}
          />
          <motion.div
            className="absolute inset-0 bg-indigo-400/50"
            animate={{ 
              y: ["0%", "100%"],
              opacity: [0, 1, 0]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "linear",
              delay: delay + 1
            }}
          />
        </div>
      )}

      <div className="relative flex gap-8">
        {/* Icon with Number */}
        <div className="relative">
          <motion.div
            whileHover={{ scale: 1.1, rotate: [0, -5, 5, 0] }}
            transition={{ duration: 0.3 }}
          >
            <IconWrapper icon={Icon} size="md" className="group-hover:shadow-lg transition-shadow" />
          </motion.div>
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: delay + 0.2, type: "spring" }}
            className="absolute -top-1 -right-1 w-6 h-6 bg-indigo-600 rounded-full text-white text-sm flex items-center justify-center font-medium shadow-md"
          >
            {number}
          </motion.div>
        </div>

        {/* Content */}
        <div className="flex-1 pt-2 group-hover:translate-x-1 transition-transform">
          <motion.h3
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: delay + 0.4 }}
            className="text-xl font-semibold mb-3 text-gray-900"
          >
            {title}
          </motion.h3>
          <motion.p
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: delay + 0.5 }}
            className="text-gray-600"
          >
            {description}
          </motion.p>
        </div>
      </div>
    </motion.div>
  );
};

export default TimelineStep;