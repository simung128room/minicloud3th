import React, { useState, useEffect, useRef } from "react";
import { ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { getAvatarUrl } from "../lib/avatar";

export interface MobileDrawerProps {
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
  onOpenSearch?: () => void;
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
  const [isShopExpanded, setIsShopExpanded] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // Lock background scroll when open
  useEffect(() => {
    if (isOpen) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [isOpen]);

  const username = userPlan?.username || user?.email?.split("@")[0] || "ผู้ใช้งาน";
  const avatarUrl =
    userPlan?.avatarUrl ||
    getAvatarUrl(
      userPlan?.username || user?.email?.split("@")[0] || user?.id || "guest"
    );
  const balance = userPlan?.balance ? Math.floor(userPlan.balance) : 0;
  const planLabel = isAdmin ? "ผู้ดูแลระบบ" : user ? "สมาชิกทั่วไป" : "ผู้เยี่ยมชม";

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

  const userSubMenuItems = [
    {
      id: "profile",
      label: "โปรไฟล์ของฉัน",
      onClick: () => {
        setActiveView("profile");
        window.scrollTo({ top: 0, behavior: "smooth" });
        onClose();
      },
    },
    {
      id: "settings",
      label: "การตั้งค่าบัญชี",
      onClick: () => {
        settingsImport?.();
        setActiveView("settings");
        window.scrollTo({ top: 0, behavior: "smooth" });
        onClose();
      },
    },
    {
      id: "order_history",
      label: "ประวัติการสั่งซื้อ",
      onClick: () => {
        historyImport?.();
        setActiveView("order_history");
        window.scrollTo({ top: 0, behavior: "smooth" });
        onClose();
      },
    },
    {
      id: "wallet_history",
      label: "ประวัติการเติมเงิน",
      onClick: () => {
        historyImport?.();
        setActiveView("wallet_history");
        window.scrollTo({ top: 0, behavior: "smooth" });
        onClose();
      },
    },
    {
      id: "random_history",
      label: "ประวัติการสุ่มสินค้า",
      onClick: () => {
        historyImport?.();
        setActiveView("random_history");
        window.scrollTo({ top: 0, behavior: "smooth" });
        onClose();
      },
    },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop Blur Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.16 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[68] cursor-pointer"
            aria-hidden="true"
          />

          {/* Floating Menu Container: จัดวางให้พอดีกับแถบนำทางและทุกขนาดหน้าจอ */}
          <div className="fixed top-[60px] sm:top-[66px] z-[69] pointer-events-none inset-x-3 sm:inset-x-auto sm:right-5 md:right-7 lg:right-10 w-auto sm:w-[360px] md:w-[380px] max-w-[calc(100vw-24px)] sm:max-w-[400px]">
            <motion.div
              ref={cardRef}
              initial={{ opacity: 0, scale: 0.97, y: -8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.97, y: -6 }}
              transition={{
                type: "spring",
                damping: 28,
                stiffness: 380,
                mass: 0.7,
              }}
              className="pointer-events-auto flex flex-col gap-2 max-h-[calc(100dvh-76px)] sm:max-h-[calc(100dvh-84px)] overflow-y-auto overscroll-contain pb-2 custom-scrollbar focus:outline-none"
            >
              {/* 1. Main Navigation Card (แถบเมนูนำทาง - จัดวางพอดีตัว ไม่มีไอคอน) */}
              <div className="relative w-full rounded-[28px] bg-[#101116]/95 backdrop-blur-2xl border border-white/[0.1] shadow-[0_20px_45px_-10px_rgba(0,0,0,0.9),0_6px_18px_-3px_rgba(0,0,0,0.8),inset_0_1px_0_0_rgba(255,255,255,0.12)] overflow-hidden p-3 sm:p-3.5 flex flex-col transition-all">
                {/* Specular Light Bar */}
                <div className="absolute top-0 inset-x-6 sm:inset-x-8 h-[1px] bg-gradient-to-r from-transparent via-white/25 to-transparent pointer-events-none" />

                <nav className="flex flex-col gap-0.5">
                  {/* หน้าแรก */}
                  <button
                    onClick={() => {
                      setActiveView("home");
                      window.scrollTo({ top: 0, behavior: "smooth" });
                      onClose();
                    }}
                    className={`flex items-center justify-between w-full px-4 py-2.5 rounded-full text-left text-[14px] sm:text-[14.5px] font-medium transition-all cursor-pointer select-none active:scale-[0.99] min-h-[42px] ${
                      activeView === "home"
                        ? "bg-white/[0.1] text-white shadow-sm"
                        : "text-zinc-300 hover:text-white hover:bg-white/[0.05]"
                    }`}
                  >
                    <span>หน้าแรก</span>
                  </button>

                  {/* ร้านค้า */}
                  <div>
                    <button
                      onClick={() => setIsShopExpanded(!isShopExpanded)}
                      className={`flex items-center justify-between w-full px-4 py-2.5 rounded-full text-left text-[14px] sm:text-[14.5px] font-medium transition-all cursor-pointer select-none active:scale-[0.99] min-h-[42px] ${
                        isShopActive
                          ? "bg-white/[0.1] text-white shadow-sm"
                          : "text-zinc-300 hover:text-white hover:bg-white/[0.05]"
                      }`}
                      aria-expanded={isShopExpanded}
                    >
                      <span>ร้านค้า</span>
                      <motion.div
                        animate={{ rotate: isShopExpanded ? 180 : 0 }}
                        transition={{ duration: 0.18 }}
                      >
                        <ChevronDown className="w-4 h-4 text-zinc-400" />
                      </motion.div>
                    </button>

                    <AnimatePresence>
                      {isShopExpanded && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.18 }}
                          className="overflow-hidden pl-3 pr-1 py-1 flex flex-col gap-1 border-l border-white/[0.08] ml-3 my-1"
                        >
                          <button
                            onClick={() => {
                              setActiveView("categories");
                              window.scrollTo({ top: 0, behavior: "smooth" });
                              onClose();
                            }}
                            className="text-left px-3.5 py-2 rounded-full text-[13px] text-zinc-400 hover:text-white hover:bg-white/[0.05] transition-colors cursor-pointer min-h-[36px] flex items-center"
                          >
                            หมวดหมู่สินค้าทั้งหมด
                          </button>
                          <button
                            onClick={() => {
                              setActiveView("categories");
                              window.scrollTo({ top: 0, behavior: "smooth" });
                              onClose();
                            }}
                            className="text-left px-3.5 py-2 rounded-full text-[13px] text-zinc-400 hover:text-white hover:bg-white/[0.05] transition-colors cursor-pointer min-h-[36px] flex items-center"
                          >
                            บัตรเติมเงิน & แพ็กเกจเกม
                          </button>
                          <button
                            onClick={() => {
                              setActiveView("categories");
                              window.scrollTo({ top: 0, behavior: "smooth" });
                              onClose();
                            }}
                            className="text-left px-3.5 py-2 rounded-full text-[13px] text-zinc-400 hover:text-white hover:bg-white/[0.05] transition-colors cursor-pointer min-h-[36px] flex items-center"
                          >
                            ไอดีเกม & รหัสสุ่มพรีเมียม
                          </button>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* เติมเงิน */}
                  <button
                    onClick={() => {
                      setActiveView(user ? "wallet" : "login");
                      window.scrollTo({ top: 0, behavior: "smooth" });
                      onClose();
                    }}
                    className={`flex items-center justify-between w-full px-4 py-2.5 rounded-full text-left text-[14px] sm:text-[14.5px] font-medium transition-all cursor-pointer select-none active:scale-[0.99] min-h-[42px] ${
                      activeView === "wallet"
                        ? "bg-white/[0.1] text-white shadow-sm"
                        : "text-zinc-300 hover:text-white hover:bg-white/[0.05]"
                    }`}
                  >
                    <span>เติมเงิน</span>
                  </button>

                  {/* ประวัติ (ไม่มีไอคอน) */}
                  <button
                    onClick={() => {
                      setActiveView(user ? "log_categories" : "login");
                      window.scrollTo({ top: 0, behavior: "smooth" });
                      onClose();
                    }}
                    className={`flex items-center justify-between w-full px-4 py-2.5 rounded-full text-left text-[14px] sm:text-[14.5px] font-medium transition-all cursor-pointer select-none active:scale-[0.99] min-h-[42px] ${
                      isHistoryActive
                        ? "bg-white/[0.1] text-white shadow-sm"
                        : "text-zinc-300 hover:text-white hover:bg-white/[0.05]"
                    }`}
                  >
                    <span>ประวัติ</span>
                  </button>

                  {/* ติดต่อเรา */}
                  <button
                    onClick={() => {
                      onOpenContact();
                      onClose();
                    }}
                    className="flex items-center justify-between w-full px-4 py-2.5 rounded-full text-left text-[14px] sm:text-[14.5px] font-medium text-zinc-300 hover:text-white hover:bg-white/[0.05] transition-all cursor-pointer select-none active:scale-[0.99] min-h-[42px]"
                  >
                    <span>ติดต่อเรา</span>
                  </button>

                  {/* แอดมินระบบ (ไม่มีไอคอน) */}
                  {isAdmin && (
                    <button
                      onClick={() => {
                        setActiveView("admin");
                        window.scrollTo({ top: 0, behavior: "smooth" });
                        onClose();
                      }}
                      className={`flex items-center justify-between w-full px-4 py-2.5 rounded-full text-left text-[14px] sm:text-[14.5px] font-medium transition-all cursor-pointer select-none mt-0.5 active:scale-[0.99] min-h-[42px] ${
                        activeView === "admin"
                          ? "bg-neon-yellow/15 text-neon-yellow"
                          : "text-neon-yellow/85 hover:bg-neon-yellow/10"
                      }`}
                    >
                      <span>แอดมินระบบ</span>
                    </button>
                  )}
                </nav>
              </div>

              {/* 2. User Account / Login Card (ใส่แทนอันล่าง - พอดีแถบ ไม่มีไอคอน) */}
              <div className="w-full rounded-[28px] bg-[#101116]/95 backdrop-blur-2xl border border-white/[0.1] shadow-xl p-3.5 flex flex-col transition-all">
                {user ? (
                  /* User Profile Details & Actions */
                  <div className="flex flex-col gap-1">
                    <div
                      onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                      className="flex items-center justify-between p-2 rounded-full hover:bg-white/[0.05] transition-colors cursor-pointer select-none group min-h-[42px]"
                    >
                      <div className="flex items-center gap-2.5 min-w-0 flex-1">
                        <div className="w-9 h-9 rounded-full overflow-hidden bg-zinc-800 shrink-0 border border-white/10 flex items-center justify-center">
                          <img
                            src={avatarUrl}
                            alt={username}
                            className="w-full h-full object-cover"
                            referrerPolicy="no-referrer"
                          />
                        </div>
                        <div className="flex flex-col min-w-0">
                          <span className="text-[14px] font-semibold text-white truncate">
                            {username}
                          </span>
                          <span className="text-[12px] text-zinc-400 truncate">
                            ยอดเงิน ฿{balance.toLocaleString()} • {planLabel}
                          </span>
                        </div>
                      </div>
                      <motion.div
                        animate={{ rotate: isUserMenuOpen ? 180 : 0 }}
                        transition={{ duration: 0.18 }}
                        className="text-zinc-400 group-hover:text-white p-1"
                      >
                        <ChevronDown className="w-4 h-4" />
                      </motion.div>
                    </div>

                    {/* Expandable User Account Links (ไม่มีไอคอน) */}
                    <AnimatePresence>
                      {isUserMenuOpen && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.2 }}
                          className="overflow-hidden pl-3 pr-1 py-1 flex flex-col gap-0.5 border-l border-white/[0.08] ml-4 mt-1"
                        >
                          {userSubMenuItems.map((item) => (
                            <button
                              key={item.id}
                              onClick={item.onClick}
                              className="text-left px-3.5 py-2 rounded-full text-[13px] text-zinc-400 hover:text-white hover:bg-white/[0.05] transition-colors cursor-pointer min-h-[34px] flex items-center"
                            >
                              <span>{item.label}</span>
                            </button>
                          ))}
                          <button
                            onClick={() => {
                              onLogout();
                              onClose();
                            }}
                            className="text-left px-3.5 py-2 rounded-full text-[13px] text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 transition-colors cursor-pointer min-h-[34px] flex items-center mt-0.5"
                          >
                            <span>ออกจากระบบ</span>
                          </button>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ) : (
                  /* Guest Login / Sign Up Card (จัดวางพอดีตัว ไม่มีไอคอน) */
                  <div className="flex flex-col gap-2 p-1">
                    <div className="flex flex-col px-1">
                      <span className="text-[14px] font-semibold text-white">
                        บัญชีผู้ใช้งาน
                      </span>
                      <span className="text-[12px] text-zinc-400 mt-0.5">
                        เข้าสู่ระบบเพื่อจัดการคำสั่งซื้อและยอดเงินของคุณ
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 mt-1">
                      <button
                        onClick={() => {
                          setActiveView("login");
                          window.scrollTo({ top: 0, behavior: "smooth" });
                          onClose();
                        }}
                        className="flex items-center justify-center bg-white text-black hover:bg-zinc-200 py-2 px-3.5 rounded-full text-[13.5px] font-semibold transition-colors cursor-pointer shadow min-h-[40px] active:scale-[0.98]"
                      >
                        <span>เข้าสู่ระบบ</span>
                      </button>
                      <button
                        onClick={() => {
                          setActiveView("signup");
                          window.scrollTo({ top: 0, behavior: "smooth" });
                          onClose();
                        }}
                        className="flex items-center justify-center bg-white/[0.06] hover:bg-white/[0.12] border border-white/[0.1] text-white py-2 px-3.5 rounded-full text-[13.5px] font-medium transition-colors cursor-pointer min-h-[40px] active:scale-[0.98]"
                      >
                        <span>สมัครสมาชิก</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};
