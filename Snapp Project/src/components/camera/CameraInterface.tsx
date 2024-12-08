import React from 'react';
import { ArrowLeft, Camera } from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const CameraInterface = () => {
  const navigate = useNavigate();

  return (
    <div className="fixed inset-0 bg-black">
      {/* Top Bar */}
      <div className="fixed top-0 inset-x-0 h-16 bg-black/50 backdrop-blur-lg z-10">
        <div className="h-full px-4 flex items-center justify-between">
          <button 
            onClick={() => navigate('/')}
            className="p-2 hover:bg-white/10 rounded-full transition-colors"
          >
            <ArrowLeft className="w-6 h-6 text-white" />
          </button>
          <span className="text-white font-medium">Scanner</span>
          <div className="w-10" /> {/* Spacer for alignment */}
        </div>
      </div>

      {/* Camera Viewport */}
      <div className="absolute inset-0 flex items-center justify-center">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center text-white"
        >
          <Camera className="w-16 h-16 mx-auto mb-4 opacity-50" />
          <p className="text-sm opacity-75">Point camera at clothing item</p>
        </motion.div>
      </div>

      {/* Camera Grid */}
      <div className="absolute inset-0 grid grid-cols-3 grid-rows-3">
        {[...Array(9)].map((_, i) => (
          <div
            key={i}
            className="border border-white/10"
          />
        ))}
      </div>

      {/* Bottom Controls */}
      <div className="fixed bottom-0 inset-x-0 p-6 flex justify-center items-end bg-gradient-to-t from-black/50 to-transparent">
        <motion.button 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="w-16 h-16 rounded-full bg-white flex items-center justify-center hover:bg-gray-100 transition-colors"
        >
          <Camera className="w-8 h-8 text-black" />
        </motion.button>
      </div>
    </div>
  );
};

export default CameraInterface;