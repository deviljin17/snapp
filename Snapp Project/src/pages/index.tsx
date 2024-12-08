import React from 'react';
import { Camera } from 'lucide-react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import HeroSection from '@/components/HeroSection';
import ValueProposition from '@/components/ValueProposition';
import DemoSection from '@/components/DemoSection';

export default function Home() {
  return (
    <main>
      <Navbar />
      <HeroSection />
      <ValueProposition />
      <DemoSection />
    </main>
  );
}