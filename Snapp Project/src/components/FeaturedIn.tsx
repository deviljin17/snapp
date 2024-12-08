import { motion } from 'framer-motion';

const FeaturedIn = () => {
  return (
    <section className="py-16 bg-gradient-to-b from-white to-gray-50/50 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-indigo-50/30 via-transparent to-transparent" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <p className="text-lg text-gray-600">
            Snapp has been recognized by industry leaders for its innovative approach to fashion shopping
          </p>
        </motion.div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-12 sm:gap-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            whileHover={{ scale: 1.05 }}
            className="group"
          >
            <div className="flex items-center gap-3">
              <span className="font-serif italic text-3xl bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent group-hover:text-black transition-colors">
                Vogue
              </span>
              <div className="px-3 py-1 bg-black/5 rounded-full">
                <span className="text-sm text-black/70 font-medium">Fashion</span>
              </div>
            </div>
          </motion.div>

          <div className="h-12 w-px bg-gradient-to-b from-transparent via-gray-200 to-transparent hidden sm:block" />

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            whileHover={{ scale: 1.05 }}
            className="group"
          >
            <div>
              <span className="font-medium text-2xl bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent group-hover:text-black transition-colors">
                TechCrunch
              </span>
              <div className="mt-2 flex items-center gap-2">
                <div className="px-2 py-0.5 bg-emerald-50 rounded-full">
                  <span className="text-xs text-emerald-700 font-medium">Editor's Choice</span>
                </div>
                <span className="text-sm text-gray-500">2024</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default FeaturedIn;