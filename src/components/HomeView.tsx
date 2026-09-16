import React, { useState, useEffect, useMemo, useRef } from "react";
import axios from "axios";
import { Product, SiteStats, Category } from "../types";
import { ShoppingCart, Package, Users, ChevronRight, Zap, Star, Clock, LayoutGrid, History, MessageSquare, Coins, Megaphone } from "lucide-react";
import { motion } from "motion/react";

// ─── Types ───────────────────────────────────────────────────────────────────

interface HomeViewProps {
  products: Product[];
  categories: Category[];
  stats: SiteStats;
  user?: any;
  siteSettings?: any;
  purchaseHistory?: any[];
  setActiveView: (view: any) => void;
  onProductClick: (id: string) => void;
  onSelectCategory: (categoryId: string) => void;
}

// ─── Animated Number Generator ───────────────────────────────────────────────

interface AnimatedNumberProps {
  value: number;
  accent: string;
}

function AnimatedNumber({ value, accent }: AnimatedNumberProps) {
  const [displayValue, setDisplayValue] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const prevValueRef = useRef(0);

  useEffect(() => {
    let startTimestamp: number | null = null;
    const startValue = displayValue === 0 && prevValueRef.current === 0 ? 0 : prevValueRef.current;
    const endValue = value;
    const duration = 1500; // Duration in ms

    setIsAnimating(true);
    prevValueRef.current = value;

    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const elapsed = timestamp - startTimestamp;
      const progress = Math.min(elapsed / duration, 1);
      
      // Easing function: easeOutExpo for extremely smooth progression
      const easeProgress = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      const current = Math.floor(startValue + (endValue - startValue) * easeProgress);
      
      setDisplayValue(current);

      if (progress < 1) {
        window.requestAnimationFrame(step);
      } else {
        setDisplayValue(endValue);
        setIsAnimating(false);
      }
    };

    const animFrame = window.requestAnimationFrame(step);
    return () => window.cancelAnimationFrame(animFrame);
  }, [value]);

  return (
    <span 
      className={`inline-block font-mono tracking-tight transition-all duration-300 ${
        isAnimating ? "scale-105" : "scale-100"
      }`}
      style={{ 
        color: isAnimating ? "#ffffff" : "inherit",
        textShadow: isAnimating ? `0 0 16px ${accent}, 0 0 4px ${accent}` : "none",
        transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)"
      }}
    >
      {displayValue.toLocaleString()}
    </span>
  );
}

// ─── Stat Card ────────────────────────────────────────────────────────────────

