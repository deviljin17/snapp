import { ResultCard } from './index';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const styleMatches = [
  {
    id: 1,
    name: "Winter Casual Style",
    image: "/images/card 1.jpeg",
    description: "Beige coat with leopard print",
    confidence: 92,
    label: "Exact Match",
    labelColor: "emerald"
  },
  {
    id: 2,
    name: "Statement Fur Coat",
    image: "/images/card 2.webp",
    description: "Red faux fur with matching hat",
    confidence: 89,
    label: "Recommended",
    labelColor: "purple"
  },
  {
    id: 3,
    name: "Linen Blazer",
    image: "/images/card 3.webp",
    description: "Modern cut blazer",
    confidence: 87,
    label: "Recommended",
    labelColor: "purple"
  },
  {
    id: 4,
    name: "Sneakerhead Style",
    image: "/images/card 4.jpeg",
    description: "Pink sneakers and casual wear",
    confidence: 85,
    label: "Similar Style",
    labelColor: "blue"
  },
  {
    id: 5,
    name: "Vintage Record Shop",
    image: "/images/card 5.jpeg",
    description: "Tank tops and vintage denim",
    confidence: 83,
    label: "Similar Style",
    labelColor: "blue"
  },
  {
    id: 6,
    name: "Modern Western",
    image: "/images/card 6.jpeg",
    description: "Hat display and crop top",
    confidence: 81,
    label: "Similar Style",
    labelColor: "blue"
  }
];

const MockResultsSection = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const itemsPerPage = 3;

  const nextSlide = () => {
    setCurrentIndex(current => 
      current + itemsPerPage >= styleMatches.length ? 0 : current + itemsPerPage
    );
  };

  const prevSlide = () => {
    setCurrentIndex(current => 
      current - itemsPerPage < 0 ? styleMatches.length - itemsPerPage : current - itemsPerPage
    );
  };

  return (
    <section className="py-24 bg-gradient-to-b from-gray-50 to-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl font-bold text-gray-900 sm:text-5xl mb-6"
          >
            Your Style Matches
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-lg text-gray-600"
          >
            Discover perfectly matched items based on your style preferences
          </motion.p>
        </motion.div>

        <div className="relative">
          <div className="overflow-hidden">
            <motion.div
              className="flex gap-6"
              animate={{ x: `${-currentIndex * (100 / itemsPerPage)}%` }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
              {styleMatches.map((match, index) => (
                <div
                  key={match.id}
                  className="w-full min-w-[calc(33.333% - 1rem)]"
                  style={{ opacity: index >= currentIndex && index < currentIndex + itemsPerPage ? 1 : 0.3 }}
                >
                  <ResultCard
                    name={match.name}
                    image={match.image}
                    confidence={match.confidence}
                    label={match.label}
                    labelColor={match.labelColor}
                    delay={index * 0.1}
                  />
                </div>
              ))}
            </motion.div>
          </div>

          {/* Navigation Buttons */}
          <div className="absolute -left-4 top-1/2 -translate-y-1/2">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={prevSlide}
              className="p-3 bg-white rounded-full shadow-lg hover:shadow-xl transition-all"
            >
              <ChevronLeft className="w-6 h-6" />
            </motion.button>
          </div>
          <div className="absolute -right-4 top-1/2 -translate-y-1/2">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={nextSlide}
              className="p-3 bg-white rounded-full shadow-lg hover:shadow-xl transition-all"
            >
              <ChevronRight className="w-6 h-6" />
            </motion.button>
          </div>
        </div>

        {/* Pagination Dots */}
        <div className="flex justify-center gap-2 mt-8">
          {Array.from({ length: Math.ceil(styleMatches.length / itemsPerPage) }).map((_, i) => (
            <motion.button
              key={i}
              className={`w-2 h-2 rounded-full transition-colors ${
                Math.floor(currentIndex / itemsPerPage) === i
                  ? 'bg-gray-900'
                  : 'bg-gray-300'
              }`}
              onClick={() => setCurrentIndex(i * itemsPerPage)}
              whileHover={{ scale: 1.2 }}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default MockResultsSection;