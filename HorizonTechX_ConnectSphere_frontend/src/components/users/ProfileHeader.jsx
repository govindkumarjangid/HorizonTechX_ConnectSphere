import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  MapPin,
  Link as LinkIcon,
  Calendar,
  CheckCircle,
  Edit3,
  Share2,
} from 'lucide-react';
import Avatar from './Avatar';
import FollowButton from './FollowButton';

gsap.registerPlugin(ScrollTrigger);

export const ProfileHeader = ({
  user,
  isCurrentUser = false,
  onEditProfile,
  onToggleFollow,
  activeTab,
  onTabChange,
  tabs = ['Posts', 'Media', 'Likes', 'About'],
}) => {
  const coverRef = useRef(null);

  // Subtle GSAP scroll parallax on the cover photo (desktop only)
  useEffect(() => {
    if (!coverRef.current) return;
    if (typeof window !== 'undefined' && window.innerWidth < 768) return;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      gsap.to(coverRef.current, {
        y: 28,
        ease: 'none',
        scrollTrigger: {
          trigger: coverRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: true,
        },
      });
    });

    return () => ctx.revert();
  }, []);

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 overflow-hidden shadow-xs mb-5 transition-colors">
      {/* Cover Banner with responsive height */}
      <div className="relative h-32 xs:h-36 sm:h-44 md:h-52 w-full overflow-hidden bg-gradient-to-r from-blue-600 via-indigo-700 to-slate-900">
        {user?.coverPhoto && (
          <img
            ref={coverRef}
            src={user.coverPhoto}
            alt="Cover"
            className="w-full h-[120%] object-cover -mt-1 sm:-mt-2"
          />
        )}
      </div>

      {/* Main Profile Info Section */}
      <div className="px-4 sm:px-6 pb-4 relative z-10">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-4 gap-3">
          {/* Avatar cleanly overlapping cover banner */}
          <div className="-mt-12 sm:-mt-16 relative z-20 flex-shrink-0">
            <Avatar
              src={user?.avatar}
              alt={user?.fullName}
              size="2xl"
              className="ring-4 ring-white dark:ring-slate-900 shadow-md w-20 h-20 sm:w-28 sm:h-28"
            />
          </div>

          {/* Action buttons safely below cover banner */}
          <div className="flex items-center gap-2 pt-1 sm:pt-0 sm:mb-1 relative z-20 w-full sm:w-auto">
            {isCurrentUser ? (
              <button
                type="button"
                onClick={onEditProfile}
                className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-full border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 transition-colors cursor-pointer min-h-[38px]"
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
            <button
              type="button"
              onClick={() => {
                navigator.clipboard?.writeText(window.location.href);
              }}
              className="p-2.5 rounded-full border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 transition-colors cursor-pointer flex-shrink-0"
              title="Share profile"
              aria-label="Share profile"
            >
              <Share2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Name & Bio */}
        <div className="space-y-1.5 mb-4">
          <div className="flex items-center gap-1.5">
            <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">
              {user?.fullName}
            </h2>
            {user?.isVerified && (
              <CheckCircle className="w-4 h-4 text-blue-500 fill-blue-500 flex-shrink-0" />
            )}
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
            @{user?.username}
          </p>
          {user?.title && (
            <p className="text-xs text-blue-600 dark:text-blue-400 font-medium">
              {user?.title}
            </p>
          )}
          {user?.bio && (
            <p className="text-sm text-slate-700 dark:text-slate-300 max-w-2xl pt-1 leading-relaxed">
              {user?.bio}
            </p>
          )}
        </div>

        {/* Metadata items */}
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-slate-500 dark:text-slate-400 mb-4">
          {user?.location && (
            <div className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-slate-400" />
              <span>{user.location}</span>
            </div>
          )}
          {user?.website && (
            <div className="flex items-center gap-1">
              <LinkIcon className="w-3.5 h-3.5 text-slate-400" />
              <a
                href={user.website}
                target="_blank"
                rel="noreferrer"
                className="text-blue-600 dark:text-blue-400 hover:underline"
              >
                {user.website.replace(/^https?:\/\//, '')}
              </a>
            </div>
          )}
          <div className="flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
            <span>Joined March 2024</span>
          </div>
        </div>

        {/* Followers / Following counts */}
        <div className="flex items-center gap-5 text-sm py-2 border-t border-slate-100 dark:border-slate-800/80">
          <div>
            <strong className="text-slate-900 dark:text-slate-100 font-bold">
              {user?.followingCount || 0}
            </strong>{' '}
            <span className="text-slate-500 dark:text-slate-400 text-xs">Following</span>
          </div>
          <div>
            <strong className="text-slate-900 dark:text-slate-100 font-bold">
              {user?.followersCount ? (user.followersCount > 999 ? `${(user.followersCount / 1000).toFixed(1)}k` : user.followersCount) : 0}
            </strong>{' '}
            <span className="text-slate-500 dark:text-slate-400 text-xs">Followers</span>
          </div>
          <div>
            <strong className="text-slate-900 dark:text-slate-100 font-bold">
              {user?.postsCount || 0}
            </strong>{' '}
            <span className="text-slate-500 dark:text-slate-400 text-xs">Posts</span>
          </div>
        </div>
      </div>

      {/* Profile Navigation Tabs */}
      <div className="flex items-center gap-5 sm:gap-6 px-4 sm:px-6 border-t border-slate-100 dark:border-slate-800/80 overflow-x-auto no-scrollbar">
        {tabs.map((tab) => {
          const isActive = activeTab === tab;
          return (
            <button
              key={tab}
              type="button"
              onClick={() => onTabChange?.(tab)}
              className={`py-3 sm:py-3.5 min-h-[44px] flex items-center text-xs sm:text-sm font-semibold relative transition-colors cursor-pointer whitespace-nowrap ${
                isActive
                  ? 'text-blue-600 dark:text-blue-400'
                  : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
              }`}
            >
              <span>{tab}</span>
              {isActive && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 dark:bg-blue-400 rounded-full" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default ProfileHeader;