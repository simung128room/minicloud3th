import React from "react";
import {
  Home,
  ShoppingBag,
  CreditCard,
  History,
  Phone,
  LogIn,
  UserPlus,
  X,
  ShieldCheck,
  ChevronRight,
  Sparkles,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { DevLogo } from "./DevLogo";
import { UserNavMenu } from "./UserNavMenu";

interface MobileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  activeView: string;
  setActiveView: (view: string) => void;
  user: any;
  userPlan: any;
  isAdmin: boolean;
  onLogout: () => void;
  onOpenContact: () => void;
  isUserMenuOpen: boolean;
  setIsUserMenuOpen: React.Dispatch<React.SetStateAction<boolean>>;
  settingsImport?: () => void;
  historyImport?: () => void;
}

export const MobileDrawer: React.FC<MobileDrawerProps> = ({
  isOpen,
  onClose,
  activeView,
  setActiveView,
  user,
  userPlan,
  isAdmin,
  onLogout,
  onOpenContact,
  isUserMenuOpen,
  setIsUserMenuOpen,
  settingsImport,
  historyImport,
}) => {
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

  const mainNavLinks = [
    {
      id: "home",
      label: "หน้าแรก",
      icon: Home,
      isActive: activeView === "home",
      onClick: () => {
        setActiveView("home");
        onClose();
      },
    },
    {
      id: "categories",
      label: "ร้านค้า",
      icon: ShoppingBag,
      isActive: isShopActive,
      onClick: () => {
        setActiveView("categories");
        onClose();
      },
    },
    {
      id: "wallet",
      label: "เติมเงิน",
      icon: CreditCard,
      isActive: activeView === "wallet",
      onClick: () => {
        setActiveView(user ? "wallet" : "login");
        onClose();
      },
    },
    {
      id: "history",
      label: "ประวัติ",
      icon: Sparkles, // match the desktop navbar
      isActive: isHistoryActive,
      onClick: () => {
        setActiveView(user ? "log_categories" : "login");
        onClose();
      },
    },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Minimal Backdrop Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            onClick={onClose}
            className="fixed inset-0 top-[63px] bg-black/80 z-[60] lg:hidden transform-gpu"
            style={{ willChange: "opacity" }}
          />

          {/* Simple Drawer Panel */}
          <motion.div
            initial={{ y: "-100%" }}
            animate={{ y: 0 }}
            exit={{ y: "-100%" }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="fixed top-[63px] left-0 right-0 max-h-[calc(100vh-63px)] bg-[#09090b] z-[61] flex flex-col lg:hidden border-b border-white/[0.08] rounded-b-2xl overflow-hidden transform-gpu"
            style={{ willChange: "transform" }}
          >
            {/* Content (Scrollable) */}
            <div className="flex-1 overflow-y-auto no-scrollbar flex flex-col pt-2">
              {/* Minimal Navigation List */}
              <div className="px-4 py-6 flex flex-col gap-1">
                {mainNavLinks.map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.id}
                      onClick={item.onClick}
                      className={`flex items-center justify-between w-full px-4 py-3 rounded-[12px] transition-all text-left ${
                        item.isActive
                          ? "bg-[#18181b] text-zinc-100 font-medium"
                          : "text-zinc-400 hover:bg-white/[0.04] hover:text-white"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Icon className={`w-4 h-4 ${item.isActive ? "text-zinc-100" : "text-zinc-500"}`} />
                        <span className="text-[14px]">{item.label}</span>
                      </div>
                      {item.isActive && <ChevronRight className="w-4 h-4 text-zinc-500" />}
                    </button>
                  );
                })}

                <div className="h-px bg-white/[0.08] mx-2 my-2" />

                <button
                  onClick={() => {
                    onOpenContact();
                    onClose();
                  }}
                  className="flex items-center w-full px-4 py-3 rounded-[12px] text-zinc-400 hover:bg-white/[0.04] hover:text-white transition-all text-left"
                >
                  <div className="flex items-center gap-3">
                    <Phone className="w-4 h-4 text-zinc-500" />
                    <span className="text-[14px]">ติดต่อเรา</span>
                  </div>
                </button>

                {isAdmin && (
                  <button
                    onClick={() => {
                      setActiveView("admin");
                      onClose();
                    }}
                    className={`flex items-center justify-between w-full px-4 py-3 rounded-[12px] transition-all text-left mt-2 ${
                      activeView === "admin"
                        ? "bg-neon-yellow/10 text-neon-yellow font-medium"
                        : "text-neon-yellow/60 hover:bg-neon-yellow/5 hover:text-neon-yellow"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <ShieldCheck className="w-4 h-4" />
                      <span className="text-[14px]">แอดมินระบบ</span>
                    </div>
                    {activeView === "admin" && <ChevronRight className="w-4 h-4" />}
                  </button>
                )}
              </div>
            </div>

            {/* Footer Auth / Profile Area */}
            <div className="p-5 border-t border-white/[0.08] bg-[#050505] shrink-0">
              {user ? (
                <UserNavMenu
                  user={user}
                  userPlan={userPlan}
                  isAdmin={isAdmin}
                  activeView={activeView}
                  isOpen={isUserMenuOpen}
                  onToggle={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  onNavigate={(view) => {
                    setActiveView(view);
                    onClose();
                  }}
                  onLogout={() => {
                    onLogout();
                    onClose();
                  }}
                  onPreload={(viewId) => {
                    if (viewId === "settings") settingsImport?.();
                    if (viewId.includes("history")) historyImport?.();
                  }}
                  variant="drawer"
                />
              ) : (
                <div className="flex flex-col gap-2.5">
                  <button
                    onClick={() => {
                      setActiveView("login");
                      onClose();
                    }}
                    className="flex items-center justify-center gap-2 w-full bg-white text-black hover:bg-zinc-200 py-3 rounded-[10px] font-medium transition-colors text-[14px]"
                  >
                    <LogIn className="w-4 h-4" />
                    <span>เข้าสู่ระบบ</span>
                  </button>
                  <button
                    onClick={() => {
                      setActiveView("signup");
                      onClose();
                    }}
                    className="flex items-center justify-center gap-2 w-full bg-[#18181b] hover:bg-[#222226] border border-white/[0.08] text-white py-3 rounded-[10px] font-medium transition-colors text-[14px]"
                  >
                    <UserPlus className="w-4 h-4 text-zinc-400" />
                    <span>สมัครสมาชิกใหม่</span>
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
