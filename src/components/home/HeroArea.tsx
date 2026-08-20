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
    link: '/products?category=coffee_tea',
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
    link: '/logistics',
    btnText: 'BOOK CARGO SLOT',
    bgColor: 'bg-[#F7F2EC]',
  },
];

export function HeroArea() {
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
        <div className={`lg:col-span-8 relative rounded-3xl ${slide.bgColor} text-[#111111] p-8 lg:p-12 flex flex-col justify-between min-h-[520px] h-full overflow-hidden group shadow-xs transition-colors duration-500`}>
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-6 items-center relative z-10 my-auto">
            {/* Left 7 cols: Content Container */}
            <div className="sm:col-span-7 space-y-5">
              {/* Pill Tags */}
              <div className="flex items-center gap-2">
                <span className="bg-white text-black text-xs font-bold px-3.5 py-1.5 rounded-full shadow-xs uppercase tracking-wider font-mono">
                  {slide.tag1}
                </span>
                <span className="bg-black text-white text-xs font-bold px-3.5 py-1.5 rounded-full shadow-xs uppercase tracking-wider font-mono">
                  {slide.tag2}
                </span>
              </div>

              {/* Main Headline */}
              <h1 className="text-3xl lg:text-5xl font-black tracking-tight text-[#111111] leading-tight font-retro-heading">
                {slide.title}
              </h1>

              <p className="text-gray-700 text-sm leading-relaxed font-medium">
                {slide.subtitle}
              </p>

              {/* START SHOPPING Link */}
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
                className="max-h-[360px] w-full object-contain drop-shadow-xl group-hover:scale-105 transition duration-700 animate-fadeIn"
              />
            </div>
          </div>

          {/* Interactive Slider Carousel Dots */}
          <div className="relative z-10 pt-6 flex items-center gap-2.5">
            {heroSlides.map((s, idx) => (
              <button
                key={s.id}
                onClick={() => setActiveSlide(idx)}
                className={`transition-all cursor-pointer ${
                  activeSlide === idx
                    ? 'w-8 h-3 rounded-full bg-[#111111]'
                    : 'w-3 h-3 rounded-full bg-gray-400 hover:bg-gray-600'
                }`}
                aria-label={`Slide ${idx + 1}`}
              />
            ))}
          </div>
        </div>

        {/* Side Banners (Right 4/12 Stacked with exact same height matching left column) */}
        <div className="lg:col-span-4 flex flex-col justify-between gap-6 h-full">
          {/* Side Banner 1 (Top: Cargo Image - Soft Beige bg-[#F7F2EC]) */}
          <div className="relative rounded-3xl bg-[#F7F2EC] text-[#111111] p-6 flex items-center justify-between flex-1 h-full min-h-[240px] overflow-hidden group shadow-xs">
            <div className="space-y-3 max-w-[58%] z-10">
              <h3 className="font-bold text-lg lg:text-xl text-[#111111] leading-tight font-retro-heading">
                Luggage Cargo Air Freight
              </h3>
              <p className="text-xs text-gray-600 font-medium">Verified Courier Bags KGL ✈ YYZ</p>
              <div className="pt-1">
                <Link href="/logistics" className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-wider text-[#111111] hover:text-gray-600">
                  <span>BOOK FREIGHT</span>
                  <div className="w-6 h-6 rounded-full bg-[#111111] text-white flex items-center justify-center">
                    <ChevronRight size={14} />
                  </div>
                </Link>
              </div>
            </div>

            <div className="w-32 lg:w-36 h-32 lg:h-36 shrink-0 relative overflow-hidden rounded-2xl flex items-center justify-center p-2">
              <img
                src="/cargo.png"
                alt="Air Freight Cargo Luggage"
                className="w-full h-full object-contain drop-shadow-md group-hover:scale-110 transition duration-500"
              />
            </div>
          </div>

          {/* Side Banner 2 (Bottom: Craft Image - Soft Lavender bg-[#ECEEFA]) */}
          <div className="relative rounded-3xl bg-[#ECEEFA] text-[#111111] p-6 flex items-center justify-between flex-1 h-full min-h-[240px] overflow-hidden group shadow-xs">
            <div className="space-y-3 max-w-[58%] z-10">
              <h3 className="font-bold text-lg lg:text-xl text-[#111111] leading-tight font-retro-heading">
                Authentic Agaseke Crafts
              </h3>
              <p className="text-xs text-gray-600 font-medium">Handwoven Heritage Decor</p>
              <div className="pt-1">
                <Link href="/products?category=crafts" className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-wider text-[#111111] hover:text-gray-600">
                  <span>EXPLORE CRAFTS</span>
                  <div className="w-6 h-6 rounded-full bg-[#111111] text-white flex items-center justify-center">
                    <ChevronRight size={14} />
                  </div>
                </Link>
              </div>
            </div>

            <div className="w-32 lg:w-36 h-32 lg:h-36 shrink-0 relative overflow-hidden rounded-2xl flex items-center justify-center p-2">
              <img
                src="/craft.png"
                alt="Agaseke Rwandan Crafts"
                className="w-full h-full object-contain drop-shadow-md group-hover:scale-110 transition duration-500"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
