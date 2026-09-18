import React, { useState, useEffect, useRef } from "react";
import {
  Menu,
  X,
  ArrowRight,
  Search,
  ShoppingCart,
  Wallet,
  History,
  ShieldCheck,
  User,
  LogOut,
  Zap,
  LayoutDashboard,
  Coins,
  ChevronDown,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { DevLogo } from "../DevLogo";
import { getAvatarUrl } from "../../lib/avatar";

interface GlassmorphismNavProps {
  activeView: string;
  setActiveView: (view: any) => void;
  user: any;
  userPlan?: any;
  isAdmin?: boolean;
  onLogout: () => void;
  onOpenSearch: () => void;
  onOpenContact?: () => void;
}

export const GlassmorphismNav: React.FC<GlassmorphismNavProps> = ({
  activeView,
  setActiveView,
  user,
  userPlan,
  isAdmin = false,
  onLogout,
  onOpenSearch,
  onOpenContact,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [hasLoaded, setHasLoaded] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const lastScrollY = useRef(0);
  const userMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setHasLoaded(true);
    }, 100);

    const controlNavbar = () => {
      if (typeof window !== "undefined") {
        const currentScrollY = window.scrollY;
        if (currentScrollY > 60) {
          if (
            currentScrollY > lastScrollY.current &&
            currentScrollY - lastScrollY.current > 5
          ) {
            setIsVisible(false);
            setIsUserMenuOpen(false);
          } else if (lastScrollY.current - currentScrollY > 5) {
            setIsVisible(true);
          }
        } else {
          setIsVisible(true);
        }
        lastScrollY.current = currentScrollY;
      }
    };

    window.addEventListener("scroll", controlNavbar, { passive: true });
    return () => {
      window.removeEventListener("scroll", controlNavbar);
      clearTimeout(timer);
    };
  }, []);

  // Close menus on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        userMenuRef.current &&
        !userMenuRef.current.contains(e.target as Node)
      ) {
        setIsUserMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const navItems = [
    { name: "หน้าแรก", view: "home" },
    { name: "ร้านค้า", view: "categories" },
    { name: "เติมเงิน", view: "wallet" },
    { name: "สุ่มของรางวัล", view: "redeem" },
    { name: "ประวัติการซื้อ", view: "history" },
    { name: "ติดต่อเรา", view: "contact" },
  ];

  return (
    <>
      <nav
        className={`fixed top-4 md:top-6 left-1/2 -translate-x-1/2 z-50 transition-all duration-500 w-[95vw] max-w-5xl pointer-events-auto ${
          isVisible
            ? "translate-y-0 opacity-100"
            : "-translate-y-24 opacity-0 pointer-events-none"
        } ${hasLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
      >
        <div className="bg-black/60 backdrop-blur-xl border border-white/15 rounded-full px-4 py-2.5 md:px-6 md:py-2.5 shadow-[0_20px_50px_rgba(0,0,0,0.8)] ring-1 ring-white/10">
          <div className="flex items-center justify-between gap-2 md:gap-6">
            {/* Logo */}
            <button
              onClick={() => {
                setActiveView("home");
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              className="flex items-center gap-2 hover:scale-105 transition-transform duration-200 cursor-pointer shrink-0 group select-none"
            >
              <DevLogo className="h-7 md:h-8 w-auto text-white transition-opacity group-hover:opacity-90" />
            </button>

            {/* Desktop Navigation Links */}
            <div className="hidden lg:flex items-center space-x-1 xl:space-x-2">
              {navItems.map((item) => {
                const isActive = activeView === item.view;
                return (
                  <button
                    key={item.name}
                    onClick={() => {
                      setActiveView(item.view);
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-wide transition-all duration-200 cursor-pointer ${
                      isActive
                        ? "bg-white text-black shadow-md shadow-white/20 font-bold"
                        : "text-white/70 hover:text-white hover:bg-white/10"
                    }`}
                  >
                    {item.name}
                  </button>
                );
              })}
            </div>

            {/* Right side items: Search & User CTA */}
            <div className="flex items-center gap-2.5 shrink-0">
              {/* Search button */}
              <button
                onClick={onOpenSearch}
                className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/25 text-white/70 hover:text-white transition-all text-xs cursor-pointer shadow-sm"
                title="ค้นหา (กด /)"
              >
                <Search className="w-3.5 h-3.5 text-white/60" />
                <span className="hidden md:inline text-[11px] font-mono bg-white/10 px-1.5 py-0.5 rounded text-white/80">
                  /
                </span>
              </button>

              {/* User Profile or Login Button */}
              {user ? (
                <div className="relative" ref={userMenuRef}>
                  <button
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="flex items-center gap-2 bg-white/10 hover:bg-white/15 border border-white/20 text-white rounded-full px-3 py-1.5 transition-all duration-200 hover:scale-105 cursor-pointer"
                  >
                    <img
                      src={getAvatarUrl(user.avatar || user.user_metadata?.avatar_url || user.id)}
                      alt="avatar"
                      className="w-6 h-6 rounded-full object-cover border border-white/20"
                    />
                    <span className="text-xs font-semibold max-w-[100px] truncate hidden md:inline">
                      {user.name || user.email?.split("@")[0] || "ผู้ใช้"}
                    </span>
                    <span className="text-emerald-400 font-mono font-bold text-xs hidden sm:inline">
                      ฿{(user.balance ?? 0).toLocaleString()}
                    </span>
                    <ChevronDown className="w-3.5 h-3.5 text-white/60" />
                  </button>

                  {/* Dropdown Menu */}
                  <AnimatePresence>
                    {isUserMenuOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 8, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 8, scale: 0.95 }}
                        transition={{ duration: 0.15 }}
                        className="absolute right-0 mt-3 w-56 bg-black/90 backdrop-blur-2xl border border-white/15 rounded-2xl p-2 shadow-2xl z-50 ring-1 ring-white/10 text-white"
                      >
                        <div className="px-3 py-2 border-b border-white/10 mb-1">
                          <p className="text-xs text-white/50">เข้าสู่ระบบด้วย</p>
                          <p className="text-sm font-bold text-white truncate">
                            {user.name || user.email}
                          </p>
                          <div className="flex items-center justify-between mt-1 text-xs">
                            <span className="text-white/60">ยอดเงินคงเหลือ:</span>
                            <span className="font-mono font-bold text-emerald-400">
                              ฿{(user.balance ?? 0).toLocaleString()}
                            </span>
                          </div>
                        </div>

                        <button
                          onClick={() => {
                            setActiveView("profile");
                            setIsUserMenuOpen(false);
                          }}
                          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-white/80 hover:text-white hover:bg-white/10 transition-all text-left cursor-pointer"
                        >
                          <User className="w-4 h-4 text-white/60" />
                          <span>ข้อมูลบัญชีส่วนตัว</span>
                        </button>

                        <button
                          onClick={() => {
                            setActiveView("wallet");
                            setIsUserMenuOpen(false);
                          }}
                          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-white/80 hover:text-white hover:bg-white/10 transition-all text-left cursor-pointer"
                        >
                          <Coins className="w-4 h-4 text-amber-400" />
                          <span>เติมเงินเครดิต</span>
                        </button>

                        <button
                          onClick={() => {
                            setActiveView("history");
                            setIsUserMenuOpen(false);
                          }}
                          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-white/80 hover:text-white hover:bg-white/10 transition-all text-left cursor-pointer"
                        >
                          <History className="w-4 h-4 text-blue-400" />
                          <span>ประวัติการสั่งซื้อ</span>
                        </button>

                        {isAdmin && (
                          <button
                            onClick={() => {
                              setActiveView("admin");
                              setIsUserMenuOpen(false);
                            }}
                            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-purple-300 hover:text-purple-200 hover:bg-purple-500/20 transition-all text-left cursor-pointer"
                          >
                            <LayoutDashboard className="w-4 h-4 text-purple-400" />
                            <span>แผงควบคุมระบบ (Admin)</span>
                          </button>
                        )}

                        <div className="h-px bg-white/10 my-1" />

                        <button
                          onClick={() => {
                            setIsUserMenuOpen(false);
                            onLogout();
                          }}
                          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-red-400 hover:text-red-300 hover:bg-red-500/15 transition-all text-left cursor-pointer"
                        >
                          <LogOut className="w-4 h-4" />
                          <span>ออกจากระบบ</span>
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <button
                  onClick={() => setActiveView("login")}
                  className="relative bg-white hover:bg-gray-100 text-black font-semibold text-xs px-4 md:px-5 py-2 rounded-full flex items-center gap-1.5 transition-all duration-300 hover:scale-105 hover:shadow-lg shadow-white/20 cursor-pointer group shrink-0"
                >
                  <span>เข้าสู่ระบบ</span>
                  <ArrowRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-0.5" />
                </button>
              )}

              {/* Mobile Menu Toggle Button */}
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="lg:hidden p-1.5 rounded-full text-white/80 hover:text-white hover:bg-white/10 transition-all cursor-pointer"
                aria-label="Toggle Menu"
              >
                {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu Drawer */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.96 }}
              transition={{ duration: 0.2 }}
              className="lg:hidden mt-2 w-[95vw] max-w-5xl mx-auto"
            >
              <div className="bg-black/90 backdrop-blur-2xl border border-white/20 rounded-3xl p-4 shadow-2xl ring-1 ring-white/10">
                <div className="flex flex-col space-y-1">
                  {navItems.map((item) => {
                    const isActive = activeView === item.view;
                    return (
                      <button
                        key={item.name}
                        onClick={() => {
                          setActiveView(item.view);
                          setIsOpen(false);
                          window.scrollTo({ top: 0, behavior: "smooth" });
                        }}
                        className={`text-left px-4 py-3 rounded-2xl text-sm font-semibold transition-all duration-200 cursor-pointer flex items-center justify-between ${
                          isActive
                            ? "bg-white text-black font-bold"
                            : "text-white/80 hover:text-white hover:bg-white/10"
                        }`}
                      >
                        <span>{item.name}</span>
                        {isActive && <span className="w-1.5 h-1.5 rounded-full bg-black" />}
                      </button>
                    );
                  })}

                  <div className="h-px bg-white/10 my-2" />

                  {/* Search in mobile */}
                  <button
                    onClick={() => {
                      setIsOpen(false);
                      onOpenSearch();
                    }}
                    className="flex items-center gap-2.5 px-4 py-3 rounded-2xl text-sm font-semibold text-white/80 hover:text-white hover:bg-white/10 transition-all text-left cursor-pointer"
                  >
                    <Search className="w-4 h-4 text-white/60" />
                    <span>ค้นหาสินค้าและบริการ</span>
                  </button>

                  {user ? (
                    <>
                      <button
                        onClick={() => {
                          setIsOpen(false);
                          setActiveView("wallet");
                        }}
                        className="flex items-center justify-between px-4 py-3 rounded-2xl text-sm font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20"
                      >
                        <span className="flex items-center gap-2">
                          <Coins className="w-4 h-4" />
                          <span>ยอดเงินคงเหลือ</span>
                        </span>
                        <span className="font-mono font-bold">฿{(user.balance ?? 0).toLocaleString()}</span>
                      </button>

                      {isAdmin && (
                        <button
                          onClick={() => {
                            setIsOpen(false);
                            setActiveView("admin");
                          }}
                          className="flex items-center gap-2.5 px-4 py-3 rounded-2xl text-sm font-semibold text-purple-300 bg-purple-500/10 border border-purple-500/20"
                        >
                          <LayoutDashboard className="w-4 h-4" />
                          <span>แผงควบคุมระบบ (Admin)</span>
                        </button>
                      )}

                      <button
                        onClick={() => {
                          setIsOpen(false);
                          onLogout();
                        }}
                        className="flex items-center gap-2.5 px-4 py-3 rounded-2xl text-sm font-semibold text-red-400 hover:bg-red-500/15"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>ออกจากระบบ</span>
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => {
                        setIsOpen(false);
                        setActiveView("login");
                      }}
                      className="bg-white text-black font-bold text-center py-3 rounded-2xl hover:bg-gray-100 transition-all mt-2 shadow-lg"
                    >
                      เข้าสู่ระบบ / สมัครสมาชิก
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </>
  );
};

export default GlassmorphismNav;
