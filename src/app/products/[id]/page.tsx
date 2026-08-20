'use client';
import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Product } from '@/types';
import { dbService } from '@/services/db';
import { useCartStore } from '@/store/useCartStore';
import { useAuthStore } from '@/store/useAuthStore';
import { ProductDetailSkeleton } from '@/components/common/Skeleton';
import { Star, Heart, Share2, ShoppingBag, ShieldCheck, ArrowLeft, ChevronRight } from 'lucide-react';

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const productId = params?.id as string;

  const { addItem } = useCartStore();
  const { currency } = useAuthStore();

  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [quantity, setQuantity] = useState(1);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProductData() {
      setLoading(true);
      const all = await dbService.getProducts();
      const match = all.find((p) => p.id === productId) || all[0];
      setProduct(match);
      setRelatedProducts(all.filter((p) => p.id !== match.id).slice(0, 4));
      setLoading(false);
    }
    loadProductData();
  }, [productId]);

  if (loading || !product) {
    return <ProductDetailSkeleton />;
  }

  const images = product.images.length > 0 ? product.images : [
    'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?q=80&w=1000',
    'https://images.unsplash.com/photo-1544816155-12df9643f363?q=80&w=1000',
    'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?q=80&w=1000',
  ];

  return (
    <main className="min-h-screen bg-white text-[#111111] font-sans pb-20">
      {/* Top Breadcrumb Banner (Matching screenshot 1 & 2) */}
      <div className="bg-[#F8F8F8] border-b border-gray-100 py-12 px-4 text-center space-y-2">
        <h1 className="text-3xl lg:text-4xl font-black text-[#111111] font-retro-heading">Product Details</h1>
        <div className="flex justify-center items-center gap-2 text-sm text-gray-500 font-medium">
          <Link href="/" className="hover:text-black transition">Home</Link>
          <span>»</span>
          <Link href="/products" className="hover:text-black transition">Shop</Link>
          <span>»</span>
          <span className="text-black font-bold">{product.title}</span>
        </div>
      </div>

      {/* Main Product Details Section (Matching screenshot 1 & 2 layout) */}
      <div className="max-w-7xl mx-auto px-4 lg:px-8 pt-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Left Gallery Column (Thumbnails + Main Image Container) */}
          <div className="lg:col-span-7 flex flex-col sm:flex-row gap-4">
            {/* Vertical Thumbnails Column */}
            <div className="flex sm:flex-col gap-3 shrink-0 order-2 sm:order-1">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImageIndex(idx)}
                  className={`w-20 h-20 bg-[#F6F6F6] border transition overflow-hidden ${
                    selectedImageIndex === idx ? 'border-black opacity-100 ring-2 ring-black/20' : 'border-gray-200 opacity-60 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt="thumbnail" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>

            {/* Main Image Container (Covers container matching screenshot request) */}
            <div className="flex-1 h-[480px] sm:h-[540px] bg-[#F6F6F6] relative overflow-hidden order-1 sm:order-2">
              <img
                src={images[selectedImageIndex] || images[0]}
                alt={product.title}
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Right Product Info Column (Matching screenshot 1 & 2) */}
          <div className="lg:col-span-5 space-y-6 flex flex-col justify-between">
            <div className="space-y-4">
              {/* Product Title */}
              <h1 className="text-3xl lg:text-4xl font-bold text-[#111111] leading-tight font-retro-heading">
                {product.title}
              </h1>

              {/* Ratings */}
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <div className="flex text-amber-400">
                  <Star size={16} fill="currentColor" />
                  <Star size={16} fill="currentColor" />
                  <Star size={16} fill="currentColor" />
                  <Star size={16} fill="currentColor" />
                  <Star size={16} fill="currentColor" />
                </div>
                <span className="font-medium">({product.purchase_count || 23} Customer Review)</span>
              </div>

              {/* Price Range / Dual Price */}
              <div className="text-2xl font-black text-black">
                {currency === 'CAD'
                  ? `$${product.price_cad.toFixed(2)} CAD`
                  : `${product.price_rwf.toLocaleString()} RWF`}
                <span className="text-sm text-gray-400 line-through ml-3 font-normal">
                  {currency === 'CAD'
                    ? `$${(product.price_cad * 1.25).toFixed(2)}`
                    : `${Math.round(product.price_rwf * 1.25).toLocaleString()} RWF`}
                </span>
              </div>

              {/* Description Paragraph */}
              <p className="text-gray-600 text-sm leading-relaxed font-medium">
                {product.description || 'Authentic cross-border export item sourced directly from certified cooperatives in Rwanda. Fully inspected for air freight dispatch with 256-bit escrow protection.'}
              </p>

              {/* Options selection */}
              <div className="pt-2 space-y-3 border-t border-gray-100 text-sm">
                <div className="flex items-center gap-4">
                  <span className="font-bold text-[#111111] min-w-[100px]">Target Corridor:</span>
                  <span className="bg-gray-100 px-3 py-1 font-bold text-xs">{product.target_corridor}</span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="font-bold text-[#111111] min-w-[100px]">Weight (kg):</span>
                  <span className="bg-gray-100 px-3 py-1 font-bold text-xs">{product.weight_kg} kg / unit</span>
                </div>
              </div>

              {/* Quantity Selector + Add To Cart + Wishlist (Exact layout from screenshot 2) */}
              <div className="pt-4 flex flex-wrap items-center gap-4">
                <div className="flex items-center border border-gray-300 bg-white">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3.5 py-2.5 text-black font-bold text-sm hover:bg-gray-100"
                  >
                    -
                  </button>
                  <span className="px-4 text-sm font-bold text-black">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-3.5 py-2.5 text-black font-bold text-sm hover:bg-gray-100"
                  >
                    +
                  </button>
                </div>

                <button
                  onClick={() => addItem(product, quantity)}
                  className="bg-black hover:bg-gray-800 text-white font-bold py-3 px-8 uppercase text-xs tracking-widest transition flex items-center gap-2 cursor-pointer shadow-sm"
                >
                  <ShoppingBag size={16} />
                  <span>ADD TO CART</span>
                </button>

                <button
                  onClick={() => setIsWishlisted(!isWishlisted)}
                  className="p-3 border border-gray-300 hover:border-black transition"
                  title="Wishlist"
                >
                  <Heart size={18} fill={isWishlisted ? '#111111' : 'none'} />
                </button>
                <button className="p-3 border border-gray-300 hover:border-black transition" title="Share">
                  <Share2 size={18} />
                </button>
              </div>

              {/* Product Metadata Info (Stock, SKU, HS Tariff, Category) */}
              <div className="pt-6 border-t border-gray-100 space-y-2 text-sm text-gray-600 font-medium">
                <div className="flex items-center gap-3">
                  <span className="font-bold text-[#111111] min-w-[100px]">Stock:</span>
                  <span className="text-black font-bold">In Stock ({product.stock_quantity} units)</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-bold text-[#111111] min-w-[100px]">HS Tariff Code:</span>
                  <span className="font-mono text-black font-bold">{product.hs_tariff_code || '0901.11.00'}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-bold text-[#111111] min-w-[100px]">Category:</span>
                  <span className="text-black font-bold uppercase">{product.category.replace('_', ' & ')}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-bold text-[#111111] min-w-[100px]">Vendor:</span>
                  <span className="text-black font-bold">{product.vendor_name}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* SECTION: Related / Trending Products Carousel (Matching screenshot 3) */}
        <section className="pt-20 border-t border-gray-100">
          <div className="text-center max-w-xl mx-auto mb-10">
            <h2 className="text-2xl font-black text-[#111111] font-retro-heading">Trending Related Products</h2>
            <p className="text-sm text-gray-500 font-medium mt-1">Discover more export products from certified cooperatives.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map((rel) => (
              <div key={rel.id} className="group space-y-3">
                <Link href={`/products/${rel.id}`} className="block h-72 bg-[#F6F6F6] relative overflow-hidden">
                  <img
                    src={rel.images[0] || 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?q=80&w=800'}
                    alt={rel.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                  />
                  <span className="absolute top-3 left-3 bg-emerald-600 text-white text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider shadow-xs flex items-center gap-1.5 z-10">
                    <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" /> In Stock
                  </span>
                </Link>

                <div className="space-y-1">
                  <Link href={`/products/${rel.id}`} className="font-bold text-sm text-[#111111] line-clamp-1 hover:text-gray-600 transition">
                    {rel.title}
                  </Link>
                  <div className="font-black text-xs text-[#111111]">
                    {currency === 'CAD' ? `$${rel.price_cad.toFixed(2)}` : `${rel.price_rwf.toLocaleString()} RWF`}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
