import { useEffect, useRef, useCallback } from 'react';

export const useInfiniteScroll = (onLoadMore, hasMore = true, isLoading = false) => {
  const observerRef = useRef(null);

  const handleObserver = useCallback(
    (entries) => {
      const [target] = entries;
      if (target.isIntersecting && hasMore && !isLoading) {
        onLoadMore?.();
      }
    },
    [onLoadMore, hasMore, isLoading]
  );

  useEffect(() => {
    const element = observerRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(handleObserver, {
      root: null,
      rootMargin: '200px',
      threshold: 0.1,
    });

    observer.observe(element);

    return () => {
      if (element) observer.unobserve(element);
      observer.disconnect();
    };
  }, [handleObserver]);

  return { observerRef };
};

export default useInfiniteScroll;
