import React from 'react';
import { Camera, ArrowLeft, Image } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function CameraPage() {
  return (
    <div className="fixed inset-0 bg-black">
      {/* Header */}
      <div className="fixed top-0 inset-x-0 h-16 bg-black/50 backdrop-blur-lg z-10">
        <div className="h-full px-4 flex items-center justify-between">
          <Link 
            href="/"
            className="p-2 hover:bg-white/10 rounded-full transition-colors"
          >
            <ArrowLeft className="w-6 h-6 text-white" />
          </Link>
          <span className="text-white font-medium">StyleRo</span>
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
        <div className="w-full max-w-md flex items-center justify-center space-x-6">
          {/* Gallery Button */}
          <label className="p-4 rounded-full bg-white/20 backdrop-blur-lg hover:bg-white/30 transition-colors cursor-pointer">
            <Image className="w-6 h-6 text-white" />
            <input
              type="file"
              className="hidden"
              accept="image/*"
            />
          </label>

          {/* Capture Button */}
          <button 
            className="w-16 h-16 rounded-full bg-white flex items-center justify-center hover:bg-gray-100 transition-colors"
          >
            <Camera className="w-8 h-8 text-black" />
          </button>

          {/* Spacer for alignment */}
          <div className="w-16" />
        </div>
      </div>
    </div>
  );
}