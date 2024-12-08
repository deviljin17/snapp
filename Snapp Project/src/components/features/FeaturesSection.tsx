import { motion } from 'framer-motion';
import { Camera, Sparkles, ShoppingBag, ArrowRight } from 'lucide-react';
import FeatureCard from './FeatureCard';
import { FadeIn } from '../animations';
import { ResultCard } from '../results';

const features = [
  {
    title: "Snap",
    description: "Take a photo of any outfit you spot",
    icon: Camera
  },
  {
    title: "Match",
    description: "See exact matches instantly",
    icon: Sparkles
  },
  {
    title: "Shop",
    description: "Shop at lowest price across stores",
    icon: ShoppingBag
  }
];

const styleMatches = [
  {
    name: "Winter Casual Style",
    image: "/images/card 1.jpeg",
    confidence: 92,
    label: "Exact Match",
    labelColor: "emerald"
  },
  {
    name: "Statement Fur Coat",
    image: "/images/card 2.webp",
    confidence: 89,
    label: "Recommended",
    labelColor: "purple"
  },
  {
    name: "Linen Blazer",
    image: "/images/card 3.webp",
    confidence: 87,
    label: "Similar Style",
    labelColor: "blue"
  }
];

const HowItWorksSection = () => {
  return (
    <section className="py-32 bg-gradient-to-b from-white to-gray-50/50 relative overflow-hidden">
      <FadeIn>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left Side - Process */}
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">
                See It In Action
              </h2>
              <div className="space-y-12">
                {features.map((feature, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.2 }}
                    className="flex items-start gap-6"
                  >
                    <div className="relative">
                      <div className="w-12 h-12 bg-indigo-600 rounded-full flex items-center justify-center text-white font-bold">
                        {index + 1}
                      </div>
                      {index < features.length - 1 && (
                        <div className="absolute top-12 bottom-0 left-1/2 w-px bg-indigo-200" />
                      )}
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold mb-2 flex items-center gap-2">
                        {feature.title}
                        <feature.icon className="w-5 h-5 text-indigo-600" />
                      </h3>
                      <p className="text-gray-600">{feature.description}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Right Side - Results */}
            <div>
              <div className="bg-gray-50 rounded-2xl p-8">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <div className="text-sm text-indigo-600 font-medium mb-1">Found in 2.3 seconds</div>
                    <h3 className="text-2xl font-bold">Perfect Matches</h3>
                  </div>
                  <div className="px-3 py-1 bg-emerald-50 rounded-full">
                    <span className="text-sm text-emerald-700 font-medium">93% accuracy</span>
                  </div>
                </div>
                <div className="space-y-4">
                  {styleMatches.map((match, index) => (
                    <ResultCard key={index} {...match} delay={index * 0.2} />
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Background Elements */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-1/4 -left-64 w-96 h-96 bg-indigo-100/50 rounded-full blur-3xl" />
            <div className="absolute bottom-1/4 -right-64 w-96 h-96 bg-blue-100/50 rounded-full blur-3xl" />
          </div>
        </div>
      </FadeIn>
    </section>
  );
};

export default HowItWorksSection;