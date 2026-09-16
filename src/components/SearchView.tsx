import React, { useState, useEffect } from 'react';
import { Search, ArrowLeft, ShoppingCart, Box, Sparkles, AlertCircle } from 'lucide-react';
import { motion } from 'motion/react';
import { generateGradient } from '../utils';

interface SearchViewProps {
  products: any[];
  onBack: () => void;
  onProductClick: (id: string) => void;
}

export const SearchView: React.FC<SearchViewProps> = ({ products, onBack, onProductClick }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 250);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(debouncedQuery.toLowerCase()) || 
    (p.description && p.description.toLowerCase().includes(debouncedQuery.toLowerCase())) ||
    (p.details && p.details.toLowerCase().includes(debouncedQuery.toLowerCase()))
  );

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="max-w-5xl mx-auto w-full p-4 sm:p-6 lg:p-8 font-sans text-white min-h-[85vh]"
    >
      {/* Search Header Bar */}
      <div className="flex items-center gap-3 sm:gap-4 mb-8">
        <button 
          onClick={onBack}
          className="w-12 h-12 bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.1] rounded-2xl flex items-center justify-center text-white/60 hover:text-white transition-all active:scale-95 cursor-pointer shrink-0"
        >
          <ArrowLeft className="w-5 h-5 text-blue-400" />
        </button>
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search className="w-5 h-5 text-blue-400" />
          </div>
          <input 
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="พิมพ์ชื่อสินค้า หรือคีย์เวิร์ดที่ต้องการค้นหา..."
            className="w-full bg-[#0c0c12]/85 backdrop-blur-2xl border border-white/[0.1] py-3.5 pl-12 pr-4 outline-none focus:border-blue-500 rounded-2xl transition-all text-white placeholder:text-white/30 text-sm sm:text-base font-medium shadow-xl"
            autoFocus
          />
        </div>
      </div>

      {/* Results Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg sm:text-xl font-black text-white flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-blue-400" />
          <span>ผลการค้นหา {searchQuery && <span className="text-white/40 font-normal">สำหรับ "{searchQuery}"</span>}</span>
        </h2>
        <span className="text-xs text-white/40 font-mono">
          พบ {filteredProducts.length} รายการ
        </span>
      </div>

      {/* Results Grid */}
      <div className="space-y-4">
        {searchQuery && filteredProducts.length === 0 ? (
          <div className="text-center py-20 bg-[#0c0c12]/85 border border-white/[0.08] rounded-[32px] p-8 glass-card glass-reflection">
            <Search className="w-12 h-12 text-white/20 mx-auto mb-4" />
            <h3 className="text-lg font-black text-white mb-1">ไม่พบสินค้าที่คุณค้นหา</h3>
            <p className="text-xs sm:text-sm text-white/40">ลองเปลี่ยนคำค้นหา หรือค้นหาด้วยชื่อหมวดหมู่อื่นๆ</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {filteredProducts.map(product => (
              <motion.div 
                key={product.id}
                whileHover={{ y: -5 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => onProductClick(product.id)}
                className="bg-[#0c0c12]/85 backdrop-blur-2xl border border-white/[0.08] hover:border-blue-500/30 p-4 sm:p-5 cursor-pointer group relative overflow-hidden flex flex-col justify-between rounded-[26px] transition-all shadow-xl glass-card glass-reflection"
              >
                {/* Top Edge */}
                <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent pointer-events-none" />

                <div>
                  {product.imageUrl && product.imageUrl.trim() !== "" ? (
                    <div className="w-full aspect-video overflow-hidden mb-4 relative rounded-2xl bg-black/40 border border-white/[0.08]">
                      <img 
                        loading="lazy" 
                        src={product.imageUrl} 
                        alt={product.name} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                    </div>
                  ) : (
                    <div 
                      className="w-full aspect-video overflow-hidden mb-4 relative rounded-2xl flex items-center justify-center border border-white/[0.08] opacity-80 group-hover:opacity-100 transition-all"
                      style={{ background: generateGradient(product.name || product.id) }}
                    >
                      <span className="text-4xl font-black text-white mix-blend-overlay opacity-60">
                        {(product.name || "P")[0].toUpperCase()}
                      </span>
                    </div>
                  )}

                  <div className="flex items-center gap-2 mb-2">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                      product.stock > 0 
                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' 
                        : 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                    }`}>
                      {product.stock > 0 ? `สต๊อก: ${product.stock >= 999999 ? '∞' : product.stock}` : 'หมดชั่วคราว'}
                    </span>
                  </div>

                  <h3 className="font-bold text-white text-base group-hover:text-blue-400 transition-colors line-clamp-1 mb-1">
                    {product.name}
                  </h3>
                  <p className="text-xs text-white/50 line-clamp-2 mb-4">
                    {product.description || 'ไม่มีรายละเอียดสินค้า'}
                  </p>
                </div>

                <div className="pt-3 border-t border-white/[0.06] flex items-center justify-between">
                  <span className="text-lg font-black font-mono text-white">
                    ฿{(product.price || 0).toLocaleString()}
                  </span>
                  <div className="p-2 rounded-xl bg-blue-600/10 text-blue-400 border border-blue-500/20 group-hover:bg-blue-600 group-hover:text-white transition-all">
                    <ShoppingCart className="w-4 h-4" />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
};
