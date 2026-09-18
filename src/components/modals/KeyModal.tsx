import React from 'react';
import { Crown, Check, ShoppingCart, Key as KeyIcon, X } from 'lucide-react';

interface KeyModalProps {
  show: boolean;
  onClose: () => void;
  vipTab: 'key';
  redeemKey: (key: string, email: string) => void;
  userEmail?: string;
}

export const KeyModal: React.FC<KeyModalProps> = ({ show, onClose, vipTab, redeemKey, userEmail }) => {
  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-[70] font-sans animate-in zoom-in-95 duration-200 overflow-y-auto">
      <div className="bg-card border-border border border-[#3B82F6]/25 p-6 sm:p-8 max-w-lg w-full relative overflow-hidden my-8 rounded-[32px] shadow-2xl">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="text-center mb-6 relative z-10">
            <div className="w-16 h-16 bg-blue-500/15 text-blue-400 flex items-center justify-center mx-auto mb-4 border border-[#3B82F6]/25 rounded-2xl">
              <Crown className="w-8 h-8 text-blue-400" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2 tracking-tight">VIP MEMBER</h2>
            <div className="text-sm text-muted-foreground mb-6 space-y-2">
                <p>สิทธิพิเศษระดับพรีเมียม:</p>
                <ul className="text-left inline-block space-y-1">
                    <li className="flex items-center gap-2"><Check className="w-4 h-4 text-blue-500" /> ตรวจสอบไอดีไม่จำกัด (Unlimited Checks)</li>
                    <li className="flex items-center gap-2"><Check className="w-4 h-4 text-blue-500" /> Bypass DataDome ความเร็วสูง</li>
                    <li className="flex items-center gap-2"><Check className="w-4 h-4 text-blue-500" /> บันทึกประวัติการตรวจสอบย้อนหลัง</li>
                    <li className="flex items-center gap-2"><Check className="w-4 h-4 text-blue-500" /> ไม่ต้องติด Captcha (Turnstile)</li>
                </ul>
            </div>
            <a href="https://discord.gg/yourlink" target="_blank" rel="noopener noreferrer" className="mt-4 inline-flex items-center gap-2 px-6 py-2.5 bg-white/[0.06] hover:bg-[#4752C4] border border-white/[0.1] text-white text-sm font-bold transition-all hover:scale-105 rounded-full">
              <ShoppingCart className="w-4 h-4" /> ซื้อคีย์ได้ที่ Discord
            </a>
        </div>

        <div className="relative z-10">
          {vipTab === 'key' && (
              <form onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                const key = formData.get('key') as string;
                if (key) redeemKey(key, userEmail || 'ผู้ใช้งานทั่วไป');
              }} className="space-y-4">
              <div>
                  <label className="text-[11px] text-muted-foreground font-bold uppercase tracking-wider mb-2 block">คีย์สำหรับรายเดือน/รายปี (Key)</label>
                  <div className="relative">
                    <KeyIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input required name="key" type="text" className="w-full bg-[#11131a] border border-white/[0.12] py-3 pl-10 pr-4 text-sm focus:border-[#3B82F6] outline-none text-white transition-all placeholder:text-zinc-500 rounded-xl" placeholder="DEV-XXXXX-XXXXX" />
                  </div>
              </div>
              <button type="submit" className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3.5 transition-all mt-4 rounded-full shadow-lg cursor-pointer active:scale-[0.99]">
                เปิดใช้งาน
              </button>
            </form>
          )}
        </div>

        <button onClick={onClose} className="absolute top-6 right-6 text-muted-foreground hover:text-white transition-colors bg-white/[0.04] hover:bg-white/[0.1] border border-white/[0.08] p-2.5 z-20 rounded-full cursor-pointer">
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
