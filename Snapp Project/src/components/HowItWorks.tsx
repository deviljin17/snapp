import React from 'react';
import { Camera, Sparkles, ShoppingBag, Search, HelpCircle } from 'lucide-react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';

const processSteps = [
  {
    number: "01",
    title: "Snap Your Look",
    description: "Simply take a photo of any clothing item you love - whether it's online, in a magazine, or on the street.",
    icon: Camera,
    gradient: "from-emerald-500 to-emerald-600",
    iconAnimation: {
      hover: { scale: 1.1, rotate: [-5, 5, -5, 0] },
      tap: { scale: 0.9 }
    },
    borderColor: "border-emerald-200"
  },
  {
    number: "02",
    title: "AI Magic Happens",
    description: "Our advanced AI analyzes every detail - from patterns to textures - finding the closest matches in seconds.",
    icon: Sparkles,
    gradient: "from-blue-500 to-blue-600",
    iconAnimation: {
      hover: { scale: 1.1 },
      tap: { scale: 0.9 }
    },
    borderColor: "border-blue-200"
  },
  {
    number: "03",
    title: "Shop Your Style",
    description: "Browse perfect matches from thousands of stores, compare prices, and find the best deals instantly.",
    icon: ShoppingBag,
    gradient: "from-purple-500 to-purple-600",
    iconAnimation: {
      hover: { scale: 1.1 },
      tap: { scale: 0.9 }
    },
    borderColor: "border-purple-200"
  }
];

