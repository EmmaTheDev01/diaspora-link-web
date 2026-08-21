'use client';
import React, { useEffect, useState } from 'react';
import { HeroArea } from '@/components/home/HeroArea';
import { FeatureHighlights } from '@/components/home/FeatureHighlights';
import { dbService } from '@/services/db';
import { CargoPackage } from '@/types';
import Link from 'next/link';
import { Plane, ShieldCheck, Truck, Scale, MapPin, ArrowRight, ShoppingBag } from 'lucide-react';

export default function CargoNetworkPage() {
  return (
    <main className="min-h-screen bg-gray-50 font-sans text-black">
      {/* 1. Dedicated Sender & Receiver Dual Hub (Light Background, NO Black Hero Container) */}
      <HeroArea />

      {/* 2. Brand Value Proposition & Trust Highlights */}
      <FeatureHighlights />

      {/* 3. 6-Stage Journey Pipeline Visualiser (Light White Background Card) */}
      <section className="py-12 px-4 lg:px-8 max-w-7xl mx-auto">
        <div className="bg-white text-black rounded-3xl p-6 sm:p-10 border-2 border-black shadow-lg space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-bold text-gray-600 uppercase tracking-widest font-mono">
              Operating Model
            </span>
            <h2 className="text-2xl sm:text-3xl font-black font-retro-heading">
              How Your Package Moves: 6-Stage Journey
            </h2>
            <p className="text-xs text-gray-600 font-medium">
              We coordinate the entire journey from the sender's hands to the recipient's door with photo intake & WhatsApp alerts.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4">
            <div className="bg-gray-50 p-4 rounded-2xl border border-black space-y-2 text-center">
              <span className="text-xs font-black text-white font-mono bg-[#014485] px-2 py-0.5 rounded">01 BOOK</span>
              <h3 className="font-bold text-xs text-black">Instant Quote</h3>
              <p className="text-[11px] text-gray-600">Sender fills ID & assigns passenger courier.</p>
            </div>

            <div className="bg-gray-50 p-4 rounded-2xl border border-black space-y-2 text-center">
              <span className="text-xs font-black text-white font-mono bg-[#014485] px-2 py-0.5 rounded">02 COLLECT</span>
              <h3 className="font-bold text-xs text-black">Home Pickup</h3>
              <p className="text-[11px] text-gray-600">Toronto doorstep pickup or drop-off at intake hub.</p>
            </div>

            <div className="bg-gray-50 p-4 rounded-2xl border border-black space-y-2 text-center">
              <span className="text-xs font-black text-white font-mono bg-[#014485] px-2 py-0.5 rounded">03 CONSOLIDATE</span>
              <h3 className="font-bold text-xs text-black">Weigh & Photo</h3>
              <p className="text-[11px] text-gray-600">Weighed on scale, photo-documented & barcode-sealed.</p>
            </div>

            <div className="bg-gray-50 p-4 rounded-2xl border border-black space-y-2 text-center">
              <span className="text-xs font-black text-white font-mono bg-[#014485] px-2 py-0.5 rounded">04 FLY</span>
              <h3 className="font-bold text-xs text-black">Air Flight</h3>
              <p className="text-[11px] text-gray-600">Hand-carried in baggage by verified passenger courier.</p>
            </div>

            <div className="bg-gray-50 p-4 rounded-2xl border border-black space-y-2 text-center">
              <span className="text-xs font-black text-white font-mono bg-[#014485] px-2 py-0.5 rounded">05 CLEAR</span>
              <h3 className="font-bold text-xs text-black">Customs Clear</h3>
              <p className="text-[11px] text-gray-600">Customs clearance & local hub sorting.</p>
            </div>

            <div className="bg-gray-50 p-4 rounded-2xl border border-black space-y-2 text-center">
              <span className="text-xs font-black text-white font-mono bg-[#17993b] px-2 py-0.5 rounded">06 DELIVER</span>
              <h3 className="font-bold text-xs text-black">Doorstep Delivery</h3>
              <p className="text-[11px] text-gray-600">Released upon 4-digit recipient PIN code verification.</p>
            </div>
          </div>

          <div className="pt-4 flex flex-col sm:flex-row justify-between items-center gap-4 border-t border-gray-200">
            <div className="flex items-center space-x-2 text-xs font-bold text-gray-700">
              <ShieldCheck className="w-5 h-5 text-[#17993b]" />
              <span>Full Escrow Protection + WhatsApp Alerts + Real-time Photo Tracking</span>
            </div>

            <Link
              href="/products"
              className="px-6 py-3 bg-[#014485] hover:bg-[#013467] text-white font-black text-xs uppercase tracking-wider rounded-xl transition-colors font-mono flex items-center space-x-2 shrink-0 shadow-md"
            >
              <ShoppingBag className="w-4 h-4 text-white" />
              <span>SHOP EXPORT MARKETPLACE</span>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
