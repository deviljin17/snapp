import { motion } from 'framer-motion';

const CTABanner = () => {
  return (
    <section className="py-20 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600" />
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMtOS45NDEgMC0xOCA4LjA1OS0xOCAxOHM4LjA1OSAxOCAxOCAxOGMzLjE4IDAgNi4xNzUtLjgyNCA4Ljc3MS0yLjI3MSAyLjU5Ni0xLjQ0NyA0Ljc1NC0zLjYwNSA2LjIwMS02LjIwMUMzNS4xNzYgNDEuODI1IDM2IDM4LjgyOSAzNiAzNnMtLjgyNC02LjE3NS0yLjI3MS04Ljc3MWMtMS40NDctMi41OTYtMy42MDUtNC43NTQtNi4yMDEtNi4yMDFDMjUuODI1IDE4LjgyNCAyMi44MjkgMTggMTkuNSAxOHoiIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iLjA1Ii8+PC9nPjwvc3ZnPg==')] opacity-10" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight"
          >
            Ready to find your perfect match?
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-xl text-white/90 mb-10"
          >
            Download Snapp now and discover your style!
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 max-w-[400px] mx-auto"
          >
            <motion.a
              href="https://apps.apple.com/app/id123456789"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.98 }}
              className="w-[180px] h-[54px] transition-all duration-300"
            >
              <img
                src="/images/apple.png"
                alt="Download on App Store"
                className="w-full h-full object-contain object-center"
              />
            </motion.a>
            <motion.a
              href="https://play.google.com/store/apps/details?id=com.stylero.app"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.98 }}
              className="w-[180px] h-[54px] transition-all duration-300"
            >
              <img
                src="/images/google.png"
                alt="Get it on Google Play"
                className="w-full h-full object-contain object-center"
              />
            </motion.a>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default CTABanner;