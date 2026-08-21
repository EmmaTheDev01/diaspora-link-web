'use client';
import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Plane, Luggage, ShieldCheck } from 'lucide-react';

export default function AirFreightPage() {
  return (
    <main className="min-h-screen bg-white text-[#111111] py-16 px-4 lg:px-8 max-w-4xl mx-auto font-sans space-y-10">
      <div className="space-y-3 pb-6 border-b border-gray-100">
        <Link href="/" className="inline-flex items-center gap-1.5 text-xs font-bold text-gray-500 hover:text-black transition mb-2">
          <ArrowLeft size={14} /> Back to Home
        </Link>
        <span className="text-xs font-bold uppercase tracking-widest bg-black text-white px-3.5 py-1 rounded-full block w-fit">
          Air Freight Logistics
        </span>
        <h1 className="text-4xl lg:text-5xl font-black text-[#111111] font-retro-heading">Passenger Air Courier Freight Dispatch</h1>
        <p className="text-gray-500 text-sm font-medium">Monetising unused passenger baggage allowance on RwandAir & international flights.</p>
      </div>

      <div className="space-y-8 text-sm text-gray-700 font-medium leading-relaxed">
        <section className="space-y-2">
          <h2 className="text-xl font-bold text-black font-retro-heading flex items-center gap-2">
            <Luggage size={20} /> Baggage Allowance Monetisation
          </h2>
          <p>
            International travelers flying between Kigali (KGL) and Toronto (YYZ) can list their unused baggage allowance on Nile Express Cargo. Traveling couriers earn fixed per-kilogram payouts carrying pre-inspected commercial parcels.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-xl font-bold text-black font-retro-heading flex items-center gap-2">
            <ShieldCheck size={20} /> Pre-Inspected Tamper-Evident Parcels
          </h2>
          <p>
            All parcels dispatched via passenger couriers undergo strict inspection at certified Kigali Cargo Hubs. Parcels are sealed with tamper-evident QR security codes encoding Air Waybill (AWB) numbers matching customs e-manifests.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-xl font-bold text-black font-retro-heading flex items-center gap-2">
            <Plane size={20} /> Airport Clearance & Courier Protection
          </h2>
          <p>
            Couriers carry official Nile Express Cargo Flight Manifests exempting them from personal customs duty liability. Upon landing at Pearson Airport (YYZ), parcels are handed over to destination hub officers for final delivery.
          </p>
        </section>

      </div>
    </main>
  );
}
