'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { User, Mail, Lock, ChevronRight, ArrowLeft, Eye, EyeOff } from 'lucide-react';
import { useAuthStore } from '@/store/useAuthStore';
import { UserRole } from '@/types';

export default function RegisterPage() {
  const router = useRouter();
  const { registerUser } = useAuthStore();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [role, setRole] = useState<UserRole>('buyer');
  const [taxId, setTaxId] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match. Please re-enter your password.');
      return;
    }

    setIsSubmitting(true);
    try {
      const createdUser = await registerUser({
        email,
        password,
        full_name: fullName,
        role,
        taxId,
      });
      setIsSubmitting(false);

      if (createdUser.role === 'admin') router.push('/admin');
      else if (createdUser.role === 'vendor_rwanda') router.push('/vendor-rwanda');
      else if (createdUser.role === 'vendor_canada') router.push('/vendor-canada');
      else if (createdUser.role === 'logistics_courier') router.push('/logistics');
      else router.push('/buyer');
    } catch (err: any) {
      setIsSubmitting(false);
      setErrorMessage(err.message || 'Registration failed.');
    }
  };

  return (
    <main className="h-screen w-full bg-white text-[#111111] font-sans flex flex-col lg:flex-row overflow-hidden relative">
      {/* LEFT COLUMN: FULL HEIGHT LIFESTYLE IMAGE WITH FLOATING BACK BUTTON & OVERLAYED TEXT */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-[#F7F2EC] h-screen overflow-hidden group">
        {/* Floating Back Button on Top Left of Image Column */}
        <Link
          href="/"
          className="absolute top-8 left-8 z-20 inline-flex items-center gap-2 bg-white/90 hover:bg-white text-black text-xs font-bold px-4 py-2.5 rounded-full shadow-md transition group/btn cursor-pointer"
        >
          <ArrowLeft size={14} className="group-hover/btn:-translate-x-0.5 transition" />
          <span>Back to Home</span>
        </Link>

        <img
          src="https://images.unsplash.com/photo-1544816155-12df9643f363?q=80&w=1400&auto=format&fit=crop"
          alt="Magic Link Registration"
          className="w-full h-full object-cover group-hover:scale-105 transition duration-700"
        />
        {/* Soft Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />

        {/* Overlayed Text at Bottom */}
        <div className="absolute bottom-12 left-12 right-12 z-10 text-white space-y-3">
          <span className="text-xs font-bold uppercase tracking-widest bg-white text-black px-3.5 py-1.5 rounded-full inline-block font-mono">
            JOIN THE TRADE PROTOCOL
          </span>
          <h2 className="text-3xl lg:text-5xl font-black font-retro-heading leading-tight uppercase">
            Empowering Producers, Importers & Couriers
          </h2>
          <p className="text-gray-200 text-sm lg:text-base font-medium max-w-lg leading-relaxed">
            Register your buyer, vendor, or courier travel profile to unlock automated 256-bit escrow guarantees.
          </p>
        </div>
      </div>

      {/* RIGHT COLUMN: CENTERED AUTH FORM */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 lg:p-14 h-screen bg-white overflow-y-auto relative">
        {/* Mobile Back Button */}
        <Link
          href="/"
          className="lg:hidden absolute top-6 left-6 inline-flex items-center gap-1.5 text-xs font-bold text-gray-500 hover:text-black transition"
        >
          <ArrowLeft size={14} /> Back Home
        </Link>

        <div className="max-w-md w-full space-y-5">
          {/* Logo & Title */}
          <div className="text-center space-y-2">
            <Link href="/" className="inline-block">
              <div className="w-14 h-14 rounded-2xl overflow-hidden border border-gray-200 mx-auto shadow-xs">
                <img src="/icon.png" alt="Magic Link Logo" className="w-full h-full object-cover" />
              </div>
            </Link>
            <h1 className="text-3xl lg:text-4xl font-black text-[#111111] font-retro-heading uppercase tracking-tight">
              Create Your Account
            </h1>
            <p className="text-sm text-gray-600 font-medium">
              Join the official Magic Link cross-border trade network today.
            </p>
          </div>

          {errorMessage && (
            <div className="bg-red-50 text-red-700 text-xs font-bold p-3 rounded-xl border border-red-200 text-center">
              {errorMessage}
            </div>
          )}

          <form onSubmit={handleRegisterSubmit} className="space-y-4 text-sm font-medium">
            <div>
              <label className="font-bold text-[#111111] uppercase tracking-wider block mb-2 text-xs">Full Name / Business Name</label>
              <div className="relative">
                <User size={18} className="absolute left-3.5 top-3.5 text-gray-400" />
                <input
                  type="text"
                  required
                  placeholder="Grace Mutoni or Gishwati Coop"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 bg-white border border-gray-300 rounded-xl font-bold text-sm text-black focus:outline-none focus:border-black"
                />
              </div>
            </div>

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
                  className="w-full pl-11 pr-4 py-3 bg-white border border-gray-300 rounded-xl font-bold text-sm text-black focus:outline-none focus:border-black"
                />
              </div>
            </div>

            <div>
              <label className="font-bold text-[#111111] uppercase tracking-wider block mb-2 text-xs">Password</label>
              <div className="relative">
                <Lock size={18} className="absolute left-3.5 top-3.5 text-gray-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-11 pr-11 py-3 bg-white border border-gray-300 rounded-xl font-bold text-sm text-black focus:outline-none focus:border-black"
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

            <div>
              <label className="font-bold text-[#111111] uppercase tracking-wider block mb-2 text-xs">Confirm Password</label>
              <div className="relative">
                <Lock size={18} className="absolute left-3.5 top-3.5 text-gray-400" />
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  required
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full pl-11 pr-11 py-3 bg-white border border-gray-300 rounded-xl font-bold text-sm text-black focus:outline-none focus:border-black"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3.5 top-3.5 text-gray-400 hover:text-black cursor-pointer"
                  title={showConfirmPassword ? 'Hide password' : 'Show password'}
                >
                  {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div>
              <label className="font-bold text-[#111111] uppercase tracking-wider block mb-2 text-xs">Account Role</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as UserRole)}
                className="w-full p-3 bg-white border border-gray-300 rounded-xl font-bold text-xs uppercase focus:outline-none focus:border-black text-[#111111] cursor-pointer"
              >
                <option value="buyer">Buyer / Shopper (Diaspora)</option>
                <option value="vendor_rwanda">Rwanda Vendor / Exporter Cooperative</option>
                <option value="vendor_canada">Canada Vendor / Importer Business</option>
                <option value="logistics_courier">Air Courier (Luggage Traveler)</option>
              </select>
            </div>

            {role !== 'buyer' && role !== 'admin' && (
              <div>
                <label className="font-bold text-[#111111] uppercase tracking-wider block mb-2 text-xs">
                  {role === 'vendor_rwanda' ? 'Tax ID Number' : role === 'vendor_canada' ? 'CRA Business Number' : 'Flight Ticket PNR'}
                </label>
                <input
                  type="text"
                  required
                  placeholder={role === 'vendor_rwanda' ? 'TIN-109283745' : 'BN-884920194'}
                  value={taxId}
                  onChange={(e) => setTaxId(e.target.value)}
                  className="w-full p-3 bg-white border border-gray-300 rounded-xl font-mono font-bold text-sm text-black"
                />
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-black hover:bg-gray-800 text-white font-bold py-4 rounded-xl uppercase tracking-widest transition flex items-center justify-center gap-2 text-xs cursor-pointer shadow-md mt-1 disabled:opacity-50"
            >
              <span>{isSubmitting ? 'Registering...' : 'REGISTER ACCOUNT'}</span>
              <ChevronRight size={18} />
            </button>
          </form>

          <div className="pt-3 border-t border-gray-100 text-center text-sm text-gray-600 font-medium">
            Already have an account?{' '}
            <Link href="/login" className="font-bold text-black underline">
              Sign In Here
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
