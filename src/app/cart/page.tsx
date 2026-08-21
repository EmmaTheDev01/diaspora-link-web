'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCartStore } from '@/store/useCartStore';
import { useAuthStore } from '@/store/useAuthStore';
import { dbService } from '@/services/db';
import { Lock, ShoppingBag, CreditCard, Smartphone, CheckCircle2 } from 'lucide-react';

export default function CheckoutPage() {
  const router = useRouter();
  const { items, clearCart, getTotalCAD, getTotalRWF, getTotalWeightKg, getShippingFeeCAD } = useCartStore();
  const { user, openAuthModal, currency } = useAuthStore();

  const [paymentMethod, setPaymentMethod] = useState<'STRIPE' | 'MTN_MOMO' | 'AIRTEL_MONEY'>('STRIPE');
  const [recipientName, setRecipientName] = useState(user?.full_name || 'Grace Mutoni');
  const [phone, setPhone] = useState(user?.phone_number || '+1 416 555 0192');
  const [street, setStreet] = useState('450 Yonge Street, Suite 1200');
  const [city, setCity] = useState('Toronto');
  const [postalCode, setPostalCode] = useState('M4Y 1W9');
  const [country, setCountry] = useState<'CA' | 'RW'>('CA');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState<any | null>(null);

  const totalCad = getTotalCAD();
  const totalRwf = getTotalRWF();
  const weightKg = getTotalWeightKg();
  const shippingCad = getShippingFeeCAD();
  const grandTotalCad = totalCad + shippingCad;
  const grandTotalRwf = totalRwf + Math.round(shippingCad * 1233.33);

  const handleCheckoutSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      router.push('/login');
      return;
    }

    setIsSubmitting(true);

    const created = await dbService.createOrder({
      buyer_id: user.id,
      buyer_name: user.full_name,
      vendor_id: items[0]?.product?.vendor_id || 'usr_vrw_1',
      vendor_name: items[0]?.product?.vendor_name || 'Gishwati Tea Producers Cooperative',
      items: items.map((i) => ({
        product_id: i.product_id,
        title: i.title,
        quantity: i.quantity,
        unit_price_cad: i.unit_price_cad,
        unit_price_rwf: i.unit_price_rwf,
        weight_kg: i.weight_kg,
        image: i.image,
      })),
      corridor: country === 'CA' ? 'KGL_YYZ' : 'YYZ_KGL',
      total_cad: grandTotalCad,
      total_rwf: grandTotalRwf,
      shipping_fee_cad: shippingCad,
      payment_method: paymentMethod,
      delivery_address: {
        street,
        city,
        province_or_state: country === 'CA' ? 'ON' : 'Kigali',
        postal_code: postalCode,
        country,
        recipient_name: recipientName,
        recipient_phone: phone,
      },
    });

    setIsSubmitting(false);
    clearCart();
    setOrderSuccess(created);
  };

  if (orderSuccess) {
    return (
      <main className="min-h-screen bg-white text-[#111111] py-16 px-4 max-w-2xl mx-auto font-sans text-center">
        <div className="bg-[#F8F8F8] p-10 rounded-3xl border border-gray-200 shadow-xl space-y-6">
          <div className="w-20 h-20 bg-black text-white flex items-center justify-center mx-auto rounded-full">
            <CheckCircle2 size={48} />
          </div>
          <div>
            <span className="text-xs font-bold uppercase tracking-widest bg-black text-white px-4 py-1.5 rounded-full">
              Escrow Vault Lock Active
            </span>
            <h1 className="text-3xl font-black text-[#111111] mt-3 font-retro-heading uppercase">Order Placed Successfully!</h1>
            <p className="text-gray-600 text-sm mt-1">
              Order Number: <strong className="text-black font-mono">{orderSuccess.order_number}</strong>
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-gray-200 text-xs text-left space-y-2 font-medium">
            <div className="flex justify-between">
              <span className="font-bold text-black uppercase">Air Waybill Number:</span>
              <span className="font-mono font-bold text-black">{orderSuccess.awb_number}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-bold text-black uppercase">Tamper Seal Code:</span>
              <span className="font-mono font-bold text-black">{orderSuccess.qr_seal_code}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-bold text-black uppercase">Escrow Locked:</span>
              <span className="font-black text-black">${orderSuccess.total_cad.toFixed(2)} CAD</span>
            </div>
          </div>

          <p className="text-gray-600 text-xs font-medium leading-relaxed">
            Your funds are held securely in our 256-bit Escrow Vault until you receive the package in Toronto and enter your 6-digit confirmation PIN.
          </p>

          <div className="pt-2">
            <button
              onClick={() => router.push('/buyer')}
              className="w-full bg-black hover:bg-gray-800 text-white font-bold py-4 rounded-xl text-xs uppercase tracking-widest cursor-pointer shadow-md"
            >
              Track Order Milestone →
            </button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-white text-[#111111] py-10 px-4 lg:px-8 max-w-7xl mx-auto font-sans">
      <div className="mb-8">
        <h1 className="text-3xl lg:text-4xl font-black text-[#111111] font-retro-heading uppercase">Cross-Border Checkout</h1>
        <p className="text-gray-600 text-sm font-medium">Review items, delivery address & select dual-currency payment gateway.</p>
      </div>

      {items.length === 0 ? (
        <div className="bg-[#F8F8F8] p-12 text-center rounded-3xl border border-gray-200 space-y-4">
          <ShoppingBag size={48} className="text-gray-400 mx-auto" />
          <p className="font-bold text-black uppercase tracking-wider text-sm">Your shopping cart is empty.</p>
          <button onClick={() => router.push('/products')} className="text-xs font-bold text-black underline uppercase">
            Browse Export Catalog →
          </button>
        </div>
      ) : (
        <form onSubmit={handleCheckoutSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Side: Address & Payment Methods */}
          <div className="lg:col-span-7 space-y-6">
            <div className="bg-[#F8F8F8] p-8 rounded-2xl border border-gray-200 shadow-xs space-y-4">
              <h3 className="font-bold text-black text-lg font-retro-heading">
                1. Destination Delivery Address
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-medium">
                <div>
                  <label className="font-bold text-black uppercase block mb-1">Recipient Name</label>
                  <input
                    type="text"
                    required
                    value={recipientName}
                    onChange={(e) => setRecipientName(e.target.value)}
                    className="w-full p-3 bg-white border border-gray-300 rounded-lg font-bold text-sm"
                  />
                </div>
                <div>
                  <label className="font-bold text-black uppercase block mb-1">Recipient Phone</label>
                  <input
                    type="text"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full p-3 bg-white border border-gray-300 rounded-lg font-bold text-sm"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="font-bold text-black uppercase block mb-1">Street Address</label>
                  <input
                    type="text"
                    required
                    value={street}
                    onChange={(e) => setStreet(e.target.value)}
                    className="w-full p-3 bg-white border border-gray-300 rounded-lg font-bold text-sm"
                  />
                </div>
                <div>
                  <label className="font-bold text-black uppercase block mb-1">City</label>
                  <input
                    type="text"
                    required
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full p-3 bg-white border border-gray-300 rounded-lg font-bold text-sm"
                  />
                </div>
                <div>
                  <label className="font-bold text-black uppercase block mb-1">Country</label>
                  <select
                    value={country}
                    onChange={(e) => setCountry(e.target.value as any)}
                    className="w-full p-3 bg-white border border-gray-300 rounded-lg font-bold text-sm uppercase text-black"
                  >
                    <option value="CA">🇨🇦 Canada (Toronto YYZ)</option>
                    <option value="RW">🇷🇼 Rwanda (Kigali KGL)</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="bg-[#F8F8F8] p-8 rounded-2xl border border-gray-200 shadow-xs space-y-4">
              <h3 className="font-bold text-black text-lg font-retro-heading">
                2. Dual-Currency Payment Gateway
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-bold">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('STRIPE')}
                  className={`p-5 rounded-xl border flex items-center gap-3 text-left transition uppercase cursor-pointer ${
                    paymentMethod === 'STRIPE' ? 'border-black bg-black text-white' : 'border-gray-300 bg-white text-black hover:bg-gray-50'
                  }`}
                >
                  <CreditCard size={24} />
                  <div>
                    <div>Stripe Card (CAD $)</div>
                    <div className="text-[11px] font-normal opacity-80">Pay in Canadian Dollars</div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('MTN_MOMO')}
                  className={`p-5 rounded-xl border flex items-center gap-3 text-left transition uppercase cursor-pointer ${
                    paymentMethod === 'MTN_MOMO' ? 'border-black bg-black text-white' : 'border-gray-300 bg-white text-black hover:bg-gray-50'
                  }`}
                >
                  <Smartphone size={24} />
                  <div>
                    <div>MTN MoMo (RWF)</div>
                    <div className="text-[11px] font-normal opacity-80">Pay via MoMo Rwanda</div>
                  </div>
                </button>
              </div>
            </div>
          </div>

          {/* Right Side: Totals & Submit */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-[#F8F8F8] p-8 rounded-2xl border border-gray-200 shadow-xs space-y-4">
              <h3 className="font-bold text-black text-lg font-retro-heading">Order Summary</h3>

              <div className="space-y-3 divide-y divide-gray-200 max-h-64 overflow-y-auto pr-1">
                {items.map((item) => (
                  <div key={item.product_id} className="pt-3 first:pt-0 flex justify-between items-center text-sm">
                    <div className="flex items-center gap-3">
                      <img src={item.image || item.product.images[0]} alt="prod" className="w-12 h-12 rounded-lg border border-gray-200 object-cover" />
                      <div>
                        <div className="font-bold text-black line-clamp-1">{item.title}</div>
                        <div className="text-xs text-gray-500 font-medium">Qty: {item.quantity} • {item.weight_kg * item.quantity} kg</div>
                      </div>
                    </div>
                    <div className="font-black text-black">
                      ${(item.unit_price_cad * item.quantity).toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-4 border-t border-gray-200 space-y-2 text-xs text-gray-700 font-medium">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span className="font-bold text-black">${totalCad.toFixed(2)} CAD</span>
                </div>
                <div className="flex justify-between">
                  <span>Freight Tariff ({weightKg.toFixed(1)} kg):</span>
                  <span className="font-bold text-black">${shippingCad.toFixed(2)} CAD</span>
                </div>
                <div className="flex justify-between pt-2 border-t border-gray-200 text-xl font-black text-black">
                  <span>Grand Total:</span>
                  <span>${grandTotalCad.toFixed(2)} CAD</span>
                </div>
                <div className="text-xs text-gray-500 font-mono text-right">
                  Equivalent: {grandTotalRwf.toLocaleString()} RWF
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-[#014485] hover:bg-[#013467] text-white font-bold py-4 rounded-xl uppercase tracking-widest text-xs transition cursor-pointer disabled:opacity-50 shadow-md"
              >
                <span>{isSubmitting ? 'Locking Escrow...' : 'Lock Escrow Vault & Place Order'}</span>
              </button>

            </div>
          </div>
        </form>
      )}
    </main>
  );
}
