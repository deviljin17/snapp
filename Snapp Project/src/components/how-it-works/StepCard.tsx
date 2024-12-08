import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';
import IconWrapper from '../ui/IconWrapper';

interface StepCardProps {
  number: number;
  title: string;
  description: string;
  icon: LucideIcon;
  delay?: number;
}

const StepCard = ({ number, title, description, icon: Icon, delay = 0 }: StepCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
      className="relative group"
    >
      <div className="absolute -inset-4 bg-gradient-to-b from-indigo-50/50 to-transparent rounded-2xl transform -rotate-2 group-hover:rotate-0 transition-transform" />
      <div className="relative p-6 text-center">
        <div className="mb-8 relative">
          <IconWrapper icon={Icon} size="md" />
          <div className="absolute -top-2 -right-2 w-6 h-6 bg-indigo-600 rounded-full text-white text-sm flex items-center justify-center">
            {number}
          </div>
        </div>
        <h3 className="text-xl font-semibold mb-2 text-gray-900">{title}</h3>
        <p className="text-gray-600">{description}</p>
      </div>
    </motion.div>
  );
};

export default StepCard;