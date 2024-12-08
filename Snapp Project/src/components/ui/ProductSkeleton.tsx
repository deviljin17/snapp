import { motion } from 'framer-motion';

export default function ProductSkeleton() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1 }}
      className="animate-pulse"
    >
      <div className="aspect-square bg-gray-200 rounded-lg mb-3 overflow-hidden">
        <motion.div
          className="w-full h-full bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200"
          animate={{
            x: ['-100%', '100%'],
            opacity: [1, 0.5, 1]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "linear"
          }}
        />
      </div>
      <div className="space-y-2">
        <motion.div 
          className="h-4 bg-gray-200 rounded w-3/4"
          animate={{ opacity: [0.5, 0.7, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        />
        <motion.div 
          className="h-3 bg-gray-200 rounded w-1/2"
          animate={{ opacity: [0.5, 0.7, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity, delay: 0.2 }}
        />
        <motion.div 
          className="h-4 bg-gray-200 rounded w-1/4"
          animate={{ opacity: [0.5, 0.7, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity, delay: 0.4 }}
        />
      </div>
    </motion.div>
  );
}