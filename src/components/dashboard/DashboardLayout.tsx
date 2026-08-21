'use client';
import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import {
  ShoppingBag,
  LogOut,
  Search,
  Bell,
  Globe,
  ChevronRight,
  ChevronDown,
  User,
  Settings,
  Edit,
  ShieldCheck,
  X,
  Package,
  FileText,
  Menu,
} from 'lucide-react';
import { useAuthStore } from '@/store/useAuthStore';
import { dbService } from '@/services/db';
import { Product, Order } from '@/types';
import toast from 'react-hot-toast';

interface SidebarItem {
  id: string;
  label: string;
  icon: React.ReactNode;
}

interface DashboardLayoutProps {
  children: React.ReactNode;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  menuItems: SidebarItem[];
  title: string;
  subtitle: string;
}

export function DashboardLayout({
  children,
  activeTab,
  setActiveTab,
  menuItems,
  title,
  subtitle,
}: DashboardLayoutProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, currency, setCurrency, logout, initAuth } = useAuthStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchResults, setSearchResults] = useState<{
    products: Product[];
    orders: Order[];
    menuMatches: SidebarItem[];
  }>({ products: [], orders: [], menuMatches: [] });

  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    initAuth();
  }, [initAuth]);

  // Real-time Dashboard Live Search Engine
  useEffect(() => {
    async function performSearch() {
      const q = searchQuery.trim().toLowerCase();
      if (!q) {
        setSearchResults({ products: [], orders: [], menuMatches: [] });
        setIsSearchOpen(false);
        return;
      }

      setIsSearchOpen(true);

      // Search matching portal pages
      const matchingMenu = menuItems.filter((item) =>
        item.label.toLowerCase().includes(q)
      );

      // Search matching products
      const allProducts = await dbService.getProducts();
      const matchingProducts = allProducts.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          (p.description && p.description.toLowerCase().includes(q)) ||
          (p.hs_tariff_code && p.hs_tariff_code.toLowerCase().includes(q))
      );

      // Search matching orders
      const allOrders = await dbService.getOrders();
      const matchingOrders = allOrders.filter(
        (o) =>
          o.order_number.toLowerCase().includes(q) ||
          (o.buyer_name && o.buyer_name.toLowerCase().includes(q)) ||
          (o.awb_number && o.awb_number.toLowerCase().includes(q)) ||
          (o.delivery_address?.recipient_name && o.delivery_address.recipient_name.toLowerCase().includes(q)) ||
          (o.delivery_address?.city && o.delivery_address.city.toLowerCase().includes(q))
      );

      setSearchResults({
        products: matchingProducts.slice(0, 4),
        orders: matchingOrders.slice(0, 4),
        menuMatches: matchingMenu,
      });
    }

    const timer = setTimeout(performSearch, 150);
    return () => clearTimeout(timer);
  }, [searchQuery, menuItems]);

  // Click outside handler to dismiss dropdowns
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsSearchOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="min-h-screen bg-[#F8F8F8] text-[#111111] font-sans flex flex-col lg:flex-row">
      {/* DESKTOP SIDEBAR NAVIGATION */}
      <aside className="hidden lg:flex w-64 bg-white border-r border-gray-200 shrink-0 p-6 flex-col justify-between space-y-8 sticky top-0 h-screen overflow-y-auto">
        <div className="space-y-8">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl overflow-hidden shrink-0 shadow-xs bg-white border border-gray-200 p-1">
              <img src="/icon.png" alt="Nile Express Cargo Logo" className="w-full h-full object-contain" />
            </div>

            <div>
              <div className="font-black text-xl tracking-tight text-[#111111] font-retro-heading">
                NILE EXPRESS CARGO
              </div>
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Dashboard Portal</p>
            </div>
          </Link>

          {/* Navigation Links */}
          <nav className="space-y-1">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-3 mb-2 whitespace-nowrap">Main Menu</p>
            {menuItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-xl text-xs font-bold transition cursor-pointer text-left ${isActive
                      ? 'bg-[#014485] text-white shadow-sm'
                      : 'text-gray-700 hover:bg-gray-100 hover:text-[#014485]'
                    }`}

                >
                  <span className={`shrink-0 ${isActive ? 'text-white' : 'text-gray-500'}`}>{item.icon}</span>
                  <span className="flex-1 whitespace-nowrap truncate">{item.label}</span>
                  {isActive && <ChevronRight size={14} className="text-white opacity-80 shrink-0" />}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer Actions */}
        <div className="pt-4 border-t border-gray-100 space-y-3">
          <Link
            href="/products"
            className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-gray-50 hover:bg-gray-100 text-xs font-bold text-black transition"
          >
            <span className="flex items-center gap-2 whitespace-nowrap truncate">
              <ShoppingBag size={15} className="shrink-0" /> Storefront Catalog
            </span>
            <ChevronRight size={14} className="text-gray-400 shrink-0" />
          </Link>

          <button
            onClick={logout}
            className="w-full flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-bold text-gray-600 hover:text-red-600 hover:bg-red-50 transition cursor-pointer whitespace-nowrap truncate"
          >
            <LogOut size={15} className="shrink-0" /> Sign Out Account
          </button>
        </div>
      </aside>

      {/* MOBILE SIDEBAR DRAWER OVERLAY */}
      {isMobileSidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden font-sans">
          <div
            onClick={() => setIsMobileSidebarOpen(false)}
            className="absolute inset-0 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200"
          />
          <aside className="fixed inset-y-0 left-0 w-4/5 max-w-xs bg-white shadow-2xl z-50 p-6 flex flex-col justify-between space-y-8 animate-in slide-in-from-left duration-300 overflow-y-auto">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <Link href="/" onClick={() => setIsMobileSidebarOpen(false)} className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl overflow-hidden shrink-0 shadow-xs bg-white border border-gray-200 p-1">
                    <img src="/icon.png" alt="Nile Express Cargo Logo" className="w-full h-full object-contain" />
                  </div>

                  <div>
                    <div className="font-black text-lg tracking-tight text-[#111111] font-retro-heading">
                      NILE EXPRESS CARGO
                    </div>
                    <p className="text-[9px] text-gray-400 font-bold uppercase tracking-wider">Dashboard Portal</p>
                  </div>
                </Link>
                <button
                  onClick={() => setIsMobileSidebarOpen(false)}
                  className="p-1.5 text-gray-500 hover:text-black rounded-lg hover:bg-gray-100 transition cursor-pointer"
                >
                  <X size={20} />
                </button>
              </div>

              <nav className="space-y-1">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-3 mb-2 whitespace-nowrap">Main Menu</p>
                {menuItems.map((item) => {
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        setActiveTab(item.id);
                        setIsMobileSidebarOpen(false);
                      }}
                      className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-xl text-xs font-bold transition cursor-pointer text-left ${isActive
                          ? 'bg-[#014485] text-white shadow-sm'
                          : 'text-gray-700 hover:bg-gray-100 hover:text-[#014485]'
                        }`}
                    >
                      <span className={`shrink-0 ${isActive ? 'text-white' : 'text-gray-500'}`}>{item.icon}</span>
                      <span className="flex-1 whitespace-nowrap truncate">{item.label}</span>
                      {isActive && <ChevronRight size={14} className="text-white opacity-80 shrink-0" />}
                    </button>
                  );
                })}
              </nav>
            </div>

            <div className="pt-4 border-t border-gray-100 space-y-3">
              <Link
                href="/products"
                onClick={() => setIsMobileSidebarOpen(false)}
                className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-gray-50 hover:bg-gray-100 text-xs font-bold text-black transition"
              >
                <span className="flex items-center gap-2 whitespace-nowrap truncate">
                  <ShoppingBag size={15} className="shrink-0 text-[#014485]" /> Storefront Catalog
                </span>
                <ChevronRight size={14} className="text-gray-400 shrink-0" />
              </Link>

              <button
                onClick={() => {
                  setIsMobileSidebarOpen(false);
                  logout();
                }}
                className="w-full flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-bold text-gray-600 hover:text-red-600 hover:bg-red-50 transition cursor-pointer whitespace-nowrap truncate"
              >
                <LogOut size={15} className="shrink-0" /> Sign Out Account
              </button>
            </div>
          </aside>
        </div>
      )}

      {/* RIGHT MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* TOP SEARCH & HEADER BAR */}
        <header className="bg-white border-b border-gray-200 py-4 px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4 sticky top-0 z-30">
          <div className="flex items-center gap-3 min-w-0">
            <button
              onClick={() => setIsMobileSidebarOpen(true)}
              className="lg:hidden p-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-black cursor-pointer transition shrink-0"
              title="Open Navigation Menu"
            >
              <Menu size={20} />
            </button>
            <div className="min-w-0">
              <h1 className="text-lg sm:text-2xl font-black text-[#111111] font-retro-heading uppercase truncate">{title}</h1>
              <p className="text-xs text-gray-500 font-medium truncate">{subtitle}</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Top Search Bar */}
            <div className="relative hidden sm:block w-72" ref={searchRef}>
              <Search size={16} className="absolute left-3 top-2.5 text-gray-400 z-10" />
              <input
                type="text"
                placeholder="Search orders, products, pages..."
                value={searchQuery}
                onFocus={() => {
                  if (searchQuery.trim()) setIsSearchOpen(true);
                }}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-8 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium focus:outline-none focus:border-[#014485]"
              />
              {searchQuery && (
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setIsSearchOpen(false);
                  }}
                  className="absolute right-2.5 top-2.5 text-gray-400 hover:text-black cursor-pointer z-10"
                >
                  <X size={14} />
                </button>
              )}

              {/* SEARCH RESULTS FLOATING DROPDOWN */}
              {isSearchOpen && (
                <div className="absolute left-0 right-0 mt-2 bg-white rounded-2xl border border-gray-200 shadow-2xl p-3 z-50 max-h-96 overflow-y-auto space-y-4 animate-in fade-in duration-100 font-sans">
                  {/* Menu / Pages matches */}
                  {searchResults.menuMatches.length > 0 && (
                    <div>
                      <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-2 mb-1 font-mono">
                        Portal Navigation ({searchResults.menuMatches.length})
                      </div>
                      <div className="space-y-1">
                        {searchResults.menuMatches.map((item) => (
                          <button
                            key={item.id}
                            onClick={() => {
                              setActiveTab(item.id);
                              setIsSearchOpen(false);
                              setSearchQuery('');
                              toast.success(`Navigated to ${item.label}`);
                            }}
                            className="w-full flex items-center justify-between p-2 rounded-xl text-left hover:bg-gray-100 transition cursor-pointer text-xs font-bold text-black"
                          >
                            <span className="flex items-center gap-2">
                              {item.icon} {item.label}
                            </span>
                            <ChevronRight size={14} className="text-gray-400" />
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Products matches */}
                  {searchResults.products.length > 0 && (
                    <div>
                      <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-2 mb-1 font-mono">
                        Matching Products ({searchResults.products.length})
                      </div>
                      <div className="space-y-1">
                        {searchResults.products.map((prod) => (
                          <button
                            key={prod.id}
                            onClick={() => {
                              const catTab = menuItems.find((m) => m.id === 'catalog')?.id || menuItems[0].id;
                              setActiveTab(catTab);
                              setIsSearchOpen(false);
                              setSearchQuery('');
                              toast.success(`Selected product "${prod.title}"`);
                            }}
                            className="w-full flex items-center justify-between p-2 rounded-xl text-left hover:bg-gray-50 transition cursor-pointer"
                          >
                            <div className="flex items-center gap-2.5 min-w-0">
                              <img src={prod.images[0]} alt={prod.title} className="w-8 h-8 rounded-lg object-cover border border-gray-200 shrink-0" />
                              <div className="min-w-0">
                                <div className="text-xs font-bold text-black truncate">{prod.title}</div>
                                <div className="text-[10px] text-gray-500 font-mono">${prod.price_cad.toFixed(2)} CAD</div>
                              </div>
                            </div>
                            <span className="text-[10px] bg-black text-white px-2 py-0.5 rounded font-mono uppercase font-bold shrink-0">
                              Product
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Orders matches */}
                  {searchResults.orders.length > 0 && (
                    <div>
                      <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-2 mb-1 font-mono">
                        Matching Orders ({searchResults.orders.length})
                      </div>
                      <div className="space-y-1">
                        {searchResults.orders.map((o) => (
                          <button
                            key={o.id}
                            onClick={() => {
                              const orderTab = menuItems.find((m) => m.id === 'orders')?.id || menuItems[0].id;
                              setActiveTab(orderTab);
                              setIsSearchOpen(false);
                              setSearchQuery('');
                              toast.success(`Opened order ${o.order_number}`);
                            }}
                            className="w-full flex items-center justify-between p-2 rounded-xl text-left hover:bg-gray-50 transition cursor-pointer"
                          >
                            <div className="min-w-0">
                              <div className="text-xs font-mono font-bold text-black truncate">{o.order_number}</div>
                              <div className="text-[10px] text-gray-500 font-medium">{o.buyer_name || 'Buyer'} • ${o.total_cad.toFixed(2)} CAD</div>
                            </div>
                            <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded uppercase font-mono shrink-0">
                              {o.status}
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* No Results found */}
                  {searchResults.menuMatches.length === 0 &&
                    searchResults.products.length === 0 &&
                    searchResults.orders.length === 0 && (
                      <div className="p-4 text-center text-xs text-gray-500 font-medium">
                        No products, orders, or pages matching &ldquo;{searchQuery}&rdquo;
                      </div>
                    )}
                </div>
              )}
            </div>

            {/* Currency Switcher */}
            <button
              onClick={() => setCurrency(currency === 'CAD' ? 'RWF' : 'CAD')}
              className="bg-gray-100 hover:bg-gray-200 text-black px-3 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer border border-gray-200"
            >
              <Globe size={14} />
              <span>{currency === 'CAD' ? 'CAD ($)' : 'RWF'}</span>
            </button>

            {/* Notifications Bell */}
            <button className="relative w-9 h-9 rounded-xl bg-gray-50 hover:bg-gray-100 border border-gray-200 flex items-center justify-center text-black cursor-pointer transition">
              <Bell size={16} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-emerald-500" />
            </button>

            {/* INTERACTIVE USER AVATAR DROPDOWN MENU */}
            <div className="relative border-l border-gray-200 pl-4" ref={userMenuRef}>
              <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-gray-100 transition cursor-pointer"
                title={`Account Menu for ${user?.full_name || 'User'}`}
              >
                <div className="w-8 h-8 rounded-full bg-black text-white font-bold text-xs flex items-center justify-center uppercase shadow-xs shrink-0 overflow-hidden">
                  {user?.avatar_url ? (
                    <img src={user.avatar_url} alt="Avatar" className="w-full h-full object-cover" />
                  ) : (
                    user?.full_name?.charAt(0) || 'U'
                  )}
                </div>
                <div className="hidden md:block text-left">
                  <div className="text-xs font-bold text-black line-clamp-1">{user?.full_name || 'Account Owner'}</div>
                  <div className="text-[10px] text-gray-400 font-mono uppercase">{user?.role?.replace('_', ' ')}</div>
                </div>
                <ChevronDown size={14} className={`text-gray-500 transition transform ${isUserMenuOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* DROPDOWN MENU PANEL */}
              {isUserMenuOpen && (
                <div className="absolute right-0 mt-3 w-64 bg-white rounded-2xl border border-gray-200 shadow-xl py-3 z-50 animate-in fade-in slide-in-from-top-2 duration-150 font-sans">
                  {/* User Profile Header Summary */}
                  <div className="px-4 pb-3 border-b border-gray-100 space-y-1">
                    <div className="font-bold text-sm text-black line-clamp-1">{user?.full_name || 'User Account'}</div>
                    <div className="text-xs text-gray-500 font-mono line-clamp-1">{user?.email || 'user@diasporalink.com'}</div>
                    <div className="pt-1">
                      <span className="bg-black text-white text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-full inline-block font-mono">
                        {user?.role?.replace('_', ' ') || 'Buyer'}
                      </span>
                    </div>
                  </div>

                  {/* Dropdown Menu Items */}
                  <div className="py-2 px-2 text-xs font-bold space-y-1">
                    <button
                      onClick={() => {
                        setIsUserMenuOpen(false);
                        const prefTab = menuItems.find((m) => m.id === 'preferences' || m.id === 'business')?.id || menuItems[0].id;
                        setActiveTab(prefTab);
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-black hover:bg-gray-100 transition text-left cursor-pointer"
                    >
                      <Edit size={16} />
                      <span>Edit User Profile</span>
                    </button>

                    <button
                      onClick={() => {
                        setIsUserMenuOpen(false);
                        const prefTab = menuItems.find((m) => m.id === 'preferences' || m.id === 'business')?.id || menuItems[0].id;
                        setActiveTab(prefTab);
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-black hover:bg-gray-100 transition text-left cursor-pointer"
                    >
                      <Settings size={16} />
                      <span>Account Preferences</span>
                    </button>

                    <Link
                      href="/products"
                      onClick={() => setIsUserMenuOpen(false)}
                      className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-black hover:bg-gray-100 transition"
                    >
                      <ShoppingBag size={16} />
                      <span>Storefront Catalog</span>
                    </Link>
                  </div>

                  {/* Sign Out Action */}
                  <div className="pt-2 px-2 border-t border-gray-100">
                    <button
                      onClick={() => {
                        setIsUserMenuOpen(false);
                        logout();
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-red-600 hover:bg-red-50 text-xs font-bold transition cursor-pointer text-left"
                    >
                      <LogOut size={16} />
                      <span>Sign Out Account</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* DASHBOARD PAGE CONTENT */}
        <main className="p-4 sm:p-6 lg:p-8 space-y-6 sm:space-y-8 flex-1 min-w-0 overflow-x-hidden">
          {children}
        </main>
      </div>
    </div>
  );
}
