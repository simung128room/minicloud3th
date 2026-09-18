import React from "react";
import { Package } from "lucide-react";
import { motion } from "motion/react";

interface CategoryCardProps {
  title: string;
  label: string;
  itemCountDesc?: string;
  priceRangeStr?: string;
  bgImage?: string;
  index?: number;
  onClick: () => void;
  accentColor?: string;
  glowColor?: string;
  gradientFrom?: string;
}

export const CategoryCard: React.FC<CategoryCardProps> = ({
  title,
  label,
  itemCountDesc,
  priceRangeStr,
  bgImage,
  index = 0,
  onClick,
  accentColor = "#2563EB",
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-10px" }}
      transition={{ duration: 0.4, delay: Math.min(index * 0.05, 0.3), ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className="relative group overflow-hidden rounded-2xl sm:rounded-[28px] border border-white/[0.08] bg-[#0c0c12]/85 backdrop-blur-xl hover:border-white/25 transition-all duration-300 flex flex-col cursor-pointer shadow-xl shadow-black/50 glass-card glass-reflection"
    >
      {/* Prismatic Top Edge Highlight */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent z-20 pointer-events-none" />

      {/* Banner Area */}
      <div className="relative aspect-[21/8] sm:aspect-[21/6] w-full overflow-hidden shrink-0 bg-[#121218]">
        {bgImage ? (
          <img
            src={bgImage}
            alt={title}
            className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700 opacity-65 group-hover:opacity-90"
            referrerPolicy="no-referrer"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-zinc-900 to-black flex items-center justify-center">
            <Package className="w-7 h-7 text-white/10" />
          </div>
        )}
        
        {/* Top-to-Bottom, Left-to-Right Gradients */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0c0c12] via-transparent to-transparent opacity-95" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0c0c12]/40 to-transparent" />
      </div>

      {/* Content Area */}
      <div className="p-3.5 sm:p-5 flex flex-col justify-between flex-1 bg-[#0c0c12]/60">
        <h3 className="text-sm sm:text-base md:text-lg font-black text-white tracking-wide uppercase truncate mb-1 group-hover:text-blue-400 transition-colors">
          {title}
        </h3>
        
        <div className="flex items-center justify-between gap-2 text-[10px] sm:text-xs font-semibold mt-2.5 sm:mt-3 pt-2.5 sm:pt-3 border-t border-white/[0.06]">
          {/* Item Count */}
          <span className="text-white/50 flex items-center gap-1.5 uppercase font-bold tracking-wider truncate">
            <Package className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-white/40 shrink-0" />
            <span className="truncate">มีสินค้า <span className="text-emerald-400 font-black">{itemCountDesc?.replace(/[^0-9]/g, '') || '0'}</span> ชิ้น</span>
          </span>
          
          {/* Price Range */}
          {priceRangeStr && (
            <span className="text-white font-mono font-black tracking-wider text-[10px] sm:text-xs bg-white/[0.06] px-2.5 py-1 rounded-full border border-white/[0.1] shadow-sm group-hover:border-blue-500/30 group-hover:bg-blue-500/10 transition-all shrink-0">
              {priceRangeStr.replace("฿", "")}
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
};
