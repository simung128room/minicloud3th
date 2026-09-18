import React, { useState, useMemo } from 'react';
import { 
  ShoppingCart, Search, Download, Calendar, Filter, 
  ExternalLink, Eye, Copy, CheckCircle2, Clock, 
  FileText, ArrowUpDown, Tag, Package, User
} from 'lucide-react';
import Swal from 'sweetalert2';
import { motion, AnimatePresence } from 'motion/react';

interface AdminOrdersManagementProps {
  purchaseHistory: any[];
  usersList?: any[];
  onRefresh?: () => void;
}

export const AdminOrdersManagement: React.FC<AdminOrdersManagementProps> = ({
  purchaseHistory = [],
  usersList = [],
  onRefresh
}) => {
  const [search, setSearch] = useState('');
  const [timeFilter, setTimeFilter] = useState<'all' | 'today' | '7days' | '30days'>('all');
  const [sortBy, setSortBy] = useState<'date_desc' | 'date_asc' | 'price_desc' | 'price_asc'>('date_desc');
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);

  // Filter and sort orders
  const filteredOrders = useMemo(() => {
    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
    const sevenDaysAgo = now.getTime() - (7 * 24 * 60 * 60 * 1000);
    const thirtyDaysAgo = now.getTime() - (30 * 24 * 60 * 60 * 1000);

    return purchaseHistory.filter(order => {
      const orderDate = new Date(order.date || order.timestamp || 0).getTime();
      
      // Time filter
      if (timeFilter === 'today' && orderDate < startOfToday) return false;
      if (timeFilter === '7days' && orderDate < sevenDaysAgo) return false;
      if (timeFilter === '30days' && orderDate < thirtyDaysAgo) return false;

      // Text search
      if (!search.trim()) return true;
      const term = search.toLowerCase();
      const pName = (order.product_name || order.productName || '').toLowerCase();
      const uId = (order.userId || order.uid || '').toLowerCase();
      const oId = (order.id || order.dbId || '').toLowerCase();
      
      // Also match user email if present in usersList
      const user = usersList.find(u => (u.id === order.userId || u.uid === order.userId));
      const userEmail = (user?.email || '').toLowerCase();

      return pName.includes(term) || uId.includes(term) || oId.includes(term) || userEmail.includes(term);
    }).sort((a, b) => {
      const dateA = new Date(a.date || a.timestamp || 0).getTime();
      const dateB = new Date(b.date || b.timestamp || 0).getTime();
      const priceA = Number(a.price) || 0;
      const priceB = Number(b.price) || 0;

      if (sortBy === 'date_desc') return dateB - dateA;
      if (sortBy === 'date_asc') return dateA - dateB;
      if (sortBy === 'price_desc') return priceB - priceA;
      if (sortBy === 'price_asc') return priceA - priceB;
      return 0;
    });
  }, [purchaseHistory, search, timeFilter, sortBy, usersList]);

  // Calculations for executive stats
  const totalRevenue = useMemo(() => {
    return filteredOrders.reduce((sum, o) => sum + (Number(o.price) || 0), 0);
  }, [filteredOrders]);

  const totalItemsSold = useMemo(() => {
    return filteredOrders.reduce((sum, o) => sum + (Number(o.quantity) || 1), 0);
  }, [filteredOrders]);

  const avgOrderValue = useMemo(() => {
    if (filteredOrders.length === 0) return 0;
    return Math.round(totalRevenue / filteredOrders.length);
  }, [filteredOrders, totalRevenue]);

  // Export to CSV
  const handleExportCSV = () => {
    if (filteredOrders.length === 0) {
      Swal.fire({
        title: 'ไม่มีข้อมูล',
        text: 'ไม่มีรายการคำสั่งซื้อตามตัวกรองที่เลือก',
        icon: 'info',
        background: '#0d1017',
        color: '#fff',
        confirmButtonColor: '#3b82f6'
      });
      return;
    }

    const headers = ['Order ID', 'Date', 'Product Name', 'Quantity', 'Price (THB)', 'User ID / Email'];
    const rows = filteredOrders.map(o => {
      const user = usersList.find(u => (u.id === o.userId || u.uid === o.userId));
      const userIdentifier = user?.email || o.userId || o.uid || 'Guest';
      const orderDate = new Date(o.date || o.timestamp || Date.now()).toLocaleString('th-TH');
      const pName = `"${(o.product_name || o.productName || 'Product').replace(/"/g, '""')}"`;
      return [
        o.id || o.dbId || 'N/A',
        `"${orderDate}"`,
        pName,
        o.quantity || 1,
        o.price || 0,
        `"${userIdentifier}"`
      ].join(',');
    });

    const csvContent = '\uFEFF' + [headers.join(','), ...rows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `orders_report_${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);

    Swal.fire({
      title: 'ส่งออกไฟล์สำเร็จ',
      text: `ดาวน์โหลดรายงานคำสั่งซื้อจำนวน ${filteredOrders.length} รายการแล้ว`,
      icon: 'success',
      background: '#0d1017',
      color: '#fff',
      timer: 1500,
      showConfirmButton: false
    });
  };

  return (
    <div className="space-y-6">
      {/* Top Header & Metric Highlights */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-[28px] bg-[#0f121a] border border-white/[0.08] relative overflow-hidden">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-zinc-400 mb-1">คำสั่งซื้อที่เลือก</p>
              <h3 className="text-2xl font-bold text-white tracking-tight">{filteredOrders.length.toLocaleString()} ออเดอร์</h3>
            </div>
            <div className="p-3 rounded-2xl border bg-blue-500/10 border-blue-500/20 text-blue-400">
              <ShoppingCart className="w-5 h-5" />
            </div>
          </div>
        </div>

        <div className="p-5 rounded-[28px] bg-[#0f121a] border border-white/[0.08] relative overflow-hidden">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-zinc-400 mb-1">ยอดขายรวมในมุมมอง</p>
              <h3 className="text-2xl font-bold text-emerald-400 font-mono tracking-tight">฿{totalRevenue.toLocaleString()}</h3>
            </div>
            <div className="p-3 rounded-2xl border bg-emerald-500/10 border-emerald-500/20 text-emerald-400">
              <Tag className="w-5 h-5" />
            </div>
          </div>
        </div>

        <div className="p-5 rounded-[28px] bg-[#0f121a] border border-white/[0.08] relative overflow-hidden">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-zinc-400 mb-1">จำนวนชิ้นที่จำหน่าย</p>
              <h3 className="text-2xl font-bold text-indigo-400 font-mono tracking-tight">{totalItemsSold.toLocaleString()} ชิ้น</h3>
            </div>
            <div className="p-3 rounded-2xl border bg-indigo-500/10 border-indigo-500/20 text-indigo-400">
              <Package className="w-5 h-5" />
            </div>
          </div>
        </div>

        <div className="p-5 rounded-[28px] bg-[#0f121a] border border-white/[0.08] relative overflow-hidden">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-zinc-400 mb-1">ยอดเฉลี่ยต่อบิล (AOV)</p>
              <h3 className="text-2xl font-bold text-cyan-400 font-mono tracking-tight">฿{avgOrderValue.toLocaleString()}</h3>
            </div>
            <div className="p-3 rounded-2xl border bg-cyan-500/10 border-cyan-500/20 text-cyan-400">
              <ArrowUpDown className="w-5 h-5" />
            </div>
          </div>
        </div>
      </div>

      {/* Main Table Card */}
      <div className="rounded-[28px] bg-[#0f121a] border border-white/[0.08] overflow-hidden shadow-xl">
        {/* Controls Toolbar */}
        <div className="p-6 sm:p-7 border-b border-white/[0.08] flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <ShoppingCart className="w-5 h-5 text-blue-400" />
              รายการคำสั่งซื้อสินค้า (Order Records)
            </h3>
            <p className="text-xs text-zinc-400 mt-0.5">
              ตรวจสอบประวัติการซื้อ ยอดชำระ และข้อมูลสินค้าที่ส่งมอบให้ลูกค้า
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 w-full lg:w-auto">
            {/* Search Input */}
            <div className="relative flex-1 sm:w-64 min-w-[200px]">
              <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input 
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="ค้นหาชื่อสินค้า, รหัส, อีเมล..."
                className="w-full bg-[#151926] border border-white/[0.08] rounded-full pl-9 pr-4 py-2 text-xs text-white placeholder:text-zinc-500 focus:outline-none focus:border-blue-500/60"
              />
            </div>

            {/* Time Filter Pills */}
            <div className="flex items-center bg-[#151926] p-1 rounded-full border border-white/[0.08]">
              {[
                { id: 'all', label: 'ทั้งหมด' },
                { id: 'today', label: 'วันนี้' },
                { id: '7days', label: '7 วัน' },
                { id: '30days', label: '30 วัน' }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setTimeFilter(tab.id as any)}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                    timeFilter === tab.id 
                      ? 'bg-blue-600 text-white shadow-sm' 
                      : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Sort Selector */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-[#151926] border border-white/[0.08] rounded-full px-3.5 py-2 text-xs text-zinc-300 focus:outline-none focus:border-blue-500/60 cursor-pointer"
            >
              <option value="date_desc">ล่าสุดก่อน (Date Desc)</option>
              <option value="date_asc">เก่าสุดก่อน (Date Asc)</option>
              <option value="price_desc">ยอดเงินสูงสุด (Price Desc)</option>
              <option value="price_asc">ยอดเงินต่ำสุด (Price Asc)</option>
            </select>

            {/* Export CSV Button */}
            <button
              onClick={handleExportCSV}
              className="px-4 py-2 rounded-full bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] text-xs font-bold text-zinc-300 hover:text-white transition-all flex items-center gap-1.5 cursor-pointer active:scale-95"
              title="ส่งออกรายการเป็นไฟล์ CSV"
            >
              <Download className="w-4 h-4 text-emerald-400" />
              <span>ส่งออก CSV</span>
            </button>
          </div>
        </div>

        {/* Orders Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-zinc-300">
            <thead className="text-[11px] uppercase tracking-wider text-zinc-400 bg-white/[0.02] border-b border-white/[0.06] font-semibold">
              <tr>
                <th className="px-5 py-3.5">รหัสคำสั่งซื้อ</th>
                <th className="px-5 py-3.5">สินค้าที่ซื้อ</th>
                <th className="px-5 py-3.5">ผู้ซื้อ (Customer)</th>
                <th className="px-5 py-3.5 text-center">จำนวน</th>
                <th className="px-5 py-3.5 font-mono text-right">ยอดรวม (THB)</th>
                <th className="px-5 py-3.5">วันเวลา</th>
                <th className="px-5 py-3.5 text-right">การจัดการ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04]">
              {filteredOrders.length > 0 ? (
                filteredOrders.map((order, idx) => {
                  const user = usersList.find(u => (u.id === order.userId || u.uid === order.userId));
                  const userDisplay = user?.email || user?.username || order.userId || order.uid || 'ไม่ระบุตัวตน';
                  const orderDate = new Date(order.date || order.timestamp || Date.now());
                  const formattedDate = orderDate.toLocaleDateString('th-TH', { 
                    day: 'numeric', 
                    month: 'short', 
                    year: 'numeric', 
                    hour: '2-digit', 
                    minute: '2-digit' 
                  });
                  const orderId = order.id || order.dbId || `ORD-${idx + 1}`;

                  return (
                    <tr key={order.id || idx} className="hover:bg-white/[0.02] transition-colors">
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs text-blue-400 font-bold truncate max-w-[110px]" title={orderId}>
                            #{orderId.slice(-8)}
                          </span>
                          <button
                            onClick={() => {
                              navigator.clipboard.writeText(orderId);
                              Swal.fire({ title: 'คัดลอกรหัสแล้ว', icon: 'success', timer: 800, showConfirmButton: false, background: '#0d1017', color: '#fff' });
                            }}
                            className="text-zinc-500 hover:text-white transition-colors cursor-pointer p-0.5"
                            title="คัดลอกรหัสออเดอร์"
                          >
                            <Copy className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 font-bold text-xs shrink-0">
                            <Package className="w-4 h-4" />
                          </div>
                          <div className="min-w-0">
                            <p className="font-bold text-white text-xs truncate max-w-[180px]">
                              {order.product_name || order.productName || 'สินค้า'}
                            </p>
                            {order.secretData && (
                              <p className="text-[10px] text-emerald-400 flex items-center gap-1 font-mono mt-0.5">
                                <CheckCircle2 className="w-3 h-3" /> ส่งมอบข้อมูลสำเร็จ
                              </p>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-2">
                          <User className="w-3.5 h-3.5 text-zinc-500 shrink-0" />
                          <span className="text-xs text-zinc-300 truncate max-w-[160px]" title={userDisplay}>
                            {userDisplay}
                          </span>
                        </div>
                      </td>
                      <td className="px-5 py-3.5 text-center font-mono text-xs text-zinc-300">
                        <span className="px-2.5 py-0.5 rounded-full bg-white/[0.04] border border-white/[0.06] text-zinc-300 font-bold">
                          x{order.quantity || 1}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 font-mono text-right">
                        <span className="text-xs font-bold text-emerald-400">
                          ฿{(Number(order.price) || 0).toLocaleString()}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-xs text-zinc-400 font-mono">
                        {formattedDate}
                      </td>
                      <td className="px-5 py-3.5 text-right">
                        <button
                          onClick={() => setSelectedOrder(order)}
                          className="px-3.5 py-1.5 rounded-full bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.06] text-xs font-semibold text-zinc-200 hover:text-white transition-all flex items-center gap-1.5 ml-auto cursor-pointer"
                        >
                          <Eye className="w-3.5 h-3.5 text-blue-400" />
                          <span>ดูรายละเอียด</span>
                        </button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={7} className="p-12 text-center text-xs text-zinc-500">
                    ไม่พบรายการคำสั่งซื้อตามเงื่อนไขที่ค้นหา
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Details Modal */}
      <AnimatePresence>
        {selectedOrder && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-[100]" onClick={() => setSelectedOrder(null)}>
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="bg-[#0f121a] border border-white/[0.1] w-full max-w-lg rounded-[32px] shadow-2xl flex flex-col overflow-hidden"
              onClick={e => e.stopPropagation()}
            >
              <div className="p-6 border-b border-white/[0.08] flex items-center justify-between bg-[#121622]/60">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white">รายละเอียดคำสั่งซื้อ</h3>
                    <p className="text-xs text-zinc-400 font-mono">#{selectedOrder.id || selectedOrder.dbId || 'N/A'}</p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="w-9 h-9 rounded-full flex items-center justify-center text-zinc-400 hover:text-white hover:bg-white/[0.06] transition-colors cursor-pointer"
                >
                  ✕
                </button>
              </div>

              <div className="p-6 overflow-y-auto space-y-4 max-h-[75vh]">
                {/* Product & Price */}
                <div className="p-4 rounded-2xl bg-[#151926] border border-white/[0.08] space-y-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider">สินค้า</span>
                      <h4 className="text-sm font-bold text-white mt-0.5">{selectedOrder.product_name || selectedOrder.productName}</h4>
                    </div>
                    <span className="px-3 py-1 rounded-full text-xs font-bold font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      ฿{(Number(selectedOrder.price) || 0).toLocaleString()}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-3 pt-2 border-t border-white/[0.06] text-xs font-mono">
                    <div>
                      <span className="text-zinc-500 text-[10px]">จำนวนที่สั่งซื้อ</span>
                      <p className="text-white font-bold">{selectedOrder.quantity || 1} ชิ้น</p>
                    </div>
                    <div>
                      <span className="text-zinc-500 text-[10px]">วันเวลาทำรายการ</span>
                      <p className="text-white font-bold">
                        {new Date(selectedOrder.date || selectedOrder.timestamp || Date.now()).toLocaleString('th-TH')}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Buyer ID */}
                <div className="p-4 rounded-2xl bg-[#151926] border border-white/[0.08] space-y-1 text-xs">
                  <span className="text-zinc-400 text-[10px] font-semibold uppercase tracking-wider">ข้อมูลผู้ซื้อ</span>
                  <p className="text-white font-mono break-all">{selectedOrder.userId || selectedOrder.uid || 'ไม่ระบุ'}</p>
                </div>

                {/* Delivered Secret / Stock Data */}
                {selectedOrder.secretData ? (
                  <div className="p-4 rounded-2xl bg-[#151926] border border-white/[0.08] space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-emerald-400 flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        ข้อมูลสินค้า/รหัสผ่านที่ส่งมอบ (Delivered Data)
                      </span>
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(selectedOrder.secretData);
                          Swal.fire({ title: 'คัดลอกแล้ว', icon: 'success', timer: 1000, showConfirmButton: false, background: '#0d1017', color: '#fff' });
                        }}
                        className="px-3 py-1 rounded-full bg-white/[0.06] hover:bg-white/[0.1] text-[11px] font-semibold text-zinc-300 hover:text-white transition-all flex items-center gap-1 cursor-pointer"
                      >
                        <Copy className="w-3 h-3" /> คัดลอก
                      </button>
                    </div>
                    <pre className="p-3.5 rounded-xl bg-black/50 border border-white/[0.06] text-xs font-mono text-zinc-300 whitespace-pre-wrap break-all max-h-40 overflow-y-auto select-all">
                      {selectedOrder.secretData}
                    </pre>
                  </div>
                ) : (
                  <div className="p-4 rounded-2xl bg-[#151926] border border-white/[0.08] text-xs text-zinc-400 italic">
                    ไม่มีข้อมูลลับหรือคีย์เฉพาะเจาะจงที่บันทึกไว้ในคำสั่งซื้อนี้
                  </div>
                )}
              </div>

              <div className="p-4 border-t border-white/[0.08] flex items-center justify-end gap-2.5 bg-[#121622]/40">
                {selectedOrder.secretData && (
                  <button
                    onClick={() => {
                      const blob = new Blob([selectedOrder.secretData], { type: 'text/plain;charset=utf-8' });
                      const url = URL.createObjectURL(blob);
                      const link = document.createElement('a');
                      link.href = url;
                      link.download = `order_${selectedOrder.id || 'receipt'}.txt`;
                      link.click();
                      URL.revokeObjectURL(url);
                    }}
                    className="px-4 py-2 rounded-full bg-white/[0.06] hover:bg-white/[0.1] text-xs font-semibold text-zinc-300 hover:text-white transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" /> ดาวน์โหลด TXT
                  </button>
                )}
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="px-5 py-2 rounded-full bg-blue-600 hover:bg-blue-500 text-xs font-bold text-white transition-all cursor-pointer shadow-md shadow-blue-500/20"
                >
                  ปิดหน้าต่าง
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
