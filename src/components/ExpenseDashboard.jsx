import React from 'react';
import { Link } from 'react-router-dom';
import { useExpense } from '../context/ExpenseContext';

const ExpenseDashboard = () => {
  const { balance, income, expense, transactions, user } = useExpense();
  
  // Sort transactions by date (descending) and take top 3
  const recentTransactions = [...transactions]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 3);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
  };

  const formatDate = (date) => {
    const d = new Date(date);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (d.toDateString() === today.toDateString()) {
      return `Today, ${d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    } else if (d.toDateString() === yesterday.toDateString()) {
      return `Yesterday, ${d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    } else {
      return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    }
  };

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 font-display">
      
      <div className="relative flex h-auto min-h-screen w-full max-w-md mx-auto flex-col bg-white dark:bg-background-dark shadow-2xl overflow-x-hidden pb-20">

        <div className="flex items-center bg-white dark:bg-background-dark p-4 pb-2 justify-between sticky top-0 z-10 border-b border-slate-100 dark:border-slate-800">
          <div className="flex size-10 shrink-0 items-center">
            <div className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10 border-2 border-primary/20" data-alt="User profile picture" style={{ backgroundImage: `url("${user.avatar}")` }}></div>
          </div>
          <div className="flex-1 ml-3">
            <p className="text-slate-500 text-xs font-medium">Good morning,</p>
            <h2 className="text-slate-900 dark:text-white text-lg font-bold leading-tight tracking-tight">{user.name}</h2>
          </div>
          <div className="flex w-10 items-center justify-end">
            <button className="flex items-center justify-center rounded-lg h-10 w-10 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
              <span className="material-symbols-outlined">notifications</span>
            </button>
          </div>
        </div>

        <div className="p-4">
          <div className="flex flex-col items-stretch justify-start rounded-xl shadow-lg bg-primary text-white p-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-black/10 rounded-full -ml-12 -mb-12 blur-xl"></div>
            <div className="relative z-10">
              <p className="text-white/80 text-sm font-medium mb-1">Total Balance</p>
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-bold tracking-tight">{formatCurrency(balance)}</span>
                <span className="text-white/90 text-sm ml-2 bg-white/20 px-2 py-0.5 rounded-full">+2.5%</span>
              </div>
              <div className="mt-8 flex justify-between items-end">
                <div>
                  <p className="text-white/70 text-xs uppercase tracking-wider font-semibold">Account Number</p>
                  <p className="text-sm font-mono tracking-widest">**** 8842</p>
                </div>
                <button className="bg-white text-primary px-4 py-2 rounded-lg text-sm font-bold shadow-sm active:scale-95 transition-transform">
                  View Assets
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-4 px-4 py-2">
          <div className="flex flex-1 flex-col gap-1 rounded-xl p-4 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-100 dark:border-emerald-800/30">
            <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
              <span className="material-symbols-outlined text-sm">arrow_downward</span>
              <p className="text-xs font-bold uppercase">Income</p>
            </div>
            <p className="text-slate-900 dark:text-white text-xl font-bold">{formatCurrency(income)}</p>
          </div>
          <div className="flex flex-1 flex-col gap-1 rounded-xl p-4 bg-rose-50 dark:bg-rose-900/20 border border-rose-100 dark:border-rose-800/30">
            <div className="flex items-center gap-2 text-rose-600 dark:text-rose-400">
              <span className="material-symbols-outlined text-sm">arrow_upward</span>
              <p className="text-xs font-bold uppercase">Expense</p>
            </div>
            <p className="text-slate-900 dark:text-white text-xl font-bold">{formatCurrency(expense)}</p>
          </div>
        </div>

        <div className="px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-slate-900 dark:text-white text-lg font-bold">Spending Trend</h3>
            <select className="bg-transparent text-xs font-bold text-primary border-none focus:ring-0 cursor-pointer">
              <option>Last 7 Days</option>
              <option>This Month</option>
            </select>
          </div>
          <div className="w-full h-40 relative flex items-center justify-center gap-1 pt-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
            {transactions.length > 0 ? (
               <div className="text-slate-400 text-sm">Chart data will appear here</div>
            ) : (
               <div className="text-slate-400 text-sm">No trend data available</div>
            )}
          </div>
          <div className="flex justify-between mt-2 px-1 text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
            <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
          </div>
        </div>

        <div className="px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-slate-900 dark:text-white text-lg font-bold">Categories</h3>
            <button className="text-primary text-xs font-bold">See All</button>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {/* Dynamic Categories based on transactions */}
            {transactions.length > 0 ? (
               <div className="col-span-2 text-center py-8 text-slate-400 text-sm">
                  Category breakdown coming soon
               </div>
            ) : (
               <div className="col-span-2 text-center py-8 text-slate-400 text-sm">
                 No category data available
               </div>
            )}
          </div>
        </div>

        <div className="px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-slate-900 dark:text-white text-lg font-bold">Recent Activity</h3>
            <Link to="/transactions" className="text-primary text-xs font-bold">View More</Link>
          </div>
          <div className="space-y-3">
            {recentTransactions.map(transaction => (
              <div key={transaction.id} className="flex items-center justify-between p-3 rounded-xl bg-white dark:bg-background-dark border border-slate-50 dark:border-slate-800 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="size-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500">
                    <span className="material-symbols-outlined">{transaction.icon}</span>
                  </div>
                  <div>
                    <p className="text-sm font-bold">{transaction.title}</p>
                    <p className="text-xs text-slate-400">{formatDate(transaction.date)}</p>
                  </div>
                </div>
                <p className={`${transaction.type === 'income' ? 'text-emerald-600' : 'text-rose-600'} font-bold`}>
                  {transaction.type === 'income' ? '+' : '-'}{formatCurrency(transaction.amount)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExpenseDashboard;
