import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useExpense } from '../context/ExpenseContext';

const AddExpense = () => {
  const navigate = useNavigate();
  const { addTransaction } = useExpense();
  
  const [amount, setAmount] = useState('');
  const [type, setType] = useState('expense');
  const [category, setCategory] = useState('Food');
  const [merchant, setMerchant] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [time, setTime] = useState(new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }));
  const [note, setNote] = useState('');

  const expenseCategories = [
    { name: 'Food', icon: 'restaurant', color: 'bg-primary', textColor: 'text-white' },
    { name: 'Transport', icon: 'directions_car', color: 'bg-orange-500', textColor: 'text-white' },
    { name: 'Shopping', icon: 'shopping_bag', color: 'bg-purple-500', textColor: 'text-white' },
    { name: 'Bills', icon: 'receipt_long', color: 'bg-emerald-500', textColor: 'text-white' }
  ];

  const incomeCategories = [
    { name: 'Salary', icon: 'payments', color: 'bg-emerald-500', textColor: 'text-white' },
    { name: 'Transfer', icon: 'sync_alt', color: 'bg-blue-500', textColor: 'text-white' },
    { name: 'Bonus', icon: 'redeem', color: 'bg-orange-500', textColor: 'text-white' },
    { name: 'Others', icon: 'more_horiz', color: 'bg-gray-500', textColor: 'text-white' }
  ];

  const categories = type === 'expense' ? expenseCategories : incomeCategories;

  const handleSave = () => {
    if (!amount || !merchant) return;

    const selectedCategory = categories.find(c => c.name === category);

    addTransaction({
      title: merchant,
      amount: parseFloat(amount),
      date: new Date(`${date}T${time}`),
      type: type,
      category: category,
      icon: selectedCategory ? selectedCategory.icon : (type === 'expense' ? 'receipt' : 'add_circle'),
      note: note
    });

    navigate('/dashboard');
  };

  const handleTypeChange = (newType) => {
    setType(newType);
    setCategory(newType === 'expense' ? 'Food' : 'Salary');
  };

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 font-display">
      
      <div className="relative flex h-screen w-full max-w-md mx-auto flex-col bg-white dark:bg-background-dark shadow-xl overflow-hidden">

        <div className="flex items-center bg-white dark:bg-background-dark p-4 pb-2 justify-between border-b border-gray-100 dark:border-gray-800">
          <Link to="/dashboard" className="text-[#111318] dark:text-white flex size-10 shrink-0 items-center justify-center cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full">
            <span className="material-symbols-outlined">close</span>
          </Link>
          <h2 className="text-[#111318] dark:text-white text-lg font-bold leading-tight tracking-[-0.015em] flex-1 text-center">
            {type === 'expense' ? 'Add Expense' : 'Add Income'}
          </h2>
          <div className="flex w-10 items-center justify-end">
            <button className="flex items-center justify-center text-primary">
              <span className="material-symbols-outlined">history</span>
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto no-scrollbar pb-24">

          <div className="px-4 py-6">
            <div className="flex h-12 items-center justify-center rounded-xl bg-gray-100 dark:bg-gray-800 p-1">
              <button 
                onClick={() => handleTypeChange('expense')}
                className={`flex h-full grow items-center justify-center rounded-lg text-sm font-bold transition-all ${type === 'expense' ? 'bg-white dark:bg-gray-700 shadow-sm text-primary' : 'text-gray-500'}`}
              >
                Expense
              </button>
              <button 
                onClick={() => handleTypeChange('income')}
                className={`flex h-full grow items-center justify-center rounded-lg text-sm font-bold transition-all ${type === 'income' ? 'bg-white dark:bg-gray-700 shadow-sm text-emerald-600' : 'text-gray-500'}`}
              >
                Income
              </button>
            </div>
          </div>

          <div className="flex flex-col items-center justify-center pt-4 pb-10 px-4 bg-white dark:bg-background-dark">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-6 text-center w-full">Enter Amount</span>
            <div className={`flex items-baseline justify-center gap-1 border-b-2 transition-colors px-8 pb-2 ${type === 'expense' ? 'border-gray-100 dark:border-gray-800 focus-within:border-primary' : 'border-gray-100 dark:border-gray-800 focus-within:border-emerald-500'}`}>
              <span className={`text-4xl font-extrabold ${type === 'expense' ? 'text-primary' : 'text-emerald-500'}`}>$</span>
              <input 
                autoFocus 
                className={`w-[180px] bg-transparent border-none p-0 text-6xl font-extrabold text-slate-900 dark:text-white placeholder-gray-200 focus:ring-0 text-center outline-none ${type === 'expense' ? 'caret-primary' : 'caret-emerald-500'}`} 
                placeholder="0" 
                step="0.01" 
                type="number"
                inputMode="decimal"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
            </div>
          </div>

          <div className="px-4 py-4">
            <h3 className="text-[#111318] dark:text-white text-base font-bold leading-tight tracking-[-0.015em] pb-3">Category</h3>
            <div className="grid grid-cols-4 gap-3">
              {categories.map((cat) => (
                <div 
                  key={cat.name} 
                  className={`flex flex-col items-center gap-2 cursor-pointer ${category === cat.name ? 'opacity-100' : 'opacity-60 hover:opacity-100'}`}
                  onClick={() => setCategory(cat.name)}
                >
                  <div className={`flex size-14 items-center justify-center rounded-xl transition-all ${category === cat.name ? `${type === 'expense' ? 'bg-primary shadow-primary/20' : 'bg-emerald-500 shadow-emerald-500/20'} text-white shadow-md` : 'bg-background-light dark:bg-gray-800 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-700'}`}>
                    <span className="material-symbols-outlined">{cat.icon}</span>
                  </div>
                  <span className={`text-xs font-medium ${category === cat.name ? (type === 'expense' ? 'text-primary font-bold' : 'text-emerald-600 font-bold') : 'text-gray-500'}`}>{cat.name}</span>
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
                <span className={`material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xl transition-colors ${category !== '' ? (type === 'expense' ? 'text-primary/60' : 'text-emerald-500/60') : ''}`}>
                  {type === 'expense' ? 'store' : 'account_balance_wallet'}
                </span>
                <input 
                  className={`w-full pl-10 pr-4 py-3.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800/50 text-[#111318] dark:text-white focus:ring-1 transition-all outline-none ${type === 'expense' ? 'focus:border-primary focus:ring-primary' : 'focus:border-emerald-500 focus:ring-emerald-500'}`} 
                  placeholder={type === 'expense' ? "Where did you spend?" : "Where is this money from?"}
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

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 px-1">Note (Optional)</label>
              <div className="relative">
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
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-white via-white dark:from-background-dark dark:via-background-dark to-transparent">
          <button 
            onClick={handleSave}
            className={`w-full text-white font-bold py-4 rounded-xl shadow-lg flex items-center justify-center gap-2 transition-all active:scale-[0.98] ${type === 'expense' ? 'bg-primary hover:bg-primary/90 shadow-primary/25' : 'bg-emerald-500 hover:bg-emerald-600 shadow-emerald-500/25'}`}
          >
            <span className="material-symbols-outlined">check_circle</span>
            {type === 'expense' ? 'Save Expense' : 'Save Income'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddExpense;
