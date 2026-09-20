import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Bell,
  Heart,
  MessageCircle,
  UserPlus,
  AtSign,
  Sparkles,
  Check,
} from 'lucide-react';
import Avatar from '../components/users/Avatar';
import EmptyState from '../components/common/EmptyState';
import { mockNotifications } from '../utils/mockData';

export const Notifications = () => {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState(mockNotifications);
  const [activeTab, setActiveTab] = useState('All');

  const tabs = ['All', 'Mentions', 'Likes', 'Comments', 'Follows'];

  const markAllAsRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, read: true })));
  };

  const filteredNotifications = notifications.filter((n) => {
    if (activeTab === 'All') return true;
    if (activeTab === 'Mentions') return n.type === 'mention';
    if (activeTab === 'Likes') return n.type === 'like';
    if (activeTab === 'Comments') return n.type === 'comment';
    if (activeTab === 'Follows') return n.type === 'follow';
    return true;
  });

  const getIcon = (type) => {
    switch (type) {
      case 'like':
        return <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />;
      case 'comment':
        return <MessageCircle className="w-3.5 h-3.5 text-blue-500 fill-blue-500" />;
      case 'follow':
        return <UserPlus className="w-3.5 h-3.5 text-indigo-500" />;
      case 'mention':
        return <AtSign className="w-3.5 h-3.5 text-purple-500" />;
      default:
        return <Sparkles className="w-3.5 h-3.5 text-amber-500" />;
    }
  };

  return (
    <div className="w-full space-y-4">
      {/* Header Card */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-5 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">
              Notification Center
            </h2>
          </div>
          <button
            onClick={markAllAsRead}
            className="flex items-center gap-1.5 text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
          >
            <Check className="w-3.5 h-3.5" />
            <span>Mark all as read</span>
          </button>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-5 sm:gap-6 pt-1 border-t border-slate-100 dark:border-slate-800/80 overflow-x-auto no-scrollbar">
          {tabs.map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              className={`text-xs sm:text-sm font-semibold py-2.5 min-h-[42px] flex items-center relative transition-colors cursor-pointer whitespace-nowrap ${
                activeTab === tab
                  ? 'text-blue-600 dark:text-blue-400'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              <span>{tab}</span>
              {activeTab === tab && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 dark:bg-blue-400 rounded-full" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Notifications List */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs divide-y divide-slate-100 dark:divide-slate-800/60 overflow-hidden">
        {filteredNotifications.length > 0 ? (
          filteredNotifications.map((n) => (
            <div
              key={n.id}
              onClick={() => {
                if (n.user?.username) navigate(`/profile/${n.user.username}`);
              }}
              className={`p-4 flex items-start gap-3.5 cursor-pointer transition-colors ${
                !n.read
                  ? 'bg-blue-50/40 dark:bg-blue-950/20 hover:bg-blue-50/70 dark:hover:bg-blue-950/40'
                  : 'hover:bg-slate-50 dark:hover:bg-slate-800/50'
              }`}
            >
              <div className="relative">
                <Avatar src={n.user?.avatar} alt={n.user?.fullName} size="md" />
                <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-white dark:bg-slate-900 shadow-xs flex items-center justify-center">
                  {getIcon(n.type)}
                </div>
              </div>

              <div className="flex-1 min-w-0">
                <p className="text-xs sm:text-sm text-slate-800 dark:text-slate-200">
                  <strong className="font-semibold text-slate-900 dark:text-white">
                    {n.user?.fullName}
                  </strong>{' '}
                  {n.text}
                </p>
                <span className="text-[11px] text-slate-400 mt-1 inline-block">
                  {n.timestamp}
                </span>
              </div>

              {!n.read && (
                <span className="w-2.5 h-2.5 rounded-full bg-blue-600 flex-shrink-0 mt-1.5" />
              )}
            </div>
          ))
        ) : (
          <div className="p-8">
            <EmptyState
              icon={Bell}
              title="All caught up"
              description="You have no notifications in this category."
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Notifications;
