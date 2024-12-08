import { motion } from 'framer-motion';
import { ExternalLink, Heart } from 'lucide-react';
import ImageWithFallback from '../ui/ImageWithFallback';

interface ResultCardProps {
  name: string;
  image: string;
  confidence: number;
  label?: 'Exact Match' | 'Recommended' | 'Similar Style';
  labelColor?: 'emerald' | 'blue' | 'purple';
  delay?: number;
}

const ResultCard = ({ 
  name, 
  image, 
  confidence, 
  label = 'Similar Style',
  labelColor = 'blue',
  delay = 0 
}: ResultCardProps) => {
  const labelColors = {
    emerald: 'bg-emerald-500',
    blue: 'bg-blue-500',
    purple: 'bg-purple-500'
  };
  
  return (
    <motion.div
      className="style-match-item group relative bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay }}
    >
      <div className="relative aspect-square overflow-hidden rounded-t-xl">
        <motion.div
           className="absolute inset-0 bg-gradient-to-b from-black/0 via-black/0 to-black/30"
           initial={{ opacity: 0 }}
           whileHover={{ opacity: 1 }}
           transition={{ duration: 0.2 }}
         />
        <ImageWithFallback
          src={image}
          alt={name}
          className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700 ease-out brightness-[1.02] contrast-[1.02] saturate-[1.05]"
          fallbackText="Style preview"
          loadingBlur={true}
        />
        <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: delay + 0.2 }}
            className={`px-2 py-1 ${labelColors[labelColor]} text-white text-xs rounded-full font-medium shadow-lg`}
          >
            {label}
          </motion.div>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-md hover:bg-white transition-all hover:shadow-lg"
          >
            <Heart className="w-4 h-4" />
          </motion.button>
        </div>
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: delay + 0.3 }}
          className="absolute bottom-3 left-3 px-3 py-1.5 bg-black/80 backdrop-blur-sm text-white text-xs rounded-full font-medium shadow-lg"
        >
          {confidence}% match
        </motion.div>
      </div>
      
      <div className="p-4 bg-gradient-to-b from-white to-gray-50 rounded-b-xl">
        <div className="flex items-center justify-between gap-4">
          <motion.h3
            className="font-medium text-gray-900 group-hover:text-black transition-colors"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: delay + 0.2 }}
          >
            {name}
          </motion.h3>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="p-1.5 hover:bg-gray-100 rounded-full transition-colors opacity-0 group-hover:opacity-100"
          >
            <ExternalLink className="w-4 h-4" />
          </motion.button>
        </div>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: delay + 0.4 }}
          className="mt-2 text-sm text-gray-500"
        >
          Click to view details
        </motion.div>
      </div>
    </motion.div>
  );
};

export default ResultCard;