import React, { createContext, useContext, useState, useEffect } from 'react';

const ExpenseContext = createContext();

export const useExpense = () => useContext(ExpenseContext);

export const ExpenseProvider = ({ children }) => {
  const [transactions, setTransactions] = useState(() => {
    try {
      const saved = localStorage.getItem('transactions');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      console.error('Failed to parse transactions from localStorage:', e);
      return [];
    }
  });

  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('user');
      return saved ? JSON.parse(saved) : {
        name: 'Alex Rivera',
        email: 'alex.rivera@example.com',
        avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA8zXKwuKuh6jZGsN9RHokD1yr9hLZ3OgPbhEOOWgYQNmYEBLDVZd1wPMq3nB5lHiax3kMmzmo7H4I2HZ1nY5afPEXGJtYv0xagFtJ3qJKRohWXXdCqWCUJMbDUdi5HWS8FSonBomocr1GMiKQ7HoTpMAG4HBiLGL0xajvCpl0UVz7bZYk7wr7JS9QnIBRH_93tnYokiiXN0fZ4nPbqKC_kqrwykS5pXUd3glb81nQR3EBt4JwpjoX4LNo_JDrb9_mFmAtiqyYDr_w'
      };
    } catch (e) {
      console.error('Failed to parse user from localStorage:', e);
      return {
        name: 'Alex Rivera',
        email: 'alex.rivera@example.com',
        avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA8zXKwuKuh6jZGsN9RHokD1yr9hLZ3OgPbhEOOWgYQNmYEBLDVZd1wPMq3nB5lHiax3kMmzmo7H4I2HZ1nY5afPEXGJtYv0xagFtJ3qJKRohWXXdCqWCUJMbDUdi5HWS8FSonBomocr1GMiKQ7HoTpMAG4HBiLGL0xajvCpl0UVz7bZYk7wr7JS9QnIBRH_93tnYokiiXN0fZ4nPbqKC_kqrwykS5pXUd3glb81nQR3EBt4JwpjoX4LNo_JDrb9_mFmAtiqyYDr_w'
      };
    }
  });

  useEffect(() => {
    localStorage.setItem('transactions', JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem('user', JSON.stringify(user));
  }, [user]);

  const addTransaction = (transaction) => {
    setTransactions(prev => [{ ...transaction, id: Date.now().toString() }, ...prev]);
  };

  const deleteTransaction = (id) => {
    setTransactions(prev => prev.filter(t => t.id !== id));
  };

  const updateUser = (userData) => {
    setUser(prev => ({ ...prev, ...userData }));
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
      transactions,
      user,
      addTransaction,
      deleteTransaction,
      updateUser,
      balance: calculateBalance(),
      income: calculateIncome(),
      expense: calculateExpense()
    }}>
      {children}
    </ExpenseContext.Provider>
  );
};
