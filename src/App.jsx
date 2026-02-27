import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ExpenseProvider } from './context/ExpenseContext';
import AppLayout from './components/AppLayout';
import ExpenseDashboard from './components/ExpenseDashboard';
import TransactionHistory from './components/TransactionHistory';
import AddExpense from './components/AddExpense';
import ReportsStats from './components/ReportsStats';
import UserProfileSettings from './components/UserProfileSettings';
import Register from './components/Register';
import Login from './components/Login';

function App() {
  return (
    <Router>
      <ExpenseProvider>
        <Routes>
          <Route element={<AppLayout />}>
            <Route path="/" element={<ExpenseDashboard />} />
            <Route path="/transactions" element={<TransactionHistory />} />
            <Route path="/reports" element={<ReportsStats />} />
            <Route path="/profile" element={<UserProfileSettings />} />
          </Route>
          <Route path="/add-expense" element={<AddExpense />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </ExpenseProvider>
    </Router>
  );
}

export default App;
