'use client';
import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Lock, ShieldCheck, CheckCircle2 } from 'lucide-react';

export default function EscrowVaultPage() {
  return (
    <main className="min-h-screen bg-white text-[#111111] py-16 px-4 lg:px-8 max-w-4xl mx-auto font-sans space-y-10">
      <div className="space-y-3 pb-6 border-b border-gray-100">
        <Link href="/" className="inline-flex items-center gap-1.5 text-xs font-bold text-gray-500 hover:text-black transition mb-2">
          <ArrowLeft size={14} /> Back to Home
        </Link>
        <span className="text-xs font-bold uppercase tracking-widest bg-black text-white px-3.5 py-1 rounded-full block w-fit">
          Financial Protection
        </span>
        <h1 className="text-4xl lg:text-5xl font-black text-[#111111] font-retro-heading">256-Bit Escrow Vault Security Guarantee</h1>
        <p className="text-gray-500 text-sm font-medium">Cryptographic payment protection for buyers, exporters, and air couriers.</p>
      </div>

      <div className="space-y-8 text-sm text-gray-700 font-medium leading-relaxed">
        <section className="space-y-2">
          <h2 className="text-xl font-bold text-black font-retro-heading flex items-center gap-2">
            <Lock size={20} /> 100% Locked Escrow Holdings
          </h2>
          <p>
            When a buyer completes checkout, purchase funds are immediately locked inside our 256-bit Escrow Vault. Neither vendors nor couriers can access escrow funds until physical delivery is verified by the recipient.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-xl font-bold text-black font-retro-heading flex items-center gap-2">
            <CheckCircle2 size={20} /> 6-Digit Cryptographic Confirmation PIN
          </h2>
          <p>
            Each order generates a unique 6-digit release PIN sent directly to the buyer's account. Upon parcel arrival in Toronto or Kigali, the recipient inspects the unbroken QR tamper seal and inputs the PIN to instantly release net payout funds to the vendor.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-xl font-bold text-black font-retro-heading flex items-center gap-2">
            <ShieldCheck size={20} /> Non-Delivery & Damage Refund Guarantee
          </h2>
          <p>
            If a parcel is lost, damaged, or fails customs inspection, escrow funds remain locked. Buyers can file an instant dispute claim to receive a 100% refund processed through our freight insurance reserve.
          </p>
        </section>
      </div>
    </main>
  );
}
