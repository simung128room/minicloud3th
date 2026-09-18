import React, { useState, useEffect, useMemo, useRef } from "react";
import { Product, SiteStats, Category } from "../types";
import {
  Wallet,
  ShoppingCart,
  Gift,
  History,
  Users,
  Package,
  CheckCircle2,
  Zap,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Flame,
  Search,
  Activity,
  ArrowRight,
  Megaphone,
} from "lucide-react";
import { motion } from "motion/react";
import { CategoryCard } from "./CategoryCard";
import { Marquee } from "./Marquee";
import { generateGradient } from "../utils";

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

export const HomeView: React.FC<HomeViewProps> = ({
  products = [],
  categories = [],
  stats,
  siteSettings,
  purchaseHistory = [],
  setActiveView,
  onProductClick,
  onSelectCategory,
}) => {
  const [currentBanner, setCurrentBanner] = useState<number>(0);
  const [selectedCategoryTab, setSelectedCategoryTab] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const bannerTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Safe products
  const safeProducts = useMemo(
    () => (Array.isArray(products) ? products : []),
    [products]
  );

  // Safe categories
  const safeCategories = useMemo(
    () => (Array.isArray(categories) ? categories : []),
    [categories]
  );

  // Banners
  const banners = useMemo(() => {
    if (
      siteSettings?.banners &&
      Array.isArray(siteSettings.banners) &&
      siteSettings.banners.length > 0
    ) {
      return siteSettings.banners.filter((b: any) => typeof b === "string" && b.trim() !== "");
    }
    return [
      "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1600&q=80",
      "https://images.unsplash.com/photo-1538481199705-c710c4e965fc?auto=format&fit=crop&w=1600&q=80",
    ];
  }, [siteSettings]);

  // Auto banner carousel
  useEffect(() => {
    if (banners.length <= 1) return;
    bannerTimerRef.current = setInterval(() => {
      setCurrentBanner((prev) => (prev + 1) % banners.length);
    }, 5500);
    return () => {
      if (bannerTimerRef.current) clearInterval(bannerTimerRef.current);
    };
  }, [banners.length]);

  const handlePrevBanner = () => {
    if (bannerTimerRef.current) clearInterval(bannerTimerRef.current);
    setCurrentBanner((prev) => (prev - 1 + banners.length) % banners.length);
  };

  const handleNextBanner = () => {
    if (bannerTimerRef.current) clearInterval(bannerTimerRef.current);
    setCurrentBanner((prev) => (prev + 1) % banners.length);
  };

  // Stats
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

  // Helper for category price info
  const getCategoryPriceInfo = (cat: any) => {
    const catProducts =
      cat === "all"
        ? safeProducts
        : safeProducts.filter(
            (p) =>
              p.category === cat.id ||
              p.category === cat.name ||
              p.category === cat.title
          );
    if (catProducts.length === 0) return null;
    const prices = catProducts.map((p) => p.price);
    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);
    if (minPrice === maxPrice) {
      return `฿${minPrice.toLocaleString()}`;
    }
    return `฿${minPrice.toLocaleString()} - ฿${maxPrice.toLocaleString()}`;
  };

  const getProductCountText = (cat: any) => {
    const catProducts =
      cat === "all"
        ? safeProducts
        : safeProducts.filter(
            (p) =>
              p.category === cat.id ||
              p.category === cat.name ||
              p.category === cat.title
          );
    return `${catProducts.length} สินค้า`;
  };

  // Filtered products
  const filteredProducts = useMemo(() => {
    let result = safeProducts;

    if (selectedCategoryTab !== "all") {
      result = result.filter((p) => {
        const catInfo = safeCategories.find(
          (c) =>
            c.id === selectedCategoryTab ||
            c.name === selectedCategoryTab ||
            c.title === selectedCategoryTab
        );
        return (
          p.category === selectedCategoryTab ||
          p.category === catInfo?.title ||
          p.category === catInfo?.name ||
          p.category === catInfo?.id
        );
      });
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          (p.category && p.category.toLowerCase().includes(q)) ||
          (p.description && p.description.toLowerCase().includes(q))
      );
    }

    return result;
  }, [safeProducts, safeCategories, selectedCategoryTab, searchQuery]);

  const announcement =
    siteSettings?.announcement_text ||
    "ยินดีต้อนรับสู่ระบบ Apex Store ศูนย์รวมไอดีเกมและบริการดิจิทัลชั้นนำ ระบบอัตโนมัติ 24 ชั่วโมง จัดส่งทันที ปลอดภัย เชื่อถือได้ 100%";

  return (
    <div className="w-full min-h-screen text-white font-sans antialiased relative selection:bg-white selection:text-black">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-3 sm:py-6 space-y-6 sm:space-y-8 lg:space-y-10 relative z-10">

        {/* ── 1. Hero Banner Carousel (Responsive Aspect Ratio) ── */}
        <section className="relative w-full rounded-2xl sm:rounded-[32px] overflow-hidden border border-white/[0.1] bg-[#0c0c12]/80 backdrop-blur-xl shadow-2xl shadow-black/80 glass-card">
          <div className="relative aspect-[16/9] sm:aspect-[21/9] md:aspect-[21/8] lg:aspect-[21/7] w-full overflow-hidden">
            {banners.map((bannerUrl, idx) => (
              <motion.div
                key={bannerUrl + idx}
                initial={false}
                animate={{
                  opacity: idx === currentBanner ? 1 : 0,
                  scale: idx === currentBanner ? 1 : 1.05,
                }}
                transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                className="absolute inset-0 w-full h-full"
                style={{ pointerEvents: idx === currentBanner ? "auto" : "none" }}
              >
                <img
                  src={bannerUrl}
                  alt={`Banner ${idx + 1}`}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                {/* Vignette gradients */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0c0c12] via-[#0c0c12]/30 to-transparent opacity-90" />
                <div className="absolute inset-0 bg-gradient-to-r from-[#0c0c12]/80 via-transparent to-[#0c0c12]/40" />
              </motion.div>
            ))}

            {/* Banner navigation buttons */}
            {banners.length > 1 && (
              <>
                <button
                  onClick={handlePrevBanner}
                  className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 p-2 sm:p-2.5 rounded-full bg-black/60 hover:bg-black/90 border border-white/15 hover:border-white/30 text-white/90 hover:text-white backdrop-blur-md transition-all active:scale-90 z-20 cursor-pointer shadow-lg"
                  aria-label="Previous Banner"
                >
                  <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
                <button
                  onClick={handleNextBanner}
                  className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 p-2 sm:p-2.5 rounded-full bg-black/60 hover:bg-black/90 border border-white/15 hover:border-white/30 text-white/90 hover:text-white backdrop-blur-md transition-all active:scale-90 z-20 cursor-pointer shadow-lg"
                  aria-label="Next Banner"
                >
                  <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>

                {/* Banner Pagination Dots */}
                <div className="absolute bottom-2.5 sm:bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-1.5 sm:gap-2 z-20 px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-full bg-black/60 backdrop-blur-md border border-white/10">
                  {banners.map((_, dotIdx) => (
                    <button
                      key={dotIdx}
                      onClick={() => {
                        if (bannerTimerRef.current) clearInterval(bannerTimerRef.current);
                        setCurrentBanner(dotIdx);
                      }}
                      className={`h-1.5 sm:h-2 rounded-full transition-all duration-300 ${
                        dotIdx === currentBanner
                          ? "w-4 sm:w-6 bg-white shadow-sm shadow-white"
                          : "w-1.5 sm:w-2 bg-white/30 hover:bg-white/60"
                      }`}
                      aria-label={`Slide to ${dotIdx + 1}`}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
        </section>

        {/* ── 2. Announcement Marquee Bar ── */}
        <section className="flex items-center gap-2.5 sm:gap-3 px-3.5 sm:px-5 py-2.5 sm:py-3 rounded-xl sm:rounded-2xl bg-[#0c0c12]/80 border border-white/[0.08] backdrop-blur-xl shadow-lg shadow-black/40">
          <div className="flex items-center gap-1.5 sm:gap-2 text-blue-400 font-bold text-[11px] sm:text-xs uppercase tracking-wider shrink-0">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500" />
            </span>
            <Megaphone className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-blue-400" />
            <span className="hidden xs:inline sm:inline">ประกาศ</span>
          </div>
          <div className="h-3.5 w-px bg-white/10 shrink-0" />
          <div className="flex-1 overflow-hidden">
            <Marquee text={announcement} speed={25} className="text-xs sm:text-sm text-white/80 font-medium" />
          </div>
        </section>

        {/* ── 3. Quick Access Shortcuts (4 Action Cards) ── */}
        <section className="grid grid-cols-2 md:grid-cols-4 gap-2.5 sm:gap-4 lg:gap-5">
          {/* Wallet */}
          <div
            onClick={() => {
              setActiveView("wallet");
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            className="group relative bg-[#0c0c12]/85 backdrop-blur-xl border border-white/[0.08] hover:border-blue-500/40 rounded-2xl sm:rounded-[24px] p-3.5 sm:p-5 flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 active:scale-[0.98] shadow-xl shadow-black/40 cursor-pointer glass-card glass-reflection"
          >
            <div className="flex items-start justify-between mb-3 sm:mb-4">
              <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl sm:rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 group-hover:scale-110 group-hover:bg-blue-500/20 transition-all duration-300 shadow-lg shadow-blue-500/10">
                <Wallet className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <span className="text-[9px] sm:text-[10px] font-bold text-blue-400/90 bg-blue-500/10 px-2 py-0.5 rounded-full border border-blue-500/20 uppercase tracking-wider">
                Wallet
              </span>
            </div>
            <div>
              <h3 className="text-xs sm:text-sm md:text-base font-black text-white group-hover:text-blue-400 transition-colors truncate">
                เติมเงินกระเป๋า
              </h3>
              <p className="text-[10px] sm:text-[11px] text-white/40 font-medium mt-0.5 truncate">
                PromptPay / ทรูมันนี่
              </p>
            </div>
          </div>

          {/* Categories / All Products */}
          <div
            onClick={() => {
              setActiveView("categories");
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            className="group relative bg-[#0c0c12]/85 backdrop-blur-xl border border-white/[0.08] hover:border-emerald-500/40 rounded-2xl sm:rounded-[24px] p-3.5 sm:p-5 flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 active:scale-[0.98] shadow-xl shadow-black/40 cursor-pointer glass-card glass-reflection"
          >
            <div className="flex items-start justify-between mb-3 sm:mb-4">
              <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl sm:rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 group-hover:scale-110 group-hover:bg-emerald-500/20 transition-all duration-300 shadow-lg shadow-emerald-500/10">
                <ShoppingCart className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <span className="text-[9px] sm:text-[10px] font-bold text-emerald-400/90 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20 uppercase tracking-wider">
                Store
              </span>
            </div>
            <div>
              <h3 className="text-xs sm:text-sm md:text-base font-black text-white group-hover:text-emerald-400 transition-colors truncate">
                หมวดหมู่สินค้า
              </h3>
              <p className="text-[10px] sm:text-[11px] text-white/40 font-medium mt-0.5 truncate">
                เลือกตามประเภทเกม
              </p>
            </div>
          </div>

          {/* Redeem Code */}
          <div
            onClick={() => {
              setActiveView("redeem");
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            className="group relative bg-[#0c0c12]/85 backdrop-blur-xl border border-white/[0.08] hover:border-purple-500/40 rounded-2xl sm:rounded-[24px] p-3.5 sm:p-5 flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 active:scale-[0.98] shadow-xl shadow-black/40 cursor-pointer glass-card glass-reflection"
          >
            <div className="flex items-start justify-between mb-3 sm:mb-4">
              <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl sm:rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 group-hover:scale-110 group-hover:bg-purple-500/20 transition-all duration-300 shadow-lg shadow-purple-500/10">
                <Gift className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <span className="text-[9px] sm:text-[10px] font-bold text-purple-400/90 bg-purple-500/10 px-2 py-0.5 rounded-full border border-purple-500/20 uppercase tracking-wider">
                Reward
              </span>
            </div>
            <div>
              <h3 className="text-xs sm:text-sm md:text-base font-black text-white group-hover:text-purple-400 transition-colors truncate">
                กล่องสุ่ม & โค้ด
              </h3>
              <p className="text-[10px] sm:text-[11px] text-white/40 font-medium mt-0.5 truncate">
                แลกรับไอเทม & ส่วนลด
              </p>
            </div>
          </div>

          {/* History */}
          <div
            onClick={() => {
              setActiveView("history");
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            className="group relative bg-[#0c0c12]/85 backdrop-blur-xl border border-white/[0.08] hover:border-amber-500/40 rounded-2xl sm:rounded-[24px] p-3.5 sm:p-5 flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 active:scale-[0.98] shadow-xl shadow-black/40 cursor-pointer glass-card glass-reflection"
          >
            <div className="flex items-start justify-between mb-3 sm:mb-4">
              <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl sm:rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 group-hover:scale-110 group-hover:bg-amber-500/20 transition-all duration-300 shadow-lg shadow-amber-500/10">
                <History className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <span className="text-[9px] sm:text-[10px] font-bold text-amber-400/90 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20 uppercase tracking-wider">
                Orders
              </span>
            </div>
            <div>
              <h3 className="text-xs sm:text-sm md:text-base font-black text-white group-hover:text-amber-400 transition-colors truncate">
                ประวัติการสั่งซื้อ
              </h3>
              <p className="text-[10px] sm:text-[11px] text-white/40 font-medium mt-0.5 truncate">
                เช็คย้อนหลังและรับรหัส
              </p>
            </div>
          </div>
        </section>

        {/* ── 4. Live Site Statistics (4 Cards) ── */}
        <section className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4 lg:gap-5">
          <div className="bg-[#0c0c12]/85 backdrop-blur-xl border border-white/[0.08] rounded-2xl sm:rounded-[24px] p-3.5 sm:p-5 flex items-center gap-3 sm:gap-4 glass-card">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 shrink-0">
              <Users className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div className="min-w-0">
              <div className="text-base sm:text-xl lg:text-2xl font-black text-white font-mono tracking-tight truncate">
                {totalMembers.toLocaleString()}+
              </div>
              <div className="text-[10px] sm:text-xs text-white/50 font-medium leading-tight truncate">สมาชิกในระบบ</div>
            </div>
          </div>

          <div className="bg-[#0c0c12]/85 backdrop-blur-xl border border-white/[0.08] rounded-2xl sm:rounded-[24px] p-3.5 sm:p-5 flex items-center gap-3 sm:gap-4 glass-card">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
              <Package className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div className="min-w-0">
              <div className="text-base sm:text-xl lg:text-2xl font-black text-white font-mono tracking-tight truncate">
                {totalStock.toLocaleString()}+
              </div>
              <div className="text-[10px] sm:text-xs text-white/50 font-medium leading-tight truncate">สินค้าพร้อมส่ง</div>
            </div>
          </div>

          <div className="bg-[#0c0c12]/85 backdrop-blur-xl border border-white/[0.08] rounded-2xl sm:rounded-[24px] p-3.5 sm:p-5 flex items-center gap-3 sm:gap-4 glass-card">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 shrink-0">
              <CheckCircle2 className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div className="min-w-0">
              <div className="text-base sm:text-xl lg:text-2xl font-black text-white font-mono tracking-tight truncate">
                {totalSales.toLocaleString()}+
              </div>
              <div className="text-[10px] sm:text-xs text-white/50 font-medium leading-tight truncate">จัดส่งสำเร็จแล้ว</div>
            </div>
          </div>

          <div className="bg-[#0c0c12]/85 backdrop-blur-xl border border-white/[0.08] rounded-2xl sm:rounded-[24px] p-3.5 sm:p-5 flex items-center gap-3 sm:gap-4 glass-card">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 shrink-0">
              <Zap className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div className="min-w-0">
              <div className="text-base sm:text-xl lg:text-2xl font-black text-white font-mono tracking-tight">
                24 / 7
              </div>
              <div className="text-[10px] sm:text-xs text-white/50 font-medium leading-tight truncate">บริการตลอดวัน</div>
            </div>
          </div>
        </section>

        {/* ── 5. Recommended Categories Showcase ── */}
        <section className="space-y-4 sm:space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 sm:gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 sm:gap-2 px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[10px] sm:text-xs font-bold uppercase tracking-wider mb-1.5 sm:mb-2">
                <Sparkles className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                <span>Store Categories</span>
              </div>
              <h2 className="text-lg sm:text-2xl lg:text-3xl font-black text-white tracking-tight">
                หมวดหมู่สินค้าแนะนำ
              </h2>
              <p className="text-[11px] sm:text-xs md:text-sm text-white/50 font-medium mt-0.5">
                เลือกชมสินค้าตามหมวดหมู่เกมที่คุณต้องการ
              </p>
            </div>

            <button
              onClick={() => {
                setActiveView("categories");
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              className="inline-flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm font-bold text-white/70 hover:text-white bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.1] px-3.5 py-2 sm:px-4 sm:py-2.5 rounded-full transition-all active:scale-95 cursor-pointer self-start sm:self-auto shrink-0"
            >
              <span>ดูหมวดหมู่ทั้งหมด</span>
              <ChevronRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-5 lg:gap-6">
            {/* View all categories card */}
            <CategoryCard
              title="ดูสินค้าทั้งหมด"
              label="ทุกหมวดหมู่"
              itemCountDesc={`ทั้งหมด ${getProductCountText("all")}`}
              priceRangeStr={getCategoryPriceInfo("all") || undefined}
              bgImage={banners[0]}
              index={0}
              onClick={() => onSelectCategory("all")}
              accentColor="#3b82f6"
              glowColor="rgba(59,130,246,0.15)"
              gradientFrom="#0c0c12"
            />

            {/* Top categories */}
            {safeCategories.slice(0, 5).map((c, i) => (
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
        </section>

        {/* ── 6. Products Catalog & Live Filter Section ── */}
        <section className="space-y-4 sm:space-y-6 pt-2">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 sm:gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 sm:gap-2 px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-400 text-[10px] sm:text-xs font-bold uppercase tracking-wider mb-1.5 sm:mb-2">
                <Flame className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                <span>In Stock & Ready</span>
              </div>
              <h2 className="text-lg sm:text-2xl lg:text-3xl font-black text-white tracking-tight">
                สินค้าพร้อมจัดส่งทันที
              </h2>
              <p className="text-[11px] sm:text-xs md:text-sm text-white/50 font-medium mt-0.5">
                ระบบส่งมอบรหัสอัตโนมัติ 24 ชม. รวดเร็วและปลอดภัย 100%
              </p>
            </div>

            {/* Quick search input */}
            <div className="relative w-full sm:w-64 md:w-72 shrink-0">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="ค้นหาชื่อสินค้า..."
                className="w-full bg-[#0c0c12]/80 border border-white/[0.08] focus:border-blue-500/50 rounded-full pl-9 sm:pl-10 pr-4 py-1.5 sm:py-2 text-xs sm:text-sm text-white placeholder:text-white/30 focus:outline-none transition-all"
              />
            </div>
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto pb-1 scrollbar-none no-scrollbar touch-pan-x -mx-1 px-1">
            <button
              onClick={() => setSelectedCategoryTab("all")}
              className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs font-bold transition-all whitespace-nowrap cursor-pointer shrink-0 ${
                selectedCategoryTab === "all"
                  ? "bg-white text-black shadow-lg shadow-white/20"
                  : "bg-white/[0.04] text-white/70 hover:text-white hover:bg-white/[0.08] border border-white/[0.08]"
              }`}
            >
              ทั้งหมด ({safeProducts.length})
            </button>

            {safeCategories.map((cat) => {
              const catCount = safeProducts.filter(
                (p) =>
                  p.category === cat.id ||
                  p.category === cat.name ||
                  p.category === cat.title
              ).length;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategoryTab(cat.id || cat.name || cat.title)}
                  className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs font-bold transition-all whitespace-nowrap cursor-pointer shrink-0 ${
                    selectedCategoryTab === cat.id ||
                    selectedCategoryTab === cat.name ||
                    selectedCategoryTab === cat.title
                      ? "bg-white text-black shadow-lg shadow-white/20"
                      : "bg-white/[0.04] text-white/70 hover:text-white hover:bg-white/[0.08] border border-white/[0.08]"
                  }`}
                >
                  {cat.title} ({catCount})
                </button>
              );
            })}
          </div>

          {/* Product Grid */}
          {filteredProducts.length === 0 ? (
            <div className="bg-[#0c0c12]/85 border border-white/[0.08] rounded-2xl sm:rounded-[32px] p-10 sm:p-16 text-center glass-card">
              <div className="mb-3 sm:mb-4 flex justify-center">
                <Package className="w-10 h-10 sm:w-14 sm:h-14 text-white/20" />
              </div>
              <h3 className="text-base sm:text-lg font-black text-white">ไม่พบสินค้าที่คุณค้นหา</h3>
              <p className="text-white/40 text-xs sm:text-sm mt-1 font-medium">
                ลองค้นหาด้วยคำอื่น หรือเลือกหมวดหมู่อื่นเพื่อดูสินค้า
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5 sm:gap-4 lg:gap-5">
              {filteredProducts.slice(0, 16).map((product, i) => {
                const discount =
                  product.originalPrice && product.price < product.originalPrice
                    ? Math.round(
                        ((product.originalPrice - product.price) / product.originalPrice) * 100
                      )
                    : null;
                const isHot =
                  product.price > 100 || (discount !== null && discount >= 20) || product.stock > 0;

                return (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: 0.35,
                      delay: Math.min(i, 8) * 0.04,
                      ease: [0.16, 1, 0.3, 1],
                    }}
                    whileHover={{ y: -4, transition: { duration: 0.2 } }}
                    className="group relative bg-[#0c0c12]/85 backdrop-blur-xl border border-white/[0.08] rounded-2xl sm:rounded-[24px] overflow-hidden hover:border-white/25 transition-all duration-300 flex flex-col shadow-xl shadow-black/40 glass-card glass-reflection"
                  >
                    {/* Prismatic Top Edge Highlight */}
                    <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent z-20 pointer-events-none" />

                    {/* Image Area */}
                    <div className="relative aspect-square w-full bg-[#121218] overflow-hidden shrink-0">
                      {product.imageUrl && product.imageUrl.trim() !== "" ? (
                        <img
                          loading="lazy"
                          src={product.imageUrl}
                          alt={product.name}
                          className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700"
                          onError={(e) => {
                            e.currentTarget.style.display = "none";
                          }}
                          referrerPolicy="no-referrer"
                        />
                      ) : null}
                      <div
                        className="w-full h-full flex flex-col items-center justify-center opacity-85"
                        style={{
                          display:
                            product.imageUrl && product.imageUrl.trim() !== "" ? "none" : "flex",
                          background: generateGradient(product.name || product.id),
                        }}
                      >
                        <span className="text-3xl sm:text-4xl font-black text-white mix-blend-overlay opacity-65">
                          {(product.name || "P")[0].toUpperCase()}
                        </span>
                        <span className="text-[9px] sm:text-[10px] font-bold text-white/50 uppercase tracking-widest mt-1">
                          {product.category || "DEV"}
                        </span>
                      </div>

                      {isHot && (
                        <div className="absolute top-0 right-0 overflow-hidden w-16 h-16 sm:w-20 sm:h-20 pointer-events-none z-10">
                          <div className="absolute top-2.5 sm:top-3 -right-6 bg-gradient-to-r from-red-600 to-orange-500 text-white text-[8px] sm:text-[9px] font-black uppercase py-0.5 sm:py-1 w-20 sm:w-24 text-center transform rotate-45 shadow-md border-b border-white/10">
                            Best Seller
                          </div>
                        </div>
                      )}

                      <div className="absolute inset-0 bg-gradient-to-t from-[#0c0c12] via-transparent to-transparent opacity-85" />

                      {discount !== null && (
                        <div className="absolute top-2 left-2 sm:top-3 sm:left-3 bg-red-600 text-white text-[9px] sm:text-[10px] font-black px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full shadow-lg z-10 border border-red-500/30">
                          -{discount}%
                        </div>
                      )}
                    </div>

                    {/* Content Area */}
                    <div className="p-3 sm:p-4.5 flex flex-col flex-1 bg-[#0c0c12]/60">
                      <h3 className="text-xs sm:text-sm font-black text-white leading-snug line-clamp-1 mb-1.5 sm:mb-2 group-hover:text-blue-400 transition-colors">
                        {product.name}
                      </h3>

                      <span className="text-[9px] sm:text-[10px] font-bold text-white/35 uppercase tracking-wider block mb-1">
                        ราคาสินค้า
                      </span>

                      <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 mb-2.5 sm:mb-3.5">
                        {product.originalPrice && product.price < product.originalPrice ? (
                          <span className="text-[10px] sm:text-xs text-red-500/80 line-through font-mono font-bold">
                            ฿{product.originalPrice.toLocaleString()}
                          </span>
                        ) : null}

                        <span className="text-xs sm:text-base font-black text-amber-400 tracking-tight font-mono">
                          ฿{(product.price || 0).toLocaleString()}
                        </span>

                        {product.stock > 0 ? (
                          <span className="ml-auto bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[8px] sm:text-[10px] font-black px-1.5 py-0.5 sm:px-2.5 sm:py-1 rounded-full leading-none select-none">
                            พร้อมส่ง
                          </span>
                        ) : (
                          <span className="ml-auto bg-red-500/10 text-red-400 border border-red-500/20 text-[8px] sm:text-[10px] font-black px-1.5 py-0.5 sm:px-2.5 sm:py-1 rounded-full leading-none select-none">
                            หมด
                          </span>
                        )}
                      </div>

                      {product.stock <= 0 ? (
                        <button className="w-full bg-red-600/10 text-red-400 border border-red-500/20 py-2 sm:py-2.5 rounded-full text-[11px] sm:text-xs font-black flex items-center justify-center gap-1.5 cursor-default mt-auto">
                          <Package className="w-3.5 h-3.5" /> สินค้าหมด
                        </button>
                      ) : (
                        <button
                          onClick={() => onProductClick(product.id)}
                          className="w-full flex items-center justify-center gap-1.5 sm:gap-2 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white py-2 sm:py-2.5 rounded-full text-[11px] sm:text-xs font-black transition-all duration-200 mt-auto shadow-lg shadow-blue-600/25 hover:shadow-blue-500/40 active:scale-95 cursor-pointer"
                        >
                          <ShoppingCart className="w-3.5 h-3.5" />
                          สั่งซื้อสินค้า
                        </button>
                      )}

                      <div className="mt-2 sm:mt-3 py-1 rounded-full bg-white/[0.03] border border-white/[0.06] flex items-center justify-center gap-1.5 text-[8px] sm:text-[10px] text-white/40 font-black uppercase tracking-widest leading-none">
                        <Package className="w-3 h-3 text-white/20 shrink-0" />
                        <span className="truncate">
                          คงเหลือ{" "}
                          <span className="text-white/80 font-mono font-bold">
                            {product.stock >= 999999
                              ? "ไม่จำกัด"
                              : product.stock.toLocaleString()}
                          </span>{" "}
                          ชิ้น
                        </span>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}

          {/* View all products button */}
          {filteredProducts.length > 16 && (
            <div className="pt-4 sm:pt-6 flex justify-center">
              <button
                onClick={() => {
                  setActiveView("categories");
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                className="px-6 sm:px-8 py-3 sm:py-3.5 bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.1] text-white font-bold rounded-full transition-all active:scale-95 cursor-pointer text-[11px] sm:text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-black/50"
              >
                <span>ดูสินค้าทั้งหมดในร้าน ({safeProducts.length} รายการ)</span>
                <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </button>
            </div>
          )}
        </section>

        {/* ── 7. Recent Orders Social Proof Feed (if available) ── */}
        {purchaseHistory && purchaseHistory.length > 0 && (
          <section className="p-3.5 sm:p-6 rounded-2xl sm:rounded-[28px] bg-[#0c0c12]/80 border border-white/[0.08] backdrop-blur-xl space-y-3 glass-card">
            <div className="flex items-center gap-2 text-[11px] sm:text-xs font-bold uppercase tracking-wider text-emerald-400">
              <Activity className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-400 animate-pulse" />
              <span>รายการสั่งซื้อล่าสุดในระบบ</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 sm:gap-3">
              {purchaseHistory.slice(0, 3).map((item, idx) => (
                <div
                  key={item.id || idx}
                  className="flex items-center justify-between p-2.5 sm:p-3 rounded-xl sm:rounded-2xl bg-white/[0.02] border border-white/[0.05] text-xs"
                >
                  <div className="flex items-center gap-2 sm:gap-2.5 overflow-hidden">
                    <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
                      <CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    </div>
                    <div className="overflow-hidden min-w-0">
                      <div className="text-white font-bold truncate text-[11px] sm:text-xs">
                        {item.productName || item.title || "ไอดีเกมพรีเมียม"}
                      </div>
                      <div className="text-white/40 text-[9px] sm:text-[10px] truncate">
                        {item.date || item.createdAt || "เมื่อสักครู่"}
                      </div>
                    </div>
                  </div>
                  <span className="font-mono font-bold text-amber-400 shrink-0 ml-2 text-xs">
                    ฿{Number(item.price || item.total || 0).toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          </section>
        )}

      </div>
    </div>
  );
};

export default HomeView;
