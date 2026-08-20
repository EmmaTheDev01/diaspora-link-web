'use client';
import React, { useEffect, useState } from 'react';
import { useAuthStore } from '@/store/useAuthStore';
import { dbService } from '@/services/db';
import { Order, EscrowAccount } from '@/types';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import {
  ShoppingBag,
  Package,
  Heart,
  CreditCard,
  Settings,
  Lock,
  CheckCircle2,
  Clock,
  ShieldCheck,
  Globe,
  Trash2,
  Upload,
  User,
  Bell,
  Smartphone,
  Save,
  Check,
} from 'lucide-react';
import { useCartStore } from '@/store/useCartStore';
import { StatCardSkeleton } from '@/components/common/Skeleton';
import toast from 'react-hot-toast';

export default function BuyerDashboardPage() {
  const { user, setUser, currency, setCurrency, detectedCorridor } = useAuthStore();
  const { addItem } = useCartStore();

  const [activeTab, setActiveTab] = useState('overview');
  const [orders, setOrders] = useState<Order[]>([]);
  const [escrowVault, setEscrowVault] = useState<EscrowAccount[]>([]);
  const [loading, setLoading] = useState(true);
  const [escrowPin, setEscrowPin] = useState('');
  const [releasingOrderId, setReleasingOrderId] = useState<string | null>(null);

  // Profile & Preferences Form States
  const [fullName, setFullName] = useState(user?.full_name || 'Grace Mutoni');
  const [email, setEmail] = useState(user?.email || 'buyer@diasporalink.com');
  const [phoneNumber, setPhoneNumber] = useState(user?.phone_number || '+1 416 555 0192');
  const [momoNumber, setMomoNumber] = useState(user?.momo_number || '+250 788 123 456');
  const [preferredCorridor, setPreferredCorridor] = useState(detectedCorridor || 'KGL_YYZ');
  const [avatarUrl, setAvatarUrl] = useState(user?.avatar_url || '');

  // Preference Toggles
  const [smsAlerts, setSmsAlerts] = useState(true);
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [escrowPinAlerts, setEscrowPinAlerts] = useState(true);
  const [biometricAuth, setBiometricAuth] = useState(true);
  const [dataSaver, setDataSaver] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  // Saved Wishlist Items
  const [wishlist, setWishlist] = useState([
    {
      id: 'prod_gishwati_tea',
      title: 'Gishwati Silver Needle White Tea (250g)',
      price_cad: 38.5,
      price_rwf: 48000,
      image: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?q=80&w=800',
      category: 'tea',
    },
    {
      id: 'prod_kivu_arabica',
      title: 'Lake Kivu Specialty Roast Arabica (1kg)',
      price_cad: 45.0,
      price_rwf: 58000,
      image: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?q=80&w=800',
      category: 'coffee',
    },
  ]);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      const fetchedOrders = await dbService.getOrders();
      const fetchedEscrow = await dbService.getEscrowVault();
      setOrders(fetchedOrders);
      setEscrowVault(fetchedEscrow);
      setLoading(false);
    }
    loadData();
  }, []);

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setAvatarUrl(url);
    }
  };

  const handleSavePreferences = (e: React.FormEvent) => {
    e.preventDefault();
    if (user) {
      setUser({
        ...user,
        full_name: fullName,
        email,
        phone_number: phoneNumber,
        momo_number: momoNumber,
        avatar_url: avatarUrl,
      });
    }
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  const handleConfirmDelivery = async (orderId: string) => {
    if (!escrowPin || escrowPin.length < 4) {
      toast.error('Please enter your 6-digit Escrow Vault Release PIN code.');
      return;
    }

    const success = await dbService.confirmOrderDelivery(orderId, escrowPin);
    if (success) {
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, status: 'delivered', escrow_released: true } : o))
      );
      setReleasingOrderId(null);
      setEscrowPin('');
      toast.success('Delivery Confirmed 🟢\n256-Bit Escrow Vault funds released!');
    }
  };

  const menuItems = [
    { id: 'overview', label: 'Overview', icon: <Package size={18} /> },
    { id: 'orders', label: 'My Orders', icon: <ShoppingBag size={18} /> },
    { id: 'wishlist', label: 'My Wishlist', icon: <Heart size={18} /> },
    { id: 'wallet', label: 'Wallet & Escrow', icon: <CreditCard size={18} /> },
    { id: 'preferences', label: 'Profile & Preferences', icon: <Settings size={18} /> },
  ];

  const totalSpentCad = orders.reduce((acc, o) => acc + o.total_cad, 0);
  const activeOrdersCount = orders.filter((o) => o.status !== 'delivered').length;
  const lockedEscrowCad = orders.filter((o) => !o.escrow_released).reduce((acc, o) => acc + o.total_cad, 0);

  return (
    <DashboardLayout
      activeTab={activeTab}
      setActiveTab={setActiveTab}
      menuItems={menuItems}
      title={`Welcome Back, ${user?.full_name?.split(' ')[0] || 'Shopper'}`}
      subtitle="Manage cross-border orders, 256-bit Escrow Vault releases, wishlist & profile settings."
    >
      {/* TAB 1: OVERVIEW */}
      {activeTab === 'overview' && (
        <div className="space-y-8">
          {/* Top Metric Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {loading ? (
              Array.from({ length: 4 }).map((_, i) => <StatCardSkeleton key={i} />)
            ) : (
              <>
                <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs flex flex-col justify-between space-y-3">
                  <div className="flex justify-between text-gray-500">
                    <span className="text-xs font-bold uppercase tracking-wider text-black">Total Orders</span>
                    <ShoppingBag size={20} className="text-black" />
                  </div>
                  <div className="text-4xl font-black text-black font-retro-heading">{orders.length}</div>
                  <span className="text-xs text-gray-500 font-medium">Cross-border parcels</span>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs flex flex-col justify-between space-y-3">
                  <div className="flex justify-between text-gray-500">
                    <span className="text-xs font-bold uppercase tracking-wider text-black">Active Shipments</span>
                    <Clock size={20} className="text-black" />
                  </div>
                  <div className="text-4xl font-black text-black font-retro-heading">{activeOrdersCount}</div>
                  <span className="text-xs text-gray-500 font-medium">In transit on flight WB302</span>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs flex flex-col justify-between space-y-3">
                  <div className="flex justify-between text-gray-500">
                    <span className="text-xs font-bold uppercase tracking-wider text-black">Locked in Escrow</span>
                    <Lock size={20} className="text-black" />
                  </div>
                  <div className="text-3xl font-black text-black font-retro-heading">${lockedEscrowCad.toFixed(2)} CAD</div>
                  <span className="text-xs text-gray-500 font-medium">Safe 256-bit vault protection</span>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs flex flex-col justify-between space-y-3">
                  <div className="flex justify-between text-gray-500">
                    <span className="text-xs font-bold uppercase tracking-wider text-black">Total Trade Volume</span>
                    <CreditCard size={20} className="text-black" />
                  </div>
                  <div className="text-3xl font-black text-black font-retro-heading">${totalSpentCad.toFixed(2)} CAD</div>
                  <span className="text-xs text-gray-500 font-medium">KGL ✈ YYZ corridor</span>
                </div>
              </>
            )}
          </div>

          {/* Active Orders Quick Summary Table */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-xs overflow-hidden">
            <div className="p-6 border-b border-gray-200 flex justify-between items-center">
              <h3 className="font-bold text-lg text-black font-retro-heading">Recent Cross-Border Orders</h3>
              <button onClick={() => setActiveTab('orders')} className="text-xs font-bold text-black hover:underline">
                View All Orders →
              </button>
            </div>

            <div className="divide-y divide-gray-200">
              {orders.length === 0 ? (
                <div className="p-8 text-center text-xs text-gray-500 font-medium">No order history recorded yet.</div>
              ) : (
                orders.slice(0, 3).map((order) => (
                  <div key={order.id} className="p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:bg-gray-50 transition">
                    <div>
                      <div className="flex items-center gap-2 font-mono font-bold text-sm text-black">
                        <span>Order #{order.order_number}</span>
                        <span className="bg-black text-white px-2 py-0.5 text-[10px] rounded uppercase">{order.status}</span>
                      </div>
                      <p className="text-xs text-gray-500 mt-1 font-medium">
                        AWB: <span className="font-mono text-black">{order.awb_number}</span> • Corridor: {order.corridor}
                      </p>
                    </div>

                    <div className="text-right">
                      <div className="font-black text-sm text-black">
                        {currency === 'CAD' ? `$${order.total_cad.toFixed(2)} CAD` : `${order.total_rwf.toLocaleString()} RWF`}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: MY ORDERS */}
      {activeTab === 'orders' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-black font-retro-heading">All Order History & Tracking</h2>
            <span className="text-xs text-gray-500 font-mono">{orders.length} recorded orders</span>
          </div>

          <div className="space-y-6">
            {orders.length === 0 ? (
              <div className="bg-white p-12 rounded-2xl border border-gray-200 text-center space-y-3">
                <ShoppingBag size={36} className="text-gray-400 mx-auto" />
                <h3 className="font-bold text-base text-black font-retro-heading uppercase">No Orders Found</h3>
                <p className="text-xs text-gray-500 font-medium">You haven't placed any cross-border export orders yet.</p>
              </div>
            ) : (
              orders.map((order) => (
                <div key={order.id} className="bg-white rounded-2xl border border-gray-200 p-6 shadow-xs space-y-5">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-gray-100 pb-4 gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-base text-black">Order #{order.order_number}</span>
                        <span className="bg-black text-white text-xs font-bold px-3 py-1 rounded-full uppercase">
                          {order.status}
                        </span>
                      </div>
                      <div className="text-xs text-gray-500 font-medium mt-0.5">
                        Air Waybill: <strong className="font-mono text-black">{order.awb_number}</strong> • Date: {new Date(order.created_at).toLocaleDateString()}
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="font-black text-lg text-black">${order.total_cad.toFixed(2)} CAD</div>
                      <div className="text-xs text-gray-500 font-mono">{order.total_rwf.toLocaleString()} RWF</div>
                    </div>
                  </div>

                  {/* Milestone Timeline */}
                  <div className="bg-[#F8F8F8] p-4 rounded-xl space-y-2">
                    <div className="text-xs font-bold text-black uppercase tracking-wider mb-2">AWB Freight Logistics Milestones:</div>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] font-bold">
                      <div className="bg-white p-2.5 rounded-lg border border-gray-200 text-center">1. Locked in Escrow 🔒</div>
                      <div className="bg-white p-2.5 rounded-lg border border-gray-200 text-center">2. Sealing Hub KGL 🏷️</div>
                      <div className="bg-white p-2.5 rounded-lg border border-gray-200 text-center">3. Flight WB302 Transit ✈️</div>
                      <div className="bg-white p-2.5 rounded-lg border border-gray-200 text-center">4. Toronto Pearson YYZ 🇨🇦</div>
                    </div>
                  </div>

                  {/* Confirm Delivery & PIN Release */}
                  <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-2">
                    <div className="text-xs font-mono text-gray-600">
                      Your 256-Bit Escrow Vault Release PIN: <strong className="text-black bg-gray-100 px-2 py-1 rounded">{order.escrow_release_pin || 'PIN-8842'}</strong>
                    </div>

                    {!order.escrow_released ? (
                      <div className="flex items-center gap-2 w-full sm:w-auto">
                        {releasingOrderId === order.id ? (
                          <div className="flex items-center gap-2">
                            <input
                              type="text"
                              placeholder="Enter 6-Digit PIN"
                              value={escrowPin}
                              onChange={(e) => setEscrowPin(e.target.value)}
                              className="p-2 border border-gray-300 rounded-lg text-xs font-mono font-bold w-36"
                            />
                            <button
                              onClick={() => handleConfirmDelivery(order.id)}
                              className="bg-black text-white font-bold px-4 py-2 rounded-lg text-xs uppercase cursor-pointer"
                            >
                              Release Funds
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => setReleasingOrderId(order.id)}
                            className="bg-black hover:bg-gray-800 text-white font-bold px-5 py-2.5 rounded-xl text-xs uppercase tracking-wider cursor-pointer shadow-xs"
                          >
                            Confirm Delivery & Release Escrow
                          </button>
                        )}
                      </div>
                    ) : (
                      <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                        <CheckCircle2 size={16} /> Escrow Released to Vendor
                      </span>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* TAB 3: WISHLIST */}
      {activeTab === 'wishlist' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-black font-retro-heading">Saved Wishlist Items</h2>
            <span className="text-xs text-gray-500 font-mono">{wishlist.length} saved items</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {wishlist.map((item) => (
              <div key={item.id} className="bg-white rounded-2xl border border-gray-200 p-5 space-y-3 shadow-xs">
                <div className="h-48 bg-gray-100 rounded-xl overflow-hidden relative">
                  <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                  <button
                    onClick={() => setWishlist(wishlist.filter((w) => w.id !== item.id))}
                    className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 text-gray-600 hover:text-black flex items-center justify-center cursor-pointer shadow-xs"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>

                <div>
                  <h4 className="font-bold text-sm text-black line-clamp-1">{item.title}</h4>
                  <div className="font-black text-base text-black mt-1">
                    {currency === 'CAD' ? `$${item.price_cad.toFixed(2)} CAD` : `${item.price_rwf.toLocaleString()} RWF`}
                  </div>
                </div>

                <button
                  onClick={() => {
                    addItem(
                      {
                        id: item.id,
                        vendor_id: 'usr_vrw_1',
                        vendor_name: 'Gishwati Tea Producers Cooperative',
                        title: item.title,
                        description: 'Specialty organic export item.',
                        category: item.category === 'tea' ? 'coffee_tea' : 'coffee_tea',
                        origin_country: 'RW',
                        target_corridor: 'KGL_YYZ',
                        price_cad: item.price_cad,
                        price_rwf: item.price_rwf,
                        weight_kg: 0.5,
                        images: [item.image],
                        stock_quantity: 100,
                        created_at: new Date().toISOString(),
                      },
                      1
                    );
                    alert('Item added to cart!');
                  }}
                  className="w-full bg-black hover:bg-gray-800 text-white font-bold py-3 rounded-xl text-xs uppercase tracking-wider cursor-pointer shadow-xs"
                >
                  Add To Cart →
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: WALLET & RECENT PAYMENTS */}
      {activeTab === 'wallet' && (
        <div className="space-y-8">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold text-black font-retro-heading uppercase">My Wallet & Escrow Ledger</h2>
              <p className="text-xs text-gray-500 font-medium">Real-time 256-bit escrow balances and recent payment audit logs.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Escrow Balance Card */}
            <div className="bg-black text-white p-8 rounded-3xl space-y-4 shadow-xl relative overflow-hidden flex flex-col justify-between">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold uppercase tracking-widest text-gray-300 font-mono">256-BIT ESCROW VAULT</span>
                <ShieldCheck size={24} />
              </div>
              <div>
                <div className="text-4xl font-black font-retro-heading">${lockedEscrowCad.toFixed(2)} CAD</div>
                <p className="text-xs text-gray-400 font-mono mt-1">Equivalent: {Math.round(lockedEscrowCad * 1233.33).toLocaleString()} RWF</p>
              </div>
              <p className="text-xs text-gray-300 leading-relaxed font-medium pt-2">
                Funds are protected in escrow until physical parcel receipt confirmation.
              </p>
            </div>

            {/* Total Trade Volume Card */}
            <div className="bg-white p-8 rounded-3xl border border-gray-200 space-y-4 shadow-xs flex flex-col justify-between">
              <div className="flex justify-between items-center text-gray-500">
                <span className="text-xs font-bold uppercase tracking-wider text-black">Total Settled Payments</span>
                <CreditCard size={22} className="text-black" />
              </div>
              <div>
                <div className="text-4xl font-black text-black font-retro-heading">${totalSpentCad.toFixed(2)} CAD</div>
                <span className="text-xs text-emerald-600 font-bold">100% Escrow Protected</span>
              </div>
              <p className="text-xs text-gray-500 font-medium">Cross-border freight trade volume.</p>
            </div>

            {/* Currency Preference Card */}
            <div className="bg-[#F8F8F8] p-8 rounded-3xl border border-gray-200 space-y-4 flex flex-col justify-between">
              <div className="flex justify-between items-center text-gray-500">
                <span className="text-xs font-bold uppercase tracking-wider text-black">Active Currency</span>
                <Globe size={22} className="text-black" />
              </div>
              <div>
                <div className="text-3xl font-black text-black font-retro-heading">{currency === 'CAD' ? 'Canadian Dollar ($)' : 'Rwandan Franc (RWF)'}</div>
              </div>
              <button
                onClick={() => setCurrency(currency === 'CAD' ? 'RWF' : 'CAD')}
                className="w-full bg-black text-white font-bold py-2.5 rounded-xl text-xs uppercase cursor-pointer"
              >
                Switch Currency Mode
              </button>
            </div>
          </div>

          {/* RECENT PAYMENTS & ESCROW TRANSACTIONS TABLE */}
          <div className="bg-white rounded-3xl border border-gray-200 shadow-xs overflow-hidden space-y-4 p-6 lg:p-8">
            <div className="flex justify-between items-center pb-4 border-b border-gray-100">
              <div>
                <h3 className="font-bold text-lg text-black font-retro-heading uppercase">All Recent Payments & Transactions</h3>
                <p className="text-xs text-gray-500 font-medium">Detailed escrow logs, locks, and payouts from your account.</p>
              </div>
              <span className="text-xs font-mono text-gray-500 font-bold">{escrowVault.length} transactions</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-gray-200 text-gray-400 font-bold uppercase tracking-wider">
                    <th className="pb-3 font-mono">Transaction ID</th>
                    <th className="pb-3">Order Number</th>
                    <th className="pb-3">Amount (CAD)</th>
                    <th className="pb-3">Amount (RWF)</th>
                    <th className="pb-3">Escrow Status</th>
                    <th className="pb-3">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 font-medium">
                  {escrowVault.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-8 text-center text-gray-500 font-medium">
                        No recent payments or escrow transactions recorded.
                      </td>
                    </tr>
                  ) : (
                    escrowVault.map((item) => (
                      <tr key={item.id} className="hover:bg-gray-50 transition">
                        <td className="py-4 font-mono font-bold text-black">{item.id}</td>
                        <td className="py-4 font-bold text-black">{item.order_number}</td>
                        <td className="py-4 font-black text-black">${item.amount_cad.toFixed(2)} CAD</td>
                        <td className="py-4 font-mono text-gray-600">{item.amount_rwf.toLocaleString()} RWF</td>
                        <td className="py-4">
                          <span
                            className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${
                              item.status === 'fully_released' ? 'bg-emerald-100 text-emerald-700' : 'bg-black text-white'
                            }`}
                          >
                            {item.status?.replace('_', ' ')}
                          </span>
                        </td>
                        <td className="py-4 text-gray-500">{new Date(item.created_at).toLocaleDateString()}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: PROFILE & EXPANDED ACCOUNT PREFERENCES */}
      {activeTab === 'preferences' && (
        <form onSubmit={handleSavePreferences} className="space-y-8 max-w-3xl mx-auto font-sans">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold text-black font-retro-heading uppercase">Account Profile & Preferences</h2>
              <p className="text-xs text-gray-500 font-medium">Update your profile avatar, personal info, trade corridor, and notification settings.</p>
            </div>
            {isSaved && (
              <div className="bg-emerald-600 text-white text-xs font-bold px-4 py-2 rounded-xl flex items-center gap-1.5 animate-in fade-in">
                <Check size={16} /> Changes Saved Successfully!
              </div>
            )}
          </div>

          {/* SECTION 1: AVATAR IMAGE UPLOAD & BASIC PROFILE */}
          <div className="bg-white p-8 rounded-3xl border border-gray-200 space-y-6 shadow-xs">
            <h3 className="font-bold text-lg text-black font-retro-heading uppercase border-b border-gray-100 pb-3">
              User Profile & Avatar Image
            </h3>

            <div className="flex flex-col sm:flex-row items-center gap-6">
              {/* Avatar Preview */}
              <div className="relative group shrink-0">
                <div className="w-24 h-24 rounded-full bg-black text-white text-3xl font-black flex items-center justify-center overflow-hidden border-2 border-gray-200 shadow-md">
                  {avatarUrl ? (
                    <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                  ) : (
                    <span>{fullName.charAt(0) || 'U'}</span>
                  )}
                </div>
                <label className="absolute inset-0 bg-black/50 text-white text-[10px] font-bold uppercase rounded-full opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center cursor-pointer transition">
                  <Upload size={18} />
                  <span>Change</span>
                  <input type="file" accept="image/*" onChange={handleAvatarUpload} className="hidden" />
                </label>
              </div>

              <div className="space-y-2 text-center sm:text-left">
                <div className="flex items-center gap-2 justify-center sm:justify-start">
                  <h4 className="font-bold text-base text-black">{fullName}</h4>
                  <span className="bg-black text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase font-mono">
                    {user?.role?.replace('_', ' ') || 'Diaspora Buyer'}
                  </span>
                </div>
                <p className="text-xs text-gray-500 font-medium">Click on avatar or upload button to change profile picture.</p>
                <label className="inline-flex items-center gap-1.5 bg-gray-100 hover:bg-gray-200 text-black px-4 py-2 rounded-xl text-xs font-bold cursor-pointer transition">
                  <Upload size={14} /> Upload Avatar Image
                  <input type="file" accept="image/*" onChange={handleAvatarUpload} className="hidden" />
                </label>
              </div>
            </div>

            {/* Profile Info Form Fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 text-xs font-medium pt-2">
              <div>
                <label className="font-bold text-black uppercase block mb-2">Full Name</label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full p-3.5 bg-gray-50 border border-gray-300 rounded-xl font-bold text-sm text-black focus:outline-none focus:border-black"
                />
              </div>

              <div>
                <label className="font-bold text-black uppercase block mb-2">Email Address</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full p-3.5 bg-gray-50 border border-gray-300 rounded-xl font-bold text-sm text-black focus:outline-none focus:border-black"
                />
              </div>

              <div>
                <label className="font-bold text-black uppercase block mb-2">Phone Number</label>
                <input
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="w-full p-3.5 bg-gray-50 border border-gray-300 rounded-xl font-bold text-sm text-black focus:outline-none focus:border-black"
                />
              </div>

              <div>
                <label className="font-bold text-black uppercase block mb-2">Mobile Money Number (MTN / Airtel)</label>
                <input
                  type="tel"
                  value={momoNumber}
                  onChange={(e) => setMomoNumber(e.target.value)}
                  className="w-full p-3.5 bg-gray-50 border border-gray-300 rounded-xl font-bold text-sm text-black focus:outline-none focus:border-black"
                />
              </div>
            </div>
          </div>

          {/* SECTION 2: TRADE CORRIDOR & CURRENCY */}
          <div className="bg-white p-8 rounded-3xl border border-gray-200 space-y-6 shadow-xs">
            <h3 className="font-bold text-lg text-black font-retro-heading uppercase border-b border-gray-100 pb-3">
              Trade Corridor & Regional Currency Settings
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 text-xs font-medium">
              <div>
                <label className="font-bold text-black uppercase block mb-2">Preferred Trade Corridor Route</label>
                <select
                  value={preferredCorridor}
                  onChange={(e) => setPreferredCorridor(e.target.value as any)}
                  className="w-full p-3.5 bg-gray-50 border border-gray-300 rounded-xl font-bold text-xs uppercase text-black cursor-pointer focus:outline-none focus:border-black"
                >
                  <option value="KGL_YYZ">🇷🇼 KGL (Kigali) ✈ YYZ (Toronto) 🇨🇦</option>
                  <option value="YYZ_KGL">🇨🇦 YYZ (Toronto) ✈ KGL (Kigali) 🇷🇼</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-black uppercase block mb-2">Preferred Currency Display</label>
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setCurrency('CAD')}
                    className={`flex-1 p-3.5 rounded-xl font-bold border uppercase transition ${
                      currency === 'CAD' ? 'bg-black text-white border-black' : 'bg-gray-50 text-black border-gray-300'
                    }`}
                  >
                    Canadian Dollars (CAD $)
                  </button>
                  <button
                    type="button"
                    onClick={() => setCurrency('RWF')}
                    className={`flex-1 p-3.5 rounded-xl font-bold border uppercase transition ${
                      currency === 'RWF' ? 'bg-black text-white border-black' : 'bg-gray-50 text-black border-gray-300'
                    }`}
                  >
                    Rwandan Francs (RWF)
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* SECTION 3: NOTIFICATIONS & SYSTEM PREFERENCES */}
          <div className="bg-white p-8 rounded-3xl border border-gray-200 space-y-5 shadow-xs">
            <h3 className="font-bold text-lg text-black font-retro-heading uppercase border-b border-gray-100 pb-3">
              Notification & System Preferences
            </h3>

            <div className="space-y-4 text-xs font-bold text-black">
              <label className="p-4 bg-gray-50 rounded-2xl border border-gray-200 flex justify-between items-center cursor-pointer">
                <div>
                  <div>Real-time AWB Flight Tracking SMS Alerts</div>
                  <p className="text-[11px] text-gray-500 font-normal">Receive immediate SMS updates when your parcel lands at Pearson Airport.</p>
                </div>
                <input
                  type="checkbox"
                  checked={smsAlerts}
                  onChange={(e) => setSmsAlerts(e.target.checked)}
                  className="w-4 h-4 accent-black rounded cursor-pointer"
                />
              </label>

              <label className="p-4 bg-gray-50 rounded-2xl border border-gray-200 flex justify-between items-center cursor-pointer">
                <div>
                  <div>Email Dispatch Receipts & Invoices</div>
                  <p className="text-[11px] text-gray-500 font-normal">Receive official PDF trade manifests and customs clearance invoices via email.</p>
                </div>
                <input
                  type="checkbox"
                  checked={emailAlerts}
                  onChange={(e) => setEmailAlerts(e.target.checked)}
                  className="w-4 h-4 accent-black rounded cursor-pointer"
                />
              </label>

              <label className="p-4 bg-gray-50 rounded-2xl border border-gray-200 flex justify-between items-center cursor-pointer">
                <div>
                  <div>256-Bit Escrow Vault Release PIN Notifications</div>
                  <p className="text-[11px] text-gray-500 font-normal">Prompt when 6-digit confirmation PIN is required upon delivery.</p>
                </div>
                <input
                  type="checkbox"
                  checked={escrowPinAlerts}
                  onChange={(e) => setEscrowPinAlerts(e.target.checked)}
                  className="w-4 h-4 accent-black rounded cursor-pointer"
                />
              </label>

              <label className="p-4 bg-gray-50 rounded-2xl border border-gray-200 flex justify-between items-center cursor-pointer">
                <div>
                  <div>Biometric / Passkey Security Authentication</div>
                  <p className="text-[11px] text-gray-500 font-normal">Require Touch ID / Face ID when releasing escrow funds.</p>
                </div>
                <input
                  type="checkbox"
                  checked={biometricAuth}
                  onChange={(e) => setBiometricAuth(e.target.checked)}
                  className="w-4 h-4 accent-black rounded cursor-pointer"
                />
              </label>
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-black hover:bg-gray-800 text-white font-bold py-4 rounded-xl uppercase tracking-widest text-xs cursor-pointer shadow-md transition flex items-center justify-center gap-2"
          >
            <Save size={16} /> Save All Preferences & Profile Changes
          </button>
        </form>
      )}
    </DashboardLayout>
  );
}
