import React from 'react';
import { Settings as SettingsIcon, Sun, Moon, Shield, User } from 'lucide-react';
import { useTheme } from '../store/useThemeStore';
import { useAuth } from '../store/useAuthStore';

export const Settings = () => {
  const { isDark, setTheme } = useTheme();
  const { user } = useAuth();

  return (
    <div className="w-full space-y-5">
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-5 shadow-xs">
        <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
          <SettingsIcon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          <span>Platform Settings</span>
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Customize your experience, appearance, and privacy preferences
        </p>
      </div>

      {/* Appearance Section */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-6 shadow-xs space-y-4">
        <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
          <span>Appearance & Theme</span>
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Choose a calm, editorial theme designed for reading and visual clarity.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 pt-2">
          {/* Light Mode Card */}
          <div
            onClick={() => setTheme('light')}
            className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
              !isDark
                ? 'border-blue-600 bg-blue-50/20 shadow-sm'
                : 'border-slate-200 dark:border-slate-800 hover:border-slate-300'
            }`}
          >
            <div className="flex items-center gap-2 mb-3">
              <Sun className="w-4 h-4 text-amber-500" />
              <span className="text-xs font-bold text-slate-900 dark:text-slate-100">
                Light Mode
              </span>
            </div>
            <div className="h-16 rounded-lg bg-[#f6f8fb] border border-slate-200 p-2 space-y-1.5">
              <div className="w-1/2 h-2 rounded-full bg-slate-300" />
              <div className="w-4/5 h-2 rounded-full bg-slate-200" />
              <div className="w-2/3 h-2 rounded-full bg-blue-500" />
            </div>
          </div>

          {/* Dark Mode Card */}
          <div
            onClick={() => setTheme('dark')}
            className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
              isDark
                ? 'border-blue-500 bg-blue-950/20 shadow-sm'
                : 'border-slate-200 dark:border-slate-800 hover:border-slate-300'
            }`}
          >
            <div className="flex items-center gap-2 mb-3">
              <Moon className="w-4 h-4 text-blue-400" />
              <span className="text-xs font-bold text-slate-900 dark:text-slate-100">
                Premium Dark
              </span>
            </div>
            <div className="h-16 rounded-lg bg-[#090d16] border border-slate-800 p-2 space-y-1.5">
              <div className="w-1/2 h-2 rounded-full bg-slate-700" />
              <div className="w-4/5 h-2 rounded-full bg-slate-800" />
              <div className="w-2/3 h-2 rounded-full bg-blue-500" />
            </div>
          </div>
        </div>
      </div>

      {/* Account Info */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-6 shadow-xs space-y-4">
        <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
          <User className="w-4 h-4 text-indigo-500" />
          <span>Account Overview</span>
        </h3>

        <div className="space-y-3 text-xs">
          <div className="flex justify-between py-2 border-b border-slate-100 dark:border-slate-800">
            <span className="text-slate-500">Full Name</span>
            <span className="font-semibold text-slate-900 dark:text-slate-100">
              {user?.fullName}
            </span>
          </div>
          <div className="flex justify-between py-2 border-b border-slate-100 dark:border-slate-800">
            <span className="text-slate-500">Username</span>
            <span className="font-semibold text-slate-900 dark:text-slate-100">
              @{user?.username}
            </span>
          </div>
          <div className="flex justify-between py-2 border-b border-slate-100 dark:border-slate-800">
            <span className="text-slate-500">Location</span>
            <span className="font-semibold text-slate-900 dark:text-slate-100">
              {user?.location}
            </span>
          </div>
          <div className="flex justify-between py-2">
            <span className="text-slate-500">Verification</span>
            <span className="font-semibold text-emerald-600 dark:text-emerald-400">
              Verified Creator
            </span>
          </div>
        </div>
      </div>

      {/* Privacy Section */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-6 shadow-xs space-y-3">
        <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
          <Shield className="w-4 h-4 text-emerald-500" />
          <span>Privacy & Security</span>
        </h3>
        <div className="flex items-center justify-between py-2">
          <div>
            <p className="text-xs font-semibold text-slate-800 dark:text-slate-200">
              Public Portfolio Feed
            </p>
            <p className="text-[11px] text-slate-400">
              Allow non-logged-in visitors to view your creative posts
            </p>
          </div>
          <input
            type="checkbox"
            defaultChecked
            className="w-4 h-4 text-blue-600 rounded-sm"
          />
        </div>
      </div>
    </div>
  );
};

export default Settings;
