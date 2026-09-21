import React, { useEffect, useState, useRef, Suspense, lazy } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FileText, RefreshCw } from 'lucide-react';
import ProfileHeader from '../components/users/ProfileHeader';
import PostCard from '../components/posts/PostCard';

const EditProfile = lazy(() => import('./EditProfile'));
const FollowListModal = lazy(() => import('../components/users/FollowListModal'));
import { ProfileSkeleton, PostSkeleton } from '../components/common/Loader';
import EmptyState from '../components/common/EmptyState';
import useAuthStore from '../store/useAuthStore';
import useUserStore from '../store/useUserStore';

export const Profile = () => {
  const { username: routeUsername } = useParams();
  const navigate = useNavigate();
  const authUser = useAuthStore((state) => state.user);

  const targetUsername = routeUsername || authUser?.username;
  const isCurrentUser =
    !routeUsername ||
    routeUsername.toLowerCase() === authUser?.username?.toLowerCase();

  const profile = useUserStore((state) => state.profile);
  const userPosts = useUserStore((state) => state.userPosts);
  const isLoadingProfile = useUserStore((state) => state.isLoadingProfile);
  const isLoadingPosts = useUserStore((state) => state.isLoadingPosts);
  const error = useUserStore((state) => state.error);
  const fetchProfile = useUserStore((state) => state.fetchProfile);
  const fetchUserPosts = useUserStore((state) => state.fetchUserPosts);
  const toggleFollow = useUserStore((state) => state.toggleFollow);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [followModalType, setFollowModalType] = useState(null); // 'followers' | 'following' | null
  const postsRef = useRef(null);

  useEffect(() => {
    if (targetUsername) {
      fetchProfile(targetUsername);
      fetchUserPosts(targetUsername);
    }
  }, [targetUsername, fetchProfile, fetchUserPosts]);

  const handleToggleFollow = async () => {
    if (!profile) return;
    await toggleFollow(profile._id, profile.username);
  };

  const handlePostDeleted = (_postId) => {
    if (targetUsername) {
      fetchUserPosts(targetUsername);
    }
  };

  const handlePostsClick = () => {
    postsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  if (isLoadingProfile && !profile) {
    return (
      <div className="w-full space-y-4">
        <ProfileSkeleton />
        <PostSkeleton />
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="p-8 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 text-center space-y-3">
        <p className="text-sm text-rose-500">{error || 'User not found'}</p>
        <button
          type="button"
          onClick={() => targetUsername && fetchProfile(targetUsername)}
          className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition-colors cursor-pointer"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Try Again</span>
        </button>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Profile Header */}
      <ProfileHeader
        user={profile}
        isCurrentUser={isCurrentUser}
        onEditProfile={() => setIsEditModalOpen(true)}
        onToggleFollow={handleToggleFollow}
        onPostsClick={handlePostsClick}
        onFollowersClick={() => setFollowModalType('followers')}
        onFollowingClick={() => setFollowModalType('following')}
      />

      {/* User's Posts */}
      <div ref={postsRef} className="space-y-4 scroll-mt-4">
        {isLoadingPosts ? (
          <PostSkeleton />
        ) : userPosts.length > 0 ? (
          userPosts.map((post) => (
            <PostCard
              key={post._id}
              post={post}
              onDelete={handlePostDeleted}
            />
          ))
        ) : (
          <EmptyState
            icon={FileText}
            title="No posts published yet"
            description="When this user publishes posts, they will appear here."
          />
        )}
      </div>

      {/* Lazy-loaded Modals */}
      <Suspense fallback={null}>
        {isCurrentUser && isEditModalOpen && (
          <EditProfile
            isOpen={isEditModalOpen}
            onClose={() => setIsEditModalOpen(false)}
            onProfileUpdated={(updatedUser) => {
              if (updatedUser?.username && updatedUser.username.toLowerCase() !== (targetUsername || '').toLowerCase()) {
                navigate(`/profile/${updatedUser.username}`, { replace: true });
              } else if (targetUsername) {
                fetchProfile(targetUsername);
              }
            }}
          />
        )}

        {followModalType && (
          <FollowListModal
            isOpen={!!followModalType}
            onClose={() => setFollowModalType(null)}
            username={targetUsername}
            type={followModalType || 'followers'}
          />
        )}
      </Suspense>
    </div>
  );
};

export default Profile;