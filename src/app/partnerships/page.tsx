'use client';
import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Building2, ShieldCheck, Users } from 'lucide-react';

export default function PartnershipsPage() {
  return (
    <main className="min-h-screen bg-white text-[#111111] py-16 px-4 lg:px-8 max-w-4xl mx-auto font-sans space-y-10">
      <div className="space-y-3 pb-6 border-b border-gray-100">
        <Link href="/" className="inline-flex items-center gap-1.5 text-xs font-bold text-gray-500 hover:text-black transition mb-2">
          <ArrowLeft size={14} /> Back to Home
        </Link>
        <span className="text-xs font-bold uppercase tracking-widest bg-black text-white px-3.5 py-1 rounded-full block w-fit">
          Institutional Trade
        </span>
        <h1 className="text-4xl lg:text-5xl font-black text-[#111111] font-retro-heading">Cooperative & Business Partnerships</h1>
        <p className="text-gray-500 text-sm font-medium">Partnering with Rwandan agricultural producers & Canadian commercial importers.</p>
      </div>

      <div className="space-y-8 text-sm text-gray-700 font-medium leading-relaxed">
        <section className="space-y-2">
          <h2 className="text-xl font-bold text-black font-retro-heading flex items-center gap-2">
            <Users size={20} /> Rwandan Agricultural Cooperatives
          </h2>
          <p>
            Nile Express Cargo partners directly with registered Rwandan farming cooperatives, including Gishwati tea growers and Lake Kivu specialty coffee producers. We provide digital storefronts, RDB TIN integration, and direct escrow payments.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-xl font-bold text-black font-retro-heading flex items-center gap-2">
            <Building2 size={20} /> Canadian Importers & Distributors
          </h2>
          <p>
            Commercial businesses in Canada with active CRA Business Numbers can partner with Nile Express Cargo to source wholesale African specialty goods, specialty coffees, teas, and handicrafts with automated CBSA customs clearance.
          </p>
        </section>


        <section className="space-y-2">
          <h2 className="text-xl font-bold text-black font-retro-heading flex items-center gap-2">
            <ShieldCheck size={20} /> Institutional Regulatory Alignment
          </h2>
          <p>
            Our trade protocol operates in complete alignment with Rwanda Development Board (RDB), Rwanda Revenue Authority (RRA), Canada Revenue Agency (CRA), and Canada Border Services Agency (CBSA) standards.
          </p>
        </section>
      </div>
    </main>
  );
}
