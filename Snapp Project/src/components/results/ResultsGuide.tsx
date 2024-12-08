import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Percent, Tag } from 'lucide-react';

const ResultsGuide = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white p-4 rounded-lg mb-6"
    >
      <h3 className="font-medium mb-4">Understanding Your Results</h3>
      
      <div className="grid grid-cols-3 gap-4">
        <div className="text-center">
          <Sparkles className="w-6 h-6 mx-auto mb-2 opacity-80" />
          <h4 className="text-sm font-medium mb-1">AI Match</h4>
          <p className="text-xs opacity-80">Overall similarity score</p>
        </div>
        
        <div className="text-center">
          <Percent className="w-6 h-6 mx-auto mb-2 opacity-80" />
          <h4 className="text-sm font-medium mb-1">Match Details</h4>
          <p className="text-xs opacity-80">Color, style & pattern match</p>
        </div>
        
        <div className="text-center">
          <Tag className="w-6 h-6 mx-auto mb-2 opacity-80" />
          <h4 className="text-sm font-medium mb-1">Price Compare</h4>
          <p className="text-xs opacity-80">Best deals across stores</p>
        </div>
      </div>

      <button
        onClick={() => localStorage.setItem('results_guide_seen', 'true')}
        className="w-full text-center text-sm mt-4 py-2 bg-white/10 rounded-lg hover:bg-white/20 transition-colors"
      >
        Got it
      </button>
    </motion.div>
  );
};

export default ResultsGuide;