'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { Product } from '../../types';
import { ShoppingBag, Heart, ChevronRight, Lock, ShieldCheck, Plane } from 'lucide-react';
import { useCartStore } from '../../store/useCartStore';
import { useAuthStore } from '../../store/useAuthStore';

interface ProductGridProps {
  products: Product[];
  selectedCategory?: string;
  onSelectCategory?: (cat: string) => void;
}

export function ProductGrid({ products, selectedCategory, onSelectCategory }: ProductGridProps) {
  const { addItem } = useCartStore();
  const { currency } = useAuthStore();
  const [corridorFilter, setCorridorFilter] = useState<'all' | 'KGL_YYZ' | 'YYZ_KGL'>('all');
  const [wishlistIds, setWishlistIds] = useState<string[]>([]);

  const toggleWishlist = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setWishlistIds((prev) => (prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]));
  };

  const filteredProducts = products.filter((p) => {
    if (selectedCategory && p.category !== selectedCategory) return false;
    if (corridorFilter !== 'all' && p.target_corridor !== corridorFilter) return false;
    return true;
  });

  if (!products || products.length === 0) {
    return (
      <div className="py-24 px-4 text-center max-w-xl mx-auto space-y-4 font-sans">
        <div className="w-16 h-16 bg-gray-100 text-gray-400 rounded-full flex items-center justify-center mx-auto">
          <ShoppingBag size={32} />
        </div>
        <h3 className="text-2xl font-bold text-black font-retro-heading uppercase">No Products Listed Yet</h3>
        <p className="text-sm text-gray-500 font-medium">
          There are currently no active export items in the database catalog. Sign in as a vendor to create products.
        </p>
        <Link href="/login" className="inline-block bg-black text-white px-6 py-3 rounded-xl text-xs font-bold uppercase tracking-wider shadow-md">
          Vendor Sign In →
        </Link>
      </div>
    );
  }

  const trendingProducts = filteredProducts.slice(0, 4);
  const bestSellers = filteredProducts.slice(0, 3);
  const featuredProducts = filteredProducts.slice(1, 4);

  return (
    <div className="space-y-20 py-10 px-4 lg:px-8 max-w-7xl mx-auto font-sans">
      {/* SECTION 1: Trending Products */}
      <section>
        <div className="text-center max-w-xl mx-auto mb-10 space-y-2">
          <h2 className="text-3xl lg:text-4xl font-black text-[#111111] font-retro-heading">Trending Products</h2>
          <p className="text-sm text-gray-600 font-medium font-sans">Verified cross-border exports directly from Rwanda cooperatives & Canadian hubs.</p>

          {/* Corridor Filter Toggle */}
          <div className="flex flex-wrap justify-center items-center gap-2 pt-4">
            <button
              onClick={() => setCorridorFilter('all')}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition cursor-pointer ${corridorFilter === 'all' ? 'bg-black text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
            >
              All Corridors
            </button>
            <button
              onClick={() => setCorridorFilter('KGL_YYZ')}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition cursor-pointer ${corridorFilter === 'KGL_YYZ' ? 'bg-black text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
            >
              🇷🇼 KGL ✈ YYZ 🇨🇦
            </button>
            <button
              onClick={() => setCorridorFilter('YYZ_KGL')}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition cursor-pointer ${corridorFilter === 'YYZ_KGL' ? 'bg-black text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
            >
              🇨🇦 YYZ ✈ KGL 🇷🇼
            </button>
          </div>
        </div>

        {/* Product Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {trendingProducts.map((prod) => {
            const isWishlisted = wishlistIds.includes(prod.id);
            const originalPriceCad = prod.price_cad * 1.2;

            return (
              <div key={prod.id} className="group space-y-3">
                <Link
                  href={`/products/${prod.id}`}
                  className="block h-84 bg-[#F6F6F6] relative overflow-hidden group-hover:shadow-md transition"
                >
                  <img
                    src={prod.images[0] || 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?q=80&w=800'}
                    alt={prod.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                  />

                  <button
                    onClick={(e) => toggleWishlist(prod.id, e)}
                    className="absolute bottom-3 right-3 z-10 w-9 h-9 rounded-full bg-white/90 text-gray-600 hover:text-black hover:bg-white flex items-center justify-center transition shadow-xs cursor-pointer"
                    title="Wishlist"
                  >
                    <Heart size={18} fill={isWishlisted ? '#111111' : 'none'} className={isWishlisted ? 'text-black' : ''} />
                  </button>

                  <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition duration-300 flex items-center justify-center gap-3">
                    <span className="bg-white text-black text-xs font-bold px-5 py-2.5 rounded-full shadow">
                      View Details
                    </span>
                  </div>
                </Link>

                <div className="space-y-1">
                  <Link
                    href={`/products/${prod.id}`}
                    className="font-bold text-base text-[#111111] line-clamp-1 hover:text-gray-600 transition block"
                  >
                    {prod.title}
                  </Link>
                  <div className="flex items-baseline gap-2 text-sm">
                    <span className="font-black text-[#111111]">
                      {currency === 'CAD' ? `$${prod.price_cad.toFixed(2)}` : `${prod.price_rwf.toLocaleString()} RWF`}
                    </span>
                    <span className="text-gray-400 line-through text-xs font-normal">
                      {currency === 'CAD' ? `$${originalPriceCad.toFixed(2)}` : `${Math.round(prod.price_rwf * 1.2).toLocaleString()} RWF`}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* SCREEN HEIGHT EDGE-TO-EDGE CTA BANNER WITH LAVENDER BG & BACKGROUND IMAGE */}
      <section className="w-screen relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] bg-[#ECEEFA] text-[#111111] min-h-[460px] flex items-center py-16 px-6 lg:px-12 my-12 overflow-hidden relative group">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-25 group-hover:scale-105 transition duration-700 pointer-events-none"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1544816155-12df9643f363?q=80&w=1600&auto=format&fit=crop')`,
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#ECEEFA] via-[#ECEEFA]/90 to-transparent pointer-events-none" />

        <div className="max-w-7xl mx-auto w-full relative z-10 flex flex-col lg:flex-row items-center justify-between gap-12">
          <div className="space-y-6 max-w-2xl text-center lg:text-left">
            <div className="inline-flex items-center gap-2 bg-white text-black text-xs font-bold px-4 py-2 rounded-full shadow-xs uppercase tracking-widest font-mono">
              <Lock size={14} /> 256-BIT ESCROW PROTECTED PROTOCOL
            </div>

            <h2 className="text-4xl lg:text-6xl font-black tracking-tight leading-none font-retro-heading text-[#111111]">
              Seamless Kigali ↔ Toronto Cross-Border Trade
            </h2>

            <p className="text-gray-700 text-base lg:text-lg font-medium leading-relaxed">
              Connect directly with verified Rwandan producers and Canadian diaspora merchants. Lock payments securely in 256-bit escrow until parcel delivery confirmation on direct RwandAir flights.
            </p>

            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-6 text-sm font-bold text-gray-700 pt-2">
              <div className="flex items-center gap-2">
                <ShieldCheck size={18} className="text-black" /> Verified Trade Corridors
              </div>
              <div className="flex items-center gap-2">
                <Plane size={18} className="text-black" /> KGL ✈ YYZ Direct Flight
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-4 shrink-0">
            <Link
              href="/products"
              className="bg-black hover:bg-gray-800 text-white font-bold px-10 py-5 rounded-full uppercase text-xs tracking-widest transition shadow-lg text-center min-w-[220px]"
            >
              Shop Catalog →
            </Link>
            <Link
              href="/logistics"
              className="bg-white hover:bg-gray-100 text-black border border-gray-300 font-bold px-10 py-5 rounded-full uppercase text-xs tracking-widest transition text-center min-w-[220px]"
            >
              Post Flight Baggage →
            </Link>
          </div>
        </div>
      </section>

      {/* SECTION 2: Best Selling Items */}
      {bestSellers.length > 0 && (
        <section>
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-black text-[#111111] font-retro-heading">Best Selling Items</h2>
            <Link href="/products" className="text-sm font-bold uppercase tracking-wider text-[#111111] hover:underline flex items-center gap-1">
              <span>DEAL OF THE DAY</span>
              <ChevronRight size={16} />
            </Link>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-9 grid grid-cols-1 sm:grid-cols-3 gap-8">
              {bestSellers.map((prod) => {
                const isWishlisted = wishlistIds.includes(prod.id);

                return (
                  <div key={prod.id} className="group space-y-3">
                    <Link href={`/products/${prod.id}`} className="block h-80 bg-[#F6F6F6] relative overflow-hidden">
                      <img
                        src={prod.images[0] || 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?q=80&w=800'}
                        alt={prod.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                      />
                      <button
                        onClick={(e) => toggleWishlist(prod.id, e)}
                        className="absolute bottom-3 right-3 z-10 w-9 h-9 rounded-full bg-white/90 text-gray-600 hover:text-black hover:bg-white flex items-center justify-center transition shadow-xs cursor-pointer"
                      >
                        <Heart size={18} fill={isWishlisted ? '#111111' : 'none'} className={isWishlisted ? 'text-black' : ''} />
                      </button>
                    </Link>

                    <div className="space-y-1">
                      <Link href={`/products/${prod.id}`} className="font-bold text-base text-[#111111] line-clamp-1 block hover:text-gray-600">
                        {prod.title}
                      </Link>
                      <div className="font-black text-sm text-[#111111]">
                        {currency === 'CAD' ? `$${prod.price_cad.toFixed(2)}` : `${prod.price_rwf.toLocaleString()} RWF`}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="lg:col-span-3 bg-[#E3F2EE] p-8 flex flex-col justify-between group relative overflow-hidden">
              <div className="space-y-3 z-10">
                <h3 className="font-bold text-2xl text-[#111111] leading-tight font-retro-heading">
                  Air Freight Cargo Luggage Dispatch
                </h3>
                <p className="text-sm text-gray-600 font-medium">Easy And Free Returns!</p>
                <div className="text-3xl font-black text-[#111111] pt-2">
                  $ 145<sup className="text-sm">.00</sup> <span className="text-sm text-gray-400 line-through font-normal">$165.00</span>
                </div>
              </div>

              <div className="pt-6 z-10">
                <Link href="/products" className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-wider text-[#111111] hover:underline">
                  <span>VIEW MORE</span>
                  <div className="w-6 h-6 rounded-full bg-[#111111] text-white flex items-center justify-center">
                    <ChevronRight size={14} />
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
