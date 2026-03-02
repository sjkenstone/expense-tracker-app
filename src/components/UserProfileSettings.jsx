import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useExpense } from '../context/ExpenseContext';

const UserProfileSettings = () => {
  const navigate = useNavigate();
  const { user, updateUser, logout } = useExpense();
  const [isEditingName, setIsEditingName] = useState(false);
  const [newName, setNewName] = useState(user.name);

  const handleNameSave = () => {
    if (newName.trim()) {
      updateUser({ name: newName.trim() });
      setIsEditingName(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleNameSave();
    } else if (e.key === 'Escape') {
      setIsEditingName(false);
      setNewName(user.name);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (err) {
      console.error('Logout failed:', err.message);
    }
  };

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 font-display">
      
<div className="relative flex min-h-screen w-full max-w-md mx-auto flex-col bg-white dark:bg-background-dark shadow-xl overflow-x-hidden">

<div className="sticky top-0 z-10 flex items-center bg-white/80 dark:bg-background-dark/80 backdrop-blur-md p-4 pb-2 justify-between border-b border-slate-100 dark:border-slate-800">
<Link to="/dashboard" className="text-slate-900 dark:text-white flex size-10 shrink-0 items-center justify-center cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800 rounded-full transition-colors">
<span className="material-symbols-outlined">arrow_back</span>
</Link>
<h2 className="text-slate-900 dark:text-white text-lg font-bold leading-tight tracking-tight flex-1 text-center">Profile</h2>
<div className="flex w-10 items-center justify-end">
<button className="flex items-center justify-center rounded-full size-10 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
<span className="material-symbols-outlined text-slate-900 dark:text-white">settings</span>
</button>
</div>
</div>
<div className="flex-1 overflow-y-auto no-scrollbar pb-24">

<div className="flex p-6">
<div className="flex w-full flex-col gap-4 items-center">
<div className="relative group">
            <div className="bg-center bg-no-repeat aspect-square bg-cover rounded-full min-h-28 w-28 border-4 border-white dark:border-slate-800 shadow-lg" style={{ backgroundImage: `url("${user.avatar}")` }}>
            </div>
            <button className="absolute bottom-1 right-1 bg-primary text-white size-8 flex items-center justify-center rounded-full shadow-md hover:scale-105 transition-transform border-2 border-white dark:border-slate-800">
              <span className="material-symbols-outlined text-sm">edit</span>
            </button>
          </div>
          <div className="flex flex-col items-center justify-center">
            {isEditingName ? (
              <div className="flex items-center gap-2">
                <input
                  autoFocus
                  className="text-slate-900 dark:text-white text-2xl font-bold leading-tight tracking-tight bg-slate-50 dark:bg-slate-800 border-b-2 border-primary outline-none px-2 py-1 w-48 text-center"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  onBlur={handleNameSave}
                  onKeyDown={handleKeyDown}
                />
              </div>
            ) : (
              <div className="flex items-center gap-2 group cursor-pointer" onClick={() => setIsEditingName(true)}>
                <p className="text-slate-900 dark:text-white text-2xl font-bold leading-tight tracking-tight">{user.name}</p>
                <span className="material-symbols-outlined text-slate-400 text-lg opacity-0 group-hover:opacity-100 transition-opacity">edit</span>
              </div>
            )}
            <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">{user.email}</p>
            <div className="mt-2 px-3 py-1 bg-primary/10 text-primary text-xs font-bold rounded-full uppercase tracking-wider">Premium Member</div>
          </div>
</div>
</div>

<div className="px-4">
<h3 className="text-slate-400 dark:text-slate-500 text-xs font-bold leading-tight tracking-[0.05em] uppercase pb-2 pt-4">Account Settings</h3>
<div className="space-y-1">
<div className="flex items-center gap-4 bg-white dark:bg-slate-900/50 p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer">
<div className="text-primary flex items-center justify-center rounded-lg bg-primary/10 shrink-0 size-10">
<span className="material-symbols-outlined">person</span>
</div>
<div className="flex-1">
<p className="text-slate-900 dark:text-white text-base font-medium">Personal Information</p>
<p className="text-slate-500 text-xs">Name, Email, Phone</p>
</div>
<span className="material-symbols-outlined text-slate-300">chevron_right</span>
</div>
<div className="flex items-center gap-4 bg-white dark:bg-slate-900/50 p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer">
<div className="text-primary flex items-center justify-center rounded-lg bg-primary/10 shrink-0 size-10">
<span className="material-symbols-outlined">account_balance</span>
</div>
<div className="flex-1">
<p className="text-slate-900 dark:text-white text-base font-medium">Linked Accounts</p>
<p className="text-slate-500 text-xs">2 Connected accounts</p>
</div>
<span className="material-symbols-outlined text-slate-300">chevron_right</span>
</div>
</div>

<h3 className="text-slate-400 dark:text-slate-500 text-xs font-bold leading-tight tracking-[0.05em] uppercase pb-2 pt-6">Preferences</h3>
<div className="space-y-1">
<div className="flex items-center gap-4 bg-white dark:bg-slate-900/50 p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer">
<div className="text-primary flex items-center justify-center rounded-lg bg-primary/10 shrink-0 size-10">
<span className="material-symbols-outlined">payments</span>
</div>
<p className="text-slate-900 dark:text-white text-base font-medium flex-1">Currency</p>
<p className="text-primary text-sm font-bold">USD ($)</p>
<span className="material-symbols-outlined text-slate-300">chevron_right</span>
</div>
<div className="flex items-center gap-4 bg-white dark:bg-slate-900/50 p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer">
<div className="text-primary flex items-center justify-center rounded-lg bg-primary/10 shrink-0 size-10">
<span className="material-symbols-outlined">language</span>
</div>
<p className="text-slate-900 dark:text-white text-base font-medium flex-1">Language</p>
<p className="text-primary text-sm font-bold">English</p>
<span className="material-symbols-outlined text-slate-300">chevron_right</span>
</div>
<div className="flex items-center gap-4 bg-white dark:bg-slate-900/50 p-3 rounded-xl">
<div className="text-primary flex items-center justify-center rounded-lg bg-primary/10 shrink-0 size-10">
<span className="material-symbols-outlined">dark_mode</span>
</div>
<p className="text-slate-900 dark:text-white text-base font-medium flex-1">Dark Mode</p>
<label className="relative inline-flex items-center cursor-pointer">
<input className="sr-only peer" type="checkbox" />
<div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary"></div>
</label>
</div>
</div>

<h3 className="text-slate-400 dark:text-slate-500 text-xs font-bold leading-tight tracking-[0.05em] uppercase pb-2 pt-6">Notifications</h3>
<div className="space-y-1">
<div className="flex items-center gap-4 bg-white dark:bg-slate-900/50 p-3 rounded-xl">
<div className="text-primary flex items-center justify-center rounded-lg bg-primary/10 shrink-0 size-10">
<span className="material-symbols-outlined">notifications_active</span>
</div>
<div className="flex-1">
<p className="text-slate-900 dark:text-white text-base font-medium">Push Alerts</p>
<p className="text-slate-500 text-xs">Expense reminders &amp; weekly reports</p>
</div>
<label className="relative inline-flex items-center cursor-pointer">
<input checked="" className="sr-only peer" type="checkbox" />
<div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary"></div>
</label>
</div>
</div>

<h3 className="text-slate-400 dark:text-slate-500 text-xs font-bold leading-tight tracking-[0.05em] uppercase pb-2 pt-6">Security</h3>
<div className="space-y-1">
<div className="flex items-center gap-4 bg-white dark:bg-slate-900/50 p-3 rounded-xl">
<div className="text-primary flex items-center justify-center rounded-lg bg-primary/10 shrink-0 size-10">
<span className="material-symbols-outlined">fingerprint</span>
</div>
<p className="text-slate-900 dark:text-white text-base font-medium flex-1">PIN/Biometrics</p>
<label className="relative inline-flex items-center cursor-pointer">
<input checked="" className="sr-only peer" type="checkbox" />
<div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary"></div>
</label>
</div>
<div className="flex items-center gap-4 bg-white dark:bg-slate-900/50 p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer">
<div className="text-primary flex items-center justify-center rounded-lg bg-primary/10 shrink-0 size-10">
<span className="material-symbols-outlined">lock_reset</span>
</div>
<p className="text-slate-900 dark:text-white text-base font-medium flex-1">Change Password</p>
<span className="material-symbols-outlined text-slate-300">chevron_right</span>
</div>
</div>

<h3 className="text-slate-400 dark:text-slate-500 text-xs font-bold leading-tight tracking-[0.05em] uppercase pb-2 pt-6">Support</h3>
<div className="space-y-1">
<div className="flex items-center gap-4 bg-white dark:bg-slate-900/50 p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer">
<div className="text-primary flex items-center justify-center rounded-lg bg-primary/10 shrink-0 size-10">
<span className="material-symbols-outlined">help</span>
</div>
<p className="text-slate-900 dark:text-white text-base font-medium flex-1">Help Center</p>
<span className="material-symbols-outlined text-slate-300">chevron_right</span>
</div>
<div className="flex items-center gap-4 bg-white dark:bg-slate-900/50 p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer">
<div className="text-primary flex items-center justify-center rounded-lg bg-primary/10 shrink-0 size-10">
<span className="material-symbols-outlined">info</span>
</div>
<p className="text-slate-900 dark:text-white text-base font-medium flex-1">About ExpenseFlow</p>
<p className="text-slate-400 text-sm">v2.4.0</p>
</div>
</div>

<div className="py-10">
<button 
  onClick={handleLogout}
  className="w-full flex items-center justify-center gap-2 p-4 bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-400 rounded-xl font-bold hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
>
  <span className="material-symbols-outlined">logout</span>
  Log Out
</button>
<p className="text-center text-slate-400 text-xs mt-4">Logged in since 22 Oct 2023</p>
</div>
</div>
</div>


</div>

    </div>
  );
};

export default UserProfileSettings;
