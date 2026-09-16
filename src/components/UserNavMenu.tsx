import React from "react";
import {
  User,
  Settings,
  Wallet,
  ShoppingBag,
  Gift,
  ShieldCheck,
  LogOut,
  Coins,
  ChevronDown,
  ChevronRight
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { UserPlan } from "../types";
import { getAvatarUrl } from "../lib/avatar";

interface UserNavMenuProps {
  user: any;
  userPlan: UserPlan | null;
  isAdmin: boolean;
  activeView: string;
  isOpen: boolean;
  onToggle: () => void;
  onNavigate: (view: string) => void;
  onLogout: () => void;
  onPreload?: (view: string) => void;
  variant?: "drawer" | "floating";
  className?: string;
}

export const UserNavMenu: React.FC<UserNavMenuProps> = ({
  user,
  userPlan,
  isAdmin,
  activeView,
  isOpen,
  onToggle,
  onNavigate,
  onLogout,
  onPreload,
  variant = "drawer",
  className = "",
}) => {
  const username = userPlan?.username || user?.email?.split("@")[0] || "User";
  const avatarUrl = userPlan?.avatarUrl || getAvatarUrl(
    userPlan?.username || user?.email?.split("@")[0] || user?.id || "guest"
  );
  const balance = userPlan?.balance ? Math.floor(userPlan.balance) : 0;

  const menuItems = [
    {
      id: "profile",
      label: "โปรไฟล์",
      icon: User,
    },
    {
      id: "settings",
      label: "การตั้งค่าผู้ใช้",
      icon: Settings,
    },
    {
      id: "wallet_history",
      label: "ประวัติเติมเงิน",
      icon: Wallet,
    },
    {
      id: "order_history",
      label: "ประวัติการซื้อสินค้า",
      icon: ShoppingBag,
    },
    {
      id: "random_history",
      label: "ประวัติการสุ่มสินค้า",
      icon: Gift,
    },
  ];

  return (
    <div className={`w-full flex flex-col ${className}`}>
      {/* Top Header Card: Minimal */}
      <div
        onClick={variant === "drawer" ? onToggle : undefined}
        className={`flex flex-col gap-3 rounded-xl select-none transition-colors ${
          variant === "floating"
            ? "bg-[#09090b] border-white/[0.08]"
            : "p-4 border border-white/[0.04] bg-white/[0.02] cursor-pointer hover:bg-white/[0.04]"
        }`}
      >
        {/* Only show header card in drawer mode, because floating mode in navbar already has a header */}
        {variant === "drawer" && (
          <>
            <div className="flex items-center gap-3">
              <img
                src={avatarUrl}
                alt={username}
                className="w-10 h-10 rounded-full border border-white/[0.1]"
                referrerPolicy="no-referrer"
              />
              <div className="flex flex-col flex-1 min-w-0">
                <span className="text-[14px] font-medium text-white truncate">{username}</span>
                <span className="text-[12px] text-zinc-500 truncate">{user?.email}</span>
              </div>
              <div className="w-6 h-6 flex items-center justify-center rounded-full bg-white/[0.04] text-zinc-400">
                <motion.div
                  animate={{ rotate: isOpen ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <ChevronDown className="w-4 h-4" />
                </motion.div>
              </div>
            </div>

            {/* Minimal Balance */}
            <div className="flex items-center justify-between mt-1 p-3 rounded-lg bg-black/40 border border-white/[0.05]">
               <div className="flex items-center gap-2">
                 <Coins className="w-4 h-4 text-neon-green" />
                 <span className="text-[12px] text-zinc-400">ยอดเงินคงเหลือ</span>
               </div>
               <span className="text-[14px] font-mono font-medium text-neon-green">
                 ฿{balance.toLocaleString()}
               </span>
            </div>
          </>
        )}
      </div>

      {/* Dropdown/Accordion Menu */}
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className={`flex flex-col gap-1 p-2 rounded-xl ${
              variant === "floating" ? "bg-[#09090b] border border-white/[0.08] shadow-xl" : "mt-2"
            }`}>
              {/* If floating, add a mini profile header inside the menu */}
              {variant === "floating" && (
                <div className="px-2 pb-2 mb-1 border-b border-white/[0.06] flex flex-col">
                  <span className="text-[13px] text-white font-medium truncate">{username}</span>
                  <span className="text-[11px] text-zinc-500 truncate">{user?.email}</span>
                </div>
              )}

              {menuItems.map((item) => {
                const IconComponent = item.icon;
                const isActive = activeView === item.id;

                return (
                  <button
                    key={item.id}
                    onClick={() => onNavigate(item.id)}
                    onMouseEnter={() => onPreload?.(item.id)}
                    className={`flex items-center justify-between w-full px-3 py-2 rounded-lg text-left transition-colors ${
                      isActive
                        ? "bg-[#18181b] text-white font-medium"
                        : "text-zinc-400 hover:text-white hover:bg-white/[0.04]"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <IconComponent className="w-4 h-4" />
                      <span className="text-[13px]">{item.label}</span>
                    </div>
                    {isActive && <ChevronRight className="w-4 h-4 text-zinc-500" />}
                  </button>
                );
              })}

              {isAdmin && (
                <>
                  <div className="h-px bg-white/[0.06] my-1 mx-2" />
                  <button
                    onClick={() => onNavigate("admin")}
                    className={`flex items-center justify-between w-full px-3 py-2 rounded-lg text-left transition-colors ${
                      activeView === "admin"
                        ? "bg-neon-yellow/10 text-neon-yellow font-medium"
                        : "text-neon-yellow/70 hover:text-neon-yellow hover:bg-neon-yellow/10"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <ShieldCheck className="w-4 h-4" />
                      <span className="text-[13px]">จัดการหลังบ้าน</span>
                    </div>
                    {activeView === "admin" && <ChevronRight className="w-4 h-4 text-neon-yellow/50" />}
                  </button>
                </>
              )}

              <div className="h-px bg-white/[0.06] my-1 mx-2" />

              <button
                onClick={onLogout}
                className="flex items-center justify-between w-full px-3 py-2 rounded-lg text-left transition-colors text-rose-500 hover:text-rose-400 hover:bg-rose-500/10"
              >
                <div className="flex items-center gap-3">
                  <LogOut className="w-4 h-4" />
                  <span className="text-[13px]">ออกจากระบบ</span>
                </div>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
