import React, { useState } from 'react';
import { Share2, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FacebookShareButton,
  TwitterShareButton,
  PinterestShareButton,
  WhatsappShareButton,
  EmailShareButton,
  FacebookIcon,
  TwitterIcon,
  PinterestIcon,
  WhatsappIcon,
  EmailIcon
} from 'react-share';
import { generateShareableLink } from '@/utils/sharing';

interface ShareButtonProps {
  title: string;
  description: string;
  imageUrl?: string;
  matches?: Array<{
    id: string;
    name: string;
    price: number;
    imageUrl: string;
  }>;
}

export default function ShareButton({ title, description, imageUrl, matches }: ShareButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [shareUrl, setShareUrl] = useState('');
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    try {
      const url = await generateShareableLink({
        title,
        description,
        imageUrl,
        matches
      });
      setShareUrl(url);
      setIsOpen(true);
    } catch (error) {
      console.error('Failed to generate share link:', error);
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  return (
    <>
      <button
        onClick={handleShare}
        className="p-2 hover:bg-gray-100 rounded-full transition-colors"
        aria-label="Share"
      >
        <Share2 className="w-5 h-5" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-white rounded-xl shadow-xl z-50 p-6"
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-medium">Share</h3>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex justify-center space-x-4 mb-6">
                <FacebookShareButton url={shareUrl} quote={title}>
                  <FacebookIcon size={40} round />
                </FacebookShareButton>
                <TwitterShareButton url={shareUrl} title={title}>
                  <TwitterIcon size={40} round />
                </TwitterShareButton>
                <PinterestShareButton url={shareUrl} media={imageUrl || ''} description={description}>
                  <PinterestIcon size={40} round />
                </PinterestShareButton>
                <WhatsappShareButton url={shareUrl} title={title}>
                  <WhatsappIcon size={40} round />
                </WhatsappShareButton>
                <EmailShareButton url={shareUrl} subject={title} body={description}>
                  <EmailIcon size={40} round />
                </EmailShareButton>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={shareUrl}
                  readOnly
                  className="flex-1 px-3 py-2 border rounded-lg bg-gray-50"
                />
                <button
                  onClick={copyToClipboard}
                  className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-900 transition-colors"
                >
                  {copied ? 'Copied!' : 'Copy'}
                </button>
              </div>

              {matches && matches.length > 0 && (
                <div className="mt-6">
                  <h4 className="text-sm font-medium text-gray-900 mb-3">
                    Included Items
                  </h4>
                  <div className="grid grid-cols-4 gap-2">
                    {matches.map((match) => (
                      <div
                        key={match.id}
                        className="aspect-square rounded-md overflow-hidden relative group"
                      >
                        <img
                          src={match.imageUrl}
                          alt={match.name}
                          className="w-full h-full object-cover"
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
          </>
        )}
      </AnimatePresence>
    </>
  );
}