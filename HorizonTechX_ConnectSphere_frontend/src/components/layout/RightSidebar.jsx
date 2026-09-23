import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User } from 'lucide-react';
import useUserStore from '../../store/useUserStore';
import Avatar from '../users/Avatar';
import FollowButton from '../users/FollowButton';

export const RightSidebar = () => {
  const navigate = useNavigate();
  const suggestions = useUserStore((state) => state.suggestions);
  const isLoading = useUserStore((state) => state.isLoadingSuggestions);
  const fetchSuggestions = useUserStore((state) => state.fetchSuggestions);
  const toggleFollow = useUserStore((state) => state.toggleFollow);

  useEffect(() => {
    fetchSuggestions(5);
  }, [fetchSuggestions]);

  if (!isLoading && suggestions.length === 0) {
    return null;
  }

  return (
    <aside className="w-full space-y-4">
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-5 shadow-xs transition-colors">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
            <User className=" text-white bg-blue-500 p-1 rounded-full" />
            <span>Who to follow</span>
          </h3>
        </div>

        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center gap-2.5 animate-pulse">
                <div className="w-9 h-9 rounded-full bg-slate-200 dark:bg-slate-800" />
                <div className="flex-1 space-y-1.5">
                  <div className="w-24 h-3 bg-slate-200 dark:bg-slate-800 rounded-sm" />
                  <div className="w-16 h-2 bg-slate-100 dark:bg-slate-800/60 rounded-sm" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-3.5">
            {suggestions.map((u) => (
              <div key={u._id} className="flex items-center justify-between gap-2.5 group">
                <div
                  onClick={() => navigate(`/profile/${u.username}`)}
                  className="flex items-center gap-2.5 min-w-0 cursor-pointer flex-1"
                >
                  <Avatar src={u.avatar} alt={u.username} size="md" />
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate group-hover:text-blue-600 dark:group-hover:text-blue-400">
                      {u.fullName || `@${u.username}`}
                    </p>
                    <p className="text-[11px] text-slate-400 truncate">
                      @{u.username}
                    </p>
                  </div>
                </div>

                <FollowButton
                  isFollowing={u.isFollowing}
                  onToggle={() => toggleFollow(u._id, u.username)}
                  size="sm"
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </aside>
  );
};

export default RightSidebar;
