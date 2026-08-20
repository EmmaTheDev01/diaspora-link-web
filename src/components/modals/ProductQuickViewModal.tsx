'use client';
import React, { useState } from 'react';
import { X, ShieldCheck, ShoppingBag, Star } from 'lucide-react';
import { Product } from '../../types';
import { useCartStore } from '../../store/useCartStore';
import { useAuthStore } from '../../store/useAuthStore';

interface ModalProps {
  product: Product | null;
  onClose: () => void;
}

export function ProductQuickViewModal({ product, onClose }: ModalProps) {
  const { addItem } = useCartStore();
  const { currency } = useAuthStore();
  const [quantity, setQuantity] = useState(1);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  if (!product) return null;

  const handleAddToCart = () => {
    addItem(product, quantity);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs font-sans">
      <div className="bg-white rounded-none max-w-3xl w-full overflow-hidden shadow-2xl border-4 border-black relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-9 h-9 bg-black text-white flex items-center justify-center transition hover:bg-neutral-800"
        >
          <X size={20} />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Gallery */}
          <div className="bg-neutral-100 p-6 flex flex-col justify-between border-r-2 border-black">
            <div className="h-72 bg-white relative border-2 border-black overflow-hidden">
              <img
                src={product.images[activeImageIndex] || product.images[0]}
                alt={product.title}
                className="w-full h-full object-cover"
              />
              <span className="absolute top-3 left-3 bg-emerald-600 text-white text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider shadow-xs flex items-center gap-1.5 z-10">
                <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" /> In Stock
              </span>
            </div>

            {product.images.length > 1 && (
              <div className="flex gap-2 mt-4 overflow-x-auto">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIndex(idx)}
                    className={`w-14 h-14 overflow-hidden border-2 transition ${
                      activeImageIndex === idx ? 'border-black' : 'border-transparent opacity-50'
                    }`}
                  >
                    <img src={img} alt="thumb" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details */}
          <div className="p-6 flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase font-black tracking-widest bg-black text-white px-2.5 py-0.5">
                  {product.category.replace('_', ' & ')}
                </span>
                <span className="text-xs text-neutral-500 font-bold uppercase">Origin: {product.origin_country === 'RW' ? 'Rwanda' : 'Canada'}</span>
              </div>

              <h2 className="text-2xl font-black text-black mt-2 leading-tight uppercase font-retro-heading">
                {product.title}
              </h2>

              <div className="flex items-center gap-2 mt-2">
                <div className="flex text-black">
                  <Star size={14} fill="currentColor" />
                  <Star size={14} fill="currentColor" />
                  <Star size={14} fill="currentColor" />
                  <Star size={14} fill="currentColor" />
                  <Star size={14} fill="currentColor" />
                </div>
                <span className="text-xs font-black text-black">{product.rating || 5.0}</span>
                <span className="text-xs text-neutral-500">({product.purchase_count || 45} sales)</span>
              </div>

              <p className="text-neutral-700 text-xs mt-3 leading-relaxed font-medium">
                {product.description}
              </p>

              <div className="mt-4 p-3 bg-neutral-50 border-2 border-black text-xs space-y-1">
                <div className="flex justify-between text-black">
                  <span className="font-bold uppercase">HS Tariff Code:</span>
                  <span className="font-mono font-black">{product.hs_tariff_code || '0901.11.00'}</span>
                </div>
                <div className="flex justify-between text-black">
                  <span className="font-bold uppercase">Freight Weight:</span>
                  <span>{product.weight_kg} kg / unit</span>
                </div>
                <div className="flex justify-between text-black">
                  <span className="font-bold uppercase">Target Corridor:</span>
                  <span className="font-black">{product.target_corridor}</span>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t-2 border-black space-y-4">
              <div className="flex items-baseline gap-3">
                <div className="text-3xl font-black text-black">
                  {currency === 'CAD'
                    ? `$${(product.price_cad * quantity).toFixed(2)} CAD`
                    : `${(product.price_rwf * quantity).toLocaleString()} RWF`}
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex items-center border-2 border-black bg-white">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3 py-2 text-black font-black text-sm"
                  >
                    -
                  </button>
                  <span className="px-4 text-sm font-black text-black">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-3 py-2 text-black font-black text-sm"
                  >
                    +
                  </button>
                </div>

                <button
                  onClick={handleAddToCart}
                  className="flex-1 bg-black hover:bg-neutral-800 text-white font-black py-3 px-6 uppercase tracking-widest transition flex items-center justify-center gap-2 border-2 border-black text-xs cursor-pointer"
                >
                  <ShoppingBag size={18} />
                  <span>Add To Cart</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
