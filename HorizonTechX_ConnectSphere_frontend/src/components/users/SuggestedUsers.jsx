import React from 'react';
import { Sparkles } from 'lucide-react';
import UserCard from './UserCard';
import { useUserStore } from '../../store/useUserStore';

export const SuggestedUsers = ({ limit = 6 }) => {
  const { users, toggleFollow } = useUserStore();

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 mb-2">
        <Sparkles className="w-4 h-4 text-amber-500" />
        <h3 className="font-semibold text-sm text-slate-900 dark:text-slate-100">
          Suggested for you
        </h3>
      </div>
      <div className="space-y-2.5">
        {users.slice(0, limit).map((u) => (
          <UserCard key={u.id} user={u} onToggleFollow={toggleFollow} />
        ))}
      </div>
    </div>
  );
};

export default SuggestedUsers;