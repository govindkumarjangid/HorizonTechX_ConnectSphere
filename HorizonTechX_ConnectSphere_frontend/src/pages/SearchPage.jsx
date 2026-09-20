import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, User, FileText, Users } from 'lucide-react';
import { usePostStore } from '../store/usePostStore';
import { useUserStore } from '../store/useUserStore';
import { mockCommunities } from '../utils/mockData';
import PostCard from '../components/posts/PostCard';
import UserCard from '../components/users/UserCard';
import EmptyState from '../components/common/EmptyState';

export const SearchPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const [activeTab, setActiveTab] = useState('All');

  const { posts } = usePostStore();
  const { users, toggleFollow } = useUserStore();

  const [inputVal, setInputVal] = useState(query);

  const handleSearch = (e) => {
    e.preventDefault();
    setSearchParams({ q: inputVal });
  };

  // Matched Users
  const matchedUsers = users.filter((u) => {
    const q = query.toLowerCase();
    return (
      u.fullName.toLowerCase().includes(q) ||
      u.username.toLowerCase().includes(q) ||
      u.bio?.toLowerCase().includes(q)
    );
  });

  // Matched Posts
  const matchedPosts = posts.filter((p) => {
    const q = query.toLowerCase();
    return (
      p.content.toLowerCase().includes(q) ||
      p.author?.fullName.toLowerCase().includes(q) ||
      p.author?.username.toLowerCase().includes(q)
    );
  });

  // Matched Communities
  const matchedCommunities = mockCommunities.filter((c) => {
    const q = query.toLowerCase();
    return (
      c.name.toLowerCase().includes(q) ||
      c.category.toLowerCase().includes(q) ||
      c.description?.toLowerCase().includes(q)
    );
  });

  const tabs = ['All', 'People', 'Posts', 'Communities'];

  return (
    <div className="w-full space-y-5">
      {/* Search Header Form */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-5 shadow-xs">
        <form onSubmit={handleSearch} className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            placeholder="Search ConnectSphere..."
            className="w-full h-11 pl-11 pr-24 rounded-full bg-slate-100 dark:bg-slate-800 text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20"
          />
          <button
            type="submit"
            className="absolute right-1.5 top-1/2 -translate-y-1/2 px-4 py-1.5 text-xs font-semibold rounded-full bg-blue-600 text-white hover:bg-blue-700"
          >
            Search
          </button>
        </form>

        {/* Filter Tabs */}
        <div className="flex items-center gap-5 sm:gap-6 mt-3 pt-2 border-t border-slate-100 dark:border-slate-800/80 overflow-x-auto no-scrollbar">
          {tabs.map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              className={`text-xs sm:text-sm font-semibold py-2 min-h-[42px] flex items-center relative transition-colors cursor-pointer whitespace-nowrap ${
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

      {/* Query Banner */}
      {query && (
        <p className="text-xs text-slate-500 dark:text-slate-400 px-1">
          Showing results for <strong className="text-slate-900 dark:text-slate-100">"{query}"</strong>
        </p>
      )}

      {/* Tab: All */}
      {activeTab === 'All' && (
        <div className="space-y-6">
          {matchedUsers.length > 0 && (
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 mb-3 flex items-center gap-1.5">
                <User className="w-4 h-4 text-blue-500" />
                <span>People</span>
              </h3>
              <div className="space-y-2.5">
                {matchedUsers.slice(0, 3).map((u) => (
                  <UserCard key={u.id} user={u} onToggleFollow={toggleFollow} />
                ))}
              </div>
            </div>
          )}

          {matchedPosts.length > 0 && (
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 mb-3 flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-emerald-500" />
                <span>Posts</span>
              </h3>
              <div className="space-y-4">
                {matchedPosts.map((p) => (
                  <PostCard key={p.id} post={p} />
                ))}
              </div>
            </div>
          )}

          {matchedUsers.length === 0 && matchedPosts.length === 0 && (
            <EmptyState
              icon={Search}
              title="No results found"
              description={`We couldn't find anything matching "${query}". Try searching for another keyword or hashtag.`}
            />
          )}
        </div>
      )}

      {/* Tab: People */}
      {activeTab === 'People' && (
        <div className="space-y-2.5">
          {matchedUsers.length > 0 ? (
            matchedUsers.map((u) => (
              <UserCard key={u.id} user={u} onToggleFollow={toggleFollow} />
            ))
          ) : (
            <EmptyState
              icon={User}
              title="No people found"
              description="No user profiles matched your search term."
            />
          )}
        </div>
      )}

      {/* Tab: Posts */}
      {activeTab === 'Posts' && (
        <div className="space-y-4">
          {matchedPosts.length > 0 ? (
            matchedPosts.map((p) => <PostCard key={p.id} post={p} />)
          ) : (
            <EmptyState
              icon={FileText}
              title="No posts found"
              description="No posts matched your search term."
            />
          )}
        </div>
      )}

      {/* Tab: Communities */}
      {activeTab === 'Communities' && (
        <div className="space-y-3">
          {matchedCommunities.length > 0 ? (
            matchedCommunities.map((comm) => (
              <div
                key={comm.id}
                className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 flex items-center gap-3"
              >
                <img
                  src={comm.avatar}
                  alt={comm.name}
                  className="w-12 h-12 rounded-xl object-cover"
                />
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100 truncate">
                    {comm.name}
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {comm.membersCount} members · {comm.category}
                  </p>
                </div>
                <button className="px-4 py-1.5 text-xs font-semibold rounded-full bg-blue-600 text-white hover:bg-blue-700">
                  View
                </button>
              </div>
            ))
          ) : (
            <EmptyState
              icon={Users}
              title="No communities found"
              description="No communities matched your search term."
            />
          )}
        </div>
      )}
    </div>
  );
};

export default SearchPage;