function StatCard({
  label,
  value,
  unit,
  icon: Icon,
  accent,
  delay = 0,
}: {
  label: string;
  value: string | number;
  unit: string;
  icon: React.ElementType;
  accent: string;
  delay?: number;
}) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 25 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-15px" }}
      transition={{ duration: 0.45, delay, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className="relative bg-[#0c0c12]/85 backdrop-blur-xl border border-white/[0.08] rounded-[24px] p-5 sm:p-6 overflow-hidden group hover:border-white/20 transition-all duration-300 shadow-xl shadow-black/40 glass-card glass-reflection"
    >
      {/* Prismatic Top Edge */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent pointer-events-none" />

      {/* Subtle glow */}
      <div
        className="absolute -top-8 -right-8 w-28 h-28 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-2xl pointer-events-none"
        style={{ background: accent }}
      />
      <div className="flex items-center justify-between mb-3">
        <p className="text-xs text-white/50 font-semibold tracking-wide uppercase">{label}</p>
        <div className="w-8 h-8 rounded-full bg-white/[0.04] border border-white/[0.08] flex items-center justify-center shrink-0 group-hover:scale-105 group-hover:border-white/20 transition-all">
          <Icon className="w-4 h-4 text-white/70" />
        </div>
      </div>
      <p className="text-3xl sm:text-4xl font-black text-white tracking-tight leading-none mb-1">
        {typeof value === "number" ? (
          <AnimatedNumber value={value} accent={accent} />
        ) : (
          value
        )}
      </p>
      <p className="text-xs text-white/40 font-medium">{unit}</p>
    </motion.div>
  );
}

// ─── Shortcut Button ──────────────────────────────────────────────────────────

interface ShortcutBtnProps {
  label: string;
  subLabel: string;
  icon: React.ElementType;
  colorClass: string;
  glowColor: string;
  onClick: () => void;
  delay?: number;
}

function ShortcutBtn({
  label,
  subLabel,
  icon: Icon,
  colorClass,
  glowColor,
  onClick,
  delay = 0,
}: ShortcutBtnProps) {
  return (
    <motion.button
      initial={{ opacity: 0, scale: 0.96 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, margin: "-15px" }}
      transition={{ duration: 0.35, delay, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      whileTap={{ scale: 0.96 }}
      onClick={onClick}
      className="relative overflow-hidden text-left bg-[#0c0c12]/85 backdrop-blur-xl border border-white/[0.08] hover:border-white/20 rounded-[24px] p-4 sm:p-5 flex items-center gap-4 transition-all duration-300 w-full group cursor-pointer shadow-lg hover:shadow-2xl shadow-black/40 glass-card glass-reflection"
    >
      {/* Prismatic Top Edge */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent pointer-events-none" />

      {/* Dynamic Glow */}
      <div
        className="absolute -top-12 -right-12 w-28 h-28 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-2xl pointer-events-none"
        style={{ background: glowColor }}
      />
      
      {/* Icon Frame */}
      <div className={`p-3.5 rounded-2xl bg-white/[0.04] border border-white/[0.08] group-hover:border-transparent group-hover:scale-108 duration-300 ${colorClass} shrink-0 shadow-inner`}>
        <Icon className="w-5 h-5 font-bold" />
      </div>

      <div className="flex flex-col min-w-0">
        <span className="text-xs sm:text-sm font-black text-white tracking-wider uppercase group-hover:text-blue-400 transition-colors">{label}</span>
        <span className="text-[10px] text-white/40 group-hover:text-white/70 duration-300 tracking-normal truncate mt-0.5 font-bold font-mono">{subLabel}</span>
      </div>

      {/* Decorative arrow */}
      <div className="ml-auto opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300 text-white/50 shrink-0">
        <ChevronRight className="w-4 h-4" />
      </div>
    </motion.button>
  );
}

// ─── Category Chip ────────────────────────────────────────────────────────────

function CategoryChip({
  cat,
  products,
  onClick,
  delay = 0,
}: {
  cat: Category;
  products: Product[];
  onClick: () => void;
  delay?: number;
}) {
  const catProducts = products.filter(
    (p) => p.category === cat.id || p.category === cat.name || p.category === cat.title
  );
  const productCount = catProducts.length;

  const prices = catProducts.map(p => p.price);
  const minPrice = prices.length > 0 ? Math.min(...prices) : 0;
  const maxPrice = prices.length > 0 ? Math.max(...prices) : 0;

  const priceRangeStr = prices.length > 0
    ? (minPrice === maxPrice 
        ? `${minPrice.toFixed(2)}` 
        : `${minPrice.toFixed(2)} - ${maxPrice.toFixed(2)}`)
    : "0.00";

  return (
    <motion.div
      initial={{ opacity: 0, y: 25 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-15px" }}
      transition={{ duration: 0.45, delay, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ y: -5, transition: { duration: 0.25 } }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className="relative group overflow-hidden rounded-[26px] border border-white/[0.08] bg-[#0c0c12]/85 backdrop-blur-xl hover:border-white/25 transition-all duration-300 flex flex-col cursor-pointer shadow-xl shadow-black/40 glass-card glass-reflection"
    >
      {/* Prismatic Top Edge Highlight */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent z-20 pointer-events-none" />

      {/* Banner Area */}
      <div className="relative aspect-[21/6] w-full overflow-hidden shrink-0 bg-[#121218]">
        {cat.bannerUrl ? (
          <img
            src={cat.bannerUrl}
            alt={cat.name || cat.title}
            className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700 opacity-65 group-hover:opacity-90"
            referrerPolicy="no-referrer"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-zinc-900 to-black flex items-center justify-center">
            <Package className="w-8 h-8 text-white/10" />
          </div>
        )}
        
        {/* Gradients */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0c0c12] via-transparent to-transparent opacity-95" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0c0c12]/40 to-transparent" />
      </div>

      {/* Content Area */}
      <div className="p-4 sm:p-5 flex flex-col justify-between flex-1 bg-[#0c0c12]/60">
        <h3 className="text-base sm:text-lg font-black text-white px-0.5 tracking-wide uppercase truncate mb-1 group-hover:text-blue-400 transition-colors">
          {cat.name || cat.title}
        </h3>
        
        <div className="flex items-center justify-between text-xs font-semibold mt-3 pt-3 border-t border-white/[0.06]">
          {/* Item Count */}
          <span className="text-white/50 flex items-center gap-1.5 uppercase font-bold tracking-wider">
            <Package className="w-3.5 h-3.5 text-white/40 shrink-0" />
            <span>มีสินค้าทั้งหมด <span className="text-emerald-400 font-black">{productCount}</span> รายการ</span>
          </span>
          
          {/* Price Range */}
          <span className="text-white font-mono font-black tracking-wider text-xs bg-white/[0.06] px-3 py-1.5 rounded-full border border-white/[0.1] shadow-sm group-hover:border-blue-500/30 group-hover:bg-blue-500/10 transition-all">
            ฿{priceRangeStr}
          </span>
        </div>
      </div>
    </motion.div>
  );
}

// ─── Product Card ─────────────────────────────────────────────────────────────

function ProductCard({
  product,
  onClick,
  delay = 0,
}: {
  product: Product;
  onClick: () => void;
  delay?: number;
}) {
  const [imgError, setImgError] = useState(false);
  const hasImage = product.imageUrl && product.imageUrl.trim() !== "" && !imgError;

  const discount =
    product.originalPrice && product.price < product.originalPrice
      ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
      : null;

  const isHot = product.price > 100 || (discount !== null && discount >= 20) || product.stock > 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 25 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-15px" }}
      transition={{ duration: 0.45, delay, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ y: -5, transition: { duration: 0.25 } }}
      className="group relative bg-[#0c0c12]/85 backdrop-blur-xl border border-white/[0.08] rounded-[26px] overflow-hidden hover:border-white/25 transition-all duration-300 flex flex-col shadow-xl shadow-black/40 glass-card glass-reflection"
    >
      {/* Prismatic Top Edge Highlight */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent z-20 pointer-events-none" />

      {/* Image area with corner ribbon */}
      <div className="relative aspect-square w-full bg-[#121218] overflow-hidden shrink-0">
        {hasImage ? (
          <img
            src={product.imageUrl}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700"
            onError={() => setImgError(true)}
            referrerPolicy="no-referrer"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center select-none">
            <div className="text-center">
              <Package className="w-8 h-8 text-white/10 mx-auto mb-1" />
              <p className="text-[10px] text-white/20 font-medium px-3 line-clamp-2">{product.name}</p>
            </div>
          </div>
        )}

        {/* Diagonal "Best Seller" ribbon in image corner */}
        {isHot && (
          <div className="absolute top-0 right-0 overflow-hidden w-20 h-20 pointer-events-none z-10">
            <div className="absolute top-3 -right-6 bg-gradient-to-r from-red-600 to-orange-500 text-white text-[9px] font-black uppercase py-1 w-24 text-center transform rotate-45 shadow-md border-b border-white/10">
              Best Seller
            </div>
          </div>
        )}

        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0c0c12] via-transparent to-transparent opacity-85" />

        {/* Discount Badge on left */}
        {discount !== null && (
          <div className="absolute top-3.5 left-3.5 bg-red-600 text-white text-[10px] font-black px-2.5 py-1 rounded-full shadow-lg border border-red-500/30">
            -{discount}%
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4 sm:p-5 flex flex-col flex-1 bg-[#0c0c12]/60">
        <h3 className="text-sm font-black text-white leading-snug line-clamp-1 mb-3 group-hover:text-blue-400 transition-colors">
          {product.name}
        </h3>

        {/* "ราคาสินค้า" subtle label */}
        <span className="text-[10px] font-bold text-white/35 uppercase tracking-wider block mb-1">ราคาสินค้า</span>

        {/* Price row */}
        <div className="flex flex-wrap items-center gap-2 mb-4">
          {product.originalPrice && product.price < product.originalPrice ? (
            <span className="text-xs text-red-500/80 line-through font-mono font-bold">฿{product.originalPrice.toLocaleString()}</span>
          ) : null}
          
          <span className="text-lg font-black text-amber-400 tracking-tight font-mono">
            ฿{product.price.toLocaleString()}
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

        {/* Buy Button */}
        <button
          onClick={onClick}
          className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white py-3 rounded-full text-xs font-black transition-all duration-200 mt-auto shadow-lg shadow-blue-600/25 hover:shadow-blue-500/40 active:scale-95 cursor-pointer"
        >
          <ShoppingCart className="w-3.5 h-3.5" />
          สั่งซื้อสินค้า
        </button>

        {/* Stock Row Box */}
        <div className="mt-3.5 py-2 rounded-full bg-white/[0.03] border border-white/[0.06] flex items-center justify-center gap-2 text-[10px] text-white/40 font-black uppercase tracking-widest leading-none">
          <Package className="w-3.5 h-3.5 text-white/20 shrink-0" />
          <span>คงเหลือ <span className="text-white/80 font-mono font-bold">{product.stock.toLocaleString()}</span> ชิ้น</span>
        </div>
      </div>
    </motion.div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export const HomeView: React.FC<HomeViewProps> = ({
  products,
  categories,
  stats,
  user,
  siteSettings,
  setActiveView,
  onProductClick,
  onSelectCategory,
}) => {
  const [latestPurchases, setLatestPurchases] = useState<any[]>([]);

  useEffect(() => {
    const fetchPurchases = async () => {
      try {
        const res = await axios.get("/api/latest-purchases");
        if (res.data) {
          setLatestPurchases(res.data);
        }
      } catch (e) {
        // silently fail or log
      }
    };
    fetchPurchases();
    
    // Refresh every 30s
    const intv = setInterval(fetchPurchases, 30000);
    return () => clearInterval(intv);
  }, []);

  const safeProducts = useMemo(() => (Array.isArray(products) ? products : []), [products]);

  const totalSales =
    siteSettings?.stats_sales_override != null
      ? Number(siteSettings.stats_sales_override)
      : stats?.sales ?? 0;

  const totalMembers =
    siteSettings?.stats_users_override != null
      ? Number(siteSettings.stats_users_override)
      : stats?.users ?? 0;

  const totalStock = useMemo(
    () => safeProducts.reduce((acc, p) => acc + Math.max(0, p.stock ?? 0), 0),
    [safeProducts]
  );

  return (
    <div className="w-full min-h-screen bg-[#070707] text-white font-sans antialiased">
      <div className="max-w-4xl mx-auto px-4 md:px-6 pb-24 pt-6">

        {/* ── Hero Banner ── */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="relative overflow-hidden rounded-[32px] border border-white/[0.08] mb-8 aspect-[21/6] bg-[#0d0d10] shadow-2xl shadow-red-500/10 group"
        >
          <img
            src="https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=2070&auto=format&fit=crop"
            alt="APEX STORE"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out opacity-85"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/40 to-transparent flex flex-col justify-center px-8 md:px-12 pointer-events-none">
            <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight mb-2 drop-shadow-xl">
              APEX<span className="text-red-500">STORE</span>
            </h1>
            <p className="text-white/70 text-sm md:text-lg max-w-sm drop-shadow-md font-medium">
              ศูนย์รวมเกมและไอเท็มคุณภาพสูง บริการตลอด 24 ชั่วโมง
            </p>
          </div>
        </motion.div>

        {/* ── Announcement Bar ── */}
        {false && ((siteSettings?.announcement_text ?? "ยินดีต้อนรับทุกท่านเข้าสู่ APEX STORE จำหน่ายไอดีราคาถูก | มีปัญหาติดต่อดิสอคร์ดเร็วที่สุด").trim() !== '') && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mb-8 flex items-center bg-zinc-900/50 border border-white/[0.06] rounded-xl px-4 py-2.5 overflow-hidden"
          >
            <div className="flex items-center justify-center bg-red-500/10 px-2.5 py-1.5 rounded-lg border border-red-500/20 text-red-400 shrink-0 mr-3 shadow-[0_0_15px_rgba(239,68,68,0.1)] gap-1.5 font-black text-xs select-none">
              <Megaphone className="w-3.5 h-3.5 animate-bounce" />
              <span>ประกาศ</span>
            </div>
            <div className="flex-1 overflow-hidden relative" style={{ minWidth: 0 }}>
              <div className="text-sm font-semibold text-white/90 tracking-wide pt-0.5 animate-marquee-css inline-block whitespace-nowrap">
                {siteSettings?.announcement_text ?? "ยินดีต้อนรับทุกท่านเข้าสู่ APEX STORE จำหน่ายไอดีราคาถูก | มีปัญหาติดต่อดิสอคร์ดเร็วที่สุด"}
              </div>
            </div>
          </motion.div>
        )}

        {/* ── Stats Row ── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
          <StatCard
            label="สมาชิกทั้งหมด"
            value={totalMembers}
            unit="คน"
            icon={Users}
            accent="rgba(99,102,241,0.4)"
            delay={0.1}
          />
          <StatCard
            label="พร้อมจำหน่าย"
            value={totalStock}
            unit="ชิ้น"
            icon={Package}
            accent="rgba(245,158,11,0.4)"
            delay={0.2}
          />
          <StatCard
            label="หมวดหมู่ทั้งหมด"
            value={categories.length}
            unit="หมวดหมู่"
            icon={LayoutGrid}
            accent="rgba(16,185,129,0.4)"
            delay={0.3}
          />
          <StatCard
            label="ยอดขาย"
            value={totalSales}
            unit="ครั้ง"
            icon={ShoppingCart}
            accent="rgba(239,68,68,0.4)"
            delay={0.4}
          />
        </div>

        {/* ── Quick Shortcut Buttons ── */}
        <section className="mb-8">
          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            <ShortcutBtn
              label="สั่งซื้อสินค้า"
              subLabel="GO SHOPPING"
              icon={ShoppingCart}
              colorClass="text-emerald-400 group-hover:bg-emerald-500/10 group-hover:text-emerald-300"
              glowColor="rgba(16,185,129,0.15)"
              onClick={() => setActiveView("categories")}
              delay={0.1}
            />
            <ShortcutBtn
              label="ประวัติสั่งซื้อ"
              subLabel="ORDER HISTORY"
              icon={History}
              colorClass="text-indigo-400 group-hover:bg-indigo-500/10 group-hover:text-indigo-300"
              glowColor="rgba(99,102,241,0.15)"
              onClick={() => setActiveView("order_history")}
              delay={0.2}
            />
            <ShortcutBtn
              label="ติดต่อ ADMIN"
              subLabel="CONTACT ADMIN"
              icon={MessageSquare}
              colorClass="text-rose-450 group-hover:bg-rose-500/10 group-hover:text-rose-350"
              glowColor="rgba(244,63,94,0.15)"
              onClick={() => setActiveView("contact")}
              delay={0.3}
            />
            <ShortcutBtn
              label="เติมเงิน TOPUP"
              subLabel="TOPUP WALLET"
              icon={Coins}
              colorClass="text-amber-400 group-hover:bg-amber-500/10 group-hover:text-amber-300"
              glowColor="rgba(245,158,11,0.15)"
              onClick={() => setActiveView("wallet")}
              delay={0.4}
            />
          </div>
        </section>

        {/* ── Categories ── */}
        {categories.length > 0 && (
          <section className="mb-10">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-20px" }}
              transition={{ duration: 0.5 }}
              className="flex items-center justify-between mb-4"
            >
              <div className="flex items-center gap-2">
                <LayoutGrid className="w-5 h-5 text-neon-green" />
                <h2 className="text-base font-black text-white tracking-tight uppercase">หมวดหมู่แนะนำ</h2>
              </div>
              <button
                className="text-xs text-white/40 hover:text-white/70 transition-colors flex items-center gap-1 font-semibold rounded-lg"
                onClick={() => setActiveView("categories")}
              >
                ดูทั้งหมด <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </motion.div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {categories.slice(0, 4).map((cat, idx) => (
                <CategoryChip key={cat.id} cat={cat} products={products} onClick={() => onSelectCategory(cat.id)} delay={idx * 0.1} />
              ))}
            </div>
          </section>
        )}

        {/* ── Divider Strip ── */}
        <motion.div
          initial={{ opacity: 0, scaleX: 0 }}
          whileInView={{ opacity: 1, scaleX: 1 }}
          viewport={{ once: true, margin: "-20px" }}
          transition={{ duration: 0.7 }}
          className="w-full h-2 rounded-full bg-gradient-to-r from-emerald-500/0 via-emerald-500/20 to-indigo-500/0 mb-10"
        />

        {/* ── Latest Purchases ── */}
        <section className="mb-10">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-20px" }}
            transition={{ duration: 0.5 }}
            className="flex items-center gap-2 mb-4"
          >
             <History className="w-5 h-5 text-indigo-400" />
             <h2 className="text-base font-black text-white tracking-tight uppercase">รายการสั่งซื้อล่าสุด 10 รายการ</h2>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-20px" }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="bg-[#0c0c0e]/90 backdrop-blur-md border border-white/[0.08] rounded-[28px] overflow-hidden p-2 sm:p-3 shadow-xl shadow-black/50"
          >
             <div className="max-h-64 overflow-y-auto no-scrollbar flex flex-col gap-1.5 p-1">
               {latestPurchases.length === 0 ? (
                 <div className="p-6 text-center text-white/40 text-sm font-medium flex flex-col items-center gap-2">
                   <Package className="w-6 h-6 text-white/20" />
                   ยังไม่มีรายการสั่งซื้อ
                 </div>
               ) : (
                 latestPurchases.map((p, idx) => (
                    <div key={p.dbId || idx} className="flex items-center justify-between p-3 rounded-2xl hover:bg-white/[0.04] transition-all">
                      <div className="flex items-center gap-3 overflow-hidden pr-2">
                        <div className="w-10 h-10 rounded-xl shrink-0 bg-white/[0.04] border border-white/[0.06] flex items-center justify-center">
                          <Package className="w-4 h-4 text-white/60" />
                        </div>
                        <div className="flex flex-col overflow-hidden">
                          <span className="text-sm font-bold text-white truncate">{p.product_name}</span>
                          <span className="text-xs text-white/40">{new Date(p.date).toLocaleString('th-TH')}</span>
                        </div>
                      </div>
                      <div className="flex flex-col items-end shrink-0 gap-1">
                        <span className="text-xs font-black text-neon-green px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">+{p.quantity} ชิ้น</span>
                        <span className="text-[10px] text-white/40 uppercase font-mono font-bold tracking-widest">{p.price} THB</span>
                      </div>
                    </div>
                 ))
               )}
             </div>
          </motion.div>
        </section>

        {/* ── Divider Strip ── */}
        <motion.div
          initial={{ opacity: 0, scaleX: 0 }}
          whileInView={{ opacity: 1, scaleX: 1 }}
          viewport={{ once: true, margin: "-20px" }}
          transition={{ duration: 0.7 }}
          className="w-full h-2 rounded-full bg-gradient-to-r from-blue-500/0 via-blue-500/20 to-purple-500/0 mb-10"
        />

        {/* ── Products ── */}
        <section>
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-20px" }}
            transition={{ duration: 0.5 }}
            className="flex items-center justify-between mb-5"
          >
            <div className="flex items-center gap-2">
              <Star className="w-5 h-5 text-neon-yellow fill-neon-yellow animate-pulse" />
              <div>
                <h2 className="text-base font-black text-white tracking-tight uppercase">สินค้าแนะนำ</h2>
                <p className="text-xs text-white/30 mt-0.5">ของดี มีจำกัด รีบเป็นเจ้าของ</p>
              </div>
            </div>
            <button
              className="text-xs text-white/40 hover:text-white/70 transition-colors flex items-center gap-1 font-semibold rounded-lg"
              onClick={() => setActiveView("categories")}
            >
              ดูทั้งหมด <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </motion.div>

          {safeProducts.length === 0 ? (
            <div className="text-center py-20 text-white/30 text-sm">
              ยังไม่มีสินค้าในขณะนี้
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
              {safeProducts.map((p, idx) => (
                <ProductCard key={p.id} product={p} onClick={() => onProductClick(p.id)} delay={idx * 0.05} />
              ))}
            </div>
          )}
        </section>

      </div>
    </div>
  );
};
