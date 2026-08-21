'use client';
import React, { useState } from 'react';
import { X, Lock, LogIn, ShieldCheck, Plane, User, CheckCircle2 } from 'lucide-react';
import { useAuthStore } from '@/store/useAuthStore';
import { dbService } from '@/services/db';
import toast from 'react-hot-toast';

interface CargoAuthRequiredModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAuthenticated: () => void;
}

export function CargoAuthRequiredModal({ isOpen, onClose, onAuthenticated }: CargoAuthRequiredModalProps) {
  const { setUser } = useAuthStore();
  const [email, setEmail] = useState('grace.akello@diaspora.ca');
  const [password, setPassword] = useState('password123');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const userProfile = await dbService.signInWithSupabase(email, password);
      setUser(userProfile);
      toast.success(`Welcome back, ${userProfile.full_name}! Account authenticated.`);
      onAuthenticated();
      onClose();
    } catch (e: any) {
      toast.error('Sign in failed. Please check credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickLoginAs = async (quickEmail: string) => {
    setLoading(true);
    try {
      const userProfile = await dbService.signInWithSupabase(quickEmail, 'password123');
      setUser(userProfile);
      toast.success(`Signed in as ${userProfile.full_name}!`);
      onAuthenticated();
      onClose();
    } catch (e: any) {
      toast.error('Quick login failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl border-2 border-black overflow-hidden text-black font-sans">
        {/* Modal Header */}
        <div className="bg-black text-white p-6 border-b border-gray-800 space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-white text-black rounded-xl">
                <Lock className="w-5 h-5" />
              </div>
              <span className="text-xs font-black uppercase font-mono tracking-wider">Account Authentication Required</span>
            </div>
            <button onClick={onClose} className="p-1 text-gray-400 hover:text-white">
              <X className="w-5 h-5" />
            </button>
          </div>
          <h2 className="text-xl font-black font-retro-heading">Sign In to Book & Track Cargo</h2>
          <p className="text-xs text-gray-300 font-medium leading-relaxed">
            Please log in to your account to issue AWB tracking seals, assign passenger couriers, and track your packages in real-time.
          </p>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5">
          {/* Quick Demo Sign In Options */}
          <div className="space-y-2 text-xs font-mono">
            <label className="block font-bold text-gray-700 uppercase">Quick Demo Authentication:</label>
            <div className="grid grid-cols-1 gap-2">
              <button
                type="button"
                onClick={() => handleQuickLoginAs('grace.akello@diaspora.ca')}
                className="p-3 bg-gray-50 border border-black rounded-xl text-left hover:bg-black hover:text-white transition group flex items-center justify-between"
              >
                <div>
                  <span className="font-bold block">Grace Akello (Sender / Exporter)</span>
                  <span className="text-[10px] opacity-70">grace.akello@diaspora.ca</span>
                </div>
                <CheckCircle2 className="w-4 h-4 text-black group-hover:text-white" />
              </button>

              <button
                type="button"
                onClick={() => handleQuickLoginAs('david.mugisha@rwandair.com')}
                className="p-3 bg-gray-50 border border-black rounded-xl text-left hover:bg-black hover:text-white transition group flex items-center justify-between"
              >
                <div>
                  <span className="font-bold block">David Mugisha (Air Courier)</span>
                  <span className="text-[10px] opacity-70">david.mugisha@rwandair.com</span>
                </div>
                <CheckCircle2 className="w-4 h-4 text-black group-hover:text-white" />
              </button>
            </div>
          </div>

          <div className="relative flex py-1 items-center">
            <div className="flex-grow border-t border-gray-300" />
            <span className="flex-shrink mx-3 text-[10px] text-gray-500 font-bold uppercase font-mono">Or Log In With Password</span>
            <div className="flex-grow border-t border-gray-300" />
          </div>

          {/* Login Form */}
          <form onSubmit={handleLoginSubmit} className="space-y-3 text-xs">
            <div>
              <label className="block font-bold text-black mb-1">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:outline-none"
                placeholder="your.email@example.com"
              />
            </div>

            <div>
              <label className="block font-bold text-black mb-1">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-black hover:bg-gray-800 text-white font-black text-xs uppercase tracking-wider rounded-xl transition-all shadow-md font-mono flex items-center justify-center space-x-2"
            >
              <LogIn className="w-4 h-4 text-white" />
              <span>{loading ? 'Authenticating...' : 'Sign In & Continue Booking'}</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
