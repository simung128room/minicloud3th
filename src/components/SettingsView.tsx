import React, { useState, useEffect } from 'react';
import { Shield, Key, Trash2, Lock, ShieldAlert, Settings, ShieldCheck, Sparkles, UserCheck, Eye, EyeOff } from 'lucide-react';
import Swal from 'sweetalert2';
import axios from 'axios';
import { AnimatedScroll } from './AnimatedScroll';
import { motion, AnimatePresence } from 'motion/react';

interface SettingsViewProps {
  user?: any;
  setActiveView: (view: any) => void;
  useCustomCursor?: boolean;
  toggleCustomCursor?: () => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({ setActiveView, user, useCustomCursor, toggleCustomCursor }) => {
  const [currentTab, setCurrentTab] = useState<'password' | 'delete' | 'preferences'>('password');
  const [isLoading, setIsLoading] = useState(false);
  
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => setIsLoading(false), 150);
    return () => clearTimeout(timer);
  }, [currentTab]);

  const handleChangePassword = async () => {
    if (!oldPassword) {
      return Swal.fire({ icon: 'error', title: 'ข้อผิดพลาด', text: 'กรุณากรอกรหัสผ่านเดิม', background: '#0c0c12', color: '#fff' });
    }
    if (!newPassword || !confirmPassword) {
      return Swal.fire({ icon: 'error', title: 'ข้อผิดพลาด', text: 'กรุณากรอกข้อมูลให้ครบถ้วน', background: '#0c0c12', color: '#fff' });
    }
    if (newPassword !== confirmPassword) {
      return Swal.fire({ icon: 'error', title: 'ข้อผิดพลาด', text: 'รหัสผ่านใหม่และยืนยันรหัสผ่านไม่ตรงกัน', background: '#0c0c12', color: '#fff' });
    }

    try {
      setIsLoading(true);
      const { supabase } = await import('../lib/supabase');
      
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: user?.email || '',
        password: oldPassword,
      });

      if (signInError) {
        throw new Error('รหัสผ่านเดิมไม่ถูกต้อง');
      }

      const { error } = await supabase.auth.updateUser({ password: newPassword });
      
      if (error) throw error;

      Swal.fire({
        title: 'เปลี่ยนรหัสผ่านสำเร็จ',
        text: 'รหัสผ่านของคุณถูกอัปเดตเรียบร้อยแล้ว',
        icon: 'success',
        background: '#0c0c12',
        color: '#fff',
        confirmButtonColor: '#2563eb'
      });
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error: any) {
      Swal.fire({
         title: 'เกิดข้อผิดพลาด',
         text: error.message || 'ไม่สามารถเปลี่ยนรหัสผ่านได้',
         icon: 'error',
         background: '#0c0c12',
         color: '#fff',
         confirmButtonColor: '#2563eb'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    const { value: password } = await Swal.fire({
      title: 'ยืนยันการลบบัญชี',
      text: 'กรุณากรอกรหัสผ่านเพื่อยืนยันการลบบัญชี ข้อมูลทั้งหมดจะถูกลบถาวร',
      input: 'password',
      inputPlaceholder: 'รหัสผ่านของคุณ',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#18181b',
      confirmButtonText: 'ลบบัญชีถาวร',
      cancelButtonText: 'ยกเลิก',
      background: '#0c0c12',
      color: '#fff',
      customClass: {
        input: 'bg-[#181820] border-white/10 text-white rounded-xl'
      }
    });

    if (password) {
      try {
        setIsLoading(true);
        const { supabase } = await import('../lib/supabase');
        
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email: user?.email || '',
          password: password,
        });

        if (signInError) {
          throw new Error('รหัสผ่านไม่ถูกต้อง');
        }

        await axios.delete(`/api/users/${user.id}`);
        await supabase.auth.signOut();
        
        Swal.fire({
          title: 'ลบบัญชีสำเร็จ',
          text: 'บัญชีของคุณถูกลบออกจากระบบเรียบร้อยแล้ว',
          icon: 'success',
          background: '#0c0c12',
          color: '#fff',
          confirmButtonColor: '#2563eb'
        }).then(() => {
          window.location.reload();
        });
      } catch (error: any) {
        Swal.fire({
          title: 'เกิดข้อผิดพลาด',
          text: error.message || 'ไม่สามารถลบบัญชีได้',
          icon: 'error',
          background: '#0c0c12',
          color: '#fff',
          confirmButtonColor: '#2563eb'
        });
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <AnimatedScroll direction="up" hideOnScroll={true}>
      <div className="w-full max-w-4xl mx-auto p-4 sm:p-6 lg:p-8 font-sans text-white min-h-[85vh]">
        {/* Header */}
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold uppercase tracking-wider mb-2">
            <Settings className="w-3.5 h-3.5" />
            <span>Account Settings</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            การตั้งค่าบัญชี
          </h1>
          <p className="text-white/50 text-xs sm:text-sm font-medium mt-1">
            จัดการรหัสผ่าน ความปลอดภัย และการตั้งค่าความเป็นส่วนตัวของคุณ
          </p>
        </div>

        {/* Tab Controls */}
        <div className="flex gap-2 p-1.5 bg-[#0c0c12]/85 border border-white/[0.08] rounded-2xl mb-8 backdrop-blur-xl w-fit">
          <button
            onClick={() => setCurrentTab('password')}
            className={`px-5 py-2.5 rounded-xl text-xs font-bold tracking-wider uppercase transition-all cursor-pointer ${
              currentTab === 'password'
                ? 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-lg shadow-blue-500/20'
                : 'text-white/50 hover:text-white hover:bg-white/[0.04]'
            }`}
          >
            เปลี่ยนรหัสผ่าน
          </button>
          <button
            onClick={() => setCurrentTab('delete')}
            className={`px-5 py-2.5 rounded-xl text-xs font-bold tracking-wider uppercase transition-all cursor-pointer ${
              currentTab === 'delete'
                ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/20'
                : 'text-white/50 hover:text-rose-400 hover:bg-white/[0.04]'
            }`}
          >
            ลบบัญชี
          </button>
        </div>

        {/* Tab Content */}
        <div className="bg-[#0c0c12]/85 backdrop-blur-2xl border border-white/[0.1] rounded-[32px] p-6 sm:p-10 shadow-2xl glass-card glass-reflection relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent pointer-events-none" />

          {currentTab === 'password' && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-xl"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-2xl text-blue-400">
                  <Lock className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-lg sm:text-xl font-black text-white">เปลี่ยนรหัสผ่านใหม่</h2>
                  <p className="text-white/40 text-xs font-medium">กรุณาตั้งรหัสผ่านที่มีความยาวอย่างน้อย 6 ตัวอักษร</p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-white/50 uppercase tracking-wider mb-2 ml-1">
                    รหัสผ่านเดิม
                  </label>
                  <input
                    type="password"
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                    placeholder="กรอกรหัสผ่านปัจจุบันของคุณ"
                    className="w-full bg-white/[0.03] border border-white/[0.1] focus:border-blue-500 rounded-2xl p-4 text-white text-sm outline-none transition-all placeholder:text-white/20"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-white/50 uppercase tracking-wider mb-2 ml-1">
                    รหัสผ่านใหม่
                  </label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="กรอกรหัสผ่านใหม่"
                    className="w-full bg-white/[0.03] border border-white/[0.1] focus:border-blue-500 rounded-2xl p-4 text-white text-sm outline-none transition-all placeholder:text-white/20"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-white/50 uppercase tracking-wider mb-2 ml-1">
                    ยืนยันรหัสผ่านใหม่
                  </label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="กรอกรหัสผ่านใหม่อีกครั้ง"
                    className="w-full bg-white/[0.03] border border-white/[0.1] focus:border-blue-500 rounded-2xl p-4 text-white text-sm outline-none transition-all placeholder:text-white/20"
                  />
                </div>

                <div className="pt-4">
                  <button
                    onClick={handleChangePassword}
                    disabled={isLoading}
                    className="w-full py-4 rounded-full bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-black text-xs sm:text-sm tracking-wider uppercase transition-all shadow-lg shadow-blue-500/25 active:scale-[0.98] cursor-pointer disabled:opacity-50"
                  >
                    {isLoading ? 'กำลังบันทึก...' : 'อัปเดตรหัสผ่าน'}
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {currentTab === 'delete' && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-xl"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-rose-500/10 border border-rose-500/20 rounded-2xl text-rose-400">
                  <ShieldAlert className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-lg sm:text-xl font-black text-white">ลบบัญชีผู้ใช้งานถาวร</h2>
                  <p className="text-white/40 text-xs font-medium">การดำเนินการนี้จะไม่สามารถย้อนกลับได้</p>
                </div>
              </div>

              <div className="bg-rose-500/[0.05] border border-rose-500/20 p-5 rounded-2xl mb-6">
                <p className="text-xs sm:text-sm text-rose-300 leading-relaxed font-medium">
                  เมื่อคุณลบบัญชี ข้อมูลทั้งหมดรวมถึงยอดเงินคงเหลือ ประวัติการสั่งซื้อ และประวัติการ Redeem คีย์ จะถูกลบทิ้งอย่างถาวร
                </p>
              </div>

              <button
                onClick={handleDeleteAccount}
                disabled={isLoading}
                className="w-full py-4 rounded-full bg-rose-500 hover:bg-rose-600 text-white font-black text-xs sm:text-sm tracking-wider uppercase transition-all shadow-lg shadow-rose-500/25 active:scale-[0.98] cursor-pointer disabled:opacity-50"
              >
                {isLoading ? 'กำลังลบบัญชี...' : 'ยืนยันการลบบัญชีถาวร'}
              </button>
            </motion.div>
          )}
        </div>
      </div>
    </AnimatedScroll>
  );
};
