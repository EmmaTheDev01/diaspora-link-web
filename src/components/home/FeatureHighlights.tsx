'use client';
import React from 'react';
import { Plane, Lock, ShieldCheck, Headphones } from 'lucide-react';

export function FeatureHighlights() {
  return (
    <section className="py-14 bg-white font-sans">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Feature 1 */}
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-black text-white flex items-center justify-center shrink-0 shadow-xs">
              <Plane size={24} />
            </div>
            <div className="space-y-0.5">
              <h4 className="font-bold text-black text-sm uppercase tracking-wider font-retro-heading">DIRECT AIR FREIGHT</h4>
              <p className="text-gray-600 text-xs font-medium">KGL ✈ YYZ passenger flight dispatch.</p>
            </div>
          </div>

          {/* Feature 2 */}
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-black text-white flex items-center justify-center shrink-0 shadow-xs">
              <Lock size={24} />
            </div>
            <div className="space-y-0.5">
              <h4 className="font-bold text-black text-sm uppercase tracking-wider font-retro-heading">256–BIT ESCROW VAULT</h4>
              <p className="text-gray-600 text-xs font-medium">Locked until parcel delivery PIN.</p>
            </div>
          </div>

          {/* Feature 3 */}
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-black text-white flex items-center justify-center shrink-0 shadow-xs">
              <ShieldCheck size={24} />
            </div>
            <div className="space-y-0.5">
              <h4 className="font-bold text-black text-sm uppercase tracking-wider font-retro-heading">VERIFIED TRADE CORRIDORS</h4>
              <p className="text-gray-600 text-xs font-medium">Exporter TIN & duty clearance.</p>
            </div>
          </div>

          {/* Feature 4 */}
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-black text-white flex items-center justify-center shrink-0 shadow-xs">
              <Headphones size={24} />
            </div>
            <div className="space-y-0.5">
              <h4 className="font-bold text-black text-sm uppercase tracking-wider font-retro-heading">24/7 SUPPORT</h4>
              <p className="text-gray-600 text-xs font-medium">Bilingual in English & Kinyarwanda.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
