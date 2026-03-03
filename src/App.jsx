import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ExpenseProvider, useExpense } from './context/ExpenseContext';
import AppLayout from './components/AppLayout';
import ExpenseDashboard from './components/ExpenseDashboard';
import TransactionHistory from './components/TransactionHistory';
import AddExpense from './components/AddExpense';
import ReportsStats from './components/ReportsStats';
import UserProfileSettings from './components/UserProfileSettings';
import Register from './components/Register';
import Login from './components/Login';
import EditTransaction from './components/EditTransaction';
import ProtectedRoute from './components/ProtectedRoute';

// 辅助组件：处理重定向
const AuthRedirect = ({ children }) => {
  const { session, loading } = useExpense();
  
  if (loading) return null; // 等待加载完成
  
  // 如果已经登录，尝试访问登录/注册页面时重定向到首页
  if (session) {
    return <Navigate to="/dashboard" replace />;
  }
  
  return children;
};

function App() {
  return (
    <Router>
      <ExpenseProvider>
        <Routes>
          {/* 公开路由：登录和注册 */}
          <Route path="/" element={<AuthRedirect><Login /></AuthRedirect>} />
          <Route path="/register" element={<AuthRedirect><Register /></AuthRedirect>} />

          {/* 受保护路由：需要登录才能访问 */}
          <Route element={<ProtectedRoute />}>
            <Route element={<AppLayout />}>
              <Route path="/dashboard" element={<ExpenseDashboard />} />
              <Route path="/transactions" element={<TransactionHistory />} />
              <Route path="/reports" element={<ReportsStats />} />
              <Route path="/profile" element={<UserProfileSettings />} />
            </Route>
            <Route path="/add-expense" element={<AddExpense />} />
            <Route path="/edit-transaction/:id" element={<EditTransaction />} />
          </Route>

          {/* 兜底路由：404 或未匹配路径重定向 */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </ExpenseProvider>
    </Router>
  );
}

export default App;
