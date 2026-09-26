import React, { useState, useEffect, useRef } from 'react';
import { Image, Video, X, Check, AtSign, Hash } from 'lucide-react';
import Modal from '../common/Modal';
import Loader from '../common/Loader';
import usePostStore from '../../store/usePostStore';
import useToastStore from '../../store/useToastStore';

export const EditPostModal = ({ isOpen, onClose, post }) => {
  const updatePost = usePostStore((state) => state.updatePost);
  const isUpdating = usePostStore((state) => state.isUpdating);

  const [content, setContent] = useState('');
  const [existingMedia, setExistingMedia] = useState(null);
  const [removeMedia, setRemoveMedia] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [mediaType, setMediaType] = useState(null);

  const fileInputRef = useRef(null);
  const textareaRef = useRef(null);

  // Insert @ or # at cursor position
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
    const newPos = start + insertion.length;
    setTimeout(() => {
      el.focus();
      el.setSelectionRange(newPos, newPos);
    }, 0);
  };

  // Sync state whenever modal opens or post changes
  useEffect(() => {
    if (isOpen && post) {
      setContent(post.content || '');
      setExistingMedia(post.media || null);
      setRemoveMedia(false);
      setSelectedFile(null);
      if (previewUrl) URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
      setMediaType(post.media?.mediaType || null);
    }
  }, [isOpen, post]);

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

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

    if (previewUrl) URL.revokeObjectURL(previewUrl);

    setSelectedFile(file);
    setMediaType(isVideo ? 'video' : 'image');
    setPreviewUrl(URL.createObjectURL(file));
  };

  const handleRemoveExistingMedia = () => {
    setExistingMedia(null);
    setRemoveMedia(true);
    if (!selectedFile) setMediaType(null);
  };

  const handleRemoveNewMedia = () => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setSelectedFile(null);
    setPreviewUrl(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
    setMediaType(existingMedia?.mediaType || null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const trimmed = content.trim();

    const hasMedia = (existingMedia && !removeMedia) || selectedFile;
    if (!trimmed && !hasMedia) {
      useToastStore.getState().error('Please enter some text or select an image/video');
      return;
    }

    let payload;
    if (selectedFile) {
      const formData = new FormData();
      formData.append('content', trimmed);
      formData.append('media', selectedFile);
      if (removeMedia) formData.append('removeMedia', 'true');
      payload = formData;
    } else {
      payload = {
        content: trimmed,
        ...(removeMedia ? { removeMedia: true } : {}),
      };
    }

    const res = await updatePost(post._id, payload);
    if (res.success) onClose?.();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Edit Post" maxWidth="max-w-lg">
      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        {/* Text Content */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
            Post Content
          </label>
          <textarea
            ref={textareaRef}
            rows={4}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Edit your post..."
            maxLength={2000}
            className="w-full bg-slate-50 dark:bg-slate-800/60 rounded-2xl p-3.5 text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 border border-slate-200/80 dark:border-slate-700/80 focus:border-blue-500 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 resize-none transition-all"
          />
        </div>

        {/* Existing Media Display */}
        {existingMedia && !removeMedia && !selectedFile && (
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Current Attachment
            </label>
            <div className="relative rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 max-h-60 flex items-center justify-center">
              {existingMedia.mediaType === 'video' ? (
                <video
                  src={existingMedia.url}
                  controls
                  className="w-full max-h-60 object-cover bg-black"
                />
              ) : (
                <img
                  src={existingMedia.url}
                  alt="Current attachment"
                  className="w-full max-h-60 object-cover"
                />
              )}
              <button
                type="button"
                onClick={handleRemoveExistingMedia}
                className="absolute top-2 right-2 p-1.5 rounded-full bg-rose-600/80 hover:bg-rose-600 text-white transition-colors cursor-pointer"
                title="Remove attachment"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* New Media Preview */}
        {previewUrl && (
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              New Attachment Preview
            </label>
            <div className="relative rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 max-h-60 flex items-center justify-center">
              {mediaType === 'image' ? (
                <img
                  src={previewUrl}
                  alt="New upload preview"
                  className="w-full max-h-60 object-cover"
                />
              ) : (
                <video
                  src={previewUrl}
                  controls
                  className="w-full max-h-60 object-cover bg-black"
                />
              )}
              <button
                type="button"
                onClick={handleRemoveNewMedia}
                className="absolute top-2 right-2 p-1.5 rounded-full bg-black/70 hover:bg-black text-white transition-colors cursor-pointer"
                title="Cancel new attachment"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
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

        {/* Actions & File Pickers */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <Image className="w-4 h-4 text-emerald-500" />
              <span>{existingMedia || previewUrl ? 'Replace Photo' : 'Add Photo'}</span>
            </button>

            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <Video className="w-4 h-4 text-indigo-500" />
              <span>{existingMedia || previewUrl ? 'Replace Video' : 'Add Video'}</span>
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

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold rounded-full border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={(!content.trim() && !existingMedia && !selectedFile) || isUpdating}
              className="px-5 py-2 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer flex items-center gap-1.5"
            >
              {isUpdating ? (
                <Loader size="xs" className="text-white" />
              ) : (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Save Changes</span>
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </Modal>
  );
};

export default EditPostModal;
