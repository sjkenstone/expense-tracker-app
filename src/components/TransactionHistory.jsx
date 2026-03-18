import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useExpense } from '../context/ExpenseContext';

const TransactionHistory = () => {
  const navigate = useNavigate();
  const { transactions, categories } = useExpense();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('All');

  const filters = ['All', ...categories.map(c => c.name)];
  // const filters = ['All', 'Food', 'Transport', 'Shopping', 'Housing', 'Salary', 'Transfer'];
  
  const filteredTransactions = transactions.filter(t => {
    const matchesSearch = t.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = selectedFilter === 'All' || t.category === selectedFilter;
    return matchesSearch && matchesFilter;
  });

  // Group by date
  const groupedTransactions = filteredTransactions.reduce((acc, t) => {
    const dateStr = new Date(t.date).toDateString();
    if (!acc[dateStr]) acc[dateStr] = [];
    acc[dateStr].push(t);
    return acc;
  }, {});

  // Sort dates descending
  const sortedDates = Object.keys(groupedTransactions).sort((a, b) => new Date(b) - new Date(a));

  const formatDateHeader = (dateStr) => {
    const d = new Date(dateStr);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (d.toDateString() === today.toDateString()) return 'Today';
    if (d.toDateString() === yesterday.toDateString()) return 'Yesterday';
    return d.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
  };

  const formatTime = (date) => {
    return new Date(date).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit', hour12: true });
  };

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 font-display">
      
      <div className="relative flex h-screen w-full flex-col max-w-md mx-auto bg-white dark:bg-background-dark shadow-xl overflow-hidden pb-24">

        <header className="flex items-center bg-white dark:bg-background-dark p-4 pb-2 justify-between sticky top-0 z-10 border-b border-primary/10">
          <Link to="/dashboard" className="text-[#111318] dark:text-white flex size-10 shrink-0 items-center justify-center cursor-pointer">
            <span className="material-symbols-outlined">arrow_back</span>
          </Link>
          <h2 className="text-[#111318] dark:text-white text-lg font-bold leading-tight tracking-[-0.015em] flex-1 text-center">Transactions</h2>
          <div className="flex w-10 items-center justify-end">
            <button className="flex cursor-pointer items-center justify-center rounded-lg h-10 w-10 bg-transparent text-[#111318] dark:text-white hover:bg-primary/10">
              <span className="material-symbols-outlined">tune</span>
            </button>
          </div>
        </header>

        <div className="bg-white dark:bg-background-dark space-y-3 px-4 py-3">
          <label className="flex flex-col min-w-40 h-12 w-full">
            <div className="flex w-full flex-1 items-stretch rounded-xl h-full shadow-sm">
              <div className="text-primary/60 flex border-none bg-primary/5 dark:bg-white/5 items-center justify-center pl-4 rounded-l-xl">
                <span className="material-symbols-outlined">search</span>
              </div>
              <input 
                className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-r-xl text-[#111318] dark:text-white focus:outline-0 focus:ring-0 border-none bg-primary/5 dark:bg-white/5 h-full placeholder:text-[#616f89] px-4 pl-2 text-base font-normal leading-normal" 
                placeholder="Search transactions" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </label>

          <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
            {filters.map(filter => (
              <button 
                key={filter}
                onClick={() => setSelectedFilter(filter)}
                className={`flex h-9 shrink-0 items-center justify-center gap-x-2 rounded-full px-5 shadow-sm transition-colors ${selectedFilter === filter ? 'bg-primary text-white shadow-primary/20' : 'bg-primary/10 dark:bg-white/5 border border-primary/10 text-[#111318] dark:text-white'}`}
              >
                <p className="text-sm font-semibold">{filter}</p>  
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-4 pb-4">
          {sortedDates.map(dateStr => (
            <div key={dateStr} className="py-4">
              <h3 className="text-[#111318] dark:text-white/70 text-sm font-bold uppercase tracking-wider mb-3">{formatDateHeader(dateStr)}</h3>
              <div className="space-y-3">
                {groupedTransactions[dateStr].map(transaction => (
                  <div 
                    key={transaction.id} 
                    onClick={() => navigate(`/edit-transaction/${transaction.id}`)}
                    className="flex items-center justify-between p-3 rounded-xl bg-background-light/50 dark:bg-white/5 border border-primary/5 hover:border-primary/20 cursor-pointer transition-colors active:scale-[0.98]"
                  >
                    <div className="flex items-center gap-4">
                      <div className={`flex size-12 items-center justify-center rounded-xl ${transaction.type === 'income' ? 'bg-emerald-100 text-emerald-600' : 'bg-orange-100 text-orange-600'}`}>
                        <span className="material-symbols-outlined">{transaction.icon}</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-base font-bold text-[#111318] dark:text-white">{transaction.title}</span>
                        <span className="text-xs text-[#616f89]">{formatTime(transaction.date)} • {transaction.category}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className={`text-base font-bold ${transaction.type === 'income' ? 'text-emerald-600' : 'text-[#111318] dark:text-white'}`}>
                        {transaction.type === 'income' ? '+' : '-'}{formatCurrency(transaction.amount)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
          
          {sortedDates.length === 0 && (
             <div className="flex flex-col items-center justify-center h-40 text-gray-500">
                <span className="material-symbols-outlined text-4xl mb-2">search_off</span>
                <p>No transactions found</p>
             </div>
          )}
        </div>
        
      </div>
    </div>
  );
};

export default TransactionHistory;
