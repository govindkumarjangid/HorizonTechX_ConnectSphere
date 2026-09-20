import React, { useState } from 'react';
import { Users, Plus, Check, Search, Globe } from 'lucide-react';
import { mockCommunities } from '../utils/mockData';
import EmptyState from '../components/common/EmptyState';

export const Communities = () => {
  const [communities, setCommunities] = useState(mockCommunities);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');

  const categories = ['All', 'Art & Culture', 'Traditional Art', 'Digital Art', 'Marketplace'];

  const toggleJoin = (id) => {
    setCommunities((prev) =>
      prev.map((c) =>
        c.id === id ? { ...c, isJoined: !c.isJoined } : c
      )
    );
  };

  const filteredCommunities = communities.filter((c) => {
    const matchesCat = activeFilter === 'All' || c.category === activeFilter;
    const matchesSearch =
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="w-full space-y-5">
      {/* Header Card */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-5 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <Users className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              <span>Communities & Guilds</span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Join focused spaces to share crafts, techniques, and critique
            </p>
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search communities..."
              className="w-full h-9 pl-9 pr-3 rounded-full bg-slate-100 dark:bg-slate-800 text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20"
            />
          </div>
        </div>

        {/* Categories Bar */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pt-2 border-t border-slate-100 dark:border-slate-800">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveFilter(cat)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors ${
                activeFilter === cat
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Communities Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {filteredCommunities.length > 0 ? (
          filteredCommunities.map((comm) => (
            <div
              key={comm.id}
              className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-5 shadow-xs flex flex-col justify-between hover:border-slate-300 dark:hover:border-slate-700 transition-colors"
            >
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <img
                    src={comm.avatar}
                    alt={comm.name}
                    className="w-12 h-12 rounded-xl object-cover ring-1 ring-black/5 dark:ring-white/10"
                  />
                  <div className="min-w-0 flex-1">
                    <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100 truncate">
                      {comm.name}
                    </h3>
                    <p className="text-xs text-blue-600 dark:text-blue-400 font-medium">
                      {comm.category}
                    </p>
                  </div>
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed line-clamp-2 mb-3">
                  {comm.description}
                </p>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800">
                <span className="text-xs text-slate-400 font-medium">
                  {comm.membersCount} members
                </span>

                <button
                  onClick={() => toggleJoin(comm.id)}
                  className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                    comm.isJoined
                      ? 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-950/40 dark:hover:text-rose-400'
                      : 'bg-blue-600 text-white hover:bg-blue-700 shadow-xs shadow-blue-500/20'
                  }`}
                >
                  {comm.isJoined ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>Joined</span>
                    </>
                  ) : (
                    <>
                      <Plus className="w-3.5 h-3.5" />
                      <span>Join</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full">
            <EmptyState
              icon={Globe}
              title="No communities found"
              description="Try adjusting your search query or exploring other categories."
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Communities;
