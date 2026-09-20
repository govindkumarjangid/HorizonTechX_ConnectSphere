import React, { useState } from 'react';
import { Users, Search } from 'lucide-react';
import { useUserStore } from '../store/useUserStore';
import UserCard from '../components/users/UserCard';
import EmptyState from '../components/common/EmptyState';

export const Connections = () => {
  const { users, toggleFollow } = useUserStore();
  const [activeTab, setActiveTab] = useState('Following');
  const [filterQuery, setFilterQuery] = useState('');

  const followingUsers = users.filter((u) => u.isFollowing);
  const followerUsers = users.filter((_, idx) => idx % 2 === 0); // mock followers
  const suggestedUsers = users.filter((u) => !u.isFollowing);

  const getActiveList = () => {
    let list =
      activeTab === 'Following'
        ? followingUsers
        : activeTab === 'Followers'
        ? followerUsers
        : suggestedUsers;

    if (filterQuery.trim()) {
      const q = filterQuery.toLowerCase();
      return list.filter(
        (u) =>
          u.fullName.toLowerCase().includes(q) ||
          u.username.toLowerCase().includes(q)
      );
    }
    return list;
  };

  const listToRender = getActiveList();

  return (
    <div className="w-full space-y-5">
      {/* Header card with tabs and search */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-5 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <Users className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              <span>Your Network</span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Manage your connections, creators, and collaborators
            </p>
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={filterQuery}
              onChange={(e) => setFilterQuery(e.target.value)}
              placeholder="Filter connections..."
              className="w-full h-9 pl-9 pr-3 rounded-full bg-slate-100 dark:bg-slate-800 text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20"
            />
          </div>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-5 sm:gap-6 pt-1 border-t border-slate-100 dark:border-slate-800/80 overflow-x-auto no-scrollbar">
          {[
            { id: 'Following', label: `Following (${followingUsers.length})` },
            { id: 'Followers', label: `Followers (${followerUsers.length})` },
            { id: 'Suggested', label: `Discover (${suggestedUsers.length})` },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`text-xs sm:text-sm font-semibold py-2 min-h-[42px] flex items-center relative transition-colors cursor-pointer whitespace-nowrap ${
                activeTab === tab.id
                  ? 'text-blue-600 dark:text-blue-400'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              <span>{tab.label}</span>
              {activeTab === tab.id && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 dark:bg-blue-400 rounded-full" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* User cards list */}
      <div className="space-y-3">
        {listToRender.length > 0 ? (
          listToRender.map((u) => (
            <UserCard key={u.id} user={u} onToggleFollow={toggleFollow} />
          ))
        ) : (
          <EmptyState
            icon={Users}
            title="No connections found"
            description="Try exploring suggested accounts or modifying your search filter."
          />
        )}
      </div>
    </div>
  );
};

export default Connections;
