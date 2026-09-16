import React, { useState, useEffect } from 'react';
import { Gift, Plus, Trash2, FileText, Image as ImageIcon, Download, Check, X, Folder, Layers, Sparkles } from 'lucide-react';
import Swal from 'sweetalert2';
import axios from 'axios';

export interface ContentItem {
  id: string;
  categoryId: string;
  type: 'free' | 'premium';
  title: string;
  keyword?: string;
  attachments?: any[];
  unlockAt?: string;
  createdAt?: string;
}

export interface LogCategory {
  id: string;
  name: string;
  subtitle: string;
  icon: string;
  isVisible: boolean;
  isVip: boolean;
  order: number;
}

export const AdminToolsManagement = () => {
  const [categories, setCategories] = useState<LogCategory[]>([]);
  const [items, setItems] = useState<ContentItem[]>([]);
  const [activeTab, setActiveTab] = useState<'categories' | 'items'>('items');

  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [catName, setCatName] = useState('');
  const [catSubtitle, setCatSubtitle] = useState('');
  const [catIcon, setCatIcon] = useState('Folder');
  const [catIsVip, setCatIsVip] = useState(false);
  const [catIsVisible, setCatIsVisible] = useState(true);

  const [isAddingItem, setIsAddingItem] = useState(false);
  const [itemCategoryId, setItemCategoryId] = useState('');
  const [title, setTitle] = useState('');
  const [keyword, setKeyword] = useState('');
  const [itemType, setItemType] = useState<'free' | 'premium'>('free');
  
  const [attachments, setAttachments] = useState<{type: 'text'|'image'|'file', data: string}[]>([]);
  const [attType, setAttType] = useState<'text'|'image'|'file'>('text');
  const [attData, setAttData] = useState('');

  const loadData = async () => {
    try {
      const res = await axios.get('/api/logs-system');
      setCategories(res.data.categories || []);
      setItems(res.data.items || []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const saveData = async (newCats: LogCategory[], newItems: ContentItem[]) => {
    try {
      await axios.post('/api/logs-system', { categories: newCats, items: newItems });
      setCategories(newCats);
      setItems(newItems);
      Swal.fire({ title: 'บันทึกสำเร็จ!', icon: 'success', timer: 1500, showConfirmButton: false, background: '#0d1017', color: '#fff' });
    } catch (err) {
      Swal.fire({ title: 'เกิดข้อผิดพลาด', icon: 'error', background: '#0d1017', color: '#fff' });
    }
  };

  const handleSaveCategory = () => {
    if (!catName) return Swal.fire({ title: 'กรุณากรอกชื่อหมวดหมู่', icon: 'warning', background: '#0d1017', color: '#fff' });
    const newCat: LogCategory = {
      id: Math.random().toString(36).substring(2, 9),
      name: catName,
      subtitle: catSubtitle,
      icon: catIcon,
      isVip: catIsVip,
      isVisible: catIsVisible,
      order: categories.length
    };
    saveData([...categories, newCat], items);
    setIsAddingCategory(false);
    setCatName(''); setCatSubtitle(''); setCatIsVip(false); setCatIsVisible(true);
  };

  const handleDeleteCategory = (id: string) => {
    Swal.fire({ 
      title: 'ยืนยันการลบหมวดหมู่นี้?', 
      text: 'เนื้อหาทั้งหมดที่อยู่ในหมวดหมู่นี้จะถูกลบไปด้วย',
      showCancelButton: true, 
      confirmButtonText: 'ใช่, ลบเลย',
      cancelButtonText: 'ยกเลิก',
      confirmButtonColor: '#f43f5e',
      background: '#0d1017', 
      color: '#fff' 
    }).then(r => {
      if (r.isConfirmed) {
        saveData(categories.filter(x => x.id !== id), items.filter(x => x.categoryId !== id));
      }
    });
  };

  const toggleCategoryVisibility = (id: string) => {
    const newCats = categories.map(c => c.id === id ? { ...c, isVisible: !c.isVisible } : c);
    saveData(newCats, items);
  };

  const handleSaveItem = () => {
    if (!title || !itemCategoryId) return Swal.fire({ title: 'กรุณากรอกหัวข้อและเลือกหมวดหมู่', icon: 'warning', background: '#0d1017', color: '#fff' });
    if (attachments.length === 0) return Swal.fire({ title: 'ต้องมีอย่างน้อย 1 ไฟล์หรือเนื้อหาแนบ', icon: 'warning', background: '#0d1017', color: '#fff' });

    const newItem: ContentItem = {
      id: Math.random().toString(36).substring(2, 9),
      categoryId: itemCategoryId,
      type: itemType,
      title,
      keyword,
      attachments,
      createdAt: new Date().toISOString()
    };

    saveData(categories, [newItem, ...items]);
    setIsAddingItem(false);
    setTitle(''); setKeyword(''); setAttachments([]); setAttData('');
  };

  const handleDeleteItem = (id: string) => {
    Swal.fire({ 
      title: 'ยืนยันการลบเนื้อหานี้?', 
      showCancelButton: true, 
      confirmButtonText: 'ใช่, ลบ',
      cancelButtonText: 'ยกเลิก',
      confirmButtonColor: '#f43f5e',
      background: '#0d1017', 
      color: '#fff' 
    }).then(r => {
      if (r.isConfirmed) saveData(categories, items.filter(x => x.id !== id));
    });
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="bg-[#0f121a] border border-white/[0.08] rounded-2xl p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
            <Gift className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white">ระบบแจกไฟล์และเนื้อหา (Content & Rewards)</h2>
            <p className="text-xs text-zinc-400">จัดการไฟล์ดาวน์โหลด โค้ดฟรี และสิทธิพิเศษสมาชิก</p>
          </div>
        </div>

        <div className="flex items-center bg-[#151926] p-1 rounded-xl border border-white/[0.08]">
          <button 
            onClick={() => setActiveTab('items')} 
            className={`px-4 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              activeTab === 'items' ? 'bg-blue-600 text-white shadow-sm' : 'text-zinc-400 hover:text-white'
            }`}
          >
            รายการเนื้อหา ({items.length})
          </button>
          <button 
            onClick={() => setActiveTab('categories')} 
            className={`px-4 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              activeTab === 'categories' ? 'bg-blue-600 text-white shadow-sm' : 'text-zinc-400 hover:text-white'
            }`}
          >
            หมวดหมู่ ({categories.length})
          </button>
        </div>
      </div>

      {activeTab === 'categories' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <p className="text-xs text-zinc-400">จัดกลุ่มเนื้อหาหรือไฟล์แจกเพื่อการเข้าถึงที่ง่ายขึ้น</p>
            {!isAddingCategory && (
              <button 
                onClick={() => setIsAddingCategory(true)} 
                className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all shadow-md shadow-blue-500/20 flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4"/> เพิ่มหมวดหมู่
              </button>
            )}
          </div>

          {isAddingCategory && (
            <div className="bg-[#0f121a] border border-white/[0.08] rounded-2xl p-6">
              <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
                <Folder className="w-4 h-4 text-blue-400" /> สร้างหมวดหมู่ใหม่
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1.5">ชื่อหมวดหมู่</label>
                  <input 
                    value={catName} 
                    onChange={e => setCatName(e.target.value)} 
                    className="w-full bg-[#151926] border border-white/[0.08] rounded-xl px-4 py-2.5 text-xs text-white placeholder:text-zinc-600 focus:outline-none focus:border-blue-500" 
                    placeholder="เช่น VIP แจกไฟล์ฟรี, อักษรพิเศษ" 
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1.5">คำอธิบายย่อย</label>
                  <input 
                    value={catSubtitle} 
                    onChange={e => setCatSubtitle(e.target.value)} 
                    className="w-full bg-[#151926] border border-white/[0.08] rounded-xl px-4 py-2.5 text-xs text-white placeholder:text-zinc-600 focus:outline-none focus:border-blue-500" 
                    placeholder="คำอธิบายสั้นๆ..." 
                  />
                </div>
              </div>
              
              <div className="flex flex-wrap items-center gap-6 p-3 rounded-xl bg-[#151926]/50 border border-white/[0.06] mb-4">
                <label className="flex items-center gap-2 text-xs font-semibold text-amber-400 cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={catIsVip} 
                    onChange={e => setCatIsVip(e.target.checked)} 
                    className="w-4 h-4 rounded bg-black/40 border-white/20 text-amber-500" 
                  />
                  <span>สิทธิ์เฉพาะ VIP (VIP Only)</span>
                </label>
                <label className="flex items-center gap-2 text-xs font-semibold text-emerald-400 cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={catIsVisible} 
                    onChange={e => setCatIsVisible(e.target.checked)} 
                    className="w-4 h-4 rounded bg-black/40 border-white/20 text-emerald-500" 
                  />
                  <span>เปิดให้แสดงบนหน้าเว็บ (Visible)</span>
                </label>
              </div>

              <div className="flex justify-end gap-2.5">
                <button 
                  onClick={() => setIsAddingCategory(false)} 
                  className="px-4 py-2 text-xs font-semibold text-zinc-400 hover:text-white"
                >
                  ยกเลิก
                </button>
                <button 
                  onClick={handleSaveCategory} 
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all shadow-md shadow-blue-500/20 flex items-center gap-1.5"
                >
                  <Check className="w-4 h-4"/> บันทึกหมวดหมู่
                </button>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {categories.map((c) => (
              <div key={c.id} className="bg-[#0f121a] border border-white/[0.08] rounded-2xl p-5 relative hover:border-white/[0.12] transition-colors">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold text-white">{c.name}</h3>
                    {c.isVip && (
                      <span className="text-[10px] font-bold bg-amber-500/15 text-amber-400 border border-amber-500/25 px-2 py-0.5 rounded-full uppercase">
                        VIP
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-1.5">
                    <button 
                      onClick={() => toggleCategoryVisibility(c.id)} 
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border transition-colors ${
                        c.isVisible 
                          ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/25' 
                          : 'bg-white/[0.04] text-zinc-500 border-white/[0.06]'
                      }`}
                    >
                      {c.isVisible ? 'เปิดใช้งาน' : 'ซ่อนไว้'}
                    </button>
                    <button 
                      onClick={() => handleDeleteCategory(c.id)} 
                      className="text-zinc-500 hover:text-rose-400 p-1 rounded-lg hover:bg-rose-500/10 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5"/>
                    </button>
                  </div>
                </div>
                <p className="text-xs text-zinc-400 mt-1">{c.subtitle || 'ไม่มีรายละเอียด'}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'items' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <p className="text-xs text-zinc-400">เนื้อหาหรือไฟล์ทั้งหมดที่เปิดให้สมาชิกดาวน์โหลด</p>
            {!isAddingItem && (
              <button 
                onClick={() => setIsAddingItem(true)} 
                className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all shadow-md shadow-blue-500/20 flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4"/> เพิ่มเนื้อหาใหม่
              </button>
            )}
          </div>

          {isAddingItem && (
            <div className="bg-[#0f121a] border border-white/[0.08] rounded-2xl p-6">
              <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-blue-400" /> สร้างรายการเนื้อหาใหม่
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1.5">หัวข้อเนื้อหา</label>
                  <input 
                    value={title} 
                    onChange={e => setTitle(e.target.value)} 
                    className="w-full bg-[#151926] border border-white/[0.08] rounded-xl px-4 py-2.5 text-xs text-white placeholder:text-zinc-600 focus:outline-none focus:border-blue-500" 
                    placeholder="เช่น แจกสกินปืน, สคริปต์ฟาร์ม..." 
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1.5">หมวดหมู่</label>
                  <select 
                    value={itemCategoryId} 
                    onChange={e => setItemCategoryId(e.target.value)} 
                    className="w-full bg-[#151926] border border-white/[0.08] rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-blue-500"
                  >
                    <option value="">-- เลือกหมวดหมู่ --</option>
                    {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1.5">สิทธิ์การเข้าถึง</label>
                  <select 
                    value={itemType} 
                    onChange={e => setItemType(e.target.value as any)} 
                    className="w-full bg-[#151926] border border-white/[0.08] rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-blue-500"
                  >
                    <option value="free">ฟรี (ทุกคนดาวน์โหลดได้)</option>
                    <option value="premium">พรีเมียม (เฉพาะสมาชิก Premium / VIP)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1.5">Keyword (ป้ายกำกับ)</label>
                  <input 
                    value={keyword} 
                    onChange={e => setKeyword(e.target.value)} 
                    className="w-full bg-[#151926] border border-white/[0.08] rounded-xl px-4 py-2.5 text-xs text-white placeholder:text-zinc-600 focus:outline-none focus:border-blue-500" 
                    placeholder="เช่น Font, Script, Mod" 
                  />
                </div>
              </div>

              {/* Attachments Section */}
              <div className="bg-[#121622]/60 border border-white/[0.08] rounded-2xl p-4 mb-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400 mb-3">
                  ไฟล์แนบ / เนื้อหาดาวน์โหลด
                </h4>
                {attachments.length > 0 && (
                  <div className="space-y-2 mb-3">
                    {attachments.map((a, i) => (
                      <div key={i} className="flex items-center justify-between bg-[#151926] border border-white/[0.06] p-2.5 px-3 rounded-xl text-xs text-zinc-300">
                        <div className="flex items-center gap-2.5 truncate">
                          {a.type === 'text' && <FileText className="w-4 h-4 text-blue-400 shrink-0"/>}
                          {a.type === 'image' && <ImageIcon className="w-4 h-4 text-indigo-400 shrink-0"/>}
                          {a.type === 'file' && <Download className="w-4 h-4 text-amber-400 shrink-0"/>}
                          <span className="truncate max-w-sm">{a.data}</span>
                        </div>
                        <button 
                          onClick={() => setAttachments(attachments.filter((_, idx) => idx !== i))} 
                          className="text-zinc-500 hover:text-rose-400 p-1"
                        >
                          <Trash2 className="w-3.5 h-3.5"/>
                        </button>
                      </div>
                    ))}
                  </div>
                )}
                <div className="flex flex-col sm:flex-row gap-2">
                  <select 
                    value={attType} 
                    onChange={e => setAttType(e.target.value as any)} 
                    className="bg-[#151926] border border-white/[0.08] rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                  >
                    <option value="text">ข้อความ/สคริปต์</option>
                    <option value="image">รูปภาพ (URL)</option>
                    <option value="file">ลิงก์ดาวน์โหลด</option>
                  </select>
                  <input 
                    value={attData} 
                    onChange={e => setAttData(e.target.value)} 
                    className="flex-1 bg-[#151926] border border-white/[0.08] rounded-xl px-3 py-2 text-xs text-white placeholder:text-zinc-600 focus:outline-none" 
                    placeholder={attType === 'text' ? "กรอกข้อความที่นี่..." : "วาง URL ลิงก์ดาวน์โหลด..."} 
                  />
                  <button 
                    type="button"
                    onClick={() => { 
                      if(attData.trim()) { 
                        setAttachments([...attachments, { type: attType, data: attData.trim() }]); 
                        setAttData(''); 
                      } 
                    }} 
                    className="px-4 py-2 rounded-xl bg-white/[0.06] hover:bg-white/[0.1] text-white text-xs font-semibold transition-colors flex items-center justify-center gap-1 shrink-0"
                  >
                    <Plus className="w-3.5 h-3.5"/> เพิ่มไฟล์
                  </button>
                </div>
              </div>

              <div className="flex justify-end gap-2.5">
                <button 
                  onClick={() => setIsAddingItem(false)} 
                  className="px-4 py-2 text-xs font-semibold text-zinc-400 hover:text-white"
                >
                  ยกเลิก
                </button>
                <button 
                  onClick={handleSaveItem} 
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all shadow-md shadow-blue-500/20 flex items-center gap-1.5"
                >
                  <Check className="w-4 h-4"/> บันทึกเนื้อหา
                </button>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {items.map((item) => {
              const cat = categories.find(c => c.id === item.categoryId);
              return (
                <div key={item.id} className="bg-[#0f121a] border border-white/[0.08] rounded-2xl p-5 relative overflow-hidden group hover:border-white/[0.12] transition-colors">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex gap-2">
                      <span className="text-[10px] font-bold bg-white/[0.04] text-zinc-300 border border-white/[0.06] px-2.5 py-0.5 rounded-full">
                        {cat?.name || 'ไม่มีหมวดหมู่'}
                      </span>
                      <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${
                        item.type === 'premium' 
                          ? 'bg-amber-500/15 text-amber-400 border-amber-500/25' 
                          : 'bg-emerald-500/15 text-emerald-400 border-emerald-500/25'
                      }`}>
                        {item.type === 'premium' ? 'VIP Only' : 'Free'}
                      </span>
                    </div>
                    <button 
                      onClick={() => handleDeleteItem(item.id)} 
                      className="text-zinc-500 hover:text-rose-400 p-1 rounded-lg hover:bg-rose-500/10 transition-colors"
                      title="ลบรายการนี้"
                    >
                      <Trash2 className="w-4 h-4"/>
                    </button>
                  </div>
                  <h3 className="text-sm font-bold text-white mb-2">{item.title}</h3>
                  <div className="bg-[#121622]/60 border border-white/[0.06] rounded-xl p-3 space-y-1.5 max-h-32 overflow-y-auto">
                    {(item.attachments || []).map((att: any, i: number) => (
                      <div key={i} className="text-[11px] text-zinc-400 truncate flex items-center gap-1.5">
                        <span className="font-semibold text-zinc-500 uppercase text-[10px]">{att.type}:</span>
                        <span className="truncate select-all">{att.data}</span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
            {items.length === 0 && (
              <div className="col-span-full py-16 text-center text-xs text-zinc-500 bg-[#0f121a] border border-white/[0.08] rounded-2xl">
                ยังไม่มีรายการเนื้อหาในระบบ
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
