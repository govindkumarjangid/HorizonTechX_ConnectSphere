import React from 'react';
import StoriesBar from '../components/posts/StoriesBar';
import PostForm from '../components/posts/PostForm';
import PostList from '../components/posts/PostList';

export const Feed = () => {
  return (
    <div className="w-full">
      {/* Horizontal Stories Carousel matching Screenshot 4 */}
      <StoriesBar />

      {/* Expandable Post Composer matching Screenshots 1 & 4 */}
      <PostForm />

      {/* Dynamic Filtered Post List matching Screenshots 1 & 4 */}
      <PostList />
    </div>
  );
};

export default Feed;