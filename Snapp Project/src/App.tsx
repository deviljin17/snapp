import { Routes, Route, Navigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';

import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import HowItWorks from './components/HowItWorks';
import CTABanner from './components/CTABanner';
import Camera from './components/Camera';
import AnalysisView from './components/loading/AnalysisView';
import ResultsView from './components/results/ResultsView';
import Footer from './components/ui/Footer';

function App() {
  return (
    <div className="min-h-screen">
      <AnimatePresence mode="wait">
        <Routes>
          <Route path="/" element={
            <main>
              <Navbar />
              <HeroSection />
              <HowItWorks />
              <CTABanner />
              <Footer />
            </main>
          } />
          <Route path="/camera" element={<Camera />} />
          <Route path="/scanning" element={<AnalysisView />} />
          <Route path="/results" element={<ResultsView />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AnimatePresence>
    </div>
  );
}

export default App;