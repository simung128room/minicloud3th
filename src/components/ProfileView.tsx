import React, { useState } from 'react';
import { User, Wallet, Shield, Mail, Calendar, CreditCard, ChevronRight, LogOut, Package, History, Key, Copy, Link2, Check, RefreshCw, Smartphone, ShieldCheck, Sparkles, Camera } from 'lucide-react';
import Swal from 'sweetalert2';
import { UserPlan } from '../types';
import { User as SupabaseUser } from '@supabase/supabase-js';
import { getAvatarUrl } from '../lib/avatar';
import { getUserRank } from '../lib/rank';
import { AnimatedScroll } from './AnimatedScroll';
import axios from 'axios';
import { motion } from 'motion/react';

interface ProfileViewProps {
  user: SupabaseUser | null;
  userPlan: UserPlan | null;
  setUserPlan: (plan: UserPlan) => void;
  clientIp: string | null;
  setActiveView: (view: any) => void;
  handleLogout: () => void;
  purchaseHistory?: any[];
  usedKeysHistory?: any[];
}

export const ProfileView: React.FC<ProfileViewProps> = ({
  user, userPlan, setUserPlan, clientIp, setActiveView, handleLogout,
  purchaseHistory = [], usedKeysHistory = []
}) => {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const rawRole = userPlan?.role;
  let role = '';
  if (rawRole && ['admin', 'owner'].includes(rawRole.toLowerCase())) {
     role = rawRole.charAt(0).toUpperCase() + rawRole.slice(1).toLowerCase();
  } else {
     role = getUserRank(userPlan, user);
  }
  const isAdminOrOwner = ['admin', 'owner'].includes(rawRole?.toLowerCase() || '');
  const balance = userPlan?.balance || 0;
  const fullName = userPlan?.fullName || '-';
  const username = userPlan?.username || user?.email?.split('@')[0] || '';
  const email = user?.email || 'เข้าสู่ระบบด้วยคีย์ (Anonymous)';
  const registeredAt = userPlan?.registeredAt ? new Date(userPlan.registeredAt).toLocaleDateString('th-TH') : new Date().toLocaleDateString('th-TH');

  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Check file size (limit to ~2MB for base64 storage)
    if (file.size > 2 * 1024 * 1024) {
      Swal.fire({
        icon: 'error',
        title: 'ไฟล์ใหญ่เกินไป',
        text: 'กรุณาอัปโหลดรูปภาพขนาดไม่เกิน 2MB',
        background: '#121212',
        color: '#fff',
      });
      return;
    }

    setIsUploadingAvatar(true);
    
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      if (userPlan) {
        setUserPlan({ ...userPlan, avatarUrl: base64String });
        // Simulate a small delay for better UX
        setTimeout(() => setIsUploadingAvatar(false), 500);
      }
    };
    reader.readAsDataURL(file);
  };

  const renderHistoryItem = (item: any, type: 'purchase' | 'key') => {
    const timestamp = item.timestamp || item.usedAt;
    const dateStr = timestamp ? new Date(timestamp).toLocaleString('th-TH') : '-';
    const displayId = (item.id || 'N/A').substring(0, 8).toUpperCase();
    
    return (
      <div key={item.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-3.5 bg-white/[0.02] border border-white/[0.08] hover:border-white/20 transition-all rounded-2xl gap-3">
        <div className="flex flex-col gap-1">
          <span className="text-xs sm:text-sm font-bold text-white tracking-wide truncate max-w-[200px] sm:max-w-[360px]">
            {type === 'purchase' ? item.productName : `เปิดใช้งานคีย์: ${item.key || 'ไม่ระบุ'}`}
          </span>
          <div className="flex flex-wrap items-center gap-2 text-[11px] text-white/40">
            <span className="font-mono bg-white/[0.04] border border-white/[0.08] px-2 py-0.5 rounded text-blue-400 font-bold">#{displayId}</span>
            <span>{dateStr}</span>
          </div>
        </div>
        <div className="flex items-center gap-3 self-end sm:self-auto">
          {type === 'purchase' ? (
            <span className="font-mono font-black text-rose-400 text-xs sm:text-sm">
              -{(item.price || 0).toLocaleString()} ฿
            </span>
          ) : (
            <span className="font-bold text-emerald-400 text-[10px] px-2.5 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full uppercase">
              SUCCESS
            </span>
          )}
        </div>
      </div>
    );
  };

  return (
    <AnimatedScroll direction="up" hideOnScroll={true}>
      <div className="font-sans px-4 pb-12 w-full max-w-5xl mx-auto">
        {/* Main Glassmorphic Profile Card */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
          className="relative overflow-hidden rounded-[32px] border border-white/[0.1] bg-[#0c0c12]/85 backdrop-blur-2xl shadow-[0_24px_60px_-15px_rgba(0,0,0,0.8),0_0_40px_rgba(59,130,246,0.08)] flex flex-col md:flex-row mt-6 glass-card glass-reflection"
        >
          {/* Prismatic Top Edge Light */}
          <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/25 to-transparent pointer-events-none z-20" />
          
          {/* Left Side: Avatar & Wallet Status */}
          <div className="md:w-1/3 bg-[#08080c]/60 p-6 sm:p-8 flex flex-col items-center border-b md:border-b-0 md:border-r border-white/[0.08] relative overflow-hidden">
            <div className="absolute -top-12 -right-12 w-40 h-40 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
            
            <div className="w-24 h-24 p-1 mb-2 relative z-10 rounded-full overflow-hidden shadow-xl border border-white/20 bg-gradient-to-tr from-blue-600 to-cyan-400 group">
              <label className="cursor-pointer w-full h-full block relative" title="คลิกเพื่อเปลี่ยนรูปโปรไฟล์">
                <input 
                  type="file" 
                  accept="image/*"
                  onChange={handleAvatarUpload}
                  className="hidden" 
                  disabled={isUploadingAvatar}
                />
                <img 
                  loading="lazy" 
                  src={userPlan?.avatarUrl || getAvatarUrl(username || user?.email?.split('@')[0] || user?.id || 'guest')} 
                  alt="avatar" 
                  className={`w-full h-full object-cover rounded-full transition-transform duration-300 group-hover:scale-110 ${isUploadingAvatar ? 'opacity-50 blur-sm' : ''}`}
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity duration-300 rounded-full">
                  {isUploadingAvatar ? (
                    <RefreshCw className="w-6 h-6 text-white animate-spin" />
                  ) : (
                    <Camera className="w-6 h-6 text-white" />
                  )}
                </div>
              </label>
            </div>
            <div className="text-[10px] text-white/40 mb-3 z-10 tracking-wider">คลิกที่รูปเพื่อแก้ไข</div>
            
            <h3 className="text-lg sm:text-xl font-black text-white mb-1.5 text-center truncate w-full px-2 z-10">{username}</h3>
            
            <span className={`text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full mb-6 z-10 border ${
              isAdminOrOwner 
                ? "text-amber-400 bg-amber-500/10 border-amber-500/30 shadow-sm shadow-amber-500/20" 
                : "text-blue-400 bg-blue-500/10 border-blue-500/30"
            }`}>
              {role}
            </span>
            
            {/* Wallet Box */}
            <div className="w-full bg-white/[0.03] border border-white/[0.08] p-5 rounded-2xl flex flex-col items-center relative overflow-hidden shadow-inner">
              <div className="flex items-center gap-2 mb-1.5">
                <Wallet className="w-4 h-4 text-blue-400" />
                <span className="text-white/50 text-[10px] font-bold uppercase tracking-wider">ยอดเงินคงเหลือ</span>
              </div>
              <div className="text-3xl sm:text-4xl font-black text-white mb-3 tracking-tight font-mono select-none">
                <span className="text-sm font-bold text-blue-400 mr-1 font-sans">฿</span>
                {Math.floor(balance).toLocaleString()}
              </div>
              <button 
                onClick={() => setActiveView('wallet')}
                className="w-full bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white py-3 rounded-xl text-xs font-black uppercase tracking-wider transition-all duration-150 cursor-pointer shadow-lg shadow-blue-600/25 active:scale-95 flex items-center justify-center gap-1.5"
              >
                <Wallet className="w-3.5 h-3.5" />
                <span>+ เติมเงินทันที</span>
              </button>
            </div>
          </div>

          {/* Right Side: Details, Forms, Quick Menus */}
          <div className="md:w-2/3 p-6 sm:p-8 lg:p-10">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg sm:text-xl font-black text-white flex items-center gap-2.5">
                <ShieldCheck className="w-5 h-5 text-blue-400"/> ข้อมูลส่วนตัว
              </h2>
            </div>

            {/* Profile Update Form */}
            <form onSubmit={async (e) => {
              e.preventDefault();
              const formData = new FormData(e.currentTarget);
              const newFullName = formData.get('fullName') as string;
              const newUsername = formData.get('username') as string;
              
              if (!user) {
                Swal.fire({ icon: 'error', title: 'ไม่พบข้อมูลผู้ใช้', text: 'กรุณาเข้าสู่ระบบก่อนอัพเดทโปรไฟล์', background: '#0c0c12', color: '#fff' });
                return;
              }

              Swal.fire({
                title: 'กำลังบันทึกข้อมูล...',
                allowOutsideClick: false,
                background: '#0c0c12',
                color: '#fff',
                didOpen: () => { Swal.showLoading(); }
              });

              try {
                // Here we would typically send both to backend. We'll update the state.
                await axios.post(`/api/users/${user.id}`, { fullName: newFullName, username: newUsername });
                const newPlan = { 
                  ...userPlan, 
                  fullName: newFullName, 
                  username: newUsername || userPlan?.username || username, 
                  isPremium: userPlan?.isPremium || false, 
                  premiumExpireDate: userPlan?.premiumExpireDate || null 
                };
                setUserPlan(newPlan);
                if (clientIp) localStorage.setItem(`checker_userplan_${clientIp}`, JSON.stringify(newPlan));
                Swal.fire({ icon: 'success', title: 'อัปเดตข้อมูลสำเร็จ', timer: 1500, showConfirmButton: false, background: '#0c0c12', color: '#fff' });
              } catch (err: any) {
                Swal.fire({
                  icon: 'error',
                  title: 'อัปเดตไม่สำเร็จ',
                  text: err.response?.data?.error || err.message || 'เกิดข้อผิดพลาดในการบันทึกข้อมูล',
                  background: '#0c0c12',
                  color: '#fff'
                });
              }
            }} className="space-y-4 mb-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-[11px] text-white/50 font-bold uppercase tracking-wider mb-2 block ml-1">ชื่อที่แสดง (Display Name)</label>
                  <input 
                    name="username" 
                    type="text" 
                    defaultValue={username}
                    placeholder="ระบุชื่อที่ต้องการให้แสดง"
                    className="w-full bg-white/[0.03] border border-white/[0.08] focus:border-blue-500 rounded-xl py-3 px-4 text-xs sm:text-sm text-white outline-none transition-all placeholder:text-white/20 font-medium" 
                  />
                </div>
                <div>
                  <label className="text-[11px] text-white/50 font-bold uppercase tracking-wider mb-2 block ml-1">ชื่อ-นามสกุลจริง</label>
                  <input 
                    name="fullName" 
                    type="text" 
                    defaultValue={fullName !== '-' ? fullName : ''}
                    placeholder="ระบุชื่อ-นามสกุลจริงของคุณ"
                    className="w-full bg-white/[0.03] border border-white/[0.08] focus:border-blue-500 rounded-xl py-3 px-4 text-xs sm:text-sm text-white outline-none transition-all placeholder:text-white/20 font-medium" 
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-[11px] text-white/50 font-bold uppercase tracking-wider mb-2 block ml-1">สมัครสมาชิกเมื่อ</label>
                  <div className="w-full bg-white/[0.02] border border-white/[0.06] rounded-xl py-3 px-4 text-xs sm:text-sm text-white/50 cursor-not-allowed flex items-center gap-2.5 font-medium">
                    <Calendar className="w-4 h-4 text-white/30 shrink-0" /> {registeredAt}
                  </div>
                </div>
                <div>
                  <label className="text-[11px] text-white/50 font-bold uppercase tracking-wider mb-2 block ml-1">อีเมลผู้ใช้งาน</label>
                  <div className="w-full bg-white/[0.02] border border-white/[0.06] rounded-xl py-3 px-4 text-xs sm:text-sm text-white/60 cursor-not-allowed flex items-center justify-between gap-2 overflow-hidden font-medium">
                    <div className="flex items-center gap-2.5 truncate">
                      <Mail className="w-4 h-4 text-white/30 shrink-0" />
                      <span className="truncate">{email}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button type="submit" className="bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-black py-2.5 px-6 transition-all text-xs rounded-full cursor-pointer uppercase tracking-wider shadow-lg shadow-blue-500/20 active:scale-95">
                  บันทึกการแก้ไข
                </button>
              </div>
            </form>

            {/* Quick Menu Shortcuts */}
            <div className="mb-8">
              <h3 className="text-[11px] text-white/50 font-bold uppercase tracking-wider mb-3.5 ml-1">เมนูด่วน</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button type="button" onClick={() => setActiveView('history')} className="flex items-center justify-between p-3.5 bg-white/[0.02] border border-white/[0.08] hover:border-blue-500/40 hover:bg-white/[0.04] transition-all group rounded-2xl cursor-pointer">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded-xl">
                      <History className="w-4 h-4" />
                    </div>
                    <span className="text-xs sm:text-sm font-bold text-white/80 group-hover:text-white transition-colors">ประวัติการสั่งซื้อ</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-white/30 group-hover:text-blue-400 group-hover:translate-x-1 transition-all" />
                </button>

                <button type="button" onClick={() => setActiveView('redeem')} className="flex items-center justify-between p-3.5 bg-white/[0.02] border border-white/[0.08] hover:border-blue-500/40 hover:bg-white/[0.04] transition-all group rounded-2xl cursor-pointer">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded-xl">
                      <Key className="w-4 h-4" />
                    </div>
                    <span className="text-xs sm:text-sm font-bold text-white/80 group-hover:text-white transition-colors">เปิดใช้งานคีย์</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-white/30 group-hover:text-blue-400 group-hover:translate-x-1 transition-all" />
                </button>
              </div>

              {user && (
                <div className="mt-3">
                  <button 
                    type="button" 
                    onClick={() => { 
                      Swal.fire({
                        title: 'ยืนยันการออกจากระบบ?',
                        icon: 'warning',
                        showCancelButton: true,
                        confirmButtonColor: '#ef4444',
                        cancelButtonColor: '#18181b',
                        cancelButtonText: 'ยกเลิก',
                        confirmButtonText: 'ออกจากระบบ',
                        background: '#0c0c12',
                        color: '#fff'
                      }).then((result) => {
                        if (result.isConfirmed) {
                          handleLogout();
                        }
                      });
                    }} 
                    className="w-full flex items-center justify-between p-3.5 bg-rose-500/[0.03] border border-rose-500/20 hover:border-rose-500/40 hover:bg-rose-500/10 transition-all group rounded-2xl cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-rose-500/10 text-rose-400 border border-rose-500/20 rounded-xl">
                        <LogOut className="w-4 h-4" />
                      </div>
                      <span className="text-xs sm:text-sm font-bold text-rose-300 group-hover:text-rose-200 transition-colors">ออกจากระบบ</span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-rose-400/40 group-hover:text-rose-300 group-hover:translate-x-1 transition-all" />
                  </button>
                </div>
              )}
            </div>

            {/* Recent Purchases List */}
            <div className="border-t border-white/[0.08] pt-6">
              <div className="flex items-center justify-between mb-3 px-1">
                <h3 className="text-[11px] text-white/50 font-bold uppercase tracking-wider">รายการสินค้าที่สั่งซื้อล่าสุด</h3>
                <button onClick={() => setActiveView('history')} className="text-xs font-bold text-blue-400 hover:text-blue-300 hover:underline transition-colors cursor-pointer">
                  ดูทั้งหมด
                </button>
              </div>
              
              {purchaseHistory.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-6 bg-white/[0.01] border border-white/[0.06] border-dashed text-white/40 rounded-2xl">
                  <Package className="w-6 h-6 opacity-30 mb-2 text-white/40" />
                  <span className="text-xs font-medium">ยังไม่มีประวัติการสั่งซื้อ</span>
                </div>
              ) : (
                <div className="flex flex-col gap-2.5">
                  {purchaseHistory.slice(0, 3).map(item => renderHistoryItem(item, 'purchase'))}
                </div>
              )}
            </div>

          </div>
        </motion.div>
      </div>
    </AnimatedScroll>
  );
};
