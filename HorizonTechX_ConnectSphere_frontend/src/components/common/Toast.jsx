import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, AlertCircle, Info, Heart, MessageCircle, UserPlus, X } from 'lucide-react';
import useToastStore from '../../store/useToastStore';
import Avatar from '../users/Avatar';

export const Toast = () => {
  const { toasts, removeToast } = useToastStore();

  const renderToastContent = (toast) => {
    const { type, message, title, fromUser } = toast;

    if (type === 'notification') {
      const getNotifDetails = () => {
        switch (title) {
          case 'like':
            return {
              icon: <Heart className="w-4 h-4 text-rose-500 fill-rose-500" />,
              text: (
                <span>
                  <strong className="font-semibold">@{fromUser?.username}</strong> liked your post
                </span>
              ),
            };
          case 'comment':
            return {
              icon: <MessageCircle className="w-4 h-4 text-blue-500 fill-blue-500" />,
              text: (
                <span>
                  <strong className="font-semibold">@{fromUser?.username}</strong> commented on your post
                </span>
              ),
            };
          case 'follow':
            return {
              icon: <UserPlus className="w-4 h-4 text-indigo-500" />,
              text: (
                <span>
                  <strong className="font-semibold">@{fromUser?.username}</strong> started following you
                </span>
              ),
            };
          default:
            return {
              icon: <Info className="w-4 h-4 text-blue-500" />,
              text: <span>{message || 'New notification'}</span>,
            };
        }
      };

      const { icon, text } = getNotifDetails();

      return (
        <>
          <Avatar src={fromUser?.avatar} alt={fromUser?.username} size="sm" />
          <div className="flex-1 min-w-0 flex items-center gap-2">
            <div className="shrink-0">{icon}</div>
            <div className="text-xs sm:text-sm text-slate-800 dark:text-slate-100 wrap-break-words leading-snug">{text}</div>
          </div>
        </>
      );
    }

    let Icon = Info;
    let iconClass = 'text-blue-500';

    if (type === 'success') {
      Icon = CheckCircle2;
      iconClass = 'text-emerald-500';
    } else if (type === 'error') {
      Icon = AlertCircle;
      iconClass = 'text-rose-500';
    }

    return (
      <div className="flex-1 min-w-0 flex items-start gap-2.5">
        <Icon className={`w-4 h-4 shrink-0 mt-0.5 ${iconClass}`} />
        <div className="text-xs sm:text-sm font-medium text-slate-800 dark:text-slate-100 wrap-break-words leading-snug">
          {message}
        </div>
      </div>
    );
  };

  return (
    <div className="fixed bottom-20 sm:bottom-5 right-3 sm:right-5 left-3 sm:left-auto z-50 flex flex-col gap-2.5 max-w-sm sm:max-w-md pointer-events-none">
      <AnimatePresence mode="popLayout">
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            layout
            initial={{ opacity: 0, y: 16, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.92, transition: { duration: 0.15 } }}
            transition={{ duration: 0.18, ease: 'easeOut' }}
            className="pointer-events-auto flex items-start gap-3 px-4 py-3 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md rounded-2xl shadow-xl border border-slate-200/80 dark:border-slate-800 text-slate-900 dark:text-slate-100"
          >
            {renderToastContent(toast)}
            <button
              type="button"
              onClick={() => removeToast(toast.id)}
              className="p-1 -mr-1 -mt-0.5 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer shrink-0"
              aria-label="Dismiss toast"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default Toast;
