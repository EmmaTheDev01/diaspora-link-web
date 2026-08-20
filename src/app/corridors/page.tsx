'use client';
import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Plane, ShieldCheck, Globe } from 'lucide-react';

export default function CorridorsPage() {
  return (
    <main className="min-h-screen bg-white text-[#111111] py-16 px-4 lg:px-8 max-w-4xl mx-auto font-sans space-y-10">
      <div className="space-y-3 pb-6 border-b border-gray-100">
        <Link href="/" className="inline-flex items-center gap-1.5 text-xs font-bold text-gray-500 hover:text-black transition mb-2">
          <ArrowLeft size={14} /> Back to Home
        </Link>
        <span className="text-xs font-bold uppercase tracking-widest bg-black text-white px-3.5 py-1 rounded-full block w-fit">
          Trade Corridors
        </span>
        <h1 className="text-4xl lg:text-5xl font-black text-[#111111] font-retro-heading">Kigali (KGL) ↔ Toronto (YYZ) Trade Corridor</h1>
        <p className="text-gray-500 text-sm font-medium">Bilateral E-Commerce & Freight Infrastructure connecting Rwanda & Canada.</p>
      </div>

      <div className="space-y-8 text-sm text-gray-700 font-medium leading-relaxed">
        <section className="space-y-2">
          <h2 className="text-xl font-bold text-black font-retro-heading flex items-center gap-2">
            <Plane size={20} /> Direct Air Flight Freight Corridor
          </h2>
          <p>
            The Kigali (KGL) ✈ Toronto (YYZ) trade corridor links Rwandan agricultural cooperatives directly with Canadian diaspora consumers and wholesale business importers. Utilizing passenger flight cargo capacity on airlines such as RwandAir, goods travel seamlessly across continents in under 24 hours.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-xl font-bold text-black font-retro-heading flex items-center gap-2">
            <ShieldCheck size={20} /> Verified Producer Origins
          </h2>
          <p>
            Every product originating from Kigali is backed by Rwanda Development Board (RDB) TIN verification and RAB biosecurity inspection. Specialty Arabica coffee from Lake Kivu and organic white tea from Gishwati are tracked with immutable Air Waybill (AWB) manifests.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-xl font-bold text-black font-retro-heading flex items-center gap-2">
            <Globe size={20} /> Dual-Currency Foreign Exchange Engine
          </h2>
          <p>
            Transactions are settled seamlessly in Canadian Dollars (CAD $) or Rwandan Francs (RWF). Fixed foreign exchange rates locked during order creation eliminate currency volatility risks for exporters and buyers.
          </p>
        </section>
      </div>
    </main>
  );
}
