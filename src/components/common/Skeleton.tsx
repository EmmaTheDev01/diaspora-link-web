import React from 'react';

export function Skeleton({ className = '' }: { className?: string }) {
  return <div className={`animate-pulse bg-gray-200 rounded-xl ${className}`} />;
}

export function ProductCardSkeleton() {
  return (
    <div className="space-y-3 animate-pulse">
      <div className="h-80 bg-gray-200 rounded-2xl w-full" />
      <div className="h-4 bg-gray-200 rounded-md w-3/4" />
      <div className="h-4 bg-gray-200 rounded-md w-1/3" />
    </div>
  );
}

export function StatCardSkeleton() {
  return (
    <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs space-y-4 animate-pulse">
      <div className="flex justify-between items-center">
        <div className="h-3 bg-gray-200 rounded w-1/2" />
        <div className="w-6 h-6 bg-gray-200 rounded-full" />
      </div>
      <div className="h-8 bg-gray-200 rounded w-3/4" />
      <div className="h-3 bg-gray-200 rounded w-1/3" />
    </div>
  );
}

export function TableRowSkeleton({ cols = 6 }: { cols?: number }) {
  return (
    <tr className="animate-pulse border-b border-gray-100">
      {Array.from({ length: cols }).map((_, i) => (
        <td key={i} className="p-4">
          <div className="h-4 bg-gray-200 rounded w-full" />
        </td>
      ))}
    </tr>
  );
}

export function ProductDetailSkeleton() {
  return (
    <main className="min-h-screen bg-white text-[#111111] font-sans pb-20">
      <div className="bg-[#F8F8F8] border-b border-gray-100 py-12 px-4 text-center space-y-3">
        <div className="h-8 bg-gray-200 rounded-xl w-64 mx-auto animate-pulse" />
        <div className="h-4 bg-gray-200 rounded-md w-48 mx-auto animate-pulse" />
      </div>
      <div className="max-w-7xl mx-auto px-4 lg:px-8 pt-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          <div className="lg:col-span-7 flex flex-col sm:flex-row gap-4">
            <div className="flex sm:flex-col gap-3 shrink-0 order-2 sm:order-1">
              <div className="w-20 h-20 bg-gray-200 rounded-xl animate-pulse" />
              <div className="w-20 h-20 bg-gray-200 rounded-xl animate-pulse" />
              <div className="w-20 h-20 bg-gray-200 rounded-xl animate-pulse" />
            </div>
            <div className="flex-1 h-[480px] sm:h-[540px] bg-gray-200 rounded-2xl animate-pulse order-1 sm:order-2" />
          </div>
          <div className="lg:col-span-5 space-y-6">
            <div className="h-10 bg-gray-200 rounded-xl w-3/4 animate-pulse" />
            <div className="h-4 bg-gray-200 rounded w-1/2 animate-pulse" />
            <div className="h-8 bg-gray-200 rounded w-1/3 animate-pulse" />
            <div className="h-20 bg-gray-200 rounded-xl w-full animate-pulse" />
            <div className="h-12 bg-gray-200 rounded-xl w-full animate-pulse" />
          </div>
        </div>
      </div>
    </main>
  );
}
