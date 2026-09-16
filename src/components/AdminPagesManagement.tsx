import React, { useState } from 'react';
import { FileText, Plus, Edit, Trash2, ArrowLeft, Save, Globe, Eye } from 'lucide-react';
import Swal from 'sweetalert2';
import axios from 'axios';
import { motion, AnimatePresence } from 'motion/react';

interface AdminPagesManagementProps {
  customPages: any[];
  setCustomPages: React.Dispatch<React.SetStateAction<any[]>>;
}

export const AdminPagesManagement: React.FC<AdminPagesManagementProps> = ({ customPages, setCustomPages }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editingPage, setEditingPage] = useState<any>(null);
  
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    content: ''
  });

  const handleCreateNew = () => {
    setFormData({ title: '', slug: '', content: '' });
    setEditingPage(null);
    setIsEditing(true);
  };

  const handleEdit = (page: any) => {
    setFormData({ title: page.title, slug: page.slug, content: page.content });
    setEditingPage(page);
    setIsEditing(true);
  };

  const handleDelete = (page: any) => {
    Swal.fire({
      title: 'ยืนยันการลบหน้าเพจ?',
      text: `คุณต้องการลบหน้าเพจ "${page.title}" ใช่หรือไม่?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'ลบหน้าเพจ',
      cancelButtonText: 'ยกเลิก',
      confirmButtonColor: '#f43f5e',
      background: '#0d1017',
      color: '#fff'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.delete(`/api/pages/${page.id}`);
          setCustomPages(prev => prev.filter(p => p.id !== page.id));
          Swal.fire({ title: 'ลบสำเร็จ', icon: 'success', timer: 1500, showConfirmButton: false, background: '#0d1017', color: '#fff' });
        } catch (err) {
          Swal.fire({ title: 'Error', text: 'ไม่สามารถลบได้', icon: 'error', background: '#0d1017', color: '#fff' });
        }
      }
    });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.slug || !formData.content) {
      Swal.fire({ title: 'ข้อมูลไม่ครบถ้วน', text: 'กรุณากรอกชื่อเรื่อง, slug และเนื้อหา', icon: 'warning', background: '#0d1017', color: '#fff' });
      return;
    }

    try {
      if (editingPage) {
        const res = await axios.put(`/api/pages/${editingPage.id}`, formData);
        setCustomPages(prev => prev.map(p => p.id === editingPage.id ? res.data : p));
        Swal.fire({ title: 'อัปเดตเรียบร้อย', icon: 'success', timer: 1500, showConfirmButton: false, background: '#0d1017', color: '#fff' });
      } else {
        const res = await axios.post('/api/pages', formData);
        setCustomPages(prev => [...prev, res.data]);
        Swal.fire({ title: 'สร้างหน้าเพจสำเร็จ', icon: 'success', timer: 1500, showConfirmButton: false, background: '#0d1017', color: '#fff' });
      }
      setIsEditing(false);
    } catch (err) {
      Swal.fire({ title: 'Error', text: 'เกิดข้อผิดพลาดในการบันทึก', icon: 'error', background: '#0d1017', color: '#fff' });
    }
  };

  if (isEditing) {
    return (
      <div className="bg-[#0f121a] border border-white/[0.08] rounded-2xl p-6 sm:p-8">
        <div className="flex items-center justify-between pb-6 mb-6 border-b border-white/[0.08]">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsEditing(false)}
              className="w-9 h-9 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] flex items-center justify-center text-zinc-300"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <div>
              <h3 className="text-base font-bold text-white">
                {editingPage ? 'แก้ไขหน้าเพจย่อย' : 'สร้างหน้าเพจใหม่'}
              </h3>
              <p className="text-xs text-zinc-400">เนื้อหารองรับ Markdown formatting</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSave} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-xs mb-1.5 text-zinc-300">
                ชื่อหน้าเพจ (Title) <span className="text-rose-400">*</span>
              </label>
              <input 
                type="text" 
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                className="w-full bg-[#151926] border border-white/[0.08] rounded-xl px-4 py-2.5 text-xs text-white placeholder:text-zinc-600 focus:outline-none focus:border-blue-500"
                placeholder="เช่น ข้อตกลงการใช้งาน (Terms of Service)" 
              />
            </div>
            <div>
              <label className="block font-semibold text-xs mb-1.5 text-zinc-300">
                URL Slug <span className="text-rose-400">*</span>
              </label>
              <div className="flex items-center bg-[#151926] border border-white/[0.08] rounded-xl overflow-hidden px-3">
                <span className="text-xs font-mono text-zinc-500">/</span>
                <input 
                  type="text" 
                  value={formData.slug}
                  onChange={(e) => setFormData({...formData, slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-')})}
                  className="w-full bg-transparent border-none py-2.5 px-1 text-xs text-white font-mono placeholder:text-zinc-600 focus:outline-none"
                  placeholder="terms" 
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block font-semibold text-xs mb-1.5 text-zinc-300">
              เนื้อหาของหน้าเพจ (Markdown) <span className="text-rose-400">*</span>
            </label>
            <textarea 
              value={formData.content}
              onChange={(e) => setFormData({...formData, content: e.target.value})}
              className="w-full bg-[#151926] border border-white/[0.08] rounded-xl p-4 text-xs text-white placeholder:text-zinc-600 focus:outline-none focus:border-blue-500 h-80 font-mono resize-none leading-relaxed"
              placeholder="เขียนเนื้อหา markdown ได้ เช่น # หัวข้อ, ## ข้อย่อย, รายการ..."
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/[0.08]">
            <button 
              type="button" 
              onClick={() => setIsEditing(false)}
              className="px-5 py-2.5 rounded-xl border border-white/[0.08] hover:bg-white/[0.05] text-zinc-300 text-xs font-semibold"
            >
              ยกเลิก
            </button>
            <button 
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all shadow-md shadow-blue-500/20 flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              {editingPage ? 'อัปเดตหน้าเพจ' : 'บันทึกหน้าเพจ'}
            </button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-[#0f121a] border border-white/[0.08] rounded-2xl p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white">จัดการหน้าเพจย่อย (Custom Pages)</h2>
            <p className="text-xs text-zinc-400">สร้างหน้าเพจเสริม เช่น กฎระเบียบ, นโยบายความเป็นส่วนตัว หรือช่องทางติดต่อ</p>
          </div>
        </div>

        <button 
          onClick={handleCreateNew}
          className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all shadow-md shadow-blue-500/20 flex items-center gap-1.5 shrink-0"
        >
          <Plus className="w-4 h-4" /> สร้างหน้าเพจใหม่
        </button>
      </div>

      <div className="bg-[#0f121a] border border-white/[0.08] rounded-2xl overflow-hidden">
        {customPages.length === 0 ? (
          <div className="p-16 text-center text-zinc-500 text-xs">
            <FileText className="w-10 h-10 mx-auto mb-2 opacity-30" />
            <p>ยังไม่มีหน้าเพจย่อยในระบบ คลิกปุ่ม "สร้างหน้าเพจใหม่" ด้านบนเพื่อเริ่มต้น</p>
          </div>
        ) : (
          <div className="divide-y divide-white/[0.04]">
            {customPages.map(page => (
              <div key={page.id} className="p-4 sm:p-5 flex items-center justify-between hover:bg-white/[0.02] transition-colors">
                <div className="flex items-center gap-3.5 min-w-0 pr-4">
                  <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 shrink-0">
                    <Globe className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <h4 className="font-bold text-white text-xs truncate">
                      {page.title ? page.title.replace(/^#+\s*/, '') : 'ไม่มีชื่อหน้า'}
                    </h4>
                    <p className="text-[11px] font-mono text-zinc-400 mt-0.5 flex items-center gap-1">
                      <span>/{page.slug}</span>
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  <button 
                    onClick={() => handleEdit(page)} 
                    className="p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-white/[0.06] transition-colors"
                    title="แก้ไขหน้าเพจ"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => handleDelete(page)} 
                    className="p-2 rounded-xl text-zinc-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                    title="ลบหน้าเพจ"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
