import React from 'react';
import { Link } from 'react-router-dom';
import { useExpense } from '../context/ExpenseContext';

const ReportsStats = () => {
  const { transactions, expense } = useExpense();

  // Calculate category totals
  const categoryTotals = transactions
    .filter(t => t.type === 'expense')
    .reduce((acc, t) => {
      if (!acc[t.category]) {
        acc[t.category] = { amount: 0, count: 0, icon: t.icon, color: 'bg-blue-100 text-blue-600' };
      }
      acc[t.category].amount += t.amount;
      acc[t.category].count += 1;
      
      // Assign colors based on category (simple mapping)
      if (t.category === 'Food') acc[t.category].color = 'bg-orange-100 text-orange-600';
      if (t.category === 'Transport') acc[t.category].color = 'bg-purple-100 text-purple-600';
      if (t.category === 'Shopping') acc[t.category].color = 'bg-blue-100 text-blue-600';
      if (t.category === 'Housing') acc[t.category].color = 'bg-red-100 text-red-600';
      
      return acc;
    }, {});

  const categories = Object.keys(categoryTotals).map(cat => ({
    name: cat,
    ...categoryTotals[cat],
    percentage: expense > 0 ? (categoryTotals[cat].amount / expense) * 100 : 0
  })).sort((a, b) => b.amount - a.amount);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
  };

  // Calculate conic gradient based on categories
  const getConicGradient = () => {
    if (categories.length === 0) return 'conic-gradient(#e5e7eb 0% 100%)';
    
    let currentPercentage = 0;
    const colors = ['#1152d4', '#3b82f6', '#60a5fa', '#93c5fd', '#d1d5db'];
    
    const gradients = categories.map((cat, index) => {
      const start = currentPercentage;
      const end = currentPercentage + cat.percentage;
      currentPercentage = end;
      const color = colors[index % colors.length];
      return `${color} ${start}% ${end}%`;
    });
    
    return `conic-gradient(${gradients.join(', ')})`;
  };

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 font-display">
      
      <header className="sticky top-0 z-10 flex items-center bg-white dark:bg-background-dark/80 backdrop-blur-md p-4 border-b border-gray-100 dark:border-gray-800 justify-between">
        <Link to="/" className="flex size-10 shrink-0 items-center justify-start text-primary">
          <span className="material-symbols-outlined cursor-pointer">arrow_back</span>
        </Link>
        <h2 className="text-[#111318] dark:text-white text-lg font-bold leading-tight flex-1 text-center">Statistics</h2>
        <div className="flex size-10 items-center justify-end text-primary">
          <button className="flex items-center justify-center rounded-lg h-10 w-10 hover:bg-primary/10 transition-colors">
            <span className="material-symbols-outlined">ios_share</span>
          </button>
        </div>
      </header>
      
      <main className="max-w-md mx-auto pb-24">

        <div className="px-4 py-6">
          <div className="flex h-12 items-center justify-center rounded-xl bg-gray-200/50 dark:bg-gray-800 p-1">
            <label className="flex cursor-pointer h-full grow items-center justify-center overflow-hidden rounded-lg px-2 has-[:checked]:bg-white dark:has-[:checked]:bg-gray-700 has-[:checked]:shadow-sm has-[:checked]:text-primary text-gray-500 dark:text-gray-400 text-sm font-semibold transition-all">
              <span>Weekly</span>
              <input className="hidden" name="period" type="radio" value="weekly" />
            </label>
            <label className="flex cursor-pointer h-full grow items-center justify-center overflow-hidden rounded-lg px-2 has-[:checked]:bg-white dark:has-[:checked]:bg-gray-700 has-[:checked]:shadow-sm has-[:checked]:text-primary text-gray-500 dark:text-gray-400 text-sm font-semibold transition-all">
              <span>Monthly</span>
              <input defaultChecked className="hidden" name="period" type="radio" value="monthly" />
            </label>
            <label className="flex cursor-pointer h-full grow items-center justify-center overflow-hidden rounded-lg px-2 has-[:checked]:bg-white dark:has-[:checked]:bg-gray-700 has-[:checked]:shadow-sm has-[:checked]:text-primary text-gray-500 dark:text-gray-400 text-sm font-semibold transition-all">
              <span>Yearly</span>
              <input className="hidden" name="period" type="radio" value="yearly" />
            </label>
          </div>
        </div>

        <div className="text-center px-4 mb-8">
          <p className="text-gray-500 dark:text-gray-400 text-sm font-medium mb-1 uppercase tracking-wider">Total Spending</p>
          <h1 className="text-primary dark:text-white text-4xl font-extrabold tracking-tight">{formatCurrency(expense)}</h1>
          <div className="mt-2 flex items-center justify-center gap-1 text-red-500 text-sm font-medium">
            <span className="material-symbols-outlined text-xs">trending_up</span>
            <span>8.2% from last month</span>
          </div>
        </div>

        <div className="px-4 mb-6">
          <div className="bg-white dark:bg-gray-900 rounded-xl p-5 shadow-sm border border-gray-50 dark:border-gray-800">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-bold text-gray-800 dark:text-gray-100">Spending Trends</h3>
              <span className="material-symbols-outlined text-gray-400 text-sm">info</span>
            </div>

            <div className="flex items-center justify-center h-40 gap-2 px-1 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
              <span className="text-gray-400 text-sm">No trend data available</span>
            </div>
            <div className="flex justify-between mt-4 text-[10px] text-gray-400 font-bold uppercase tracking-tighter">
              <span>Week 1</span>
              <span>Week 2</span>
              <span>Week 3</span>
              <span>Week 4</span>
              <span>Week 5</span>
              <span>Week 6</span>
            </div>
          </div>
        </div>

        <div className="px-4 mb-6">
          <div className="bg-white dark:bg-gray-900 rounded-xl p-5 shadow-sm border border-gray-50 dark:border-gray-800">
            <h3 className="font-bold text-gray-800 dark:text-gray-100 mb-6">Expense Breakdown</h3>
            <div className="flex items-center gap-8">
              
              <div className="relative size-32 shrink-0">
                <div className="size-32 rounded-full border-[14px] border-primary" style={{ background: getConicGradient(), borderColor: categories.length > 0 ? 'transparent' : '#f3f4f6' }}></div>
                <div className="absolute inset-0 m-[14px] bg-white dark:bg-gray-900 rounded-full flex flex-col items-center justify-center">
                  <span className="text-xs text-gray-400 font-medium">Top Cat.</span>
                  <span className="text-sm font-bold text-primary">{categories[0] ? Math.round(categories[0].percentage) : 0}%</span>
                </div>
              </div>

              <div className="flex flex-col gap-3 flex-1">
                {categories.length > 0 ? (
                  categories.slice(0, 4).map(cat => (
                    <div key={cat.name} className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <span className={`size-2 rounded-full ${cat.name === 'Food' ? 'bg-orange-500' : 'bg-blue-500'}`}></span>
                        <span className="text-gray-600 dark:text-gray-300 font-medium">{cat.name}</span>
                      </div>
                      <span className="font-bold text-gray-800 dark:text-white">{formatCurrency(cat.amount)}</span>
                    </div>
                  ))
                ) : (
                  <div className="text-gray-400 text-sm italic">No expenses recorded</div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="px-4 mb-10">
          <h3 className="font-bold text-gray-800 dark:text-gray-100 mb-4 px-1">Top Spending Categories</h3>
          <div className="space-y-3">

            {categories.map(cat => (
              <div key={cat.name} className="bg-white dark:bg-gray-900 p-4 rounded-xl flex flex-col gap-3 shadow-sm border border-gray-50 dark:border-gray-800">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`size-10 rounded-lg flex items-center justify-center ${cat.color}`}>
                      <span className="material-symbols-outlined">{cat.icon || 'category'}</span>
                    </div>
                    <div>
                      <p className="font-bold text-gray-800 dark:text-white leading-none">{cat.name}</p>
                      <p className="text-xs text-gray-500 mt-1">{cat.count} Transactions</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-gray-800 dark:text-white">{formatCurrency(cat.amount)}</p>
                    <p className="text-xs text-primary font-bold">{Math.round(cat.percentage)}%</p>
                  </div>
                </div>
                <div className="w-full bg-gray-100 dark:bg-gray-800 h-2 rounded-full overflow-hidden">
                  <div className="bg-primary h-full rounded-full" style={{ width: `${cat.percentage}%` }}></div>
                </div>
              </div>
            ))}
            
            {categories.length === 0 && (
               <div className="text-center py-8 text-gray-500">No expense data available</div>
            )}

          </div>
        </div>

      </main>
    </div>
  );
};

export default ReportsStats;
