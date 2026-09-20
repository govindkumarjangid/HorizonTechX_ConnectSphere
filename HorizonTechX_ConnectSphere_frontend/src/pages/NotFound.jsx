import React from 'react';
import { Link } from 'react-router-dom';
import { Compass, ArrowLeft } from 'lucide-react';

export const NotFound = () => {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center p-6">
      <div className="w-16 h-16 rounded-3xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-4">
        <Compass className="w-8 h-8 stroke-[1.5]" />
      </div>
      <h1 className="text-3xl font-extrabold text-slate-900 dark:text-slate-100 mb-2">
        404
      </h1>
      <h2 className="text-base font-semibold text-slate-700 dark:text-slate-300 mb-1">
        Page Not Found
      </h2>
      <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mb-6">
        The page you are looking for might have been removed, had its name changed,
        or is temporarily unavailable.
      </p>
      <Link
        to="/"
        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-blue-600 text-white font-semibold text-xs hover:bg-blue-700 shadow-md shadow-blue-500/20 transition-all"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Return to Homepage</span>
      </Link>
    </div>
  );
};

export default NotFound;