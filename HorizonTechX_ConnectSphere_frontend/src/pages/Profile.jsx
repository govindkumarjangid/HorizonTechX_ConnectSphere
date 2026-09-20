import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import ProfileHeader from '../components/users/ProfileHeader';
import PostCard from '../components/posts/PostCard';
import EditProfile from './EditProfile';
import EmptyState from '../components/common/EmptyState';
import { useAuth } from '../store/useAuthStore';
import { usePostStore } from '../store/usePostStore';
import { useUserStore } from '../store/useUserStore';
import { ImageIcon, Heart, FileText } from 'lucide-react';

export const Profile = () => {
  const { username } = useParams();
  const { user: authUser } = useAuth();
  const { posts } = usePostStore();
  const { getUserByUsername, toggleFollow } = useUserStore();

  const [activeTab, setActiveTab] = useState('Posts');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // Check if viewing authenticated user or another profile
  const isCurrentUser = !username || username === authUser?.username;
  const targetUser = isCurrentUser
    ? authUser
    : getUserByUsername(username) || {
        fullName: username,
        username: username,
        bio: 'ConnectSphere Community Member',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
        followersCount: 120,
        followingCount: 84,
        postsCount: 1,
        isVerified: false,
      };

  // Filter posts
  const userPosts = posts.filter(
    (p) =>
      p.author?.username === targetUser.username ||
      (isCurrentUser && p.author?.id === authUser.id)
  );

  const mediaPosts = userPosts.filter((p) => p.images && p.images.length > 0);
  const likedPosts = posts.filter((p) => p.isLiked);

  return (
    <div className="w-full">
      <ProfileHeader
        user={targetUser}
        isCurrentUser={isCurrentUser}
        onEditProfile={() => setIsEditModalOpen(true)}
        onToggleFollow={() => toggleFollow(targetUser.id)}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        tabs={['Posts', 'Media', 'Likes', 'About']}
      />

      {/* Tab Content */}
      {activeTab === 'Posts' && (
        <div className="space-y-4">
          {userPosts.length > 0 ? (
            userPosts.map((post) => <PostCard key={post.id} post={post} />)
          ) : (
            <EmptyState
              icon={FileText}
              title="No posts published yet"
              description="Posts and updates shared by this profile will be shown here."
            />
          )}
        </div>
      )}

      {activeTab === 'Media' && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-3.5 sm:p-5 shadow-xs">
          {mediaPosts.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 sm:gap-3">
              {mediaPosts.flatMap((post) =>
                post.images.map((img, idx) => (
                  <div
                    key={`${post.id}_${idx}`}
                    className="aspect-square rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-800 border border-slate-200/60 dark:border-slate-700/60 group cursor-pointer"
                  >
                    <img
                      src={img}
                      alt="Media"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                    />
                  </div>
                ))
              )}
            </div>
          ) : (
            <EmptyState
              icon={ImageIcon}
              title="No media uploaded"
              description="Photos and visual art from this user will show up here."
            />
          )}
        </div>
      )}

      {activeTab === 'Likes' && (
        <div className="space-y-4">
          {likedPosts.length > 0 ? (
            likedPosts.map((post) => <PostCard key={post.id} post={post} />)
          ) : (
            <EmptyState
              icon={Heart}
              title="No liked posts"
              description="Posts that this user likes will appear here."
            />
          )}
        </div>
      )}

      {activeTab === 'About' && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-6 shadow-xs space-y-4">
          <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">
            About {targetUser.fullName}
          </h4>
          <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
            {targetUser.bio || 'No detailed biography provided.'}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-slate-100 dark:border-slate-800">
            <div>
              <p className="text-xs text-slate-400">Location</p>
              <p className="text-sm font-medium text-slate-800 dark:text-slate-200">
                {targetUser.location || 'Undisclosed'}
              </p>
            </div>
            <div>
              <p className="text-xs text-slate-400">Website</p>
              <p className="text-sm font-medium text-blue-600 dark:text-blue-400">
                {targetUser.website || 'None'}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Edit Profile Modal */}
      {isCurrentUser && (
        <EditProfile
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
        />
      )}
    </div>
  );
};

export default Profile;