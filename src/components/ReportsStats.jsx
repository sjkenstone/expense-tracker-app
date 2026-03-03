import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useExpense } from '../context/ExpenseContext';

const ReportsStats = () => {
  const { transactions } = useExpense();
  const [period, setPeriod] = useState('monthly');

  // Helper to get start and end of periods
  const getPeriodRange = (type) => {
    const now = new Date();
    let start = new Date(now);
    let end = new Date(now);

    if (type === 'weekly') {
      // Start of current week (Monday)
      const day = now.getDay();
      const diff = now.getDate() - day + (day === 0 ? -6 : 1);
      start.setDate(diff);
      start.setHours(0, 0, 0, 0);
      
      end = new Date(start);
      end.setDate(start.getDate() + 6);
      end.setHours(23, 59, 59, 999);
    } else if (type === 'monthly') {
      // Start of current month
      start = new Date(now.getFullYear(), now.getMonth(), 1);
      end = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);
    } else if (type === 'yearly') {
      // Start of current year
      start = new Date(now.getFullYear(), 0, 1);
      end = new Date(now.getFullYear(), 11, 31, 23, 59, 59, 999);
    }

    return { start, end };
  };

  const periodRange = useMemo(() => getPeriodRange(period), [period]);

  // Filter transactions based on period
  const filteredTransactions = useMemo(() => {
    return transactions.filter(t => {
      const tDate = new Date(t.date);
      return t.type === 'expense' && tDate >= periodRange.start && tDate <= periodRange.end;
    });
  }, [transactions, periodRange]);

  const totalSpending = useMemo(() => {
    return filteredTransactions.reduce((acc, t) => acc + t.amount, 0);
  }, [filteredTransactions]);

  // Data for Spending Trends
  const trendData = useMemo(() => {
    const data = [];
    const { start, end } = periodRange;

    if (period === 'weekly') {
      // Monday to Sunday
      const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
      for (let i = 0; i < 7; i++) {
        const d = new Date(start);
        d.setDate(start.getDate() + i);
        const dayStr = d.toDateString();
        const amount = filteredTransactions
          .filter(t => new Date(t.date).toDateString() === dayStr)
          .reduce((sum, t) => sum + t.amount, 0);
        data.push({ label: days[i], amount });
      }
    } else if (period === 'monthly') {
      // Weeks of the month
      const weeks = ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5'];
      for (let i = 0; i < 5; i++) {
        const wStart = new Date(start);
        wStart.setDate(start.getDate() + i * 7);
        const wEnd = new Date(wStart);
        wEnd.setDate(wStart.getDate() + 6);
        
        const amount = filteredTransactions
          .filter(t => {
            const td = new Date(t.date);
            return td >= wStart && td <= wEnd;
          })
          .reduce((sum, t) => sum + t.amount, 0);
        data.push({ label: weeks[i], amount });
      }
    } else if (period === 'yearly') {
      // Months of the year
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      for (let i = 0; i < 12; i++) {
        const amount = filteredTransactions
          .filter(t => new Date(t.date).getMonth() === i)
          .reduce((sum, t) => sum + t.amount, 0);
        data.push({ label: months[i], amount });
      }
    }

    return data;
  }, [period, filteredTransactions, periodRange]);

  const maxTrendAmount = Math.max(...trendData.map(d => d.amount), 1);

  // Calculate category totals
  const categoryTotals = useMemo(() => {
    const totals = filteredTransactions.reduce((acc, t) => {
      if (!acc[t.category]) {
        acc[t.category] = { amount: 0, count: 0, icon: t.icon, color: 'bg-blue-100 text-blue-600' };
      }
      acc[t.category].amount += t.amount;
      acc[t.category].count += 1;
      
      // Assign colors
      const colorMap = {
        'Food': 'bg-orange-100 text-orange-600',
        'Transport': 'bg-purple-100 text-purple-600',
        'Shopping': 'bg-blue-100 text-blue-600',
        'Housing': 'bg-red-100 text-red-600',
        'Bills': 'bg-emerald-100 text-emerald-600'
      };
      if (colorMap[t.category]) acc[t.category].color = colorMap[t.category];
      
      return acc;
    }, {});

    return Object.keys(totals).map(cat => ({
      name: cat,
      ...totals[cat],
      percentage: totalSpending > 0 ? (totals[cat].amount / totalSpending) * 100 : 0
    })).sort((a, b) => b.amount - a.amount);
  }, [filteredTransactions, totalSpending]);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
  };

  const getConicGradient = () => {
    if (categoryTotals.length === 0) return 'conic-gradient(#e5e7eb 0% 100%)';
    let currentPercentage = 0;
    const colors = ['#1152d4', '#3b82f6', '#60a5fa', '#93c5fd', '#d1d5db', '#10b981', '#f59e0b', '#ef4444'];
    const gradients = categoryTotals.map((cat, index) => {
      const start = currentPercentage;
      const end = currentPercentage + cat.percentage;
      currentPercentage = end;
      return `${colors[index % colors.length]} ${start}% ${end}%`;
    });
    return `conic-gradient(${gradients.join(', ')})`;
  };

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 font-display">
      
      <header className="sticky top-0 z-10 flex items-center bg-white dark:bg-background-dark/80 backdrop-blur-md p-4 border-b border-gray-100 dark:border-gray-800 justify-between">
        <Link to="/dashboard" className="flex size-10 shrink-0 items-center justify-start text-primary">
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
            <button 
              onClick={() => setPeriod('weekly')}
              className={`flex h-full grow items-center justify-center rounded-lg px-2 text-sm font-semibold transition-all ${period === 'weekly' ? 'bg-white dark:bg-gray-700 shadow-sm text-primary' : 'text-gray-500 dark:text-gray-400'}`}
            >
              Weekly
            </button>
            <button 
              onClick={() => setPeriod('monthly')}
              className={`flex h-full grow items-center justify-center rounded-lg px-2 text-sm font-semibold transition-all ${period === 'monthly' ? 'bg-white dark:bg-gray-700 shadow-sm text-primary' : 'text-gray-500 dark:text-gray-400'}`}
            >
              Monthly
            </button>
            <button 
              onClick={() => setPeriod('yearly')}
              className={`flex h-full grow items-center justify-center rounded-lg px-2 text-sm font-semibold transition-all ${period === 'yearly' ? 'bg-white dark:bg-gray-700 shadow-sm text-primary' : 'text-gray-500 dark:text-gray-400'}`}
            >
              Yearly
            </button>
          </div>
        </div>

        <div className="text-center px-4 mb-8">
          <p className="text-gray-500 dark:text-gray-400 text-sm font-medium mb-1 uppercase tracking-wider">Total Spending</p>
          <h1 className="text-primary dark:text-white text-4xl font-extrabold tracking-tight">{formatCurrency(totalSpending)}</h1>
          <div className="mt-2 flex items-center justify-center gap-1 text-red-500 text-sm font-medium">
            <span className="material-symbols-outlined text-xs">trending_up</span>
            <span>8.2% from last {period === 'yearly' ? 'year' : 'month'}</span>
          </div>
        </div>

        <div className="px-4 mb-6">
          <div className="bg-white dark:bg-gray-900 rounded-xl p-5 shadow-sm border border-gray-50 dark:border-gray-800">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-bold text-gray-800 dark:text-gray-100">Spending Trends</h3>
              <span className="material-symbols-outlined text-gray-400 text-sm">info</span>
            </div>

            <div className="flex items-end justify-between h-40 gap-1 px-1 bg-gray-50 dark:bg-gray-800/50 rounded-lg pt-8 pb-2">
              {trendData.map((data, index) => (
                <div key={index} className="flex-1 flex flex-col items-center gap-2 group relative h-full justify-end">
                  {/* Tooltip */}
                  <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[8px] py-0.5 px-1.5 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-20 pointer-events-none">
                    {formatCurrency(data.amount)}
                  </div>
                  
                  {/* Bar */}
                  <div 
                    className="w-full max-w-[12px] rounded-t-sm bg-primary/20 group-hover:bg-primary transition-all duration-500"
                    style={{ 
                      height: `${(data.amount / maxTrendAmount) * 100}%`,
                      minHeight: data.amount > 0 ? '2px' : '0px'
                    }}
                  ></div>
                </div>
              ))}
              {trendData.length === 0 && <span className="text-gray-400 text-xs w-full text-center self-center">No data</span>}
            </div>
            <div className={`flex justify-between mt-4 text-[8px] text-gray-400 font-bold uppercase tracking-tighter overflow-x-auto no-scrollbar gap-1`}>
              {trendData.map((data, index) => (
                <span key={index} className="flex-1 text-center min-w-[20px]">{data.label}</span>
              ))}
            </div>
          </div>
        </div>

        <div className="px-4 mb-6">
          <div className="bg-white dark:bg-gray-900 rounded-xl p-5 shadow-sm border border-gray-50 dark:border-gray-800">
            <h3 className="font-bold text-gray-800 dark:text-gray-100 mb-6">Expense Breakdown</h3>
            <div className="flex items-center gap-8">
              
              <div className="relative size-32 shrink-0">
                <div className="size-32 rounded-full border-[14px] border-primary" style={{ background: getConicGradient(), borderColor: categoryTotals.length > 0 ? 'transparent' : '#f3f4f6' }}></div>
                <div className="absolute inset-0 m-[14px] bg-white dark:bg-gray-900 rounded-full flex flex-col items-center justify-center">
                  <span className="text-xs text-gray-400 font-medium">Top Cat.</span>
                  <span className="text-sm font-bold text-primary">{categoryTotals[0] ? Math.round(categoryTotals[0].percentage) : 0}%</span>
                </div>
              </div>

              <div className="flex flex-col gap-3 flex-1">
                {categoryTotals.length > 0 ? (
                  categoryTotals.slice(0, 4).map(cat => (
                    <div key={cat.name} className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <span className={`size-2 rounded-full bg-primary`}></span>
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

            {categoryTotals.map(cat => (
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
            
            {categoryTotals.length === 0 && (
               <div className="text-center py-8 text-gray-500">No expense data available</div>
            )}

          </div>
        </div>

      </main>
    </div>
  );
};

export default ReportsStats;
