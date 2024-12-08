import React from 'react';
import { Share2 } from 'lucide-react';
import { shareResults } from '@/utils/share';
import { motion, AnimatePresence } from 'framer-motion';

interface ShareButtonProps {
  matches: any[];
}

const ShareButton: React.FC<ShareButtonProps> = ({ matches }) => {
  const [showSuccess, setShowSuccess] = React.useState(false);

  const handleShare = async () => {
    const success = await shareResults(matches);
    if (success) {
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 2000);
    }
  };

  return (
    <div className="relative">
      <button
        onClick={handleShare}
        className="p-2 hover:bg-gray-100 rounded-full transition-colors relative"
      >
        <Share2 className="w-5 h-5" />
      </button>

      <AnimatePresence>
        {showSuccess && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="absolute bottom-full right-0 mb-2 whitespace-nowrap px-3 py-1 bg-black text-white text-sm rounded-full"
          >
            Shared successfully!
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ShareButton;