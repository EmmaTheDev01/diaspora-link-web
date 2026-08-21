'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

const heroSlides = [
  {
    id: 0,
    title: 'Organic Gishwati Tea & Arabica Supplies',
    subtitle: 'Clean, premium export coffee & specialty tea harvested by Gishwati cooperatives. Direct flight dispatch on KGL ✈ YYZ.',
    tag1: '-28% OFF',
    tag2: 'Hot Export',
    image: '/coffee.png',
    link: '/products?category=tea',
    btnText: 'SHOP COFFEE & TEA',
    bgColor: 'bg-[#E3F6FA]',
  },
  {
    id: 1,
    title: 'Handcrafted Authentic Agaseke Art & Decor',
    subtitle: 'Empowering Rwandan women artisans bringing heritage handwoven baskets and cultural crafts directly to Canadian & global homes.',
    tag1: 'Artisan',
    tag2: 'New Arrival',
    image: '/craft.png',
    link: '/products?category=crafts',
    btnText: 'DISCOVER CRAFTS',
    bgColor: 'bg-[#ECEEFA]',
  },
  {
    id: 2,
    title: 'Luggage Air Freight Cargo Capacity (KGL ✈ YYZ)',
    subtitle: 'Monetise spare baggage allowance carrying verified export parcels on RwandAir direct flights backed by Escrow Vault protection.',
    tag1: 'Air Freight',
    tag2: 'RwandAir Direct',
    image: '/cargo.png',
    link: '/cargo',
    btnText: 'BOOK CARGO SLOT',
    bgColor: 'bg-[#F7F2EC]',
  },
];


export function HeroAreaMarketplace() {
  const [activeSlide, setActiveSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % heroSlides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const slide = heroSlides[activeSlide];

  return (
    <section className="py-8 px-4 lg:px-8 max-w-7xl mx-auto font-sans">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Main Hero Banner (Left 8/12 - Dynamic Slider) */}
        <div className={`lg:col-span-8 relative rounded-3xl ${slide.bgColor} text-[#111111] p-6 sm:p-8 lg:p-12 flex flex-col justify-between min-h-[420px] sm:min-h-[480px] h-full overflow-hidden group shadow-xs transition-colors duration-500 border border-gray-200`}>
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-6 items-center relative z-10 my-auto">
            {/* Left 7 cols: Content Container */}
            <div className="sm:col-span-7 space-y-4 sm:space-y-5">
              {/* Pill Tags */}
              <div className="flex items-center gap-2">
                <span className="bg-white text-black text-[11px] sm:text-xs font-bold px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-full shadow-xs uppercase tracking-wider font-mono">
                  {slide.tag1}
                </span>
                <span className="bg-black text-white text-[11px] sm:text-xs font-bold px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-full shadow-xs uppercase tracking-wider font-mono">
                  {slide.tag2}
                </span>
              </div>

              {/* Main Headline */}
              <h1 className="text-2xl sm:text-3xl lg:text-5xl font-black tracking-tight text-[#111111] leading-tight font-retro-heading">
                {slide.title}
              </h1>

              <p className="text-gray-700 text-xs sm:text-sm leading-relaxed font-medium">
                {slide.subtitle}
              </p>

              {/* Link Button */}
              <div className="pt-2">
                <Link
                  href={slide.link}
                  className="inline-flex items-center gap-3 text-sm font-black uppercase tracking-wider text-[#111111] hover:text-gray-600 transition group/btn"
                >
                  <span>{slide.btnText}</span>
                  <div className="w-8 h-8 rounded-full bg-[#111111] text-white flex items-center justify-center group-hover/btn:bg-gray-700 transition">
                    <ChevronRight size={16} />
                  </div>
                </Link>
              </div>
            </div>

            {/* Right 5 cols: Product/Cargo Image Container */}
            <div className="sm:col-span-5 flex items-center justify-center p-2 relative">
              <img
                key={slide.image}
                src={slide.image}
                alt={slide.title}
                className="w-full max-h-72 object-contain group-hover:scale-105 transition duration-500"
              />

            </div>
          </div>

          {/* Carousel Indicator Dots */}
          <div className="flex items-center gap-2 pt-4 relative z-10">
            {heroSlides.map((s, idx) => (
              <button
                key={s.id}
                onClick={() => setActiveSlide(idx)}
                className={`h-2 rounded-full transition-all cursor-pointer ${
                  activeSlide === idx ? 'w-8 bg-[#111111]' : 'w-2 bg-gray-400 hover:bg-gray-600'
                }`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>
        </div>

        {/* Right 4/12: Promo Banners */}
        <div className="lg:col-span-4 flex flex-col gap-6 justify-between">
          <div className="bg-[#FAF0E6] text-[#111111] p-6 rounded-3xl flex-1 flex flex-col justify-between space-y-4 border border-gray-200 shadow-xs relative overflow-hidden group">
            <div className="space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider bg-black text-white px-2.5 py-0.5 rounded font-mono">
                HOT PROMO
              </span>
              <h3 className="text-xl font-black font-retro-heading text-black">Organic Akabanga Chili Drops</h3>
              <p className="text-xs text-gray-600 font-medium">Authentic 100% natural Rwandan chili oil exported to Canada.</p>
            </div>
            <Link href="/products" className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-wider text-black">
              <span>EXPLORE SPICES</span>
              <ChevronRight size={14} />
            </Link>
          </div>

          <div className="bg-[#EBF3E8] text-[#111111] p-6 rounded-3xl flex-1 flex flex-col justify-between space-y-4 border border-gray-200 shadow-xs relative overflow-hidden group">
            <div className="space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider bg-black text-white px-2.5 py-0.5 rounded font-mono">
                SPECIAL DISCOUNT
              </span>
              <h3 className="text-xl font-black font-retro-heading text-black">Kigali Leather Craft Sandals</h3>
              <p className="text-xs text-gray-600 font-medium">Handcrafted genuine leather footwear made by master cobblers.</p>
            </div>
            <Link href="/products" className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-wider text-black">
              <span>SHOP FASHION</span>
              <ChevronRight size={14} />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
