'use client';
import React from 'react';
import { Coffee, Shirt, Palette, Gift, Home, BookOpen, Briefcase, ChevronLeft, ChevronRight } from 'lucide-react';
import { ProductCategory } from '../../types';

interface CategoryItem {
  id: ProductCategory;
  label: string;
  icon: any;
}

const CATEGORIES: CategoryItem[] = [
  { id: 'coffee_tea', label: 'Coffee & Tea', icon: Coffee },
  { id: 'crafts', label: 'Art & Crafts', icon: Palette },
  { id: 'fashion', label: 'Fashion & Kitenge', icon: Shirt },
  { id: 'decor', label: 'Home & Decor', icon: Home },
  { id: 'gifts', label: 'Diaspora Gifts', icon: Gift },
  { id: 'books', label: 'Books & Culture', icon: BookOpen },
  { id: 'business', label: 'Business Cargo', icon: Briefcase },
];

export function CategoriesSection({ selectedCategory, onSelectCategory }: { selectedCategory?: string; onSelectCategory?: (cat: string) => void }) {
  return (
    <section className="py-10 px-4 lg:px-8 max-w-7xl mx-auto font-sans relative">
      <div className="flex items-center justify-between gap-4">
        {/* Left Slider Arrow (Matching screenshot 1 & 4) */}
        <button className="hidden sm:flex text-gray-300 hover:text-black transition p-1" title="Previous">
          <ChevronLeft size={24} />
        </button>

        {/* Categories Horizontal Scrollable Container (Mobile) / Grid (Desktop) */}
        <div className="flex-1 flex overflow-x-auto no-scrollbar sm:grid sm:grid-cols-4 lg:grid-cols-7 gap-4 sm:gap-6 text-center py-2 px-1 snap-x snap-mandatory">
          {CATEGORIES.map((cat) => {
            const IconComponent = cat.icon;
            const isSelected = selectedCategory === cat.id;

            return (
              <button
                key={cat.id}
                onClick={() => onSelectCategory?.(isSelected ? '' : cat.id)}
                className="flex flex-col items-center gap-2 sm:gap-3 group cursor-pointer shrink-0 snap-center min-w-[85px] sm:min-w-0"
              >
                {/* Large Soft Gray Circular Badge */}
                <div
                  className={`w-16 h-16 sm:w-24 sm:h-24 rounded-full flex items-center justify-center transition duration-300 ${
                    isSelected
                      ? 'bg-black text-white shadow-md scale-105'
                      : 'bg-[#F2F2F2] text-[#111111] hover:bg-black hover:text-white hover:scale-105'
                  }`}
                >
                  <IconComponent size={24} strokeWidth={1.5} className="sm:w-7 sm:h-7" />
                </div>

                {/* Category Label directly under circle */}
                <span className={`text-[11px] sm:text-xs font-bold transition whitespace-nowrap ${isSelected ? 'text-black underline' : 'text-black group-hover:text-black'}`}>
                  {cat.label}
                </span>
              </button>
            );
          })}
        </div>

        {/* Right Slider Arrow (Matching screenshot 1 & 4) */}
        <button className="hidden sm:flex text-gray-300 hover:text-black transition p-1" title="Next">
          <ChevronRight size={24} />
        </button>
      </div>
    </section>
  );
}
