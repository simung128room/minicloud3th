import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Key, Plus, Trash2, Power, PowerOff, Copy, Check, ShieldCheck, X } from 'lucide-react';
import Swal from 'sweetalert2';

export const AdminApiKeys: React.FC = () => {
  const [apiKeys, setApiKeys] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [newKeyName, setNewKeyName] = useState('');
  const [isLifetime, setIsLifetime] = useState(true);
  const [expireDays, setExpireDays] = useState('30');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const fetchKeys = async () => {
    setIsLoading(true);
    try {
      const res = await axios.get('/api/api_keys');
      setApiKeys(res.data);
    } catch (err: any) {
      console.error(err);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: err.response?.data?.error || 'ไม่สามารถดึงข้อมูล API keys ได้',
        background: '#0d1017',
        color: '#fff',
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchKeys();
  }, []);

  const handleAddKey = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post('/api/api_keys', {
        name: newKeyName,
        is_lifetime: isLifetime,
        expire_days: expireDays
      });
      Swal.fire({
        title: 'สร้าง API Key สำเร็จ',
        icon: 'success',
        timer: 1500,
        showConfirmButton: false,
        background: '#0d1017',
        color: '#fff',
      });
      setIsAdding(false);
      setNewKeyName('');
      fetchKeys();
    } catch (err: any) {
      Swal.fire({
        title: 'Error',
        text: err.response?.data?.error || 'ไม่สามารถสร้าง API key ได้',
        icon: 'error',
        background: '#0d1017',
        color: '#fff',
      });
    }
  };

  const handleToggleStatus = async (key: string, currentStatus: string) => {
    try {
      await axios.patch(`/api/api_keys/${key}`, {
        status: currentStatus === 'active' ? 'disabled' : 'active'
      });
      fetchKeys();
    } catch (err: any) {
      Swal.fire({
        title: 'Error',
        text: err.response?.data?.error || 'ไม่สามารถอัปเดตสถานะได้',
        icon: 'error',
        background: '#0d1017',
        color: '#fff',
      });
    }
  };

  const handleDelete = async (key: string) => {
    const confirm = await Swal.fire({
      title: 'ต้องการลบ API Key นี้หรือไม่?',
      text: 'บริการหรือสคริปต์ที่ใช้ Key นี้จะไม่สามารถเข้าถึง API ได้อีกต่อไป',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#f43f5e',
      cancelButtonColor: '#27272a',
      confirmButtonText: 'ใช่, ลบเลย',
      cancelButtonText: 'ยกเลิก',
      background: '#0d1017',
      color: '#fff',
    });

    if (confirm.isConfirmed) {
      try {
        await axios.delete(`/api/api_keys/${key}`);
        Swal.fire({
          title: 'ลบเรียบร้อยแล้ว',
          icon: 'success',
          timer: 1500,
          showConfirmButton: false,
          background: '#0d1017',
          color: '#fff',
        });
        fetchKeys();
      } catch (err: any) {
        Swal.fire({
          title: 'Error',
          text: err.response?.data?.error || 'ไม่สามารถลบ API key ได้',
          icon: 'error',
          background: '#0d1017',
          color: '#fff',
        });
      }
    }
  };

  const copyKey = (key: string) => {
    navigator.clipboard.writeText(key);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-[#0f121a] border border-white/[0.08] rounded-2xl p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
            <Key className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white">จัดการ API Keys (Access Tokens)</h2>
            <p className="text-xs text-zinc-400">สร้าง Access Token สำหรับเชื่อมต่อ API ภายนอกหรือระบบบอท</p>
          </div>
        </div>

        <button
          onClick={() => setIsAdding(true)}
          className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all shadow-md shadow-blue-500/20 flex items-center gap-1.5 shrink-0"
        >
          <Plus className="w-4 h-4" /> สร้าง API Key ใหม่
        </button>
      </div>

      {/* API Keys Table */}
      <div className="bg-[#0f121a] border border-white/[0.08] rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm text-zinc-300">
            <thead>
              <tr className="border-b border-white/[0.06] bg-white/[0.02] text-[11px] text-zinc-400 uppercase font-semibold tracking-wider">
                <th className="px-5 py-3.5">สถานะ</th>
                <th className="px-5 py-3.5">ชื่ออ้างอิง</th>
                <th className="px-5 py-3.5">API Key</th>
                <th className="px-5 py-3.5">สร้างเมื่อ</th>
                <th className="px-5 py-3.5">วันหมดอายุ</th>
                <th className="px-5 py-3.5">ใช้งานล่าสุด</th>
                <th className="px-5 py-3.5 text-right">การจัดการ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04]">
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-zinc-500 text-xs">กำลังโหลดข้อมูล...</td>
                </tr>
              ) : apiKeys.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-zinc-500 text-xs">ยังไม่มี API Key ในระบบ</td>
                </tr>
              ) : (
                apiKeys.map(k => (
                  <tr key={k.key} className="hover:bg-white/[0.02] transition-colors">
                    <td className="px-5 py-3.5">
                      {k.status === 'active' ? (
                        <span className="bg-emerald-500/15 text-emerald-400 border border-emerald-500/25 px-2.5 py-0.5 rounded-full text-[10px] font-bold">ใช้งานได้</span>
                      ) : k.status === 'expired' ? (
                        <span className="bg-amber-500/15 text-amber-400 border border-amber-500/25 px-2.5 py-0.5 rounded-full text-[10px] font-bold">หมดอายุ</span>
                      ) : (
                        <span className="bg-rose-500/15 text-rose-400 border border-rose-500/25 px-2.5 py-0.5 rounded-full text-[10px] font-bold">ระงับ</span>
                      )}
                    </td>
                    <td className="px-5 py-3.5 font-bold text-white text-xs">{k.name}</td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-1.5 font-mono text-xs bg-white/[0.03] border border-white/[0.06] px-2.5 py-1 rounded-lg w-max">
                        <span className="text-blue-400">{k.key.substring(0, 16)}...</span>
                        <button
                          onClick={() => copyKey(k.key)}
                          className="text-zinc-500 hover:text-white p-0.5"
                          title="คัดลอกคีย์"
                        >
                          {copiedKey === k.key ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 whitespace-nowrap text-xs text-zinc-400">{new Date(k.created_at).toLocaleDateString('th-TH')}</td>
                    <td className="px-5 py-3.5 whitespace-nowrap text-xs text-zinc-400">
                      {k.expires_at ? new Date(k.expires_at).toLocaleDateString('th-TH') : (
                        <span className="text-blue-400 font-medium">ตลอดชีพ (Lifetime)</span>
                      )}
                    </td>
                    <td className="px-5 py-3.5 whitespace-nowrap text-xs text-zinc-400">
                      {k.last_used ? new Date(k.last_used).toLocaleDateString('th-TH') : 'ยังไม่เคยใช้'}
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleToggleStatus(k.key, k.status)}
                          className={`p-2 rounded-xl transition-all ${
                            k.status === 'active' 
                              ? 'text-amber-400 hover:bg-amber-500/10' 
                              : 'text-emerald-400 hover:bg-emerald-500/10'
                          }`}
                          title={k.status === 'active' ? 'ระงับการใช้งาน' : 'เปิดใช้งาน'}
                        >
                          {k.status === 'active' ? <PowerOff className="w-4 h-4" /> : <Power className="w-4 h-4" />}
                        </button>
                        <button
                          onClick={() => handleDelete(k.key)}
                          className="p-2 rounded-xl text-zinc-400 hover:text-rose-400 hover:bg-rose-500/10 transition-all"
                          title="ลบ Key"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Key Modal */}
      {isAdding && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-[100]" onClick={() => setIsAdding(false)}>
          <div 
            className="bg-[#0f121a] border border-white/[0.1] w-full max-w-md rounded-2xl shadow-2xl overflow-hidden"
            onClick={e => e.stopPropagation()}
          >
            <div className="p-6 border-b border-white/[0.08] flex items-center justify-between bg-[#121622]/60">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
                  <Key className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">สร้าง API Key ใหม่</h3>
                  <p className="text-xs text-zinc-400">กำหนดชื่อและระยะเวลาการใช้งาน</p>
                </div>
              </div>
              <button 
                onClick={() => setIsAdding(false)} 
                className="w-9 h-9 rounded-xl flex items-center justify-center text-zinc-400 hover:text-white hover:bg-white/[0.06]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddKey} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                  ชื่อ API Key หรือคำอธิบาย <span className="text-rose-400">*</span>
                </label>
                <input
                  required
                  type="text"
                  value={newKeyName}
                  onChange={e => setNewKeyName(e.target.value)}
                  placeholder="เช่น บอท Discord ตรวจสอบยอด, สคริปต์ Python"
                  className="w-full bg-[#151926] border border-white/[0.08] rounded-xl px-4 py-2.5 text-xs text-white placeholder:text-zinc-600 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="flex items-center gap-3 p-3.5 rounded-xl bg-[#151926] border border-white/[0.06]">
                <input
                  type="checkbox"
                  id="isLifetime"
                  checked={isLifetime}
                  onChange={e => setIsLifetime(e.target.checked)}
                  className="w-4 h-4 rounded bg-black/40 border-white/20 text-blue-600 focus:ring-blue-500"
                />
                <label htmlFor="isLifetime" className="text-xs font-semibold text-white cursor-pointer select-none">
                  ใช้งานตลอดชีพ (Lifetime Key ไม่มีวันหมดอายุ)
                </label>
              </div>

              {!isLifetime && (
                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                    จำนวนวันก่อนหมดอายุ (วัน) <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={expireDays}
                    onChange={e => setExpireDays(e.target.value)}
                    className="w-full bg-[#151926] border border-white/[0.08] rounded-xl px-4 py-2.5 text-xs text-white placeholder:text-zinc-600 focus:outline-none focus:border-blue-500 font-mono"
                  />
                </div>
              )}

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/[0.08]">
                <button 
                  type="button" 
                  onClick={() => setIsAdding(false)}
                  className="px-5 py-2.5 rounded-xl border border-white/[0.08] hover:bg-white/[0.05] text-zinc-300 text-xs font-semibold"
                >
                  ยกเลิก
                </button>
                <button 
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all shadow-md shadow-blue-500/20"
                >
                  สร้าง Key ทันที
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
