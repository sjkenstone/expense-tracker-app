import React from 'react';
import { Outlet } from 'react-router-dom';
import BottomNavigation from './BottomNavigation';

const AppLayout = () => {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 relative">
      <Outlet />
      <BottomNavigation />
    </div>
  );
};

export default AppLayout;
