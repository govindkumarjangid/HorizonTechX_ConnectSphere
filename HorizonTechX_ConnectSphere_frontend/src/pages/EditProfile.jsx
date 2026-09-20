import React, { useState, useRef } from 'react';
import { Camera, Image as ImageIcon } from 'lucide-react';
import Modal from '../components/common/Modal';
import Avatar from '../components/users/Avatar';
import { useAuth } from '../store/useAuthStore';

export const EditProfile = ({ isOpen, onClose }) => {
  const { user, updateProfile } = useAuth();
  const avatarInputRef = useRef(null);
  const coverInputRef = useRef(null);

  const [formData, setFormData] = useState({
    fullName: user?.fullName || '',
    title: user?.title || '',
    bio: user?.bio || '',
    location: user?.location || '',
    website: user?.website || '',
    avatar: user?.avatar || '',
    coverPhoto: user?.coverPhoto || '',
  });

  const handleAvatarFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setFormData((prev) => ({ ...prev, avatar: event.target.result }));
      }
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const handleCoverFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setFormData((prev) => ({ ...prev, coverPhoto: event.target.result }));
      }
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    updateProfile(formData);
    onClose?.();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Edit Profile" maxWidth="max-w-lg">
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Hidden File Inputs */}
        <input
          type="file"
          ref={avatarInputRef}
          accept="image/*"
          className="hidden"
          onChange={handleAvatarFile}
        />
        <input
          type="file"
          ref={coverInputRef}
          accept="image/*"
          className="hidden"
          onChange={handleCoverFile}
        />

        {/* Cover & Avatar Upload Preview Area */}
        <div className="space-y-2">
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
            Profile Visuals
          </label>
          <div className="relative rounded-xl overflow-hidden bg-slate-800 h-28 border border-slate-200 dark:border-slate-700 group">
            {formData.coverPhoto ? (
              <img
                src={formData.coverPhoto}
                alt="Cover Preview"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-xs text-slate-400">
                No cover photo
              </div>
            )}
            <button
              type="button"
              onClick={() => coverInputRef.current?.click()}
              className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1.5 text-xs font-semibold text-white cursor-pointer"
            >
              <ImageIcon className="w-4 h-4" />
              <span>Upload Cover Photo</span>
            </button>
          </div>

          <div className="flex items-center gap-4 pt-1">
            <div className="relative group cursor-pointer" onClick={() => avatarInputRef.current?.click()}>
              <Avatar src={formData.avatar} alt={formData.fullName} size="xl" />
              <div className="absolute inset-0 rounded-full bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                <Camera className="w-5 h-5" />
              </div>
            </div>
            <div>
              <button
                type="button"
                onClick={() => avatarInputRef.current?.click()}
                className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                Upload Avatar
              </button>
              <p className="text-[11px] text-slate-400 mt-1">JPG, PNG, or GIF format</p>
            </div>
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Full Name
          </label>
          <input
            type="text"
            required
            value={formData.fullName}
            onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
            className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-slate-100 focus:outline-hidden focus:border-blue-500"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Professional Title / Role
          </label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-slate-100 focus:outline-hidden focus:border-blue-500"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Bio
          </label>
          <textarea
            rows={3}
            value={formData.bio}
            onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
            className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-slate-100 focus:outline-hidden focus:border-blue-500 resize-none"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Location
            </label>
            <input
              type="text"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-slate-100 focus:outline-hidden focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Website URL
            </label>
            <input
              type="url"
              value={formData.website}
              onChange={(e) => setFormData({ ...formData, website: e.target.value })}
              className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-slate-100 focus:outline-hidden focus:border-blue-500"
            />
          </div>
        </div>

        <div className="flex justify-end gap-2.5 pt-3 border-t border-slate-100 dark:border-slate-800">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold rounded-xl text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-5 py-2 text-xs font-semibold rounded-xl bg-blue-600 text-white hover:bg-blue-700 shadow-sm shadow-blue-500/20 cursor-pointer"
          >
            Save Changes
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default EditProfile;