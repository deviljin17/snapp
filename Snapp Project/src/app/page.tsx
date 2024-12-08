import React from 'react';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import ScanningFrame from '../components/ScanningFrame';

export default function ScanPage() {
  return (
    <main className="min-h-[100dvh] bg-gray-900">
      {/* Header */}
      <div className="fixed top-0 inset-x-0 h-16 bg-black/50 backdrop-blur-lg z-10">
        <div className="h-full px-4 flex items-center justify-between">
          <Link 
            href="/"
            className="p-2 hover:bg-white/10 rounded-full transition-colors"
          >
            <ArrowLeft className="w-6 h-6 text-white" />
          </Link>
          <span className="text-white font-medium">StyleRo</span>
          <div className="w-10" /> {/* Spacer for alignment */}
        </div>
      </div>

      {/* Phone Frame */}
      <div className="fixed inset-0 pt-16 flex items-center justify-center p-4">
        <div className="w-full max-w-[320px] h-[600px] rounded-[3rem] bg-black p-4 shadow-2xl">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 h-6 w-40 bg-black rounded-b-3xl" />
          <div className="relative rounded-[2.5rem] overflow-hidden bg-white aspect-[9/19.5] h-full">
            <ScanningFrame 
              onScanComplete={() => {
                console.log('Scan complete');
              }}
            />
          </div>
        </div>
      </div>
    </main>
  );
}