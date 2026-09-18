import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Folder, Lock, Search, Download, FileText, Image as ImageIcon, ChevronRight, Gift, X, Copy, Check } from 'lucide-react';
import Swal from 'sweetalert2';
import axios from 'axios';
import { LogCategory, ContentItem, AdminToolsManagement } from './AdminToolsManagement';

interface LogCategoriesViewProps {
  userPlan: any;
  onNavigateAction: (action: string) => void;
  filterType?: 'all' | 'vip' | 'free';
  isAdmin?: boolean;
}

function getSafeUrl(url: string | undefined): string | null {
  if (!url) return null;
  const trimmed = url.trim();
  if (/^https?:\/\//i.test(trimmed) || /^data:image\/(png|jpeg|jpg|webp|gif);base64,/i.test(trimmed)) {
    return trimmed;
  }
  return null;
}

export const LogCategoriesView: React.FC<LogCategoriesViewProps> = ({ userPlan, filterType = 'all', isAdmin = false }) => {
  const [categories, setCategories] = useState<LogCategory[]>([]);
  const [items, setItems] = useState<ContentItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<LogCategory | null>(null);
  const [search, setSearch] = useState('');
  const [isVip, setIsVip] = useState(false);
  const [showAdmin, setShowAdmin] = useState(false);
  const [activeModalItem, setActiveModalItem] = useState<ContentItem | null>(null);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get('/api/logs-system');
        setCategories((res.data.categories || []).filter((c: any) => c.isVisible));
        setItems(res.data.items || []);
        setIsVip(res.data.isVip || false);
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, []);

  const handleOpenItem = (item: ContentItem) => {
    if (item.type === 'premium' && !isVip) {
       Swal.fire({
          icon: 'warning',
          title: 'สำหรับสมาชิก VIP เท่านั้น!',
          text: 'คุณต้องเป็น VIP จึงจะสามารถดูหรือดาวน์โหลดได้',
          background: '#09090b',
          color: '#fff',
          confirmButtonText: 'ตกลง',
          confirmButtonColor: '#2563EB'
       });
       return;
    }

    if (!item.attachments || item.attachments.length === 0) {
        Swal.fire({
            icon: 'error',
            title: 'ไม่พบเนื้อหา',
            text: 'ถูกซ่อนหรือไม่มีข้อมูล',
            background: '#09090b',
            color: '#fff'
        });
        return;
    }

    setActiveModalItem(item);
  };

  const handleCopyText = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  useEffect(() => {
    setSelectedCategory(null);
  }, [filterType]);

  const currentItems = selectedCategory 
    ? items.filter(i => i.categoryId === selectedCategory.id && i.title.toLowerCase().includes(search.toLowerCase()))
    : [];

  const filteredCategories = categories.filter(c => {
    if (filterType === 'vip') return c.isVip;
    if (filterType === 'free') return !c.isVip;
    return true;
  });

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 pt-24">
       <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
         <div>
            <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight flex items-center gap-3">
              <Gift className="w-8 h-8 text-[#2563EB]" /> {filterType === 'vip' ? 'VIP PH LOG' : filterType === 'free' ? 'FREE FH LOG' : 'ทรัพยากร / เครื่องมือ'}
            </h1>
            <p className="text-sm font-medium text-muted-foreground mt-2">ดาวน์โหลดไฟล์และเอกสารฟรี & พรีเมียม</p>
         </div>
         {isAdmin && (
           <button onClick={() => setShowAdmin(!showAdmin)} className="flex bg-card text-white px-4 py-2 text-sm font-bold self-start md:self-auto hover:-translate-y-1 transition-all brut-card rounded-xl">
              {showAdmin ? 'ปิดจัดการเนื้อหา' : 'เพิ่มเนื้อหา (แอดมิน)'}
           </button>
         )}
       </div>

       {showAdmin ? (
         <div className="bg-card border border-border border-2 p-4 sm:p-6 mb-8 brut-card rounded-2xl">
           <AdminToolsManagement />
         </div>
       ) : selectedCategory ? (
         <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
            <div className="flex items-center gap-4 mb-6">
               <button onClick={() => setSelectedCategory(null)} className="px-4 py-2 bg-card hover:bg-white/10 border border-border border-2 text-white font-bold text-sm brut-card rounded-xl">
                 กลับ
               </button>
               <h2 className="text-xl font-bold text-white flex items-center gap-2">
                 {selectedCategory.name}
                 {selectedCategory.isVip && <span className="bg-amber-500/20 text-amber-400 px-2 py-0.5 text-[10px] uppercase">VIP</span>}
               </h2>
               <div className="ml-auto w-48 relative">
                 <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                 <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="ค้นหา..." className="w-full bg-card border border-border border-2 pl-9 pr-4 py-2 text-sm text-white brut-card rounded-xl" />
               </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {currentItems.map((item) => {
                 const isLocked = item.type === 'premium' && !isVip;
                 return (
                    <div key={item.id} onClick={() => handleOpenItem(item)} className={`bg-card border border-border border-2 p-5 cursor-pointer hover:border-[#3B82F6]/30 transition-all ${isLocked ? 'opacity-80' : 'hover:-translate-y-1 brut-card'}`}>
                      <div className="flex justify-between items-start mb-3">
                        <span className={`text-[10px] font-bold px-2 py-0.5 uppercase ${item.type === 'premium' ? 'bg-amber-500/20 text-amber-400' : 'bg-blue-600/20 text-blue-600'}`}>
                          {item.type === 'premium' ? 'Premium' : 'Free'}
                        </span>
                        {isLocked ? <Lock className="w-4 h-4 text-muted-foreground"/> : <Download className="w-4 h-4 text-[#2563EB]"/>}
                      </div>
                      <h3 className="text-lg font-bold text-white mb-2">{item.title}</h3>
                      {item.keyword && <span className="text-[10px] text-muted-foreground font-medium">#{item.keyword}</span>}
                   </div>
                 );
              })}
              {currentItems.length === 0 && <div className="col-span-full py-12 text-center text-muted-foreground">ไม่พบเนื้อหาในหมวดหมู่นี้</div>}
            </div>
         </motion.div>
       ) : (
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
           <AnimatePresence>
             {filteredCategories.sort((a,b)=>a.order-b.order).map((c, i) => {
               const catItemsCount = items.filter(it => it.categoryId === c.id).length;
               return (
                 <motion.div
                   key={c.id} 
                   initial={{ opacity: 0, y: 20 }}
                   animate={{ opacity: 1, y: 0 }}
                   transition={{ delay: i * 0.05 }}
                   onClick={() => { setSelectedCategory(c); setSearch(''); }}
                   className="bg-card border border-border border-2 hover:border-[#2563EB]/30 overflow-hidden transition-all cursor-pointer group flex flex-col pt-2 brut-card rounded-xl"
                 >
                   <div className="p-6 flex-1 flex flex-col">
                      <div className="flex items-center justify-between mb-4">
                        <div className="w-12 h-12 bg-card border border-border border-2 flex items-center justify-center text-[#2563EB] group-hover:scale-110 transition-transform brut-card rounded-xl">
                          <Folder className="w-6 h-6" />
                        </div>
                        {c.isVip && <span className="bg-amber-500/10 text-amber-500 border border-amber-500/20 px-3 py-1 text-xs font-black uppercase tracking-wider">VIP</span>}
                      </div>
                      <h2 className="text-xl font-black text-white group-hover:text-[#2563EB] transition-colors tracking-tight">{c.name}</h2>
                      <p className="text-sm text-muted-foreground mt-1 mb-4 flex-1">{c.subtitle}</p>
                      
                      <div className="w-full flex items-center justify-between pt-4 border-t border-border border-2 mt-auto">
                        <span className="text-xs font-bold text-muted-foreground">{catItemsCount} รายการ</span>
                        <div className="w-8 h-8 bg-card flex items-center justify-center text-muted-foreground group-hover:bg-purple-600/10 group-hover:text-[#2563EB] transition-all brut-card rounded-xl">
                          <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-all" />
                        </div>
                      </div>
                   </div>
                 </motion.div>
               );
             })}
           </AnimatePresence>
         </div>
       )}

       {/* Safe React Attachment Modal (Immune to DOM XSS) */}
       <AnimatePresence>
         {activeModalItem && (
           <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm" role="dialog" aria-modal="true">
             <motion.div 
               initial={{ opacity: 0, scale: 0.95 }}
               animate={{ opacity: 1, scale: 1 }}
               exit={{ opacity: 0, scale: 0.95 }}
               className="bg-[#09090b] border border-white/10 rounded-2xl w-full max-w-xl max-h-[85vh] flex flex-col overflow-hidden shadow-2xl"
             >
               {/* Header */}
               <div className="flex items-center justify-between p-5 border-b border-white/10">
                 <h2 className="text-lg font-bold text-white truncate pr-4">{activeModalItem.title}</h2>
                 <button 
                   onClick={() => setActiveModalItem(null)} 
                   className="text-zinc-400 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-all"
                   aria-label="ปิด"
                 >
                   <X className="w-5 h-5" />
                 </button>
               </div>

               {/* Attachments list */}
               <div className="p-5 overflow-y-auto space-y-4 flex-1">
                 {activeModalItem.attachments?.map((att: any, idx: number) => {
                   const safeUrl = getSafeUrl(att.data);
                   
                   if (att.type === 'image') {
                     return (
                       <div key={idx} className="rounded-xl overflow-hidden border border-white/10 bg-black/40">
                         {safeUrl ? (
                           <img 
                             loading="lazy" 
                             src={safeUrl} 
                             alt={activeModalItem.title} 
                             className="w-full object-contain max-h-80"
                             referrerPolicy="no-referrer"
                           />
                         ) : (
                           <div className="p-4 text-xs text-zinc-500 text-center">URL รูปภาพไม่ปลอดภัยหรือไม่ถูกต้อง</div>
                         )}
                       </div>
                     );
                   }

                   if (att.type === 'file') {
                     return (
                       <div key={idx}>
                         {safeUrl ? (
                           <a 
                             href={safeUrl} 
                             target="_blank" 
                             rel="noopener noreferrer"
                             className="flex items-center justify-center gap-2 w-full py-3 bg-[#2563EB] hover:bg-blue-500 text-white rounded-xl text-center font-bold transition-all shadow-lg shadow-blue-600/20"
                           >
                             <Download className="w-4 h-4" /> ดาวน์โหลดไฟล์
                           </a>
                         ) : (
                           <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-400 text-xs rounded-xl text-center font-medium">
                             ลิงก์ไฟล์ไม่ถูกต้อง
                           </div>
                         )}
                       </div>
                     );
                   }

                   // Plain text / Account data
                   return (
                     <div key={idx} className="relative bg-[#0d0d10] border border-white/10 rounded-xl p-4">
                       <div className="flex items-center justify-between mb-2">
                         <span className="text-xs font-semibold text-zinc-400 flex items-center gap-1.5">
                           <FileText className="w-3.5 h-3.5 text-blue-400" /> ข้อมูลเนื้อหา
                         </span>
                         <button
                           onClick={() => handleCopyText(att.data || '', idx)}
                           className="flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-zinc-300 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg transition-all"
                         >
                           {copiedIndex === idx ? (
                             <>
                               <Check className="w-3.5 h-3.5 text-green-400" />
                               <span className="text-green-400">คัดลอกแล้ว</span>
                             </>
                           ) : (
                             <>
                               <Copy className="w-3.5 h-3.5" />
                               <span>คัดลอก</span>
                             </>
                           )}
                         </button>
                       </div>
                       <pre className="text-xs font-mono text-zinc-200 whitespace-pre-wrap break-all select-all max-h-48 overflow-y-auto bg-black/40 p-3 rounded-lg border border-white/5">
                         {att.data || '(ไม่มีข้อมูล)'}
                       </pre>
                     </div>
                   );
                 })}
               </div>

               {/* Footer */}
               <div className="p-4 border-t border-white/10 bg-black/20 flex justify-end">
                 <button 
                   onClick={() => setActiveModalItem(null)}
                   className="px-5 py-2 bg-white/10 hover:bg-white/20 text-white font-medium text-xs rounded-xl transition-all"
                 >
                   ปิด
                 </button>
               </div>
             </motion.div>
           </div>
         )}
       </AnimatePresence>
    </div>
  );
};
