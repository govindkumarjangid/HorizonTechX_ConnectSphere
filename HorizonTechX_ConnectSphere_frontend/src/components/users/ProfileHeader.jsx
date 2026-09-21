import React from 'react';
import { Edit3 } from 'lucide-react';
import Avatar from './Avatar';
import FollowButton from './FollowButton';

export const ProfileHeader = ({
  user,
  isCurrentUser = false,
  onEditProfile,
  onToggleFollow,
  onPostsClick,
  onFollowersClick,
  onFollowingClick,
}) => {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 overflow-hidden shadow-xs mb-5 transition-colors">
      {/* Cover Banner */}
      <div className="h-28 sm:h-36 w-full bg-gradient-to-r from-blue-600 via-indigo-600 to-sky-500" />

      {/* Main Profile Info */}
      <div className="px-4 sm:px-6 pb-5 relative">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-4 gap-3">
          {/* Avatar overlapping banner — tightly circular, border hugs the image */}
          <div className="-mt-12 sm:-mt-14 relative z-10 flex-shrink-0">
            <div className="rounded-full border-4 border-white dark:border-slate-900 shadow-md w-20 h-20 sm:w-24 sm:h-24 overflow-hidden flex items-center justify-center bg-slate-200 dark:bg-slate-700">
              {user?.avatar ? (
                <img
                  src={user.avatar}
                  alt={user?.username}
                  className="w-full h-full object-cover rounded-full"
                  loading="lazy"
                />
              ) : (
                <span className="text-xl sm:text-2xl font-bold text-slate-600 dark:text-slate-300 select-none">
                  {(user?.fullName || user?.username || 'U')
                    .split(' ')
                    .map((n) => n[0])
                    .slice(0, 2)
                    .join('')
                    .toUpperCase()}
                </span>
              )}
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2 pt-1 sm:pt-0">
            {isCurrentUser ? (
              <button
                type="button"
                onClick={onEditProfile}
                className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-full border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 transition-colors cursor-pointer"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Edit Profile</span>
              </button>
            ) : (
              <FollowButton
                isFollowing={user?.isFollowing}
                onToggle={onToggleFollow}
                size="md"
              />
            )}
          </div>
        </div>

        {/* Name, Username & Bio */}
        <div className="space-y-1 mb-4">
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">
            {user?.fullName || `@${user?.username}`}
          </h2>
          {user?.fullName && (
            <p className="text-xs text-slate-400 font-medium">
              @{user?.username}
            </p>
          )}
          {user?.bio && (
            <p className="text-sm text-slate-700 dark:text-slate-300 max-w-2xl leading-relaxed pt-1">
              {user.bio}
            </p>
          )}
        </div>

        {/* Clickable Stats: Posts / Followers / Following */}
        <div className="flex items-center gap-6 text-sm pt-3 border-t border-slate-100 dark:border-slate-800/80">
          <button
            type="button"
            onClick={onPostsClick}
            className="group text-left cursor-pointer hover:opacity-80 transition-opacity"
          >
            <strong className="text-slate-900 dark:text-slate-100 font-bold group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
              {user?.postsCount || 0}
            </strong>{' '}
            <span className="text-slate-500 dark:text-slate-400 text-xs">Posts</span>
          </button>

          <button
            type="button"
            onClick={onFollowersClick}
            className="group text-left cursor-pointer hover:opacity-80 transition-opacity"
          >
            <strong className="text-slate-900 dark:text-slate-100 font-bold group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
              {user?.followersCount || 0}
            </strong>{' '}
            <span className="text-slate-500 dark:text-slate-400 text-xs">Followers</span>
          </button>

          <button
            type="button"
            onClick={onFollowingClick}
            className="group text-left cursor-pointer hover:opacity-80 transition-opacity"
          >
            <strong className="text-slate-900 dark:text-slate-100 font-bold group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
              {user?.followingCount || 0}
            </strong>{' '}
            <span className="text-slate-500 dark:text-slate-400 text-xs">Following</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;