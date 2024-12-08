import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';

interface FeatureProps {
  title: string;
  description: string;
  icon: LucideIcon;
  index: number;
}

export default function Feature({ title, description, icon: Icon, index }: FeatureProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.2 }}
      className="relative group"
    >
      <div className="absolute inset-0 bg-gradient-to-b from-indigo-50/50 to-white/50 rounded-2xl transform -rotate-1 group-hover:rotate-0 transition-transform" />
      <div className="relative p-8">
        <div className="mb-6 relative">
          <div className="absolute inset-0 bg-indigo-100 rounded-full transform -rotate-6 group-hover:rotate-0 transition-transform" />
          <div className="relative w-16 h-16 mx-auto bg-white rounded-full flex items-center justify-center shadow-sm">
            <Icon className="w-8 h-8 text-indigo-600" />
          </div>
        </div>
        <h3 className="text-xl font-semibold mb-3 text-gray-900">{title}</h3>
        <p className="text-gray-600 leading-relaxed">{description}</p>
      </div>
    </motion.div>
  );
}