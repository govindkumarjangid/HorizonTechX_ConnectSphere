import { usePostStore } from './usePostStore';

export const useCommentStore = () => {
  const { addComment, toggleCommentLike } = usePostStore();
  return {
    addComment,
    toggleCommentLike,
  };
};

export default useCommentStore;