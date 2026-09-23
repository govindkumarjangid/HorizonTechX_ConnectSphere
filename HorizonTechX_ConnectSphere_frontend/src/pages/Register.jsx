import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Lock, User, Mail } from 'lucide-react';
import useAuthStore from '../store/useAuthStore';
import useToastStore from '../store/useToastStore';
import Loader from '../components/common/Loader';
import Logo from '../components/common/Logo';

export const Register = () => {
  const register = useAuthStore((state) => state.register);
  const isSubmitting = useAuthStore((state) => state.isSubmitting);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const navigate = useNavigate();

  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;

    const cleanUsername = username.trim().toLowerCase();
    if (!cleanUsername) {
      useToastStore.getState().error('Please enter your username');
      return;
    }
    if (cleanUsername.length < 3) {
      useToastStore.getState().error('Username must be at least 3 characters');
      return;
    }
    if (!/^[a-z0-9_.]+$/.test(cleanUsername)) {
      useToastStore.getState().error('Username can only contain letters, numbers, underscore and dot');
      return;
    }

    if (!password) {
      useToastStore.getState().error('Please enter your password');
      return;
    }
    if (password.length < 6) {
      useToastStore.getState().error('Password must be at least 6 characters');
      return;
    }

    const cleanEmail = email.trim().toLowerCase();
    if (cleanEmail && !/\S+@\S+\.\S+/.test(cleanEmail)) {
      useToastStore.getState().error('Please enter a valid email address');
      return;
    }

    const payload = {
      username: cleanUsername,
      password,
    };
    if (fullName.trim()) {
      payload.fullName = fullName.trim();
    }
    if (cleanEmail) {
      payload.email = cleanEmail;
    }

    const result = await register(payload);
    if (result.success) {
      navigate('/', { replace: true });
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-6 sm:py-10 px-3 sm:px-4">
      <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl sm:rounded-3xl border border-slate-200/80 dark:border-slate-800 p-5 sm:p-8 shadow-xl transition-colors">
        <div className="text-center mb-5 sm:mb-6 flex flex-col items-center">
          <Logo className="mb-3" />
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">
            Join Connectly
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Create your account to start sharing and connecting
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Username <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                autoFocus
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your username"
                className="w-full h-11 pl-10 pr-3 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-slate-100 focus:outline-hidden focus:border-blue-500 transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Full Name <span className="text-slate-400 font-normal text-[11px]">(optional)</span>
            </label>
            <div className="relative">
              <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Enter your name (optional)"
                className="w-full h-11 pl-10 pr-3 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-slate-100 focus:outline-hidden focus:border-blue-500 transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Email Address <span className="text-slate-400 font-normal text-[11px]">(optional)</span>
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email (optional)"
                className="w-full h-11 pl-10 pr-3 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-slate-100 focus:outline-hidden focus:border-blue-500 transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full h-11 pl-10 pr-3 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-slate-100 focus:outline-hidden focus:border-blue-500 transition-colors"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full h-11 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer transition-colors"
          >
            {isSubmitting ? (
              <Loader size="sm" className="text-white" />
            ) : (
              <>
                <span>Create Account</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="mt-6 text-center text-xs text-slate-500 dark:text-slate-400">
          Already have an account?{' '}
          <Link to="/login" className="text-blue-600 dark:text-blue-400 font-semibold hover:underline">
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;