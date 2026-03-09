import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useExpense } from '../context/ExpenseContext';

const EditTransaction = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { transactions, updateTransaction, deleteTransaction, accounts, categories: allCategories, addAccount } = useExpense();
  
  const [amount, setAmount] = useState('');
  const [type, setType] = useState('expense');
  const [categoryId, setCategoryId] = useState('');
  const [accountId, setAccountId] = useState('');
  const [merchant, setMerchant] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [note, setNote] = useState('');
  const [isAddingAccount, setIsAddingAccount] = useState(false);
  const [newAccountName, setNewAccountName] = useState('');

  const handleQuickAddAccount = async () => {
    if (!newAccountName.trim()) return;
    const account = await addAccount(newAccountName.trim());
    if (account) {
      setAccountId(account.id);
      setIsAddingAccount(false);
      setNewAccountName('');
    }
  };

  useEffect(() => {
    const transaction = transactions.find(t => t.id === id);
    if (transaction) {
      setAmount(transaction.amount.toString());
      setType(transaction.type);
      setCategoryId(transaction.category_id);
      setAccountId(transaction.account_id);
      
      // 处理标题和备注（之前保存时合并了）
      const parts = transaction.note ? transaction.note.split(': ') : [transaction.title];
      setMerchant(parts[0]);
      setNote(parts[1] || '');
      
      const d = new Date(transaction.date);
      setDate(d.toISOString().split('T')[0]);
      setTime(d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }));
    } else {
      navigate('/transactions');
    }
  }, [id, transactions, navigate]);

  const filteredCategories = allCategories.filter(c => c.type === type);

  const handleUpdate = async () => {
    if (!amount || !merchant || !accountId || !categoryId) return;

    await updateTransaction(id, {
      account_id: accountId,
      category_id: categoryId,
      amount: parseFloat(amount),
      date: new Date(`${date}T${time}`).toISOString(),
      type: type,
      note: merchant + (note ? `: ${note}` : '')
    });

    navigate('/transactions');
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this transaction?')) {
      deleteTransaction(id);
      navigate('/transactions');
    }
  };

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 font-display">
      <div className="relative flex h-screen w-full max-w-md mx-auto flex-col bg-white dark:bg-background-dark shadow-xl overflow-hidden">
        
        <div className="flex items-center bg-white dark:bg-background-dark p-4 pb-2 justify-between border-b border-gray-100 dark:border-gray-800">
          <Link to="/transactions" className="text-[#111318] dark:text-white flex size-10 shrink-0 items-center justify-center cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full">
            <span className="material-symbols-outlined">close</span>
          </Link>
          <h2 className="text-[#111318] dark:text-white text-lg font-bold leading-tight tracking-[-0.015em] flex-1 text-center">
            Edit Transaction
          </h2>
          <div className="flex w-10 items-center justify-end">
            <button onClick={handleDelete} className="flex items-center justify-center text-rose-500 hover:bg-rose-50 p-2 rounded-full transition-colors">
              <span className="material-symbols-outlined">delete</span>
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto no-scrollbar pb-24">
          <div className="flex flex-col items-center justify-center pt-8 pb-10 px-4 bg-white dark:bg-background-dark">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-6 text-center w-full">Amount</span>
            <div className={`flex items-baseline justify-center gap-1 border-b-2 transition-colors px-8 pb-2 ${type === 'expense' ? 'border-gray-100 dark:border-gray-800 focus-within:border-primary' : 'border-gray-100 dark:border-gray-800 focus-within:border-emerald-500'}`}>
              <span className={`text-4xl font-extrabold ${type === 'expense' ? 'text-primary' : 'text-emerald-500'}`}>$</span>
              <input 
                className={`w-[180px] bg-transparent border-none p-0 text-6xl font-extrabold text-slate-900 dark:text-white placeholder-gray-200 focus:ring-0 text-center outline-none ${type === 'expense' ? 'caret-primary' : 'caret-emerald-500'}`} 
                type="number"
                inputMode="decimal"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
            </div>
          </div>

          <div className="px-4 py-4">
            <div className="flex items-center justify-between pb-3">
              <h3 className="text-[#111318] dark:text-white text-base font-bold leading-tight tracking-[-0.015em]">Account</h3>
              <button 
                onClick={() => setIsAddingAccount(!isAddingAccount)}
                className="text-primary text-xs font-bold flex items-center gap-1"
              >
                <span className="material-symbols-outlined text-sm">{isAddingAccount ? 'close' : 'add'}</span>
                {isAddingAccount ? 'Cancel' : 'Add Account'}
              </button>
            </div>

            {isAddingAccount ? (
              <div className="flex gap-2 animate-in fade-in slide-in-from-top-2 duration-300">
                <input
                  autoFocus
                  className="flex-1 px-4 py-2 rounded-xl border border-primary/30 dark:border-primary/20 bg-primary/5 dark:bg-primary/10 text-sm outline-none focus:border-primary transition-all"
                  placeholder="e.g. Cash, Card"
                  value={newAccountName}
                  onChange={(e) => setNewAccountName(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleQuickAddAccount()}
                />
                <button 
                  onClick={handleQuickAddAccount}
                  disabled={!newAccountName.trim()}
                  className="bg-primary text-white px-4 py-2 rounded-xl text-sm font-bold shadow-lg shadow-primary/20 disabled:opacity-50 transition-all active:scale-95"
                >
                  Create
                </button>
              </div>
            ) : (
              <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2">
                {accounts.map((acc) => (
                  <div 
                    key={acc.id} 
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl border transition-all cursor-pointer whitespace-nowrap ${accountId === acc.id ? 'bg-primary text-white border-primary shadow-sm' : 'bg-background-light dark:bg-gray-800 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-700'}`}
                    onClick={() => setAccountId(acc.id)}
                  >
                    <span className="material-symbols-outlined text-sm">account_balance_wallet</span>
                    <span className="text-sm font-bold">{acc.name}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="px-4 py-4">
            <h3 className="text-[#111318] dark:text-white text-base font-bold leading-tight tracking-[-0.015em] pb-3">Category</h3>
            <div className="grid grid-cols-4 gap-3">
              {filteredCategories.map((cat) => (
                <div 
                  key={cat.id} 
                  className={`flex flex-col items-center gap-2 cursor-pointer ${categoryId === cat.id ? 'opacity-100' : 'opacity-60 hover:opacity-100'}`}
                  onClick={() => setCategoryId(cat.id)}
                >
                  <div className={`flex size-14 items-center justify-center rounded-xl transition-all ${categoryId === cat.id ? `${type === 'expense' ? 'bg-primary shadow-primary/20' : 'bg-emerald-500 shadow-emerald-500/20'} text-white shadow-md` : 'bg-background-light dark:bg-gray-800 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-700'}`}>
                    <span className="material-symbols-outlined">{cat.icon_name || 'receipt'}</span>
                  </div>
                  <span className={`text-xs font-medium ${categoryId === cat.id ? (type === 'expense' ? 'text-primary font-bold' : 'text-emerald-600 font-bold') : 'text-gray-500'}`}>{cat.name}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="px-4 space-y-5 mt-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 px-1">
                {type === 'expense' ? 'Merchant Name' : 'Income Source'}
              </label>
              <div className="relative">
                <span className={`material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xl transition-colors ${type === 'expense' ? 'text-primary/60' : 'text-emerald-500/60'}`}>
                  {type === 'expense' ? 'store' : 'account_balance_wallet'}
                </span>
                <input 
                  className={`w-full pl-10 pr-4 py-3.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800/50 text-[#111318] dark:text-white focus:ring-1 transition-all outline-none ${type === 'expense' ? 'focus:border-primary focus:ring-primary' : 'focus:border-emerald-500 focus:ring-emerald-500'}`} 
                  type="text" 
                  value={merchant}
                  onChange={(e) => setMerchant(e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 px-1">Date</label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xl pointer-events-none">calendar_today</span>
                  <input 
                    className={`w-full pl-10 pr-4 py-3.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800/50 text-[#111318] dark:text-white focus:ring-1 transition-all outline-none ${type === 'expense' ? 'focus:border-primary focus:ring-primary' : 'focus:border-emerald-500 focus:ring-emerald-500'}`} 
                    type="date" 
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 px-1">Time</label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xl pointer-events-none">schedule</span>
                  <input 
                    className={`w-full pl-10 pr-4 py-3.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800/50 text-[#111318] dark:text-white focus:ring-1 transition-all outline-none ${type === 'expense' ? 'focus:border-primary focus:ring-primary' : 'focus:border-emerald-500 focus:ring-emerald-500'}`} 
                    type="time" 
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                  />
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-1.5 pb-8">
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 px-1">Note (Optional)</label>
              <textarea 
                className={`w-full p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800/50 text-[#111318] dark:text-white focus:ring-1 transition-all resize-none outline-none ${type === 'expense' ? 'focus:border-primary focus:ring-primary' : 'focus:border-emerald-500 focus:ring-emerald-500'}`} 
                placeholder="Add a description..." 
                rows="3"
                value={note}
                onChange={(e) => setNote(e.target.value)}
              ></textarea>
            </div>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-white via-white dark:from-background-dark dark:via-background-dark to-transparent">
          <button 
            onClick={handleUpdate}
            className={`w-full text-white font-bold py-4 rounded-xl shadow-lg flex items-center justify-center gap-2 transition-all active:scale-[0.98] ${type === 'expense' ? 'bg-primary hover:bg-primary/90 shadow-primary/25' : 'bg-emerald-500 hover:bg-emerald-600 shadow-emerald-500/25'}`}
          >
            <span className="material-symbols-outlined">save</span>
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditTransaction;
