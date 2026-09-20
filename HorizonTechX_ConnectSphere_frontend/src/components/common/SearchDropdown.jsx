import React from 'react';
import { motion } from 'framer-motion';
import { Search, MapPin, Building, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Avatar from '../users/Avatar';

export const SearchDropdown = ({
  query,
  results = [],
  isOpen,
  onClose,
}) => {
  const navigate = useNavigate();

  if (!isOpen || !query) return null;

  const handleSearchSubmit = (searchVal) => {
    onClose?.();
    navigate(`/search?q=${encodeURIComponent(searchVal || query)}`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 6, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 6, scale: 0.98 }}
      transition={{ duration: 0.15 }}
      className="absolute left-0 right-0 top-full mt-2 w-full max-w-full sm:max-w-md bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200/80 dark:border-slate-800 py-2 z-50 overflow-hidden"
    >
      <div className="max-h-[380px] overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800/60">
        {results.length > 0 ? (
          <div className="py-1">
            {results.map((item, idx) => {
              if (item.type === 'user') {
                return (
                  <div
                    key={`res_${idx}`}
                    onClick={() => {
                      onClose?.();
                      navigate(`/profile/${item.username}`);
                    }}
                    className="flex items-center gap-3 px-4 py-2.5 hover:bg-slate-50 dark:hover:bg-slate-800/60 cursor-pointer transition-colors"
                  >
                    <Avatar src={item.avatar} alt={item.title} size="md" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-slate-900 dark:text-slate-100 truncate">
                        {item.title}
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                        @{item.subtitle}
                      </p>
                    </div>
                  </div>
                );
              }

              if (item.type === 'company' || item.type === 'page') {
                return (
                  <div
                    key={`res_${idx}`}
                    onClick={() => {
                      onClose?.();
                      navigate(`/search?q=${encodeURIComponent(item.title)}`);
                    }}
                    className="flex items-center gap-3 px-4 py-2.5 hover:bg-slate-50 dark:hover:bg-slate-800/60 cursor-pointer transition-colors"
                  >
                    <div className="w-10 h-10 rounded-full bg-slate-900 text-white dark:bg-slate-800 flex items-center justify-center flex-shrink-0">
                      <Building className="w-5 h-5 text-slate-200" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-slate-900 dark:text-slate-100 truncate">
                        {item.title}
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                        {item.subtitle}
                      </p>
                    </div>
                  </div>
                );
              }

              if (item.type === 'location') {
                return (
                  <div
                    key={`res_${idx}`}
                    onClick={() => {
                      onClose?.();
                      navigate(`/search?q=${encodeURIComponent(item.title)}`);
                    }}
                    className="flex items-center gap-3 px-4 py-2.5 hover:bg-slate-50 dark:hover:bg-slate-800/60 cursor-pointer transition-colors"
                  >
                    <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center flex-shrink-0 text-slate-600 dark:text-slate-400">
                      <MapPin className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-slate-900 dark:text-slate-100 truncate">
                        {item.title}
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                        {item.subtitle}
                      </p>
                    </div>
                  </div>
                );
              }

              return null;
            })}
          </div>
        ) : (
          <div className="p-4 text-center text-xs text-slate-500 dark:text-slate-400">
            No instant matches found
          </div>
        )}

        {/* Action item at bottom: Search for query */}
        <div className="p-1.5 bg-slate-50/50 dark:bg-slate-800/30">
          <button
            onClick={() => handleSearchSubmit(query)}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-left hover:bg-blue-50/80 dark:hover:bg-blue-950/40 text-blue-600 dark:text-blue-400 transition-colors group cursor-pointer"
          >
            <div className="w-9 h-9 rounded-full bg-blue-600 text-white flex items-center justify-center flex-shrink-0 shadow-sm shadow-blue-500/20 group-hover:scale-105 transition-transform">
              <Search className="w-4 h-4 stroke-[2.5]" />
            </div>
            <span className="text-sm font-medium flex-1 truncate">
              Search for <strong className="font-semibold text-slate-900 dark:text-slate-100">"{query}"</strong>
            </span>
            <ArrowRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default SearchDropdown;
