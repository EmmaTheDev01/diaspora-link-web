'use client';
import React, { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import {
  Phone,
  Clock,
  Search,
  User,
  Heart,
  ShoppingCart,
  Globe,
  ShieldCheck,
  LogOut,
  X,
  ChevronDown,
  ChevronRight,
  LayoutDashboard,
  Package,
  Menu,
  Plane,
} from 'lucide-react';

import { useAuthStore } from '../../store/useAuthStore';
import { useCartStore } from '../../store/useCartStore';

export function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const { user, currency, setCurrency, logout, autoDetectRegion, initAuth } = useAuthStore();
  const { items, openCartDrawer } = useCartStore();
  const [mounted, setMounted] = useState(false);

  // Search & Profile Dropdown states
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const [headerSearchQuery, setHeaderSearchQuery] = useState('');

  const searchInputRef = useRef<HTMLInputElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
    autoDetectRegion();
    initAuth();
  }, [autoDetectRegion, initAuth]);

  useEffect(() => {
    if (isSearchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isSearchOpen]);

  // Click outside to close user dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Hide default header on auth pages and dashboard routes
  const isAuthPage = pathname === '/login' || pathname === '/register' || pathname === '/forgot-password';
  const isDashboardPage =
    pathname.startsWith('/buyer') ||
    pathname.startsWith('/vendor') ||
    pathname.startsWith('/logistics') ||
    pathname.startsWith('/admin') ||
    pathname.startsWith('/dashboard') ||
    pathname.startsWith('/pending-approval');

  if (isAuthPage || isDashboardPage) return null;

  const cartCount = items.reduce((acc, i) => acc + i.quantity, 0);

  const getDashboardRoute = () => {
    if (!user) return '/buyer';
    if (user.role === 'admin') return '/admin';
    if (user.role === 'vendor_rwanda') return '/vendor-rwanda';
    if (user.role === 'vendor_canada') return '/vendor-canada';
    if (user.role === 'logistics_courier') return '/logistics';
    return '/buyer';
  };

  const handleHeaderSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (headerSearchQuery.trim()) {
      router.push(`/products?search=${encodeURIComponent(headerSearchQuery.trim())}`);
      setIsSearchOpen(false);
    } else {
      router.push('/products');
    }
  };

  return (
    <header className="w-full bg-white text-[#111111] border-b border-gray-100 sticky top-0 z-50 font-sans">
      {/* Top Announcement Bar */}
      <div className="border-b border-gray-100 py-2 px-3 sm:px-4 text-xs text-gray-500 font-medium">
        <div className="max-w-7xl mx-auto flex justify-between items-center gap-2">
          <div className="flex items-center gap-1.5 text-[11px] sm:text-xs">
            <Phone size={13} className="text-gray-400 shrink-0" />
            <span className="truncate">Emergency Hotline: <strong className="text-[#111111] font-bold">(+250) 788 123 456</strong></span>
          </div>

          <div className="hidden lg:block text-center text-gray-600">
            1st Time Buyer? Use Promocode <strong className="bg-[#17993b] text-white px-2 py-0.5 font-bold">NILE10</strong> For 10% OFF!
          </div>

          <div className="flex items-center gap-3 sm:gap-4 shrink-0">
            <div className="hidden md:flex items-center gap-1.5 text-gray-500">
              <Clock size={13} />
              <span>FREIGHT PROTOCOL: <strong className="text-[#014485]">YYZ ✈ KGL Direct Flight Active</strong></span>
            </div>


            {/* Currency Switcher */}
            <button
              onClick={() => setCurrency(currency === 'CAD' ? 'RWF' : 'CAD')}
              className="bg-gray-100 hover:bg-gray-200 text-[#111111] px-2 py-0.5 rounded text-[11px] font-bold transition flex items-center gap-1 cursor-pointer"
            >
              <Globe size={11} />
              <span>{mounted ? (currency === 'CAD' ? 'CAD ($)' : 'RWF') : 'CAD ($)'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Header Menu Row */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-3.5 sm:py-4 flex items-center justify-between gap-2 sm:gap-4 relative">
        {/* Nile Express Cargo Logo */}
        <Link href="/" className="flex items-center gap-2 sm:gap-3 group shrink-0">
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl overflow-hidden shrink-0 shadow-xs group-hover:scale-105 transition bg-white border border-gray-200 p-1">
            <img src="/icon.png" alt="Nile Express Cargo Logo" className="w-full h-full object-contain" />
          </div>

          <div className="hidden sm:block min-w-0">
            <div className="font-black text-xl lg:text-2xl tracking-tight text-[#111111] font-retro-heading flex items-center gap-1 truncate uppercase">
              NILE EXPRESS CARGO
            </div>
            <p className="text-[9px] lg:text-[10px] text-gray-400 font-bold uppercase tracking-wider truncate">Canada ✈ East Africa Freight Logistics</p>
          </div>
        </Link>


        {/* Navigation Links */}
        <nav className="hidden md:flex items-center gap-6 text-xs font-black uppercase tracking-wider font-mono text-[#111111]">
          <Link href="/" className={`hover:text-[#014485] transition ${pathname === '/' ? 'text-[#014485] border-b-2 border-[#014485] pb-1 font-black' : ''}`}>
            Cargo Hub
          </Link>
          <Link href="/products" className={`hover:text-[#014485] transition ${pathname === '/products' ? 'text-[#014485] border-b-2 border-[#014485] pb-1 font-black' : ''}`}>
            Marketplace
          </Link>
          <Link href="/about" className={`hover:text-[#014485] transition ${pathname === '/about' ? 'text-[#014485] border-b-2 border-[#014485] pb-1' : ''}`}>
            About
          </Link>
          <Link href="/contact" className={`hover:text-[#014485] transition ${pathname === '/contact' ? 'text-[#014485] border-b-2 border-[#014485] pb-1' : ''}`}>
            Contact
          </Link>
        </nav>




        {/* Right Action Icons (Search, User Avatar Dropdown, Wishlist, Cart) */}
        <div className="flex items-center gap-5 text-[#111111] relative">
          {/* Toggleable Inline Search Bar */}
          {isSearchOpen ? (
            <form
              onSubmit={handleHeaderSearchSubmit}
              className="flex items-center gap-2 bg-gray-100 px-3 py-1.5 rounded-full border border-gray-300 animate-in fade-in zoom-in duration-200"
            >
              <Search size={15} className="text-gray-500 shrink-0" />
              <input
                ref={searchInputRef}
                type="text"
                placeholder="Search catalog..."
                value={headerSearchQuery}
                onChange={(e) => setHeaderSearchQuery(e.target.value)}
                className="bg-transparent text-xs font-bold text-black focus:outline-none w-36 sm:w-48"
              />
              <button
                type="button"
                onClick={() => {
                  setIsSearchOpen(false);
                  setHeaderSearchQuery('');
                }}
                className="text-gray-400 hover:text-black transition cursor-pointer"
                title="Close Search"
              >
                <X size={14} />
              </button>
            </form>
          ) : (
            <button
              onClick={() => setIsSearchOpen(true)}
              className="hover:text-gray-500 transition cursor-pointer flex items-center justify-center"
              title="Search Catalog"
            >
              <Search size={18} />
            </button>
          )}

          {/* USER AVATAR WITH INTERACTIVE DROPDOWN MENU */}
          {mounted && user ? (
            <div className="relative" ref={userMenuRef}>
              <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="flex items-center gap-2 p-1 rounded-full hover:bg-gray-100 transition cursor-pointer"
                title={`Logged in as ${user.full_name}`}
              >
                <div className="w-8 h-8 rounded-full bg-black text-white font-bold text-xs flex items-center justify-center uppercase shadow-xs overflow-hidden">
                  {user.avatar_url ? (
                    <img src={user.avatar_url} alt="Avatar" className="w-full h-full object-cover" />
                  ) : (
                    user.full_name?.charAt(0) || 'U'
                  )}
                </div>
                <span className="hidden lg:inline font-bold text-xs text-black">{user.full_name?.split(' ')[0]}</span>
                <ChevronDown size={14} className={`text-gray-500 transition transform ${isUserMenuOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* USER AVATAR DROPDOWN MENU */}
              {isUserMenuOpen && (
                <div className="absolute right-0 mt-3 w-64 bg-white rounded-2xl border border-gray-200 shadow-xl py-3 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  {/* User Profile Header Box */}
                  <div className="px-4 pb-3 border-b border-gray-100 space-y-1">
                    <div className="font-bold text-sm text-black line-clamp-1">{user.full_name}</div>
                    <div className="text-xs text-gray-500 font-mono line-clamp-1">{user.email}</div>
                    <div className="pt-1">
                      <span className="bg-black text-white text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-full inline-block font-mono">
                        {user.role?.replace('_', ' ')}
                      </span>
                    </div>
                  </div>

                  {/* Dropdown Navigation Links */}
                  <div className="py-2 px-2 text-xs font-bold space-y-1">
                    <Link
                      href={getDashboardRoute()}
                      onClick={() => setIsUserMenuOpen(false)}
                      className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-black hover:bg-gray-100 transition"
                    >
                      <LayoutDashboard size={16} />
                      <span>My Dashboard Portal</span>
                    </Link>

                    <Link
                      href="/buyer"
                      onClick={() => setIsUserMenuOpen(false)}
                      className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-black hover:bg-gray-100 transition"
                    >
                      <Package size={16} />
                      <span>My Orders & Escrow PINs</span>
                    </Link>

                    <Link
                      href="/products"
                      onClick={() => setIsUserMenuOpen(false)}
                      className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-black hover:bg-gray-100 transition"
                    >
                      <ShoppingCart size={16} />
                      <span>Shop Export Catalog</span>
                    </Link>
                  </div>

                  {/* Sign Out Button */}
                  <div className="pt-2 px-2 border-t border-gray-100">
                    <button
                      onClick={() => {
                        setIsUserMenuOpen(false);
                        logout();
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-red-600 hover:bg-red-50 text-xs font-bold transition cursor-pointer"
                    >
                      <LogOut size={16} />
                      <span>Sign Out Account</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <Link
              href="/login"
              className="flex items-center gap-1.5 bg-[#014485] hover:bg-[#013467] text-white px-3.5 py-2 rounded-xl text-xs font-bold transition cursor-pointer shadow-xs"
              title="Sign In Page"
            >
              <User size={14} /> Sign In
            </Link>
          )}

          {/* Wishlist */}
          <Link href="/products" className="hover:text-[#014485] transition" title="Wishlist">
            <Heart size={18} />
          </Link>

          {/* Cart Icon Drawer Trigger */}
          <button
            onClick={openCartDrawer}
            className="relative hover:text-[#014485] transition flex items-center justify-center cursor-pointer"
            title="Shopping Cart"
          >
            <ShoppingCart size={18} />
            {mounted && cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-[#17993b] text-white font-bold text-[10px] w-4 h-4 rounded-full flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </button>


          {/* Mobile Hamburger Navigation Button */}
          <button
            onClick={() => setIsMobileNavOpen(true)}
            className="md:hidden text-black hover:text-gray-600 p-1 transition cursor-pointer"
            title="Open Mobile Navigation Menu"
          >
            <Menu size={22} />
          </button>
        </div>
      </div>

      {/* MOBILE STOREFRONT NAVIGATION DRAWER */}
      {isMobileNavOpen && (
        <div className="fixed inset-0 z-50 md:hidden font-sans">
          <div
            onClick={() => setIsMobileNavOpen(false)}
            className="absolute inset-0 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200"
          />

          <div className="fixed inset-y-0 right-0 w-4/5 max-w-xs bg-white shadow-2xl z-50 p-6 flex flex-col justify-between space-y-8 animate-in slide-in-from-right duration-300 overflow-y-auto">
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-gray-100 pb-4">
                <Link href="/" onClick={() => setIsMobileNavOpen(false)} className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl overflow-hidden shrink-0 shadow-xs bg-white border border-gray-200 p-1">
                    <img src="/icon.png" alt="Nile Express Cargo Logo" className="w-full h-full object-contain" />
                  </div>

                  <span className="font-black text-lg text-black font-retro-heading uppercase">NILE EXPRESS CARGO</span>

                </Link>
                <button
                  onClick={() => setIsMobileNavOpen(false)}
                  className="p-1 text-gray-500 hover:text-black rounded-lg hover:bg-gray-100 transition cursor-pointer"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Navigation Links */}
              <nav className="space-y-2">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-3 mb-1 font-mono">Navigation</p>
                <Link
                  href="/"
                  onClick={() => setIsMobileNavOpen(false)}
                  className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-bold transition ${
                    pathname === '/' ? 'bg-black text-white' : 'text-gray-800 hover:bg-gray-100'
                  }`}
                >
                  <span>Home</span>
                  <ChevronRight size={16} className="opacity-60" />
                </Link>
                <Link
                  href="/cargo"
                  onClick={() => setIsMobileNavOpen(false)}
                  className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-bold transition ${
                    pathname === '/cargo' ? 'bg-black text-white' : 'text-gray-800 hover:bg-gray-100'
                  }`}
                >
                  <span className="flex items-center gap-1.5 font-mono text-xs"><Plane size={14} /> Nile Cargo Network</span>
                  <ChevronRight size={16} className="opacity-60" />
                </Link>
                <Link
                  href="/products"
                  onClick={() => setIsMobileNavOpen(false)}
                  className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-bold transition ${
                    pathname === '/products' ? 'bg-black text-white' : 'text-gray-800 hover:bg-gray-100'
                  }`}
                >
                  <span>Shop Catalog</span>
                  <ChevronRight size={16} className="opacity-60" />
                </Link>
                <Link
                  href="/about"
                  onClick={() => setIsMobileNavOpen(false)}
                  className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-bold transition ${
                    pathname === '/about' ? 'bg-black text-white' : 'text-gray-800 hover:bg-gray-100'
                  }`}
                >
                  <span>About Us</span>
                  <ChevronRight size={16} className="opacity-60" />
                </Link>
                <Link
                  href="/contact"
                  onClick={() => setIsMobileNavOpen(false)}
                  className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-bold transition ${
                    pathname === '/contact' ? 'bg-black text-white' : 'text-gray-800 hover:bg-gray-100'
                  }`}
                >
                  <span>Contact</span>
                  <ChevronRight size={16} className="opacity-60" />
                </Link>
              </nav>


              {/* Account / Dashboard Links */}
              {user ? (
                <div className="space-y-2 pt-4 border-t border-gray-100">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-3 mb-1 font-mono">Account Portal</p>
                  <Link
                    href={getDashboardRoute()}
                    onClick={() => setIsMobileNavOpen(false)}
                    className="flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-gray-100 text-black text-xs font-bold hover:bg-gray-200 transition"
                  >
                    <span className="flex items-center gap-2">
                      <LayoutDashboard size={16} /> My Dashboard Portal
                    </span>
                    <ChevronRight size={14} className="text-gray-400" />
                  </Link>
                </div>
              ) : (
                <div className="pt-4 border-t border-gray-100 space-y-2">
                  <Link
                    href="/login"
                    onClick={() => setIsMobileNavOpen(false)}
                    className="w-full flex items-center justify-center gap-2 bg-black text-white py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition"
                  >
                    <User size={16} /> Sign In Account
                  </Link>
                </div>
              )}
            </div>

            {/* Currency & Emergency Info */}
            <div className="pt-4 border-t border-gray-100 space-y-3">
              <div className="flex items-center justify-between bg-gray-50 p-3 rounded-xl">
                <span className="text-xs font-bold text-gray-600">Active Currency:</span>
                <button
                  onClick={() => setCurrency(currency === 'CAD' ? 'RWF' : 'CAD')}
                  className="bg-black text-white px-3 py-1 rounded-lg text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                >
                  <Globe size={12} />
                  <span>{currency === 'CAD' ? 'CAD ($)' : 'RWF'}</span>
                </button>
              </div>

              <div className="text-[11px] text-gray-500 space-y-1 text-center font-medium">
                <div>Emergency Helpline: <strong className="text-black font-bold">(+250) 788 123 456</strong></div>
                <div className="text-[10px] text-gray-400">KGL ✈ YYZ Freight Corridor Active</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
