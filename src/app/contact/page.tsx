'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Send, CheckCircle2, MapPin, Phone, Mail, Building2, Clock } from 'lucide-react';

export default function ContactPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <main className="min-h-screen bg-white text-[#111111] py-16 px-4 lg:px-8 max-w-7xl mx-auto font-sans space-y-10">
      {/* Header */}
      <div className="space-y-3 pb-6 border-b border-gray-100">
        <Link href="/" className="inline-flex items-center gap-1.5 text-xs font-bold text-gray-500 hover:text-black transition mb-2">
          <ArrowLeft size={14} /> Back to Home
        </Link>
        <span className="text-xs font-bold uppercase tracking-widest bg-[#014485] text-white px-3.5 py-1 rounded-full block w-fit font-mono">
          HUB LOCATIONS & SUPPORT
        </span>
        <h1 className="text-4xl lg:text-5xl font-black text-[#111111] font-retro-heading uppercase tracking-tight">
          Contact Nile Express Cargo
        </h1>
        <p className="text-gray-500 text-sm font-medium">Reach our dedicated trade hubs in Toronto, Canada and Kigali, Rwanda.</p>
      </div>

      {/* 2 COLUMNS LAYOUT: CONTACT INFO ON LEFT, FORM ON RIGHT */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* LEFT COLUMN: CONTACT INFO & HUB CARDS (5/12 Grid) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Emergency / Support Info Box */}
          <div className="bg-[#014485] text-white p-6 rounded-3xl space-y-3 shadow-sm">
            <span className="text-[10px] font-bold uppercase tracking-widest bg-white/20 text-white px-3 py-1 rounded-full inline-block font-mono">
              24/7 FREIGHT SUPPORT
            </span>
            <h3 className="text-2xl font-bold font-retro-heading uppercase">Emergency Assistance</h3>
            <p className="text-gray-200 text-xs font-medium leading-relaxed">
              Have an urgent air waybill dispatch, flight luggage booking, or escrow release inquiry? Contact our regional dispatch center directly.
            </p>
            <div className="pt-2 space-y-2 text-xs font-bold">
              <div className="flex items-center gap-2 text-white">
                <Phone size={16} className="text-gray-300" />
                <span>Phone: (+250) 788 123 456</span>
              </div>
              <div className="flex items-center gap-2 text-white">
                <Mail size={16} className="text-gray-300" />
                <span>Email: support@diasporalink.com</span>
              </div>
            </div>
          </div>

          {/* Hub 1: Kigali */}
          <div className="bg-[#F8F8F8] p-6 rounded-3xl space-y-3 border border-gray-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#014485] text-white rounded-xl flex items-center justify-center shrink-0">
                <Building2 size={20} />
              </div>
              <div>
                <h4 className="text-lg font-bold text-black font-retro-heading uppercase">Kigali Cargo Hub 01</h4>
                <p className="text-[11px] text-gray-500 font-medium">Special Economic Zone • Rwanda</p>
              </div>
            </div>
            <div className="space-y-1.5 text-xs text-gray-600 font-medium pt-2 border-t border-gray-200">
              <p className="flex items-center gap-2">
                <MapPin size={14} className="text-black shrink-0" />
                <span>KG 7 Ave, Special Economic Zone, Kigali</span>
              </p>
              <p className="flex items-center gap-2">
                <Clock size={14} className="text-black shrink-0" />
                <span>Mon – Sat: 8:00 AM – 7:00 PM (CAT)</span>
              </p>
            </div>
          </div>

          {/* Hub 2: Toronto */}
          <div className="bg-[#F8F8F8] p-6 rounded-3xl space-y-3 border border-gray-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#17993b] text-white rounded-xl flex items-center justify-center shrink-0">
                <Building2 size={20} />
              </div>
              <div>
                <h4 className="text-lg font-bold text-black font-retro-heading uppercase">Toronto Cargo Hub 02</h4>
                <p className="text-[11px] text-gray-500 font-medium">Pearson Terminal 3 Cargo • Canada</p>
              </div>
            </div>
            <div className="space-y-1.5 text-xs text-gray-600 font-medium pt-2 border-t border-gray-200">
              <p className="flex items-center gap-2">
                <MapPin size={14} className="text-black shrink-0" />
                <span>YYZ Pearson Airport Cargo Terminal, ON</span>
              </p>
              <p className="flex items-center gap-2">
                <Clock size={14} className="text-black shrink-0" />
                <span>Mon – Fri: 9:00 AM – 6:00 PM (EST)</span>
              </p>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: CONTACT FORM (7/12 Grid) */}
        <div className="lg:col-span-7 bg-[#F8F8F8] p-8 sm:p-10 rounded-3xl border border-gray-100">
          {sent ? (
            <div className="text-center py-12 space-y-4">
              <div className="w-16 h-16 bg-[#17993b] text-white rounded-full flex items-center justify-center mx-auto shadow-md">
                <CheckCircle2 size={36} />
              </div>
              <h3 className="text-2xl font-bold text-black font-retro-heading uppercase">Message Sent Successfully!</h3>
              <p className="text-gray-600 text-xs font-medium max-w-sm mx-auto">
                Thank you for contacting Nile Express Cargo. A dispatch officer will get back to you within 2 business hours.
              </p>
              <button
                onClick={() => setSent(false)}
                className="mt-4 px-6 py-2.5 bg-[#014485] text-white font-bold text-xs uppercase tracking-wider rounded-xl hover:bg-[#013467] transition cursor-pointer"
              >
                Send Another Message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-1">
                <h3 className="text-2xl font-bold text-black font-retro-heading uppercase">Send Direct Inquiry</h3>
                <p className="text-xs text-gray-500 font-medium">Fill out the form below for custom freight quotes, vendor onboarding, or general support.</p>
              </div>

              <div>
                <label className="font-bold text-[#111111] uppercase tracking-wider block mb-2 text-xs">Full Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full p-3.5 bg-white border border-gray-200 rounded-xl text-xs font-bold focus:outline-none focus:border-[#014485]"
                  placeholder="Grace Mutoni"
                />
              </div>

              <div>
                <label className="font-bold text-[#111111] uppercase tracking-wider block mb-2 text-xs">Email Address</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full p-3.5 bg-white border border-gray-200 rounded-xl text-xs font-bold focus:outline-none focus:border-[#014485]"
                  placeholder="name@diasporalink.com"
                />
              </div>

              <div>
                <label className="font-bold text-[#111111] uppercase tracking-wider block mb-2 text-xs">Message Details</label>
                <textarea
                  required
                  rows={5}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full p-3.5 bg-white border border-gray-200 rounded-xl text-xs font-bold focus:outline-none focus:border-[#014485]"
                  placeholder="How can we assist with your cross-border trade shipment, luggage dispatch, or escrow verification?"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-[#014485] hover:bg-[#013467] text-white font-bold py-4 rounded-xl uppercase tracking-widest text-xs cursor-pointer shadow-md transition flex items-center justify-center gap-2 mt-2"
              >
                <Send size={16} />
                <span>Send Message</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </main>
  );
}
