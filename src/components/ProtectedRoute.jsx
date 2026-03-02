import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useExpense } from '../context/ExpenseContext';

/**
 * ProtectedRoute 组件
 * 
 * 检查用户是否已登录。如果已登录，则渲染子组件；
 * 如果未登录，则重定向到登录页面。
 */
const ProtectedRoute = ({ children }) => {
  const { session, loading } = useExpense();

  // 如果还在加载 session，不显示任何内容或显示一个加载状态
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div>
      </div>
    );
  }

  // 如果没有 session，说明用户未登录，重定向到登录页 (/)
  if (!session) {
    return <Navigate to="/" replace />;
  }

  // 如果已登录，渲染子组件或 Outlet
  return children ? children : <Outlet />;
};

export default ProtectedRoute;
