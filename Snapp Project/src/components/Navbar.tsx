import React, { useState, useEffect } from 'react';
import { Camera } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import AnimatedButton from './ui/AnimatedButton';

const Navbar = () => {
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);
  const { scrollY } = useScroll();
  const opacity = useTransform(scrollY, [0, 100], [0, 1]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isDevelopment = process.env.NODE_ENV === 'development';

  return (
    <nav className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
      isScrolled ? 'bg-white/80 backdrop-blur-lg shadow-sm' : 'bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <button 
            onClick={() => navigate('/')}
            className="flex items-center space-x-2 group"
          >
            <Camera className="h-6 w-6 text-indigo-600 transition-transform group-hover:scale-110" />
            <span className="text-xl font-semibold text-gray-900">Snapp</span>
          </button>
          
          <div className="flex items-center space-x-6">
            {isDevelopment && (
              <button
                onClick={() => navigate('/test-scenarios')}
                className="text-sm text-gray-600 hover:text-gray-900"
              >
                Test Scenarios
              </button>
            )}
            <motion.div style={{ opacity }}>
              <AnimatedButton
                onClick={() => navigate('/camera')}
                className="bg-black/90 hover:bg-black text-sm px-5 py-2"
              >
                Find It Now
              </AnimatedButton>
            </motion.div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;