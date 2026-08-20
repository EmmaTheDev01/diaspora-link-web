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
        <span className="text-xs font-bold uppercase tracking-widest bg-black text-white px-3.5 py-1 rounded-full block w-fit font-mono">
          HUB LOCATIONS & SUPPORT
        </span>
        <h1 className="text-4xl lg:text-5xl font-black text-[#111111] font-retro-heading uppercase tracking-tight">
          Contact Magic Link
        </h1>
        <p className="text-gray-500 text-sm font-medium">Reach our dedicated trade hubs in Kigali, Rwanda and Toronto, Canada.</p>
      </div>

      {/* 2 COLUMNS LAYOUT: CONTACT INFO ON LEFT, FORM ON RIGHT */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* LEFT COLUMN: CONTACT INFO & HUB CARDS (5/12 Grid) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Emergency / Support Info Box */}
          <div className="bg-black text-white p-6 rounded-3xl space-y-3 shadow-sm">
            <span className="text-[10px] font-bold uppercase tracking-widest bg-white/20 text-white px-3 py-1 rounded-full inline-block font-mono">
              24/7 FREIGHT SUPPORT
            </span>
            <h3 className="text-2xl font-bold font-retro-heading uppercase">Emergency Assistance</h3>
            <p className="text-gray-300 text-xs font-medium leading-relaxed">
              Have an urgent air waybill dispatch, flight luggage booking, or escrow release inquiry? Contact our regional dispatch center directly.
            </p>
            <div className="pt-2 space-y-2 text-xs font-bold">
              <div className="flex items-center gap-2 text-white">
                <Phone size={16} className="text-gray-400" />
                <span>Phone: (+250) 788 123 456</span>
              </div>
              <div className="flex items-center gap-2 text-white">
                <Mail size={16} className="text-gray-400" />
                <span>Email: support@diasporalink.com</span>
              </div>
            </div>
          </div>

          {/* Hub 1: Kigali */}
          <div className="bg-[#F8F8F8] p-6 rounded-3xl space-y-3 border border-gray-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-black text-white rounded-xl flex items-center justify-center shrink-0">
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
              <div className="w-10 h-10 bg-black text-white rounded-xl flex items-center justify-center shrink-0">
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

        {/* RIGHT COLUMN: EXPANDED TEXT CONTACT FORM (7/12 Grid) */}
        <div className="lg:col-span-7 bg-[#F8F8F8] p-8 lg:p-12 rounded-3xl border border-gray-100 space-y-6 shadow-xs">
          <div className="space-y-3">
            <h3 className="text-2xl lg:text-3xl font-bold text-black font-retro-heading uppercase">
              Send Us a Direct Message
            </h3>
            <p className="text-xs lg:text-sm text-gray-600 font-medium leading-relaxed">
              Fill out the message form below to reach our dedicated trade corridor logistics and support team. Whether you are inquiring about Kigali (KGL) to Toronto (YYZ) passenger air freight luggage dispatches, 256-bit Escrow Vault PIN release verification, exporter product listings, or customs declarations, our specialists inspect incoming messages in real-time and will get back to you within 1 business hour.
            </p>
          </div>

          {sent ? (
            <div className="text-center space-y-3 py-12">
              <CheckCircle2 size={56} className="text-black mx-auto" />
              <h4 className="font-bold text-xl text-black font-retro-heading">Message Received!</h4>
              <p className="text-sm text-gray-600 font-medium">Our trade corridor support team will respond to your inquiry shortly.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5 text-xs font-medium">
              <div>
                <label className="font-bold text-[#111111] uppercase tracking-wider block mb-2 text-xs">Your Full Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full p-3.5 bg-white border border-gray-200 rounded-xl text-xs font-bold focus:outline-none focus:border-black"
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
                  className="w-full p-3.5 bg-white border border-gray-200 rounded-xl text-xs font-bold focus:outline-none focus:border-black"
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
                  className="w-full p-3.5 bg-white border border-gray-200 rounded-xl text-xs font-bold focus:outline-none focus:border-black"
                  placeholder="How can we assist with your cross-border trade shipment, luggage dispatch, or escrow verification?"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-black hover:bg-gray-800 text-white font-bold py-4 rounded-xl uppercase tracking-widest text-xs cursor-pointer shadow-md transition flex items-center justify-center gap-2 mt-2"
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
