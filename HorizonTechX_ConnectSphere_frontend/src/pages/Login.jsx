import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Lock, User, AlertCircle } from 'lucide-react';
import useAuthStore from '../store/useAuthStore';
import useToastStore from '../store/useToastStore';
import Loader from '../components/common/Loader';
import Logo from '../components/common/Logo';

export const Login = () => {
  const login = useAuthStore((state) => state.login);
  const isSubmitting = useAuthStore((state) => state.isSubmitting);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const navigate = useNavigate();

  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [localError, setLocalError] = useState('');

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError('');

    const cleanId = identifier.trim();
    if (!cleanId) {
      useToastStore.getState().error('Please enter your email or username');
      return;
    }
    if (!password) {
      useToastStore.getState().error('Please enter your password');
      return;
    }

    const result = await login({
      identifier: cleanId,
      username: cleanId,
      email: cleanId,
      password,
    });

    if (result.success) {
      navigate('/', { replace: true });
    } else {
      setLocalError(result.error);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-10 px-4">
      <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-8 shadow-xl transition-colors">
        <div className="text-center mb-6 flex flex-col items-center">
          <Logo className="mb-3" />
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">
            Welcome to ConnectSphere
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Sign in with your username or email
          </p>
        </div>

        {localError && (
          <div className="mb-4 flex items-center gap-2 p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 text-xs border border-rose-200 dark:border-rose-900/50">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{localError}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Email or Username
            </label>
            <div className="relative">
              <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                autoFocus
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder="Enter your email or username"
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
            className="w-full h-11 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm flex items-center justify-center gap-2 shadow-md shadow-blue-500/20 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer transition-colors"
          >
            {isSubmitting ? (
              <Loader size="sm" className="text-white" />
            ) : (
              <>
                <span>Sign In</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="mt-6 text-center text-xs text-slate-500 dark:text-slate-400">
          Don't have an account?{' '}
          <Link to="/register" className="text-blue-600 dark:text-blue-400 font-semibold hover:underline">
            Create account
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;