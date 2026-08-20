'use client';
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export function Footer() {
  const pathname = usePathname();

  // Hide footer on auth pages and dashboard routes
  const isAuthPage = pathname === '/login' || pathname === '/register' || pathname === '/forgot-password';
  const isDashboardPage =
    pathname.startsWith('/buyer') ||
    pathname.startsWith('/vendor') ||
    pathname.startsWith('/logistics') ||
    pathname.startsWith('/admin') ||
    pathname.startsWith('/dashboard') ||
    pathname.startsWith('/pending-approval');

  if (isAuthPage || isDashboardPage) return null;

  return (
    <footer className="bg-white text-[#111111] pt-16 pb-12 border-t border-gray-100 font-sans">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-gray-100">
          {/* Column 1: Brand Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl overflow-hidden border border-gray-200 shrink-0">
                <img src="/icon.png" alt="Magic Link Logo" className="w-full h-full object-cover" />
              </div>
              <span className="font-black text-2xl tracking-tight text-[#111111] font-retro-heading">MAGIC LINK</span>
            </div>
            <p className="text-gray-600 text-xs leading-relaxed font-medium">
              Cross-Border Diaspora E-Commerce & Freight Luggage Logistics platform connecting Kigali (`KGL`) and Toronto (`YYZ`).
            </p>
          </div>

          {/* Column 2: Platform Navigation */}
          <div className="space-y-3">
            <h4 className="text-[#111111] font-bold text-xs uppercase tracking-wider font-retro-heading">
              Platform Navigation
            </h4>
            <ul className="space-y-2 text-xs font-medium text-gray-600">
              <li><Link href="/products" className="hover:text-black transition">Shop Export Catalog</Link></li>
              <li><Link href="/about" className="hover:text-black transition">About Protocol</Link></li>
              <li><Link href="/login" className="hover:text-black transition">Sign In</Link></li>
              <li><Link href="/register" className="hover:text-black transition">Create Account</Link></li>
            </ul>
          </div>

          {/* Column 3: Corridors & Services */}
          <div className="space-y-3">
            <h4 className="text-[#111111] font-bold text-xs uppercase tracking-wider font-retro-heading">
              Corridors & Services
            </h4>
            <ul className="space-y-2 text-xs font-medium text-gray-600">
              <li><Link href="/corridors" className="hover:text-black transition">Kigali ↔ Toronto Freight</Link></li>
              <li><Link href="/escrow-vault" className="hover:text-black transition">256-Bit Escrow Vault</Link></li>
              <li><Link href="/air-freight" className="hover:text-black transition">Passenger Air Freight</Link></li>
              <li><Link href="/partnerships" className="hover:text-black transition">Cooperative Partnerships</Link></li>
            </ul>
          </div>

          {/* Column 4: Legal & Support */}
          <div className="space-y-3">
            <h4 className="text-[#111111] font-bold text-xs uppercase tracking-wider font-retro-heading">
              Legal & Support
            </h4>
            <ul className="space-y-2 text-xs text-gray-600 font-medium">
              <li><Link href="/privacy" className="hover:text-black transition">Privacy Policy</Link></li>
              <li><Link href="/terms" className="hover:text-black transition">Terms of Trade</Link></li>
              <li><Link href="/customs-clearance" className="hover:text-black transition">Customs Clearance Guide</Link></li>
              <li><Link href="/contact" className="hover:text-black transition">Contact Hubs</Link></li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-gray-500 font-medium">
          <p>© {new Date().getFullYear()} Magic Link Inc. All Rights Reserved.</p>
          <div className="flex items-center gap-4 font-bold text-[#111111] text-xs">
            <span>Stripe CAD</span>
            <span>•</span>
            <span>MTN / Airtel MoMo</span>
            <span>•</span>
            <span>RwandAir Cargo</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
