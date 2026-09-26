import React from 'react';
import { Edit3, Globe, ExternalLink } from 'lucide-react';
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
    <div className="bg-white dark:bg-slate-900 rounded-2xl sm:rounded-3xl border border-slate-200/80 dark:border-slate-800 overflow-hidden shadow-xs mb-3 sm:mb-5 transition-colors">
      {/* Cover Banner */}
      <div className="h-24 sm:h-36 w-full bg-linear-to-r from-blue-600 via-indigo-600 to-sky-500" />

      {/* Main Profile Info */}
      <div className="px-3.5 sm:px-6 pb-3.5 sm:pb-5 relative">
        <div className="flex items-end justify-between mb-3.5 sm:mb-4 gap-3">
          {/* Avatar overlapping banner — tightly circular, border directly hugs the image */}
          <div className="-mt-10 sm:-mt-14 relative z-10 shrink-0">
            {user?.avatar ? (
              <img
                src={user.avatar}
                alt={user?.username}
                className="w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover border-4 border-white dark:border-slate-900 shadow-md block"
                loading="lazy"
              />
            ) : (
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full border-4 border-white dark:border-slate-900 shadow-md bg-slate-200 dark:bg-slate-700 flex items-center justify-center">
                <span className="text-xl sm:text-2xl font-bold text-slate-600 dark:text-slate-300 select-none">
                  {(user?.fullName || user?.username || 'U')
                    .split(' ')
                    .map((n) => n[0])
                    .slice(0, 2)
                    .join('')
                    .toUpperCase()}
                </span>
              </div>
            )}
          </div>

          {/* Action buttons (aligned to the right) */}
          <div className="flex items-center gap-2 pb-1 sm:pb-0 shrink-0">
            {isCurrentUser ? (
              <button
                type="button"
                onClick={onEditProfile}
                className="flex items-center gap-1.5 px-3.5 sm:px-4 py-1.5 sm:py-2 text-xs font-semibold rounded-full border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 transition-colors cursor-pointer"
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
          {user?.website && (
            <div className="pt-1 flex items-center gap-1.5 text-xs">
              <Globe className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 shrink-0" />
              <a
                href={
                  user.website.startsWith('http://') || user.website.startsWith('https://')
                    ? user.website
                    : `https://${user.website}`
                }
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 dark:text-blue-400 hover:underline font-medium break-all flex items-center gap-1 group/link"
              >
                <span>{user.website.replace(/^https?:\/\//, '')}</span>
                <ExternalLink className="w-3 h-3 opacity-60 group-hover/link:opacity-100 transition-opacity shrink-0" />
              </a>
            </div>
          )}
        </div>

        {/* Clickable Stats: Posts / Followers / Following */}
        <div className="flex items-center gap-4 sm:gap-6 text-xs sm:text-sm pt-2.5 sm:pt-3 border-t border-slate-100 dark:border-slate-800/80">
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