import React, { useState } from 'react';
import { Gift, Landmark, AlertTriangle, Copy, ShieldCheck, ArrowLeft, Sparkles, CheckCircle2, QrCode } from 'lucide-react';
import Swal from 'sweetalert2';
import axios from 'axios';
import { UserPlan } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { AnimatedScroll } from './AnimatedScroll';

interface WalletViewProps {
  userPlan: UserPlan | null;
  setUserPlan: React.Dispatch<React.SetStateAction<UserPlan | null>>;
  onTopupSuccess?: (entry: any) => void;
  userId?: string | null;
}

type TopupView = 'main' | 'truemoney' | 'bank';

export const WalletView: React.FC<WalletViewProps> = ({ userPlan, setUserPlan, onTopupSuccess, userId }) => {
  const [activeView, setActiveView] = useState<TopupView>('main');
  const [truemoneyLink, setTruemoneyLink] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  const handleTruemoneyTopup = async (e: React.FormEvent) => {
    e.preventDefault();

    const trimmedLink = truemoneyLink.trim();
    let voucherCode = '';
    
    if (trimmedLink.length >= 10) {
      if (/^[a-zA-Z0-9]+$/.test(trimmedLink)) {
        voucherCode = trimmedLink;
      } else if (trimmedLink.includes('truemoney.com') || trimmedLink.includes('?v=')) {
        voucherCode = trimmedLink;
      }
    }

    if (!voucherCode) {
      Swal.fire({
        title: 'ข้อมูลไม่ถูกต้อง',
        text: 'รูปแบบลิงก์ซองอั่งเปาไม่ถูกต้อง กรุณาใช้ลิงก์ที่ถูกต้องหรือกรอกเฉพาะรหัสอั่งเปา',
        icon: 'error',
        background: '#0c0c12',
        color: '#fff',
        confirmButtonColor: '#2563eb'
      });
      return;
    }

    Swal.fire({
      title: 'กำลังตรวจสอบ',
      text: 'ระบบกำลังตรวจสอบซองอั่งเปาของคุณ...',
      icon: 'info',
      background: '#0c0c12',
      color: '#fff',
      showConfirmButton: false,
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });

    try {
      const response = await axios.post('/api/topup/truemoney', {
        voucherCode,
        uid: userId
      });

      if (response.data.success) {
        const amount = response.data.amount;
        
        if (setUserPlan) {
          setUserPlan((prev: UserPlan | null) => prev ? ({
            ...prev,
            balance: (prev.balance || 0) + amount
          }) : {
            username: 'User',
            isPremium: false,
            premiumExpireDate: null,
            balance: amount
          });
        }
        
        try {
          const topup = response.data.topup;
          const historyEntry = {
            id: topup ? topup.id : Math.random().toString(36).substr(2, 9),
            username: topup?.userId || userPlan?.username || 'Unknown',
            type: 'topup',
            method: 'ซองของขวัญ (Gift Link)',
            amount: topup ? topup.amount : amount,
            status: 'success',
            date: topup ? topup.date : new Date().toISOString(),
            billNumber: topup ? 'T-' + topup.id.split('-')[0].toUpperCase() : 'T-' + Math.floor(Math.random()*1000000).toString().padStart(6, '0'),
            money: topup ? topup.amount : amount,
            title: topup ? topup.title : 'เติมเงินสำเร็จ',
            image: topup ? topup.image : 'https://images.unsplash.com/photo-1613243555988-441166d4d6fd?auto=format&fit=crop&w=800&q=80'
          };
          if (onTopupSuccess) onTopupSuccess(historyEntry);
        } catch(e) {}

        Swal.fire({
          title: 'เติมเงินสำเร็จ',
          text: `คุณได้รับเครดิต ${amount} บาท เรียบร้อยแล้ว`,
          icon: 'success',
          background: '#0c0c12',
          color: '#fff',
          confirmButtonColor: '#2563eb'
        });
        setTruemoneyLink('');
        setActiveView('main');
      } else {
        Swal.fire({
          title: 'เกิดข้อผิดพลาด',
          text: response.data.error || 'ไม่สามารถรับอั่งเปาได้',
          icon: 'error',
          background: '#0c0c12',
          color: '#fff',
          confirmButtonColor: '#2563eb'
        });
      }
    } catch (err: any) {
      Swal.fire({
        title: 'เกิดข้อผิดพลาด',
        text: err.response?.data?.error || err.message || 'เครือข่ายขัดข้อง',
        icon: 'error',
        background: '#0c0c12',
        color: '#fff',
        confirmButtonColor: '#2563eb'
      });
    }
  };

  const handleSlipUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    Swal.fire({
      title: 'กำลังตรวจสอบสลิป',
      text: 'ระบบกำลังวิเคราะห์ภาพและสแกน QR Code ตลอด 24 ชม...',
      icon: 'info',
      background: '#0c0c12',
      color: '#fff',
      showConfirmButton: false,
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });

    const reader = new FileReader();
    reader.onload = async (event) => {
      const result = event.target?.result as string;
      const imageBase64 = result.split(',')[1];
      
      try {
        const response = await axios.post('/api/topup/slip', { imageBase64, uid: userId });
        
        if (response.data.success) {
          const amount = response.data.amount;
          if (setUserPlan) {
            setUserPlan((prev: UserPlan | null) => prev ? ({
              ...prev,
              balance: (prev.balance || 0) + amount
            }) : {
              username: 'User',
              isPremium: false,
              premiumExpireDate: null,
              balance: amount
            });
          }
          
          try {
            const topup = response.data.topup;
            const historyEntry = {
              id: topup ? topup.id : Math.random().toString(36).substr(2, 9),
              type: 'topup',
              method: 'สแกนสลิป (SlipOK)',
              amount: topup ? topup.amount : amount,
              username: topup?.userId || userPlan?.username || 'Unknown',
              status: 'success',
              date: topup ? topup.date : new Date().toISOString(),
              billNumber: topup ? 'T-' + topup.id.split('-')[0].toUpperCase() : 'T-' + Math.floor(Math.random()*1000000).toString().padStart(6, '0'),
              money: topup ? topup.amount : amount,
              title: topup ? topup.title : 'เติมเงินสำเร็จ',
              image: topup ? topup.image : 'https://images.unsplash.com/photo-1613243555988-441166d4d6fd?auto=format&fit=crop&w=800&q=80'
            };
            if (onTopupSuccess) onTopupSuccess(historyEntry);
          } catch(e) {}
          
          Swal.fire({
            title: 'เติมเงินสำเร็จ',
            text: `ตรวจสอบสลิปสำเร็จ! คุณได้รับเครดิต ${amount} บาท`,
            icon: 'success',
            background: '#0c0c12',
            color: '#fff',
            confirmButtonColor: '#2563eb'
          });
          setActiveView('main');
        } else {
          Swal.fire({
            title: 'ตรวจสอบสลิปไม่สำเร็จ',
            text: response.data.error || 'สลิปไม่ถูกต้อง หรือถูกใช้งานไปแล้ว',
            icon: 'error',
            background: '#0c0c12',
            color: '#fff',
            confirmButtonColor: '#2563eb'
          });
        }
      } catch (err: any) {
        Swal.fire({
          title: 'เกิดข้อผิดพลาด',
          text: err.response?.data?.error || err.message || 'เครือข่ายขัดข้อง',
          icon: 'error',
          background: '#0c0c12',
          color: '#fff',
          confirmButtonColor: '#2563eb'
        });
      } finally {
        setIsUploading(false);
      }
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  return (
    <AnimatedScroll direction="up" hideOnScroll={true}>
      <div className="w-full max-w-5xl mx-auto p-4 sm:p-6 lg:p-8 font-sans text-white min-h-[85vh]">
        {activeView === 'main' && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            {/* Header section */}
            <div className="mb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold uppercase tracking-wider mb-2">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Payment Gateway</span>
                </div>
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight">
                  ช่องทางการเติมเงิน
                </h1>
                <p className="text-white/50 text-xs sm:text-sm font-medium mt-1">
                  เลือกช่องทางการเติมเงินที่คุณสะดวกที่สุด ระบบปรับยอดเงินคงเหลืออัตโนมัติ 24 ชม.
                </p>
              </div>

              {/* Current balance chip */}
              <div className="bg-[#0c0c12]/85 border border-white/[0.1] px-5 py-3 rounded-2xl flex items-center gap-3 glass-card glass-reflection">
                <span className="text-xs font-bold text-white/40 uppercase tracking-wider">ยอดเงินปัจจุบัน</span>
                <span className="text-xl sm:text-2xl font-black font-mono text-emerald-400">
                  ฿{(userPlan?.balance || 0).toLocaleString()}
                </span>
              </div>
            </div>

            {/* Selection Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
              {/* Card 1: TrueMoney Voucher */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.05 }}
                whileHover={{ y: -5 }}
                whileTap={{ scale: 0.98 }}
                className="bg-[#0c0c12]/85 backdrop-blur-2xl border border-white/[0.08] hover:border-orange-500/30 p-8 sm:p-10 rounded-[32px] flex flex-col items-center text-center transition-all group relative overflow-hidden cursor-pointer shadow-2xl glass-card glass-reflection"
                onClick={() => setActiveView('truemoney')}
              >
                {/* Prismatic Top Edge */}
                <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-orange-400/30 to-transparent pointer-events-none" />

                <div className="w-20 h-20 sm:w-24 sm:h-24 mb-6 transition-transform duration-500 group-hover:scale-110 flex items-center justify-center rounded-3xl bg-gradient-to-br from-orange-500 to-amber-600 shadow-xl shadow-orange-500/25 text-white">
                  <Gift className="w-10 h-10 sm:w-12 sm:h-12" />
                </div>
                <h2 className="text-xl sm:text-2xl font-black text-white mb-2 group-hover:text-orange-400 transition-colors">
                  TrueMoney (ซองของขวัญ)
                </h2>
                <p className="text-white/50 text-xs sm:text-sm mb-6 leading-relaxed px-2 font-medium">
                  เติมเงินผ่านลิงก์ซองของขวัญ TrueMoney Wallet สะดวก รวดเร็ว ตรวจสอบยอดเงินอัตโนมัติทันที
                </p>
                <div className="mt-auto px-5 py-2 rounded-full bg-white/[0.04] border border-white/[0.08] text-xs text-orange-400 font-mono font-bold uppercase tracking-wider group-hover:bg-orange-500/10 group-hover:border-orange-500/30 transition-all shadow-sm">
                  GIFT LINK TOPUP
                </div>
              </motion.div>

              {/* Card 2: Bank Slip Scanner */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.1 }}
                whileHover={{ y: -5 }}
                whileTap={{ scale: 0.98 }}
                className="bg-[#0c0c12]/85 backdrop-blur-2xl border border-white/[0.08] hover:border-emerald-500/30 p-8 sm:p-10 rounded-[32px] flex flex-col items-center text-center transition-all group relative overflow-hidden cursor-pointer shadow-2xl glass-card glass-reflection"
                onClick={() => setActiveView('bank')}
              >
                {/* Prismatic Top Edge */}
                <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-emerald-400/30 to-transparent pointer-events-none" />

                <div className="w-20 h-20 sm:w-24 sm:h-24 mb-6 transition-transform duration-500 group-hover:scale-110 flex items-center justify-center rounded-3xl bg-gradient-to-br from-emerald-600 to-teal-700 shadow-xl shadow-emerald-500/25 text-white">
                  <Landmark className="w-10 h-10 sm:w-12 sm:h-12" />
                </div>
                <h2 className="text-xl sm:text-2xl font-black text-white mb-2 group-hover:text-emerald-400 transition-colors">
                  โอนผ่านธนาคาร (สแกนสลิป)
                </h2>
                <p className="text-white/50 text-xs sm:text-sm mb-6 leading-relaxed px-2 font-medium">
                  โอนเงินเข้าบัญชีธนาคารแล้วอัปโหลดสลิป ระบบตรวจสอบความถูกต้องและเติมเงินให้อัตโนมัติ
                </p>
                <div className="mt-auto px-5 py-2 rounded-full bg-white/[0.04] border border-white/[0.08] text-xs text-emerald-400 font-mono font-bold uppercase tracking-wider group-hover:bg-emerald-500/10 group-hover:border-emerald-500/30 transition-all shadow-sm">
                  BANK SLIP SCANNER
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}

        {/* View 2: TrueMoney Voucher Form */}
        {activeView === 'truemoney' && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-xl mx-auto bg-[#0c0c12]/85 backdrop-blur-2xl border border-white/[0.1] p-6 sm:p-10 rounded-[32px] shadow-2xl relative glass-card glass-reflection"
          >
            {/* Prismatic Edge */}
            <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-orange-400/30 to-transparent pointer-events-none" />

            <button 
              onClick={() => setActiveView('main')}
              className="mb-6 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/[0.04] border border-white/[0.08] text-white/70 hover:text-white hover:bg-white/[0.08] transition-all font-bold text-xs cursor-pointer shadow-sm active:scale-95"
            >
              <ArrowLeft className="w-3.5 h-3.5 text-orange-400" /> ย้อนกลับ
            </button>
            
            <div className="flex flex-col items-center text-center mb-6">
              <div className="w-20 h-20 mb-4 flex items-center justify-center rounded-3xl bg-gradient-to-br from-orange-500 to-amber-600 shadow-lg shadow-orange-500/20 text-white">
                <Gift className="w-10 h-10" />
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-white">เติมเงินผ่านซองของขวัญ</h2>
              <p className="text-white/50 text-xs sm:text-sm mt-1 font-medium">คัดลอกลิงก์ซองของขวัญจากแอป TrueMoney Wallet แล้ววางที่นี่</p>
            </div>

            <div className="space-y-4">
              <div className="bg-white/[0.03] border border-white/[0.08] p-4 rounded-2xl flex items-center gap-3 text-white/80">
                <ShieldCheck className="w-5 h-5 text-orange-400 shrink-0" />
                <span className="text-xs sm:text-sm font-bold tracking-wider">ระบบตรวจสอบและเติมเครดิตให้อัตโนมัติ 100%</span>
              </div>

              <form onSubmit={handleTruemoneyTopup} className="mt-6 space-y-4">
                <div>
                  <label className="block text-xs font-bold text-white/50 uppercase tracking-wider mb-2 ml-1">
                    ลิงก์ซองอั่งเปา TrueMoney (Gift Link)
                  </label>
                  <input
                    type="text"
                    value={truemoneyLink}
                    onChange={(e) => setTruemoneyLink(e.target.value)}
                    placeholder="https://gift.truemoney.com/campaign/?v=..."
                    className="w-full bg-white/[0.03] border border-white/[0.1] rounded-2xl p-4 text-white text-sm placeholder:text-white/20 focus:outline-none focus:border-orange-500/60 transition-all font-sans font-medium shadow-inner"
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-4 rounded-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-400 hover:to-amber-400 text-white font-black text-xs sm:text-sm tracking-wider uppercase transition-all duration-200 shadow-lg shadow-orange-500/25 cursor-pointer active:scale-[0.98]"
                >
                  ยืนยันการเติมเงิน
                </button>
              </form>
            </div>
          </motion.div>
        )}

        {/* View 3: Bank Transfer & Slip Scanner */}
        {activeView === 'bank' && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-xl mx-auto bg-[#0c0c12]/85 backdrop-blur-2xl border border-white/[0.1] p-6 sm:p-10 rounded-[32px] shadow-2xl relative glass-card glass-reflection"
          >
            {/* Prismatic Edge */}
            <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-emerald-400/30 to-transparent pointer-events-none" />

            <button 
              onClick={() => setActiveView('main')}
              className="mb-6 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/[0.04] border border-white/[0.08] text-white/70 hover:text-white hover:bg-white/[0.08] transition-all font-bold text-xs cursor-pointer shadow-sm active:scale-95"
            >
              <ArrowLeft className="w-3.5 h-3.5 text-emerald-400" /> ย้อนกลับ
            </button>
            
            <div className="space-y-6">
              {/* Bank Account Info Card */}
              <div className="bg-white/[0.02] border border-white/[0.08] p-6 rounded-[26px] text-center space-y-4">
                <div className="flex bg-[#00A82D]/10 border border-[#00A82D]/30 text-[#00A82D] px-5 py-2 gap-2 items-center w-fit mx-auto rounded-full font-bold text-xs select-none">
                  <Landmark className="w-4 h-4" />
                  <span>ธนาคารกสิกรไทย (K-BANK)</span>
                </div>
                
                <div className="pt-2">
                  <p className="text-[11px] text-white/40 font-bold uppercase tracking-widest mb-1.5">Account Number / เลขที่บัญชี</p>
                  <div className="flex items-center justify-center gap-3">
                    <span className="text-2xl sm:text-3xl font-mono font-black text-white tracking-widest select-all">
                      196-3-87032-5
                    </span>
                    <button 
                      onClick={() => {
                        navigator.clipboard.writeText('1963870325');
                        Swal.fire({ toast: true, position: 'top-end', icon: 'success', title: 'คัดลอกเลขบัญชีแล้ว', showConfirmButton: false, timer: 1500, background: '#0c0c12', color: '#fff' });
                      }}
                      className="p-3 rounded-xl bg-white/[0.04] border border-white/[0.1] hover:border-emerald-500/40 text-emerald-400 hover:text-white transition-all active:scale-95 cursor-pointer"
                      title="คัดลอกเลขบัญชี"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="pt-4 border-t border-white/[0.06] flex flex-col items-center">
                  <p className="text-[11px] text-white/40 font-bold uppercase tracking-widest mb-1">Account Name / ชื่อบัญชี</p>
                  <p className="text-lg sm:text-xl font-black text-white">นาย กรวิชญ์</p>
                </div>
              </div>

              {/* Sandbox info badge */}
              <div className="bg-emerald-500/[0.05] border border-emerald-500/20 p-4 rounded-2xl text-center select-none shadow-inner">
                <p className="text-xs text-emerald-400 font-bold tracking-wide mb-1 flex items-center justify-center gap-1.5 uppercase">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>ระบบตรวจสอบสลิปอัตโนมัติ (Sandbox Enabled)</span>
                </p>
                <p className="text-[11px] text-white/60 leading-relaxed font-medium">
                  ท่านสามารถโอนเงินจริงหรือทดสอบอัปโหลดรูปภาพ ระบบจะตรวจเช็คยอดเงินและปรับให้อัตโนมัติ
                </p>
              </div>

              {/* Upload Dropzone */}
              <div className="pt-1 flex flex-col items-center w-full">
                <label className="flex flex-col items-center justify-center w-full py-8 sm:py-10 rounded-[28px] bg-white/[0.02] hover:bg-white/[0.04] transition-all border-2 border-dashed border-white/[0.1] hover:border-emerald-500/40 cursor-pointer group active:scale-[0.99] relative shadow-lg">
                  <input type="file" className="hidden" accept="image/png, image/jpeg, image/webp" onChange={handleSlipUpload} disabled={isUploading} />
                  <div className="w-16 h-16 sm:w-20 sm:h-20 mb-4 group-hover:scale-105 transition-transform flex items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-700 shadow-xl shadow-emerald-500/20 text-white">
                    <QrCode className="w-8 h-8 sm:w-10 sm:h-10" />
                  </div>
                  <div className="text-center px-4">
                    <span className="text-base sm:text-lg font-black text-white block leading-snug">
                      {isUploading ? 'กำลังอัปโหลดและตรวจสอบสลิป...' : 'อัปโหลดสลิปโอนเงินของคุณ'}
                    </span>
                    <span className="text-xs text-white/40 font-bold mt-1.5 block">
                      แตะเพื่อเลือกรูปภาพ หรือลากไฟล์มาวาง (PNG, JPG)
                    </span>
                  </div>
                </label>
              </div>

              <div className="pt-2 flex items-center justify-center gap-2 select-none opacity-50">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span className="text-[10px] font-bold text-white/70 uppercase tracking-widest">
                  Secure Real-Time Automatic Slip Scanning System
                </span>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </AnimatedScroll>
  );
};
