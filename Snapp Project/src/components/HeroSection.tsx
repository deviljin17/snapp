import React from 'react';
import { Camera, Sparkles, ShoppingBag } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

export default function HeroSection() {
  const navigate = useNavigate();
  const [showTapAnimation, setShowTapAnimation] = React.useState(true);
  const [showResults, setShowResults] = React.useState(false);

  React.useEffect(() => {
    // Start the animation sequence
    const timer = setTimeout(() => {
      setShowTapAnimation(false);
      setShowResults(true);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  const handleTryNow = () => {
    navigate('/camera');
  };

  return (
    <div className="min-h-[100dvh] bg-white relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute -top-1/4 -left-1/4 w-1/2 h-1/2 bg-gradient-to-br from-indigo-600/10 via-blue-600/5 to-purple-600/10 rounded-full blur-3xl animate-pulse" />
      <div className="absolute -bottom-1/4 -right-1/4 w-1/2 h-1/2 bg-gradient-to-tr from-purple-600/10 via-pink-600/5 to-indigo-600/10 rounded-full blur-3xl animate-pulse" />
      
      <div className="responsive-container py-20">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-4 lg:gap-12">
          {/* Left Content */}
          <div className="w-full lg:w-5/12 relative px-4 lg:px-0 mt-12 sm:mt-16 lg:mt-0">
            <div className="absolute -inset-4 bg-gradient-to-br from-indigo-50/50 via-white to-purple-50/50 rounded-3xl -z-10 blur-lg opacity-75" />
            <h1 className="text-left text-4xl sm:text-6xl lg:text-8xl font-bold tracking-tighter mb-4">
              <span className="inline-block bg-gradient-to-r from-gray-900 via-indigo-900 to-gray-900 bg-clip-text text-transparent">
                Find your perfect
              </span>
              <span className="block text-gray-900">
                fit in seconds
              </span>
            </h1>
            <div className="flex items-center gap-2 mb-10">
              <motion.div 
                className="px-4 py-2 bg-emerald-50/90 backdrop-blur-sm rounded-full border border-emerald-100 shadow-md hover:shadow-lg transition-all duration-300"
                whileHover={{ scale: 1.05, y: -2 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-emerald-600" />
                  <span className="text-emerald-700 text-lg font-extrabold bg-gradient-to-r from-emerald-700 to-emerald-600 bg-clip-text text-transparent">93% match accuracy</span>
                </div>
              </motion.div>
            </div>
            <ul className="space-y-4 lg:space-y-6 mb-8 lg:mb-10">
              {[
                {
                  icon: Camera,
                  text: "Snap a pic of any outfit you spot",
                  color: "text-pink-500 group-hover:text-pink-600"
                },
                {
                  icon: Sparkles,
                  text: "See exact matches instantly",
                  color: "text-indigo-500 group-hover:text-indigo-600"
                },
                {
                  icon: ShoppingBag,
                  text: "Shop at lowest price across stores",
                  color: "text-emerald-500 group-hover:text-emerald-600"
                }
              ].map(({ icon: Icon, text, color }, index) => (
                <motion.li
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center gap-4 text-xl text-gray-700 font-medium relative group hover:pl-2 transition-all duration-300 p-2 hover:bg-white/80 rounded-xl"
                >
                  <div className={`p-2 lg:p-3 rounded-xl bg-white ${color} transition-all duration-300 group-hover:shadow-md group-hover:scale-110`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className="text-base lg:text-xl group-hover:translate-x-1 transition-transform">
                    {text}
                  </span>
                  <div className="absolute -inset-2 -z-10 bg-gradient-to-r from-gray-50/80 to-transparent opacity-0 group-hover:opacity-100 rounded-2xl transition-all duration-300 blur-sm" />
                </motion.li>
              ))}
            </ul>
            <div className="w-full h-px bg-gradient-to-r from-gray-100 via-gray-200 to-gray-100 my-10" />
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-sm font-medium text-gray-600 tracking-wide uppercase">Featured in</span>
                <div className="h-px flex-1 bg-gradient-to-r from-gray-200 via-gray-100 to-transparent"></div>
              </div>
              <div className="flex items-center gap-8 bg-white/80 p-4 rounded-2xl backdrop-blur-sm border border-gray-100/50 shadow-sm hover:shadow-md transition-all duration-300">
                <motion.div 
                  className="flex items-center gap-2 group"
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  <span className="font-serif italic text-2xl bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent group-hover:text-black transition-colors">Vogue</span>
                  <div className="px-2 py-1 bg-black/5 rounded-full">
                    <span className="text-xs text-black/70 font-medium">Fashion</span>
                  </div>
                </motion.div>
                <div className="h-8 w-px bg-gradient-to-b from-transparent via-gray-200 to-transparent"></div>
                <motion.div 
                  className="flex items-center gap-3 group"
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  <div>
                    <span className="font-medium text-xl bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent group-hover:text-black transition-colors">TechCrunch</span>
                    <div className="mt-1 flex items-center gap-2">
                      <div className="px-2 py-0.5 bg-emerald-50 rounded-full">
                        <span className="text-xs text-emerald-700 font-medium">Editor's Choice</span>
                      </div>
                      <span className="text-sm text-gray-500">2024</span>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
            <button
              onClick={handleTryNow}
              className="group relative cta-button cta-button-primary mb-8 overflow-hidden"
            >
              <motion.div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                initial={false}
                animate={{ 
                  background: [
                    "radial-gradient(circle at 0% 0%, rgba(99, 102, 241, 0.15) 0%, transparent 50%)",
                    "radial-gradient(circle at 100% 100%, rgba(99, 102, 241, 0.15) 0%, transparent 50%)"
                  ]
                }}
                transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
              />
              Find It Now
            </button>
            <div className="flex items-center gap-6">
              <motion.a 
                href="#" 
                className="app-store-badge cta-button-store relative"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.98 }}
              >
                <img
                  src="/images/apple.png"
                  alt="Download on App Store"
                  className="w-full h-full object-contain object-center"
                />
              </motion.a>
              <motion.a 
                href="#" 
                className="app-store-badge cta-button-store relative"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.98 }}
              >
                <img
                  src="/images/google.png"
                  alt="Get it on Google Play"
                  className="w-full h-full object-contain object-center"
                />
              </motion.a>
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50 rounded-full"
              >
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-3.5 h-3.5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <span className="text-xs text-emerald-700 font-medium whitespace-nowrap">4.8/5</span>
              </motion.div>
            </div>
          </div>

          {/* Phone Mockups Container */}
          <div className="relative w-full lg:w-6/12 flex justify-center items-center h-[450px] sm:h-[500px] lg:h-[800px] -mt-6 lg:mt-0">
            {/* Curved Arrow */}
            <motion.svg
              width="280"
              height="180"
              viewBox="0 0 280 120"
              fill="none"
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-12 z-30 md:top-1/3 md:-translate-y-8"
              initial={{ opacity: 0, pathLength: 0 }}
              animate={{ opacity: 1, pathLength: 1 }}
              transition={{ duration: 1.5, ease: "easeInOut", delay: 0.5 }}
            >
              {/* Gradient Definition */}
              <defs>
                <linearGradient id="arrowGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#10B981" stopOpacity="0.4" />
                  <stop offset="50%" stopColor="#10B981" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="#10B981" stopOpacity="1" />
                </linearGradient>
                <filter id="arrowShadow" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur in="SourceAlpha" stdDeviation="3" />
                  <feOffset dx="2" dy="2" result="offsetblur" />
                  <feComponentTransfer>
                    <feFuncA type="linear" slope="0.4" />
                  </feComponentTransfer>
                  <feMerge>
                    <feMergeNode />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
                <marker
                  id="arrowhead"
                  viewBox="0 0 12 12"
                  refX="10"
                  refY="6"
                  markerWidth="8"
                  markerHeight="8"
                  orient="auto"
                >
                  <path
                    d="M 0 0 L 12 6 L 0 12 L 4 6 Z"
                    fill="url(#arrowGradient)"
                  />
                </marker>
              </defs>
              <motion.path
                d="M40 60 C 100 0, 180 0, 240 60"
                stroke="url(#arrowGradient)"
                strokeWidth="4"
                strokeLinecap="round"
                fill="none"
                filter="url(#arrowShadow)"
                markerEnd="url(#arrowhead)"
              />
            </motion.svg>

            {/* Camera Phone */}
            <div className="absolute left-0 phone-mockup phone-mockup-left z-10 scale-[0.6] sm:scale-75 lg:scale-100">
              <div className="relative rounded-[3rem] bg-black p-4 shadow-xl">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 h-6 w-40 bg-black rounded-b-3xl" />
                <div className="relative rounded-[2.5rem] overflow-hidden bg-white aspect-[9/19.5] shadow-[0_0_15px_rgba(0,0,0,0.2)]">
                  <AnimatePresence>
                    {showTapAnimation && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 bg-black/50 flex items-center justify-center z-10"
                      >
                        <motion.div
                          className="w-12 h-12 bg-white/20 rounded-full"
                          animate={{
                            scale: [1, 0.8, 1],
                            opacity: [1, 0.5, 0]
                          }}
                          transition={{
                            duration: 1,
                            repeat: Infinity,
                            ease: "easeInOut"
                          }}
                        />
                      </motion.div>
                    )}
                  </AnimatePresence>
                  <img
                    src="https://lp.stories.com/app005prod?set=key[resolve.pixelRatio],value[1]&set=key[resolve.width],value[1500]&set=key[resolve.height],value[10000]&set=key[resolve.imageFit],value[containerwidth]&set=key[resolve.allowImageUpscaling],value[0]&set=key[resolve.format],value[jpeg]&set=key[resolve.quality],value[80]&set=source[/86/51/86510daf3a084318f5bb8207e0a75a32db5bc64f.jpg],origin[dam],type[LOOKBOOK],ImageVersion[1]&call=url[file:/product/dynamic.chain]"
                    alt="StyleRo App Interface"
                    className="w-full h-full object-cover object-center brightness-[1.02] contrast-[1.02] saturate-[1.05]"
                  />
                  <div className="absolute inset-0">
                    {/* Scanning Interface */}
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="absolute inset-0"
                    >
                      {/* Corner Brackets */}
                      <div className="absolute inset-12 flex items-center justify-center">
                        {/* Top-left */}
                        <div className="absolute top-0 left-0">
                          <div className="relative animate-bracket-pulse">
                            <div className="absolute left-0 top-0 w-8 h-1 bg-white shadow-[0_0_8px_rgba(255,255,255,0.5)]" />
                            <div className="absolute left-0 top-0 w-1 h-8 bg-white shadow-[0_0_8px_rgba(255,255,255,0.5)]" />
                          </div>
                        </div>
                        {/* Top-right */}
                        <div className="absolute top-0 right-0">
                          <div className="relative animate-bracket-pulse [animation-delay:200ms]">
                            <div className="absolute right-0 top-0 w-8 h-1 bg-white shadow-[0_0_8px_rgba(255,255,255,0.5)]" />
                            <div className="absolute right-0 top-0 w-1 h-8 bg-white shadow-[0_0_8px_rgba(255,255,255,0.5)]" />
                          </div>
                        </div>
                        {/* Bottom-left */}
                        <div className="absolute bottom-0 left-0">
                          <div className="relative animate-bracket-pulse [animation-delay:400ms]">
                            <div className="absolute left-0 bottom-0 w-8 h-1 bg-white shadow-[0_0_8px_rgba(255,255,255,0.5)]" />
                            <div className="absolute left-0 bottom-0 w-1 h-8 bg-white shadow-[0_0_8px_rgba(255,255,255,0.5)]" />
                          </div>
                        </div>
                        {/* Bottom-right */}
                        <div className="absolute bottom-0 right-0">
                          <div className="relative animate-bracket-pulse [animation-delay:600ms]">
                            <div className="absolute right-0 bottom-0 w-8 h-1 bg-white shadow-[0_0_8px_rgba(255,255,255,0.5)]" />
                            <div className="absolute right-0 bottom-0 w-1 h-8 bg-white shadow-[0_0_8px_rgba(255,255,255,0.5)]" />
                          </div>
                        </div>
                      </div>
                    </motion.div>
                    
                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/5 to-black/5" />
                  </div>
                  <button
                    onClick={handleTryNow}
                    className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-white text-black px-6 py-3 rounded-full font-medium flex items-center gap-2 hover:bg-gray-50 transition-colors"
                  >
                    <Camera className="w-5 h-5" />
                    Snap & Shop
                  </button>
                </div>
              </div>
            </div>

            {/* Results Phone */}
            <div className="absolute right-0 phone-mockup phone-mockup-right z-20 glow-effect scale-[0.6] sm:scale-75 lg:scale-100">
              <div className="relative rounded-[3rem] bg-black p-4 shadow-xl glow-effect">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 h-6 w-40 bg-black rounded-b-3xl" />
                <div className="relative rounded-[2.5rem] overflow-hidden bg-gray-50 aspect-[9/19.5] shadow-[0_0_15px_rgba(0,0,0,0.2)]">
                  <div className="h-16 bg-white border-b flex items-center justify-between px-4 shadow-sm">
                    <motion.div 
                      className="flex items-center gap-2"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 2.5 }}
                    >
                      <span className="text-sm font-medium">Complete Look Found</span>
                      <div className="px-2 py-1 bg-emerald-50 rounded-full">
                        <span className="text-xs text-emerald-600 font-medium">100% Match</span>
                      </div>
                    </motion.div>
                  </div>
                  <div className="absolute top-16 left-4 px-2 py-1 bg-emerald-50 rounded-full z-20">
                    <span className="text-xs text-emerald-700">Found in 2.3 seconds</span>
                  </div>
                  
                  {/* Results Content */}
                  <div className="p-4 space-y-4">
                    <motion.div
                      className="relative h-[360px] rounded-lg overflow-hidden bg-gray-100 shadow-md"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3 }}
                    >
                      <img
                        src="https://lp.stories.com/app005prod?set=key[resolve.pixelRatio],value[1]&set=key[resolve.width],value[1500]&set=key[resolve.height],value[10000]&set=key[resolve.imageFit],value[containerwidth]&set=key[resolve.allowImageUpscaling],value[0]&set=key[resolve.format],value[jpeg]&set=key[resolve.quality],value[80]&set=source[/ec/87/ec875c3c8b612f25d1f61d4d5495f5a6c3e901b8.jpg],origin[dam],type[DESCRIPTIVESTILLLIFE],ImageVersion[1]&call=url[file:/product/dynamic.chain]"
                        alt="Velvet Mini Dress"
                        className="w-full h-full object-cover object-center brightness-[1.02] contrast-[1.02] saturate-[1.05]"
                        loading="lazy"
                        decoding="async"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/5 to-black/5" />
                      <div className="absolute top-2 right-2 px-2 py-1 bg-emerald-500 rounded-full shadow-lg">
                        <span className="text-xs text-white font-medium">Perfect Match</span>
                      </div>
                      <div className="absolute bottom-3 left-3 right-3">
                        <p className="text-white text-sm font-medium mb-1">Velvet Mini Dress</p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1">
                            <p className="text-white/90 text-xs line-through">$159.99</p>
                            <p className="text-white font-medium text-sm">$129.99</p>
                          </div>
                          <div className="flex -space-x-2">
                            {[
                              '/images/card 4.jpeg',
                              '/images/card 5.jpeg',
                              '/images/card 6.jpeg'
                            ].map((avatar, i) => (
                              <div key={i} className="w-5 h-5 rounded-full border-2 border-white overflow-hidden bg-white">
                                <img
                                  src={avatar}
                                  alt={`User ${i + 1}`}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                    <div className="grid grid-cols-2 gap-3">
                      <motion.div
                        className="relative h-[160px] rounded-lg overflow-hidden bg-gray-100 shadow-md"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.3 }}
                      >
                        <img
                          src="https://lp.stories.com/app005prod?set=key[resolve.pixelRatio],value[1]&set=key[resolve.width],value[1500]&set=key[resolve.height],value[10000]&set=key[resolve.imageFit],value[containerwidth]&set=key[resolve.allowImageUpscaling],value[0]&set=key[resolve.format],value[jpeg]&set=key[resolve.quality],value[80]&set=source[/33/1a/331a46c1ec6aea397568c07cf27ed68ce59eeeed.jpg],origin[dam],type[DESCRIPTIVESTILLLIFE],ImageVersion[2]&call=url[file:/product/dynamic.chain]"
                          alt="Patent Leather Boots"
                          className="w-full h-full object-cover object-center brightness-[1.02] contrast-[1.02] saturate-[1.05]"
                          loading="lazy"
                          decoding="async"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/5 to-black/5" />
                        <div className="absolute top-2 right-2 px-2 py-1 bg-blue-500 rounded-full shadow-lg">
                          <span className="text-xs text-white font-medium">98% Match</span>
                        </div>
                        <div className="absolute bottom-2 left-2 right-2">
                          <p className="text-white text-xs font-medium mb-0.5">Patent Boots</p>
                          <p className="text-white/90 text-xs">$199.99</p>
                        </div>
                      </motion.div>
                      <motion.div
                        className="relative h-[160px] rounded-lg overflow-hidden bg-gray-100 shadow-md"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.3 }}
                      >
                        <img
                          src="https://lp.stories.com/app005prod?set=key[resolve.pixelRatio],value[1]&set=key[resolve.width],value[1500]&set=key[resolve.height],value[10000]&set=key[resolve.imageFit],value[containerwidth]&set=key[resolve.allowImageUpscaling],value[0]&set=key[resolve.format],value[jpeg]&set=key[resolve.quality],value[80]&set=source[/e8/d7/e8d771beb63d9a44a43530c12ac6d6a04f1d3c86.jpg],origin[dam],type[DESCRIPTIVESTILLLIFE],ImageVersion[1]&call=url[file:/product/dynamic.chain]"
                          alt="Oval Sunglasses"
                          className="w-full h-full object-cover object-center brightness-[1.02] contrast-[1.02] saturate-[1.05]"
                          loading="lazy"
                          decoding="async"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/5 to-black/5" />
                        <div className="absolute top-2 right-2 px-2 py-1 bg-blue-500 rounded-full shadow-lg">
                          <span className="text-xs text-white font-medium">95% Match</span>
                        </div>
                        <div className="absolute bottom-2 left-2 right-2">
                          <p className="text-white text-xs font-medium mb-0.5">Oval Sunglasses</p>
                          <div className="flex items-center justify-between">
                            <p className="text-white/90 text-xs">$89.99</p>
                            <div className="flex -space-x-1">
                              {['/images/card 1.jpeg', '/images/card 2.webp'].map((avatar, i) => (
                                <div key={i} className="w-4 h-4 rounded-full border border-white overflow-hidden">
                                  <img src={avatar} alt={`User ${i + 1}`} className="w-full h-full object-cover" />
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}