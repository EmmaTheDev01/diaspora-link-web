'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { X, User, Mail, ChevronRight, Lock } from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';
import { UserRole } from '../../types';

export function AuthModal() {
  const router = useRouter();
  const { isAuthModalOpen, closeAuthModal, loginUser, registerUser } = useAuthStore();
  const [tab, setTab] = useState<'login' | 'register'>('login');
  const [role, setRole] = useState<UserRole>('buyer');
  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [taxId, setTaxId] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);


  if (!isAuthModalOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const loggedInUser = tab === 'register'
        ? await registerUser({ email: email || 'user@diasporalink.com', full_name: fullName || 'User Account', role, taxId })
        : await loginUser(email || 'user@diasporalink.com', undefined, role, taxId);
      setIsSubmitting(false);

      if (loggedInUser.role === 'admin') router.push('/admin');
      else if (loggedInUser.role === 'vendor_rwanda') router.push('/vendor-rwanda');
      else if (loggedInUser.role === 'vendor_canada') router.push('/vendor-canada');
      else if (loggedInUser.role === 'logistics_courier') router.push('/logistics');
      else router.push('/buyer');
    } catch (err) {
      setIsSubmitting(false);
    }
  };

  const handleQuickLogin = async (selectedRole: UserRole) => {
    setIsSubmitting(true);
    try {
      const loggedInUser = await loginUser(`${selectedRole}@diasporalink.com`, undefined, selectedRole);
      setIsSubmitting(false);

      if (selectedRole === 'admin') router.push('/admin');
      else if (selectedRole === 'vendor_rwanda') router.push('/vendor-rwanda');
      else if (selectedRole === 'vendor_canada') router.push('/vendor-canada');
      else if (selectedRole === 'logistics_courier') router.push('/logistics');
      else router.push('/buyer');
    } catch (err) {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs font-sans">
      <div className="bg-white rounded-2xl max-w-md w-full overflow-hidden shadow-2xl border border-gray-200 relative p-6 lg:p-8">
        <button onClick={closeAuthModal} className="absolute top-4 right-4 text-black hover:opacity-60 p-1 cursor-pointer">
          <X size={20} />
        </button>

        <div className="text-center space-y-2 mb-6">
          <div className="w-12 h-12 rounded-xl overflow-hidden border border-gray-200 mx-auto shadow-xs">
            <img src="/icon.png" alt="Nile Express Cargo Logo" className="w-full h-full object-cover" />
          </div>
          <h3 className="text-2xl font-black text-[#111111] font-retro-heading uppercase tracking-tight">Nile Express Cargo</h3>
          <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">Canada ✈ East Africa Freight Logistics</p>

        </div>

        <div className="flex bg-gray-100 p-1 rounded-xl mb-6 text-xs font-bold uppercase">
          <button
            onClick={() => setTab('login')}
            className={`flex-1 py-2.5 rounded-lg transition cursor-pointer ${tab === 'login' ? 'bg-[#014485] text-white' : 'text-gray-700 hover:bg-gray-200'}`}
          >
            Sign In
          </button>
          <button
            onClick={() => setTab('register')}
            className={`flex-1 py-2.5 rounded-lg transition cursor-pointer ${tab === 'register' ? 'bg-[#014485] text-white' : 'text-gray-700 hover:bg-gray-200'}`}
          >
            Create Account
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs font-medium">
          {tab === 'register' && (
            <div>
              <label className="font-bold text-[#111111] uppercase tracking-wider block mb-1">Full Name / Business Name</label>
              <div className="relative">
                <User size={16} className="absolute left-3 top-3 text-gray-400" />
                <input
                  type="text"
                  required
                  placeholder="Grace Mutoni or Gishwati Coop"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full pl-10 pr-3 py-2.5 bg-gray-50 border border-gray-300 rounded-lg font-bold text-sm focus:outline-none focus:border-[#014485]"
                />
              </div>
            </div>
          )}

          <div>
            <label className="font-bold text-[#111111] uppercase tracking-wider block mb-1">Email Address</label>
            <div className="relative">
              <Mail size={16} className="absolute left-3 top-3 text-gray-400" />
              <input
                type="email"
                required
                placeholder="you@domain.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-3 py-2.5 bg-gray-50 border border-gray-300 rounded-lg font-bold text-sm focus:outline-none focus:border-[#014485]"
              />
            </div>
          </div>

          <div>
            <label className="font-bold text-[#111111] uppercase tracking-wider block mb-1">Password</label>
            <div className="relative">
              <Lock size={16} className="absolute left-3 top-3 text-gray-400" />
              <input
                type="password"
                required
                placeholder="••••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-3 py-2.5 bg-gray-50 border border-gray-300 rounded-lg font-bold text-sm focus:outline-none focus:border-[#014485]"
              />
            </div>
          </div>

          {tab === 'register' && (
            <div>
              <label className="font-bold text-[#111111] uppercase tracking-wider block mb-1">Account Role Profile</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as any)}
                className="w-full p-2.5 bg-gray-50 border border-gray-300 rounded-lg font-bold text-sm"
              >
                <option value="buyer">Diaspora Buyer (Canada / Worldwide)</option>
                <option value="vendor_rwanda">Rwanda Exporter / Cooperative (RDB Verified)</option>
                <option value="vendor_canada">Canada Importer / Distributor (CRA Verified)</option>
                <option value="logistics_courier">Air Courier (Flight Baggage Monetization)</option>
              </select>
            </div>
          )}

          {(role === 'vendor_rwanda' || role === 'vendor_canada') && tab === 'register' && (
            <div>
              <label className="font-bold text-[#111111] uppercase tracking-wider block mb-1">
                {role === 'vendor_rwanda' ? 'RDB TIN Number *' : 'CRA Business Number (BN) *'}
              </label>
              <input
                type="text"
                required
                placeholder={role === 'vendor_rwanda' ? 'TIN-109283745' : 'BN-884920194'}
                value={taxId}
                onChange={(e) => setTaxId(e.target.value)}
                className="w-full p-3 bg-gray-50 border border-gray-300 rounded-lg font-mono font-bold text-sm"
              />
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-[#014485] hover:bg-[#013467] text-white font-bold py-3.5 rounded-xl uppercase tracking-widest transition flex items-center justify-center gap-2 text-xs cursor-pointer shadow-md mt-2 disabled:opacity-50"
          >
            <span>{isSubmitting ? 'Authenticating...' : tab === 'login' ? 'Sign In & Launch Dashboard' : 'Submit Account Registration'}</span>
            <ChevronRight size={16} />
          </button>
        </form>

        <div className="mt-6 pt-4 border-t border-gray-100 text-[11px] text-center text-gray-500">
          <p className="font-bold text-[#111111] uppercase tracking-wider mb-2">Quick Test One-Click Role Sign In:</p>
          <div className="flex flex-wrap gap-1.5 justify-center font-bold uppercase text-[10px]">
            <button onClick={() => handleQuickLogin('buyer')} className="bg-black text-white px-2.5 py-1 rounded cursor-pointer">Buyer</button>
            <button onClick={() => handleQuickLogin('vendor_rwanda')} className="bg-black text-white px-2.5 py-1 rounded cursor-pointer">Exporter (RW)</button>
            <button onClick={() => handleQuickLogin('vendor_canada')} className="bg-black text-white px-2.5 py-1 rounded cursor-pointer">Importer (CA)</button>
            <button onClick={() => handleQuickLogin('logistics_courier')} className="bg-black text-white px-2.5 py-1 rounded cursor-pointer">Courier</button>
            <button onClick={() => handleQuickLogin('admin')} className="bg-black text-white px-2.5 py-1 rounded cursor-pointer">Admin</button>
          </div>
        </div>
      </div>
    </div>
  );
}
