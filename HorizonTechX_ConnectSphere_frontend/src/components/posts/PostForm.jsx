import React, { useState, useRef } from 'react';
import { Send, Image, Video, X, AtSign, Hash } from 'lucide-react';
import useAuthStore from '../../store/useAuthStore';
import usePostStore from '../../store/usePostStore';
import useToastStore from '../../store/useToastStore';
import Avatar from '../users/Avatar';
import Loader from '../common/Loader';

export const PostForm = () => {
  const user = useAuthStore((state) => state.user);
  const createPost = usePostStore((state) => state.createPost);
  const isCreating = usePostStore((state) => state.isCreating);

  const [content, setContent] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [mediaType, setMediaType] = useState(null);

  const fileInputRef = useRef(null);
  const textareaRef = useRef(null);

  // Insert @ or # at cursor position in textarea
  const insertAtCursor = (symbol) => {
    const el = textareaRef.current;
    if (!el) return;
    const start = el.selectionStart;
    const end = el.selectionEnd;
    const before = content.slice(0, start);
    const after = content.slice(end);
    const needsSpace = start > 0 && before[before.length - 1] !== ' ';
    const insertion = (needsSpace ? ' ' : '') + symbol;
    const newValue = before + insertion + after;
    setContent(newValue);
    // Restore cursor after inserted symbol
    const newPos = start + insertion.length;
    setTimeout(() => {
      el.focus();
      el.setSelectionRange(newPos, newPos);
    }, 0);
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check size limit: max 50MB for video, 10MB for image
    const isVideo = file.type.startsWith('video/');
    const isImage = file.type.startsWith('image/');

    if (!isVideo && !isImage) {
      useToastStore.getState().error('Please select an image or video file');
      return;
    }

    if (isVideo && file.size > 50 * 1024 * 1024) {
      useToastStore.getState().error('Video must be less than 50MB');
      return;
    }

    if (isImage && file.size > 10 * 1024 * 1024) {
      useToastStore.getState().error('Image must be less than 10MB');
      return;
    }

    setSelectedFile(file);
    setMediaType(isVideo ? 'video' : 'image');
    setPreviewUrl(URL.createObjectURL(file));
  };

  const handleRemoveMedia = () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setSelectedFile(null);
    setPreviewUrl(null);
    setMediaType(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const trimmed = content.trim();

    if (!trimmed && !selectedFile) {
      useToastStore.getState().error('Please enter some text or select an image/video');
      return;
    }

    let payload;
    if (selectedFile) {
      const formData = new FormData();
      if (trimmed) formData.append('content', trimmed);
      formData.append('media', selectedFile);
      payload = formData;
    } else {
      payload = { content: trimmed };
    }

    const result = await createPost(payload);
    if (result.success) {
      setContent('');
      handleRemoveMedia();
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-4 sm:p-5 shadow-xs mb-5 transition-colors">
      <form onSubmit={handleSubmit} noValidate>
        <div className="flex gap-3 items-start">
          <Avatar src={user?.avatar} alt={user?.username} size="md" />

          <div className="flex-1 min-w-0 space-y-3">
            <textarea
              ref={textareaRef}
              rows={3}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="What's happening? Share a post, image or video..."
              maxLength={2000}
              className="w-full bg-slate-50 dark:bg-slate-800/60 rounded-2xl p-3.5 text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 border border-slate-200/80 dark:border-slate-700/80 focus:border-blue-500 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 resize-none transition-all"
            />

            {/* Media Preview Box */}
            {previewUrl && (
              <div className="relative rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 max-h-72 flex items-center justify-center">
                {mediaType === 'image' ? (
                  <img
                    src={previewUrl}
                    alt="Upload preview"
                    className="w-full max-h-72 object-cover"
                  />
                ) : (
                  <video
                    src={previewUrl}
                    controls
                    className="w-full max-h-72 object-cover bg-black"
                  />
                )}
                <button
                  type="button"
                  onClick={handleRemoveMedia}
                  className="absolute top-2 right-2 p-1.5 rounded-full bg-black/70 hover:bg-black text-white transition-colors cursor-pointer shadow-md"
                  aria-label="Remove media"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* Hidden File Input */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*,video/*"
              onChange={handleFileChange}
              className="hidden"
            />

            <div className="flex items-center justify-between pt-1">
              {/* Media upload & mention/tag buttons */}
              <div className="flex items-center gap-0.5 flex-wrap">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                  title="Upload Image or Video"
                >
                  <Image className="w-4 h-4 text-emerald-500" />
                  <span>Photo</span>
                </button>

                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                  title="Upload Video"
                >
                  <Video className="w-4 h-4 text-indigo-500" />
                  <span>Video</span>
                </button>

                <button
                  type="button"
                  onClick={() => insertAtCursor('@')}
                  className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-semibold text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/40 transition-colors cursor-pointer"
                  title="Mention someone"
                >
                  <AtSign className="w-3.5 h-3.5" />
                  <span>Mention</span>
                </button>

                <button
                  type="button"
                  onClick={() => insertAtCursor('#')}
                  className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 transition-colors cursor-pointer"
                  title="Add hashtag"
                >
                  <Hash className="w-3.5 h-3.5" />
                  <span>Tag</span>
                </button>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={(!content.trim() && !selectedFile) || isCreating}
                className="px-5 py-2 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs transition-all shadow-md shadow-blue-500/20 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer flex items-center gap-1.5"
              >
                {isCreating ? (
                  <Loader size="sm" className="text-white" />
                ) : (
                  <>
                    <Send className="w-3.5 h-3.5" />
                    <span>Post</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default PostForm;