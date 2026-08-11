import React, { useState, useMemo } from 'react';
import { DollarSign, Plus, CheckCircle2, AlertCircle, X, MapPin, Edit, Trash2 } from 'lucide-react';

export default function ExpenseView({ expenses, itineraries, onSaveExpense, onDeleteExpense, onSaveItinerary }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterPaid, setFilterPaid] = useState('All'); // 'All' | 'Paid' | 'Unpaid'

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState(null);

  const [formData, setFormData] = useState({
    item_name: '',
    amount: 0,
    is_paid: true,
    category: '餐飲吃喝',
    payer: '公費'
  });

  // Calculate total from explicit expenses and itinerary budget items
  const totalExpenseTwd = expenses.reduce((sum, e) => sum + (parseFloat(e.amount) || 0), 0);
  const itineraryTwd = itineraries.reduce((sum, i) => sum + (parseFloat(i.cost_twd) || 0), 0);
  const combinedTotal = totalExpenseTwd + itineraryTwd;

  // Combine explicit expenses and itinerary items with budget > 0 into a single master ledger list
  const combinedExpenseList = useMemo(() => {
    const list = [...expenses.map(e => ({ ...e, source: 'expense' }))];

    itineraries.forEach(itin => {
      const twd = parseFloat(itin.cost_twd) || 0;
      if (twd > 0) {
        list.push({
          id: `exp-itin-${itin.id}`,
          item_name: itin.location_name,
          amount: twd,
          is_paid: true,
          category: itin.category || '行程預算',
          payer: `行程預算 (${itin.day_label})`,
          source: 'itinerary',
          originalItin: itin
        });
      }
    });

    return list;
  }, [expenses, itineraries]);

  const paidCount = combinedExpenseList.filter(e => e.is_paid).length;
  const unpaidCount = combinedExpenseList.filter(e => !e.is_paid).length;

  const filteredExpenses = combinedExpenseList.filter(item => {
    const matchPaid = filterPaid === 'All' || (filterPaid === 'Paid' ? item.is_paid : !item.is_paid);
    const matchQuery = !searchQuery || item.item_name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchPaid && matchQuery;
  });

  const handleOpenAdd = () => {
    setEditingExpense(null);
    setFormData({
      item_name: '',
      amount: 0,
      is_paid: true,
      category: '餐飲吃喝',
      payer: '公費'
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item) => {
    setEditingExpense(item);
    setFormData({
      item_name: item.item_name || '',
      amount: item.amount || 0,
      is_paid: Boolean(item.is_paid),
      category: item.category || '餐飲吃喝',
      payer: item.payer || '公費'
    });
    setIsModalOpen(true);
  };

  const handleTogglePaid = (expense) => {
    if (expense.source === 'itinerary') return; // Itinerary items are managed in Itinerary tab
    onSaveExpense({
      ...expense,
      is_paid: !expense.is_paid
    });
  };

  const handleDeleteItem = (item) => {
    if (item.source === 'itinerary') {
      // Clear cost_twd on original itinerary item
      if (item.originalItin) {
        onSaveItinerary({
          ...item.originalItin,
          cost_twd: 0
        });
      }
    } else {
      onDeleteExpense(item.id);
    }
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!formData.item_name.trim()) return;

    if (editingExpense && editingExpense.source === 'itinerary') {
      // Update original itinerary item's cost_twd and location_name
      if (editingExpense.originalItin) {
        onSaveItinerary({
          ...editingExpense.originalItin,
          location_name: formData.item_name,
          cost_twd: formData.amount
        });
      }
    } else {
      const newExpense = {
        id: editingExpense ? editingExpense.id : `exp-${Date.now()}`,
        trip_id: editingExpense ? editingExpense.trip_id : (expenses[0]?.trip_id || 'trip-1'),
        ...formData
      };
      onSaveExpense(newExpense);
    }

    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      
      {/* CodeCat Clean Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Total Cost Card */}
        <div className="glass-card p-5 bg-gradient-to-tr from-orange-500/10 to-amber-500/10 border-orange-200 dark:border-orange-800/80">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400">總支出預估 (TWD)</span>
            <div className="w-8 h-8 rounded-lg bg-orange-100 dark:bg-orange-950 text-orange-600 dark:text-orange-400 flex items-center justify-center font-bold">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-slate-100 font-outfit mt-2">
            ${combinedTotal.toLocaleString()}
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            含記帳項目 ({expenses.length}筆) + 行程花費 ({itineraries.filter(i => (parseFloat(i.cost_twd) || 0) > 0).length}筆)
          </p>
        </div>

        {/* Paid Items Card */}
        <div className="glass-card p-5 bg-gradient-to-tr from-emerald-500/10 to-teal-500/10 border-emerald-200 dark:border-emerald-800/80">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400">已結清 / 繳清項目</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400 font-outfit mt-2">
            {paidCount} <span className="text-xs font-medium text-slate-400">筆</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">已付款完畢無拆帳問題</p>
        </div>

        {/* Unpaid Items Card */}
        <div className="glass-card p-5 bg-gradient-to-tr from-amber-500/10 to-red-500/10 border-amber-200 dark:border-amber-800/80">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400">待繳款 / 現場支付</span>
            <div className="w-8 h-8 rounded-lg bg-amber-100 dark:bg-amber-950 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold">
              <AlertCircle className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-amber-600 dark:text-amber-400 font-outfit mt-2">
            {unpaidCount} <span className="text-xs font-medium text-slate-400">筆未付</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">現場需準備現金或刷卡</p>
        </div>
      </div>

      {/* Controls Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 glass-card p-3.5 sm:p-4">
        {/* Search */}
        <input
          type="text"
          placeholder="搜尋記帳品項或行程消費..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full sm:w-64 px-3.5 py-2 text-sm rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-orange-500 focus:outline-none"
        />

        {/* Paid Status Filter Pills */}
        <div className="flex items-center justify-between sm:justify-end gap-2 flex-wrap">
          <div className="flex items-center gap-1.5">
            {['All', 'Paid', 'Unpaid'].map((status) => (
              <button
                key={status}
                onClick={() => setFilterPaid(status)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap ${
                  filterPaid === status
                    ? 'bg-orange-500 text-white shadow-sm'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                }`}
              >
                {status === 'All' ? '全部' : status === 'Paid' ? '已繳清' : '未繳清'}
              </button>
            ))}
          </div>
          <button
            onClick={handleOpenAdd}
            className="px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold shadow-md shadow-orange-500/20 flex items-center gap-1.5 shrink-0 whitespace-nowrap"
          >
            <Plus className="w-4 h-4" /> 記一筆
          </button>
        </div>
      </div>

      {/* Desktop Table View (hidden on mobile < md) */}
      <div className="hidden md:block glass-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm min-w-[700px]">
            <thead className="bg-slate-100 dark:bg-slate-800/80 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              <tr>
                <th className="p-4 whitespace-nowrap">品項名稱</th>
                <th className="p-4 whitespace-nowrap">金額 (TWD)</th>
                <th className="p-4 whitespace-nowrap">支付狀態</th>
                <th className="p-4 whitespace-nowrap">付款人/來源分類</th>
                <th className="p-4 whitespace-nowrap">來源標籤</th>
                <th className="p-4 text-right whitespace-nowrap">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
              {filteredExpenses.map((exp) => (
                <tr key={exp.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors">
                  <td className="p-4 font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                    {exp.source === 'itinerary' && (
                      <MapPin className="w-3.5 h-3.5 text-orange-500 shrink-0" />
                    )}
                    <span>{exp.item_name}</span>
                  </td>
                  <td className="p-4 font-extrabold text-orange-600 dark:text-orange-400 font-outfit whitespace-nowrap">
                    ${(parseFloat(exp.amount) || 0).toLocaleString()}
                  </td>
                  <td className="p-4 whitespace-nowrap">
                    <button
                      onClick={() => handleTogglePaid(exp)}
                      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold transition-all whitespace-nowrap ${
                        exp.is_paid
                          ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                          : 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300'
                      }`}
                    >
                      {exp.is_paid ? <CheckCircle2 className="w-3.5 h-3.5" /> : <AlertCircle className="w-3.5 h-3.5" />}
                      {exp.is_paid ? '已繳清' : '未付款'}
                    </button>
                  </td>
                  <td className="p-4 text-xs text-slate-500 dark:text-slate-400 whitespace-nowrap">
                    <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 mr-1.5 font-medium whitespace-nowrap">
                      {exp.category || '雜項'}
                    </span>
                    <span className="whitespace-nowrap">{exp.payer || '公費'}</span>
                  </td>
                  <td className="p-4 whitespace-nowrap">
                    {exp.source === 'itinerary' ? (
                      <span className="px-2 py-1 rounded-full bg-orange-100 text-orange-800 dark:bg-orange-950 dark:text-orange-300 text-xs font-bold whitespace-nowrap inline-block">
                        行程卡片預算
                      </span>
                    ) : (
                      <span className="px-2 py-1 rounded-full bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300 text-xs font-semibold whitespace-nowrap inline-block">
                        獨立記帳
                      </span>
                    )}
                  </td>
                  <td className="p-4 text-right whitespace-nowrap">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleOpenEdit(exp)}
                        className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 hover:text-orange-500 flex items-center gap-1 transition-colors text-xs font-semibold"
                        title="編輯金額與品項"
                      >
                        <Edit className="w-3.5 h-3.5" /> 編輯
                      </button>
                      <button
                        onClick={() => handleDeleteItem(exp)}
                        className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-950 text-slate-400 hover:text-red-500 flex items-center gap-1 transition-colors text-xs font-semibold"
                        title="刪除記帳"
                      >
                        <Trash2 className="w-3.5 h-3.5" /> 刪除
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile Card List View (visible on mobile < md) */}
      <div className="block md:hidden space-y-3">
        {filteredExpenses.length === 0 ? (
          <div className="glass-card p-8 text-center text-slate-400 text-sm font-medium">
            查無記帳或行程消費項目
          </div>
        ) : (
          filteredExpenses.map((exp) => (
            <div
              key={exp.id}
              className="glass-card p-4 space-y-3 border border-slate-200/90 dark:border-slate-800"
            >
              {/* Card Header: Item Name + Amount */}
              <div className="flex items-start justify-between gap-2">
                <div className="font-bold text-slate-900 dark:text-slate-100 text-base flex items-center gap-1.5 min-w-0">
                  {exp.source === 'itinerary' && (
                    <MapPin className="w-4 h-4 text-orange-500 shrink-0" />
                  )}
                  <span className="truncate">{exp.item_name}</span>
                </div>
                <div className="text-lg font-black text-orange-600 dark:text-orange-400 font-outfit shrink-0 whitespace-nowrap">
                  ${(parseFloat(exp.amount) || 0).toLocaleString()}
                </div>
              </div>

              {/* Badges & Meta */}
              <div className="flex items-center gap-1.5 flex-wrap text-xs">
                {/* Category */}
                <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-medium whitespace-nowrap break-keep">
                  {exp.category || '雜項'}
                </span>
                
                {/* Payer */}
                <span className="text-slate-500 dark:text-slate-400 font-medium whitespace-nowrap break-keep">
                  {exp.payer || '公費'}
                </span>

                {/* Tag source */}
                {exp.source === 'itinerary' ? (
                  <span className="px-2 py-0.5 rounded-full bg-orange-100 text-orange-800 dark:bg-orange-950 dark:text-orange-300 font-bold whitespace-nowrap break-keep ml-auto">
                    行程卡片預算
                  </span>
                ) : (
                  <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300 font-semibold whitespace-nowrap break-keep ml-auto">
                    獨立記帳
                  </span>
                )}
              </div>

              {/* Action & Status Row */}
              <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between gap-2">
                <button
                  onClick={() => handleTogglePaid(exp)}
                  className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold transition-all whitespace-nowrap ${
                    exp.is_paid
                      ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                      : 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300'
                  }`}
                >
                  {exp.is_paid ? <CheckCircle2 className="w-3.5 h-3.5" /> : <AlertCircle className="w-3.5 h-3.5" />}
                  {exp.is_paid ? '已繳清' : '未付款'}
                </button>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleOpenEdit(exp)}
                    className="px-2.5 py-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 flex items-center gap-1 text-xs font-semibold transition-colors"
                  >
                    <Edit className="w-3.5 h-3.5 text-orange-500" /> 編輯
                  </button>
                  <button
                    onClick={() => handleDeleteItem(exp)}
                    className="px-2.5 py-1 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/60 text-slate-400 hover:text-red-500 flex items-center gap-1 text-xs font-semibold transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" /> 刪除
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add / Edit Expense Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="glass-card w-full max-w-md p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                {editingExpense ? '編輯記帳品項' : '新增記帳項目'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="space-y-4 text-sm">
              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                  品項名稱 *
                </label>
                <input
                  type="text"
                  required
                  value={formData.item_name}
                  onChange={(e) => setFormData({...formData, item_name: e.target.value})}
                  placeholder="如: 機票, 飯店訂房, 浮潛費用"
                  className="w-full px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                  金額 (TWD) *
                </label>
                <input
                  type="number"
                  required
                  value={formData.amount}
                  onChange={(e) => setFormData({...formData, amount: parseFloat(e.target.value) || 0})}
                  className="w-full px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                    付款類別
                  </label>
                  <input
                    type="text"
                    value={formData.category}
                    onChange={(e) => setFormData({...formData, category: e.target.value})}
                    placeholder="機票/住宿/交通/美食"
                    className="w-full px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                    付款狀態
                  </label>
                  <select
                    value={formData.is_paid ? 'true' : 'false'}
                    onChange={(e) => setFormData({...formData, is_paid: e.target.value === 'true'})}
                    className="w-full px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                  >
                    <option value="true">已繳清</option>
                    <option value="false">未繳清 (現場支付)</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-semibold"
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold"
                >
                  儲存記帳
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
