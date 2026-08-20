'use client';
import React from 'react';
import Link from 'next/link';
import { X, Trash2, ShoppingBag, Lock, ChevronRight } from 'lucide-react';
import { useCartStore } from '../../store/useCartStore';
import { useAuthStore } from '../../store/useAuthStore';

export function CartDrawer() {
  const { items, isCartDrawerOpen, closeCartDrawer, removeItem, updateQuantity, getTotalCAD, getTotalRWF, getTotalWeightKg, getShippingFeeCAD } = useCartStore();
  const { currency } = useAuthStore();

  if (!isCartDrawerOpen) return null;

  const totalCad = getTotalCAD();
  const totalRwf = getTotalRWF();
  const weightKg = getTotalWeightKg();
  const shippingCad = getShippingFeeCAD();
  const grandTotalCad = totalCad + shippingCad;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden font-sans">
      <div onClick={closeCartDrawer} className="absolute inset-0 bg-black/60 backdrop-blur-xs transition-opacity" />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col justify-between border-l border-gray-200 animate-in slide-in-from-right duration-300">
          {/* Header */}
          <div className="p-6 bg-black text-white flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
                <ShoppingBag size={18} className="text-white" />
              </div>
              <h2 className="font-bold text-lg uppercase tracking-wider font-retro-heading">Your Cart ({items.length})</h2>
            </div>
            <button onClick={closeCartDrawer} className="text-white p-1 hover:opacity-60 transition cursor-pointer">
              <X size={20} />
            </button>
          </div>

          {/* List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4 divide-y divide-gray-100">
            {items.length === 0 ? (
              <div className="py-16 text-center text-gray-500 space-y-3">
                <div className="w-16 h-16 bg-gray-100 text-black flex items-center justify-center mx-auto rounded-full">
                  <ShoppingBag size={32} />
                </div>
                <p className="font-bold text-black uppercase tracking-wider text-xs">Your shopping cart is empty.</p>
              </div>
            ) : (
              items.map((item) => (
                <div key={item.product_id} className="pt-4 first:pt-0 flex gap-4 items-center">
                  <img src={item.image || item.product.images[0]} alt={item.title} className="w-16 h-16 object-cover rounded-xl border border-gray-200 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-sm text-black line-clamp-1">{item.title}</h4>
                    <p className="text-xs text-gray-500 font-medium">{item.weight_kg * item.quantity} kg freight weight</p>
                    <div className="font-black text-sm text-black mt-1">
                      {currency === 'CAD' ? `$${(item.unit_price_cad * item.quantity).toFixed(2)} CAD` : `${(item.unit_price_rwf * item.quantity).toLocaleString()} RWF`}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="flex items-center border border-gray-300 rounded-lg bg-gray-50">
                      <button onClick={() => updateQuantity(item.product_id, item.quantity - 1)} className="px-2.5 py-1 text-black font-bold text-xs cursor-pointer">-</button>
                      <span className="px-2 text-xs font-bold text-black">{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.product_id, item.quantity + 1)} className="px-2.5 py-1 text-black font-bold text-xs cursor-pointer">+</button>
                    </div>

                    <button onClick={() => removeItem(item.product_id)} className="text-gray-400 hover:text-black p-1 transition cursor-pointer">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Summary */}
          {items.length > 0 && (
            <div className="p-6 bg-gray-50 border-t border-gray-200 space-y-4">
              <div className="space-y-2 text-xs text-gray-700 font-medium">
                <div className="flex justify-between">
                  <span>Items Subtotal:</span>
                  <span className="font-bold text-black">${totalCad.toFixed(2)} CAD</span>
                </div>
                <div className="flex justify-between">
                  <span>Air Freight Tariff ({weightKg.toFixed(1)} kg):</span>
                  <span className="font-bold text-black">${shippingCad.toFixed(2)} CAD</span>
                </div>
                <div className="flex justify-between pt-2 border-t border-gray-200 text-base font-black text-black">
                  <span>Grand Total:</span>
                  <span>${grandTotalCad.toFixed(2)} CAD</span>
                </div>
              </div>

              <Link
                href="/cart"
                onClick={closeCartDrawer}
                className="w-full bg-black hover:bg-gray-800 text-white font-bold py-4 px-4 rounded-xl uppercase tracking-widest flex items-center justify-center gap-2 transition text-xs shadow-md cursor-pointer"
              >
                <span>Proceed To Checkout</span>
                <ChevronRight size={16} />
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
