import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Truck, RotateCcw, Star } from 'lucide-react';

interface MatchDetailsProps {
  colorMatch: number;
  styleMatch: number;
  patternMatch: number;
  features: string[];
  delivery?: string;
  returns?: string;
  rating?: number;
}

const MatchDetails = ({
  colorMatch,
  styleMatch,
  patternMatch,
  features,
  delivery,
  returns,
  rating
}: MatchDetailsProps) => {
  return (
    <div className="bg-white rounded-lg p-4 space-y-4">
      {/* Match Scores */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Color', value: colorMatch },
          { label: 'Style', value: styleMatch },
          { label: 'Pattern', value: patternMatch }
        ].map(({ label, value }) => (
          <div key={label} className="text-center">
            <div className="relative w-14 h-14 mx-auto mb-2">
              <svg className="w-full h-full" viewBox="0 0 36 36">
                <path
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="#F3F4F6"
                  strokeWidth="3"
                />
                <path
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="#6366F1"
                  strokeWidth="3"
                  strokeDasharray={`${value}, 100`}
                />
              </svg>
              <span className="absolute inset-0 flex items-center justify-center text-base font-semibold text-indigo-600">
                {value}%
              </span>
            </div>
            <span className="text-sm font-medium text-gray-700">{label}</span>
          </div>
        ))}
      </div>
      
      {/* Store Information */}
      {(delivery || returns || rating) && (
        <div className="border-t pt-4 space-y-3">
          {delivery && (
            <div className="flex items-center gap-2">
              <Truck className="w-4 h-4 text-gray-400" />
              <span className="text-sm text-gray-600">{delivery}</span>
            </div>
          )}
          {returns && (
            <div className="flex items-center gap-2">
              <RotateCcw className="w-4 h-4 text-gray-400" />
              <span className="text-sm text-gray-600">{returns}</span>
            </div>
          )}
          {rating && (
            <div className="flex items-center gap-2">
              <Star className="w-4 h-4 text-yellow-400" />
              <div className="flex items-center gap-1">
                <span className="font-medium">{rating}</span>
                <span className="text-sm text-gray-600">Store Rating</span>
              </div>
            </div>
          )}
        </div>
      )}
      {/* Similar Features */}
      <div>
        <h4 className="text-sm font-medium text-gray-900 mb-2 flex items-center gap-1">
          <Sparkles className="w-4 h-4 text-indigo-600" />
          Similar Features
        </h4>
        <ul className="grid grid-cols-2 gap-2">
          {features.map((feature, index) => (
            <motion.li
              key={feature}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="text-sm text-gray-600 flex items-center gap-1"
            >
              <span className="w-1.5 h-1.5 bg-indigo-600 rounded-full" />
              {feature}
            </motion.li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default MatchDetails;