'use client';
import React, { useEffect, useState } from 'react';
import { HeroArea } from '@/components/home/HeroArea';
import { CategoriesSection } from '@/components/home/CategoriesSection';
import { FeatureHighlights } from '@/components/home/FeatureHighlights';
import { ProductGrid } from '@/components/home/ProductGrid';
import { dbService } from '@/services/db';
import { Product } from '@/types';

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      const data = await dbService.getProducts();
      setProducts(data);
      setLoading(false);
    }
    loadData();
  }, []);

  return (
    <main className="min-h-screen bg-[#F8FAFC]">
      {/* 1. Retro Hero Area */}
      <HeroArea />

      {/* 2. Feature Trust Highlights */}
      <FeatureHighlights />

      {/* 3. Categories Circular Icon Grid */}
      <CategoriesSection
        selectedCategory={selectedCategory}
        onSelectCategory={(cat) => setSelectedCategory(cat)}
      />

      {/* 4. Filterable Products Grid */}
      <ProductGrid
        products={products}
        selectedCategory={selectedCategory}
        onSelectCategory={(cat) => setSelectedCategory(cat)}
        loading={loading}
      />
    </main>
  );
}
