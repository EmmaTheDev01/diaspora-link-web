'use client';
import React, { useEffect, useState, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { dbService } from '@/services/db';
import { Product } from '@/types';
import { useCartStore } from '@/store/useCartStore';
import { useAuthStore } from '@/store/useAuthStore';
import {
  Search,
  Heart,
  Filter,
  SlidersHorizontal,
  ShieldCheck,
  ShoppingBag,
  X,
  Coffee,
  Palette,
  Gift,
  Home as HomeIcon,
} from 'lucide-react';

function ShopCatalogContent() {
  const searchParams = useSearchParams();
  const initialSearch = searchParams ? searchParams.get('search') || '' : '';

  const { currency } = useAuthStore();

  const [products, setProducts] = useState<Product[]>([]);
  const [wishlistIds, setWishlistIds] = useState<string[]>([]);

  // Filter States
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedCorridor, setSelectedCorridor] = useState<string>('all');
  const [priceRange, setPriceRange] = useState<'all' | 'under30' | '30to60' | 'over60'>('all');
  const [inStockOnly, setInStockOnly] = useState(false);
  const [sortBy, setSortBy] = useState<'featured' | 'price_low' | 'price_high' | 'name'>('featured');
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  useEffect(() => {
    async function loadAllProducts() {
      const data = await dbService.getProducts();
      setProducts(data);
    }
    loadAllProducts();
  }, []);

  useEffect(() => {
    if (searchParams) {
      const queryParam = searchParams.get('search');
      if (queryParam !== null) {
        setSearchQuery(queryParam);
      }
    }
  }, [searchParams]);

  const toggleWishlist = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setWishlistIds((prev) => (prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]));
  };

  // Filter Logic
  const filteredProducts = products.filter((p) => {
    if (
      searchQuery &&
      !p.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !p.description.toLowerCase().includes(searchQuery.toLowerCase())
    ) {
      return false;
    }
    if (selectedCategory !== 'all' && p.category !== selectedCategory) {
      return false;
    }
    if (selectedCorridor !== 'all' && p.target_corridor !== selectedCorridor) {
      return false;
    }
    if (priceRange === 'under30' && p.price_cad >= 30) return false;
    if (priceRange === '30to60' && (p.price_cad < 30 || p.price_cad > 60)) return false;
    if (priceRange === 'over60' && p.price_cad <= 60) return false;
    if (inStockOnly && p.stock_quantity <= 0) return false;
    return true;
  });

  // Sort Logic
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === 'price_low') return a.price_cad - b.price_cad;
    if (sortBy === 'price_high') return b.price_cad - a.price_cad;
    if (sortBy === 'name') return a.title.localeCompare(b.title);
    return 0;
  });

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
    setSelectedCorridor('all');
    setPriceRange('all');
    setInStockOnly(false);
    setSortBy('featured');
  };

  return (
    <main className="w-full min-h-screen bg-white text-[#111111] font-sans flex flex-col lg:flex-row">
      {/* EDGE-TO-EDGE FULL HEIGHT SIDEBAR WITH RIGHT BORDER ONLY */}
      <aside
        className={`w-full lg:w-80 bg-white border-r border-gray-200 shrink-0 p-6 space-y-6 min-h-screen ${
          isMobileFilterOpen ? 'block' : 'hidden lg:block'
        }`}
      >
        <div className="flex justify-between items-center pb-4 border-b border-gray-100">
          <h3 className="font-bold text-base text-black font-retro-heading flex items-center gap-2">
            <Filter size={18} /> Filters
          </h3>
          <button onClick={resetFilters} className="text-xs font-bold text-gray-500 hover:text-black underline cursor-pointer">
            Reset All
          </button>
        </div>

        {/* Keyword Search */}
        <div className="space-y-2">
          <label className="font-bold text-xs uppercase tracking-wider text-black block">Keyword Search</label>
          <div className="relative">
            <Search size={16} className="absolute left-3.5 top-3.5 text-gray-400" />
            <input
              type="text"
              placeholder="Search coffee, tea, crafts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-3 py-3 bg-gray-50 rounded-xl text-xs font-bold focus:outline-none focus:bg-gray-100"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-3.5 text-gray-400 hover:text-black cursor-pointer"
              >
                <X size={14} />
              </button>
            )}
          </div>
        </div>

        {/* Categories */}
        <div className="space-y-2">
          <label className="font-bold text-xs uppercase tracking-wider text-black block">Product Category</label>
          <div className="space-y-1 text-xs font-medium">
            {[
              { id: 'all', label: 'All Categories', icon: <ShoppingBag size={15} /> },
              { id: 'coffee_tea', label: 'Coffee & Tea', icon: <Coffee size={15} /> },
              { id: 'crafts', label: 'Handcrafts & Art', icon: <Palette size={15} /> },
              { id: 'gifts', label: 'Gifts & Spices', icon: <Gift size={15} /> },
              { id: 'decor', label: 'Home Decor', icon: <HomeIcon size={15} /> },
            ].map((cat) => {
              const isActive = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition font-bold cursor-pointer text-left ${
                    isActive ? 'bg-black text-white' : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <span className={isActive ? 'text-white' : 'text-gray-500'}>{cat.icon}</span>
                  <span className="flex-1">{cat.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Trade Corridor Route */}
        <div className="space-y-2">
          <label className="font-bold text-xs uppercase tracking-wider text-black block">Trade Corridor Route</label>
          <select
            value={selectedCorridor}
            onChange={(e) => setSelectedCorridor(e.target.value)}
            className="w-full p-3 bg-gray-50 rounded-xl text-xs font-bold uppercase text-black cursor-pointer focus:outline-none"
          >
            <option value="all">All Trade Corridors</option>
            <option value="KGL_YYZ">KGL ✈ YYZ (Rwanda Export)</option>
            <option value="YYZ_KGL">YYZ ✈ KGL (Canada Import)</option>
          </select>
        </div>

        {/* Price Range */}
        <div className="space-y-2">
          <label className="font-bold text-xs uppercase tracking-wider text-black block">Price Range (CAD $)</label>
          <div className="space-y-1 text-xs font-medium">
            {[
              { id: 'all', label: 'All Prices' },
              { id: 'under30', label: 'Under $30 CAD' },
              { id: '30to60', label: '$30 - $60 CAD' },
              { id: 'over60', label: 'Over $60 CAD' },
            ].map((p) => {
              const isActive = priceRange === p.id;
              return (
                <button
                  key={p.id}
                  onClick={() => setPriceRange(p.id as any)}
                  className={`w-full text-left px-3 py-2.5 rounded-xl transition font-bold cursor-pointer ${
                    isActive ? 'bg-black text-white' : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  {p.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Stock Checkbox Option */}
        <div className="space-y-3 pt-4 border-t border-gray-100 text-xs font-bold text-black">
          <label className="flex items-center gap-2.5 cursor-pointer">
            <input
              type="checkbox"
              checked={inStockOnly}
              onChange={(e) => setInStockOnly(e.target.checked)}
              className="w-4 h-4 accent-black rounded"
            />
            <span>In Stock Items Only</span>
          </label>
        </div>
      </aside>

      {/* RIGHT MAIN CONTENT AREA: 4 CARDS PER ROW GRID WITH NO ADD TO CART BUTTON */}
      <div className="flex-1 p-6 lg:p-10 space-y-8 bg-white min-w-0">
        {/* Top Shop Bar */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-6 border-b border-gray-100">
          <div>
            <h1 className="text-3xl lg:text-4xl font-black text-[#111111] font-retro-heading uppercase">
              Shop Export Catalog
            </h1>
            <p className="text-gray-600 text-sm font-medium mt-1">
              Showing <strong className="text-black font-bold">{sortedProducts.length}</strong> verified export items.
              {searchQuery && (
                <span className="ml-2 bg-black text-white text-xs px-2.5 py-0.5 rounded-full font-bold">
                  Query: "{searchQuery}"
                </span>
              )}
            </p>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            <button
              onClick={() => setIsMobileFilterOpen(!isMobileFilterOpen)}
              className="lg:hidden flex-1 flex items-center justify-center gap-2 bg-gray-100 text-black px-4 py-2.5 rounded-xl font-bold text-xs cursor-pointer"
            >
              <SlidersHorizontal size={16} /> Filters
            </button>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="p-3 bg-gray-50 rounded-xl text-xs font-bold uppercase text-black cursor-pointer focus:outline-none"
            >
              <option value="featured">Sort: Featured</option>
              <option value="price_low">Price: Low to High</option>
              <option value="price_high">Price: High to Low</option>
              <option value="name">Alphabetical</option>
            </select>
          </div>
        </div>

        {/* PRODUCTS GRID: 4 CARDS PER ROW WITHOUT ADD TO CART BUTTON */}
        {sortedProducts.length === 0 ? (
          <div className="bg-gray-50 p-12 text-center rounded-3xl space-y-4">
            <ShoppingBag size={48} className="text-gray-400 mx-auto" />
            <h3 className="font-bold text-lg text-black font-retro-heading">No Products Match Filters</h3>
            <p className="text-xs text-gray-500 font-medium">Try resetting your search query or price filters.</p>
            <button
              onClick={resetFilters}
              className="bg-black text-white font-bold px-6 py-2.5 rounded-full text-xs uppercase cursor-pointer"
            >
              Reset All Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 items-stretch">
            {sortedProducts.map((prod) => {
              const isWishlisted = wishlistIds.includes(prod.id);
              const displayTitle = prod.title.length > 26 ? `${prod.title.slice(0, 24)}...` : prod.title;

              return (
                <div key={prod.id} className="group flex flex-col justify-between h-full space-y-3">
                  <div className="space-y-3">
                    {/* Image Container (h-80) with image COVER */}
                    <Link
                      href={`/products/${prod.id}`}
                      className="block h-80 bg-[#F6F6F6] relative overflow-hidden group-hover:shadow-md transition rounded-2xl"
                    >
                      <img
                        src={prod.images[0] || 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?q=80&w=800'}
                        alt={prod.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                      />

                      {/* Wishlist Heart Button */}
                      <button
                        onClick={(e) => toggleWishlist(prod.id, e)}
                        className="absolute bottom-3 right-3 z-10 w-9 h-9 rounded-full bg-white/90 text-gray-600 hover:text-black hover:bg-white flex items-center justify-center transition shadow-xs cursor-pointer"
                        title="Wishlist"
                      >
                        <Heart size={18} fill={isWishlisted ? '#111111' : 'none'} className={isWishlisted ? 'text-black' : ''} />
                      </button>

                      <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition duration-300 flex items-center justify-center">
                        <span className="bg-white text-black text-xs font-bold px-5 py-2.5 rounded-full shadow">
                          View Details
                        </span>
                      </div>
                    </Link>

                    {/* Sliced Product Title */}
                    <Link
                      href={`/products/${prod.id}`}
                      className="font-bold text-base text-[#111111] hover:text-gray-600 transition block truncate h-6 leading-6"
                      title={prod.title}
                    >
                      {displayTitle}
                    </Link>
                  </div>

                  {/* Price & Weight Display (No Add To Cart Button) */}
                  <div className="pt-1 border-t border-gray-100">
                    <div className="flex items-center justify-between text-sm pt-1">
                      <div className="font-black text-[#111111]">
                        {currency === 'CAD' ? `$${prod.price_cad.toFixed(2)} CAD` : `${prod.price_rwf.toLocaleString()} RWF`}
                      </div>
                      <span className="text-xs text-gray-500 font-mono">{prod.weight_kg} kg</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}

export default function ShopCatalogPage() {
  return (
    <Suspense fallback={<div className="p-10 text-center font-bold text-gray-500">Loading Shop Catalog...</div>}>
      <ShopCatalogContent />
    </Suspense>
  );
}
