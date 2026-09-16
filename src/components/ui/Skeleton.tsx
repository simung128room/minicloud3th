import React from 'react';

interface SkeletonProps {
  className?: string;
  rounded?: string;
}

export const Skeleton: React.FC<SkeletonProps> = ({ 
  className = '',
  rounded = 'rounded-xl'
}) => {
  return (
    <div 
      className={`skeleton-shimmer bg-white/[0.04] border border-white/[0.04] ${rounded} ${className}`}
      aria-hidden="true"
    />
  );
};

export const ProductCardSkeleton: React.FC<{ count?: number }> = ({ count = 1 }) => {
  return (
    <>
      {Array.from({ length: count }).map((_, idx) => (
        <div
          key={`product-skeleton-${idx}`}
          className="glass-card rounded-[26px] overflow-hidden p-0 flex flex-col border border-white/[0.08]"
        >
          {/* Image Skeleton */}
          <div className="relative aspect-square w-full skeleton-shimmer bg-white/[0.04]">
            <div className="absolute top-3.5 left-3.5 w-14 h-5 rounded-full skeleton-shimmer bg-white/[0.08]" />
          </div>

          {/* Content Area */}
          <div className="p-4 sm:p-5 flex flex-col flex-1 space-y-3">
            <Skeleton className="h-5 w-3/4 rounded-lg" />
            <Skeleton className="h-3 w-1/3 rounded-md" />

            {/* Price & Badge */}
            <div className="flex items-center justify-between pt-1">
              <Skeleton className="h-6 w-20 rounded-lg" />
              <Skeleton className="h-5 w-24 rounded-full" />
            </div>

            {/* Button */}
            <Skeleton className="h-11 w-full rounded-full mt-2" />

            {/* Stock */}
            <Skeleton className="h-7 w-full rounded-full mt-1" />
          </div>
        </div>
      ))}
    </>
  );
};

export const CategoryCardSkeleton: React.FC<{ count?: number }> = ({ count = 1 }) => {
  return (
    <>
      {Array.from({ length: count }).map((_, idx) => (
        <div
          key={`cat-skeleton-${idx}`}
          className="glass-card rounded-[26px] overflow-hidden p-0 flex flex-col border border-white/[0.08]"
        >
          {/* Banner Skeleton */}
          <div className="relative aspect-[21/6] w-full skeleton-shimmer bg-white/[0.04]" />

          {/* Content */}
          <div className="p-4 sm:p-5 flex flex-col justify-between flex-1">
            <Skeleton className="h-5 w-1/2 rounded-lg mb-3" />
            <div className="flex items-center justify-between pt-3 border-t border-white/[0.05]">
              <Skeleton className="h-4 w-28 rounded-md" />
              <Skeleton className="h-6 w-16 rounded-full" />
            </div>
          </div>
        </div>
      ))}
    </>
  );
};

export const StatCardSkeleton: React.FC<{ count?: number }> = ({ count = 4 }) => {
  return (
    <>
      {Array.from({ length: count }).map((_, idx) => (
        <div
          key={`stat-skeleton-${idx}`}
          className="glass-card rounded-[24px] p-5 sm:p-6 flex flex-col justify-between space-y-3 border border-white/[0.08]"
        >
          <div className="flex items-center justify-between">
            <Skeleton className="h-3 w-20 rounded-md" />
            <Skeleton className="w-8 h-8 rounded-full" />
          </div>
          <Skeleton className="h-8 w-28 rounded-lg my-1" />
          <Skeleton className="h-3 w-16 rounded-md" />
        </div>
      ))}
    </>
  );
};

export const TableRowSkeleton: React.FC<{ count?: number; cols?: number }> = ({ 
  count = 5,
  cols = 4 
}) => {
  return (
    <>
      {Array.from({ length: count }).map((_, rIdx) => (
        <tr key={`table-row-skeleton-${rIdx}`} className="border-b border-white/[0.06]">
          {Array.from({ length: cols }).map((_, cIdx) => (
            <td key={`cell-${rIdx}-${cIdx}`} className="p-4">
              <Skeleton className="h-4 w-full rounded-md" />
            </td>
          ))}
        </tr>
      ))}
    </>
  );
};

