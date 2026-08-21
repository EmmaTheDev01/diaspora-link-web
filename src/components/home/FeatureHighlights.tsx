'use client';
import React from 'react';
import { Scale, Camera, MessageSquare, ShieldCheck } from 'lucide-react';

export function FeatureHighlights() {
  return (
    <section className="py-10 bg-white border-y border-gray-300 font-sans text-black">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Feature 1: Honest Pricing */}
          <div className="flex items-center gap-4 p-4 rounded-2xl bg-gray-50 border border-black hover:bg-gray-100 transition-colors">
            <div className="w-12 h-12 rounded-xl bg-[#014485] text-white flex items-center justify-center shrink-0 shadow-xs">
              <Scale size={22} className="text-white" />
            </div>
            <div className="space-y-0.5">
              <h4 className="font-black text-black text-xs uppercase tracking-wider font-mono">HONEST $/KG PRICING</h4>
              <p className="text-gray-600 text-[11px] font-medium">Transparent $14/kg rate with courier flight selection.</p>
            </div>
          </div>

          {/* Feature 2: Photo Intake */}
          <div className="flex items-center gap-4 p-4 rounded-2xl bg-gray-50 border border-black hover:bg-gray-100 transition-colors">
            <div className="w-12 h-12 rounded-xl bg-[#17993b] text-white flex items-center justify-center shrink-0 shadow-xs">
              <Camera size={22} className="text-white" />
            </div>
            <div className="space-y-0.5">
              <h4 className="font-black text-black text-xs uppercase tracking-wider font-mono">PHOTO-DOCUMENTED CARGO</h4>
              <p className="text-gray-600 text-[11px] font-medium">Weighed, photographed & barcode-sealed at intake.</p>
            </div>
          </div>

          {/* Feature 3: WhatsApp Updates */}
          <div className="flex items-center gap-4 p-4 rounded-2xl bg-gray-50 border border-black hover:bg-gray-100 transition-colors">
            <div className="w-12 h-12 rounded-xl bg-[#014485] text-white flex items-center justify-center shrink-0 shadow-xs">
              <MessageSquare size={22} className="text-white" />
            </div>
            <div className="space-y-0.5">
              <h4 className="font-black text-black text-xs uppercase tracking-wider font-mono">RECIPIENT WHATSAPP ALERTS</h4>
              <p className="text-gray-600 text-[11px] font-medium">Receiver contacted prior to last-mile doorstep delivery.</p>
            </div>
          </div>

          {/* Feature 4: Escrow Protection */}
          <div className="flex items-center gap-4 p-4 rounded-2xl bg-gray-50 border border-black hover:bg-gray-100 transition-colors">
            <div className="w-12 h-12 rounded-xl bg-[#17993b] text-white flex items-center justify-center shrink-0 shadow-xs">
              <ShieldCheck size={22} className="text-white" />
            </div>
            <div className="space-y-0.5">
              <h4 className="font-black text-black text-xs uppercase tracking-wider font-mono">ESCROW GUARANTEED</h4>
              <p className="text-gray-600 text-[11px] font-medium">Payment released only on 4-digit PIN verification.</p>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
