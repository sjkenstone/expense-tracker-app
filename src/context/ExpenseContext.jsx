import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

const ExpenseContext = createContext();

export const useExpense = () => useContext(ExpenseContext);

export const ExpenseProvider = ({ children }) => {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [transactions, setTransactions] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [categories, setCategories] = useState([]);

  const [user, setUser] = useState({
    name: 'Guest',
    email: '',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA8zXKwuKuh6jZGsN9RHokD1yr9hLZ3OgPbhEOOWgYQNmYEBLDVZd1wPMq3nB5lHiax3kMmzmo7H4I2HZ1nY5afPEXGJtYv0xagFtJ3qJKRohWXXdCqWCUJMbDUdi5HWS8FSonBomocr1GMiKQ7HoTpMAG4HBiLGL0xajvCpl0UVz7bZYk7wr7JS9QnIBRH_93tnYokiiXN0fZ4nPbqKC_kqrwykS5pXUd3glb81nQR3EBt4JwpjoX4LNo_JDrb9_mFmAtiqyYDr_w'
  });

  useEffect(() => {
    // 1. 获取初始会话
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session?.user) {
        fetchAllData(session.user.id);
      }
      setLoading(false);
    });

    // 2. 监听 Auth 状态变化
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session?.user) {
        fetchAllData(session.user.id);
      } else {
        // 登出时清空数据
        setUser({ name: 'Guest', email: '', avatar: '' });
        setTransactions([]);
        setAccounts([]);
        setCategories([]);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchAllData = async (userId) => {
    await Promise.all([
      fetchProfile(userId),
      fetchAccounts(userId),
      fetchCategories(userId),
      fetchTransactions(userId)
    ]);
  };

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

  const fetchAccounts = async (userId) => {
    const { data, error } = await supabase
      .from('accounts')
      .select('*')
      .eq('user_id', userId);
    if (!error && data) setAccounts(data);
  };

  const fetchCategories = async (userId) => {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .or(`user_id.eq.${userId},user_id.is.null`);
    if (!error && data) setCategories(data);
  };

  const fetchTransactions = async (userId) => {
    const { data, error } = await supabase
      .from('transactions')
      .select(`
        *,
        categories (name, icon_name),
        accounts (name)
      `)
      .eq('user_id', userId)
      .order('date', { ascending: false });
    
    if (!error && data) {
      // 转换为前端使用的格式，并处理金额（分 -> 元）
      const formatted = data.map(t => ({
        id: t.id,
        title: t.note || t.categories?.name || 'Untitled',
        amount: t.amount / 100, // 分转元
        date: t.date,
        type: t.type,
        category: t.categories?.name,
        icon: t.categories?.icon_name,
        account_id: t.account_id,
        category_id: t.category_id,
        note: t.note
      }));
      setTransactions(formatted);
    }
  };

  const addTransaction = async (transaction) => {
    if (!session?.user) return;
    
    const newTransaction = {
      user_id: session.user.id,
      account_id: transaction.account_id,
      category_id: transaction.category_id,
      amount: Math.round(transaction.amount * 100), // 元转分
      type: transaction.type,
      note: transaction.note,
      date: transaction.date || new Date().toISOString()
    };

    const { data, error } = await supabase
      .from('transactions')
      .insert([newTransaction])
      .select(`
        *,
        categories (name, icon_name),
        accounts (name)
      `);

    if (!error && data) {
      const t = data[0];
      const formatted = {
        id: t.id,
        title: t.note || t.categories?.name || 'Untitled',
        amount: t.amount / 100,
        date: t.date,
        type: t.type,
        category: t.categories?.name,
        icon: t.categories?.icon_name,
        account_id: t.account_id,
        category_id: t.category_id,
        note: t.note
      };
      setTransactions(prev => [formatted, ...prev]);
      // 同时也需要更新账户余额（简化处理，实际应在后端或通过 RPC 触发）
      fetchAccounts(session.user.id);
    }
  };

  const updateTransaction = async (id, updatedData) => {
    if (!session?.user) return;

    const updatePayload = {
      account_id: updatedData.account_id,
      category_id: updatedData.category_id,
      amount: Math.round(updatedData.amount * 100),
      type: updatedData.type,
      note: updatedData.note,
      date: updatedData.date
    };

    const { error } = await supabase
      .from('transactions')
      .update(updatePayload)
      .eq('id', id);

    if (!error) {
      fetchTransactions(session.user.id);
      fetchAccounts(session.user.id);
    }
  };

  const deleteTransaction = async (id) => {
    if (!session?.user) return;

    const { error } = await supabase
      .from('transactions')
      .delete()
      .eq('id', id);

    if (!error) {
      setTransactions(prev => prev.filter(t => t.id !== id));
      fetchAccounts(session.user.id);
    }
  };

  const addAccount = async (name, initialBalance = 0) => {
    if (!session?.user) return;

    const { data, error } = await supabase
      .from('accounts')
      .insert([{ 
        user_id: session.user.id, 
        name, 
        balance: Math.round(initialBalance * 100) 
      }])
      .select();

    if (!error && data) {
      setAccounts(prev => [...prev, data[0]]);
      return data[0];
    }
    return null;
  };

  const addCategory = async (name, type, icon = 'label') => {
    if (!session?.user || !name.trim()) return null;

    const { data, error } = await supabase
      .from('categories')
      .insert([{ 
        user_id: session.user.id, 
        name, 
        type, 
        icon_name: icon 
      }])
      .select();

    if (!error && data) {
      setCategories(prev => [...prev, data[0]]);
      return data[0];
    }
    return null;
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
      accounts,
      categories,
      user,
      addTransaction,
      updateTransaction,
      deleteTransaction,
      addAccount,
      addCategory,
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

