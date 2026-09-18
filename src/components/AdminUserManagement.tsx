import React, { useState } from 'react';
import { 
  Users, Search, Edit, CheckCircle, Ban, Wallet, 
  ArrowRightLeft, Eye, RefreshCw, HandCoins, Copy, 
  Calendar, Shield, UserCheck, ArrowLeft, Trash2, Key, ShoppingBag, CreditCard
} from 'lucide-react';
import Swal from 'sweetalert2';
import { motion, AnimatePresence } from 'motion/react';
import axios from 'axios';

interface AdminUserManagementProps {
  purchaseHistory: any[];
  topupHistory: any[];
  usedKeysHistory: any[];
  users: any[];
  onRefresh: () => void;
}

export const AdminUserManagement: React.FC<AdminUserManagementProps> = ({ 
  purchaseHistory, 
  topupHistory, 
  usedKeysHistory, 
  users, 
  onRefresh 
}) => {
  const [search, setSearch] = useState('');
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [actionTab, setActionTab] = useState<'info'|'purchase'|'topup'|'keys'>('info');
  const [page, setPage] = useState(1);
  const pageSize = 20;

  const filteredUsers = users.filter(u => 
    (u.email || '').toLowerCase().includes(search.toLowerCase()) || 
    (u.role || '').toLowerCase().includes(search.toLowerCase()) ||
    (u.username || '').toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.max(1, Math.ceil(filteredUsers.length / pageSize));
  const paginatedUsers = filteredUsers.slice((page - 1) * pageSize, page * pageSize);

  const handleUpdateBalance = async (user: any, type: 'add' | 'deduct') => {
    const { value } = await Swal.fire({
      title: type === 'add' ? 'เพิ่มยอดเงิน (Add Balance)' : 'หักยอดเงิน (Deduct Balance)',
      input: 'number',
      inputLabel: 'จำนวนเงิน (บาท)',
      inputAttributes: { min: '1', step: '1' },
      showCancelButton: true,
      confirmButtonText: 'ยืนยัน',
      cancelButtonText: 'ยกเลิก',
      confirmButtonColor: type === 'add' ? '#10b981' : '#f43f5e',
      background: '#0d1017',
      color: '#fff'
    });

    if (value) {
      const amount = Number(value);
      const newBalance = type === 'add' ? (user.balance || 0) + amount : Math.max(0, (user.balance || 0) - amount);
      
      try {
        Swal.showLoading();
        await axios.post(`/api/users/${user.id || user.uid}`, { balance: newBalance });
        setSelectedUser({ ...user, balance: newBalance });
        onRefresh();
        Swal.fire({ icon: 'success', title: 'สำเร็จ!', showConfirmButton: false, timer: 1500, background: '#0d1017', color: '#fff' });
      } catch (err) {
        Swal.fire({ icon: 'error', title: 'ผิดพลาด', text: 'ไม่สามารถปรับยอดเงินได้', background: '#0d1017', color: '#fff' });
      }
    }
  };

  const handleEditUser = async (user: any) => {
    const { value } = await Swal.fire({
      title: 'แก้ไขข้อมูลผู้ใช้',
      html: `
        <div style="display: flex; flex-direction: column; gap: 12px; text-align: left;">
          <div>
            <label style="font-size: 11px; color: #a1a1aa; font-weight: 600;">บทบาท (Role)</label>
            <input id="swal-role" class="swal2-input" style="width: 100%; margin: 4px 0 0 0;" placeholder="Member, Admin, หรือ Premium" value="${user.role || 'Member'}">
          </div>
          <div>
            <label style="font-size: 11px; color: #a1a1aa; font-weight: 600;">ชื่อแสดง (Display Name)</label>
            <input id="swal-username" class="swal2-input" style="width: 100%; margin: 4px 0 0 0;" placeholder="Display Name" value="${user.username || ''}">
          </div>
        </div>
      `,
      showCancelButton: true,
      confirmButtonText: 'บันทึก',
      cancelButtonText: 'ยกเลิก',
      confirmButtonColor: '#3b82f6',
      background: '#0d1017',
      color: '#fff',
      preConfirm: () => {
        return {
          role: (document.getElementById('swal-role') as HTMLInputElement).value,
          username: (document.getElementById('swal-username') as HTMLInputElement).value
        };
      }
    });

    if (value) {
      try {
        Swal.showLoading();
        await axios.post(`/api/users/${user.id || user.uid}`, value);
        setSelectedUser({ ...user, ...value });
        onRefresh();
        Swal.fire({ icon: 'success', title: 'อัปเดตข้อมูลเรียบร้อย', showConfirmButton: false, timer: 1500, background: '#0d1017', color: '#fff' });
      } catch (err) {
        Swal.fire({ icon: 'error', title: 'ผิดพลาด', text: 'ไม่สามารถบันทึกข้อมูลได้', background: '#0d1017', color: '#fff' });
      }
    }
  };

  const handleToggleBan = async (user: any) => {
    const isBanned = user.status === 'banned';
    const result = await Swal.fire({
      title: isBanned ? 'ปลดแบนผู้ใช้งานนี้?' : 'ระงับการใช้งานบัญชีนี้?',
      text: isBanned ? 'ผู้ใช้จะสามารถเข้าสู่ระบบและสั่งซื้อได้ตามปกติ' : 'ผู้ใช้จะไม่สามารถเข้าสู่ระบบหรือเข้าถึงข้อมูลได้',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: isBanned ? 'ปลดแบน' : 'ยืนยันระงับบัญชี',
      cancelButtonText: 'ยกเลิก',
      confirmButtonColor: isBanned ? '#10b981' : '#f43f5e',
      background: '#0d1017',
      color: '#fff'
    });

    if (result.isConfirmed) {
      const newStatus = isBanned ? 'active' : 'banned';
      try {
        Swal.showLoading();
        await axios.post(`/api/users/${user.id || user.uid}`, { status: newStatus });
        setSelectedUser({ ...user, status: newStatus });
        onRefresh();
        Swal.fire({ icon: 'success', title: 'สำเร็จ!', showConfirmButton: false, timer: 1500, background: '#0d1017', color: '#fff' });
      } catch (err) {
        Swal.fire({ icon: 'error', title: 'ผิดพลาด', text: 'ไม่สามารถเปลี่ยนสถานะได้', background: '#0d1017', color: '#fff' });
      }
    }
  };

  const selectedUID = selectedUser?.id || selectedUser?.uid;
  const userPurchaseHistory = purchaseHistory.filter(h => (h.userId === selectedUID || h.uid === selectedUID));
  const userTopupHistory = topupHistory.filter(h => (h.uid === selectedUID || h.userId === selectedUID));
  const userKeysHistory = usedKeysHistory.filter(h => h.uid === selectedUID);

  return (
    <div className="space-y-6">
      {!selectedUser ? (
        <div className="bg-[#0f121a] border border-white/[0.08] rounded-[28px] p-6 sm:p-7 flex flex-col min-h-[500px] overflow-hidden">
          {/* Header & Search */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Users className="w-5 h-5 text-blue-400" /> 
                จัดการสมาชิก (User Management)
              </h3>
              <p className="text-xs text-zinc-400 mt-0.5">รายชื่อผู้ใช้งานทั้งหมด {users.length} บัญชีในระบบ</p>
            </div>
            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input 
                type="text" 
                placeholder="ค้นหาอีเมล, ชื่อ, บทบาท..."
                className="w-full bg-[#151926] border border-white/[0.08] rounded-full text-xs text-white placeholder:text-zinc-500 pl-9 pr-4 py-2.5 focus:outline-none focus:border-blue-500/60"
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
          </div>

          {/* Modern Users Table */}
          <div className="rounded-[22px] border border-white/[0.06] overflow-hidden flex-1 bg-[#0b0e14]">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-zinc-300">
                <thead className="text-[11px] uppercase tracking-wider text-zinc-400 bg-white/[0.02] border-b border-white/[0.06] font-semibold">
                  <tr>
                    <th className="px-5 py-3.5">ผู้ใช้งาน</th>
                    <th className="px-5 py-3.5 text-center">ไอพีล่าสุด</th>
                    <th className="px-5 py-3.5">บทบาท</th>
                    <th className="px-5 py-3.5">สถานะ</th>
                    <th className="px-5 py-3.5 text-right">ยอดคงเหลือ (THB)</th>
                    <th className="px-5 py-3.5 text-right">การจัดการ</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.04]">
                  {paginatedUsers.length > 0 ? paginatedUsers.map((u, i) => (
                    <tr key={i} className="hover:bg-white/[0.02] transition-colors">
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-blue-600/30 to-indigo-600/30 border border-white/[0.08] flex items-center justify-center font-bold text-xs text-blue-400">
                            {(u.email || u.username || 'U').charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <div className="flex items-center gap-1.5">
                              <span className="font-bold text-white text-xs">{u.email}</span>
                              <button 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  navigator.clipboard.writeText(u.email);
                                  Swal.fire({ title: 'Copied!', text: 'คัดลอกอีเมลแล้ว', icon: 'success', timer: 1000, showConfirmButton: false, background: '#0d1017', color: '#fff' });
                                }}
                                className="text-zinc-500 hover:text-blue-400 transition-colors p-0.5 cursor-pointer"
                              >
                                <Copy className="w-3 h-3" />
                              </button>
                            </div>
                            {u.username && (
                              <p className="text-[11px] text-zinc-400 mt-0.5">{u.username}</p>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-3.5 text-center">
                        <span className="font-mono text-[11px] text-zinc-400 bg-white/[0.03] px-3 py-1 rounded-full border border-white/[0.05]">
                          {u.lastLoginIp || u.last_login_ip || '127.0.0.1'}
                        </span>
                      </td>
                      <td className="px-5 py-3.5">
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] uppercase font-bold tracking-wider ${
                          u.role === 'Admin' 
                            ? 'bg-blue-500/15 text-blue-400 border border-blue-500/25' 
                            : u.role === 'Premium' 
                            ? 'bg-amber-500/15 text-amber-400 border border-amber-500/25' 
                            : 'bg-white/[0.05] text-zinc-400 border border-white/[0.06]'
                        }`}>
                          {u.role || 'Member'}
                        </span>
                      </td>
                      <td className="px-5 py-3.5">
                        {u.status === 'banned' ? (
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/15 text-rose-400 border border-rose-500/25 flex items-center gap-1 w-max">
                            <Ban className="w-3 h-3"/> ระงับบัญชี
                          </span>
                        ) : (
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/25 flex items-center gap-1 w-max">
                            <CheckCircle className="w-3 h-3"/> ปกติ
                          </span>
                        )}
                      </td>
                      <td className="px-5 py-3.5 font-mono text-right">
                        <span className="text-xs font-bold text-emerald-400">
                          ฿{(u.balance || 0).toLocaleString()}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-right">
                        <button 
                          onClick={() => setSelectedUser(u)} 
                          className="px-3.5 py-1.5 rounded-full bg-white/[0.04] hover:bg-white/[0.08] text-white text-xs font-semibold transition-all border border-white/[0.06] flex items-center gap-1.5 ml-auto cursor-pointer"
                        >
                          <Eye className="w-3.5 h-3.5 text-blue-400" /> ดูข้อมูล
                        </button>
                      </td>
                    </tr>
                  )) : (
                    <tr>
                      <td colSpan={6} className="text-center py-12 text-zinc-500 font-medium text-xs">
                        ไม่พบข้อมูลผู้ใช้ที่ค้นหา
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between px-5 py-3 border-t border-white/[0.06] bg-white/[0.01] text-xs text-zinc-400">
                <span>
                  แสดง {(page - 1) * pageSize + 1} - {Math.min(filteredUsers.length, page * pageSize)} จากทั้งหมด {filteredUsers.length} ผู้ใช้
                </span>
                <div className="flex items-center gap-2">
                  <button
                    disabled={page <= 1}
                    onClick={() => setPage(p => Math.max(1, p - 1))}
                    className="px-3 py-1 rounded-lg bg-white/[0.05] hover:bg-white/[0.1] text-white disabled:opacity-30 disabled:pointer-events-none transition-colors"
                  >
                    ก่อนหน้า
                  </button>
                  <span className="text-zinc-300 font-mono text-xs px-2">
                    {page} / {totalPages}
                  </span>
                  <button
                    disabled={page >= totalPages}
                    onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                    className="px-3 py-1 rounded-lg bg-white/[0.05] hover:bg-white/[0.1] text-white disabled:opacity-30 disabled:pointer-events-none transition-colors"
                  >
                    ถัดไป
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        /* Detailed User Profile View */
        <AnimatePresence mode="wait">
          <motion.div 
            key="user-detail"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            className="bg-[#0f121a] border border-white/[0.08] rounded-[28px] overflow-hidden shadow-xl"
          >
            {/* Top User Card */}
            <div className="p-6 md:p-8 bg-[#121622]/60 border-b border-white/[0.08] flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white text-xl font-bold shadow-lg shadow-blue-500/20">
                  {(selectedUser.email || 'U').charAt(0).toUpperCase()}
                </div>
                <div>
                  <h2 className="text-lg font-bold text-white mb-1">{selectedUser.email}</h2>
                  <div className="flex items-center gap-2 text-xs">
                    <span className="px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider text-[10px] bg-blue-500/15 text-blue-400 border border-blue-500/25">
                      {selectedUser.role || 'Member'}
                    </span>
                    <span className={`px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider text-[10px] flex items-center gap-1 ${
                      selectedUser.status === 'banned' 
                        ? 'bg-rose-500/15 text-rose-400 border border-rose-500/25' 
                        : 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/25'
                    }`}>
                      {selectedUser.status === 'banned' ? <><Ban className="w-3 h-3"/> Banned</> : <><CheckCircle className="w-3 h-3"/> Active</>}
                    </span>
                  </div>
                </div>
              </div>
              
              <button 
                onClick={() => setSelectedUser(null)} 
                className="px-4 py-2 rounded-full bg-white/[0.05] hover:bg-white/[0.09] text-zinc-300 text-xs font-semibold border border-white/[0.08] transition-all flex items-center gap-2 cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" /> กลับไปหน้ารายชื่อ
              </button>
            </div>

            {/* Sub Tabs */}
            <div className="border-b border-white/[0.08] bg-[#0c0f17] px-6">
              <div className="flex items-center gap-2 py-3 overflow-x-auto no-scrollbar">
                {[
                  { id: 'info', label: 'ข้อมูลทั่วไป & บัญชี' },
                  { id: 'purchase', label: 'ประวัติสั่งซื้อ', count: userPurchaseHistory.length },
                  { id: 'topup', label: 'ประวัติเติมเงิน', count: userTopupHistory.length },
                  { id: 'keys', label: 'คีย์ที่ใช้แล้ว', count: userKeysHistory.length }
                ].map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActionTab(tab.id as any)}
                    className={`px-4 py-2 text-xs font-semibold rounded-full transition-all whitespace-nowrap flex items-center gap-2 cursor-pointer ${ 
                      actionTab === tab.id 
                        ? 'bg-blue-600 text-white shadow-sm' 
                        : 'text-zinc-400 hover:text-white hover:bg-white/[0.04]' 
                    }`}
                  >
                    <span>{tab.label}</span>
                    {tab.count !== undefined && (
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-black/30">
                        {tab.count}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Tab Body */}
            <div className="p-6 md:p-8 bg-[#0f121a]">
              {actionTab === 'info' && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Financial & Metadata */}
                  <div className="space-y-6">
                    <div className="bg-[#121622]/60 border border-white/[0.08] rounded-2xl p-6">
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-2">
                          <Wallet className="w-4 h-4 text-emerald-400"/> ข้อมูลยอดเงินคงเหลือ
                        </h4>
                      </div>
                      <div className="mb-6">
                        <p className="text-3xl font-bold font-mono text-emerald-400">
                          ฿{(selectedUser.balance || 0).toLocaleString()}
                        </p>
                      </div>
                      <div className="flex gap-3">
                        <button 
                          onClick={() => handleUpdateBalance(selectedUser, 'add')} 
                          className="flex-1 py-2.5 rounded-full bg-emerald-600/15 hover:bg-emerald-600/25 border border-emerald-500/30 text-emerald-400 text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95"
                        >
                          <HandCoins className="w-4 h-4" /> เพิ่มเงิน
                        </button>
                        <button 
                          onClick={() => handleUpdateBalance(selectedUser, 'deduct')} 
                          className="flex-1 py-2.5 rounded-full bg-rose-600/15 hover:bg-rose-600/25 border border-rose-500/30 text-rose-400 text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95"
                        >
                          <ArrowRightLeft className="w-4 h-4" /> หักเงิน
                        </button>
                      </div>
                    </div>

                    <div className="bg-[#121622]/60 border border-white/[0.08] rounded-2xl p-5 space-y-4">
                      <div className="flex justify-between items-center pb-3 border-b border-white/[0.05]">
                        <span className="text-xs text-zinc-400">วันที่ลงทะเบียน</span>
                        <span className="text-xs font-bold text-white font-mono">
                          {selectedUser.registered ? new Date(selectedUser.registered).toLocaleString('th-TH') : 'ไม่ระบุ'}
                        </span>
                      </div>
                      <div className="flex justify-between items-center pb-3 border-b border-white/[0.05]">
                        <span className="text-xs text-zinc-400">ไอพีล่าสุด</span>
                        <span className="text-xs font-bold text-white font-mono bg-white/[0.04] px-2 py-0.5 rounded border border-white/[0.06]">
                          {selectedUser.lastLoginIp || selectedUser.last_login_ip || '127.0.0.1'}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-zinc-400">อุปกรณ์ & เบราว์เซอร์</span>
                        <span className="text-xs font-medium text-zinc-300">
                          {selectedUser.lastLoginSource || selectedUser.last_login_source || 'Web Browser'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Actions & Account Security */}
                  <div className="space-y-4">
                    <div className="bg-[#121622]/60 border border-white/[0.08] rounded-[24px] p-6 space-y-3">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400 mb-2">การตั้งค่าสิทธิ์และการจัดการ</h4>
                      
                      <button 
                        onClick={() => handleEditUser(selectedUser)} 
                        className="w-full flex items-center justify-between p-3.5 rounded-2xl bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.06] transition-all text-left group cursor-pointer"
                      >
                        <div className="flex items-center gap-3">
                          <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400"><Edit className="w-4 h-4" /></div>
                          <div>
                            <p className="text-xs font-bold text-white">แก้ไขบทบาทและชื่อ</p>
                            <p className="text-[11px] text-zinc-400">เปลี่ยนสิทธิ์ Member / Premium / Admin</p>
                          </div>
                        </div>
                      </button>

                      <button 
                        onClick={async () => {
                          const { value: password } = await Swal.fire({
                            title: 'เปลี่ยนรหัสผ่านใหม่', 
                            input: 'password', 
                            inputPlaceholder: 'กรอกรหัสผ่านใหม่...', 
                            showCancelButton: true, 
                            confirmButtonText: 'อัปเดตรหัสผ่าน', 
                            cancelButtonText: 'ยกเลิก',
                            confirmButtonColor: '#3b82f6',
                            background: '#0d1017',
                            color: '#fff'
                          });
                          if (password) {
                            try {
                              Swal.showLoading();
                              await axios.post(`/api/users/${selectedUser.id || selectedUser.uid}/password`, { password });
                              Swal.fire({ icon: 'success', title: 'เปลี่ยนรหัสผ่านสำเร็จ', showConfirmButton: false, timer: 1500, background: '#0d1017', color: '#fff' });
                            } catch (err: any) {
                              Swal.fire({ icon: 'error', title: 'ผิดพลาด', text: 'ไม่สามารถเปลี่ยนรหัสผ่านได้', background: '#0d1017', color: '#fff' });
                            }
                          }
                        }} 
                        className="w-full flex items-center justify-between p-3.5 rounded-2xl bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.06] transition-all text-left group cursor-pointer"
                      >
                        <div className="flex items-center gap-3">
                          <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400"><RefreshCw className="w-4 h-4" /></div>
                          <div>
                            <p className="text-xs font-bold text-white">รีเซ็ตรหัสผ่าน</p>
                            <p className="text-[11px] text-zinc-400">ตั้งรหัสผ่านใหม่ให้กับผู้ใช้งานนี้</p>
                          </div>
                        </div>
                      </button>

                      <button 
                        onClick={() => handleToggleBan(selectedUser)} 
                        className={`w-full flex items-center justify-between p-3.5 rounded-2xl border transition-all text-left cursor-pointer ${
                          selectedUser.status === 'banned' 
                            ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' 
                            : 'bg-rose-500/10 border-rose-500/20 text-rose-400'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className="p-2 rounded-xl bg-white/[0.05]">
                            {selectedUser.status === 'banned' ? <CheckCircle className="w-4 h-4" /> : <Ban className="w-4 h-4" />}
                          </div>
                          <div>
                            <p className="text-xs font-bold">{selectedUser.status === 'banned' ? 'ปลดแบนผู้ใช้งาน' : 'ระงับการใช้งานบัญชี'}</p>
                            <p className="text-[11px] opacity-80">{selectedUser.status === 'banned' ? 'เปิดให้เข้าสู่ระบบได้ตามปกติ' : 'บล็อกการเข้าสู่ระบบทันที'}</p>
                          </div>
                        </div>
                      </button>

                      <button 
                        onClick={async () => {
                          const result = await Swal.fire({
                            title: 'ยืนยันการลบผู้ใช้ถาวร?',
                            text: 'ข้อมูลทั้งหมดของบัญชีนี้จะถูกลบและไม่สามารถกู้คืนได้',
                            icon: 'warning',
                            showCancelButton: true,
                            confirmButtonText: 'ลบข้อมูลถาวร',
                            cancelButtonText: 'ยกเลิก',
                            confirmButtonColor: '#f43f5e',
                            background: '#0d1017',
                            color: '#fff'
                          });
                          if (result.isConfirmed) {
                            try {
                              Swal.showLoading();
                              await axios.delete(`/api/users/${selectedUser.id || selectedUser.uid}`);
                              Swal.fire({ icon: 'success', title: 'ลบผู้ใช้เรียบร้อย', showConfirmButton: false, timer: 1500, background: '#0d1017', color: '#fff' });
                              setSelectedUser(null);
                              onRefresh();
                            } catch (err: any) {
                              Swal.fire({ icon: 'error', title: 'Error', text: 'ไม่สามารถลบข้อมูลได้', background: '#0d1017', color: '#fff' });
                            }
                          }
                        }} 
                        className="w-full flex items-center justify-between p-3.5 rounded-2xl bg-rose-500/5 hover:bg-rose-500/10 border border-rose-500/20 text-rose-400 transition-all text-left mt-4 cursor-pointer"
                      >
                        <div className="flex items-center gap-3">
                          <div className="p-2 rounded-xl bg-rose-500/10"><Trash2 className="w-4 h-4" /></div>
                          <div>
                            <p className="text-xs font-bold">ลบบัญชีผู้ใช้นี้ออกจากระบบ</p>
                            <p className="text-[11px] text-rose-400/70">ลบข้อมูลประวัติและผู้ใช้ถาวร</p>
                          </div>
                        </div>
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {actionTab === 'purchase' && (
                <div className="space-y-3">
                  {userPurchaseHistory.length > 0 ? userPurchaseHistory.map((h, i) => (
                    <div key={i} className="flex justify-between items-center p-4 rounded-2xl bg-[#121622]/60 border border-white/[0.06]">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400">
                          <ShoppingBag className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-white">{h.productName || 'สินค้า'}</p>
                          <p className="text-[11px] text-zinc-400 mt-0.5">{new Date(h.date || h.timestamp).toLocaleString('th-TH')}</p>
                        </div>
                      </div>
                      <p className="font-bold text-emerald-400 font-mono text-sm">-฿{h.price}</p>
                    </div>
                  )) : (
                    <div className="p-12 text-center text-xs text-zinc-500">
                      ไม่พบประวัติการสั่งซื้อสำหรับผู้ใช้งานนี้
                    </div>
                  )}
                </div>
              )}

              {actionTab === 'topup' && (
                <div className="space-y-3">
                  {userTopupHistory.length > 0 ? userTopupHistory.map((h, i) => (
                    <div key={i} className="flex justify-between items-center p-4 rounded-2xl bg-[#121622]/60 border border-white/[0.06]">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400">
                          <CreditCard className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-white">เติมเงินผ่าน {h.method || 'TrueWallet'}</p>
                          <p className="text-[11px] text-zinc-400 mt-0.5">{new Date(h.date || h.timestamp).toLocaleString('th-TH')}</p>
                        </div>
                      </div>
                      <p className="font-bold text-blue-400 font-mono text-sm">+฿{h.amount}</p>
                    </div>
                  )) : (
                    <div className="p-12 text-center text-xs text-zinc-500">
                      ไม่พบประวัติการเติมเงินสำหรับผู้ใช้งานนี้
                    </div>
                  )}
                </div>
              )}

              {actionTab === 'keys' && (
                <div className="space-y-3">
                  {userKeysHistory.length > 0 ? userKeysHistory.map((k, i) => (
                    <div key={i} className="flex justify-between items-center p-4 rounded-2xl bg-[#121622]/60 border border-white/[0.06]">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400">
                          <Key className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="text-xs font-mono font-bold text-white">{k.key || k.code || 'KEY'}</p>
                          <p className="text-[11px] text-zinc-400 mt-0.5">{new Date(k.used_at || k.date).toLocaleString('th-TH')}</p>
                        </div>
                      </div>
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        ใช้งานแล้ว
                      </span>
                    </div>
                  )) : (
                    <div className="p-12 text-center text-xs text-zinc-500">
                      ไม่พบประวัติการใช้งาน License Key
                    </div>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        </AnimatePresence>
      )}
    </div>
  );
};
