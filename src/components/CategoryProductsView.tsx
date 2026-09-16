import React, { useState } from "react";
import { motion } from "motion/react";
import { Package, ArrowLeft, Star, ShoppingCart, Sparkles } from "lucide-react";
import { Product, Category } from "../types";
import { generateGradient } from "../utils";

interface CategoryProductsViewProps {
  category: string;
  categories: Category[];
  products: Product[];
  onBack: () => void;
  onProductClick: (id: string) => void;
}

export const CategoryProductsView: React.FC<CategoryProductsViewProps> = ({
  category,
  categories = [],
  products = [],
  onBack,
  onProductClick,
}) => {
  const categoryInfo = categories.find(
    (c) => c.name === category || c.title === category || c.id === category,
  );
  const [renderLimit, setRenderLimit] = useState(20);
  
  const filteredProducts =
    category === "all"
      ? products
      : products.filter(
          (p) =>
            p.category === category ||
            p.category === categoryInfo?.title ||
            p.category === categoryInfo?.name ||
            p.category === categoryInfo?.id,
        );
        
  const visibleProducts = filteredProducts.slice(0, renderLimit);

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 font-sans text-white min-h-[85vh]">
      <motion.div 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4"
      >
        <div className="flex items-center gap-4">
          <button
            onClick={onBack}
            className="p-3 bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] rounded-2xl transition-all group shrink-0 active:scale-95 cursor-pointer"
          >
            <ArrowLeft className="w-5 h-5 text-white/60 group-hover:text-white" />
          </button>
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold uppercase tracking-wider mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Category Filter</span>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight flex items-center gap-3">
              {category === "all" ? "สินค้าทั้งหมด" : (categoryInfo?.title || category)}
            </h1>
            <p className="text-xs sm:text-sm font-medium text-white/50 mt-0.5">
              {categoryInfo?.subtitle || `พบสินค้าทั้งหมด ${filteredProducts.length} รายการ`}
            </p>
          </div>
        </div>
      </motion.div>

      {!filteredProducts || filteredProducts.length === 0 ? (
        <div className="bg-[#0c0c12]/85 border border-white/[0.08] rounded-[32px] p-16 text-center glass-card glass-reflection">
          <div className="mb-4 flex justify-center">
            <Package className="w-14 h-14 text-white/20" />
          </div>
          <h3 className="text-lg font-black text-white">
            ยังไม่มีสินค้าในหมวดหมู่นี้
          </h3>
          <p className="text-white/40 text-xs sm:text-sm mt-1 font-medium">
            โปรดรอการอัปเดตสต๊อกสินค้าจากทางร้าน
          </p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {visibleProducts.map((product, i) => {
              const discount = product.originalPrice && product.price < product.originalPrice
                ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
                : null;
              const isHot = product.price > 100 || (discount !== null && discount >= 20) || product.stock > 0;
              
              return (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35, delay: Math.min(i, 10) * 0.04, ease: [0.16, 1, 0.3, 1] }}
                  whileHover={{ y: -5, transition: { duration: 0.2 } }}
                  className="group relative bg-[#0c0c12]/85 backdrop-blur-xl border border-white/[0.08] rounded-[24px] overflow-hidden hover:border-white/25 transition-all duration-300 flex flex-col shadow-xl shadow-black/40 glass-card glass-reflection"
                >
                  {/* Prismatic Top Edge Highlight */}
                  <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent z-20 pointer-events-none" />

                  {/* Image area with corner ribbon */}
                  <div className="relative aspect-square w-full bg-[#121218] overflow-hidden shrink-0">
                    {product.imageUrl && product.imageUrl.trim() !== "" ? (
                      <img 
                        loading="lazy"
                        src={product.imageUrl}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                        }}
                        referrerPolicy="no-referrer"
                      />
                    ) : null}
                    <div 
                      className="w-full h-full flex flex-col items-center justify-center opacity-85"
                      style={{ 
                        display: product.imageUrl && product.imageUrl.trim() !== "" ? 'none' : 'flex',
                        background: generateGradient(product.name || product.id)
                      }}
                    >
                      <span className="text-4xl font-black text-white mix-blend-overlay opacity-65">
                        {(product.name || "P")[0].toUpperCase()}
                      </span>
                      <span className="text-[10px] font-bold text-white/50 uppercase tracking-widest mt-1">{product.category || "DEV"}</span>
                    </div>

                    {isHot && (
                      <div className="absolute top-0 right-0 overflow-hidden w-20 h-20 pointer-events-none z-10">
                        <div className="absolute top-3 -right-6 bg-gradient-to-r from-red-600 to-orange-500 text-white text-[9px] font-black uppercase py-1 w-24 text-center transform rotate-45 shadow-md border-b border-white/10">
                          Best Seller
                        </div>
                      </div>
                    )}

                    <div className="absolute inset-0 bg-gradient-to-t from-[#0c0c12] via-transparent to-transparent opacity-85" />

                    {discount !== null && (
                      <div className="absolute top-3 left-3 bg-red-600 text-white text-[10px] font-black px-2.5 py-1 rounded-full shadow-lg z-10 border border-red-500/30">
                        -{discount}%
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-4 sm:p-5 flex flex-col flex-1 bg-[#0c0c12]/60">
                    <h3 className="text-sm font-black text-white leading-snug line-clamp-1 mb-3 group-hover:text-blue-400 transition-colors">
                      {product.name}
                    </h3>

                    <span className="text-[10px] font-bold text-white/35 uppercase tracking-wider block mb-1">ราคาสินค้า</span>

                    <div className="flex flex-wrap items-center gap-2 mb-4">
                      {product.originalPrice && product.price < product.originalPrice ? (
                        <span className="text-xs text-red-500/80 line-through font-mono font-bold">฿{product.originalPrice.toLocaleString()}</span>
                      ) : null}
                      
                      <span className="text-base font-black text-amber-400 tracking-tight font-mono">
                        ฿{(product.price || 0).toLocaleString()}
                      </span>

                      {product.stock > 0 ? (
                        <span className="ml-auto bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-black px-2.5 py-1 rounded-full leading-none select-none">
                          พร้อมจำหน่าย
                        </span>
                      ) : (
                        <span className="ml-auto bg-red-500/10 text-red-400 border border-red-500/20 text-[10px] font-black px-2.5 py-1 rounded-full leading-none select-none">
                          สินค้าหมด
                        </span>
                      )}
                    </div>

                    {product.stock <= 0 ? (
                      <button className="w-full bg-red-600/10 text-red-400 border border-red-500/20 py-2.5 rounded-full text-xs font-black flex items-center justify-center gap-1.5 cursor-default mt-auto">
                        <Package className="w-3.5 h-3.5" /> สินค้าหมด
                      </button>
                    ) : (
                      <button
                        onClick={() => onProductClick(product.id)}
                        className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white py-2.5 rounded-full text-xs font-black transition-all duration-200 mt-auto shadow-lg shadow-blue-600/25 hover:shadow-blue-500/40 active:scale-95 cursor-pointer"
                      >
                        <ShoppingCart className="w-3.5 h-3.5" />
                        สั่งซื้อสินค้า
                      </button>
                    )}

                    <div className="mt-3.5 py-1.5 rounded-full bg-white/[0.03] border border-white/[0.06] flex items-center justify-center gap-2 text-[10px] text-white/40 font-black uppercase tracking-widest leading-none">
                      <Package className="w-3.5 h-3.5 text-white/20 shrink-0" />
                      <span>คงเหลือ <span className="text-white/80 font-mono font-bold">{product.stock >= 999999 ? "ไม่จำกัด" : product.stock.toLocaleString()}</span> ชิ้น</span>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
          
          {visibleProducts.length < filteredProducts.length && (
            <div className="mt-12 flex justify-center">
              <button
                onClick={() => setRenderLimit(prev => prev + 20)}
                className="px-8 py-3 bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.1] text-white font-bold rounded-full transition-all active:scale-95 cursor-pointer text-xs uppercase tracking-wider"
              >
                โหลดเพิ่มเติม ({filteredProducts.length - visibleProducts.length} รายการ)
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};
