import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Package, Plus, Trash2, Edit, Save, X, Image as ImageIcon, ShoppingCart, Check, Loader2, Layers, Search } from 'lucide-react';
import Swal from 'sweetalert2';
import { Category, Product } from '../types';
import { motion, AnimatePresence } from 'motion/react';

interface AdminCategoriesManagementProps {
  categories: Category[];
  setCategories: (categories: Category[]) => void;
  products?: Product[];
  setProducts?: (products: Product[]) => void;
}

export const AdminCategoriesManagement: React.FC<AdminCategoriesManagementProps> = ({ 
  categories, 
  setCategories, 
  products = [], 
  setProducts 
}) => {
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [formData, setFormData] = useState<Partial<Category>>({
    name: '', title: '', subtitle: '', bannerUrl: ''
  });

  const [managingProductsForCategory, setManagingProductsForCategory] = useState<Category | null>(null);
  const [selectedProductIds, setSelectedProductIds] = useState<Set<string>>(new Set());
  const [isUpdatingProducts, setIsUpdatingProducts] = useState(false);
  const [categorySearch, setCategorySearch] = useState('');

  useEffect(() => {
    if (managingProductsForCategory) {
      const initialIds = products.filter(p => p.category === managingProductsForCategory.id || p.category === managingProductsForCategory.name || p.category === managingProductsForCategory.title).map(p => p.id);
      setSelectedProductIds(new Set(initialIds));
    }
  }, [managingProductsForCategory, products]);

  const toggleProductSelection = (productId: string) => {
    setSelectedProductIds(prev => {
      const newSet = new Set(prev);
      if (newSet.has(productId)) {
        newSet.delete(productId);
      } else {
        newSet.add(productId);
      }
      return newSet;
    });
  };

  const saveCategoryProducts = async () => {
    if (!managingProductsForCategory || !setProducts) return;
    
    setIsUpdatingProducts(true);
    try {
      const oldProductIdList = products.filter(p => p.category === managingProductsForCategory.id || p.category === managingProductsForCategory.name || p.category === managingProductsForCategory.title).map(p => p.id);
      const oldProductIds = new Set(oldProductIdList);
      
      const idsToAddCategory = Array.from(selectedProductIds).filter(id => !oldProductIds.has(id));
      const idsToRemoveCategory = oldProductIdList.filter(id => !selectedProductIds.has(id));
      
      const updatedProducts = [...products];
      const updatePromises = [];

      for (const id of idsToAddCategory) {
        updatePromises.push(
          axios.put(`/api/products/${id}`, { category: managingProductsForCategory.id }).then(() => {
            const pIndex = updatedProducts.findIndex(p => p.id === id);
            if(pIndex > -1) updatedProducts[pIndex] = { ...updatedProducts[pIndex], category: managingProductsForCategory.id };
          })
        );
      }
      for (const id of idsToRemoveCategory) {
        updatePromises.push(
          axios.put(`/api/products/${id}`, { category: '' }).then(() => {
            const pIndex = updatedProducts.findIndex(p => p.id === id);
            if(pIndex > -1) updatedProducts[pIndex] = { ...updatedProducts[pIndex], category: '' };
          })
        );
      }
      
      await Promise.all(updatePromises);
      setProducts(updatedProducts);
      Swal.fire({ title: 'สำเร็จ', text: 'อัปเดตสินค้าในหมวดหมู่เรียบร้อย', icon: 'success', background: '#0d1017', color: '#fff', timer: 1500, showConfirmButton: false });
      setManagingProductsForCategory(null);
    } catch (err) {
      Swal.fire({ title: 'ข้อผิดพลาด', text: 'ไม่สามารถอัปเดตข้อมูลสินค้าได้', icon: 'error', background: '#0d1017', color: '#fff' });
    } finally {
      setIsUpdatingProducts(false);
    }
  };

  const saveCategory = async () => {
    if (!formData.name || !formData.title) {
      Swal.fire({ title: 'ข้อมูลไม่ครบ', text: 'กรุณากรอกชื่ออ้างอิงภาษาอังกฤษและชื่อหมวดหมู่ที่แสดง', icon: 'warning', background: '#0d1017', color: '#fff' });
      return;
    }
    
    try {
      if (editingCategory) {
        const res = await axios.put(`/api/categories/${editingCategory.id}`, formData);
        setCategories(categories.map(c => c.id === editingCategory.id ? res.data : c));
        setEditingCategory(null);
      } else {
        const res = await axios.post('/api/categories', formData);
        setCategories([res.data, ...categories]);
        setIsAdding(false);
      }
      setFormData({ name: '', title: '', subtitle: '', bannerUrl: '' });
      Swal.fire({ title: 'สำเร็จ', text: 'บันทึกหมวดหมู่เรียบร้อย', icon: 'success', background: '#0d1017', color: '#fff', timer: 1500, showConfirmButton: false });
    } catch (err) {
      Swal.fire({ title: 'Error', text: 'ไม่สามารถบันทึกได้', icon: 'error', background: '#0d1017', color: '#fff' });
    }
  };

  const deleteCategory = async (id: string) => {
    Swal.fire({
      title: 'ยืนยันการลบหมวดหมู่',
      text: 'คุณต้องการลบหมวดหมู่นี้ใช่หรือไม่? สินค้าในหมวดหมู่นี้จะถูกย้ายเป็นไม่มีหมวดหมู่',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'ลบหมวดหมู่',
      cancelButtonText: 'ยกเลิก',
      confirmButtonColor: '#f43f5e',
      background: '#0d1017',
      color: '#fff'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.delete(`/api/categories/${id}`);
          setCategories(categories.filter(c => c.id !== id));
          Swal.fire({ title: 'ลบสำเร็จ', icon: 'success', background: '#0d1017', color: '#fff', timer: 1500, showConfirmButton: false });
        } catch (err) {
          Swal.fire({ title: 'Error', text: 'ไม่สามารถลบหมวดหมู่ได้', icon: 'error', background: '#0d1017', color: '#fff' });
        }
      }
    });
  };

  const filteredCategories = categories.filter(c => 
    (c.title || '').toLowerCase().includes(categorySearch.toLowerCase()) ||
    (c.name || '').toLowerCase().includes(categorySearch.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Top Header Card */}
      <div className="bg-[#0f121a] border border-white/[0.08] rounded-2xl p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white">จัดการหมวดหมู่สินค้า</h2>
            <p className="text-xs text-zinc-400">ทั้งหมด {categories.length} หมวดหมู่สำหรับจัดระเบียบร้านค้า</p>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-60">
            <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input 
              type="text" 
              placeholder="ค้นหาหมวดหมู่..."
              value={categorySearch}
              onChange={e => setCategorySearch(e.target.value)}
              className="w-full bg-[#151926] border border-white/[0.08] rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder:text-zinc-500 focus:outline-none focus:border-blue-500/60"
            />
          </div>
          <button 
            onClick={() => { 
              setIsAdding(true); 
              setEditingCategory(null);
              setFormData({ name: '', title: '', subtitle: '', bannerUrl: '' }); 
            }}
            className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all shadow-md shadow-blue-500/20 flex items-center gap-1.5 shrink-0"
          >
            <Plus className="w-4 h-4" /> เพิ่มหมวดหมู่
          </button>
        </div>
      </div>

      {/* Categories Table */}
      <div className="rounded-2xl bg-[#0f121a] border border-white/[0.08] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-zinc-300">
            <thead className="text-[11px] uppercase tracking-wider text-zinc-400 bg-white/[0.02] border-b border-white/[0.06] font-semibold">
              <tr>
                <th className="px-5 py-3.5">แบนเนอร์</th>
                <th className="px-5 py-3.5">ชื่อหมวดหมู่</th>
                <th className="px-5 py-3.5">รายละเอียด</th>
                <th className="px-5 py-3.5 text-center">จำนวนสินค้า</th>
                <th className="px-5 py-3.5 text-right">การจัดการ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04]">
              {filteredCategories.length > 0 ? filteredCategories.map((c) => {
                const count = products.filter(p => p.category === c.id || p.category === c.name || p.category === c.title).length;
                return (
                  <tr key={c.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="px-5 py-3.5">
                      {c.bannerUrl ? (
                        <div className="w-20 h-12 rounded-xl overflow-hidden border border-white/[0.08] bg-[#151926]">
                          <img src={c.bannerUrl} alt={c.title} className="w-full h-full object-cover" />
                        </div>
                      ) : (
                        <div className="w-20 h-12 rounded-xl bg-white/[0.04] border border-white/[0.08] flex items-center justify-center text-zinc-500">
                          <ImageIcon className="w-4 h-4" />
                        </div>
                      )}
                    </td>
                    <td className="px-5 py-3.5">
                      <div>
                        <span className="font-bold text-white text-xs">{c.title}</span>
                        <div className="flex items-center gap-1 mt-0.5">
                          <span className="font-mono text-[10px] text-zinc-400 bg-white/[0.04] px-1.5 py-0.2 rounded border border-white/[0.06]">
                            {c.name}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3.5">
                      <p className="text-xs text-zinc-400 max-w-xs truncate">
                        {c.subtitle || <span className="text-zinc-600 italic">ไม่มีรายละเอียด</span>}
                      </p>
                    </td>
                    <td className="px-5 py-3.5 text-center font-mono">
                      <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">
                        {count} ชิ้น
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button 
                          onClick={() => setManagingProductsForCategory(c)} 
                          className="px-3 py-1.5 rounded-xl bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 text-xs font-semibold flex items-center gap-1.5 transition-colors border border-blue-500/20"
                          title="จัดการสินค้าในหมวดหมู่นี้"
                        >
                          <ShoppingCart className="w-3.5 h-3.5" />
                          <span className="hidden sm:inline">จัดสินค้า</span>
                        </button>
                        <button 
                          onClick={() => { 
                            setEditingCategory(c); 
                            setFormData(c); 
                            setIsAdding(false); 
                          }} 
                          className="p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-white/[0.04] transition-colors"
                          title="แก้ไขหมวดหมู่"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => deleteCategory(c.id)} 
                          className="p-2 rounded-xl text-zinc-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                          title="ลบหมวดหมู่"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              }) : (
                <tr>
                  <td colSpan={5} className="p-12 text-center text-xs text-zinc-500">
                    ไม่พบหมวดหมู่สินค้าในระบบ
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create / Edit Category Modal */}
      {(isAdding || editingCategory) && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-[100]" onClick={() => { setIsAdding(false); setEditingCategory(null); }}>
          <motion.div 
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            className="bg-[#0f121a] border border-white/[0.1] w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden"
            onClick={e => e.stopPropagation()}
          >
            <div className="p-6 border-b border-white/[0.08] flex items-center justify-between bg-[#121622]/60">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
                  {editingCategory ? <Edit className="w-5 h-5" /> : <Layers className="w-5 h-5" />}
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">
                    {editingCategory ? 'แก้ไขหมวดหมู่สินค้า' : 'สร้างหมวดหมู่ใหม่'}
                  </h3>
                  <p className="text-xs text-zinc-400">ระบุชื่อและรูปภาพแบนเนอร์ของหมวดหมู่นี้</p>
                </div>
              </div>
              <button 
                onClick={() => { setIsAdding(false); setEditingCategory(null); }} 
                className="w-9 h-9 rounded-xl flex items-center justify-center text-zinc-400 hover:text-white hover:bg-white/[0.06]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                  ชื่ออ้างอิงระบบ (Slug / System Name) <span className="text-red-400">*</span>
                </label>
                <input 
                  type="text" 
                  value={formData.name || ''} 
                  onChange={e => setFormData({...formData, name: e.target.value})} 
                  className="w-full bg-[#151926] border border-white/[0.08] rounded-xl px-4 py-2.5 text-xs text-white placeholder:text-zinc-600 focus:outline-none focus:border-blue-500 font-mono" 
                  placeholder="เช่น valorant_accounts" 
                />
                <p className="text-[11px] text-zinc-500 mt-1">ใช้ภาษาอังกฤษ ตัวพิมพ์เล็ก และเครื่องหมายขีดล่าง _</p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                  ชื่อหมวดหมู่ที่แสดงให้ลูกค้าเห็น <span className="text-red-400">*</span>
                </label>
                <input 
                  type="text" 
                  value={formData.title || ''} 
                  onChange={e => setFormData({...formData, title: e.target.value})} 
                  className="w-full bg-[#151926] border border-white/[0.08] rounded-xl px-4 py-2.5 text-xs text-white placeholder:text-zinc-600 focus:outline-none focus:border-blue-500" 
                  placeholder="เช่น ไอดีเกม Valorant สกินครบ" 
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1.5">คำอธิบายหมวดหมู่ (Subtitle)</label>
                <textarea 
                  value={formData.subtitle || ''} 
                  onChange={e => setFormData({...formData, subtitle: e.target.value})} 
                  className="w-full bg-[#151926] border border-white/[0.08] rounded-xl px-4 py-2.5 text-xs text-white placeholder:text-zinc-600 focus:outline-none focus:border-blue-500 h-20 resize-none" 
                  placeholder="ข้อความบรรยายเพิ่มเติม..." 
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1.5">URL รูปภาพแบนเนอร์หน้าปก</label>
                <input 
                  type="text" 
                  value={formData.bannerUrl || ''} 
                  onChange={e => setFormData({...formData, bannerUrl: e.target.value})} 
                  className="w-full bg-[#151926] border border-white/[0.08] rounded-xl px-4 py-2.5 text-xs text-white placeholder:text-zinc-600 focus:outline-none focus:border-blue-500" 
                  placeholder="https://..." 
                />
                {formData.bannerUrl && (
                  <div className="mt-2.5 h-28 rounded-xl overflow-hidden border border-white/[0.08] bg-[#151926]">
                    <img src={formData.bannerUrl} alt="Preview" className="w-full h-full object-cover" />
                  </div>
                )}
              </div>
            </div>

            <div className="p-6 border-t border-white/[0.08] flex items-center justify-end gap-3 bg-[#121622]/60">
              <button 
                type="button" 
                onClick={() => { setIsAdding(false); setEditingCategory(null); }}
                className="px-5 py-2.5 rounded-xl border border-white/[0.08] hover:bg-white/[0.05] text-zinc-300 text-xs font-semibold"
              >
                ยกเลิก
              </button>
              <button 
                type="button"
                onClick={saveCategory}
                className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all shadow-md shadow-blue-500/20 flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                {editingCategory ? 'บันทึกหมวดหมู่' : 'สร้างหมวดหมู่'}
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Managing Products in Category Modal */}
      {managingProductsForCategory && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-[100]" onClick={() => setManagingProductsForCategory(null)}>
          <motion.div 
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            className="bg-[#0f121a] border border-white/[0.1] w-full max-w-xl max-h-[85vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden"
            onClick={e => e.stopPropagation()}
          >
            <div className="p-6 border-b border-white/[0.08] flex items-center justify-between bg-[#121622]/60">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
                  <ShoppingCart className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">จัดการสินค้าในหมวดหมู่</h3>
                  <p className="text-xs text-zinc-400">
                    เลือกสินค้าให้แสดงใน: <span className="text-blue-400 font-bold">{managingProductsForCategory.title}</span>
                  </p>
                </div>
              </div>
              <button 
                onClick={() => setManagingProductsForCategory(null)} 
                className="w-9 h-9 rounded-xl flex items-center justify-center text-zinc-400 hover:text-white hover:bg-white/[0.06]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-2.5 flex-1">
              {products.length === 0 ? (
                <div className="text-center py-12 text-zinc-500 text-xs">
                  ยังไม่มีสินค้าในระบบ กรุณาเพิ่มสินค้าก่อน
                </div>
              ) : (
                products.map((p) => {
                  const isChecked = selectedProductIds.has(p.id);
                  return (
                    <div 
                      key={p.id} 
                      onClick={() => toggleProductSelection(p.id)}
                      className={`flex items-center gap-3.5 p-3.5 rounded-xl border cursor-pointer transition-all ${
                        isChecked 
                          ? 'bg-blue-600/10 border-blue-500/30' 
                          : 'bg-[#151926]/50 border-white/[0.06] hover:bg-[#151926]'
                      }`}
                    >
                      <div className={`w-5 h-5 rounded-lg flex items-center justify-center shrink-0 border transition-colors ${
                        isChecked ? 'bg-blue-600 border-blue-500 text-white' : 'border-white/[0.2] bg-white/[0.03]'
                      }`}>
                        {isChecked && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                      </div>
                      {p.imageUrl ? (
                        <img src={p.imageUrl} alt={p.name} className="w-10 h-10 rounded-lg object-cover bg-black/40 border border-white/[0.06]" />
                      ) : (
                        <div className="w-10 h-10 rounded-lg bg-white/[0.04] border border-white/[0.06] flex items-center justify-center text-zinc-500">
                          <Package className="w-4 h-4" />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold text-white truncate">{p.name}</p>
                        <p className="text-[11px] text-emerald-400 font-mono mt-0.5">฿{(p.price || 0).toLocaleString()}</p>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            <div className="p-6 border-t border-white/[0.08] flex items-center justify-end gap-3 bg-[#121622]/60">
              <button 
                type="button"
                onClick={() => setManagingProductsForCategory(null)} 
                className="px-5 py-2.5 rounded-xl border border-white/[0.08] hover:bg-white/[0.05] text-zinc-300 text-xs font-semibold"
              >
                ยกเลิก
              </button>
              <button 
                type="button"
                onClick={saveCategoryProducts} 
                disabled={isUpdatingProducts}
                className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all shadow-md shadow-blue-500/20 flex items-center gap-2 disabled:opacity-50"
              >
                {isUpdatingProducts ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                บันทึกสินค้าในหมวดหมู่นี้
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};
