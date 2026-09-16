import React from 'react';
import { motion } from 'motion/react';
import { Package, ArrowLeft, ChevronRight, ShoppingCart, Star, TrendingUp, Sparkles } from 'lucide-react';
import { Category, Product } from '../types';
import { CategoryCard } from './CategoryCard';

interface CategoriesViewProps {
  categories: Category[];
  products: Product[];
  siteSettings?: any;
  onBack: () => void;
  onSelectCategory: (categoryId: string) => void;
}

export const CategoriesView: React.FC<CategoriesViewProps> = ({ 
  categories = [], 
  products = [], 
  siteSettings, 
  onBack, 
  onSelectCategory 
}) => {
  const getCategoryPriceInfo = (cat: any) => {
    const catProducts = cat === 'all' ? products : products.filter(p => p.category === cat.id || p.category === cat.name || p.category === cat.title);
    if (catProducts.length === 0) return null;
    const prices = catProducts.map(p => p.price);
    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);
    
    if (minPrice === maxPrice) {
      return `฿${minPrice.toLocaleString()}`;
    }
    return `฿${minPrice.toLocaleString()} - ฿${maxPrice.toLocaleString()}`;
  };

  const getProductCountText = (cat: any) => {
    const catProducts = cat === 'all' ? products : products.filter(p => p.category === cat.id || p.category === cat.name || p.category === cat.title);
    return `${catProducts.length} สินค้า`;
  };

  const allPriceInfo = getCategoryPriceInfo('all');
  
  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 font-sans text-white min-h-[85vh]">
      <motion.div 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-4 mb-8"
      >
        <button 
          onClick={onBack}
          className="p-3 bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] rounded-2xl transition-all group active:scale-95 cursor-pointer"
        >
          <ArrowLeft className="w-5 h-5 text-white/60 group-hover:text-white" />
        </button>
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold uppercase tracking-wider mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Store Categories</span>
          </div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight">
            หมวดหมู่สินค้าทั้งหมด
          </h1>
          <p className="text-xs sm:text-sm font-medium text-white/50 mt-1">เลือกหมวดหมู่ที่ต้องการดูสินค้าในคลัง</p>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <CategoryCard
          title="ดูสินค้าทั้งหมด"
          label="ทุกหมวดหมู่"
          itemCountDesc={`ทั้งหมด ${getProductCountText('all')}`}
          priceRangeStr={allPriceInfo || undefined}
          bgImage={siteSettings?.banners?.[0] || "https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=2070&auto=format&fit=crop"}
          index={0}
          onClick={() => onSelectCategory('all')}
          accentColor="#3b82f6"
          glowColor="rgba(59,130,246,0.15)"
          gradientFrom="#0c0c12"
        />

        {categories.map((c, i) => (
          <CategoryCard
            key={c.id || c.name || `category-${i}`}
            title={c.title}
            label={c.subtitle || "หมวดหมู่"}
            itemCountDesc={`${getProductCountText(c)}`}
            priceRangeStr={getCategoryPriceInfo(c) || undefined}
            bgImage={c.bannerUrl || undefined}
            index={i + 1}
            onClick={() => onSelectCategory(c.id || c.name || c.title)}
            accentColor="#3b82f6"
            glowColor="rgba(59,130,246,0.15)"
            gradientFrom="#0c0c12"
          />
        ))}
      </div>
    </div>
  );
};
