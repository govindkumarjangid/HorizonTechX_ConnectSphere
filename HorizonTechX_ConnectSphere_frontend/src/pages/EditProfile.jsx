import React, { useState, useRef, useEffect } from 'react';
import { Camera, AlertCircle } from 'lucide-react';
import Modal from '../components/common/Modal';
import Avatar from '../components/users/Avatar';
import useAuthStore from '../store/useAuthStore';
import useUserStore from '../store/useUserStore';
import useToastStore from '../store/useToastStore';
import Loader from '../components/common/Loader';

export const EditProfile = ({ isOpen, onClose, onProfileUpdated }) => {
  const user = useAuthStore((state) => state.user);
  const updateProfile = useUserStore((state) => state.updateProfile);
  const isUpdatingProfile = useUserStore((state) => state.isUpdatingProfile);

  const [fullName, setFullName] = useState(user?.fullName || '');
  const [username, setUsername] = useState(user?.username || '');
  const [bio, setBio] = useState(user?.bio || '');
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [error, setError] = useState('');

  const fileInputRef = useRef(null);

  // Sync state whenever modal opens or user updates
  useEffect(() => {
    if (isOpen) {
      const currentUser = user || useAuthStore.getState().user;
      setFullName(currentUser?.fullName || '');
      setUsername(currentUser?.username || '');
      setBio(currentUser?.bio || '');
      setAvatarFile(null);
      setAvatarPreview(null);
      setError('');
    }
  }, [isOpen, user]);

  const handleAvatarSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      useToastStore.getState().error('Please select an image file');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      useToastStore.getState().error('Image must be under 10MB');
      return;
    }

    setAvatarFile(file);
    setAvatarPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const trimmedUsername = username.trim().toLowerCase();
    if (!trimmedUsername) {
      const msg = 'Username cannot be empty';
      setError(msg);
      useToastStore.getState().error(msg);
      return;
    }

    if (trimmedUsername.length < 3) {
      const msg = 'Username must be at least 3 characters';
      setError(msg);
      useToastStore.getState().error(msg);
      return;
    }

    if (!/^[a-z0-9_.]+$/.test(trimmedUsername)) {
      const msg = 'Username can only contain letters, numbers, underscore and dot';
      setError(msg);
      useToastStore.getState().error(msg);
      return;
    }

    let payload;
    if (avatarFile) {
      const formData = new FormData();
      formData.append('username', trimmedUsername);
      formData.append('fullName', fullName.trim());
      formData.append('bio', bio.trim());
      formData.append('avatar', avatarFile);
      payload = formData;
    } else {
      payload = {
        username: trimmedUsername,
        fullName: fullName.trim(),
        bio: bio.trim(),
      };
    }

    const result = await updateProfile(payload);
    if (result.success) {
      onProfileUpdated?.(result.user);
      onClose?.();
    } else {
      setError(result.error);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Edit Profile" maxWidth="max-w-md">
      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        {error && (
          <div className="flex items-center gap-1.5 p-2.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 text-xs border border-rose-200 dark:border-rose-900/50">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Real Avatar File Upload with Live Preview */}
        <div className="flex items-center gap-4 p-3 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200/80 dark:border-slate-700/80">
          <div className="relative group">
            <Avatar
              src={avatarPreview || user?.avatar}
              alt={username || 'avatar'}
              size="xl"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="absolute inset-0 bg-black/40 hover:bg-black/60 rounded-full flex items-center justify-center text-white transition-colors cursor-pointer"
              title="Change avatar"
            >
              <Camera className="w-5 h-5" />
            </button>
          </div>

          <div className="flex-1 min-w-0">
            <h4 className="text-xs font-semibold text-slate-800 dark:text-slate-200">
              Profile Photo
            </h4>
            <p className="text-[11px] text-slate-400 mt-0.5">
              JPG, PNG or WEBP up to 10MB
            </p>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="mt-2 text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
            >
              Upload new photo
            </button>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleAvatarSelect}
            className="hidden"
          />
        </div>

        {/* Full Name */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Full Name
          </label>
          <input
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="Enter your name"
            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-slate-100 focus:outline-hidden focus:border-blue-500 transition-colors"
          />
        </div>

        {/* Username */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Username
          </label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter your username"
            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-slate-100 focus:outline-hidden focus:border-blue-500 transition-colors"
          />
        </div>

        {/* Bio */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Bio
          </label>
          <textarea
            rows={3}
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            maxLength={160}
            placeholder="Tell something about yourself..."
            className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-slate-100 focus:outline-hidden focus:border-blue-500 resize-none transition-colors"
          />
          <span className="text-[11px] text-slate-400 block text-right mt-1">
            {160 - bio.length} characters left
          </span>
        </div>

        <div className="flex justify-end gap-2.5 pt-3 border-t border-slate-100 dark:border-slate-800">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold rounded-xl text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isUpdatingProfile}
            className="px-5 py-2 text-xs font-semibold rounded-xl bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50 cursor-pointer flex items-center gap-1.5 transition-colors shadow-md shadow-blue-500/20"
          >
            {isUpdatingProfile ? (
              <Loader size="xs" className="text-white" />
            ) : (
              'Save Changes'
            )}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default EditProfile;