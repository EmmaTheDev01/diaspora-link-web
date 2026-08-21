'use client';
import React, { useEffect, useState, Suspense } from 'react';
import { HeroAreaMarketplace } from '@/components/home/HeroAreaMarketplace';
import { FeatureHighlights } from '@/components/home/FeatureHighlights';
import { CategoriesSection } from '@/components/home/CategoriesSection';
import { ProductGrid } from '@/components/home/ProductGrid';
import { dbService } from '@/services/db';
import { Product } from '@/types';

function ShopCatalogContent() {
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
      {/* 1. Original Landing Page Hero Slider */}
      <HeroAreaMarketplace />

      {/* 2. Feature Trust Highlights */}
      <FeatureHighlights />

      {/* 3. Categories Circular Icon Grid */}
      <CategoriesSection
        selectedCategory={selectedCategory}
        onSelectCategory={(cat) => setSelectedCategory(cat)}
      />

      {/* 4. Product Grid with Trending Products, Corridor Filters, Escrow Banner, and Deals */}
      <ProductGrid
        products={products}
        selectedCategory={selectedCategory}
        onSelectCategory={(cat) => setSelectedCategory(cat)}
        loading={loading}
      />
    </main>
  );
}

export default function ShopCatalogPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-xs font-mono">Loading Marketplace...</div>}>
      <ShopCatalogContent />
    </Suspense>
  );
}
