import React from 'react';
import { Loader } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { motion } from 'framer-motion';

export default function ScanningPage() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push('/results');
    }, 3000);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="fixed inset-0 bg-black">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&q=80"
          alt="Captured Image"
          className="w-full h-full object-cover opacity-50"
        />
        <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
      </div>

      {/* Content */}
      <div className="relative h-full flex flex-col items-center justify-center px-4">
        <div className="text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          >
            <Loader className="w-12 h-12 text-white mx-auto mb-4" />
          </motion.div>
          <h2 className="text-white text-xl font-medium mb-2">
            AI analyzing your style...
          </h2>
          <p className="text-white/70 text-sm">
            Finding similar items from thousands of products
          </p>
        </div>

        {/* Progress Bar */}
        <div className="absolute bottom-16 inset-x-4 max-w-md mx-auto">
          <div className="h-1 bg-white/20 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-white rounded-full"
              initial={{ width: "0%" }}
              animate={{ width: "100%" }}
              transition={{ duration: 3, ease: "easeInOut" }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}