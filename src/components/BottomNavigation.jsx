import React from 'react';
import { NavLink } from 'react-router-dom';

const BottomNavigation = () => {
  const getLinkClass = ({ isActive }) => 
    `flex flex-col items-center gap-1 transition-colors ${isActive ? 'text-primary' : 'text-slate-400 hover:text-primary'}`;

  return (
    <div className="fixed bottom-0 left-0 w-full bg-white dark:bg-background-dark border-t border-slate-100 dark:border-slate-800 z-50 pb-safe">
      <div className="max-w-md mx-auto px-6 h-[70px] flex items-center justify-between relative">
        {/* Home */}
        <NavLink to="/" className={getLinkClass} end>
          {({ isActive }) => (
            <>
              <span className="material-symbols-outlined" style={isActive ? { fontVariationSettings: "'FILL' 1" } : {}}>home</span>
              <span className="text-[10px] font-bold uppercase tracking-widest">Home</span>
            </>
          )}
        </NavLink>

        {/* History */}
        <NavLink to="/transactions" className={getLinkClass}>
          {({ isActive }) => (
            <>
              <span className="material-symbols-outlined" style={isActive ? { fontVariationSettings: "'FILL' 1" } : {}}>history</span>
              <span className="text-[10px] font-bold uppercase tracking-widest">History</span>
            </>
          )}
        </NavLink>

        {/* Add Button (Floating) */}
        <div className="relative -top-8">
          <NavLink to="/add-expense">
            <button className="bg-primary text-white size-14 rounded-full shadow-lg shadow-primary/40 flex items-center justify-center active:scale-90 transition-transform">
              <span className="material-symbols-outlined text-3xl">add</span>
            </button>
          </NavLink>
        </div>

        {/* Stats */}
        <NavLink to="/reports" className={getLinkClass}>
          {({ isActive }) => (
            <>
              <span className="material-symbols-outlined" style={isActive ? { fontVariationSettings: "'FILL' 1" } : {}}>leaderboard</span>
              <span className="text-[10px] font-bold uppercase tracking-widest">Stats</span>
            </>
          )}
        </NavLink>

        {/* Profile */}
        <NavLink to="/profile" className={getLinkClass}>
          {({ isActive }) => (
            <>
              <span className="material-symbols-outlined" style={isActive ? { fontVariationSettings: "'FILL' 1" } : {}}>person</span>
              <span className="text-[10px] font-bold uppercase tracking-widest">Profile</span>
            </>
          )}
        </NavLink>
      </div>
    </div>
  );
};

export default BottomNavigation;
