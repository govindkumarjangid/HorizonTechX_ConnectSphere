import React from 'react';
import { Compass } from 'lucide-react';

export const EmptyState = ({
  icon: Icon = Compass,
  title = 'No items yet',
  description = 'When new updates arrive, they will appear here.',
  actionLabel,
  onAction,
}) => {
  return (
    <div className="flex flex-col items-center justify-center text-center p-8 bg-white dark:bg-slate-900/60 border border-slate-200/70 dark:border-slate-800/80 rounded-2xl my-4">
      <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 dark:text-slate-500 mb-3">
        <Icon className="w-6 h-6 stroke-[1.75]" />
      </div>
      <h4 className="text-base font-semibold text-slate-800 dark:text-slate-200 mb-1">
        {title}
      </h4>
      <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm mb-4">
        {description}
      </p>
      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="px-4 py-2 text-sm font-medium rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition-colors shadow-xs shadow-blue-500/10"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
};

export default EmptyState;