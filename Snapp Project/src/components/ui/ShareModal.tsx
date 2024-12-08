import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Link, Share2, Copy, Check } from 'lucide-react';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  matches: Array<{
    id: number;
    name: string;
    price: number;
    image: string;
  }>;
}

const ShareModal: React.FC<ShareModalProps> = ({ isOpen, onClose, matches }) => {
  const [copied, setCopied] = React.useState(false);
  const [shared, setShared] = React.useState(false);

  const shareUrl = window.location.href;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Snapp Fashion Finds',
          text: `Check out these similar styles I found!\n\n${matches
            .map(m => `${m.name} - $${m.price}`)
            .join('\n')}`,
          url: shareUrl
        });
        setShared(true);
        setTimeout(() => setShared(false), 2000);
      } catch (err) {
        if (err instanceof Error && err.name !== 'AbortError') {
          console.error('Error sharing:', err);
        }
      }
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
          />
          <div className="fixed inset-0 flex items-center justify-center p-4 z-50">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-xl shadow-xl max-w-md w-full overflow-hidden"
            >
              <div className="p-4 border-b flex items-center justify-between">
                <h2 className="text-lg font-medium">Share Results</h2>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-4">
                <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg mb-4">
                  <Link className="w-5 h-5 text-gray-500" />
                  <span className="text-sm text-gray-600 truncate flex-1">
                    {shareUrl}
                  </span>
                  <button
                    onClick={handleCopy}
                    className="p-2 hover:bg-gray-200 rounded-full transition-colors relative"
                  >
                    <AnimatePresence>
                      {copied ? (
                        <motion.div
                          initial={{ scale: 0.8, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          exit={{ scale: 0.8, opacity: 0 }}
                        >
                          <Check className="w-4 h-4 text-green-600" />
                        </motion.div>
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </AnimatePresence>
                  </button>
                </div>

                {navigator.share && (
                  <button
                    onClick={handleShare}
                    className="w-full py-3 px-4 bg-black text-white rounded-lg hover:bg-gray-900 transition-colors flex items-center justify-center gap-2"
                  >
                    <Share2 className="w-5 h-5" />
                    {shared ? 'Shared!' : 'Share'}
                  </button>
                )}
              </div>

              {matches.length > 0 && (
                <div className="px-4 pb-4">
                  <h3 className="text-sm font-medium text-gray-900 mb-3">
                    Included Items
                  </h3>
                  <div className="grid grid-cols-4 gap-2">
                    {matches.map((match) => (
                      <div
                        key={match.id}
                        className="aspect-square rounded-md overflow-hidden relative group"
                      >
                        <img
                          src={match.image}
                          alt={match.name}
                          className="w-full h-full object-cover image-enhancement"
                        />
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <span className="text-white text-xs px-2 text-center">
                            ${match.price}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};