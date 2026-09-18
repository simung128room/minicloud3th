import React, { useState } from 'react';
import { X, Eye, AlertCircle, ShoppingCart, Download, Copy, Check, Sparkles, Receipt } from 'lucide-react';
import { motion } from 'motion/react';

interface ReceiptModalProps {
  selectedItem: any;
  setSelectedItem: (item: any) => void;
}

export const ReceiptModal: React.FC<ReceiptModalProps> = ({ selectedItem, setSelectedItem }) => {
  const [showSecret, setShowSecret] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  if (!selectedItem) return null;
  
  const isPurchase = !selectedItem.type?.includes('topup');

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
        className="bg-[#0c0c12]/95 border border-white/[0.12] w-full max-w-[650px] rounded-[32px] relative overflow-hidden flex flex-col max-h-[90vh] shadow-[0_25px_70px_rgba(0,0,0,0.8)] glass-card glass-reflection"
      >
        {/* Top Highlight Line */}
        <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-blue-500/40 to-transparent pointer-events-none" />

        {/* Header */}
        <div className="pt-6 px-6 sm:px-8 pb-4 flex items-center justify-between border-b border-white/[0.08]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
              <Receipt className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-black text-white tracking-tight">
                {isPurchase ? 'ใบเสร็จการสั่งซื้อ' : 'ใบเสร็จการเติมเงิน'}
              </h3>
              <p className="text-xs font-mono text-white/40">
                {selectedItem.billNumber || `#${(selectedItem.id || 'TX000000').substring(0, 10).toUpperCase()}`}
              </p>
            </div>
          </div>

          <button 
            onClick={() => setSelectedItem(null)}
            className="w-9 h-9 bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] flex items-center justify-center text-white/60 hover:text-white transition-all rounded-full cursor-pointer active:scale-95"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="overflow-y-auto p-6 sm:p-8 scrollbar-hide flex-1 space-y-6">
          {/* Summary Box */}
          <div className="bg-white/[0.02] border border-white/[0.08] p-5 rounded-2xl space-y-3">
            <h4 className="text-[10px] font-bold text-white/40 uppercase tracking-wider">ข้อมูลการทำรายการ</h4>
            
            <div className="flex items-center justify-between text-xs sm:text-sm">
              <span className="text-white/50">วันที่ทำรายการ</span>
              <span className="text-white font-medium">
                {new Date(selectedItem.date || selectedItem.timestamp || new Date()).toLocaleString('th-TH')}
              </span>
            </div>

            <div className="flex items-center justify-between text-xs sm:text-sm">
              <span className="text-white/50">ช่องทาง / บริการ</span>
              <span className="text-white font-medium">
                {isPurchase ? (selectedItem.productName || 'สินค้าดิจิทัล') : (selectedItem.method || 'เติมเงินเข้าระบบ')}
              </span>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-white/[0.06]">
              <span className="text-white font-bold text-sm">ยอดเงินรวม</span>
              <span className="text-xl font-black text-blue-400 font-mono">
                ฿{(selectedItem.money || selectedItem.amount || selectedItem.price || 0).toLocaleString()}
              </span>
            </div>
          </div>

          {/* Secret / Key Delivery Box if purchase */}
          {isPurchase && selectedItem.secretData && (
            <div className="bg-white/[0.02] border border-white/[0.08] p-5 rounded-2xl">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-[10px] font-bold text-white/40 uppercase tracking-wider">ข้อมูลสินค้า / คีย์ลับ</h4>
                
                {showSecret && (
                  <div className="flex gap-2">
                    <button 
                      onClick={() => {
                        navigator.clipboard.writeText(selectedItem.secretData);
                        setIsCopied(true);
                        setTimeout(() => setIsCopied(false), 2000);
                      }}
                      className="text-xs font-bold text-blue-400 hover:text-blue-300 bg-blue-500/10 border border-blue-500/20 px-3 py-1.5 rounded-full flex items-center gap-1.5 transition-all cursor-pointer"
                    >
                      {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{isCopied ? 'คัดลอกแล้ว' : 'คัดลอก'}</span>
                    </button>
                    <button 
                      onClick={() => {
                        const blob = new Blob([selectedItem.secretData], { type: 'text/plain;charset=utf-8' });
                        const url = URL.createObjectURL(blob);
                        const link = document.createElement('a');
                        link.href = url;
                        link.download = `key_${(selectedItem.productName || 'product').replace(/[^\wก-๙]/g, '_')}.txt`;
                        link.click();
                        URL.revokeObjectURL(url);
                      }}
                      className="text-xs font-bold text-white/60 hover:text-white bg-white/[0.04] border border-white/[0.08] px-3 py-1.5 rounded-full flex items-center gap-1.5 transition-all cursor-pointer"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>ดาวน์โหลด</span>
                    </button>
                  </div>
                )}
              </div>

              {!showSecret ? (
                <button 
                  onClick={() => setShowSecret(true)}
                  className="w-full py-3.5 bg-gradient-to-r from-blue-600/20 to-cyan-500/20 hover:from-blue-600/30 hover:to-cyan-500/30 text-blue-400 border border-blue-500/30 text-xs font-bold rounded-full flex items-center justify-center gap-2 transition-all cursor-pointer active:scale-98"
                >
                  <Eye className="w-4 h-4" />
                  <span>คลิกเพื่อดูข้อมูลสินค้า / รหัสคีย์</span>
                </button>
              ) : (
                <div className="bg-[#08080c] border border-white/[0.08] p-4 text-xs sm:text-sm font-mono text-cyan-300 whitespace-pre-wrap max-h-48 overflow-y-auto w-full break-all rounded-2xl select-all">
                  {selectedItem.secretData}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-6 border-t border-white/[0.08] bg-white/[0.01]">
          <button 
            onClick={() => setSelectedItem(null)}
            className="w-full py-3.5 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white text-xs font-black uppercase tracking-wider rounded-full shadow-lg shadow-blue-500/20 transition-all active:scale-[0.98] cursor-pointer"
          >
            ปิดหน้าต่าง
          </button>
        </div>
      </motion.div>
    </div>
  );
};
