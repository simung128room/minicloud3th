import React from "react";
import {
  ShieldCheck,
  Zap,
  Clock,
  Heart,
  MessageSquare,
  Globe,
  ExternalLink,
  ChevronRight,
  Sparkles,
} from "lucide-react";
import { DevLogo } from "../DevLogo";

interface FooterProps {
  setActiveView: (view: string) => void;
  siteSettings?: any;
}

export const Footer: React.FC<FooterProps> = ({ setActiveView, siteSettings }) => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative w-full border-t border-white/10 bg-black/60 backdrop-blur-xl mt-12 sm:mt-20 pt-12 sm:pt-16 pb-10 sm:pb-12 overflow-hidden select-none">
      {/* Radial glow highlight at top center */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 max-w-3xl h-[1px] bg-gradient-to-r from-transparent via-white/30 to-transparent blur-sm" />
      <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-32 bg-white/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12 mb-10 sm:mb-12">
          {/* Brand & Description */}
          <div className="space-y-3 sm:space-y-4">
            <div
              onClick={() => {
                setActiveView("home");
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              className="cursor-pointer inline-block"
            >
              <DevLogo className="h-7 sm:h-8 w-auto text-white" />
            </div>
            <p className="text-xs sm:text-sm text-white/60 leading-relaxed font-light">
              ศูนย์รวมจำหน่ายไอดีเกมและบริการดิจิทัลชั้นนำ ระบบอัตโนมัติ 24 ชั่วโมง จัดส่งทันที ปลอดภัย เชื่อถือได้ 100%
            </p>
            {/* 24/7 Status pill */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[11px] sm:text-xs font-semibold">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>ระบบเปิดให้บริการปกติ 24/7</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-widest text-white/40">เมนูลัด</h4>
            <ul className="space-y-2 text-xs sm:text-sm">
              <li>
                <button
                  onClick={() => {
                    setActiveView("home");
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                  className="text-white/70 hover:text-white transition-colors cursor-pointer"
                >
                  หน้าแรก
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setActiveView("categories");
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                  className="text-white/70 hover:text-white transition-colors cursor-pointer"
                >
                  หมวดหมู่สินค้าทั้งหมด
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setActiveView("wallet");
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                  className="text-white/70 hover:text-white transition-colors cursor-pointer"
                >
                  เติมเงินกระเป๋า (Wallet)
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setActiveView("redeem");
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                  className="text-white/70 hover:text-white transition-colors cursor-pointer"
                >
                  กล่องสุ่มรางวัล & โค้ด
                </button>
              </li>
            </ul>
          </div>

          {/* Customer Service & History */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-widest text-white/40">บริการลูกค้า</h4>
            <ul className="space-y-2 text-xs sm:text-sm">
              <li>
                <button
                  onClick={() => {
                    setActiveView("history");
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                  className="text-white/70 hover:text-white transition-colors cursor-pointer"
                >
                  ตรวจสอบประวัติการซื้อ
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setActiveView("contact");
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                  className="text-white/70 hover:text-white transition-colors cursor-pointer"
                >
                  แจ้งปัญหา & ติดต่อแอดมิน
                </button>
              </li>
              <li>
                <span className="text-white/40">เงื่อนไขการรับประกันสินค้า</span>
              </li>
              <li>
                <span className="text-white/40">นโยบายความเป็นส่วนตัว</span>
              </li>
            </ul>
          </div>

          {/* Social & Contact */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-widest text-white/40">ช่องทางติดต่อ</h4>
            <p className="text-xs text-white/60 leading-relaxed">
              มีคำถามหรือข้อสงสัย ทีมงานพร้อมช่วยเหลือตลอด 24 ชั่วโมง
            </p>
            <div className="flex flex-wrap gap-2 pt-1">
              <button
                onClick={() => setActiveView("contact")}
                className="px-3.5 py-1.5 rounded-full bg-white/5 hover:bg-white/15 border border-white/10 hover:border-white/25 text-white text-xs font-medium transition-all cursor-pointer flex items-center gap-1.5"
              >
                <MessageSquare className="w-3.5 h-3.5 text-blue-400" />
                <span>แชทติดต่อเรา</span>
              </button>
              <a
                href={siteSettings?.discord_link || "https://discord.gg"}
                target="_blank"
                rel="noreferrer"
                className="px-3.5 py-1.5 rounded-full bg-white/5 hover:bg-white/15 border border-white/10 hover:border-white/25 text-white text-xs font-medium transition-all cursor-pointer flex items-center gap-1.5"
              >
                <Globe className="w-3.5 h-3.5 text-indigo-400" />
                <span>Discord Community</span>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom copyright & attribution */}
        <div className="pt-6 sm:pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4 text-xs text-white/40 text-center sm:text-left">
          <p>© {currentYear} DEV STORE. All rights reserved.</p>
          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 text-[11px] sm:text-xs">
            <span>Fast Automated Delivery</span>
            <span>•</span>
            <span>Secure Encryption</span>
            <span>•</span>
            <span>24/7 Support</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
