import React from 'react';
import { ArrowLeft, Share2 } from 'lucide-react';
import { Link } from 'react-router-dom';

const ResultsHeader: React.FC = () => {
  return (
    <div className="sticky top-0 bg-white border-b z-10">
      <div className="max-w-7xl mx-auto">
        <div className="px-4 h-16 flex items-center justify-between">
          <Link
            to="/camera"
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <ArrowLeft className="w-6 h-6" />
          </Link>
          <h1 className="text-lg font-medium">Similar Styles Found</h1>
          <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <Share2 className="w-6 h-6" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResultsHeader;