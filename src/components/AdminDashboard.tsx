import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Copy, Database, LogOut, BarChart3, Key, History, ShieldAlert, 
  Activity, Ban, ChevronRight, Settings, Plus, Trash2, X, Menu, 
  Upload, FileText, LayoutDashboard, LineChart, Cpu, HardDrive, 
  ShoppingCart, Package, Users, Gift, Globe, Phone, 
  AlertTriangle, Download, Check, Image as ImageIcon, MessageSquare, 
  RefreshCw, Sparkles, Search, CheckCircle2, ArrowRight
} from 'lucide-react';
import Swal from 'sweetalert2';
import axios from 'axios';
import { AccountResult, Product, SiteStats, Category } from '../types';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { DevLogo } from './DevLogo';
import { AdminUserManagement } from './AdminUserManagement';
import { AdminPagesManagement } from './AdminPagesManagement';
import { AdminCategoriesManagement } from './AdminCategoriesManagement';
import { AdminToolsManagement } from './AdminToolsManagement';
import AdminStockManagement from './AdminStockManagement';
import { AdminApiKeys } from './AdminApiKeys';
import { AdminOrdersManagement } from './AdminOrdersManagement';

interface AdminDashboardProps {
  totalChecked: number;
  validAccounts: AccountResult[];
  licenseKeys: any[];
  usedKeysHistory: any[];
  blockedIPs: any[];
  adminTab: string;
  setAdminTab: (tab: string) => void;
  products?: Product[];
  setProducts?: React.Dispatch<React.SetStateAction<Product[]>>;
  siteStats?: SiteStats;
  setSiteStats?: (stats: SiteStats) => void;
  customPages?: any[];
  setCustomPages?: React.Dispatch<React.SetStateAction<any[]>>;
  categories?: Category[];
  setCategories?: React.Dispatch<React.SetStateAction<any[]>>;
  usersList?: any[];
  onRefreshData?: () => void;
  isDBReady: boolean;
  dbErrorDetail?: string | null;
  adminUsername: string;
  setIsAdmin: (val: boolean) => void;
  addLicenseKey: () => void;
  blockIP: () => void;
  deleteKey: (id: string) => void;
  bulkDeleteKeys: () => void;
  unblockIP: (ip: string) => void;
  purchaseHistory?: any[];
  topupHistory?: any[];
  onBackToStore?: () => void;
}

/* =========================================================================
   Product Manager Modal
   ========================================================================= */
const ProductManagerModal = ({ 
  product, 
  onSave, 
  onClose, 
  isEdit, 
  categories = [] 
}: { 
  product?: Product; 
  onSave: (p: Product) => void; 
  onClose: () => void; 
  isEdit: boolean; 
  categories?: any[];
}) => {
  const [formData, setFormData] = useState<any>(product || {
    name: '',
    description: '',
    price: '',
    originalPrice: '',
    imageUrl: '',
    stock: 0,
    category: categories.length > 0 ? categories[0].id : '',
    tag: ''
  });

  const [saving, setSaving] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || formData.price === '' || formData.price === null || formData.price === undefined) {
      Swal.fire({
        title: 'ข้อมูลไม่ครบ',
        text: 'กรุณาระบุชื่อสินค้าและราคาปัจจุบัน',
        icon: 'warning',
        background: '#0d1017',
        color: '#fff',
        confirmButtonColor: '#3b82f6'
      });
      return;
    }

    setSaving(true);
    const p = {
      ...formData,
      price: Number(formData.price) || 0,
      originalPrice: Number(formData.originalPrice) || 0,
      stock: Number(formData.stock) || 0,
    };

    if (isEdit && product) {
      const delta: any = {};
      Object.keys(p).forEach((k) => {
        if (p[k] !== (product as any)[k]) {
          delta[k] = p[k];
        }
      });
      delta.id = product.id;
      delta._version = product._version || 0;
      onSave(delta as Product);
    } else {
      onSave(p as Product);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-[100]" onClick={onClose}>
      <motion.div 
        initial={{ opacity: 0, scale: 0.96, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 10 }}
        className="bg-[#0f121a] border border-white/[0.1] w-full max-w-xl max-h-[90vh] rounded-[32px] shadow-2xl flex flex-col overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="p-6 border-b border-white/[0.08] flex items-center justify-between bg-[#121622]/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
              <Package className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">
                {isEdit ? 'แก้ไขข้อมูลสินค้า' : 'เพิ่มสินค้าใหม่'}
              </h2>
              <p className="text-xs text-zinc-400">
                {isEdit ? 'ปรับปรุงรายละเอียด ราคา และหมวดหมู่ของสินค้า' : 'กรอกรายละเอียดเพื่อนำสินค้าเข้าสู่ระบบร้านค้า'}
              </p>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="w-9 h-9 rounded-full flex items-center justify-center text-zinc-400 hover:text-white hover:bg-white/[0.06] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-5 flex-1">
          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1.5">ชื่อสินค้า <span className="text-red-400">*</span></label>
            <input 
              type="text" 
              required
              value={formData.name} 
              onChange={e => setFormData({...formData, name: e.target.value})}
              className="w-full bg-[#151926] border border-white/[0.08] rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-blue-500/60 focus:ring-2 focus:ring-blue-500/20 transition-all"
              placeholder="เช่น ID RoV สกินระดับแรร์ หรือ บัตรสตรีม"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1.5">คำอธิบายรายละเอียด</label>
            <textarea 
              value={formData.description} 
              onChange={e => setFormData({...formData, description: e.target.value})}
              className="w-full bg-[#151926] border border-white/[0.08] rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-blue-500/60 focus:ring-2 focus:ring-blue-500/20 transition-all h-24 resize-none leading-relaxed"
              placeholder="ระบุสเปกหรือรายละเอียดสำคัญสำหรับผู้ซื้อ..."
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1.5">ราคาขายปัจจุบัน (THB) <span className="text-red-400">*</span></label>
              <input 
                type="number" 
                required
                min="0"
                step="any"
                value={formData.price} 
                onChange={e => setFormData({...formData, price: e.target.value === '' ? '' : Number(e.target.value)})}
                className="w-full bg-[#151926] border border-white/[0.08] rounded-xl px-4 py-2.5 text-sm text-emerald-400 font-semibold placeholder:text-zinc-600 focus:outline-none focus:border-blue-500/60 focus:ring-2 focus:ring-blue-500/20 transition-all"
                placeholder="0.00"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1.5">ราคาเต็มก่อนลด (ถ้ามี)</label>
              <input 
                type="number" 
                min="0"
                step="any"
                value={formData.originalPrice} 
                onChange={e => setFormData({...formData, originalPrice: e.target.value === '' ? '' : Number(e.target.value)})}
                className="w-full bg-[#151926] border border-white/[0.08] rounded-xl px-4 py-2.5 text-sm text-zinc-400 placeholder:text-zinc-600 focus:outline-none focus:border-blue-500/60 focus:ring-2 focus:ring-blue-500/20 transition-all"
                placeholder="0.00"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1.5">หมวดหมู่</label>
              <select 
                value={formData.category} 
                onChange={e => setFormData({...formData, category: e.target.value})}
                className="w-full bg-[#151926] border border-white/[0.08] rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500/60 focus:ring-2 focus:ring-blue-500/20 transition-all cursor-pointer"
              >
                <option value="">-- ไม่ระบุหมวดหมู่ --</option>
                {categories.map((cat: any) => (
                  <option key={cat.id} value={cat.id}>{cat.name || cat.title}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1.5">ป้ายกำกับพิเศษ (Badge)</label>
              <select 
                value={formData.tag || ''} 
                onChange={e => setFormData({...formData, tag: e.target.value})}
                className="w-full bg-[#151926] border border-white/[0.08] rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500/60 focus:ring-2 focus:ring-blue-500/20 transition-all cursor-pointer"
              >
                <option value="">ไม่มีป้าย</option>
                <option value="HOT">🔥 HOT</option>
                <option value="NEW">✨ NEW</option>
                <option value="แนะนำ">⭐ แนะนำ</option>
                <option value="ขายดี">👑 ขายดี</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1.5">URL รูปภาพสินค้า</label>
            <input 
              type="text" 
              value={formData.imageUrl} 
              onChange={e => setFormData({...formData, imageUrl: e.target.value})}
              className="w-full bg-[#151926] border border-white/[0.08] rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-blue-500/60 focus:ring-2 focus:ring-blue-500/20 transition-all"
              placeholder="https://..."
            />
            {formData.imageUrl && (
              <div className="mt-3 p-2 bg-[#151926] border border-white/[0.08] rounded-xl flex items-center justify-center overflow-hidden max-h-40">
                <img 
                  src={formData.imageUrl} 
                  alt="Preview" 
                  className="max-h-36 object-contain rounded-lg" 
                  onError={(e) => { (e.currentTarget as HTMLElement).style.display = 'none'; }} 
                />
              </div>
            )}
          </div>

          {/* Modal Footer */}
          <div className="pt-4 flex items-center justify-end gap-3 border-t border-white/[0.08]">
            <button 
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-full border border-white/[0.08] hover:bg-white/[0.05] text-zinc-300 text-xs font-semibold transition-colors cursor-pointer"
            >
              ยกเลิก
            </button>
            <button 
              type="submit"
              disabled={saving}
              className="px-6 py-2.5 rounded-full bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all shadow-lg shadow-blue-500/20 flex items-center gap-2 cursor-pointer active:scale-95"
            >
              <Check className="w-4 h-4" />
              {isEdit ? 'บันทึกการแก้ไข' : 'สร้างสินค้าใหม่'}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

/* =========================================================================
   Add Stock Modal
   ========================================================================= */
const AddStockModal = ({ 
  product, 
  onAppendStock, 
  onClose 
}: { 
  product: Product; 
  onAppendStock: (newItems: string[]) => void; 
  onClose: () => void; 
}) => {
  const [linesPerStock, setLinesPerStock] = useState(1);
  const [fileStockPreview, setFileStockPreview] = useState<string[]>([]);
  const [singleFilesPreview, setSingleFilesPreview] = useState<{name: string, b64: string}[]>([]);
  const [mode, setMode] = useState<'text' | 'file' | 'single-file'>('text');
  const [stockCount, setStockCount] = useState(0);
  const [isBigTextMode, setIsBigTextMode] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const singleFileRef = useRef<HTMLInputElement>(null);
  const textRef = useRef<HTMLTextAreaElement>(null);
  const largeTextRef = useRef<string>("");
  const [uploadProgress, setUploadProgress] = useState(-1);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadProgress(0);
    const reader = new FileReader();

    reader.onprogress = (event) => {
      if (event.lengthComputable) {
        const percentLoaded = Math.round((event.loaded / event.total) * 100);
        setUploadProgress(percentLoaded);
      }
    };

    reader.onload = (event) => {
      setUploadProgress(100);
      setTimeout(() => {
        const text = event.target?.result as string;
        if (text) {
          largeTextRef.current = text;
          let newlines = 0;
          for (let i = 0; i < text.length; i++) {
            if (text[i] === '\n') newlines++;
          }
          const linesCount = newlines + 1;
          setFileStockPreview(new Array(linesCount));
          setIsBigTextMode(true);
        }
        setUploadProgress(-1);
      }, 50);
    };
    reader.readAsText(file);
  };

  const handleSingleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileList = e.target.files;
    if (!fileList || fileList.length === 0) return;
    
    const maxFileSize = 5 * 1024 * 1024;
    const rejectedFiles: string[] = [];

    Array.from(fileList).forEach((file: File) => {
      if (file.size > maxFileSize) {
        rejectedFiles.push(file.name);
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        const b64 = event.target?.result as string;
        if (b64) {
          setSingleFilesPreview(prev => [...prev, {name: file.name, b64}]);
        }
      };
      reader.readAsDataURL(file);
    });

    if (rejectedFiles.length > 0) {
      Swal.fire({
        title: 'ไฟล์ใหญ่เกินกำหนด',
        text: `ไฟล์ ${rejectedFiles.join(', ')} มีขนาดเกิน 5MB`,
        icon: 'error',
        background: '#0d1017',
        color: '#fff'
      });
    }
  };

  const updateTextCount = () => {
    if (!textRef.current) return;
    const text = textRef.current.value.trim();
    if (!text) {
      setStockCount(0);
      return;
    }
    const lines = text.split('\n').filter(l => l.trim().length > 0);
    setStockCount(Math.ceil(lines.length / linesPerStock));
  };

  const handleSaveStock = () => {
    if (mode === 'text') {
      if (!textRef.current?.value.trim()) {
        Swal.fire({ title: 'ไม่มีข้อมูล', text: 'กรุณาวางข้อมูลสต๊อกอย่างน้อย 1 รายการ', icon: 'warning', background: '#0d1017', color: '#fff' });
        return;
      }
      const lines = textRef.current.value.split('\n').filter(l => l.trim().length > 0);
      const items: string[] = [];
      for (let i = 0; i < lines.length; i += linesPerStock) {
        items.push(lines.slice(i, i + linesPerStock).join('\n'));
      }
      onAppendStock(items);
    } else if (mode === 'file') {
      if (!largeTextRef.current.trim()) {
        Swal.fire({ title: 'ไม่มีข้อมูล', text: 'กรุณาอัปโหลดไฟล์ข้อความสต๊อก', icon: 'warning', background: '#0d1017', color: '#fff' });
        return;
      }
      const lines = largeTextRef.current.split('\n').filter(l => l.trim().length > 0);
      const items: string[] = [];
      for (let i = 0; i < lines.length; i += linesPerStock) {
        items.push(lines.slice(i, i + linesPerStock).join('\n'));
      }
      onAppendStock(items);
    } else if (mode === 'single-file') {
      if (singleFilesPreview.length === 0) {
        Swal.fire({ title: 'ไม่มีไฟล์', text: 'กรุณาเลือกไฟล์เพื่ออัปโหลด', icon: 'warning', background: '#0d1017', color: '#fff' });
        return;
      }
      const items = singleFilesPreview.map(f => `FILE:${f.name}::${f.b64}`);
      onAppendStock(items);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-[100]" onClick={onClose}>
      <motion.div 
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.96 }}
        className="bg-[#0f121a] border border-white/[0.1] w-full max-w-xl max-h-[90vh] rounded-[32px] shadow-2xl flex flex-col overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        <div className="p-6 border-b border-white/[0.08] flex items-center justify-between bg-[#121622]/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">เพิ่มสต๊อกสินค้า</h2>
              <p className="text-xs text-zinc-400">{product.name} (คงเหลือ {product.stock} ชิ้น)</p>
            </div>
          </div>
          <button onClick={onClose} className="w-9 h-9 rounded-full flex items-center justify-center text-zinc-400 hover:text-white hover:bg-white/[0.06] cursor-pointer transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto space-y-5 flex-1">
          {/* Mode Selector Tabs */}
          <div className="flex bg-[#151926] p-1 rounded-full border border-white/[0.08]">
            <button 
              onClick={() => setMode('text')} 
              className={`flex-1 py-2 text-xs font-semibold rounded-full transition-all cursor-pointer ${mode === 'text' ? 'bg-blue-600 text-white shadow' : 'text-zinc-400 hover:text-white'}`}
            >
              วางข้อความ (Text)
            </button>
            <button 
              onClick={() => setMode('file')} 
              className={`flex-1 py-2 text-xs font-semibold rounded-full transition-all cursor-pointer ${mode === 'file' ? 'bg-blue-600 text-white shadow' : 'text-zinc-400 hover:text-white'}`}
            >
              อัปโหลดไฟล์ TXT
            </button>
            <button 
              onClick={() => setMode('single-file')} 
              className={`flex-1 py-2 text-xs font-semibold rounded-full transition-all cursor-pointer ${mode === 'single-file' ? 'bg-blue-600 text-white shadow' : 'text-zinc-400 hover:text-white'}`}
            >
              อัปโหลดไฟล์แยกชิ้น
            </button>
          </div>

          <div className="flex items-center justify-between p-3.5 bg-[#151926] rounded-xl border border-white/[0.08]">
            <div>
              <p className="text-xs font-semibold text-white">จำนวนบรรทัดต่อ 1 สต๊อก</p>
              <p className="text-[11px] text-zinc-400">เช่น 1 บรรทัดต่อ 1 ไอดี หรือ 2 บรรทัด (ID + Pass)</p>
            </div>
            <input 
              type="number" 
              min="1" 
              value={linesPerStock} 
              onChange={e => {
                setLinesPerStock(Math.max(1, parseInt(e.target.value) || 1));
                setTimeout(updateTextCount, 10);
              }}
              className="w-16 bg-[#1a2030] border border-white/[0.1] rounded-lg px-2.5 py-1.5 text-center text-sm font-bold text-white focus:outline-none focus:border-blue-500"
            />
          </div>

          {mode === 'text' && (
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-zinc-300">วางรายการสต๊อก (คั่นแต่ละชิ้นด้วยบรรทัดใหม่)</label>
                <span className="text-[11px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/20">
                  คำนวณได้: {stockCount} ชิ้น
                </span>
              </div>
              <textarea 
                ref={textRef}
                onChange={updateTextCount}
                className="w-full bg-[#151926] border border-white/[0.08] rounded-xl p-4 text-xs font-mono text-zinc-200 placeholder:text-zinc-600 h-48 resize-none focus:outline-none focus:border-blue-500/60 focus:ring-2 focus:ring-blue-500/20"
                placeholder="user1:pass1&#10;user2:pass2&#10;user3:pass3"
              />
            </div>
          )}

          {mode === 'file' && (
            <div className="space-y-4">
              <div 
                onClick={() => fileRef.current?.click()}
                className="border-2 border-dashed border-white/[0.15] hover:border-blue-500/50 bg-[#151926]/50 rounded-2xl p-8 flex flex-col items-center justify-center cursor-pointer transition-colors"
              >
                <Upload className="w-8 h-8 text-blue-400 mb-2" />
                <p className="text-sm font-bold text-white">คลิกเพื่อเลือกไฟล์ .txt สต๊อก</p>
                <p className="text-xs text-zinc-400 mt-1">รองรับไฟล์ข้อความขนาดใหญ่ โหลดเร็วทันที</p>
                <input 
                  type="file" 
                  ref={fileRef}
                  accept=".txt"
                  className="hidden" 
                  onChange={handleFileUpload}
                />
              </div>

              {uploadProgress >= 0 && (
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs text-zinc-400">
                    <span>กำลังโหลดไฟล์...</span>
                    <span>{uploadProgress}%</span>
                  </div>
                  <div className="w-full bg-white/[0.06] rounded-full h-1.5 overflow-hidden">
                    <div className="bg-blue-500 h-1.5 transition-all" style={{ width: `${uploadProgress}%` }}></div>
                  </div>
                </div>
              )}

              {fileStockPreview.length > 0 && (
                <div className="p-3.5 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                  <div>
                    <p className="text-xs font-semibold text-emerald-300">อ่านไฟล์สำเร็จ</p>
                    <p className="text-[11px] text-emerald-400/80">
                      พบข้อมูลทั้งหมด {fileStockPreview.length} บรรทัด (คำนวณได้ {Math.ceil(fileStockPreview.length / linesPerStock)} ชิ้น)
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}

          {mode === 'single-file' && (
            <div className="space-y-4">
              <div 
                onClick={() => singleFileRef.current?.click()}
                className="border-2 border-dashed border-white/[0.15] hover:border-blue-500/50 bg-[#151926]/50 rounded-2xl p-8 flex flex-col items-center justify-center cursor-pointer transition-colors"
              >
                <Upload className="w-8 h-8 text-blue-400 mb-2" />
                <p className="text-sm font-bold text-white">เลือกไฟล์ (1 ชิ้นต่อ 1 ไฟล์)</p>
                <p className="text-xs text-zinc-400 mt-1">เช่น ไฟล์ .zip, .rar, หรือรูปภาพ (สูงสุด 5MB ต่อไฟล์)</p>
                <input 
                  type="file" 
                  multiple
                  ref={singleFileRef}
                  className="hidden" 
                  onChange={handleSingleFileUpload}
                />
              </div>

              {singleFilesPreview.length > 0 && (
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {singleFilesPreview.map((f, i) => (
                    <div key={i} className="p-2.5 bg-[#151926] border border-white/[0.08] rounded-xl flex items-center justify-between text-xs">
                      <span className="text-zinc-200 truncate max-w-[320px]">{f.name}</span>
                      <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded font-mono">พร้อมส่ง</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        <div className="p-6 border-t border-white/[0.08] flex items-center justify-end gap-3 bg-[#121622]/60">
          <button 
            type="button" 
            onClick={onClose}
            className="px-5 py-2.5 rounded-full border border-white/[0.08] hover:bg-white/[0.05] text-zinc-300 text-xs font-semibold cursor-pointer transition-colors"
          >
            ยกเลิก
          </button>
          <button 
            type="button" 
            onClick={handleSaveStock}
            className="px-6 py-2.5 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all shadow-lg shadow-emerald-500/20 flex items-center gap-2 cursor-pointer active:scale-95"
          >
            <Plus className="w-4 h-4" />
            เพิ่มสต๊อกเข้าระบบ
          </button>
        </div>
      </motion.div>
    </div>
  );
};

/* =========================================================================
   Database Setup Guide Card
   ========================================================================= */
const DatabaseSetupGuide = ({ dbErrorDetail }: { dbErrorDetail?: string | null }) => (
  <div className="bg-[#0f121a] border border-amber-500/20 p-8 max-w-2xl mx-auto mt-12 rounded-2xl shadow-xl">
    <div className="flex items-center gap-4 mb-6">
      <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl text-amber-400">
        <AlertTriangle className="w-7 h-7" />
      </div>
      <div>
        <h2 className="text-xl font-bold text-white">Database / Server Offline</h2>
        <p className="text-xs text-zinc-400 mt-0.5">ระบบฐานข้อมูลหรือเซิร์ฟเวอร์หลังบ้านยังไม่ได้เชื่อมต่อ</p>
      </div>
    </div>
    
    {dbErrorDetail && (
      <div className="mb-6 p-4 bg-amber-500/10 border border-amber-500/20 rounded-xl">
        <p className="text-xs font-mono text-amber-300 break-all">{dbErrorDetail}</p>
      </div>
    )}
    
    <div className="flex justify-end">
      <button 
        onClick={() => window.location.reload()}
        className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl transition-all shadow-lg shadow-blue-500/20 flex items-center gap-2"
      >
        <RefreshCw className="w-4 h-4" />
        รีเฟรชหน้าต่าง
      </button>
    </div>
  </div>
);

/* =========================================================================
   Main Admin Dashboard Component
   ========================================================================= */
export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  totalChecked, validAccounts, licenseKeys = [], usedKeysHistory = [], blockedIPs = [],
  adminTab, setAdminTab, isDBReady, dbErrorDetail, adminUsername, setIsAdmin,
  addLicenseKey, blockIP, deleteKey, unblockIP, bulkDeleteKeys,
  products = [], setProducts, siteStats = { users: 0, stock: 0, sales: 0, topups: 0 }, setSiteStats,
  customPages = [], setCustomPages,
  categories = [], setCategories,
  usersList = [], onRefreshData,
  purchaseHistory: propPurchaseHistory = [],
  topupHistory: propTopupHistory = [],
  onBackToStore
}) => {
  const [isAddingProduct, setIsAddingProduct] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | undefined>(undefined);
  const [stockProduct, setStockProduct] = useState<Product | undefined>(undefined);
  const [isNavOpen, setIsNavOpen] = useState(false);
  const [productSearch, setProductSearch] = useState('');
  const [selectedProductCategory, setSelectedProductCategory] = useState('all');
  const [productStockFilter, setProductStockFilter] = useState<'all' | 'instock' | 'lowstock' | 'outstock'>('all');
  const [productSort, setProductSort] = useState<'name' | 'price_desc' | 'price_asc' | 'stock_desc' | 'stock_asc'>('name');

  // License Keys Filters
  const [keySearch, setKeySearch] = useState('');
  const [keyStatusFilter, setKeyStatusFilter] = useState<'all' | 'active' | 'used'>('all');

  // IP Filter
  const [ipSearch, setIpSearch] = useState('');

  const [purchaseHistory, setPurchaseHistory] = useState<any[]>(() => {
    if (propPurchaseHistory && propPurchaseHistory.length > 0) return propPurchaseHistory;
    const saved = localStorage.getItem('apex_purchase_history');
    if (saved) { try { return JSON.parse(saved); } catch (e) { return []; } }
    return [];
  });

  const [topupHistory, setTopupHistory] = useState<any[]>(() => {
    if (propTopupHistory && propTopupHistory.length > 0) return propTopupHistory;
    const saved = localStorage.getItem('apex_topup_history');
    if (saved) { try { return JSON.parse(saved); } catch (e) { return []; } }
    return [];
  });

  // Keep state in sync with incoming props
  useEffect(() => {
    if (propPurchaseHistory && propPurchaseHistory.length > 0) {
      setPurchaseHistory(propPurchaseHistory);
    }
  }, [propPurchaseHistory]);

  useEffect(() => {
    if (propTopupHistory && propTopupHistory.length > 0) {
      setTopupHistory(propTopupHistory);
    }
  }, [propTopupHistory]);

  // Real-time purchases fetch from backend
  useEffect(() => {
    const fetchLatestPurchases = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('/api/purchases?limit=100', {
          headers: token ? { Authorization: `Bearer ${token}` } : {}
        });
        if (res.data?.data && Array.isArray(res.data.data) && res.data.data.length > 0) {
          setPurchaseHistory(res.data.data);
        }
      } catch (e) {}
    };
    fetchLatestPurchases();
  }, []);

  const [siteSettings, setSiteSettings] = useState({ 
    site_name: 'DEV',
    truewallet_phone: '',
    contact_line: 'https://www.facebook.com/share/18emwBsqUf/?mibextid=wwXIfr',
    discord_link: '',
    facebook_link: '',
    instagram_link: '',
    contact_email: '',
    stats_users_offset: 1278,
    stats_sales_offset: 4432,
    popup_img_url: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=2070&auto=format&fit=crop',
    popup_enabled: true,
    popup_link: '',
    banners: ["https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=2070&auto=format&fit=crop"],
    proxies: ['http://e7221fa7-20b7-43a7-9f76-c69fbc35cdef@lv3.gen5.netmld.shop:8080'],
    auto_proxy: true,
    spotify_url: '',
    spotify_autoplay: false,
    announcement_text: 'ยินดีต้อนรับสู่ DEV ศูนย์รวมสินค้าไอดีและข้อเสนอยอดฮิต ระบบซื้อขายทำงานอัตโนมัติ 24 ชั่วโมง - กรณีมีปัญหาโปรดติดต่อแอดมิน'
  });

  const [uploadingMusic, setUploadingMusic] = useState(false);
  const musicFileRef = useRef<HTMLInputElement>(null);

  const handleMusicUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 50 * 1024 * 1024) {
      Swal.fire({
        title: 'ขนาดเกินกำหนด',
        text: 'จำกัดขนาดไฟล์เสียงไม่เกิน 50MB',
        icon: 'error',
        background: '#0d1017',
        color: '#fff'
      });
      return;
    }

    setUploadingMusic(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post('/api/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.data?.url) {
        setSiteSettings(prev => ({ ...prev, spotify_url: response.data.url }));
        Swal.fire({
          title: 'สำเร็จ',
          text: 'อัปโหลดไฟล์เพลงเรียบร้อย',
          icon: 'success',
          background: '#0d1017',
          color: '#fff',
          timer: 1500,
          showConfirmButton: false
        });
      }
    } catch (err: any) {
      Swal.fire({
        title: 'เกิดข้อผิดพลาด',
        text: err.response?.data?.error || 'ไม่สามารถอัปโหลดไฟล์ได้',
        icon: 'error',
        background: '#0d1017',
        color: '#fff'
      });
    } finally {
      setUploadingMusic(false);
      if (musicFileRef.current) musicFileRef.current.value = '';
    }
  };

  useEffect(() => {
    if (adminTab === 'settings' || adminTab === 'banners') {
      const fetchSettings = async () => {
        try {
          const res = await axios.get('/api/settings');
          if (res.data) setSiteSettings(res.data);
        } catch (err) {}
      };
      fetchSettings();
    }
  }, [adminTab]);

  const handleSaveSettings = async () => {
    try {
      const payload = {
        ...siteSettings,
        banners: (siteSettings.banners || []).map(b => typeof b === 'string' ? b.trim() : '').filter(Boolean),
        proxies: (siteSettings.proxies || []).map(p => typeof p === 'string' ? p.trim() : '').filter(Boolean)
      };
      setSiteSettings(payload);
      const res = await axios.post('/api/settings', payload);
      if (res.data.success || res.status === 200) {
        Swal.fire({ 
          title: 'บันทึกสำเร็จ', 
          text: 'อัปเดตการตั้งค่าเว็บไซต์เรียบร้อยแล้ว', 
          icon: 'success', 
          confirmButtonColor: '#3b82f6',
          background: '#0d1017',
          color: '#fff'
        });
      }
    } catch (err: any) {
      Swal.fire({
        title: 'ผิดพลาด',
        text: err.response?.data?.error || err.message || 'ไม่สามารถบันทึกข้อมูลได้',
        icon: 'error',
        background: '#0d1017',
        color: '#fff'
      });
    }
  };

  // Stats calculation
  const totalOrders = siteStats.sales !== undefined ? (siteStats as any).totalOrders || purchaseHistory.length : purchaseHistory.length;
  const totalRevenue = siteStats.sales || purchaseHistory.reduce((acc, curr) => acc + (Number(curr.price) || 0), 0);
  
  const today = new Date();
  const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate()).getTime();
  const startOfWeek = today.getTime() - (7 * 24 * 60 * 60 * 1000);
  const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1).getTime();

  const salesToday = purchaseHistory.filter(x => {
    const t = new Date(x.date || x.timestamp || 0).getTime();
    return t >= startOfDay;
  }).reduce((acc, curr) => acc + (Number(curr.price) || 0), 0);

  const salesWeek = purchaseHistory.filter(x => {
    const t = new Date(x.date || x.timestamp || 0).getTime();
    return t >= startOfWeek;
  }).reduce((acc, curr) => acc + (Number(curr.price) || 0), 0);

  const salesMonth = purchaseHistory.filter(x => {
    const t = new Date(x.date || x.timestamp || 0).getTime();
    return t >= startOfMonth;
  }).reduce((acc, curr) => acc + (Number(curr.price) || 0), 0);

  // Dynamic 7-day revenue & order trends
  const dynamicChartData = React.useMemo(() => {
    const days = 7;
    const result = [];
    const now = new Date();
    
    for (let i = days - 1; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth(), now.getDate() - i);
      const dayStart = new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
      const dayEnd = dayStart + 24 * 60 * 60 * 1000;
      const dayLabel = d.toLocaleDateString('th-TH', { day: 'numeric', month: 'short' });
      
      const dayOrders = purchaseHistory.filter(o => {
        const t = new Date(o.date || o.timestamp || 0).getTime();
        return t >= dayStart && t < dayEnd;
      });

      const dayRevenue = dayOrders.reduce((sum, o) => sum + (Number(o.price) || 0), 0);
      result.push({
        name: dayLabel,
        revenue: dayRevenue,
        orders: dayOrders.length
      });
    }
    return result;
  }, [purchaseHistory]);

  // Top selling products leaderboard
  const topSellingProducts = React.useMemo(() => {
    const map = new Map<string, { name: string; revenue: number; count: number }>();
    purchaseHistory.forEach(order => {
      const name = order.product_name || order.productName || 'สินค้าทั่วไป';
      const current = map.get(name) || { name, revenue: 0, count: 0 };
      current.revenue += (Number(order.price) || 0);
      current.count += (Number(order.quantity) || 1);
      map.set(name, current);
    });
    return Array.from(map.values())
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5);
  }, [purchaseHistory]);

  const filteredProducts = React.useMemo(() => {
    return products.filter(p => {
      const matchSearch = (p.name || '').toLowerCase().includes(productSearch.toLowerCase()) || 
                          (p.description || '').toLowerCase().includes(productSearch.toLowerCase());
      const matchCat = selectedProductCategory === 'all' || p.category === selectedProductCategory;
      
      let matchStock = true;
      if (productStockFilter === 'instock') matchStock = (p.stock || 0) > 0;
      if (productStockFilter === 'lowstock') matchStock = (p.stock || 0) > 0 && (p.stock || 0) <= 5;
      if (productStockFilter === 'outstock') matchStock = (p.stock || 0) === 0;

      return matchSearch && matchCat && matchStock;
    }).sort((a, b) => {
      if (productSort === 'price_desc') return (b.price || 0) - (a.price || 0);
      if (productSort === 'price_asc') return (a.price || 0) - (b.price || 0);
      if (productSort === 'stock_desc') return (b.stock || 0) - (a.stock || 0);
      if (productSort === 'stock_asc') return (a.stock || 0) - (b.stock || 0);
      return (a.name || '').localeCompare(b.name || '');
    });
  }, [products, productSearch, selectedProductCategory, productStockFilter, productSort]);

  const filteredLicenseKeys = React.useMemo(() => {
    return licenseKeys.filter(k => {
      const matchSearch = !keySearch.trim() || 
                          (k.key || '').toLowerCase().includes(keySearch.toLowerCase()) ||
                          (k.plan || '').toLowerCase().includes(keySearch.toLowerCase());
      const matchStatus = keyStatusFilter === 'all' || k.status === keyStatusFilter;
      return matchSearch && matchStatus;
    });
  }, [licenseKeys, keySearch, keyStatusFilter]);

  const filteredBlockedIPs = React.useMemo(() => {
    return blockedIPs.filter(item => {
      if (!ipSearch.trim()) return true;
      const term = ipSearch.toLowerCase();
      return (item.ip || '').toLowerCase().includes(term) || (item.reason || '').toLowerCase().includes(term);
    });
  }, [blockedIPs, ipSearch]);

  const getTabTitle = (id: string) => {
    const map: Record<string, string> = {
      overview: 'ภาพรวมระบบ',
      analytics: 'ข้อมูลและสถิติ',
      orders: 'รายการคำสั่งซื้อ',
      store: 'จัดการสินค้า',
      categories: 'หมวดหมู่สินค้า',
      stock: 'จัดการสต็อกสินค้า',
      banners: 'แบนเนอร์ & ป๊อปอัพ',
      pages: 'หน้าเพจเพิ่มเติม',
      users: 'สมาชิกทั้งหมด',
      keys: 'License Keys',
      history: 'ประวัติการใช้งาน',
      ips: 'ความปลอดภัย & แบน IP',
      tools: 'ตัวช่วยแจกของ',
      api_keys: 'จัดการ API Keys',
      settings: 'ตั้งค่าเว็บไซต์',
      system: 'สถานะเซิร์ฟเวอร์'
    };
    return map[id] || id;
  };

  const NavItem = ({ id, label, icon: Icon, badge }: any) => {
    const isActive = adminTab === id;
    return (
      <button
        onClick={() => {
          setAdminTab(id);
          setIsNavOpen(false);
        }}
        className={`w-full flex items-center justify-between px-4 py-2.5 rounded-full text-xs font-semibold transition-all duration-200 cursor-pointer ${
          isActive 
            ? 'bg-blue-600/15 text-blue-400 border border-blue-500/25 shadow-sm' 
            : 'text-zinc-400 hover:text-white hover:bg-white/[0.04] border border-transparent'
        }`}
      >
        <div className="flex items-center gap-3">
          <Icon className={`w-4 h-4 ${isActive ? 'text-blue-400' : 'text-zinc-500'}`} />
          <span>{label}</span>
        </div>
        {badge && (
          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-white/[0.06] text-zinc-400">
            {badge}
          </span>
        )}
      </button>
    );
  };

  return (
    <div className="min-h-screen bg-[#07090e] flex font-sans text-white">
      {/* Mobile Drawer Backdrop */}
      <AnimatePresence>
        {isNavOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsNavOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Modern Sidebar Navigation */}
      <aside className={`fixed inset-y-0 left-0 bg-[#0a0d14] border-r border-white/[0.07] w-[270px] z-50 transform transition-transform duration-300 lg:translate-x-0 ${isNavOpen ? 'translate-x-0' : '-translate-x-full'} flex flex-col h-full`}>
        {/* Brand Area */}
        <div className="p-5 border-b border-white/[0.07] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <DevLogo className="h-7 w-auto text-white" />
            <div>
              <span className="text-[9px] font-mono tracking-widest text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/20 font-bold uppercase">
                Admin Console
              </span>
            </div>
          </div>
          <button 
            onClick={() => setIsNavOpen(false)} 
            className="lg:hidden p-1.5 text-zinc-400 hover:text-white rounded-lg hover:bg-white/[0.06]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Categories */}
        <div className="flex-1 overflow-y-auto p-4 space-y-6 scrollbar-thin scrollbar-thumb-zinc-800">
          <div>
            <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider px-3 mb-2">ภาพรวม & วิเคราะห์</p>
            <div className="space-y-1">
              <NavItem id="overview" label="ภาพรวมระบบ" icon={LayoutDashboard} />
              <NavItem id="analytics" label="ข้อมูลและสถิติ" icon={LineChart} />
              <NavItem id="system" label="สถานะเซิร์ฟเวอร์" icon={Cpu} />
            </div>
          </div>

          <div>
            <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider px-3 mb-2">จัดการร้านค้า</p>
            <div className="space-y-1">
              <NavItem id="store" label="สินค้าในร้าน" icon={Package} badge={products.length} />
              <NavItem id="orders" label="รายการคำสั่งซื้อ" icon={ShoppingCart} badge={purchaseHistory.length} />
              <NavItem id="categories" label="หมวดหมู่สินค้า" icon={LayoutDashboard} badge={categories.length} />
              <NavItem id="stock" label="จัดการสต็อกสินค้า" icon={Database} />
              <NavItem id="banners" label="แบนเนอร์ & ป๊อปอัพ" icon={ImageIcon} />
              <NavItem id="pages" label="หน้าเพจเพิ่มเติม" icon={FileText} badge={customPages.length} />
            </div>
          </div>

          <div>
            <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider px-3 mb-2">สมาชิก & ความปลอดภัย</p>
            <div className="space-y-1">
              <NavItem id="users" label="สมาชิกทั้งหมด" icon={Users} badge={usersList.length} />
              <NavItem id="keys" label="License Keys" icon={Key} badge={licenseKeys.length} />
              <NavItem id="history" label="ประวัติรายการ" icon={History} />
              <NavItem id="ips" label="ความปลอดภัย & แบน IP" icon={ShieldAlert} badge={blockedIPs.length} />
            </div>
          </div>

          <div>
            <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider px-3 mb-2">ระบบเสริม & ตั้งค่า</p>
            <div className="space-y-1">
              <NavItem id="tools" label="ตัวช่วยแจกของ" icon={Gift} />
              <NavItem id="api_keys" label="จัดการ API Keys" icon={Key} />
              <NavItem id="settings" label="ตั้งค่าเว็บไซต์" icon={Settings} />
            </div>
          </div>
        </div>

        {/* Administrator Profile Card */}
        <div className="p-4 border-t border-white/[0.07] bg-[#0c0f17]">
          <div className="flex items-center gap-3 p-2.5 rounded-xl bg-white/[0.03] border border-white/[0.05]">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white font-bold text-sm shadow-md">
              {adminUsername.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-white truncate">{adminUsername}</p>
              <p className="text-[10px] text-emerald-400 flex items-center gap-1 font-mono">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span> Active Admin
              </p>
            </div>
            <button 
              onClick={() => setIsAdmin(false)}
              className="p-1.5 rounded-lg text-zinc-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"
              title="ออกจากระบบแอดมิน"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden lg:pl-[270px]">
        {/* Modern Top Header */}
        <header className="h-16 bg-[#0a0d14]/80 backdrop-blur-md border-b border-white/[0.07] flex items-center justify-between px-4 sm:px-8 shrink-0 z-30 sticky top-0">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setIsNavOpen(true)}
              className="lg:hidden p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-white/[0.05]"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2 text-sm font-bold text-white">
              <span className="text-zinc-500 font-normal">แผงควบคุม /</span>
              <span className="text-white">{getTabTitle(adminTab)}</span>
            </div>
          </div>
          
          <div className="flex items-center gap-2.5">
            {/* Quick Jump Selector */}
            <div className="hidden md:flex items-center">
              <select
                value={adminTab}
                onChange={(e) => setAdminTab(e.target.value)}
                className="bg-[#151926] border border-white/[0.08] hover:border-white/[0.16] rounded-full px-3.5 py-1.5 text-xs text-zinc-300 focus:outline-none focus:border-blue-500/60 cursor-pointer transition-colors font-medium"
              >
                <option value="overview">⚡ ภาพรวมระบบ (Overview)</option>
                <option value="orders">⚡ รายการคำสั่งซื้อ (Orders)</option>
                <option value="store">⚡ จัดการสินค้า (Store)</option>
                <option value="categories">⚡ หมวดหมู่ (Categories)</option>
                <option value="stock">⚡ คลังสต็อก (Stock)</option>
                <option value="users">⚡ สมาชิกทั้งหมด (Users)</option>
                <option value="analytics">⚡ สถิติและยอดขาย (Analytics)</option>
                <option value="banners">⚡ แบนเนอร์ & ป๊อปอัพ (Banners)</option>
                <option value="keys">⚡ License Keys</option>
                <option value="ips">⚡ ความปลอดภัย & แบน IP (Security)</option>
                <option value="settings">⚡ ตั้งค่าเว็บไซต์ (Settings)</option>
                <option value="system">⚡ สถานะเซิร์ฟเวอร์ (System)</option>
              </select>
            </div>

            {/* Back to Storefront Button */}
            {onBackToStore && (
              <button 
                onClick={onBackToStore}
                title="กลับไปหน้าเลือกร้านค้าสำหรับลูกค้า"
                className="hidden sm:flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/25 text-xs font-semibold text-blue-400 hover:text-blue-300 transition-all cursor-pointer active:scale-95"
              >
                <Globe className="w-3.5 h-3.5" />
                <span>ดูหน้าร้าน</span>
                <ArrowRight className="w-3 h-3 opacity-70" />
              </button>
            )}

            {/* Server Online Badge */}
            <div className="hidden sm:flex items-center gap-2 text-[11px] font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              ONLINE 24/7
            </div>

            {onRefreshData && (
              <button 
                onClick={onRefreshData}
                title="รีเฟรชข้อมูลทั้งหมดจากฐานข้อมูล"
                className="p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-white/[0.05] border border-white/[0.07] transition-all cursor-pointer active:scale-95"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
            )}
          </div>
        </header>

        {/* Scrollable View Container */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 w-full max-w-[1500px] mx-auto space-y-6">
          {!isDBReady ? (
            <DatabaseSetupGuide dbErrorDetail={dbErrorDetail} />
          ) : (
            <AnimatePresence mode="wait">
              {/* ==============================================================
                  Tab: Overview
                  ============================================================== */}
              {adminTab === 'overview' && (
                <motion.div
                  key="overview"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  className="space-y-6"
                >
                  {/* Executive Metric Cards */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {[
                      { label: 'ผู้ใช้งานในระบบ', value: (siteStats?.users || usersList.length || 0).toLocaleString(), icon: Users, color: 'text-blue-400', bg: 'bg-blue-500/10 border-blue-500/20' },
                      { label: 'ยอดสั่งซื้อทั้งหมด', value: totalOrders.toLocaleString(), icon: ShoppingCart, color: 'text-indigo-400', bg: 'bg-indigo-500/10 border-indigo-500/20' },
                      { label: 'สินค้าพร้อมจำหน่าย', value: products.filter(p => p.stock > 0).length.toLocaleString(), icon: Package, color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/20' },
                      { label: 'รายได้รวม (บาท)', value: `฿${totalRevenue.toLocaleString()}`, icon: Activity, color: 'text-cyan-400', bg: 'bg-cyan-500/10 border-cyan-500/20' },
                    ].map((stat, i) => (
                      <div key={i} className="p-5 rounded-[28px] bg-[#0f121a] border border-white/[0.08] relative overflow-hidden group hover:border-white/[0.15] transition-all">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-xs font-semibold text-zinc-400 mb-1">{stat.label}</p>
                            <h3 className="text-2xl font-bold text-white tracking-tight">{stat.value}</h3>
                          </div>
                          <div className={`p-3 rounded-2xl border ${stat.bg} ${stat.color}`}>
                            <stat.icon className="w-5 h-5" />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Sales Breakdown and Quick Launchers */}
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 space-y-6">
                      {/* Sales summary card */}
                      <div className="p-6 sm:p-7 rounded-[28px] bg-[#0f121a] border border-white/[0.08] space-y-5">
                        <div className="flex items-center justify-between">
                          <h3 className="text-sm font-bold text-white flex items-center gap-2">
                            <LineChart className="w-4 h-4 text-blue-400" />
                            สรุปยอดขายตามช่วงเวลา (Revenue Summary)
                          </h3>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                          <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/[0.06] text-center">
                            <p className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider mb-1">วันนี้</p>
                            <p className="text-xl font-bold text-emerald-400 font-mono">฿{salesToday.toLocaleString()}</p>
                          </div>
                          <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/[0.06] text-center">
                            <p className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider mb-1">สัปดาห์นี้</p>
                            <p className="text-xl font-bold text-blue-400 font-mono">฿{salesWeek.toLocaleString()}</p>
                          </div>
                          <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/[0.06] text-center">
                            <p className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider mb-1">เดือนนี้</p>
                            <p className="text-xl font-bold text-indigo-400 font-mono">฿{salesMonth.toLocaleString()}</p>
                          </div>
                        </div>
                      </div>

                      {/* Quick Management Cards */}
                      <div className="p-6 sm:p-7 rounded-[28px] bg-[#0f121a] border border-white/[0.08]">
                        <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                          <Sparkles className="w-4 h-4 text-blue-400" />
                          เมนูลัดสำหรับผู้ดูแล (Quick Action)
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {[
                            { id: 'store', label: 'จัดการสินค้า', desc: 'เพิ่ม ลบ และอัปเดตราคา', icon: Package, color: 'text-blue-400' },
                            { id: 'keys', label: 'License Keys', desc: 'เพิ่มคีย์และดูประวัติการใช้งาน', icon: Key, color: 'text-indigo-400' },
                            { id: 'users', label: 'จัดการสมาชิก', desc: 'ปรับยอดเงินและจัดการสิทธิ์', icon: Users, color: 'text-emerald-400' },
                            { id: 'settings', label: 'ตั้งค่าเว็บไซต์', desc: 'แก้ไขชื่อเว็บ ช่องทางติดต่อ และเพลง', icon: Settings, color: 'text-amber-400' },
                          ].map((item, i) => (
                            <button
                              key={i}
                              onClick={() => setAdminTab(item.id)}
                              className="p-4 rounded-2xl bg-white/[0.02] hover:bg-white/[0.05] border border-white/[0.06] hover:border-white/[0.12] transition-all text-left flex items-center gap-4 group cursor-pointer"
                            >
                              <div className={`p-3 rounded-xl bg-white/[0.04] ${item.color}`}>
                                <item.icon className="w-5 h-5" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-xs font-bold text-white group-hover:text-blue-400 transition-colors">{item.label}</p>
                                <p className="text-[11px] text-zinc-400 truncate mt-0.5">{item.desc}</p>
                              </div>
                              <ChevronRight className="w-4 h-4 text-zinc-600 group-hover:text-zinc-300 transition-colors" />
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Secondary Panel */}
                    <div className="space-y-6">
                      {/* Recent Orders Overview Widget */}
                      <div className="p-6 sm:p-7 rounded-[28px] bg-[#0f121a] border border-white/[0.08] space-y-4">
                        <div className="flex items-center justify-between">
                          <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-wider flex items-center gap-2">
                            <ShoppingCart className="w-4 h-4 text-indigo-400" /> คำสั่งซื้อล่าสุด
                          </h3>
                          <button
                            onClick={() => setAdminTab('orders')}
                            className="text-[11px] text-blue-400 hover:text-blue-300 font-semibold cursor-pointer"
                          >
                            ดูทั้งหมด ({purchaseHistory.length}) &rarr;
                          </button>
                        </div>
                        <div className="space-y-2">
                          {purchaseHistory.slice(0, 4).map((order, idx) => (
                            <div key={idx} className="p-3 rounded-2xl bg-white/[0.02] border border-white/[0.05] flex items-center justify-between text-xs">
                              <div className="min-w-0 pr-2">
                                <p className="font-bold text-white truncate">{order.product_name || order.productName || 'คำสั่งซื้อสินค้า'}</p>
                                <p className="text-[10px] text-zinc-400 truncate">{order.username || 'ลูกค้าทั่วไป'} &bull; {new Date(order.date || order.timestamp || Date.now()).toLocaleDateString('th-TH')}</p>
                              </div>
                              <span className="font-bold text-emerald-400 font-mono shrink-0">฿{Number(order.price || 0).toLocaleString()}</span>
                            </div>
                          ))}
                          {purchaseHistory.length === 0 && (
                            <p className="text-xs text-zinc-500 text-center py-4">ยังไม่มีคำสั่งซื้อ</p>
                          )}
                        </div>
                      </div>

                      <div className="p-6 sm:p-7 rounded-[28px] bg-[#0f121a] border border-white/[0.08] space-y-4">
                        <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-wider">ระบบเสริม & ประวัติ</h3>
                        <div className="space-y-2">
                          <button onClick={() => setAdminTab('banners')} className="w-full p-3 rounded-full bg-white/[0.02] hover:bg-white/[0.05] border border-white/[0.06] flex items-center justify-between text-xs font-semibold text-zinc-300 hover:text-white transition-all cursor-pointer">
                            <span className="flex items-center gap-2.5 ml-2"><ImageIcon className="w-4 h-4 text-blue-400" /> แบนเนอร์ & ป๊อปอัพ</span>
                            <ChevronRight className="w-4 h-4 text-zinc-600 mr-2" />
                          </button>
                          <button onClick={() => setAdminTab('pages')} className="w-full p-3 rounded-full bg-white/[0.02] hover:bg-white/[0.05] border border-white/[0.06] flex items-center justify-between text-xs font-semibold text-zinc-300 hover:text-white transition-all cursor-pointer">
                            <span className="flex items-center gap-2.5 ml-2"><FileText className="w-4 h-4 text-emerald-400" /> หน้าเพจเพิ่มเติม</span>
                            <ChevronRight className="w-4 h-4 text-zinc-600 mr-2" />
                          </button>
                          <button onClick={() => setAdminTab('history')} className="w-full p-3 rounded-full bg-white/[0.02] hover:bg-white/[0.05] border border-white/[0.06] flex items-center justify-between text-xs font-semibold text-zinc-300 hover:text-white transition-all cursor-pointer">
                            <span className="flex items-center gap-2.5 ml-2"><History className="w-4 h-4 text-purple-400" /> ประวัติการใช้คีย์ (Logs)</span>
                            <ChevronRight className="w-4 h-4 text-zinc-600 mr-2" />
                          </button>
                          <button onClick={() => setAdminTab('ips')} className="w-full p-3 rounded-full bg-white/[0.02] hover:bg-white/[0.05] border border-white/[0.06] flex items-center justify-between text-xs font-semibold text-zinc-300 hover:text-white transition-all cursor-pointer">
                            <span className="flex items-center gap-2.5 ml-2"><ShieldAlert className="w-4 h-4 text-rose-400" /> รายการแบน IP</span>
                            <ChevronRight className="w-4 h-4 text-zinc-600 mr-2" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* ==============================================================
                  Tab: Analytics
                  ============================================================== */}
              {adminTab === 'analytics' && (
                <motion.div 
                  key="analytics"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  className="space-y-6"
                >
                  <div className="p-6 sm:p-7 rounded-[28px] bg-[#0f121a] border border-white/[0.08] relative overflow-hidden">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-6">
                      <div>
                        <h3 className="text-base font-bold text-white flex items-center gap-2">
                          <LineChart className="w-5 h-5 text-blue-400" />
                          สถิติยอดขาย 7 วันล่าสุด (7-Day Sales & Order Trends)
                        </h3>
                        <p className="text-xs text-zinc-400 mt-1">ประมวลผลข้อมูลจริงจากประวัติคำสั่งซื้อในระบบ</p>
                      </div>
                      <span className="text-[11px] font-mono px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 font-bold">
                        คำสั่งซื้อทั้งหมด: {purchaseHistory.length} รายการ
                      </span>
                    </div>

                    <div className="h-72 w-full mt-4">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart
                          data={dynamicChartData}
                          margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                        >
                          <defs>
                            <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.35}/>
                              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                            </linearGradient>
                          </defs>
                          <XAxis dataKey="name" stroke="#71717a" fontSize={11} tickLine={false} axisLine={false} />
                          <YAxis stroke="#71717a" fontSize={11} tickLine={false} axisLine={false} tickFormatter={(value) => `฿${value}`} />
                          <Tooltip 
                            contentStyle={{ backgroundColor: '#0d1017', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '16px' }}
                            formatter={(val: any, name: string) => [name === 'revenue' ? `฿${Number(val).toLocaleString()}` : `${val} รายการ`, name === 'revenue' ? 'ยอดขาย' : 'จำนวนออเดอร์']}
                            itemStyle={{ color: '#e4e4e7', fontSize: '13px', fontWeight: 'bold' }}
                          />
                          <Area type="monotone" dataKey="revenue" stroke="#3b82f6" strokeWidth={2.5} fillOpacity={1} fill="url(#colorRevenue)" />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6 pt-6 border-t border-white/[0.08]">
                      <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.06]">
                        <p className="text-xs font-semibold text-zinc-400 mb-1">ยอดขายเฉลี่ยต่อคำสั่งซื้อ (AOV)</p>
                        <p className="text-xl font-bold text-blue-400 font-mono">
                          ฿{purchaseHistory.length > 0 ? Math.round(totalRevenue / purchaseHistory.length).toLocaleString() : 0}
                        </p>
                        <p className="text-zinc-400 text-[11px] mt-1 font-semibold">อ้างอิงจากคำสั่งซื้อจริง</p>
                      </div>
                      <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.06]">
                        <p className="text-xs font-semibold text-zinc-400 mb-1">ยอดการเติมเงินสะสม (Topups)</p>
                        <p className="text-xl font-bold text-emerald-400 font-mono">
                          ฿{topupHistory.reduce((s, t) => s + (Number(t.amount) || 0), 0).toLocaleString()}
                        </p>
                        <p className="text-emerald-400 text-[11px] mt-1 font-semibold">{topupHistory.length} ธุรกรรมสำเร็จ</p>
                      </div>
                      <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.06]">
                        <p className="text-xs font-semibold text-zinc-400 mb-1">ยอดผู้ใช้งานทั้งหมด</p>
                        <p className="text-xl font-bold text-amber-400 font-mono">{usersList.length.toLocaleString()}</p>
                        <p className="text-zinc-400 text-[11px] mt-1 font-semibold">บัญชีที่ลงทะเบียนในระบบ</p>
                      </div>
                    </div>
                  </div>

                  {/* Top Selling Products Leaderboard */}
                  {topSellingProducts.length > 0 && (
                    <div className="p-6 sm:p-7 rounded-[28px] bg-[#0f121a] border border-white/[0.08]">
                      <h3 className="text-sm font-bold text-white flex items-center gap-2 mb-4">
                        <Sparkles className="w-4 h-4 text-amber-400" /> สินค้าขายดี 5 อันดับแรก (Top Selling Leaderboard)
                      </h3>
                      <div className="space-y-3">
                        {topSellingProducts.map((item, idx) => {
                          const maxRev = topSellingProducts[0]?.revenue || 1;
                          const pct = Math.round((item.revenue / maxRev) * 100);
                          return (
                            <div key={idx} className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/[0.05] space-y-2">
                              <div className="flex items-center justify-between text-xs">
                                <span className="font-bold text-white flex items-center gap-2">
                                  <span className="w-5 h-5 rounded-full bg-white/[0.06] text-zinc-400 flex items-center justify-center text-[10px] font-mono">
                                    #{idx + 1}
                                  </span>
                                  {item.name}
                                </span>
                                <div className="text-right">
                                  <span className="font-bold text-emerald-400 font-mono">฿{item.revenue.toLocaleString()}</span>
                                  <span className="text-zinc-500 text-[10px] ml-2">({item.count} ชิ้น)</span>
                                </div>
                              </div>
                              <div className="w-full h-1.5 rounded-full bg-white/[0.06] overflow-hidden">
                                <div className="h-full rounded-full bg-blue-500" style={{ width: `${pct}%` }}></div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </motion.div>
              )}

              {/* ==============================================================
                  Tab: Orders Management
                  ============================================================== */}
              {adminTab === 'orders' && (
                <motion.div 
                  key="orders"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                >
                  <AdminOrdersManagement 
                    purchaseHistory={purchaseHistory}
                    usersList={usersList}
                    onRefresh={onRefreshData}
                  />
                </motion.div>
              )}

              {/* ==============================================================
                  Tab: Store / Products Management
                  ============================================================== */}
              {adminTab === 'store' && (
                <motion.div 
                  key="store"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  className="space-y-6"
                >
                  {/* Top Product Controls Card */}
                  <div className="p-6 sm:p-7 rounded-[28px] bg-[#0f121a] border border-white/[0.08] flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
                        <Package className="w-5 h-5" />
                      </div>
                      <div>
                        <h2 className="text-base font-bold text-white">จัดการสินค้าในร้าน</h2>
                        <p className="text-xs text-zinc-400">มีสินค้าทั้งหมด {products.length} รายการในระบบ</p>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
                      <div className="relative flex-1 sm:w-60">
                        <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <input 
                          type="text" 
                          placeholder="ค้นหาชื่อสินค้า..."
                          value={productSearch}
                          onChange={e => setProductSearch(e.target.value)}
                          className="w-full bg-[#151926] border border-white/[0.08] rounded-full pl-9 pr-4 py-2 text-xs text-white placeholder:text-zinc-500 focus:outline-none focus:border-blue-500/60"
                        />
                      </div>

                      <select 
                        value={selectedProductCategory} 
                        onChange={e => setSelectedProductCategory(e.target.value)}
                        className="bg-[#151926] border border-white/[0.08] rounded-full px-3.5 py-2 text-xs text-zinc-300 focus:outline-none focus:border-blue-500/60 cursor-pointer"
                      >
                        <option value="all">ทุกหมวดหมู่</option>
                        {categories.map((c: any) => (
                          <option key={c.id} value={c.id}>{c.name || c.title}</option>
                        ))}
                      </select>

                      <select
                        value={productSort}
                        onChange={e => setProductSort(e.target.value as any)}
                        className="bg-[#151926] border border-white/[0.08] rounded-full px-3.5 py-2 text-xs text-zinc-300 focus:outline-none focus:border-blue-500/60 cursor-pointer"
                      >
                        <option value="name">เรียงตาม: ชื่อสินค้า</option>
                        <option value="price_desc">ราคา: มาก &rarr; น้อย</option>
                        <option value="price_asc">ราคา: น้อย &rarr; มาก</option>
                        <option value="stock_desc">สต็อก: มาก &rarr; น้อย</option>
                        <option value="stock_asc">สต็อก: น้อย &rarr; มาก</option>
                      </select>

                      <button 
                        onClick={() => setIsAddingProduct(true)}
                        className="px-5 py-2 rounded-full bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all shadow-md shadow-blue-500/20 flex items-center gap-1.5 cursor-pointer active:scale-95 shrink-0"
                      >
                        <Plus className="w-4 h-4" />
                        เพิ่มสินค้า
                      </button>
                    </div>
                  </div>

                  {/* Stock Filter Quick Tabs */}
                  <div className="flex items-center gap-2 overflow-x-auto pb-1">
                    {[
                      { id: 'all', label: 'สินค้าทั้งหมด', count: products.length },
                      { id: 'instock', label: 'พร้อมจำหน่าย', count: products.filter(p => (p.stock || 0) > 0).length },
                      { id: 'lowstock', label: 'สต็อกเหลือน้อย (≤5)', count: products.filter(p => (p.stock || 0) > 0 && (p.stock || 0) <= 5).length },
                      { id: 'outstock', label: 'สินค้าหมด', count: products.filter(p => (p.stock || 0) === 0).length }
                    ].map(tab => (
                      <button
                        key={tab.id}
                        onClick={() => setProductStockFilter(tab.id as any)}
                        className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer flex items-center gap-2 ${
                          productStockFilter === tab.id
                            ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30'
                            : 'bg-white/[0.02] text-zinc-400 hover:text-white border border-white/[0.05]'
                        }`}
                      >
                        <span>{tab.label}</span>
                        <span className="px-1.5 py-0.5 rounded-full bg-white/[0.06] text-[10px] font-mono">
                          {tab.count}
                        </span>
                      </button>
                    ))}
                  </div>

                  {/* Modern Products Table */}
                  <div className="rounded-[28px] bg-[#0f121a] border border-white/[0.08] overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-sm text-zinc-300">
                        <thead className="text-[11px] uppercase tracking-wider text-zinc-400 bg-white/[0.02] border-b border-white/[0.06] font-semibold">
                          <tr>
                            <th className="px-5 py-3.5">ข้อมูลสินค้า</th>
                            <th className="px-5 py-3.5">ราคาขาย</th>
                            <th className="px-5 py-3.5">สถานะสต็อก</th>
                            <th className="px-5 py-3.5 text-right">ดำเนินการ</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-white/[0.04]">
                          {filteredProducts.length > 0 ? filteredProducts.map((p) => (
                            <tr key={p.id} className="hover:bg-white/[0.02] transition-colors">
                              <td className="px-5 py-3.5">
                                <div className="flex items-center gap-3.5">
                                  {p.imageUrl ? (
                                    <img 
                                      src={p.imageUrl} 
                                      alt={p.name} 
                                      className="w-11 h-11 rounded-xl object-cover border border-white/[0.08] bg-[#151926]" 
                                    />
                                  ) : (
                                    <div className="w-11 h-11 rounded-xl bg-white/[0.04] border border-white/[0.08] flex items-center justify-center text-zinc-500">
                                      <Package className="w-5 h-5" />
                                    </div>
                                  )}
                                  <div>
                                    <div className="flex items-center gap-2">
                                      <span className="font-bold text-white text-xs">{p.name}</span>
                                      {p.tag && (
                                        <span className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-blue-500/15 text-blue-400 border border-blue-500/20">
                                          {p.tag}
                                        </span>
                                      )}
                                    </div>
                                    <p className="text-[11px] text-zinc-400 truncate max-w-xs mt-0.5">{p.description}</p>
                                  </div>
                                </div>
                              </td>
                              <td className="px-5 py-3.5 font-mono">
                                <div className="flex flex-col">
                                  {p.originalPrice && p.price && p.originalPrice > p.price && (
                                    <span className="text-[10px] text-zinc-500 line-through">฿{p.originalPrice.toLocaleString()}</span>
                                  )}
                                  <span className="text-xs font-bold text-emerald-400">฿{(p.price || 0).toLocaleString()}</span>
                                </div>
                              </td>
                              <td className="px-5 py-3.5">
                                {p.stock > 0 ? (
                                  <span className="px-2.5 py-1 rounded-full text-[10px] font-bold font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                                    พร้อมส่ง {p.stock} ชิ้น
                                  </span>
                                ) : (
                                  <span className="px-2.5 py-1 rounded-full text-[10px] font-bold font-mono bg-rose-500/10 text-rose-400 border border-rose-500/20">
                                    สินค้าหมด
                                  </span>
                                )}
                              </td>
                              <td className="px-5 py-3.5 text-right">
                                <div className="flex items-center justify-end gap-1.5">
                                  <button 
                                    onClick={async () => {
                                      if (p.stock === 0) {
                                        return Swal.fire({ title: 'ไม่มีสต๊อก', text: 'สินค้านี้ยังไม่มีข้อมูลสต๊อกให้ดาวน์โหลด', icon: 'info', background: '#0d1017', color: '#fff' });
                                      }
                                      try {
                                        const res = await axios.get(`/api/products/${p.id}/stock`);
                                        const sd = res.data.stockData;
                                        if (!sd || sd.length === 0) {
                                          return Swal.fire({ title: 'ไม่มีสต๊อก', text: 'สินค้านี้ยังไม่มีข้อมูลสต๊อกให้ดาวน์โหลด', icon: 'info', background: '#0d1017', color: '#fff' });
                                        }
                                        const text = sd.join('\n');
                                        const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
                                        const url = URL.createObjectURL(blob);
                                        const link = document.createElement('a');
                                        link.href = url;
                                        link.download = `stock_${p.name}.txt`;
                                        link.click();
                                        URL.revokeObjectURL(url);
                                      } catch (err: any) {
                                        Swal.fire({ title: 'ข้อผิดพลาด', text: err.response?.data?.error || err.message, icon: 'error', background: '#0d1017', color: '#fff' });
                                      }
                                    }}
                                    title="ดาวน์โหลดสต๊อกเป็น TXT"
                                    className="p-2 rounded-full text-zinc-400 hover:text-blue-400 hover:bg-white/[0.06] transition-colors cursor-pointer"
                                  >
                                    <Download className="w-4 h-4" />
                                  </button>
                                  <button 
                                    onClick={() => setStockProduct(p)}
                                    title="เพิ่มสต๊อก"
                                    className="p-2 rounded-full text-zinc-400 hover:text-emerald-400 hover:bg-white/[0.06] transition-colors cursor-pointer"
                                  >
                                    <Plus className="w-4 h-4" />
                                  </button>
                                  <button 
                                    onClick={() => setEditingProduct(p)}
                                    title="แก้ไขสินค้า"
                                    className="p-2 rounded-full text-zinc-400 hover:text-white hover:bg-white/[0.06] transition-colors cursor-pointer"
                                  >
                                    <Settings className="w-4 h-4" />
                                  </button>
                                  <button 
                                    onClick={() => {
                                      if (setProducts && products.length > 0) {
                                        Swal.fire({
                                          title: 'ยืนยันการลบ',
                                          text: `คุณต้องการลบ "${p.name}" ใช่หรือไม่?`,
                                          icon: 'warning',
                                          showCancelButton: true,
                                          confirmButtonColor: '#e11d48',
                                          cancelButtonColor: '#71717a',
                                          confirmButtonText: 'ยืนยันการลบ',
                                          cancelButtonText: 'ยกเลิก',
                                          background: '#0d1017',
                                          color: '#fff'
                                        }).then(async (result) => {
                                          if (result.isConfirmed) {
                                            try {
                                              await axios.delete(`/api/products/${p.id}`);
                                              setProducts(prev => prev.filter(prod => prod.id !== p.id));
                                              if (onRefreshData) onRefreshData();
                                              Swal.fire({ title: 'ลบสำเร็จ', icon: 'success', background: '#0d1017', color: '#fff', showConfirmButton: false, timer: 1000 });
                                            } catch (err: any) {
                                              Swal.fire({ title: 'Error', text: 'ไม่สามารถลบสินค้าได้', icon: 'error', background: '#0d1017', color: '#fff' });
                                            }
                                          }
                                        });
                                      }
                                    }}
                                    title="ลบสินค้า"
                                    className="p-2 rounded-full text-zinc-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          )) : (
                            <tr>
                              <td colSpan={4} className="p-12 text-center text-xs text-zinc-500">
                                ไม่พบรายการสินค้า
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* ==============================================================
                  Tab: Categories
                  ============================================================== */}
              {adminTab === 'categories' && (
                <motion.div 
                  key="categories"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                >
                  <AdminCategoriesManagement 
                    categories={categories} 
                    setCategories={setCategories} 
                    products={products}
                    setProducts={setProducts}
                  />
                </motion.div>
              )}

              {/* ==============================================================
                  Tab: Stock Management
                  ============================================================== */}
              {adminTab === 'stock' && (
                <motion.div 
                  key="stock"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                >
                  <AdminStockManagement
                    products={products}
                    categories={categories}
                    setProducts={setProducts}
                  />
                </motion.div>
              )}

              {/* ==============================================================
                  Tab: License Keys
                  ============================================================== */}
              {adminTab === 'keys' && (
                <motion.div 
                  key="keys"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  className="rounded-2xl bg-[#0f121a] border border-white/[0.08] overflow-hidden"
                >
                  <div className="p-6 border-b border-white/[0.08] flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                      <h3 className="text-base font-bold text-white flex items-center gap-2">
                        <Key className="w-5 h-5 text-blue-400" />
                        License Keys Management
                      </h3>
                      <p className="text-xs text-zinc-400 mt-0.5">จัดการรหัสคีย์เข้าใช้งานและสต๊อกของโปรแกรม</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => {
                          const activeKeys = licenseKeys.filter(k => k.status === 'active').map(k => k.key).join('\n');
                          const usedKeysStr = licenseKeys.filter(k => k.status === 'used').map(k => k.key).join('\n');
                          const historyKeysStr = usedKeysHistory.map(k => k.key).join('\n');
                          const text = `=== ACTIVE (ยังไม่ได้ใช้) ===\n${activeKeys || 'ไม่มี'}\n\n=== USED (ใช้แล้ว) ===\n${usedKeysStr || historyKeysStr ? `${usedKeysStr}${usedKeysStr && historyKeysStr ? '\n' : ''}${historyKeysStr}` : 'ไม่มี'}`;
                          const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
                          const url = URL.createObjectURL(blob);
                          const link = document.createElement('a');
                          link.href = url;
                          link.download = `license_keys_${new Date().toISOString().slice(0, 10)}.txt`;
                          link.click();
                          URL.revokeObjectURL(url);
                        }} 
                        className="px-3.5 py-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] text-xs font-semibold text-zinc-300 transition-colors flex items-center gap-2"
                      >
                        <Download className="w-4 h-4" /> บันทึก TXT
                      </button>
                      <button 
                        onClick={bulkDeleteKeys} 
                        className="px-3.5 py-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 text-xs font-semibold text-rose-400 transition-colors flex items-center gap-2"
                      >
                        <Trash2 className="w-4 h-4" /> ลบคีย์หลายรายการ
                      </button>
                      <button 
                        onClick={addLicenseKey} 
                        className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all shadow-md shadow-blue-500/20 flex items-center gap-2"
                      >
                        <Plus className="w-4 h-4" /> สร้างคีย์เพิ่ม
                      </button>
                    </div>
                  </div>

                  {/* Filter & Search Bar */}
                  <div className="p-4 sm:p-5 border-b border-white/[0.06] bg-white/[0.01] flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                    <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto">
                      {[
                        { id: 'all', label: 'ทั้งหมด', count: licenseKeys.length },
                        { id: 'active', label: 'พร้อมใช้งาน', count: licenseKeys.filter(k => k.status === 'active').length },
                        { id: 'used', label: 'ใช้งานแล้ว', count: licenseKeys.filter(k => k.status === 'used').length }
                      ].map(tab => (
                        <button
                          key={tab.id}
                          onClick={() => setKeyStatusFilter(tab.id as any)}
                          className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer flex items-center gap-2 ${
                            keyStatusFilter === tab.id
                              ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30'
                              : 'bg-white/[0.03] text-zinc-400 hover:text-white border border-white/[0.06]'
                          }`}
                        >
                          <span>{tab.label}</span>
                          <span className="px-1.5 py-0.2 rounded-full bg-white/[0.06] text-[10px] font-mono">
                            {tab.count}
                          </span>
                        </button>
                      ))}
                    </div>

                    <div className="relative w-full sm:w-64">
                      <Search className="w-3.5 h-3.5 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        placeholder="ค้นหารหัสคีย์หรือแผน..."
                        value={keySearch}
                        onChange={e => setKeySearch(e.target.value)}
                        className="w-full bg-[#151926] border border-white/[0.08] rounded-full pl-8 pr-3 py-1.5 text-xs text-white placeholder:text-zinc-500 focus:outline-none focus:border-blue-500/60"
                      />
                    </div>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-zinc-300">
                      <thead className="text-[11px] uppercase tracking-wider text-zinc-400 bg-white/[0.02] border-b border-white/[0.06] font-semibold">
                        <tr>
                          <th className="px-5 py-3.5">License Key</th>
                          <th className="px-5 py-3.5">ประเภท</th>
                          <th className="px-5 py-3.5">สถานะ</th>
                          <th className="px-5 py-3.5">วันที่สร้าง</th>
                          <th className="px-5 py-3.5 text-right">จัดการ</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/[0.04]">
                        {filteredLicenseKeys.length > 0 ? filteredLicenseKeys.map((key, i) => (
                          <tr key={i} className="hover:bg-white/[0.02] transition-colors">
                            <td className="px-5 py-3.5">
                              <div className="flex items-center gap-2.5">
                                <span className="text-white font-mono font-bold text-xs">{key.key}</span>
                                <button 
                                  onClick={() => {
                                    navigator.clipboard.writeText(key.key);
                                    Swal.fire({ title: 'Copied!', text: 'คัดลอกคีย์เรียบร้อย', icon: 'success', timer: 1000, showConfirmButton: false, background: '#0d1017', color: '#fff' });
                                  }}
                                  className="text-zinc-500 hover:text-blue-400 transition-colors p-1"
                                >
                                  <Copy className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </td>
                            <td className="px-5 py-3.5">
                              <span className="px-2 py-0.5 rounded text-[10px] uppercase font-bold bg-white/[0.04] text-zinc-400 border border-white/[0.06]">
                                {key.plan}
                              </span>
                            </td>
                            <td className="px-5 py-3.5">
                              <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase font-mono ${
                                key.status === 'active' 
                                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                                  : 'bg-white/[0.05] text-zinc-500'
                              }`}>
                                {key.status}
                              </span>
                            </td>
                            <td className="px-5 py-3.5 text-xs text-zinc-400 font-mono">
                              {new Date(key.created_at).toLocaleDateString()}
                            </td>
                            <td className="px-5 py-3.5 text-right">
                              <button 
                                onClick={() => deleteKey(key.id)} 
                                className="p-1.5 rounded-lg text-zinc-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </td>
                          </tr>
                        )) : (
                          <tr><td colSpan={5} className="p-12 text-center text-xs text-zinc-500">ไม่มีข้อมูลคีย์ในระบบ</td></tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </motion.div>
              )}

              {/* ==============================================================
                  Tab: Users Management
                  ============================================================== */}
              {adminTab === 'users' && (
                <motion.div 
                  key="users"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                >
                  <AdminUserManagement 
                    purchaseHistory={purchaseHistory} 
                    topupHistory={topupHistory} 
                    usedKeysHistory={usedKeysHistory} 
                    users={usersList}
                    onRefresh={onRefreshData || (() => {})}
                  />
                </motion.div>
              )}

              {/* ==============================================================
                  Tab: History / Logs
                  ============================================================== */}
              {adminTab === 'history' && (
                <motion.div 
                  key="history"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  className="rounded-[28px] bg-[#0f121a] border border-white/[0.08] overflow-hidden shadow-xl"
                >
                  <div className="p-6 sm:p-7 border-b border-white/[0.08]">
                    <h3 className="text-base font-bold text-white flex items-center gap-2">
                      <History className="w-5 h-5 text-blue-400" />
                      ประวัติการใช้คีย์ (Redeem Logs)
                    </h3>
                    <p className="text-xs text-zinc-400 mt-0.5">บันทึกการเปิดใช้งาน License คีย์พร้อม IP ผู้ใช้งาน</p>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-zinc-300">
                      <thead className="text-[11px] uppercase tracking-wider text-zinc-400 bg-white/[0.02] border-b border-white/[0.06] font-semibold">
                        <tr>
                          <th className="px-5 py-3.5">License Key</th>
                          <th className="px-5 py-3.5">User IP</th>
                          <th className="px-5 py-3.5">วันเวลา</th>
                          <th className="px-5 py-3.5">สถานะ</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/[0.04] text-xs font-mono">
                        {usedKeysHistory.length > 0 ? usedKeysHistory.map((h, i) => (
                          <tr key={i} className="hover:bg-white/[0.02] transition-colors">
                            <td className="px-5 py-3.5 font-bold text-white">{h.key}</td>
                            <td className="px-5 py-3.5 text-zinc-400">{h.ip}</td>
                            <td className="px-5 py-3.5 text-zinc-400">{new Date(h.used_at).toLocaleString()}</td>
                            <td className="px-5 py-3.5">
                              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                                สำเร็จ
                              </span>
                            </td>
                          </tr>
                        )) : (
                          <tr><td colSpan={4} className="p-12 text-center text-xs text-zinc-500">ไม่มีประวัติการใช้งาน</td></tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </motion.div>
              )}

              {/* ==============================================================
                  Tab: Security & Blocked IPs
                  ============================================================== */}
              {adminTab === 'ips' && (
                <motion.div 
                  key="ips"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  className="rounded-[28px] bg-[#0f121a] border border-white/[0.08] overflow-hidden shadow-xl"
                >
                  <div className="p-6 sm:p-7 border-b border-white/[0.08] flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                      <h3 className="text-base font-bold text-white flex items-center gap-2">
                        <ShieldAlert className="w-5 h-5 text-rose-400" />
                        IP Access Control & Security
                      </h3>
                      <p className="text-xs text-zinc-400 mt-0.5">ระงับและจำกัดสิทธิ์การเข้าถึงจาก IP ที่ไม่พึงประสงค์</p>
                    </div>
                    <div className="flex items-center gap-3 w-full sm:w-auto">
                      <div className="relative flex-1 sm:w-56">
                        <Search className="w-3.5 h-3.5 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                          type="text"
                          placeholder="ค้นหา IP หรือเหตุผล..."
                          value={ipSearch}
                          onChange={e => setIpSearch(e.target.value)}
                          className="w-full bg-[#151926] border border-white/[0.08] rounded-full pl-8 pr-3 py-2 text-xs text-white placeholder:text-zinc-500 focus:outline-none focus:border-rose-500/60"
                        />
                      </div>
                      <button 
                        onClick={blockIP} 
                        className="px-5 py-2 rounded-full bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold transition-all shadow-md shadow-rose-500/20 flex items-center gap-2 cursor-pointer active:scale-95 shrink-0"
                      >
                        <Ban className="w-4 h-4" /> แบน IP ใหม่
                      </button>
                    </div>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-zinc-300">
                      <thead className="text-[11px] uppercase tracking-wider text-zinc-400 bg-white/[0.02] border-b border-white/[0.06] font-semibold">
                        <tr>
                          <th className="px-5 py-3.5">IP Address</th>
                          <th className="px-5 py-3.5">เหตุผล</th>
                          <th className="px-5 py-3.5">วันที่แบน</th>
                          <th className="px-5 py-3.5 text-right">การจัดการ</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/[0.04] text-xs font-mono">
                        {filteredBlockedIPs.length > 0 ? filteredBlockedIPs.map((ip, i) => (
                          <tr key={i} className="hover:bg-white/[0.02] transition-colors">
                            <td className="px-5 py-3.5">
                              <div className="flex items-center gap-2">
                                <span className="text-rose-400 font-bold">{ip.ip}</span>
                                <button onClick={() => { navigator.clipboard.writeText(ip.ip); Swal.fire({ title: 'Copied!', text: 'คัดลอก IP แล้ว', icon: 'success', timer: 1000, showConfirmButton: false, background: '#0d1017', color: '#fff' }); }} className="text-zinc-500 hover:text-white cursor-pointer">
                                  <Copy className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </td>
                            <td className="px-5 py-3.5 text-zinc-400 italic">"{ip.reason}"</td>
                            <td className="px-5 py-3.5 text-zinc-400">{new Date(ip.blocked_at).toLocaleDateString()}</td>
                            <td className="px-5 py-3.5 text-right">
                              <button 
                                onClick={() => unblockIP(ip.ip)} 
                                className="px-4 py-1.5 rounded-full bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/20 text-xs font-bold transition-all cursor-pointer"
                              >
                                ปลดแบน (Unblock)
                              </button>
                            </td>
                          </tr>
                        )) : (
                          <tr><td colSpan={4} className="p-12 text-center text-xs text-zinc-500">ไม่มีรายการแบน</td></tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </motion.div>
              )}

              {/* ==============================================================
                  Tab: Custom Pages
                  ============================================================== */}
              {adminTab === 'pages' && (
                <motion.div 
                  key="pages"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                >
                  <AdminPagesManagement customPages={customPages} setCustomPages={setCustomPages} />
                </motion.div>
              )}

              {/* ==============================================================
                  Tab: Tools & Giveaways
                  ============================================================== */}
              {adminTab === 'tools' && (
                <motion.div 
                  key="tools"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                >
                  <AdminToolsManagement />
                </motion.div>
              )}

              {/* ==============================================================
                  Tab: API Keys
                  ============================================================== */}
              {adminTab === 'api_keys' && (
                <motion.div 
                  key="api_keys"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                >
                  <AdminApiKeys />
                </motion.div>
              )}

              {/* ==============================================================
                  Tab: Settings
                  ============================================================== */}
              {adminTab === 'settings' && (
                <motion.div 
                  key="settings"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  className="space-y-6"
                >
                  <div className="rounded-[28px] bg-[#0f121a] border border-white/[0.08] overflow-hidden shadow-xl">
                    <div className="p-6 sm:p-7 border-b border-white/[0.08]">
                      <h3 className="text-base font-bold text-white flex items-center gap-2">
                        <Settings className="w-5 h-5 text-blue-400" />
                        การตั้งค่าระบบและเว็บไซต์ (Site Settings)
                      </h3>
                      <p className="text-xs text-zinc-400 mt-0.5">กำหนดค่าข้อมูลแบรนด์ ช่องทางชำระเงิน และการเชื่อมต่อ</p>
                    </div>

                    <div className="p-6 sm:p-7 space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div className="space-y-1.5">
                          <label className="text-xs font-semibold text-zinc-300 flex items-center gap-1.5">
                            <Globe className="w-3.5 h-3.5 text-blue-400" /> ชื่อเว็บไซต์ (Site Name)
                          </label>
                          <input 
                            type="text"
                            value={siteSettings.site_name}
                            onChange={(e) => setSiteSettings({ ...siteSettings, site_name: e.target.value })}
                            className="w-full bg-[#151926] border border-white/[0.08] rounded-full px-5 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500"
                            placeholder="DEV"
                          />
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-xs font-semibold text-zinc-300 flex items-center gap-1.5">
                            <Phone className="w-3.5 h-3.5 text-emerald-400" /> เบอร์รับเงิน TrueWallet
                          </label>
                          <input 
                            type="text"
                            value={siteSettings.truewallet_phone}
                            onChange={(e) => setSiteSettings({ ...siteSettings, truewallet_phone: e.target.value })}
                            className="w-full bg-[#151926] border border-white/[0.08] rounded-full px-5 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500"
                            placeholder="095xxxxxxx"
                          />
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-xs font-semibold text-zinc-300 flex items-center gap-1.5">
                            <Users className="w-3.5 h-3.5 text-indigo-400" /> ลิงก์ Discord
                          </label>
                          <input 
                            type="text"
                            value={siteSettings.discord_link}
                            onChange={(e) => setSiteSettings({ ...siteSettings, discord_link: e.target.value })}
                            className="w-full bg-[#151926] border border-white/[0.08] rounded-full px-5 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500"
                            placeholder="https://discord.gg/..."
                          />
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-xs font-semibold text-zinc-300 flex items-center gap-1.5">
                            <Users className="w-3.5 h-3.5 text-blue-400" /> ลิงก์ Facebook / Line Contact
                          </label>
                          <input 
                            type="text"
                            value={siteSettings.facebook_link || siteSettings.contact_line}
                            onChange={(e) => setSiteSettings({ ...siteSettings, facebook_link: e.target.value, contact_line: e.target.value })}
                            className="w-full bg-[#151926] border border-white/[0.08] rounded-full px-5 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500"
                            placeholder="https://facebook.com/..."
                          />
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-xs font-semibold text-zinc-300 flex items-center gap-1.5">
                            <MessageSquare className="w-3.5 h-3.5 text-emerald-400" /> ข้อความประกาศวิ่ง (Announcement Bar)
                          </label>
                          <input 
                            type="text"
                            value={siteSettings.announcement_text || ''}
                            onChange={(e) => setSiteSettings({ ...siteSettings, announcement_text: e.target.value })}
                            className="w-full bg-[#151926] border border-white/[0.08] rounded-full px-5 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500"
                            placeholder="ข้อความที่ต้องการให้แสดงบนแถบประกาศ..."
                          />
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-xs font-semibold text-zinc-300 flex items-center gap-1.5">
                            <Users className="w-3.5 h-3.5 text-zinc-400" /> อีเมลติดต่อ (Support)
                          </label>
                          <input 
                            type="email"
                            value={siteSettings.contact_email}
                            onChange={(e) => setSiteSettings({ ...siteSettings, contact_email: e.target.value })}
                            className="w-full bg-[#151926] border border-white/[0.08] rounded-full px-5 py-2.5 text-sm text-white focus:outline-none focus:border-zinc-500"
                            placeholder="support@example.com"
                          />
                        </div>
                      </div>

                      {/* Music player section */}
                      <div className="p-5 sm:p-6 rounded-[22px] bg-[#121622]/60 border border-white/[0.06] space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="text-xs font-bold text-white flex items-center gap-2">
                              <Globe className="w-4 h-4 text-blue-400" /> แผงควบคุมเพลงพื้นหลัง (Background Music)
                            </h4>
                            <p className="text-[11px] text-zinc-400 mt-0.5">ระบุ URL เพลง หรืออัปโหลดไฟล์ MP3 โดยตรง</p>
                          </div>
                          <button 
                            onClick={() => musicFileRef.current?.click()}
                            disabled={uploadingMusic}
                            className="px-4 py-2 rounded-full bg-blue-600/15 hover:bg-blue-600/25 border border-blue-500/25 text-blue-400 text-xs font-semibold flex items-center gap-1.5 transition-colors disabled:opacity-50 cursor-pointer"
                          >
                            {uploadingMusic ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Upload className="w-3.5 h-3.5" />}
                            อัปโหลด MP3
                          </button>
                          <input 
                            type="file" 
                            ref={musicFileRef} 
                            onChange={handleMusicUpload} 
                            className="hidden" 
                            accept="audio/*"
                          />
                        </div>
                        <input 
                          type="text"
                          value={siteSettings.spotify_url || ''}
                          onChange={(e) => setSiteSettings({ ...siteSettings, spotify_url: e.target.value })}
                          className="w-full bg-[#151926] border border-white/[0.08] rounded-full px-5 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500"
                          placeholder="https://... ลิงก์ไฟล์เสียง หรือ YouTube"
                        />
                      </div>

                      <div className="flex justify-end pt-2">
                        <button 
                          onClick={handleSaveSettings}
                          className="px-6 py-2.5 rounded-full bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all shadow-md shadow-blue-500/20 flex items-center gap-2 cursor-pointer active:scale-95"
                        >
                          <Check className="w-4 h-4" /> บันทึกการตั้งค่าทั้งหมด
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* ==============================================================
                  Tab: Banners & Popup
                  ============================================================== */}
              {adminTab === 'banners' && (
                <motion.div 
                  key="banners"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  className="space-y-6"
                >
                  <div className="rounded-[28px] bg-[#0f121a] border border-white/[0.08] overflow-hidden shadow-xl">
                    <div className="p-6 sm:p-7 border-b border-white/[0.08]">
                      <h3 className="text-base font-bold text-white flex items-center gap-2">
                        <ImageIcon className="w-5 h-5 text-blue-400" />
                        จัดการป้ายโฆษณา & ป๊อปอัพ (Banners & Popups)
                      </h3>
                      <p className="text-xs text-zinc-400 mt-0.5">ตั้งค่ารูปภาพสไลด์หน้าแรกและป๊อปอัพประกาศข่าวสาร</p>
                    </div>

                    <div className="p-6 sm:p-7 space-y-6">
                      {/* Popup Announcement */}
                      <div className="p-5 sm:p-6 rounded-[22px] bg-[#121622]/60 border border-white/[0.06] space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="text-xs font-bold text-white">ป๊อปอัพประกาศหน้าแรก (Popup Announcement)</h4>
                            <p className="text-[11px] text-zinc-400 mt-0.5">แสดงภาพประกาศแบบ Modal ทันทีที่ผู้ใช้เข้าสู่หน้าแรก</p>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input 
                              type="checkbox" 
                              className="sr-only peer" 
                              checked={siteSettings.popup_enabled}
                              onChange={(e) => setSiteSettings({ ...siteSettings, popup_enabled: e.target.checked })}
                            />
                            <div className="w-11 h-6 bg-white/[0.1] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                          </label>
                        </div>

                        <div className="space-y-3">
                          <label className="text-xs font-semibold text-zinc-300">URL รูปภาพป๊อปอัพ</label>
                          <div className="flex gap-2">
                            <input 
                              type="text" 
                              value={siteSettings.popup_img_url}
                              onChange={(e) => setSiteSettings({ ...siteSettings, popup_img_url: e.target.value })}
                              className="flex-1 bg-[#151926] border border-white/[0.08] rounded-full px-5 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500"
                              placeholder="https://..."
                            />
                            <button
                              type="button"
                              onClick={() => {
                                const input = document.createElement('input');
                                input.type = 'file';
                                input.accept = 'image/*';
                                input.onchange = async (e: any) => {
                                  const file = e.target.files?.[0];
                                  if (!file) return;
                                  try {
                                    const formData = new FormData();
                                    formData.append('file', file);
                                    Swal.fire({ title: 'กำลังอัปโหลด...', allowOutsideClick: false, didOpen: () => Swal.showLoading(), background: '#0d1017', color: '#fff' });
                                    const res = await axios.post('/api/upload', formData);
                                    if (res.data?.url) {
                                      setSiteSettings({ ...siteSettings, popup_img_url: res.data.url });
                                      Swal.fire({ icon: 'success', title: 'อัปโหลดสำเร็จ', timer: 1500, showConfirmButton: false, background: '#0d1017', color: '#fff' });
                                    }
                                  } catch (err: any) {
                                    Swal.fire({ title: 'Error', text: err.message, icon: 'error', background: '#0d1017', color: '#fff' });
                                  }
                                };
                                input.click();
                              }}
                              className="px-5 py-2.5 rounded-full bg-white/[0.06] hover:bg-white/[0.1] border border-white/[0.08] text-xs font-bold text-white flex items-center gap-1.5 transition-colors cursor-pointer"
                            >
                              <Upload className="w-4 h-4" /> เลือกไฟล์
                            </button>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <label className="text-xs font-semibold text-zinc-300">ลิงก์ปลายทางเมื่อคลิกรูปภาพ (ปล่อยว่างได้)</label>
                          <input 
                            type="text" 
                            value={siteSettings.popup_link}
                            onChange={(e) => setSiteSettings({ ...siteSettings, popup_link: e.target.value })}
                            className="w-full bg-[#151926] border border-white/[0.08] rounded-full px-5 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500"
                            placeholder="https://..."
                          />
                        </div>
                      </div>

                      {/* Homepage Slider Banners */}
                      <div className="p-5 sm:p-6 rounded-[22px] bg-[#121622]/60 border border-white/[0.06] space-y-3">
                        <h4 className="text-xs font-bold text-white">ภาพสไลด์แบนเนอร์หน้าแรก (1 บรรทัดต่อ 1 URL)</h4>
                        <textarea 
                          value={(siteSettings.banners || []).join('\n')}
                          onChange={(e) => setSiteSettings({ ...siteSettings, banners: e.target.value.split('\n') })}
                          className="w-full bg-[#151926] border border-white/[0.08] rounded-2xl p-4 text-xs font-mono text-zinc-300 focus:outline-none focus:border-blue-500 h-28 resize-none"
                          placeholder="https://img.th/banner1.png&#10;https://img.th/banner2.png"
                        />
                      </div>

                      {/* Proxy Settings */}
                      <div className="p-5 sm:p-6 rounded-[22px] bg-[#121622]/60 border border-white/[0.06] space-y-3">
                        <div className="flex items-center justify-between">
                          <h4 className="text-xs font-bold text-white">Proxy Settings (สำหรับระบบตรวจเช็คไอดี)</h4>
                          <button
                            type="button"
                            onClick={async () => {
                              try {
                                Swal.fire({ title: 'กำลังดึง Proxy...', allowOutsideClick: false, didOpen: () => Swal.showLoading(), background: '#0d1017', color: '#fff' });
                                const res = await axios.get('https://raw.githubusercontent.com/proxifly/free-proxy-list/main/proxies/protocols/http/data.txt');
                                if (typeof res.data === 'string') {
                                  let px = res.data.split('\n').filter((p: string) => p.trim().length > 5);
                                  px = px.map((p: string) => p.startsWith('http') ? p : `http://${p}`);
                                  setSiteSettings({ ...siteSettings, proxies: px });
                                  Swal.fire({ icon: 'success', title: 'สำเร็จ', text: `ดึง Proxy ได้ทั้งหมด ${px.length} รายการ`, background: '#0d1017', color: '#fff' });
                                }
                              } catch (err: any) {
                                Swal.fire({ icon: 'error', title: 'ผิดพลาด', text: err.message, background: '#0d1017', color: '#fff' });
                              }
                            }}
                            className="text-xs font-semibold text-blue-400 hover:text-blue-300 flex items-center gap-1.5 cursor-pointer"
                          >
                            <Globe className="w-3.5 h-3.5" /> ดึง Proxy ล่าสุด (Proxifly)
                          </button>
                        </div>
                        <textarea 
                          value={(siteSettings.proxies || []).join('\n')}
                          onChange={(e) => setSiteSettings({ ...siteSettings, proxies: e.target.value.split('\n') })}
                          className="w-full bg-[#151926] border border-white/[0.08] rounded-2xl p-4 text-xs font-mono text-zinc-300 focus:outline-none focus:border-blue-500 h-24 resize-none"
                          placeholder="http://user:pass@127.0.0.1:8080"
                        />
                      </div>

                      <div className="flex justify-end pt-2">
                        <button 
                          onClick={handleSaveSettings}
                          className="px-6 py-2.5 rounded-full bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all shadow-md shadow-blue-500/20 flex items-center gap-2 cursor-pointer active:scale-95"
                        >
                          <Check className="w-4 h-4" /> บันทึกแบนเนอร์และป๊อปอัพ
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* ==============================================================
                  Tab: System Monitoring
                  ============================================================== */}
              {adminTab === 'system' && (
                <motion.div 
                  key="system"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  className="space-y-6"
                >
                  <div className="rounded-[28px] bg-[#0f121a] border border-white/[0.08] overflow-hidden shadow-xl">
                    <div className="p-6 sm:p-7 border-b border-white/[0.08]">
                      <h3 className="text-base font-bold text-white flex items-center gap-2">
                        <Cpu className="w-5 h-5 text-indigo-400" />
                        สถานะระบบและทรัพยากร (System Monitoring)
                      </h3>
                      <p className="text-xs text-zinc-400 mt-0.5">การจัดสรรทรัพยากรของเครื่องแม่ข่ายและสภาพแวดล้อมรันไทม์</p>
                    </div>

                    <div className="p-6 sm:p-7 space-y-6">
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        {[
                          { label: "CPU Usage", value: "12%", icon: Cpu, color: "text-amber-400", bg: "bg-amber-500/10 border-amber-500/20" },
                          { label: "Memory (RAM)", value: "512MB / 1GB", icon: HardDrive, color: "text-indigo-400", bg: "bg-indigo-500/10 border-indigo-500/20" },
                          { label: "Network Bandwidth", value: "24 Mbps", icon: Activity, color: "text-emerald-400", bg: "bg-emerald-500/10 border-emerald-500/20" },
                          { label: "Server Uptime", value: "94 Days", icon: BarChart3, color: "text-cyan-400", bg: "bg-cyan-500/10 border-cyan-500/20" }
                        ].map((stat, i) => (
                          <div key={i} className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.06] flex items-center gap-4">
                            <div className={`p-3 rounded-xl border ${stat.bg} ${stat.color}`}>
                              <stat.icon className="w-5 h-5" />
                            </div>
                            <div>
                              <p className="text-[11px] font-semibold text-zinc-400">{stat.label}</p>
                              <p className="text-base font-bold font-mono text-white mt-0.5">{stat.value}</p>
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/[0.06] space-y-3 font-mono text-xs">
                        <div className="flex justify-between border-b border-white/[0.04] pb-2 text-zinc-400">
                          <span>Runtime Environment</span>
                          <span className="text-white font-bold">Node.js 22.x</span>
                        </div>
                        <div className="flex justify-between border-b border-white/[0.04] pb-2 text-zinc-400">
                          <span>Database Connectivity</span>
                          <span className="text-emerald-400 font-bold">Online &amp; Synchronized</span>
                        </div>
                        <div className="flex justify-between border-b border-white/[0.04] pb-2 text-zinc-400">
                          <span>Vite Bundler</span>
                          <span className="text-blue-400 font-bold">Optimized Production</span>
                        </div>
                        <div className="flex justify-between text-zinc-400">
                          <span>Manybaht TrueWallet API</span>
                          <span className="text-emerald-400 font-bold">Ready</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          )}
        </div>
      </main>

      {/* Modals */}
      {isAddingProduct && (
        <ProductManagerModal 
          isEdit={false}
          categories={categories}
          onClose={() => setIsAddingProduct(false)}
          onSave={async (p) => {
            if (setProducts) {
              try {
                const res = await axios.post('/api/products', p, {
                  headers: { 'Idempotency-Key': `post_product_${Date.now()}_${Math.random()}` }
                });
                setProducts(prev => [...prev, res.data]);
                if (onRefreshData) onRefreshData();
                setIsAddingProduct(false);
                Swal.fire({ title: 'เพิ่มสินค้าสำเร็จ', icon: 'success', background: '#0d1017', color: '#fff', timer: 1500, showConfirmButton: false });
              } catch (err: any) {
                Swal.fire({ title: 'Error', text: err?.response?.data?.error || err.message, icon: 'error', background: '#0d1017', color: '#fff' });
              }
            }
          }}
        />
      )}

      {editingProduct && (
        <ProductManagerModal 
          product={editingProduct}
          isEdit={true}
          categories={categories}
          onClose={() => setEditingProduct(undefined)}
          onSave={async (p) => {
            if (setProducts) {
              try {
                const res = await axios.put(`/api/products/${p.id}`, p, {
                  headers: { 'Idempotency-Key': `put_product_${p.id}_${p._version}_${Date.now()}_${Math.random()}` }
                });
                setProducts(prev => prev.map(prod => prod.id === p.id ? res.data : prod));
                if (onRefreshData) onRefreshData();
                setEditingProduct(undefined);
                Swal.fire({ title: 'แก้ไขสินค้าสำเร็จ', icon: 'success', background: '#0d1017', color: '#fff', timer: 1500, showConfirmButton: false });
              } catch (err: any) {
                Swal.fire({ title: 'Error', text: err?.response?.data?.error || err.message, icon: 'error', background: '#0d1017', color: '#fff' });
              }
            }
          }}
        />
      )}

      {stockProduct && (
        <AddStockModal 
          product={stockProduct}
          onClose={() => setStockProduct(undefined)}
          onAppendStock={async (newItems) => {
            if (setProducts) {
              try {
                const res = await axios.post(`/api/products/${stockProduct.id}/stock`, { newItems });
                if (res.data?.product) {
                  setProducts(prev => prev.map(prod => prod.id === stockProduct.id ? res.data.product : prod));
                } else {
                  const fresh = await axios.get(`/api/products/${stockProduct.id}`);
                  setProducts(prev => prev.map(prod => prod.id === stockProduct.id ? fresh.data : prod));
                }
                setStockProduct(undefined);
                Swal.fire({ title: 'เพิ่มสต๊อกสำเร็จ', text: `เพิ่มแล้ว ${newItems.length} รายการ`, icon: 'success', background: '#0d1017', color: '#fff', timer: 1500, showConfirmButton: false });
              } catch (err: any) {
                Swal.fire({ title: 'Error', text: err.response?.data?.error || err.message, icon: 'error', background: '#0d1017', color: '#fff' });
              }
            }
          }}
        />
      )}
    </div>
  );
};
