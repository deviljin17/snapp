import { Inter } from 'next/font/google';
import '../styles/globals.css';
import { Metadata } from 'next';
import CartWrapper from '@/components/cart/CartWrapper';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'StyleRo - AI Fashion Discovery',
  description: 'Find and shop similar clothing items using AI',
  viewport: 'width=device-width, initial-scale=1',
  themeColor: '#000000',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <CartWrapper>
          {children}
        </CartWrapper>
      </body>
    </html>
  );
}