const HowItWorks = () => {
  const { scrollYProgress } = useScroll();
  const pathLength = useTransform(scrollYProgress, [0.3, 0.7], [0, 1]);

  return (
    <section className="responsive-section overflow-hidden bg-gradient-to-b from-gray-50/80 via-gray-50/50 to-white">
      <div className="section-divider section-divider-top" />
      {/* Gradient Background */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white via-gray-50/50 to-transparent" />
      
      {/* Pattern Overlay */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMtOS45NDEgMC0xOCA4LjA1OS0xOCAxOHM4LjA1OSAxOCAxOCAxOGMzLjE4IDAgNi4xNzUtLjgyNCA4Ljc3MS0yLjI3MSAyLjU5Ni0xLjQ0NyA0Ljc1NC0zLjYwNSA2LjIwMS02LjIwMUMzNS4xNzYgNDEuODI1IDM2IDM4LjgyOSAzNiAzNnMtLjgyNC02LjE3NS0yLjI3MS04Ljc3MWMtMS40NDctMi41OTYtMy42MDUtNC43NTQtNi4yMDEtNi4yMDFDMjUuODI1IDE4LjgyNCAyMi44MjkgMTggMTkuNSAxOHoiIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iLjA4Ii8+PC9nPjwvc3ZnPg==')] opacity-10" />
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            How Snapp Works
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto px-4">
            Transform the way you discover and shop for fashion with our simple three-step process
          </p>
        </motion.div>

        <div className="max-w-3xl mx-auto relative">
          {/* Connecting Line SVG */}
          <svg
            className="absolute left-24 top-0 h-full w-1 hidden md:block"
            viewBox="0 0 2 100"
            preserveAspectRatio="none"
          >
            <motion.path
              d="M1 0L1 100"
              stroke="url(#gradient-line)"
              strokeWidth="2"
              strokeDasharray="0 1"
              style={{ pathLength }}
              className="stroke-current"
            />
            <defs>
              <linearGradient id="gradient-line" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#10B981" />
                <stop offset="50%" stopColor="#3B82F6" />
                <stop offset="100%" stopColor="#8B5CF6" />
              </linearGradient>
            </defs>
          </svg>

          {processSteps.map((step, index) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2 }}
              className="group relative mb-16 last:mb-0"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-gray-50 to-white/50 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xl" />
              
              <div className="relative bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow border border-gray-100">
                <div className="flex items-start gap-6">
                  <div className="relative">
                    <motion.div
                      whileHover={step.iconAnimation.hover}
                      whileTap={step.iconAnimation.tap}
                      className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${step.gradient} flex items-center justify-center shadow-lg transition-shadow hover:shadow-xl`}
                    >
                      <motion.div
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.3 + index * 0.2, type: "spring" }}
                        className="relative"
                      >
                        <step.icon className="w-8 h-8 text-white transition-transform" />
                      </motion.div>
                    </motion.div>
                    <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-br from-gray-900 to-gray-800 text-white text-xs font-bold rounded-full flex items-center justify-center shadow-lg">
                      {step.number}
                    </div>
                  </div>
                  
                  <div className="flex-1 pt-2">
                    <motion.h3
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-800 bg-clip-text text-transparent mb-2 group-hover:translate-x-1 transition-transform"
                    >
                      {step.title}
                    </motion.h3>
                    <motion.p
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.1 }}
                      className="text-gray-600 leading-relaxed"
                    >
                      {step.description}
                    </motion.p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* AI Technology Subsection */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-32 relative">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/40 via-purple-50/30 to-blue-50/40 rounded-3xl blur-xl" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,_var(--tw-gradient-stops))] from-indigo-50/20 via-transparent to-transparent opacity-50" />
        </div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative bg-gradient-to-r from-white to-gray-50/90 rounded-2xl overflow-hidden border border-gray-100/50 shadow-lg backdrop-blur-sm p-8 md:p-12"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-gray-50/20 via-white/10 to-gray-50/20 opacity-50" />
          
          <div className="relative">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                Powered by Cutting-Edge AI
              </h2>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-12">
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="space-y-4"
              >
                <div className="space-y-4">
                  <p className="text-base text-gray-600/90 leading-relaxed">
                    Our AI-powered platform continuously learns and adapts to deliver the most accurate matches for your style preferences.
                  </p>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      className="relative overflow-hidden rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 p-4 shadow-lg group"
                    >
                      <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                      <p className="text-2xl font-bold text-white mb-1">99.8%</p>
                      <p className="text-sm text-white/90">Pattern Recognition</p>
                      <p className="text-xs text-white/80 mt-1">Analyzes intricate details, textures, and design elements</p>
                      <Search className="absolute bottom-2 right-2 w-4 h-4 text-white/40" />
                    </motion.div>
                    
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      className="relative overflow-hidden rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 p-4 shadow-lg group"
                    >
                      <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                      <p className="text-2xl font-bold text-white mb-1">99.5%</p>
                      <p className="text-sm text-white/90">Style Analysis</p>
                      <p className="text-xs text-white/80 mt-1">Tailors suggestions to your unique preferences and trends</p>
                      <HelpCircle className="absolute bottom-2 right-2 w-4 h-4 text-white/40" />
                    </motion.div>
                    
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      className="relative overflow-hidden rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 p-4 shadow-lg group"
                    >
                      <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                      <p className="text-2xl font-bold text-white mb-1">98.9%</p>
                      <p className="text-sm text-white/90">Color Matching</p>
                      <p className="text-xs text-white/80 mt-1">Precisely identifies and matches color palettes</p>
                      <Sparkles className="absolute bottom-2 right-2 w-4 h-4 text-white/40" />
                    </motion.div>
                    
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      className="relative overflow-hidden rounded-xl bg-gradient-to-br from-pink-500 to-pink-600 p-4 shadow-lg group"
                    >
                      <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                      <p className="text-2xl font-bold text-white mb-1">97.2%</p>
                      <p className="text-sm text-white/90">Brand Detection</p>
                      <p className="text-xs text-white/80 mt-1">Identifies brands and finds similar alternatives</p>
                      <ShoppingBag className="absolute bottom-2 right-2 w-4 h-4 text-white/40" />
                    </motion.div>
                  </div>
                </div>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="space-y-6 md:pl-4"
              >
                <div className="text-lg text-gray-700 leading-relaxed">
                  Our AI-powered platform continuously learns and adapts to the latest fashion trends, ensuring you always get the most relevant matches. With millions of products analyzed daily, we provide:
                  <ul className="mt-4 space-y-3">
                    <li className="flex items-start gap-3 group">
                      <div className="p-2 rounded-lg bg-indigo-50 text-indigo-600 group-hover:bg-indigo-100 transition-colors">
                        <Search className="w-5 h-5" />
                      </div>
                      <div>
                        <span className="font-semibold text-gray-900">Pattern Recognition</span>
                        <p className="text-body-sm mt-1">Finds exact matches by analyzing intricate details of designs</p>
                      </div>
                    </li>
                    <li className="flex items-start gap-3 group">
                      <div className="p-2 rounded-lg bg-indigo-50 text-indigo-600 group-hover:bg-indigo-100 transition-colors">
                        <Sparkles className="w-5 h-5" />
                      </div>
                      <div>
                        <span className="font-semibold text-gray-900">Style Analysis</span>
                        <p className="text-body-sm mt-1">Tailors suggestions to your unique preferences and trends</p>
                      </div>
                    </li>
                  </ul>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
      <div className="section-divider section-divider-bottom" />
    </section>
  );
};

export default HowItWorks;