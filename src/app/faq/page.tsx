'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, ChevronDown } from 'lucide-react';

interface FAQItem {
  question: string;
  answer: string;
}

const FAQS: FAQItem[] = [
  {
    question: 'How does the 256-Bit Escrow Vault protect my payment?',
    answer: 'When you place an order, your money is locked safely in our escrow vault. The vendor or courier only receives payout after you receive the package in Toronto or Kigali and enter your 6-digit delivery confirmation PIN.',
  },
  {
    question: 'How does passenger flight baggage logistics work for couriers?',
    answer: 'Travelers flying between Kigali (KGL) and Toronto (YYZ) can list their unused baggage allowance on Nile Express Cargo. They earn CAD/RWF payouts per kilogram for carrying inspected, tamper-sealed export parcels.',
  },
  {
    question: 'How do I switch between CAD ($) and RWF currency?',
    answer: 'Click the currency switcher button at the top header bar to toggle display prices instantly between Canadian Dollars (CAD $) and Rwandan Francs (RWF).',
  },
  {
    question: 'How are sellers and cooperatives verified?',
    answer: 'Rwandan vendors are verified using their RDB TIN certificate numbers, while Canadian importers are verified through their CRA Business Numbers.',
  },
];

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <main className="min-h-screen bg-white text-[#111111] py-16 px-4 lg:px-8 max-w-4xl mx-auto font-sans space-y-8">
      <div className="space-y-2">
        <Link href="/" className="inline-flex items-center gap-1 text-xs font-bold text-gray-500 hover:text-black mb-2">
          <ArrowLeft size={14} /> Back to Home
        </Link>
        <span className="text-xs font-bold uppercase tracking-widest bg-black text-white px-3 py-1 rounded-full block w-fit">
          Help & Support
        </span>
        <h1 className="text-4xl font-black text-[#111111] font-retro-heading">Frequently Asked Questions</h1>
        <p className="text-gray-500 text-sm font-medium">Everything you need to know about Nile Express Cargo cross-border trade.</p>
      </div>


      <div className="space-y-4">
        {FAQS.map((faq, idx) => (
          <div key={idx} className="bg-[#F8F8F8] border border-gray-200 rounded-2xl overflow-hidden transition">
            <button
              onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
              className="w-full p-6 text-left font-bold text-base text-[#111111] flex justify-between items-center cursor-pointer"
            >
              <span>{faq.question}</span>
              <ChevronDown size={18} className={`transition transform ${openIndex === idx ? 'rotate-180' : ''}`} />
            </button>
            {openIndex === idx && (
              <div className="px-6 pb-6 text-sm text-gray-600 font-medium leading-relaxed border-t border-gray-200/60 pt-4">
                {faq.answer}
              </div>
            )}
          </div>
        ))}
      </div>
    </main>
  );
}
