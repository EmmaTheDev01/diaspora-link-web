'use client';
import React, { useEffect, useState } from 'react';
import { useAuthStore } from '@/store/useAuthStore';
import { dbService } from '@/services/db';
import { Product, Order } from '@/types';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { VendorSalesChart } from '@/components/charts/VendorSalesChart';
import toast from 'react-hot-toast';
import {
  Package,
  ShoppingBag,
  CreditCard,
  TrendingUp,
  ShieldCheck,
  Plus,
  X,
  Trash2,
  Edit,
  Tag,
  DollarSign,
  Coins,
  Layers,
  Upload,
  UploadCloud,
  FileText,
  Settings,
  User,
  Camera,
  Bell,
  Save,
  Heart,
  Eye,
} from 'lucide-react';

export default function VendorRwandaPage() {
  const { user, setUser, currency } = useAuthStore();
  const [activeTab, setActiveTab] = useState('overview');
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Form states for Add / Edit product
  const [title, setTitle] = useState('');
  const [priceCad, setPriceCad] = useState(25.0);
  const [priceRwf, setPriceRwf] = useState(30800);
  const [category, setCategory] = useState<'coffee_tea' | 'crafts' | 'gifts' | 'decor'>('coffee_tea');
  const [description, setDescription] = useState('');
  const [stockQuantity, setStockQuantity] = useState(150);
  const [imageUrl, setImageUrl] = useState('');

  // Seller Preferences & Profile states
  const [fullName, setFullName] = useState(user?.full_name || 'Gishwati Tea Producers Cooperative');
  const [email, setEmail] = useState(user?.email || 'emmanhabumugisha@gmail.com');
  const [avatarUrl, setAvatarUrl] = useState(user?.avatar_url || '');
  const [phone, setPhone] = useState(user?.phone_number || '+250 788 123 456');
  const [momoNumber, setMomoNumber] = useState(user?.momo_number || '+250 788 123 456');
  const [pushNotify, setPushNotify] = useState(true);
  const [smsAlerts, setSmsAlerts] = useState(true);

  useEffect(() => {
    async function loadData() {
      const prodData = await dbService.getVendorProducts(user?.id || 'usr_vrw_1');
      const orderData = await dbService.getOrders(user?.id);
      setProducts(prodData);
      setOrders(orderData);

      if (user) {
        if (user.full_name) setFullName(user.full_name);
        if (user.email) setEmail(user.email);
        if (user.phone_number) setPhone(user.phone_number);
        if (user.momo_number) setMomoNumber(user.momo_number);
        if (user.avatar_url) setAvatarUrl(user.avatar_url);
      }
    }
    loadData();
  }, [user]);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setAvatarUrl(result);
        toast.success('Profile avatar updated.');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSavePreferences = async (e: React.FormEvent) => {
    e.preventDefault();
    const targetUserId = user?.id || 'usr_vrw_1';

    await dbService.updateUserProfile(targetUserId, {
      full_name: fullName,
      email: email,
      avatar_url: avatarUrl,
      phone_number: phone,
      momo_number: momoNumber,
    });

    if (user) {
      const updatedUser = {
        ...user,
        full_name: fullName,
        email: email,
        avatar_url: avatarUrl,
        phone_number: phone,
        momo_number: momoNumber,
      };
      setUser(updatedUser);
    }
    toast.success('Storefront profile and preferences saved.');
  };

  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        toast.error('Image file size must be less than 10MB.');
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const MAX_WIDTH = 800;
          const MAX_HEIGHT = 800;
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > MAX_WIDTH) {
              height = Math.round((height * MAX_WIDTH) / width);
              width = MAX_WIDTH;
            }
          } else {
            if (height > MAX_HEIGHT) {
              width = Math.round((width * MAX_HEIGHT) / height);
              height = MAX_HEIGHT;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.drawImage(img, 0, 0, width, height);
            const compressed = canvas.toDataURL('image/jpeg', 0.85);
            setImageUrl(compressed);
          } else {
            setImageUrl(event.target?.result as string);
          }
          toast.success('Product image uploaded successfully.');
        };
        img.src = event.target?.result as string;
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    const created = await dbService.createProduct({
      vendor_id: user?.id || 'usr_vrw_1',
      vendor_name: user?.full_name || 'Gishwati Tea Producers Cooperative',
      title,
      description,
      category,
      price_cad: priceCad,
      price_rwf: priceRwf || Math.round(priceCad * 1233.33),
      images: [imageUrl.trim() || 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?q=80&w=800'],
      stock_quantity: stockQuantity,
      weight_kg: 0.5,
      target_corridor: 'KGL_YYZ',
      origin_country: 'RW',
      rdb_certified: true,
      hs_tariff_code: category === 'coffee_tea' ? '0901.11.00' : '0902.30.10',
    });

    setProducts([created, ...products]);
    setIsAddModalOpen(false);
    resetForm();
    toast.success('Product registered to catalog successfully.');
  };

  const handleUpdateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;

    const updated = await dbService.updateProduct(editingProduct.id, {
      title,
      price_cad: priceCad,
      price_rwf: priceRwf || Math.round(priceCad * 1233.33),
      category,
      description,
      stock_quantity: stockQuantity,
      images: [imageUrl.trim() || editingProduct.images[0]],
    });

    if (updated) {
      setProducts(products.map((p) => (p.id === updated.id ? updated : p)));
    }
    setEditingProduct(null);
    resetForm();
    toast.success('Product details updated successfully.');
  };

  const handleDeleteProduct = async (id: string) => {
    if (confirm('Are you sure you want to delete this product from your export catalog?')) {
      const success = await dbService.deleteProduct(id);
      if (success) {
        setProducts(products.filter((p) => p.id !== id));
        toast.success('Product deleted from catalog.');
      }
    }
  };

  const handleToggleStock = async (prod: Product) => {
    const updated = await dbService.updateProduct(prod.id, {
      in_stock: !prod.in_stock,
    });
    if (updated) {
      setProducts(products.map((p) => (p.id === updated.id ? updated : p)));
    }
  };

  const openEditModal = (prod: Product) => {
    setEditingProduct(prod);
    setTitle(prod.title);
    setPriceCad(prod.price_cad);
    setPriceRwf(prod.price_rwf);
    setCategory(prod.category as any);
    setDescription(prod.description || '');
    setStockQuantity(prod.stock_quantity || 100);
    setImageUrl(prod.images[0] || '');
  };

  const resetForm = () => {
    setTitle('');
    setPriceCad(25.0);
    setPriceRwf(30800);
    setCategory('coffee_tea');
    setDescription('');
    setStockQuantity(150);
    setImageUrl('');
  };

  const menuItems = [
    { id: 'overview', label: 'Overview', icon: <Package size={18} /> },
    { id: 'orders', label: 'Orders & Deliveries', icon: <ShoppingBag size={18} /> },
    { id: 'catalog', label: 'Manage Products', icon: <ShoppingBag size={18} /> },
    { id: 'finances', label: 'Finances & Wallet', icon: <CreditCard size={18} /> },
    { id: 'analytics', label: 'Analytics & Most Liked', icon: <TrendingUp size={18} /> },
    { id: 'kyc', label: 'Rwanda Exporter KYC', icon: <ShieldCheck size={18} /> },
    { id: 'preferences', label: 'Seller Preferences', icon: <Settings size={18} /> },
  ];

  return (
    <DashboardLayout
      activeTab={activeTab}
      setActiveTab={setActiveTab}
      menuItems={menuItems}
      title={user?.full_name || 'Gishwati Tea Producers Cooperative'}
      subtitle="Rwanda Exporter Portal • Direct Flight KGL ✈ YYZ Dispatch"
    >
      {/* TAB 1: OVERVIEW */}
      {activeTab === 'overview' && (
        <div className="space-y-8">
          {/* Business Header */}
          <div className="bg-black text-white p-8 rounded-3xl flex flex-col md:flex-row justify-between items-start md:items-center gap-6 shadow-xl">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-widest bg-white text-black px-3.5 py-1 rounded-full flex items-center gap-1.5 font-mono">
                  <ShieldCheck size={14} /> VERIFIED EXPORTER COOPERATIVE
                </span>
              </div>
              <h2 className="text-2xl lg:text-3xl font-black font-retro-heading uppercase">
                {user?.full_name || 'Gishwati Cooperative Operations'}
              </h2>
              <p className="text-gray-300 text-xs font-medium">Exporting premium agricultural produce to Toronto diaspora importers.</p>
            </div>

            <button
              onClick={() => {
                resetForm();
                setIsAddModalOpen(true);
              }}
              className="bg-white hover:bg-gray-100 text-black font-bold px-6 py-3.5 rounded-xl transition text-xs uppercase tracking-wider cursor-pointer shadow-md"
            >
              <Plus size={16} className="inline mr-1.5" /> Add New Export Product
            </button>
          </div>

          {/* Dynamic Metrics Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs flex flex-col justify-between space-y-3">
              <div className="flex justify-between text-gray-500">
                <span className="text-xs font-bold uppercase tracking-wider text-black">Gross Export Sales</span>
                <CreditCard size={20} className="text-black" />
              </div>
              <div className="text-3xl font-black text-black font-retro-heading">
                ${orders.reduce((acc, curr) => acc + (curr.total_cad || 0), 0).toFixed(2)} CAD
              </div>
              <span className="text-xs text-gray-500 font-medium font-mono">
                {orders.reduce((acc, curr) => acc + (curr.total_rwf || 0), 0).toLocaleString()} RWF volume
              </span>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs flex flex-col justify-between space-y-3">
              <div className="flex justify-between text-gray-500">
                <span className="text-xs font-bold uppercase tracking-wider text-black">Active Products</span>
                <Package size={20} className="text-black" />
              </div>
              <div className="text-4xl font-black text-black font-retro-heading">{products.length}</div>
              <span className="text-xs text-gray-500 font-medium">Verified catalog items</span>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs flex flex-col justify-between space-y-3">
              <div className="flex justify-between text-gray-500">
                <span className="text-xs font-bold uppercase tracking-wider text-black">Escrow Vault Payouts</span>
                <ShieldCheck size={20} className="text-black" />
              </div>
              <div className="text-3xl font-black text-black font-retro-heading">
                ${orders.filter(o => o.escrow_released || o.status === 'delivered').reduce((acc, curr) => acc + (curr.total_cad || 0), 0).toFixed(2)} CAD
              </div>
              <span className="text-xs text-emerald-600 font-bold font-mono">
                {orders.length > 0 ? Math.round((orders.filter(o => o.escrow_released || o.status === 'delivered').length / orders.length) * 100) : 100}% Released via PIN
              </span>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs flex flex-col justify-between space-y-3">
              <div className="flex justify-between text-gray-500">
                <span className="text-xs font-bold uppercase tracking-wider text-black">Trade Corridor</span>
                <TrendingUp size={20} className="text-black" />
              </div>
              <div className="text-2xl font-black text-black font-retro-heading uppercase">KGL ✈ YYZ</div>
              <span className="text-xs text-gray-500 font-medium">RwandAir Direct Corridor</span>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-xl font-bold text-black font-retro-heading">Revenue & Export Sales Visualisation</h3>
            <VendorSalesChart />
          </div>
        </div>
      )}

      {/* TAB 2: ORDERS & DELIVERIES TABLE */}
      {activeTab === 'orders' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h2 className="text-2xl font-bold text-black font-retro-heading">Orders & Freight Deliveries Table</h2>
              <p className="text-xs text-gray-500 font-medium">Real-time purchase orders, 256-bit Escrow Vault locks, and Air Waybills.</p>
            </div>
            <span className="bg-black text-white text-xs font-mono font-bold px-3.5 py-1.5 rounded-full uppercase">
              {orders.length} Active Orders
            </span>
          </div>

          <div className="bg-white rounded-2xl border border-gray-200 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-[#111111] font-medium">
                <thead className="bg-black text-white font-bold uppercase tracking-wider text-xs">
                  <tr>
                    <th className="p-4">Order Number</th>
                    <th className="p-4">Buyer Name & Delivery Address</th>
                    <th className="p-4">Total Price</th>
                    <th className="p-4">Escrow Status</th>
                    <th className="p-4">AWB Freight Code</th>
                    <th className="p-4">Order Status</th>
                    <th className="p-4">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {orders.length > 0 ? (
                    orders.map((o) => (
                      <tr key={o.id} className="hover:bg-gray-50 transition">
                        <td className="p-4 font-mono font-bold text-black">{o.order_number}</td>
                        <td className="p-4">
                          <div className="font-bold text-black text-sm flex items-center gap-1.5">
                            <User size={14} className="text-gray-500 shrink-0" />
                            <span>{o.buyer_name || o.delivery_address?.recipient_name || 'Grace Mutoni'}</span>
                          </div>
                          <div className="text-xs text-gray-500 font-mono mt-0.5">
                            {o.delivery_address?.city || 'Toronto'}, {o.delivery_address?.country || 'CA'} • {o.delivery_address?.recipient_phone || '+1 416 555 0192'}
                          </div>
                        </td>
                        <td className="p-4 font-bold text-black">
                          ${o.total_cad.toFixed(2)} CAD <span className="text-xs text-gray-500 font-mono">({o.total_rwf.toLocaleString()} RWF)</span>
                        </td>
                        <td className="p-4">
                          <span className={`text-xs font-bold px-2.5 py-1 rounded-full uppercase ${o.escrow_released ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>
                            {o.escrow_released ? 'Released' : 'Locked in Escrow'}
                          </span>
                        </td>
                        <td className="p-4 font-mono text-xs font-bold text-black">{o.awb_number || 'AWB-KGL-88291'}</td>
                        <td className="p-4">
                          <span className="bg-black text-white font-bold text-xs px-2.5 py-1 rounded uppercase font-mono">
                            {o.status}
                          </span>
                        </td>
                        <td className="p-4">
                          <button
                            onClick={() => toast.success(`Viewing order details for ${o.order_number}`)}
                            className="bg-gray-100 hover:bg-gray-200 text-black font-bold text-xs px-3 py-1.5 rounded-lg transition cursor-pointer"
                          >
                            View Order
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={7} className="p-8 text-center text-gray-500 font-medium text-xs">
                        No active orders found in database table.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: MANAGE PRODUCTS */}
      {activeTab === 'catalog' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h2 className="text-2xl font-bold text-black font-retro-heading">Manage Seller Product Inventory</h2>
              <p className="text-xs text-gray-500 font-medium">Create, update pricing, edit details, or toggle availability of export items.</p>
            </div>
            <button
              onClick={() => {
                resetForm();
                setIsAddModalOpen(true);
              }}
              className="bg-black hover:bg-gray-800 text-white font-bold px-5 py-3 rounded-xl text-xs uppercase tracking-wider cursor-pointer shadow-xs"
            >
              <Plus size={16} className="inline mr-1.5" /> Add Export Item
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((prod) => (
              <div key={prod.id} className="bg-white rounded-2xl border border-gray-200 p-5 space-y-4 shadow-xs relative flex flex-col justify-between">
                <div>
                  <div className="h-44 bg-gray-100 rounded-xl overflow-hidden relative">
                    <img src={prod.images[0]} alt={prod.title} className="w-full h-full object-cover" />
                    <button
                      onClick={() => handleToggleStock(prod)}
                      className={`absolute top-3 left-3 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase cursor-pointer transition ${
                        prod.in_stock !== false ? 'bg-emerald-600 text-white' : 'bg-red-600 text-white'
                      }`}
                    >
                      {prod.in_stock !== false ? 'In Stock' : 'Out of Stock'}
                    </button>
                  </div>

                  <div className="mt-3 space-y-1">
                    <h4 className="font-bold text-sm text-black line-clamp-1">{prod.title}</h4>
                    <p className="text-xs text-gray-500 font-mono">HS Tariff: {prod.hs_tariff_code || '0901.11.00'}</p>
                    <div className="font-black text-base text-black pt-1">
                      {currency === 'RWF' ? (
                        <>
                          {prod.price_rwf.toLocaleString()} RWF <span className="text-xs text-gray-500 font-mono">(${prod.price_cad.toFixed(2)} CAD)</span>
                        </>
                      ) : (
                        <>
                          ${prod.price_cad.toFixed(2)} CAD <span className="text-xs text-gray-500 font-mono">({prod.price_rwf.toLocaleString()} RWF)</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-gray-100 flex items-center justify-between gap-2">
                  <button
                    onClick={() => openEditModal(prod)}
                    className="flex-1 bg-gray-100 hover:bg-gray-200 text-black font-bold py-2 px-3 rounded-xl text-xs flex items-center justify-center gap-1.5 transition cursor-pointer"
                  >
                    <Edit size={14} /> Edit Item
                  </button>
                  <button
                    onClick={() => handleDeleteProduct(prod.id)}
                    className="bg-red-50 hover:bg-red-100 text-red-600 font-bold p-2 rounded-xl text-xs transition cursor-pointer"
                    title="Delete Product"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: FINANCES & WALLET */}
      {activeTab === 'finances' && (
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-black font-retro-heading">Finances & Escrow Ledger</h2>
          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-xs space-y-4">
            <h3 className="font-bold text-lg text-black font-retro-heading">Escrow Payout Ledger</h3>
            <div className="divide-y divide-gray-200 text-xs font-medium">
              <div className="py-3 flex justify-between items-center">
                <div>
                  <div className="font-bold text-black">Order #ORD-88291 (Gishwati Tea 250g)</div>
                  <div className="text-gray-500 text-[11px]">Buyer: Grace Mutoni (Toronto)</div>
                </div>
                <div className="text-right">
                  <div className="font-black text-black">$77.00 CAD</div>
                  <div className="text-emerald-600 font-bold">Released via PIN</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: ANALYTICS & MOST LIKED PRODUCTS */}
      {activeTab === 'analytics' && (
        <div className="space-y-8">
          <div className="space-y-1">
            <h2 className="text-2xl font-bold text-black font-retro-heading">Analytics & Most Liked Products</h2>
            <p className="text-xs text-gray-500 font-medium">Top performing products ranked by buyer likes, wishlists, views, and sales volume.</p>
          </div>

          <div className="space-y-4">
            <h3 className="text-xl font-bold text-black font-retro-heading">Revenue Visualisation</h3>
            <VendorSalesChart />
          </div>

          {/* Most Liked Products Table */}
          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs space-y-4">
            <div className="flex justify-between items-center border-b border-gray-100 pb-4">
              <h3 className="text-lg font-bold text-black font-retro-heading flex items-center gap-2">
                <Heart size={20} className="text-red-500 fill-red-500" /> Most Liked & Wishlisted Catalog Items
              </h3>
              <span className="text-xs text-gray-500 font-bold uppercase font-mono">Buyer Engagement Ranking</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-[#111111] font-medium">
                <thead className="bg-black text-white font-bold uppercase tracking-wider text-xs">
                  <tr>
                    <th className="p-3.5">Rank</th>
                    <th className="p-3.5">Product</th>
                    <th className="p-3.5">Category</th>
                    <th className="p-3.5">Likes</th>
                    <th className="p-3.5">Wishlisted</th>
                    <th className="p-3.5">Views</th>
                    <th className="p-3.5">Price</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 text-xs">
                  {products.map((prod, idx) => (
                    <tr key={prod.id} className="hover:bg-gray-50 transition">
                      <td className="p-3.5 font-bold font-mono text-black">
                        <span className={`w-6 h-6 rounded-full inline-flex items-center justify-center text-xs font-black ${idx === 0 ? 'bg-amber-400 text-black' : idx === 1 ? 'bg-gray-300 text-black' : idx === 2 ? 'bg-amber-700 text-white' : 'bg-gray-100 text-black'}`}>
                          #{idx + 1}
                        </span>
                      </td>
                      <td className="p-3.5">
                        <div className="flex items-center gap-3">
                          <img src={prod.images[0]} alt={prod.title} className="w-10 h-10 rounded-lg object-cover border border-gray-200 shrink-0" />
                          <span className="font-bold text-black">{prod.title}</span>
                        </div>
                      </td>
                      <td className="p-3.5 font-mono uppercase font-bold text-gray-600">{prod.category}</td>
                      <td className="p-3.5 font-black text-red-600 font-mono">{185 - idx * 24} Likes</td>
                      <td className="p-3.5 font-black text-purple-600 font-mono">{92 - idx * 12} Saved</td>
                      <td className="p-3.5 font-bold font-mono text-black">{(1420 - idx * 180).toLocaleString()} Views</td>
                      <td className="p-3.5 font-bold text-black">${prod.price_cad.toFixed(2)} CAD</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 6: RWANDA EXPORTER KYC */}
      {activeTab === 'kyc' && (
        <div className="bg-white p-8 rounded-3xl border border-gray-200 max-w-2xl mx-auto space-y-6 shadow-xs">
          <h2 className="text-2xl font-bold text-black font-retro-heading">Rwanda Exporter KYC Verification</h2>
          <p className="text-xs text-gray-500 font-medium">Official RDB TIN & Exporter Cooperative Verification details.</p>
          <div className="space-y-4 text-xs font-medium">
            <div>
              <label className="font-bold text-black uppercase block mb-1">RDB TIN Number</label>
              <input type="text" disabled value={user?.rdb_tin_number || 'TIN-109283745'} className="w-full p-3 bg-gray-50 border rounded-xl font-mono font-bold text-sm text-black" />
            </div>
            <div>
              <label className="font-bold text-black uppercase block mb-1">KYC Status</label>
              <div className="p-3.5 bg-gray-50 border rounded-xl font-bold text-black flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> RDB Verified Exporter
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 7: SELLER PREFERENCES */}
      {activeTab === 'preferences' && (
        <div className="max-w-3xl mx-auto space-y-8 font-sans pb-12">
          <div className="text-center space-y-2">
            <h2 className="text-3xl font-black text-[#111111] font-retro-heading uppercase">
              Seller Account & Preferences
            </h2>
            <p className="text-xs text-gray-500 font-medium max-w-md mx-auto">
              Manage your business profile avatar, contact details, trade corridor preferences, and payout settings.
            </p>
          </div>

          <form onSubmit={handleSavePreferences} className="space-y-6">
            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs flex flex-col sm:flex-row items-center gap-6">
              <div className="relative w-24 h-24 rounded-full overflow-hidden border-2 border-gray-300 bg-gray-100 flex items-center justify-center shrink-0 group">
                {avatarUrl ? (
                  <img src={avatarUrl} alt="Seller Avatar" className="w-full h-full object-cover" />
                ) : (
                  <User size={36} className="text-gray-400" />
                )}
                <label className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition flex flex-col items-center justify-center text-white cursor-pointer">
                  <Camera size={20} />
                  <span className="text-[10px] font-bold uppercase mt-1">Upload</span>
                  <input type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
                </label>
              </div>

              <div className="space-y-2 text-center sm:text-left flex-1">
                <div className="font-black text-lg text-black">{fullName || user?.full_name || 'Seller Storefront'}</div>
                <div className="text-xs text-gray-500 font-mono">{user?.email}</div>
                <label className="inline-flex items-center gap-1.5 bg-black text-white text-xs font-bold px-3.5 py-1.5 rounded-full cursor-pointer hover:bg-gray-800 transition">
                  <Upload size={14} /> Upload Storefront Logo
                  <input type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
                </label>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs space-y-4">
              <h3 className="font-bold text-base text-black font-retro-heading uppercase flex items-center gap-2 border-b border-gray-100 pb-3">
                <User size={18} /> Storefront Profile Info
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-medium">
                <div>
                  <label className="font-bold text-black uppercase block mb-1.5">Business / Exporter Name</label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full p-3 bg-gray-50 border border-gray-300 rounded-xl font-bold text-sm text-black focus:outline-none focus:border-black"
                  />
                </div>

                <div>
                  <label className="font-bold text-black uppercase block mb-1.5">Email Address</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full p-3 bg-gray-50 border border-gray-300 rounded-xl font-bold text-sm text-black focus:outline-none focus:border-black font-mono"
                  />
                </div>

                <div>
                  <label className="font-bold text-black uppercase block mb-1.5">Business Phone Number</label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full p-3 bg-gray-50 border border-gray-300 rounded-xl font-bold text-sm text-black focus:outline-none focus:border-black"
                  />
                </div>

                <div>
                  <label className="font-bold text-black uppercase block mb-1.5">Payout Settlement Method</label>
                  <input
                    type="text"
                    value={momoNumber}
                    onChange={(e) => setMomoNumber(e.target.value)}
                    placeholder="+250 788 123 456 (MTN MoMo)"
                    className="w-full p-3 bg-gray-50 border border-gray-300 rounded-xl font-bold text-sm text-black focus:outline-none focus:border-black"
                  />
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs space-y-4">
              <h3 className="font-bold text-base text-black font-retro-heading uppercase flex items-center gap-2 border-b border-gray-100 pb-3">
                <Bell size={18} /> Notification & Security Preferences
              </h3>

              <div className="space-y-3 text-xs font-bold text-black">
                <label className="flex items-center justify-between p-3 bg-gray-50 rounded-xl cursor-pointer">
                  <span>Push & SMS Real-time Escrow Notifications</span>
                  <input
                    type="checkbox"
                    checked={pushNotify}
                    onChange={(e) => setPushNotify(e.target.checked)}
                    className="w-4 h-4 accent-black cursor-pointer"
                  />
                </label>

                <label className="flex items-center justify-between p-3 bg-gray-50 rounded-xl cursor-pointer">
                  <span>Air Waybill Luggage Flight Tracking SMS Alerts</span>
                  <input
                    type="checkbox"
                    checked={smsAlerts}
                    onChange={(e) => setSmsAlerts(e.target.checked)}
                    className="w-4 h-4 accent-black cursor-pointer"
                  />
                </label>
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-black hover:bg-gray-800 text-white font-bold py-4 rounded-xl text-xs uppercase tracking-widest transition shadow-md cursor-pointer flex items-center justify-center gap-2"
            >
              <Save size={16} /> Save Seller Preferences
            </button>
          </form>
        </div>
      )}

      {/* ADD / EDIT PRODUCT MODAL */}
      {(isAddModalOpen || editingProduct) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs font-sans overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-lg w-full p-8 space-y-5 shadow-2xl relative border border-gray-200 my-8">
            <button
              onClick={() => {
                setIsAddModalOpen(false);
                setEditingProduct(null);
              }}
              className="absolute top-4 right-4 text-black hover:opacity-60 cursor-pointer"
            >
              <X size={20} />
            </button>

            <div className="space-y-1">
              <h3 className="text-2xl font-black text-[#111111] font-retro-heading uppercase flex items-center gap-2">
                <ShoppingBag size={24} /> {editingProduct ? 'Edit Product Details' : 'Add Export Product'}
              </h3>
              <p className="text-xs text-gray-500 font-medium">
                {editingProduct ? 'Update product pricing, title, image, description, or stock.' : 'List a new export product for international buyers.'}
              </p>
            </div>

            <form onSubmit={editingProduct ? handleUpdateProduct : handleCreateProduct} className="space-y-4 text-xs font-medium">
              <div>
                <label className="font-bold text-[#111111] uppercase flex items-center gap-1.5 block mb-1 text-xs">
                  <Tag size={14} /> Product Title
                </label>
                <input
                  type="text"
                  required
                  placeholder="Gishwati Special Organic White Tea"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full p-3 bg-gray-50 border border-gray-300 rounded-xl font-bold text-sm text-black focus:outline-none focus:border-black"
                />
              </div>

              {/* Dynamic Currency Order & Conversion */}
              <div className="grid grid-cols-2 gap-4">
                {currency === 'RWF' ? (
                  <>
                    <div>
                      <label className="font-bold text-[#111111] uppercase flex items-center gap-1.5 block mb-1 text-xs">
                        <Coins size={14} /> Price (RWF) Primary
                      </label>
                      <input
                        type="number"
                        required
                        value={priceRwf}
                        onChange={(e) => {
                          const val = parseInt(e.target.value) || 0;
                          setPriceRwf(val);
                          setPriceCad(parseFloat((val / 1233.33).toFixed(2)));
                        }}
                        className="w-full p-3 bg-gray-50 border border-gray-300 rounded-xl font-bold text-sm text-black focus:outline-none focus:border-black"
                      />
                    </div>
                    <div>
                      <label className="font-bold text-[#111111] uppercase flex items-center gap-1.5 block mb-1 text-xs">
                        <DollarSign size={14} /> Converted (CAD $)
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        required
                        value={priceCad}
                        onChange={(e) => {
                          const val = parseFloat(e.target.value) || 0;
                          setPriceCad(val);
                          setPriceRwf(Math.round(val * 1233.33));
                        }}
                        className="w-full p-3 bg-gray-50 border border-gray-300 rounded-xl font-bold text-sm text-black focus:outline-none focus:border-black font-mono"
                      />
                    </div>
                  </>
                ) : (
                  <>
                    <div>
                      <label className="font-bold text-[#111111] uppercase flex items-center gap-1.5 block mb-1 text-xs">
                        <DollarSign size={14} /> Price (CAD $) Primary
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        required
                        value={priceCad}
                        onChange={(e) => {
                          const val = parseFloat(e.target.value) || 0;
                          setPriceCad(val);
                          setPriceRwf(Math.round(val * 1233.33));
                        }}
                        className="w-full p-3 bg-gray-50 border border-gray-300 rounded-xl font-bold text-sm text-black focus:outline-none focus:border-black"
                      />
                    </div>
                    <div>
                      <label className="font-bold text-[#111111] uppercase flex items-center gap-1.5 block mb-1 text-xs">
                        <Coins size={14} /> Converted (RWF)
                      </label>
                      <input
                        type="number"
                        required
                        value={priceRwf}
                        onChange={(e) => {
                          const val = parseInt(e.target.value) || 0;
                          setPriceRwf(val);
                          setPriceCad(parseFloat((val / 1233.33).toFixed(2)));
                        }}
                        className="w-full p-3 bg-gray-50 border border-gray-300 rounded-xl font-bold text-sm text-black focus:outline-none focus:border-black font-mono"
                      />
                    </div>
                  </>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="font-bold text-[#111111] uppercase flex items-center gap-1.5 block mb-1 text-xs">
                    <Layers size={14} /> Category
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full p-3 bg-gray-50 border border-gray-300 rounded-xl font-bold text-xs uppercase text-black cursor-pointer focus:outline-none focus:border-black"
                  >
                    <option value="coffee_tea">Coffee & Tea</option>
                    <option value="crafts">Crafts & Art</option>
                    <option value="gifts">Gifts & Spices</option>
                    <option value="decor">Home Decor</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-[#111111] uppercase flex items-center gap-1.5 block mb-1 text-xs">
                    <Package size={14} /> Stock Quantity
                  </label>
                  <input
                    type="number"
                    required
                    value={stockQuantity}
                    onChange={(e) => setStockQuantity(parseInt(e.target.value))}
                    className="w-full p-3 bg-gray-50 border border-gray-300 rounded-xl font-bold text-sm text-black focus:outline-none focus:border-black"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-[#111111] uppercase flex items-center gap-1.5 block mb-1 text-xs">
                  <Upload size={14} /> Product Image Upload
                </label>

                {imageUrl ? (
                  <div className="relative rounded-xl overflow-hidden border border-gray-300 h-36 group mb-2 bg-gray-50">
                    <img src={imageUrl} alt="Product Preview" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => setImageUrl('')}
                      className="absolute top-2 right-2 bg-black/80 hover:bg-black text-white p-1.5 rounded-full cursor-pointer transition shadow-md"
                      title="Remove product image"
                    >
                      <X size={14} />
                    </button>
                    <span className="absolute bottom-2 left-2 bg-black/80 text-white text-[10px] font-bold px-2 py-0.5 rounded uppercase font-mono">
                      Image Loaded
                    </span>
                  </div>
                ) : (
                  <label className="border-2 border-dashed border-gray-300 hover:border-black rounded-2xl p-5 flex flex-col items-center justify-center gap-1.5 text-center cursor-pointer transition bg-gray-50 hover:bg-gray-100/50 mb-2">
                    <UploadCloud size={28} className="text-gray-400" />
                    <div className="text-xs font-bold text-black">Click to upload product image file</div>
                    <p className="text-[11px] text-gray-500 font-medium">PNG, JPG, WEBP up to 5MB</p>
                    <input type="file" accept="image/*" className="hidden" onChange={handleImageFileChange} />
                  </label>
                )}

                <div className="relative">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1">Or paste image URL link:</span>
                  <input
                    type="url"
                    placeholder="https://images.unsplash.com/..."
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    className="w-full p-2.5 bg-gray-50 border border-gray-300 rounded-xl font-bold text-xs text-black focus:outline-none focus:border-black"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-[#111111] uppercase flex items-center gap-1.5 block mb-1 text-xs">
                  <FileText size={14} /> Description
                </label>
                <textarea
                  rows={3}
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full p-3 bg-gray-50 border border-gray-300 rounded-xl font-bold text-sm text-black focus:outline-none focus:border-black"
                  placeholder="Product description and origin details..."
                />
              </div>

              <button
                type="submit"
                className="w-full bg-black hover:bg-gray-800 text-white font-bold py-4 rounded-xl text-xs uppercase tracking-widest cursor-pointer shadow-md transition flex items-center justify-center gap-2"
              >
                <span>{editingProduct ? 'Save Product Changes' : 'Register Product To Catalog'}</span>
              </button>
            </form>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
