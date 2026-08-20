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

        {/* Categories Grid (Exact circular icons matching screenshots) */}
        <div className="flex-1 grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-6 text-center">
          {CATEGORIES.map((cat) => {
            const IconComponent = cat.icon;
            const isSelected = selectedCategory === cat.id;

            return (
              <button
                key={cat.id}
                onClick={() => onSelectCategory?.(isSelected ? '' : cat.id)}
                className="flex flex-col items-center gap-3 group cursor-pointer"
              >
                {/* Large Soft Gray Circular Badge (bg-[#F2F2F2] matching screenshots) */}
                <div
                  className={`w-20 h-20 sm:w-24 sm:h-24 rounded-full flex items-center justify-center transition duration-300 ${
                    isSelected
                      ? 'bg-black text-white shadow-md scale-105'
                      : 'bg-[#F2F2F2] text-[#111111] hover:bg-black hover:text-white hover:scale-105'
                  }`}
                >
                  <IconComponent size={28} strokeWidth={1.5} />
                </div>

                {/* Category Label directly under circle */}
                <span className={`text-xs font-bold transition ${isSelected ? 'text-black underline' : 'text-black group-hover:text-black'}`}>
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
