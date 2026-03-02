import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

const ExpenseContext = createContext();

export const useExpense = () => useContext(ExpenseContext);

export const ExpenseProvider = ({ children }) => {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [transactions, setTransactions] = useState(() => {
    try {
      const saved = localStorage.getItem('transactions');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      console.error('Failed to parse transactions from localStorage:', e);
      return [];
    }
  });

  const [user, setUser] = useState({
    name: 'Alex Rivera',
    email: 'alex.rivera@example.com',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA8zXKwuKuh6jZGsN9RHokD1yr9hLZ3OgPbhEOOWgYQNmYEBLDVZd1wPMq3nB5lHiax3kMmzmo7H4I2HZ1nY5afPEXGJtYv0xagFtJ3qJKRohWXXdCqWCUJMbDUdi5HWS8FSonBomocr1GMiKQ7HoTpMAG4HBiLGL0xajvCpl0UVz7bZYk7wr7JS9QnIBRH_93tnYokiiXN0fZ4nPbqKC_kqrwykS5pXUd3glb81nQR3EBt4JwpjoX4LNo_JDrb9_mFmAtiqyYDr_w'
  });

  useEffect(() => {
    // 1. 获取初始会话
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session?.user) {
        fetchProfile(session.user.id);
      }
      setLoading(false);
    });

    // 2. 监听 Auth 状态变化
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session?.user) {
        fetchProfile(session.user.id);
      } else {
        // 登出时清空用户资料
        setUser({
          name: 'Guest',
          email: '',
          avatar: ''
        });
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchProfile = async (userId) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) throw error;
      if (data) {
        setUser({
          name: data.name || data.email.split('@')[0],
          email: data.email,
          avatar: data.avatar_url || 'https://lh3.googleusercontent.com/aida-public/AB6AXuA8zXKwuKuh6jZGsN9RHokD1yr9hLZ3OgPbhEOOWgYQNmYEBLDVZd1wPMq3nB5lHiax3kMmzmo7H4I2HZ1nY5afPEXGJtYv0xagFtJ3qJKRohWXXdCqWCUJMbDUdi5HWS8FSonBomocr1GMiKQ7HoTpMAG4HBiLGL0xajvCpl0UVz7bZYk7wr7JS9QnIBRH_93tnYokiiXN0fZ4nPbqKC_kqrwykS5pXUd3glb81nQR3EBt4JwpjoX4LNo_JDrb9_mFmAtiqyYDr_w'
        });
      }
    } catch (err) {
      console.error('Error fetching profile:', err.message);
    }
  };

  useEffect(() => {
    localStorage.setItem('transactions', JSON.stringify(transactions));
  }, [transactions]);

  const addTransaction = (transaction) => {
    setTransactions(prev => [{ ...transaction, id: Date.now().toString() }, ...prev]);
  };

  const deleteTransaction = (id) => {
    setTransactions(prev => prev.filter(t => t.id !== id));
  };

  const updateUser = async (userData) => {
    if (!session?.user) return;

    try {
      const { error } = await supabase
        .from('profiles')
        .update({ name: userData.name })
        .eq('id', session.user.id);

      if (error) throw error;
      setUser(prev => ({ ...prev, ...userData }));
    } catch (err) {
      console.error('Error updating profile:', err.message);
    }
  };

  const logout = async () => {
    await supabase.auth.signOut();
  };

  const calculateBalance = () => {
    return transactions.reduce((acc, curr) => {
      return curr.type === 'income' ? acc + curr.amount : acc - curr.amount;
    }, 0);
  };

  const calculateIncome = () => {
    return transactions
      .filter(t => t.type === 'income')
      .reduce((acc, curr) => acc + curr.amount, 0);
  };

  const calculateExpense = () => {
    return transactions
      .filter(t => t.type === 'expense')
      .reduce((acc, curr) => acc + curr.amount, 0);
  };

  return (
    <ExpenseContext.Provider value={{
      session,
      loading,
      transactions,
      user,
      addTransaction,
      deleteTransaction,
      updateUser,
      logout,
      balance: calculateBalance(),
      income: calculateIncome(),
      expense: calculateExpense()
    }}>
      {!loading && children}
    </ExpenseContext.Provider>
  );
};

