import React from 'react';
import { ArrowLeft } from 'lucide-react';

interface NavigationButtonProps {
  onClick: () => void;
  label?: string;
}

const NavigationButton: React.FC<NavigationButtonProps> = ({ onClick, label = 'Back' }) => {
  return (
    <button
      onClick={onClick}
      className="group flex items-center gap-2 p-2 hover:bg-gray-100 rounded-full transition-colors"
      aria-label={label}
    >
      <ArrowLeft className="w-6 h-6 group-hover:transform group-hover:-translate-x-0.5 transition-transform" />
      <span className="sr-only">{label}</span>
    </button>
  );
};

export default NavigationButton;