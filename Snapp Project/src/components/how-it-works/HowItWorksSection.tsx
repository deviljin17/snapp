import { Camera, Sparkles, ShoppingBag } from 'lucide-react';
import TimelineStep from './TimelineStep';

const steps = [
  {
    number: 1,
    title: "Snap a Photo",
    description: "Take a picture of any clothing item that catches your eye",
    icon: Camera
  },
  {
    number: 2,
    title: "Discover Matches",
    description: "Our AI instantly finds similar styles from thousands of products",
    icon: Sparkles
  },
  {
    number: 3,
    title: "Shop Your Style",
    description: "Compare prices and buy directly from your favorite stores",
    icon: ShoppingBag
  }
];

const HowItWorksSection = () => {
  return (
    <section className="py-32 bg-gradient-to-b from-white to-gray-50 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl mb-4">
            How It Works
          </h2>
          <p className="text-lg text-gray-600">
            Discover and shop your favorite styles in three easy steps
          </p>
        </div>
        
        <div className="max-w-2xl mx-auto space-y-20">
          {steps.map((step, index) => (
            <TimelineStep
              key={index}
              {...step}
              isLast={index === steps.length - 1}
              delay={index * 0.2}
            />
          ))}
        </div>
        
        {/* Background Elements */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 -left-64 w-96 h-96 bg-indigo-100/50 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 -right-64 w-96 h-96 bg-blue-100/50 rounded-full blur-3xl" />
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;