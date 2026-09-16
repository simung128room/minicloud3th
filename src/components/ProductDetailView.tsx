import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Product } from '../types';
import { ArrowLeft, Box, CheckCircle2, ChevronRight, FileText, ShoppingCart, AlertCircle, Download, Share2, Sparkles, ShieldCheck, Zap } from 'lucide-react';
import Swal from 'sweetalert2';
import { useToastStore } from '../lib/toastStore';

interface ProductDetailViewProps {
  product: Product;
  user: any;
  onBack: () => void;
  handlePurchase: (product: Product, quantity: number) => Promise<void>;
  setActiveView: (view: any) => void;
}

export const ProductDetailView: React.FC<ProductDetailViewProps> = ({ product, user, onBack, handlePurchase, setActiveView }) => {
  const [purchaseQuantity, setPurchaseQuantity] = useState(1);
  const [showConfirmPurchase, setShowConfirmPurchase] = useState(false);
  const { addToast } = useToastStore();

  const calculateDiscount = (originalPrice?: number, price?: number) => {
    if (!originalPrice || !price || originalPrice <= price) return null;
    return Math.round(((originalPrice - price) / originalPrice) * 100);
  };

  const discount = calculateDiscount(product.originalPrice, product.price);

  return (
    <div className="w-full max-w-5xl mx-auto p-4 sm:p-6 lg:p-8 font-sans text-white">
      {/* Breadcrumb Navigation */}
      <motion.div 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-2 mb-6 text-xs sm:text-sm"
      >
        <button 
          onClick={onBack} 
          className="text-white/50 hover:text-blue-400 transition-colors flex items-center gap-1.5 font-bold px-3 py-1.5 rounded-full bg-white/[0.04] border border-white/[0.08] hover:border-white/20 active:scale-95 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4 text-blue-400" />
          <span>กลับสู่หน้าหลัก</span>
        </button>
        <ChevronRight className="w-4 h-4 text-white/30" />
        <span className="text-white/90 font-bold truncate max-w-[200px] sm:max-w-md">{product.name}</span>
      </motion.div>

      {/* Main Glassmorphic Product Card */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
        className="relative overflow-hidden rounded-[32px] border border-white/[0.1] bg-[#0c0c12]/85 backdrop-blur-2xl shadow-[0_24px_60px_-15px_rgba(0,0,0,0.8),0_0_40px_rgba(37,99,235,0.08)] flex flex-col md:flex-row glass-card glass-reflection"
      >
        {/* Prismatic Top Edge Light */}
        <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/25 to-transparent pointer-events-none z-20" />

        {/* Left Side: Product Image & Gallery Display */}
        <div className="w-full md:w-5/12 lg:w-1/2 p-6 sm:p-8 flex flex-col items-center justify-center bg-[#08080c]/60 border-b md:border-b-0 md:border-r border-white/[0.08] relative overflow-hidden">
          {/* Subtle Ambient Glow behind image */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

          <motion.div
            className="w-full aspect-square relative overflow-hidden rounded-[24px] border border-white/[0.12] bg-[#121218] group shadow-2xl"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.3 }}
          >
            <img 
              loading="lazy" 
              src={product.imageUrl || undefined} 
              alt={product.name}
              className="absolute inset-0 w-full h-full object-cover z-10 transition-transform duration-700 group-hover:scale-108 opacity-90 group-hover:opacity-100"
              onError={(e) => {
                e.currentTarget.src = "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=800&q=80";
              }}
              referrerPolicy="no-referrer"
            />
            {discount !== null && (
              <div className="absolute top-4 left-4 z-20 bg-gradient-to-r from-red-600 to-rose-600 text-white font-black px-3.5 py-1.5 rounded-full border border-red-500/40 text-xs shadow-lg shadow-red-500/30 flex items-center gap-1">
                <Sparkles className="w-3 h-3" />
                <span>-{discount}%</span>
              </div>
            )}
          </motion.div>
        </div>

        {/* Right Side: Product Details & Purchase Engine */}
        <div className="w-full md:w-7/12 lg:w-1/2 p-6 sm:p-8 lg:p-10 flex flex-col justify-between relative z-10">
          <div>
            {/* Badges Bar */}
            <div className="flex flex-wrap items-center gap-2.5 mb-4">
              <span className="px-3 py-1 bg-blue-500/10 text-blue-400 font-bold text-xs border border-blue-500/20 rounded-full flex items-center gap-1.5 uppercase tracking-wider">
                <Box className="w-3.5 h-3.5" /> Product
              </span>
              {product.stock > 0 ? (
                <span className="px-3 py-1 bg-emerald-500/10 text-emerald-400 font-bold text-xs border border-emerald-500/20 rounded-full flex items-center gap-1.5 uppercase tracking-wider">
                  <CheckCircle2 className="w-3.5 h-3.5" /> IN STOCK
                </span>
              ) : (
                <span className="px-3 py-1 bg-rose-500/10 text-rose-400 font-bold text-xs border border-rose-500/20 rounded-full flex items-center gap-1.5 uppercase tracking-wider">
                  <Box className="w-3.5 h-3.5" /> OUT OF STOCK
                </span>
              )}
            </div>
            
            {/* Title */}
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white leading-tight mb-4 tracking-tight">
              {product.name}
            </h1>
            
            {/* Price Row */}
            <div className="flex items-baseline gap-3 mb-6">
              <span className="text-3xl sm:text-4xl lg:text-5xl font-black text-white font-mono tracking-tight drop-shadow-[0_0_20px_rgba(59,130,246,0.3)]">
                ฿{(product.price || 0).toLocaleString()}
              </span>
              {product.originalPrice && product.price && product.originalPrice > product.price && (
                <span className="text-lg sm:text-xl font-bold text-white/40 line-through font-mono">
                  ฿{(product.originalPrice || 0).toLocaleString()}
                </span>
              )}
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-6">
              <div className="bg-white/[0.03] border border-white/[0.08] p-4 rounded-2xl">
                <div className="text-white/40 text-xs font-bold mb-1 flex items-center gap-1.5 uppercase tracking-wider">
                  <Box className="w-3.5 h-3.5 text-blue-400"/> สถานะสต๊อก
                </div>
                <div className={`text-xl font-black font-mono ${product.stock > 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {product.stock >= 999999 ? '∞ ไม่จำกัด' : `${product.stock.toLocaleString()} ชิ้น`}
                </div>
              </div>
              <div className="bg-white/[0.03] border border-white/[0.08] p-4 rounded-2xl">
                <div className="text-white/40 text-xs font-bold mb-1 flex items-center gap-1.5 uppercase tracking-wider">
                  <ShoppingCart className="w-3.5 h-3.5 text-blue-400"/> สั่งซื้อไปแล้ว
                </div>
                <div className="text-xl font-black font-mono text-white">
                  {(product.soldCount || 0).toLocaleString()} ครั้ง
                </div>
              </div>
            </div>

            {/* Description Section */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2.5">
                <h4 className="font-bold text-white text-sm sm:text-base flex items-center gap-2">
                  <FileText className="w-4 h-4 text-blue-400" />
                  รายละเอียดสินค้า
                </h4>
                <div className="flex gap-2">
                  <button 
                    onClick={() => {
                      const shareUrl = `${window.location.origin}/?product=${product.id}`;
                      navigator.clipboard.writeText(shareUrl).then(() => {
                        addToast({ title: "คัดลอกลิงก์แล้ว", message: "แชร์ลิงก์ให้เพื่อนได้เลย!", type: "success" });
                      });
                    }}
                    className="text-[11px] font-bold text-white/60 hover:text-white transition-all flex items-center gap-1.5 bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] px-3 py-1.5 rounded-full active:scale-95 cursor-pointer"
                  >
                    <Share2 className="w-3.5 h-3.5 text-blue-400" /> แชร์สินค้า
                  </button>
                  <button 
                    onClick={() => {
                      const content = `[PRODUCT INFORMATION]\nProduct Name: ${product.name}\nPrice: ฿${product.price}\nStock: ${product.stock >= 999999 ? 'Unlimited' : product.stock}\n\n[DESCRIPTION]\n${product.description || 'No description available.'}`;
                      const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
                      const url = URL.createObjectURL(blob);
                      const link = document.createElement('a');
                      link.href = url;
                      link.download = `${product.name.replace(/[^\wก-๙]/g, '_')}_details.txt`;
                      link.click();
                      URL.revokeObjectURL(url);
                    }}
                    className="text-[11px] font-bold text-white/60 hover:text-white transition-all flex items-center gap-1.5 bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] px-3 py-1.5 rounded-full active:scale-95 cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5 text-blue-400" /> ดาวน์โหลด .TXT
                  </button>
                </div>
              </div>
              <div className="text-white/70 text-xs sm:text-sm leading-relaxed whitespace-pre-wrap bg-white/[0.02] p-4 sm:p-5 border border-white/[0.06] rounded-2xl min-h-[100px] max-h-[220px] overflow-y-auto font-sans">
                {product.description || "ไม่มีรายละเอียดสินค้าระบุไว้"}
              </div>
            </div>
          </div>

          {/* Action & Checkout Controls */}
          <div className="mt-4 pt-4 border-t border-white/[0.08]">
            {!showConfirmPurchase ? (
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <label className="font-bold text-white text-xs sm:text-sm uppercase tracking-wider text-white/60">เลือกจำนวนชิ้น</label>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setPurchaseQuantity(Math.max(1, purchaseQuantity - 1))}
                      className="w-10 h-10 bg-white/[0.05] border border-white/[0.1] hover:bg-white/[0.1] flex items-center justify-center font-black text-lg text-white transition-colors active:scale-95 rounded-xl cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
                      disabled={purchaseQuantity <= 1}
                    >
                      -
                    </button>
                    <input
                      type="number"
                      min="1"
                      max={product.stock >= 999999 ? 999 : product.stock}
                      value={purchaseQuantity}
                      onChange={(e) => {
                        const val = parseInt(e.target.value);
                        if (!isNaN(val)) setPurchaseQuantity(Math.min(product.stock >= 999999 ? 999 : product.stock, Math.max(1, val)));
                      }}
                      className="w-20 h-10 bg-white/[0.03] border border-white/[0.1] text-center font-mono font-black text-lg outline-none focus:border-blue-500 rounded-xl transition-colors appearance-none m-0 text-white"
                      disabled={product.stock === 0}
                    />
                    <button
                      onClick={() => setPurchaseQuantity(Math.min(product.stock >= 999999 ? 999 : product.stock, purchaseQuantity + 1))}
                      className="w-10 h-10 bg-white/[0.05] border border-white/[0.1] hover:bg-white/[0.1] flex items-center justify-center font-black text-lg text-white transition-colors active:scale-95 rounded-xl cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
                      disabled={product.stock === 0 || purchaseQuantity >= product.stock}
                    >
                      +
                    </button>
                  </div>
                </div>

                <button 
                  onClick={() => {
                    if (!user) {
                      Swal.fire({ 
                        title: 'กรุณาเข้าสู่ระบบ', 
                        text: 'คุณต้องเข้าสู่ระบบก่อนทำการสั่งซื้อสินค้า', 
                        icon: 'warning', 
                        confirmButtonText: 'เข้าสู่ระบบ',
                        showCancelButton: true,
                        cancelButtonText: 'ปิด',
                        background: '#0c0c12',
                        color: '#fff',
                        confirmButtonColor: '#2563eb'
                      }).then((result) => {
                        if (result.isConfirmed) {
                          setActiveView('login');
                        }
                      });
                      return;
                    }
                    if (product.stock <= 0) return;
                    setShowConfirmPurchase(true);
                  }}
                  disabled={product.stock <= 0}
                  className={`w-full py-4 rounded-full text-sm font-black transition-all flex items-center justify-center gap-2 cursor-pointer ${
                    product.stock > 0 
                      ? 'bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white shadow-lg shadow-blue-600/30 hover:shadow-blue-500/50 active:scale-[0.99]' 
                      : 'bg-white/[0.05] text-white/30 border border-white/[0.05] cursor-not-allowed'
                  }`}
                >
                  <ShoppingCart className="w-4 h-4" />
                  <span>{product.stock > 0 ? `สั่งซื้อเลย (฿${((product.price || 0) * purchaseQuantity).toLocaleString()})` : 'สินค้าหมดชั่วคราว'}</span>
                </button>
              </div>
            ) : (
              <motion.div 
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-blue-600/10 border border-blue-500/30 p-5 rounded-2xl"
              >
                <div className="flex items-start gap-3.5 mb-4">
                  <div className="w-10 h-10 flex items-center justify-center rounded-xl bg-blue-600/20 text-blue-400 shrink-0 border border-blue-500/30">
                    <AlertCircle className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-black text-base text-white mb-1">ยืนยันการสั่งซื้อ</h3>
                    <p className="text-white/70 text-xs sm:text-sm leading-relaxed">
                      คุณกำลังสั่งซื้อ <span className="text-white font-bold">{product.name}</span> จำนวน <span className="text-blue-400 font-black">{purchaseQuantity}</span> ชิ้น ในราคารวม <span className="text-emerald-400 font-mono font-black">฿{((product.price || 0) * purchaseQuantity).toLocaleString()}</span>
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 w-full">
                  <button 
                    onClick={() => setShowConfirmPurchase(false)}
                    className="flex-1 py-3 bg-white/[0.05] border border-white/[0.1] hover:bg-white/[0.1] text-white font-bold transition-all text-xs rounded-full active:scale-95 cursor-pointer"
                  >
                    ยกเลิก
                  </button>
                  <button 
                    disabled={showConfirmPurchase === ('loading' as any)}
                    onClick={async () => {
                      setShowConfirmPurchase('loading' as any);
                      try {
                        await handlePurchase(product, purchaseQuantity);
                      } finally {
                        setShowConfirmPurchase(false);
                      }
                    }}
                    className="flex-1 py-3 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-black transition-all text-xs rounded-full shadow-lg shadow-blue-600/30 disabled:opacity-50 flex items-center justify-center gap-2 active:scale-95 cursor-pointer"
                  >
                    {showConfirmPurchase === ('loading' as any) ? (
                      <><div className="w-3.5 h-3.5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div> กำลังทำรายการ...</>
                    ) : 'ยืนยันการชำระเงิน'}
                  </button>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};
