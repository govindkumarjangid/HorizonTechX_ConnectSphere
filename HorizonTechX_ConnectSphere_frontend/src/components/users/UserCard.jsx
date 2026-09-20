import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';
import Avatar from './Avatar';
import FollowButton from './FollowButton';

export const UserCard = ({ user, onToggleFollow }) => {
  const navigate = useNavigate();

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-3 sm:p-4 shadow-xs flex items-center justify-between gap-2.5 sm:gap-3 hover:border-slate-300 dark:hover:border-slate-700 transition-colors">
      <div
        onClick={() => navigate(`/profile/${user.username}`)}
        className="flex items-center gap-2.5 sm:gap-3 min-w-0 cursor-pointer flex-1"
      >
        <Avatar src={user.avatar} alt={user.fullName} size="md" />
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5">
            <span className="text-sm font-semibold text-slate-900 dark:text-slate-100 truncate hover:text-blue-600 dark:hover:text-blue-400">
              {user.fullName}
            </span>
            {user.isVerified && (
              <CheckCircle className="w-3.5 h-3.5 text-blue-500 fill-blue-500 flex-shrink-0" />
            )}
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
            @{user.username}
          </p>
          {user.bio && (
            <p className="text-xs text-slate-600 dark:text-slate-300 truncate mt-1">
              {user.bio}
            </p>
          )}
        </div>
      </div>

      <FollowButton
        isFollowing={user.isFollowing}
        onToggle={() => onToggleFollow?.(user.id)}
        size="sm"
      />
    </div>
  );
};

export default UserCard;