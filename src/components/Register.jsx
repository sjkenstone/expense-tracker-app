import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Register = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  const handleRegister = (e) => {
    e.preventDefault();
    setError('');

    if (!email || !password || !confirmPassword) {
      setError('Please fill in all fields');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    // Mock registration success
    console.log('Registering with:', { email, password });
    alert('Registration successful!');
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 font-display flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white dark:bg-background-dark rounded-3xl shadow-2xl overflow-hidden border border-slate-100 dark:border-slate-800">
        <div className="p-8">
          <div className="flex flex-col items-center mb-8">
            <div className="size-16 bg-primary rounded-2xl flex items-center justify-center mb-4 shadow-lg shadow-primary/20">
              <span className="material-symbols-outlined text-white text-4xl">person_add</span>
            </div>
            <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">Create Account</h1>
            <p className="text-slate-500 dark:text-slate-400 text-sm mt-2 text-center">Join us to start managing your expenses smarter</p>
          </div>

          <form onSubmit={handleRegister} className="space-y-5">
            {error && (
              <div className="bg-rose-50 dark:bg-rose-950/20 text-rose-600 dark:text-rose-400 p-3 rounded-xl text-xs font-bold flex items-center gap-2 border border-rose-100 dark:border-rose-900/30">
                <span className="material-symbols-outlined text-sm">error</span>
                {error}
              </div>
            )}

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 px-1">Email Address</label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xl">mail</span>
                <input 
                  className="w-full pl-10 pr-4 py-3.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800/50 text-slate-900 dark:text-white focus:border-primary focus:ring-1 focus:ring-primary transition-all outline-none" 
                  placeholder="Enter your email" 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 px-1">Password</label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xl">lock</span>
                <input 
                  className="w-full pl-10 pr-4 py-3.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800/50 text-slate-900 dark:text-white focus:border-primary focus:ring-1 focus:ring-primary transition-all outline-none" 
                  placeholder="Create a password" 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 px-1">Confirm Password</label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xl">verified_user</span>
                <input 
                  className="w-full pl-10 pr-4 py-3.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800/50 text-slate-900 dark:text-white focus:border-primary focus:ring-1 focus:ring-primary transition-all outline-none" 
                  placeholder="Repeat your password" 
                  type="password" 
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>
            </div>

            <button 
              type="submit"
              className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-4 rounded-xl shadow-lg shadow-primary/25 flex items-center justify-center gap-2 transition-all active:scale-[0.98] mt-4"
            >
              <span className="material-symbols-outlined">how_to_reg</span>
              Sign Up
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-slate-500 dark:text-slate-400 text-sm">
              Already have an account?{' '}
              <Link to="/login" className="text-primary font-bold hover:underline">
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
