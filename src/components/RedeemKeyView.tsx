import React, { useState } from 'react';
import { Crown, Check, ShoppingCart, Key as KeyIcon, ArrowLeft, Zap, Shield, Sparkles, ChevronRight, AlertCircle } from 'lucide-react';
import { motion } from 'motion/react';

interface RedeemKeyViewProps {
  redeemKey: (key: string, email: string) => void;
  userEmail?: string;
  isLoggedIn: boolean;
  onBack: () => void;
  onGoToStore: () => void;
  onLoginClick: () => void;
}

export const RedeemKeyView: React.FC<RedeemKeyViewProps> = ({ 
  redeemKey, 
  userEmail, 
  isLoggedIn, 
  onBack, 
  onGoToStore, 
  onLoginClick 
}) => {
  const [keyInput, setKeyInput] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (keyInput && isLoggedIn) {
      redeemKey(keyInput.trim(), userEmail || 'ผู้ใช้งานทั่วไป');
    }
  };

  return (
    <div className="min-h-[85vh] flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8 font-sans text-white">
      <motion.div 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="max-w-4xl w-full"
      >
        {/* Navigation Bar */}
        <div className="flex justify-between items-center mb-6">
          <button 
            onClick={onBack}
            className="flex items-center gap-2 text-white/60 hover:text-white transition-all font-bold px-4 py-2 bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] rounded-full text-xs sm:text-sm active:scale-95 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 text-blue-400" />
            <span>กลับหน้าหลัก</span>
          </button>
          
          <div className="flex items-center gap-2 px-3.5 py-1.5 bg-blue-500/10 border border-blue-500/20 text-blue-400 rounded-full">
            <Sparkles className="w-3.5 h-3.5" />
            <span className="text-[11px] font-mono font-bold uppercase tracking-wider">Key Activation</span>
          </div>
        </div>

        {/* Main Glassmorphic Container */}
        <div className="relative overflow-hidden rounded-[32px] border border-white/[0.1] bg-[#0c0c12]/85 backdrop-blur-2xl shadow-[0_24px_60px_-15px_rgba(0,0,0,0.8),0_0_40px_rgba(59,130,246,0.08)] glass-card glass-reflection">
          {/* Prismatic Top Edge Light */}
          <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/25 to-transparent pointer-events-none z-20" />

          <div className="grid grid-cols-1 lg:grid-cols-12 relative z-10">
            {/* Left Column: Info & Upgrade */}
            <div className="lg:col-span-5 p-6 sm:p-8 lg:p-10 border-b lg:border-b-0 lg:border-r border-white/[0.08] bg-[#08080c]/50 flex flex-col justify-between">
              <div>
                <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-cyan-500 text-white rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-blue-500/25">
                  <KeyIcon className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight mb-2">
                  เปิดใช้งาน <span className="text-blue-400">License Key</span>
                </h2>
                <p className="text-white/50 text-xs sm:text-sm leading-relaxed mb-6">
                  กรอกรหัสสินค้าหรือ License Key ที่ได้รับจากการสั่งซื้อ เพื่อเติมเครดิต หรือเปิดใช้งานผลิตภัณฑ์ทันที
                </p>

                <div className="space-y-3">
                  <div className="flex items-center gap-2.5 text-xs text-white/70">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>ตรวจสอบสถานะคีย์แบบเรียลไทม์</span>
                  </div>
                  <div className="flex items-center gap-2.5 text-xs text-white/70">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>รับสิทธิ์และอัปเดตสถานะทันทีหลัง Redeem</span>
                  </div>
                </div>
              </div>

              <div className="pt-6 mt-6 border-t border-white/[0.06]">
                <p className="text-[11px] text-white/40 font-bold uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                  <ShoppingCart className="w-3.5 h-3.5 text-blue-400" /> ยังไม่มีรหัสคีย์?
                </p>
                <button 
                  onClick={onGoToStore}
                  className="w-full flex items-center justify-between px-4 py-3 bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] hover:border-blue-500/30 text-white transition-all rounded-2xl active:scale-[0.98] group cursor-pointer"
                >
                  <span className="text-xs font-bold flex items-center gap-2">
                    เลือกดูสินค้าในร้านค้า
                  </span>
                  <ChevronRight className="w-4 h-4 text-white/40 group-hover:text-blue-400 group-hover:translate-x-1 transition-all" />
                </button>
              </div>
            </div>

            {/* Right Column: Key Input Form */}
            <div className="lg:col-span-7 p-6 sm:p-8 lg:p-12 flex flex-col justify-center bg-[#0c0c12]/60">
              <div className="max-w-md mx-auto w-full">
                <div className="mb-6">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/[0.04] border border-white/[0.08] text-[10px] font-bold uppercase tracking-widest text-white/50 mb-3">
                    <Zap className="w-3 h-3 text-yellow-400" /> Instant Activation
                  </span>
                  <h3 className="text-xl sm:text-2xl font-black text-white mb-1">Redeem Code</h3>
                  <p className="text-white/40 text-xs font-medium">วางรหัส License Key 16 หลักของคุณลงในช่องด้านล่าง</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <div className={`relative transition-all duration-300 rounded-2xl border ${
                      isFocused || keyInput 
                        ? 'border-blue-500 bg-blue-500/[0.04] shadow-[0_0_20px_rgba(59,130,246,0.15)]' 
                        : 'border-white/[0.1] bg-white/[0.02] hover:border-white/20'
                    } ${!isLoggedIn ? 'opacity-50 select-none' : ''}`}>
                      <div className="flex items-center gap-3 px-4 sm:px-5">
                        <KeyIcon className={`w-5 h-5 transition-colors duration-300 ${isFocused || keyInput ? 'text-blue-400' : 'text-white/30'}`} />
                        <input 
                          required
                          disabled={!isLoggedIn}
                          value={keyInput}
                          onChange={(e) => setKeyInput(e.target.value.toUpperCase())}
                          onFocus={() => setIsFocused(true)}
                          onBlur={() => setIsFocused(false)}
                          type="text" 
                          className="w-full bg-transparent py-4 text-white font-mono text-base sm:text-lg focus:outline-none placeholder:text-white/20 tracking-wider disabled:bg-transparent" 
                          placeholder="XXXX-XXXX-XXXX-XXXX" 
                        />
                      </div>
                    </div>

                    {!isLoggedIn && (
                      <div className="mt-4 p-4 rounded-2xl bg-white/[0.03] border border-white/[0.08] text-center">
                        <p className="text-xs font-bold text-white/60 mb-2">กรุณาเข้าสู่ระบบก่อนทำการ Redeem คีย์</p>
                        <button 
                          type="button" 
                          onClick={onLoginClick} 
                          className="px-5 py-2 bg-gradient-to-r from-blue-600 to-cyan-500 text-white text-xs font-black rounded-full shadow-lg shadow-blue-500/20 active:scale-95 cursor-pointer"
                        >
                          เข้าสู่ระบบ / สมัครสมาชิก
                        </button>
                      </div>
                    )}
                  </div>

                  <button 
                    type="submit" 
                    disabled={!keyInput || !isLoggedIn}
                    className="w-full py-4 rounded-full bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-black text-xs sm:text-sm uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-blue-600/30 hover:shadow-blue-500/50 disabled:opacity-40 disabled:cursor-not-allowed active:scale-[0.98] transition-all cursor-pointer"
                  >
                    <span>เปิดใช้งานทันที</span>
                    <Zap className="w-4 h-4 fill-white flex-shrink-0" />
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
