import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import {
  Image as ImageIcon,
  Video,
  Paperclip,
  Hash,
  AtSign,
  Smile,
  Globe,
  Lock,
  Users,
  ChevronDown,
  X,
  AlertCircle,
} from 'lucide-react';
import { useAuth } from '../../store/useAuthStore';
import { usePostStore } from '../../store/usePostStore';
import Avatar from '../users/Avatar';

export const PostForm = ({ onPostCreated }) => {
  const { user } = useAuth();
  const { createPost, showToast } = usePostStore();

  const [isExpanded, setIsExpanded] = useState(false);
  const [content, setContent] = useState('');
  const [images, setImages] = useState([]);
  const [video, setVideo] = useState(null); // { url, name, size }
  const [uploadError, setUploadError] = useState(null);
  const [visibility, setVisibility] = useState('public');
  const [isVisibilityOpen, setIsVisibilityOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const containerRef = useRef(null);
  const imageInputRef = useRef(null);
  const videoInputRef = useRef(null);

  // Real Image Upload (Multiple images supported)
  const handleImageFileSelect = (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;
    setUploadError(null);
    setIsExpanded(true);

    files.forEach((file) => {
      if (!file.type.startsWith('image/')) {
        showToast('Please select valid image files.');
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setImages((prev) => [...prev, event.target.result]);
        }
      };
      reader.readAsDataURL(file);
    });

    e.target.value = '';
  };

  // Real Video Upload (Max 25MB validation enforced)
  const handleVideoFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadError(null);
    setIsExpanded(true);

    if (!file.type.startsWith('video/')) {
      showToast('Please select a valid video file.');
      return;
    }

    const MAX_VIDEO_SIZE = 25 * 1024 * 1024; // 25MB in bytes
    if (file.size > MAX_VIDEO_SIZE) {
      const sizeMB = (file.size / (1024 * 1024)).toFixed(1);
      const errorMsg = `Video file exceeds 25MB limit (Selected: ${sizeMB} MB).`;
      setUploadError(errorMsg);
      showToast(errorMsg);
      e.target.value = '';
      return;
    }

    const videoUrl = URL.createObjectURL(file);
    setVideo({
      url: videoUrl,
      name: file.name,
      size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
    });
    showToast(`Video selected (${(file.size / (1024 * 1024)).toFixed(1)} MB)`);
    e.target.value = '';
  };

  const handleRemoveImage = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleRemoveVideo = () => {
    if (video?.url && video.url.startsWith('blob:')) {
      URL.revokeObjectURL(video.url);
    }
    setVideo(null);
    setUploadError(null);
  };

  const handleInsertTag = (tag) => {
    setContent((prev) => `${prev} ${tag} `);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!content.trim() && images.length === 0 && !video) return;

    setIsSubmitting(true);
    createPost({
      author: {
        id: user.id,
        fullName: user.fullName,
        username: user.username,
        avatar: user.avatar,
        isVerified: user.isVerified ?? true,
      },
      content: content.trim(),
      images: images,
      video: video?.url || null,
      visibility,
    });

    setContent('');
    setImages([]);
    setVideo(null);
    setUploadError(null);
    setIsExpanded(false);
    setIsSubmitting(false);
    onPostCreated?.();
  };

  return (
    <div
      ref={containerRef}
      className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-4 sm:p-5 shadow-xs mb-5 transition-all duration-200"
    >
      {/* Hidden native file inputs for real device uploads */}
      <input
        type="file"
        ref={imageInputRef}
        accept="image/*"
        multiple
        onChange={handleImageFileSelect}
        className="hidden"
      />
      <input
        type="file"
        ref={videoInputRef}
        accept="video/mp4,video/webm,video/ogg,video/quicktime,video/*"
        onChange={handleVideoFileSelect}
        className="hidden"
      />

      <form onSubmit={handleSubmit}>
        <div className="flex gap-3 items-start">
          <Avatar src={user?.avatar} alt={user?.fullName} size="md" />

          <div className="flex-1 min-w-0">
            {!isExpanded ? (
              <div
                onClick={() => setIsExpanded(true)}
                className="w-full h-11 px-4 rounded-full bg-slate-100/90 dark:bg-slate-800/80 flex items-center justify-between text-sm text-slate-400 dark:text-slate-500 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <span>Share something...</span>
                <Smile className="w-5 h-5 text-slate-400 hover:text-amber-500 transition-colors" />
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
                className="space-y-3"
              >
                <textarea
                  autoFocus
                  rows={3}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="What's happening in your creative space?"
                  className="w-full bg-slate-50 dark:bg-slate-800/50 rounded-xl p-3.5 text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 border border-slate-200/80 dark:border-slate-700/80 focus:border-blue-500 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 resize-none transition-all"
                />

                {/* Validation Error Banner */}
                {uploadError && (
                  <div className="flex items-center gap-2 p-2.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 text-xs border border-rose-200 dark:border-rose-900/50">
                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                    <span>{uploadError}</span>
                  </div>
                )}

                {/* Uploaded Images Preview Grid */}
                {images.length > 0 && (
                  <div>
                    <span className="text-[11px] font-semibold text-slate-400 dark:text-slate-500 block mb-1.5">
                      Attached Images ({images.length})
                    </span>
                    <div className="flex flex-wrap gap-2.5">
                      {images.map((img, idx) => (
                        <div
                          key={idx}
                          className="relative w-20 h-20 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 group shadow-xs"
                        >
                          <img
                            src={img}
                            alt="preview"
                            className="w-full h-full object-cover"
                          />
                          <button
                            type="button"
                            onClick={() => handleRemoveImage(idx)}
                            className="absolute top-1 right-1 w-5 h-5 rounded-full bg-black/75 text-white flex items-center justify-center text-xs hover:bg-rose-600 transition-colors"
                            title="Remove image"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Uploaded Video Preview Player */}
                {video && (
                  <div className="relative rounded-xl overflow-hidden bg-black border border-slate-700/80 shadow-xs">
                    <video
                      src={video.url}
                      controls
                      className="w-full max-h-56 object-contain rounded-t-xl"
                    />
                    <div className="flex items-center justify-between p-2.5 bg-slate-900 text-white text-xs">
                      <span className="truncate max-w-[220px] font-medium">
                        {video.name}
                      </span>
                      <span className="px-2 py-0.5 rounded-md bg-blue-600 text-[10px] font-bold">
                        {video.size} (Max 25MB)
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={handleRemoveVideo}
                      className="absolute top-2 right-2 p-1.5 rounded-full bg-black/75 text-white hover:bg-rose-600 transition-colors cursor-pointer"
                      title="Remove video"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </motion.div>
            )}
          </div>
        </div>

        {/* Toolbar Row matching Screenshot 1 & 4 */}
        <div className="mt-3.5 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-1 sm:gap-2 flex-wrap text-xs">
            {/* Real Image Upload Button */}
            <button
              type="button"
              onClick={() => imageInputRef.current?.click()}
              className="flex items-center gap-1.5 px-2.5 py-2 rounded-xl hover:bg-blue-50/80 dark:hover:bg-blue-950/40 text-blue-600 dark:text-blue-400 font-medium transition-colors cursor-pointer"
              title="Upload image from device"
            >
              <ImageIcon className="w-4 h-4 stroke-[2]" />
              <span>Image</span>
            </button>

            {/* Real Video Upload Button (Max 25MB) */}
            <button
              type="button"
              onClick={() => videoInputRef.current?.click()}
              className="flex items-center gap-1.5 px-2.5 py-2 rounded-xl hover:bg-emerald-50/80 dark:hover:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 font-medium transition-colors cursor-pointer"
              title="Upload video (Max 25MB)"
            >
              <Video className="w-4 h-4 stroke-[2]" />
              <span>Video</span>
              <span className="hidden sm:inline text-[10px] opacity-80">(Max 25MB)</span>
            </button>

            {/* Attachment */}
            <button
              type="button"
              onClick={() => imageInputRef.current?.click()}
              className="flex items-center gap-1.5 px-2.5 py-2 rounded-xl hover:bg-amber-50/80 dark:hover:bg-amber-950/40 text-amber-600 dark:text-amber-400 font-medium transition-colors cursor-pointer"
              title="Add attachment"
            >
              <Paperclip className="w-4 h-4 stroke-[2]" />
              <span className="hidden sm:inline">Attachment</span>
            </button>

            {/* Hashtag */}
            <button
              type="button"
              onClick={() => {
                setIsExpanded(true);
                handleInsertTag('#inspiration');
              }}
              className="flex items-center gap-1 px-2.5 py-2 rounded-xl hover:bg-rose-50/80 dark:hover:bg-rose-950/40 text-rose-600 dark:text-rose-400 font-medium transition-colors cursor-pointer"
              title="Insert hashtag"
            >
              <Hash className="w-3.5 h-3.5 stroke-[2.5]" />
              <span className="hidden sm:inline">Hashtag</span>
            </button>

            {/* Mention */}
            <button
              type="button"
              onClick={() => {
                setIsExpanded(true);
                handleInsertTag('@ersad_basbag');
              }}
              className="flex items-center gap-1 px-2.5 py-2 rounded-xl hover:bg-purple-50/80 dark:hover:bg-purple-950/40 text-purple-600 dark:text-purple-400 font-medium transition-colors cursor-pointer"
              title="Mention user"
            >
              <AtSign className="w-3.5 h-3.5 stroke-[2.5]" />
              <span className="hidden sm:inline">Mention</span>
            </button>
          </div>

          <div className="flex items-center gap-2 sm:gap-2.5 ml-auto sm:ml-0">
            {/* Visibility Selector */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsVisibilityOpen(!isVisibilityOpen)}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              >
                {visibility === 'public' && <Globe className="w-3.5 h-3.5 text-slate-500" />}
                {visibility === 'connections' && <Users className="w-3.5 h-3.5 text-slate-500" />}
                {visibility === 'private' && <Lock className="w-3.5 h-3.5 text-slate-500" />}
                <span className="capitalize hidden xs:inline">{visibility}</span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {isVisibilityOpen && (
                <div className="absolute right-0 bottom-full mb-1 w-44 bg-white dark:bg-slate-900 rounded-xl shadow-lg border border-slate-200 dark:border-slate-800 py-1 z-30">
                  <button
                    type="button"
                    onClick={() => {
                      setVisibility('public');
                      setIsVisibilityOpen(false);
                    }}
                    className="w-full flex items-center gap-2 px-3 py-1.5 text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                  >
                    <Globe className="w-3.5 h-3.5 text-blue-500" />
                    <span>Public</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setVisibility('connections');
                      setIsVisibilityOpen(false);
                    }}
                    className="w-full flex items-center gap-2 px-3 py-1.5 text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                  >
                    <Users className="w-3.5 h-3.5 text-indigo-500" />
                    <span>Connections only</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setVisibility('private');
                      setIsVisibilityOpen(false);
                    }}
                    className="w-full flex items-center gap-2 px-3 py-1.5 text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                  >
                    <Lock className="w-3.5 h-3.5 text-slate-500" />
                    <span>Only me</span>
                  </button>
                </div>
              )}
            </div>

            {/* Post submit button */}
            <button
              type="submit"
              disabled={(!content.trim() && images.length === 0 && !video) || isSubmitting}
              className="px-5 py-2 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-semibold text-xs transition-all shadow-xs shadow-amber-500/20 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer active:scale-95"
            >
              Post
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default PostForm;