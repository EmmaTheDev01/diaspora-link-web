'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Mail, Lock, ChevronRight, ArrowLeft, Eye, EyeOff } from 'lucide-react';
import { useAuthStore } from '@/store/useAuthStore';

export default function LoginPage() {
  const router = useRouter();
  const { loginUser } = useAuthStore();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const loggedInUser = await loginUser(email, password);
      setIsSubmitting(false);

      const hasDraft = typeof window !== 'undefined' && localStorage.getItem('nile_draft_cargo');

      if (hasDraft) {
        router.push('/buyer?action=send_cargo');
      } else if (loggedInUser.role === 'admin') router.push('/admin');
      else if (loggedInUser.role === 'vendor_rwanda') router.push('/vendor-rwanda');
      else if (loggedInUser.role === 'vendor_canada') router.push('/vendor-canada');
      else if (loggedInUser.role === 'logistics_courier') router.push('/logistics');
      else router.push('/buyer');
    } catch (err) {
      setIsSubmitting(false);
    }
  };


  return (
    <main className="h-screen w-full bg-white text-[#111111] font-sans flex flex-col lg:flex-row overflow-hidden relative">
      {/* LEFT COLUMN: FULL HEIGHT LIFESTYLE IMAGE WITH FLOATING BACK BUTTON & OVERLAYED TEXT */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-[#ECEEFA] h-screen overflow-hidden group">
        {/* Floating Back Button on Top Left of Image Column */}
        <Link
          href="/"
          className="absolute top-8 left-8 z-20 inline-flex items-center gap-2 bg-white/90 hover:bg-white text-black text-xs font-bold px-4 py-2.5 rounded-full shadow-md transition group/btn cursor-pointer"
        >
          <ArrowLeft size={14} className="group-hover/btn:-translate-x-0.5 transition" />
          <span>Back to Home</span>
        </Link>

        <img
          src="https://images.unsplash.com/photo-1559056199-641a0ac8b55e?q=80&w=1400&auto=format&fit=crop"
          alt="Nile Express Cargo Trade Protocol"
          className="w-full h-full object-cover group-hover:scale-105 transition duration-700"
        />
        {/* Soft Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />

        {/* Overlayed Text at Bottom */}
        <div className="absolute bottom-12 left-12 right-12 z-10 text-white space-y-3">
          <span className="text-xs font-bold uppercase tracking-widest bg-white text-black px-3.5 py-1.5 rounded-full inline-block font-mono">
            NILE EXPRESS CARGO PROTOCOL
          </span>
          <h2 className="text-3xl lg:text-5xl font-black font-retro-heading leading-tight uppercase">
            Canada ✈ East Africa Cargo Infrastructure
          </h2>
          <p className="text-gray-200 text-sm lg:text-base font-medium max-w-lg leading-relaxed">
            Direct air flight luggage dispatch, 256-bit Escrow Vault locks, and verified trade corridors.
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
              Sign In To Nile Express Cargo
            </h1>
            <p className="text-sm text-gray-600 font-medium">
              Enter your registered email and password to access your dashboard profile.
            </p>
          </div>

          <form onSubmit={handleLoginSubmit} className="space-y-5 text-sm font-medium">


            <div>
              <label className="font-bold text-[#111111] uppercase tracking-wider block mb-2 text-xs">Email Address</label>
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

            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="font-bold text-[#111111] uppercase tracking-wider block text-xs">Password</label>
                <Link href="/forgot-password" className="text-xs text-gray-600 hover:text-black font-bold underline">
                  Forgot?
                </Link>
              </div>
              <div className="relative">
                <Lock size={18} className="absolute left-3.5 top-3.5 text-gray-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-11 pr-11 py-3.5 bg-white border border-gray-300 rounded-xl font-bold text-sm text-black focus:outline-none focus:border-black"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-3.5 text-gray-400 hover:text-black cursor-pointer"
                  title={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-[#014485] hover:bg-[#013467] text-white font-bold py-4 rounded-xl uppercase tracking-widest transition flex items-center justify-center gap-2 text-xs cursor-pointer shadow-md mt-2 disabled:opacity-50"
            >
              <span>{isSubmitting ? 'Signing In...' : 'SIGN IN'}</span>
              <ChevronRight size={18} />
            </button>

          </form>

          <div className="pt-4 border-t border-gray-100 text-center text-sm text-gray-600 font-medium">
            Don't have an account yet?{' '}
            <Link href="/register" className="font-bold text-black underline">
              Create Account
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
