import React from "react";
import { ArrowRight, ShoppingBag, Zap, ShieldCheck, Sparkles, Flame, Coins, History, Headphones } from "lucide-react";
import RotatingText from "./RotatingText";

interface HeroSectionProps {
  onShopClick: () => void;
  onTopupClick: () => void;
  onHistoryClick?: () => void;
  onContactClick?: () => void;
  totalStock?: number;
  totalMembers?: number;
  totalSales?: number;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onShopClick,
  onTopupClick,
  onHistoryClick,
  onContactClick,
  totalStock = 0,
  totalMembers = 0,
  totalSales = 0,
}) => {
  const brandLogos = [
    "VALORANT",
    "ROV / ARENA OF VALOR",
    "STEAM",
    "GENSHIN IMPACT",
    "MINECRAFT",
    "NETFLIX PREMIUM",
    "DISCORD NITRO",
    "SPOTIFY PREMIUM",
    "ROBLOX",
    "EA SPORTS FC",
  ];

  return (
    <section className="min-h-[85vh] flex items-center justify-center px-4 pt-28 pb-16 relative">
      <div className="max-w-5xl mx-auto text-center relative z-10 animate-fade-in-hero">
        {/* Badge */}
        <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-xs sm:text-sm font-medium mb-6 animate-fade-in-badge shadow-lg">
          <span className="w-2 h-2 bg-emerald-400 rounded-full mr-2 animate-pulse shadow-[0_0_8px_rgba(52,211,153,0.8)]"></span>
          <span>ระบบอัตโนมัติ 24 ชั่วโมง • พร้อมจัดส่งทันที</span>
        </div>

        {/* Main Heading */}
        <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tight text-white mb-6 animate-fade-in-heading leading-[1.15]">
          <span>ศูนย์รวมบริการและไอดี</span>
          <br />
          <span className="inline-flex items-center justify-center flex-wrap gap-2.5 mt-2 sm:mt-4">
            <span className="text-white">ระดับ</span>
            <RotatingText
              texts={[
                "PREMIUM",
                "อัตโนมัติ 100%",
                "ปลอดภัยสูงสุด",
                "ราคาถูกที่สุด",
                "คุณภาพแท้",
              ]}
              mainClassName="px-3 sm:px-4 py-1 sm:py-1.5 bg-white text-black font-black overflow-hidden rounded-2xl shadow-[0_10px_30px_rgba(255,255,255,0.25)]"
              staggerFrom="last"
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "-120%" }}
              staggerDuration={0.025}
              splitLevelClassName="overflow-hidden pb-0.5"
              transition={{ type: "spring", damping: 28, stiffness: 350 }}
              rotationInterval={2600}
            />
          </span>
        </h1>

        {/* Subheading */}
        <p className="text-sm sm:text-lg md:text-xl text-white/75 max-w-2xl mx-auto mb-8 sm:mb-10 leading-relaxed font-light px-2 animate-fade-in-subheading">
          เลือกซื้อไอดีเกม บัญชีสตรีมมิ่ง และบริการดิจิทัลคุณภาพสูง จัดส่งรวดเร็วผ่านระบบอัตโนมัติ
          รับประกันทุกชิ้น ปลอดภัย 100%
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 mb-12 sm:mb-16 animate-fade-in-buttons">
          <button
            onClick={onShopClick}
            className="w-full sm:w-auto bg-white text-black rounded-full px-8 py-3.5 text-sm sm:text-base font-bold transition-all duration-300 hover:bg-gray-100 hover:scale-105 hover:shadow-[0_10px_30px_rgba(255,255,255,0.3)] group cursor-pointer flex items-center justify-center gap-2"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>เลือกซื้อสินค้าทั้งหมด</span>
            <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
          </button>

          <button
            onClick={onTopupClick}
            className="w-full sm:w-auto rounded-full px-8 py-3.5 text-sm sm:text-base font-semibold border border-white/20 hover:border-white/40 bg-white/5 hover:bg-white/15 backdrop-blur-md text-white transition-all duration-200 hover:scale-105 group cursor-pointer flex items-center justify-center gap-2 shadow-sm"
          >
            <Zap className="w-4 h-4 text-amber-400" />
            <span>เติมเงินวอลเล็ททันที</span>
          </button>
        </div>

        {/* Trust Indicators / Game Platforms Marquee */}
        <div className="text-center px-4 overflow-hidden animate-fade-in-trust">
          <p className="text-xs uppercase tracking-widest text-white/40 font-semibold mb-6">
            รองรับเกมและแพลตฟอร์มชั้นนำระดับโลก
          </p>
          <div className="relative overflow-hidden w-full max-w-4xl mx-auto py-2">
            {/* Edge fades */}
            <div className="absolute left-0 top-0 w-12 sm:w-20 h-full bg-gradient-to-r from-black via-black/80 to-transparent z-10 pointer-events-none" />
            <div className="absolute right-0 top-0 w-12 sm:w-20 h-full bg-gradient-to-l from-black via-black/80 to-transparent z-10 pointer-events-none" />

            <div className="flex items-center gap-8 sm:gap-12 opacity-60 hover:opacity-100 transition-opacity duration-500 animate-slide-left whitespace-nowrap">
              {brandLogos.concat(brandLogos).map((brand, idx) => (
                <div
                  key={idx}
                  className="text-xs sm:text-sm font-bold tracking-wider text-white/70 hover:text-white transition-colors select-none flex items-center gap-3"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-white/30" />
                  <span>{brand}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
