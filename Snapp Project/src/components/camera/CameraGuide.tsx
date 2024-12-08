import React from 'react';
import { motion } from 'framer-motion';
import { Camera, Sun, Move, Frame } from 'lucide-react';

const tips = [
  {
    icon: Frame,
    title: 'Frame the Item',
    description: 'Center the clothing item in the frame and ensure it\'s fully visible'
  },
  {
    icon: Sun,
    title: 'Good Lighting',
    description: 'Take photos in well-lit conditions for better results'
  },
  {
    icon: Move,
    title: 'Steady Shot',
    description: 'Hold your device steady to capture clear images'
  }
];

const CameraGuide = () => {
  const [currentTip, setCurrentTip] = React.useState(0);

  React.useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTip(prev => (prev + 1) % tips.length);
    }, 3000);

    return () => clearInterval(timer);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="absolute bottom-32 inset-x-4"
    >
      <div className="bg-black/80 backdrop-blur-sm rounded-lg p-4 max-w-sm mx-auto">
        <div className="flex items-center gap-3">
          {tips.map((tip, index) => (
            <motion.div
              key={index}
              animate={{
                scale: currentTip === index ? 1 : 0.8,
                opacity: currentTip === index ? 1 : 0.5
              }}
              className="flex-1 text-center"
            >
              <tip.icon className="w-6 h-6 text-white mx-auto mb-2" />
              <h3 className="text-white text-sm font-medium">{tip.title}</h3>
              {currentTip === index && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-white/80 text-xs mt-1"
                >
                  {tip.description}
                </motion.p>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default CameraGuide;