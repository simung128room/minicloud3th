import React, { useState, useEffect } from "react";
import {
  User,
  Search,
  Menu,
  X,
  ChevronDown,
  Sparkles,
  ShieldCheck,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { DevLogo } from "./DevLogo";
import { UserNavMenu } from "./UserNavMenu";
import { getAvatarUrl } from "../lib/avatar";

const AnimatedMenuIcon = ({ isOpen, className }: { isOpen: boolean; className?: string }) => (
  <div className={`relative flex flex-col items-center justify-center gap-[4.5px] w-[26px] h-5 ${className || ""}`}>
    <motion.span
      className="block w-[26px] h-[1.5px] bg-current rounded-full transform-gpu"
      style={{ willChange: "transform" }}
      animate={{
        y: isOpen ? 6 : 0,
        rotate: isOpen ? 45 : 0,
      }}
      transition={{ duration: 0.2, ease: "easeOut" }}
    />
    <motion.span
      className="block w-[26px] h-[1.5px] bg-current rounded-full transform-gpu origin-center"
      style={{ willChange: "transform, opacity" }}
      animate={{
        opacity: isOpen ? 0 : 1,
        scaleX: isOpen ? 0 : 1,
      }}
      transition={{ duration: 0.2, ease: "easeOut" }}
    />
    <motion.span
      className="block w-[26px] h-[1.5px] bg-current rounded-full transform-gpu"
      style={{ willChange: "transform" }}
      animate={{
        y: isOpen ? -6 : 0,
        rotate: isOpen ? -45 : 0,
      }}
      transition={{ duration: 0.2, ease: "easeOut" }}
    />
  </div>
);

interface HeaderNavbarProps {
  activeView: string;
  setActiveView: (view: string) => void;
  user: any;
  userPlan: any;
  isAdmin: boolean;
  onLogout: () => void;
  onOpenSearch: () => void;
  onOpenContact: () => void;
  isMobileMenuOpen: boolean;
  setIsMobileMenuOpen: (open: boolean) => void;
  isDesktopUserMenuOpen: boolean;
  setIsDesktopUserMenuOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isUserMenuOpen: boolean;
  setIsUserMenuOpen: React.Dispatch<React.SetStateAction<boolean>>;
  settingsImport?: () => void;
  historyImport?: () => void;
}

export const HeaderNavbar: React.FC<HeaderNavbarProps> = ({
  activeView,
  setActiveView,
  user,
  userPlan,
  isAdmin,
  onLogout,
  onOpenSearch,
  onOpenContact,
  isMobileMenuOpen,
  setIsMobileMenuOpen,
  isDesktopUserMenuOpen,
  setIsDesktopUserMenuOpen,
  isUserMenuOpen,
  setIsUserMenuOpen,
  settingsImport,
  historyImport,
}) => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isShopActive =
    activeView === "categories" ||
    activeView === "category_products" ||
    activeView === "product_detail";

  const isHistoryActive =
    activeView === "log_categories" ||
    activeView === "vip_logs" ||
    activeView === "free_logs" ||
    activeView === "logs" ||
    activeView === "history" ||
    activeView === "order_history" ||
    activeView === "random_history" ||
    activeView === "wallet_history";

  // Shortcut key '/' to open search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.key === "/" &&
        !["INPUT", "TEXTAREA"].includes((e.target as HTMLElement)?.tagName)
      ) {
        e.preventDefault();
        onOpenSearch();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onOpenSearch]);

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-[70] w-full select-none transition-all duration-300 ease-out ${
          isScrolled && !isMobileMenuOpen
            ? "pt-2.5 sm:pt-3 px-3 sm:px-6 lg:px-8 bg-transparent pointer-events-none"
            : "pt-0 px-0 bg-black/40 backdrop-blur-md border-b border-white/[0.06] pointer-events-auto"
        }`}
      >
        <div
          className={`flex items-center justify-between transition-all duration-300 ease-out mx-auto w-full pointer-events-auto ${
            isScrolled && !isMobileMenuOpen
              ? "h-[54px] sm:h-[58px] px-4 sm:px-6 lg:px-8 max-w-[1380px] rounded-full bg-black/35 backdrop-blur-2xl border border-white/[0.12] shadow-[0_16px_40px_-8px_rgba(0,0,0,0.65)] ring-1 ring-white/[0.05]"
              : "h-[62px] px-4 sm:px-6 md:px-8 lg:px-12 max-w-[1500px] bg-transparent border-transparent shadow-none rounded-none"
          }`}
        >
          {/* Left Side: Brand Logo & Title */}
          <div className="flex items-center flex-1 shrink-0">
            <div
              className="flex items-center cursor-pointer select-none group"
              onClick={() => {
                setActiveView("home");
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
            >
              <DevLogo className="h-7 md:h-7.5 w-auto text-white transition-opacity group-hover:opacity-90" />
            </div>
          </div>

        {/* Center Side: Search & Navigation */}
        <div className="hidden lg:flex items-center justify-center shrink-0">
          <div className="flex items-center gap-6 xl:gap-8">
            {/* Search trigger with slash badge (Exact look of getlayers) */}
            <button
              onClick={onOpenSearch}
              className="flex items-center justify-between w-32 px-3 py-1.5 rounded-full bg-white/[0.04] hover:bg-white/[0.08] backdrop-blur-sm border border-white/[0.08] hover:border-white/[0.18] transition-all cursor-pointer shadow-sm group"
              title="ค้นหา (กด / เพื่อเปิด)"
            >
              <div className="flex items-center gap-2">
                <Search className="w-3.5 h-3.5 text-zinc-400 group-hover:text-white transition-colors" />
                <span className="text-[13px] font-medium text-zinc-500 group-hover:text-zinc-300">Search</span>
              </div>
              <span className="text-[10px] font-mono font-medium text-zinc-500 bg-white/[0.05] border border-white/[0.05] rounded-[4px] px-1.5 py-0.5">
                /
              </span>
            </button>

            {/* Navigation Links (No wrapping pill, just text with active background) */}
            <nav className="flex items-center gap-1.5">
              {/* หน้าแรก (Active state like 'Library' in getlayers) */}
              <button
                onClick={() => {
                  setActiveView("home");
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                className={`px-3.5 py-1.5 rounded-full text-[13px] transition-all duration-150 cursor-pointer ${
                  activeView === "home"
                    ? "bg-white/[0.1] text-zinc-100 font-medium backdrop-blur-sm"
                    : "text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.04]"
                }`}
              >
                หน้าแรก
              </button>

              {/* ร้านค้า */}
              <button
                onClick={() => {
                  setActiveView("categories");
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                className={`px-3.5 py-1.5 rounded-full text-[13px] transition-all duration-150 cursor-pointer ${
                  isShopActive
                    ? "bg-white/[0.1] text-zinc-100 font-medium backdrop-blur-sm"
                    : "text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.04]"
                }`}
              >
                ร้านค้า
              </button>

              {/* เติมเงิน */}
              <button
                onClick={() => {
                  setActiveView(user ? "wallet" : "login");
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                className={`px-3.5 py-1.5 rounded-full text-[13px] transition-all duration-150 cursor-pointer ${
                  activeView === "wallet"
                    ? "bg-white/[0.1] text-zinc-100 font-medium backdrop-blur-sm"
                    : "text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.04]"
                }`}
              >
                เติมเงิน
              </button>

              {/* ประวัติ พร้อมไอคอน Sparkle คล้าย ✦ MCP ในตัวอย่าง */}
              <button
                onClick={() => {
                  setActiveView(user ? "log_categories" : "login");
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-[13px] transition-all duration-150 cursor-pointer ${
                  isHistoryActive
                    ? "bg-white/[0.1] text-zinc-100 font-medium backdrop-blur-sm"
                    : "text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.04]"
                }`}
              >
                <Sparkles className="w-3.5 h-3.5 text-zinc-400" />
                <span>ประวัติ</span>
              </button>

              {/* ติดต่อเรา */}
              <button
                onClick={onOpenContact}
                className="px-3.5 py-1.5 rounded-full text-[13px] text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.04] transition-all duration-150 cursor-pointer"
              >
                ติดต่อเรา
              </button>

              {/* แอดมิน */}
              {isAdmin && (
                <button
                  onClick={() => {
                    setActiveView("admin");
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                  className={`flex items-center gap-1 px-3.5 py-1.5 rounded-full text-[13px] font-medium transition-all duration-150 cursor-pointer ${
                    activeView === "admin"
                      ? "bg-neon-yellow/20 text-neon-yellow"
                      : "text-neon-yellow/70 hover:text-neon-yellow hover:bg-neon-yellow/10"
                  }`}
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>แอดมิน</span>
                </button>
              )}
            </nav>
          </div>
        </div>

        {/* Right Side: User Sign in / Profile & Menu */}
        <div className="hidden lg:flex items-center justify-end flex-1 shrink-0">
          <div className="flex items-center pl-6 xl:pl-8 gap-3">
            {user ? (
              <div className="relative">
                <div
                  className="flex items-center gap-2 text-[13px] text-zinc-300 hover:text-white cursor-pointer select-none transition-all group"
                  onClick={() => setIsDesktopUserMenuOpen((prev) => !prev)}
                >
                  <div className="w-6 h-6 rounded-full overflow-hidden bg-zinc-800 shrink-0 border border-white/10">
                    <img
                      src={userPlan?.avatarUrl || getAvatarUrl(
                        userPlan?.username ||
                          user?.email?.split("@")[0] ||
                          user?.id ||
                          "guest"
                      )}
                      alt="avatar"
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <span className="font-medium">
                    {userPlan?.username || user.email?.split("@")[0] || "User"}
                  </span>
                  <ChevronDown
                    className={`w-3.5 h-3.5 text-zinc-500 transition-transform duration-200 group-hover:text-zinc-300 ${
                      isDesktopUserMenuOpen ? "rotate-180" : ""
                    }`}
                  />
                </div>

              {/* Dropdown Menu */}
              <AnimatePresence>
                {isDesktopUserMenuOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-[69]"
                      onClick={() => setIsDesktopUserMenuOpen(false)}
                    />
                    <motion.div
                      initial={{ opacity: 0, scale: 0.96, y: 6 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.96, y: 6 }}
                      transition={{ duration: 0.15, ease: "easeOut" }}
                      className="absolute right-0 top-full mt-2 w-[300px] z-[70]"
                    >
                      <UserNavMenu
                        user={user}
                        userPlan={userPlan}
                        isAdmin={isAdmin}
                        activeView={activeView}
                        isOpen={true}
                        onToggle={() => {}}
                        onNavigate={(viewId) => {
                          setActiveView(viewId);
                          setIsDesktopUserMenuOpen(false);
                        }}
                        onLogout={() => {
                          onLogout();
                          setIsDesktopUserMenuOpen(false);
                        }}
                        onPreload={(viewId) => {
                          if (viewId === "settings") settingsImport?.();
                          if (viewId.includes("history")) historyImport?.();
                        }}
                        variant="floating"
                      />
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <button
              onClick={() => setActiveView("login")}
              className="flex items-center gap-2 text-xs font-medium text-zinc-300 hover:text-white transition-colors cursor-pointer py-1.5 px-3.5 rounded-full hover:bg-white/[0.06] border border-white/[0.08]"
            >
              <User className="w-3.5 h-3.5 text-zinc-400" />
              <span>Sign in</span>
            </button>
          )}

            {/* Desktop Floating Menu Toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full text-[13px] font-medium transition-all duration-150 cursor-pointer border ${
                isMobileMenuOpen
                  ? "bg-white/[0.14] text-white border-white/[0.22] shadow-sm"
                  : "bg-white/[0.04] text-zinc-300 hover:text-white hover:bg-white/[0.08] border-white/[0.08]"
              }`}
              title="เปิดเมนูลอยแบบการ์ด (Floating Menu Card)"
              aria-label="Menu"
            >
              <AnimatedMenuIcon isOpen={isMobileMenuOpen} className="w-[18px] h-3.5" />
              <span>เมนู</span>
            </button>
          </div>
        </div>

        {/* Mobile Header Actions */}
        <div className="flex lg:hidden items-center gap-1">
          <button
            onClick={onOpenSearch}
            className="p-2 flex items-center justify-center text-zinc-400 hover:text-white transition-colors cursor-pointer"
            aria-label="Search"
          >
            <Search className="w-6 h-6" strokeWidth={1.5} />
          </button>
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 flex items-center justify-center text-zinc-300 hover:text-white transition-colors cursor-pointer relative w-10 h-10"
            aria-label="Menu"
          >
            <AnimatedMenuIcon isOpen={isMobileMenuOpen} className="w-[26px] h-5" />
          </button>
        </div>
      </div>
    </header>
    {/* Fixed Header Spacer */}
    <div className="h-[60px] md:h-[62px] w-full shrink-0" aria-hidden="true" />
    </>
  );
};
