import React from "react";

interface AppLoaderProps {
  progress?: number;
  statusMessage?: string;
}

/**
 * Standard Minimal Circular Spinner (Normal Loading)
 */
export const LoadingSpinner: React.FC<{
  size?: "sm" | "md" | "lg";
  className?: string;
}> = ({ size = "md", className = "" }) => {
  const sizeClasses = {
    sm: "w-4 h-4 border-2",
    md: "w-6 h-6 border-2",
    lg: "w-8 h-8 border-[2.5px]",
  };
  return (
    <div
      className={`rounded-full border-white/20 border-t-white animate-spin shrink-0 ${sizeClasses[size]} ${className}`}
      role="status"
      aria-label="กำลังโหลด"
    />
  );
};

/**
 * Single Product Card Skeleton
 */
export const ProductCardSkeleton: React.FC = () => {
  return (
    <div className="rounded-[24px] bg-[#0c0d12]/80 border border-white/[0.07] p-3.5 sm:p-4 flex flex-col justify-between overflow-hidden shadow-lg">
      {/* Image skeleton */}
      <div className="w-full aspect-[4/3] rounded-2xl bg-white/[0.04] skeleton-shimmer mb-3.5" />

      {/* Category tag */}
      <div className="h-3 w-16 rounded-full bg-white/[0.06] skeleton-shimmer mb-2" />

      {/* Product Title lines */}
      <div className="h-4.5 w-4/5 rounded-lg bg-white/[0.08] skeleton-shimmer mb-1.5" />
      <div className="h-3.5 w-1/2 rounded-md bg-white/[0.04] skeleton-shimmer mb-4" />

      {/* Price & Badge row */}
      <div className="flex items-center justify-between mb-3.5 pt-1 border-t border-white/[0.04]">
        <div className="h-5 w-20 rounded-md bg-white/[0.08] skeleton-shimmer" />
        <div className="h-4 w-16 rounded-full bg-white/[0.05] skeleton-shimmer" />
      </div>

      {/* Order Button skeleton */}
      <div className="h-10 w-full rounded-full bg-white/[0.07] skeleton-shimmer mt-auto mb-2" />

      {/* Stock row skeleton */}
      <div className="h-6 w-full rounded-full bg-white/[0.03] skeleton-shimmer" />
    </div>
  );
};

/**
 * Full Page Skeleton Loader (Replaces the old blue square / sci-fi loader page)
 */
export const AppLoader: React.FC<AppLoaderProps> = () => {
  return (
    <div className="min-h-screen w-full bg-[#070707] text-white selection:bg-white/10 flex flex-col select-none">
      {/* Top Navigation Bar Skeleton */}
      <header className="w-full border-b border-white/[0.06] bg-[#09090b]/80 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          {/* Logo brand skeleton */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-2xl bg-white/[0.06] skeleton-shimmer" />
            <div className="h-5 w-24 rounded-lg bg-white/[0.08] skeleton-shimmer" />
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center gap-2">
            <div className="h-8 w-20 rounded-full bg-white/[0.05] skeleton-shimmer" />
            <div className="h-8 w-24 rounded-full bg-white/[0.03] skeleton-shimmer" />
            <div className="h-8 w-20 rounded-full bg-white/[0.03] skeleton-shimmer" />
          </div>

          {/* Right Action Controls */}
          <div className="flex items-center gap-2.5">
            <div className="hidden sm:block h-9 w-44 rounded-full bg-white/[0.04] border border-white/[0.06] skeleton-shimmer" />
            <div className="h-9 w-24 rounded-full bg-white/[0.07] skeleton-shimmer" />
          </div>
        </div>
      </header>

      {/* Main Content Area Skeleton */}
      <main className="flex-1 w-full max-w-4xl mx-auto px-4 md:px-6 pb-24 pt-6 flex flex-col">
        {/* Subtle Top Announcement Bar Skeleton */}
        <div className="w-full h-9 rounded-full bg-white/[0.03] border border-white/[0.05] skeleton-shimmer mb-6 flex items-center px-4" />

        {/* Hero Banner Skeleton */}
        <div className="w-full h-44 sm:h-64 rounded-[28px] bg-[#0c0d12]/90 border border-white/[0.07] p-6 sm:p-8 flex flex-col justify-end gap-3 mb-6 relative overflow-hidden skeleton-shimmer shadow-xl">
          <div className="h-4 w-28 rounded-full bg-white/[0.08]" />
          <div className="h-7 sm:h-9 w-64 sm:w-80 rounded-xl bg-white/[0.1]" />
          <div className="h-4 w-96 max-w-full rounded-md bg-white/[0.05]" />
        </div>

        {/* 3 Stats Cards Skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mb-6">
          {[1, 2, 3].map((item) => (
            <div
              key={item}
              className="h-24 rounded-[22px] bg-[#0c0d12]/70 border border-white/[0.06] p-4 flex flex-col justify-between skeleton-shimmer"
            >
              <div className="flex items-center justify-between">
                <div className="h-3 w-20 rounded bg-white/[0.06]" />
                <div className="w-6 h-6 rounded-lg bg-white/[0.05]" />
              </div>
              <div className="h-6 w-24 rounded-lg bg-white/[0.09]" />
            </div>
          ))}
        </div>

        {/* 4 Shortcut Action Buttons Skeleton */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
          {[1, 2, 3, 4].map((item) => (
            <div
              key={item}
              className="h-16 rounded-[20px] bg-[#0c0d12]/60 border border-white/[0.05] p-3 flex items-center gap-3 skeleton-shimmer"
            >
              <div className="w-10 h-10 rounded-xl bg-white/[0.06] shrink-0" />
              <div className="flex flex-col gap-1.5 flex-1 min-w-0">
                <div className="h-3.5 w-16 rounded bg-white/[0.08]" />
                <div className="h-2.5 w-12 rounded bg-white/[0.04]" />
              </div>
            </div>
          ))}
        </div>

        {/* Recommended Categories Header & Cards Skeleton */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="h-5 w-32 rounded-lg bg-white/[0.08] skeleton-shimmer" />
            <div className="h-4 w-16 rounded-md bg-white/[0.04] skeleton-shimmer" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[1, 2].map((item) => (
              <div
                key={item}
                className="h-20 rounded-[22px] bg-[#0c0d12]/70 border border-white/[0.06] p-4 flex items-center gap-4 skeleton-shimmer"
              >
                <div className="w-12 h-12 rounded-xl bg-white/[0.06] shrink-0" />
                <div className="flex flex-col gap-2 flex-1">
                  <div className="h-4 w-28 rounded bg-white/[0.08]" />
                  <div className="h-3 w-16 rounded bg-white/[0.04]" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Products Section Header Skeleton */}
        <div className="flex items-center justify-between mb-4">
          <div className="h-5 w-36 rounded-lg bg-white/[0.08] skeleton-shimmer" />
          <div className="h-4 w-20 rounded-md bg-white/[0.04] skeleton-shimmer" />
        </div>

        {/* Product Grid Skeletons */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3.5 sm:gap-4">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((item) => (
            <ProductCardSkeleton key={item} />
          ))}
        </div>
      </main>
    </div>
  );
};

export default AppLoader;
