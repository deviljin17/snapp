import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';
import IconWrapper from '../ui/IconWrapper';

export interface FeatureCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  number: number;
  delay?: number;
}

export default function FeatureCard({ title, description, icon: Icon, number, delay = 0 }: FeatureCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay }}
      className="relative group z-10"
    >
      <motion.div
        className="absolute inset-0 bg-gradient-to-b from-indigo-50/50 to-white/50 rounded-2xl"
        animate={{ rotate: [-1, 0] }}
        whileHover={{ rotate: 0, scale: 1.02 }}
        transition={{ duration: 0.4 }}
      />
      <div className="relative p-8 text-center">
        <div className="relative mb-8">
          <motion.div
            whileHover={{ scale: 1.1, rotate: [0, -5, 5, 0] }}
            transition={{ duration: 0.4, type: "spring" }}
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
        <motion.h3
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: delay + 0.3 }}
          className="text-xl font-semibold mb-3 text-gray-900"
        >
          {title}
        </motion.h3>
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: delay + 0.4 }}
          className="text-gray-600 leading-relaxed"
        >
          {description}
        </motion.p>
      </div>
    </motion.div>
  );
}