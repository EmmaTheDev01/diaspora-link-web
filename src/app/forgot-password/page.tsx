'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { Mail, ArrowLeft, CheckCircle2 } from 'lucide-react';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleResetSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
  };

  return (
    <main className="h-screen w-full bg-white text-[#111111] font-sans flex flex-col lg:flex-row overflow-hidden relative">
      {/* LEFT COLUMN: FULL HEIGHT LIFESTYLE IMAGE WITH FLOATING BACK BUTTON & OVERLAYED TEXT */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-[#E3F6FA] h-screen overflow-hidden group">
        {/* Floating Back Button on Top Left of Image Column */}
        <Link
          href="/"
          className="absolute top-8 left-8 z-20 inline-flex items-center gap-2 bg-white/90 hover:bg-white text-black text-xs font-bold px-4 py-2.5 rounded-full shadow-md transition group/btn cursor-pointer"
        >
          <ArrowLeft size={14} className="group-hover/btn:-translate-x-0.5 transition" />
          <span>Back to Home</span>
        </Link>

        <img
          src="https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?q=80&w=1400&auto=format&fit=crop"
          alt="Magic Link Password Reset"
          className="w-full h-full object-cover group-hover:scale-105 transition duration-700"
        />
        {/* Soft Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />

        {/* Overlayed Text at Bottom */}
        <div className="absolute bottom-12 left-12 right-12 z-10 text-white space-y-3">
          <span className="text-xs font-bold uppercase tracking-widest bg-white text-black px-3.5 py-1.5 rounded-full inline-block font-mono">
            SECURITY PROTOCOL
          </span>
          <h2 className="text-3xl lg:text-5xl font-black font-retro-heading leading-tight uppercase">
            Account Recovery & Verification
          </h2>
          <p className="text-gray-200 text-sm lg:text-base font-medium max-w-lg leading-relaxed">
            Reset your account credentials securely to restore access to your trade dashboards and escrow holdings.
          </p>
        </div>
      </div>

      {/* RIGHT COLUMN: CENTERED AUTH FORM */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 lg:p-16 h-screen bg-white overflow-y-auto relative">
        {/* Mobile Back Button */}
        <Link
          href="/"
          className="lg:hidden absolute top-6 left-6 inline-flex items-center gap-1.5 text-xs font-bold text-gray-500 hover:text-black transition"
        >
          <ArrowLeft size={14} /> Back Home
        </Link>

        <div className="max-w-md w-full space-y-7">
          {/* Logo & Title */}
          <div className="text-center space-y-3">
            <Link href="/" className="inline-block">
              <div className="w-14 h-14 rounded-2xl overflow-hidden border border-gray-200 mx-auto shadow-xs">
                <img src="/icon.png" alt="Nile Express Cargo Logo" className="w-full h-full object-cover" />
              </div>
            </Link>

            <h1 className="text-3xl lg:text-4xl font-black text-[#111111] font-retro-heading uppercase tracking-tight">
              Reset Your Password
            </h1>
            <p className="text-sm text-gray-600 font-medium">
              Enter your registered email address below to receive password reset instructions.
            </p>
          </div>

          {isSubmitted ? (
            <div className="text-center space-y-4 py-4">
              <div className="w-16 h-16 bg-black text-white rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 size={36} />
              </div>
              <h3 className="font-bold text-lg text-black font-retro-heading">Reset Instructions Sent!</h3>
              <p className="text-sm text-gray-600 font-medium leading-relaxed">
                We have sent a secure password reset link to <strong className="text-black font-mono">{email}</strong>.
              </p>
              <div className="pt-2">
                <Link
                  href="/login"
                  className="w-full bg-black hover:bg-gray-800 text-white font-bold py-4 rounded-xl uppercase text-xs tracking-wider inline-block text-center shadow-md"
                >
                  Back To Sign In
                </Link>
              </div>
            </div>
          ) : (
            <form onSubmit={handleResetSubmit} className="space-y-5 text-sm font-medium">
              <div>
                <label className="font-bold text-[#111111] uppercase tracking-wider block mb-2 text-xs">Registered Email Address</label>
                <div className="relative">
                  <Mail size={18} className="absolute left-3.5 top-3.5 text-gray-400" />
                  <input
                    type="email"
                    required
                    placeholder="name@diasporalink.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-11 pr-4 py-3.5 bg-white border border-gray-300 rounded-xl font-bold text-sm text-black focus:outline-none focus:border-black"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-[#014485] hover:bg-[#013467] text-white font-bold py-4 rounded-xl uppercase tracking-widest transition text-xs cursor-pointer shadow-md mt-2"
              >
                SEND RESET LINK
              </button>

            </form>
          )}

          <div className="pt-4 border-t border-gray-100 text-center">
            <Link href="/login" className="inline-flex items-center gap-1.5 text-sm font-bold text-black hover:underline">
              <ArrowLeft size={16} /> Back to Sign In
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
