'use client';
import React from 'react';
import Link from 'next/link';
import { Clock, ArrowRight } from 'lucide-react';
import { useAuthStore } from '@/store/useAuthStore';

export default function PendingApprovalPage() {
  const { user } = useAuthStore();

  return (
    <main className="min-h-screen bg-[#FAFAFA] py-20 px-4 max-w-xl mx-auto font-sans text-center">
      <div className="bg-white p-10 border-4 border-black shadow-2xl space-y-6">
        <div className="w-20 h-20 bg-black text-white flex items-center justify-center mx-auto border-2 border-black">
          <Clock size={44} />
        </div>

        <div>
          <span className="text-xs font-black uppercase tracking-widest bg-black text-white px-3 py-1">
            Credential Audit Active
          </span>
          <h1 className="text-3xl font-black text-black mt-2 font-retro-heading uppercase">Account Pending Approval</h1>
          <p className="text-neutral-600 text-xs mt-2 font-medium">
            Hello <strong>{user?.full_name}</strong>. Your requested role (<strong className="uppercase text-black">{user?.role?.replace('_', ' ')}</strong>) is currently undergoing RDB / CRA credentials inspection.
          </p>
        </div>

        <div className="bg-neutral-50 p-4 border-2 border-black text-xs text-left space-y-2 text-neutral-700 font-medium">
          <div className="flex justify-between">
            <span className="font-black text-black uppercase">Email:</span>
            <span className="font-mono text-black">{user?.email}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-black text-black uppercase">Verification ID:</span>
            <span className="font-mono font-bold text-black">{user?.rdb_tin_number || user?.cra_business_number || 'TIN-Pending'}</span>
          </div>
        </div>

        <p className="text-xs text-neutral-500 font-medium">
          Our System Administrator manually approves vendor TIN certificates and RwandAir flight PNR tickets within 1 to 2 hours.
        </p>

        <div className="pt-2">
          <Link
            href="/"
            className="w-full bg-black hover:bg-neutral-800 text-white font-black py-3.5 border-2 border-black uppercase tracking-widest text-xs transition flex items-center justify-center gap-2"
          >
            <span>Return to Storefront Catalog</span>
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </main>
  );
}
