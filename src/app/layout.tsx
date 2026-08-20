import type { Metadata } from 'next';
import { Poppins } from 'next/font/google';
import './globals.css';
import { Header } from '@/components/common/Header';
import { Footer } from '@/components/common/Footer';
import { CartDrawer } from '@/components/cart/CartDrawer';
import { Toaster } from 'react-hot-toast';

const poppins = Poppins({
  weight: ['300', '400', '500', '600', '700', '800', '900'],
  subsets: ['latin'],
  variable: '--font-poppins',
});

export const metadata: Metadata = {
  title: 'Magic Link | Cross-Border E-Commerce & Freight Logistics (KGL ↔ YYZ)',
  description: 'Official Magic Link Web Application connecting Kigali, Rwanda and Toronto, Canada. Dual-currency shopping, 256-bit Escrow Vault lock, and air freight luggage logistics.',
  keywords: ['Magic Link', 'Diaspora Link', 'Rwanda E-Commerce', 'Gishwati Tea', 'Kivu Coffee', 'Kigali Toronto Freight', 'RwandAir Luggage', 'Escrow Vault'],
  icons: {
    icon: '/icon.png',
    shortcut: '/icon.png',
    apple: '/icon.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={poppins.variable}>
      <body className="bg-white text-[#111111] antialiased flex flex-col min-h-screen font-sans">
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#111111',
              color: '#FFFFFF',
              borderRadius: '12px',
              fontSize: '13px',
              fontWeight: '700',
              padding: '12px 16px',
            },
          }}
        />
        <Header />
        <div className="flex-1">{children}</div>
        <Footer />
        <CartDrawer />
      </body>
    </html>
  );
}
