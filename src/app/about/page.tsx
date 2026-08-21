'use client';
import React from 'react';
import Link from 'next/link';
import { Plane, Lock, ShieldCheck, Luggage, ArrowLeft, ChevronRight } from 'lucide-react';

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-white text-[#111111] py-16 px-4 lg:px-8 max-w-5xl mx-auto font-sans space-y-12">
      {/* Header */}
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <span className="text-xs font-bold uppercase tracking-widest bg-[#014485] text-white px-3.5 py-1 rounded-full inline-block font-mono">
          ABOUT NILE EXPRESS CARGO
        </span>
        <h1 className="text-4xl lg:text-5xl font-black text-[#111111] font-retro-heading uppercase tracking-tight">
          Cross-Border Freight & Cargo Infrastructure
        </h1>
        <p className="text-gray-600 text-sm font-medium">
          Connecting East African producers and diaspora buyers directly with Canadian hubs across transparent freight corridors.
        </p>
      </div>

      {/* Feature SVG Icon Container - Displays in 1 Single Row (NO EMOJIS) */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-[#F8F8F8] p-6 rounded-2xl text-center space-y-3">
          <div className="w-12 h-12 bg-[#014485] text-white rounded-xl flex items-center justify-center mx-auto shadow-xs">
            <Plane size={24} />
          </div>
          <h3 className="font-bold text-xs uppercase text-black font-retro-heading">YYZ ✈ KGL Corridor</h3>
          <p className="text-[11px] text-gray-500 font-medium">Direct air freight transit</p>
        </div>

        <div className="bg-[#F8F8F8] p-6 rounded-2xl text-center space-y-3">
          <div className="w-12 h-12 bg-[#17993b] text-white rounded-xl flex items-center justify-center mx-auto shadow-xs">
            <Lock size={24} />
          </div>
          <h3 className="font-bold text-xs uppercase text-black font-retro-heading">256-Bit Escrow Vault</h3>
          <p className="text-[11px] text-gray-500 font-medium">Locked until delivery PIN</p>
        </div>

        <div className="bg-[#F8F8F8] p-6 rounded-2xl text-center space-y-3">
          <div className="w-12 h-12 bg-[#014485] text-white rounded-xl flex items-center justify-center mx-auto shadow-xs">
            <ShieldCheck size={24} />
          </div>
          <h3 className="font-bold text-xs uppercase text-black font-retro-heading">RDB & CBSA Verified</h3>
          <p className="text-[11px] text-gray-500 font-medium">Pre-cleared customs manifests</p>
        </div>

        <div className="bg-[#F8F8F8] p-6 rounded-2xl text-center space-y-3">
          <div className="w-12 h-12 bg-[#17993b] text-white rounded-xl flex items-center justify-center mx-auto shadow-xs">
            <Luggage size={24} />
          </div>
          <h3 className="font-bold text-xs uppercase text-black font-retro-heading">Air Courier Network</h3>
          <p className="text-[11px] text-gray-500 font-medium">Passenger flight baggage</p>
        </div>
      </div>

      {/* Simple Minimal About Section */}
      <div className="space-y-6 text-sm text-gray-700 font-medium leading-relaxed max-w-3xl mx-auto pt-6 border-t border-gray-100">
        <p>
          Nile Express Cargo eliminates unnecessary intermediary markups by establishing direct e-commerce trade corridors between East African producers and diaspora buyers across North America. All transactions are protected inside a 256-bit Escrow Vault until physical delivery confirmation.
        </p>
        <p>
          Traveling passengers on routes such as RwandAir Flight WB302 list spare baggage capacity to carry pre-inspected commercial parcels protected by tamper-evident QR security seals, guaranteeing rapid cross-border fulfillment.
        </p>

        <div className="pt-6 text-center">
          <Link
            href="/products"
            className="bg-[#014485] hover:bg-[#013467] text-white font-bold px-8 py-4 rounded-full text-xs uppercase tracking-widest inline-flex items-center gap-2 transition shadow-md cursor-pointer"
          >
            <span>Explore Export Catalog</span>
            <ChevronRight size={16} />
          </Link>
        </div>
      </div>

    </main>
  );
}
