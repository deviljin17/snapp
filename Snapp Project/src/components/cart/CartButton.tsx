import { useState } from 'react';
import { ShoppingCart } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import CartDrawer from './CartDrawer';

const CartButton = () => {
  const { totalItems } = useCart();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsDrawerOpen(true)}
        className="relative p-2 hover:bg-gray-100 rounded-full transition-colors"
      >
        <ShoppingCart className="h-6 w-6 text-gray-700" />
        {totalItems > 0 && (
          <span className="absolute -top-1 -right-1 bg-indigo-600 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
            {totalItems}
          </span>
        )}
      </button>
      <CartDrawer isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} />
    </>
  );
};

export default CartButton;