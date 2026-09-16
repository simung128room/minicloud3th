import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import { Database, Trash2, Edit2, ArrowLeft, Search, Package, Layers, Plus } from "lucide-react";
import Swal from "sweetalert2";

export default function AdminStockManagement({ products, categories, setProducts }: any) {
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [stockItems, setStockItems] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const ITEMS_PER_PAGE = 30;

  const productsByCategory = useMemo(() => {
    return categories.map((cat: any) => ({
      ...cat,
      products: products.filter((p: any) => p.category === cat.id || p.category === cat.name || p.category === cat.title)
    })).filter((cat: any) => cat.products.length > 0);
  }, [products, categories]);

  useEffect(() => {
    if (selectedProduct) {
      if (!selectedProduct.stockData) {
        setLoading(true);
        axios.get(`/api/products/${selectedProduct.id}/stock`)
          .then(res => {
             setStockItems(res.data.stockData || []);
          })
          .catch(err => {
             console.error("Failed to load stock data", err);
             Swal.fire({ title: 'เกิดข้อผิดพลาด', text: 'ไม่สามารถโหลดข้อมูลสต็อกได้', icon: 'error', background: '#0d1017', color: '#fff' });
          })
          .finally(() => {
             setLoading(false);
          });
      } else {
        setStockItems(selectedProduct.stockData || []);
      }
      setPage(1);
      setSearchTerm("");
    }
  }, [selectedProduct]);

  const handleSaveAllStock = async (newStockItems: string[]) => {
      try {
         setLoading(true);
         const payload = { ...selectedProduct, stockData: newStockItems, stock: newStockItems.length };
         await axios.put(`/api/products/${selectedProduct.id}`, payload);
         
         const fresh = await axios.get(`/api/products/${selectedProduct.id}`);
         setStockItems(fresh.data.stockData || []);
         setSelectedProduct(fresh.data);
         if (setProducts) {
             setProducts((prev: any[]) => prev.map((p: any) => p.id === selectedProduct.id ? fresh.data : p));
         }

         Swal.fire({
           title: 'บันทึกสำเร็จ', 
           icon: 'success', 
           toast: true, 
           position: 'top-end', 
           showConfirmButton: false, 
           timer: 1500,
           background: '#0d1017',
           color: '#fff'
         });
      } catch (err: any) {
         Swal.fire({ title: 'เกิดข้อผิดพลาด', text: err.message || 'ไม่สามารถบันทึกสต็อกได้', icon: 'error', background: '#0d1017', color: '#fff' });
      } finally {
         setLoading(false);
      }
  };

  const handleDelete = (originalIndex: number) => {
    Swal.fire({
      title: 'ต้องการลบใช่หรือไม่?',
      text: 'คุณกำลังจะลบข้อมูลสต็อกนี้ 1 แถว',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'ลบรายการนี้',
      cancelButtonText: 'ยกเลิก',
      background: '#0d1017',
      color: '#fff',
      confirmButtonColor: '#f43f5e'
    }).then((result) => {
      if (result.isConfirmed) {
         const newStock = [...stockItems];
         newStock.splice(originalIndex, 1);
         setStockItems(newStock);
         handleSaveAllStock(newStock);
      }
    });
  };

  const handleEdit = (originalIndex: number, val: string) => {
    Swal.fire({
      title: 'แก้ไขข้อมูลสต็อก',
      input: 'textarea',
      inputValue: val,
      showCancelButton: true,
      confirmButtonText: 'บันทึก',
      cancelButtonText: 'ยกเลิก',
      background: '#0d1017',
      color: '#fff',
      confirmButtonColor: '#3b82f6'
    }).then((result) => {
      if (result.isConfirmed && result.value) {
         const newStock = [...stockItems];
         newStock[originalIndex] = result.value;
         setStockItems(newStock);
         handleSaveAllStock(newStock);
      }
    });
  };

  const handleAddSingle = () => {
    Swal.fire({
      title: 'เพิ่มสต็อก 1 แถว',
      input: 'text',
      inputPlaceholder: 'user:pass หรือ คีย์สินค้า...',
      showCancelButton: true,
      confirmButtonText: 'เพิ่มสต็อก',
      cancelButtonText: 'ยกเลิก',
      background: '#0d1017',
      color: '#fff',
      confirmButtonColor: '#10b981'
    }).then((result) => {
      if (result.isConfirmed && result.value?.trim()) {
        const newStock = [...stockItems, result.value.trim()];
        setStockItems(newStock);
        handleSaveAllStock(newStock);
      }
    });
  };

  if (selectedProduct) {
    const filteredStock = stockItems.map((item, originalIndex) => ({ item, originalIndex })).filter(x => x.item.toLowerCase().includes(searchTerm.toLowerCase()));
    const totalPages = Math.ceil(filteredStock.length / ITEMS_PER_PAGE);
    const paginated = filteredStock.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);
    
    return (
      <div className="space-y-6">
        {/* Top Product Header */}
        <div className="bg-[#0f121a] border border-white/[0.08] rounded-2xl p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setSelectedProduct(null)} 
              className="w-10 h-10 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] flex items-center justify-center text-zinc-300 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Database className="w-5 h-5 text-blue-400" />
                สต็อก: {selectedProduct.name}
              </h2>
              <p className="text-xs text-zinc-400 mt-0.5">
                ทั้งหมด {stockItems.length} รายการ (ตรงกับคำค้น {filteredStock.length} รายการ)
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="relative flex-1 sm:w-64">
              <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input 
                type="text" 
                placeholder="ค้นหาข้อความสต็อก..."
                value={searchTerm}
                onChange={e => { setSearchTerm(e.target.value); setPage(1); }}
                className="w-full bg-[#151926] border border-white/[0.08] rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder:text-zinc-500 focus:outline-none focus:border-blue-500/60"
              />
            </div>
            <button
              onClick={handleAddSingle}
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all shadow-md shadow-emerald-500/20 flex items-center gap-1.5 shrink-0"
            >
              <Plus className="w-4 h-4" /> เพิ่มสต็อก
            </button>
          </div>
        </div>

        {/* Stock List */}
        <div className="bg-[#0f121a] border border-white/[0.08] rounded-2xl p-4 overflow-hidden">
          {loading ? (
            <div className="text-center py-16">
              <div className="animate-spin h-8 w-8 border-2 border-blue-500 border-t-transparent rounded-full mx-auto mb-3"></div>
              <p className="text-xs text-zinc-400 font-medium">กำลังโหลดข้อมูลสต็อก...</p>
            </div>
          ) : paginated.length === 0 ? (
            <div className="text-center py-16 text-zinc-500">
              <Database className="w-10 h-10 mx-auto mb-2 opacity-30" />
              <p className="text-xs">ไม่พบรายการสต็อก</p>
            </div>
          ) : (
            <div className="space-y-2">
              {paginated.map(({item, originalIndex}, idx) => (
                <div 
                  key={idx} 
                  className="flex items-center justify-between p-3.5 rounded-xl bg-[#151926]/60 border border-white/[0.06] hover:border-white/[0.12] transition-colors group"
                >
                  <div className="flex items-center gap-3 min-w-0 pr-4">
                    <span className="text-[11px] font-mono text-zinc-500 w-8 shrink-0">
                      #{(page - 1) * ITEMS_PER_PAGE + idx + 1}
                    </span>
                    <span className="text-xs font-mono text-zinc-200 truncate select-all">
                      {item}
                    </span>
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    <button 
                      onClick={() => handleEdit(originalIndex, item)} 
                      className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-white/[0.06] transition-colors"
                      title="แก้ไขแถวนี้"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => handleDelete(originalIndex)} 
                      className="p-1.5 rounded-lg text-zinc-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                      title="ลบแถวนี้"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {totalPages > 1 && (
            <div className="flex items-center justify-between pt-4 mt-4 border-t border-white/[0.06]">
              <button 
                onClick={() => setPage(p => Math.max(1, p - 1))} 
                disabled={page === 1} 
                className="px-4 py-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-zinc-300 text-xs font-semibold disabled:opacity-30 disabled:cursor-not-allowed border border-white/[0.06]"
              >
                หน้าก่อนหน้า
              </button>
              <span className="text-xs text-zinc-400 font-mono">
                หน้า {page} / {totalPages}
              </span>
              <button 
                onClick={() => setPage(p => Math.min(totalPages, p + 1))} 
                disabled={page === totalPages} 
                className="px-4 py-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-zinc-300 text-xs font-semibold disabled:opacity-30 disabled:cursor-not-allowed border border-white/[0.06]"
              >
                หน้าถัดไป
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Overview Banner */}
      <div className="bg-[#0f121a] border border-white/[0.08] rounded-2xl p-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
            <Database className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white">จัดการสต็อกสินค้าแยกตามหมวดหมู่</h2>
            <p className="text-xs text-zinc-400">คลิกที่สินค้าเพื่อตรวจสอบ ค้นหา และแก้ไขรายการรหัสสต็อก</p>
          </div>
        </div>
      </div>

      {productsByCategory.length === 0 ? (
        <div className="bg-[#0f121a] border border-white/[0.08] rounded-2xl p-12 text-center text-zinc-500">
          <Package className="w-12 h-12 mx-auto mb-3 opacity-30" />
          <p className="text-xs">ยังไม่มีสินค้าในระบบ</p>
        </div>
      ) : (
        <div className="space-y-6">
          {productsByCategory.map((cat: any) => (
            <div key={cat.id} className="bg-[#0f121a] border border-white/[0.08] rounded-2xl p-6">
              <div className="flex items-center gap-2 mb-4">
                <Layers className="w-4 h-4 text-blue-400" />
                <h3 className="text-sm font-bold text-white">{cat.title || cat.name}</h3>
                <span className="text-[11px] text-zinc-500 font-mono">({cat.products.length} สินค้า)</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {cat.products.map((p: any) => {
                  const stockCount = p.stockData?.length || p.stock || 0;
                  return (
                    <div 
                      key={p.id} 
                      onClick={() => setSelectedProduct(p)} 
                      className="p-4 rounded-xl bg-[#121622]/60 border border-white/[0.06] hover:border-blue-500/30 cursor-pointer hover:bg-[#151926] transition-all flex items-center justify-between group"
                    >
                      <div className="min-w-0 pr-3">
                        <p className="font-bold text-xs text-white truncate group-hover:text-blue-400 transition-colors">
                          {p.name}
                        </p>
                        <div className="flex items-center gap-2 mt-2">
                          <span className={`text-[10px] font-bold font-mono px-2 py-0.5 rounded-md flex items-center gap-1 ${
                            stockCount > 0 
                              ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/25' 
                              : 'bg-rose-500/15 text-rose-400 border border-rose-500/25'
                          }`}>
                            <Database className="w-3 h-3" /> {stockCount} ชิ้น
                          </span>
                        </div>
                      </div>

                      <div className="w-8 h-8 rounded-lg bg-white/[0.04] border border-white/[0.06] flex items-center justify-center text-zinc-400 group-hover:text-white group-hover:bg-blue-600 transition-all shrink-0">
                        <Edit2 className="w-3.5 h-3.5" />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
