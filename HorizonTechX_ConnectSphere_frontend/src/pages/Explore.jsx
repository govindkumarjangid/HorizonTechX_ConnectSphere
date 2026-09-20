import React, { useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import { Compass, TrendingUp, Users, Hash } from 'lucide-react';
import { mockTrendingTopics, mockCommunities } from '../utils/mockData';
import { usePostStore } from '../store/usePostStore';
import PostCard from '../components/posts/PostCard';

export const Explore = () => {
  const { posts } = usePostStore();
  const [selectedTag, setSelectedTag] = useState(null);

  const featuredWorks = [
    {
      title: 'Solitude in Florence',
      artist: 'VintagePainting',
      image: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=1000&q=80',
      category: 'Oil on Canvas',
    },
    {
      title: 'Vibrant Geometric Flow',
      artist: 'ColorfulSpace',
      image: 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?auto=format&fit=crop&w=1000&q=80',
      category: 'Contemporary Art',
    },
    {
      title: 'Forest Sanctuary',
      artist: 'Jessica Oh',
      image: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&w=1000&q=80',
      category: 'Watercolor Study',
    },
  ];

  const filteredPosts = selectedTag
    ? posts.filter((p) =>
        p.content.toLowerCase().includes(selectedTag.toLowerCase())
      )
    : posts;

  return (
    <div className="w-full space-y-6">
      {/* Explore Hero / Featured Showcase with Swiper */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-5 shadow-xs transition-colors overflow-hidden">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Compass className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">
              Featured Curations
            </h2>
          </div>
          <span className="text-xs text-slate-400">Curated by Editors</span>
        </div>

        <Swiper
          modules={[Navigation, Pagination]}
          navigation
          pagination={{ clickable: true }}
          spaceBetween={16}
          slidesPerView={1}
          className="rounded-xl overflow-hidden h-56 sm:h-72 md:h-80"
        >
          {featuredWorks.map((work, idx) => (
            <SwiperSlide key={idx}>
              <div className="relative w-full h-full group">
                <img
                  src={work.image}
                  alt={work.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent flex flex-col justify-end p-4 sm:p-6 text-white">
                  <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-blue-400 mb-1">
                    {work.category}
                  </span>
                  <h3 className="text-base sm:text-xl font-bold">{work.title}</h3>
                  <p className="text-xs text-slate-300">By {work.artist}</p>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {/* Trending Hashtags Horizontal Filter */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-5 shadow-xs transition-colors">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
            <Hash className="w-4 h-4 text-blue-500" />
            <span>Popular Topics</span>
          </h3>
          {selectedTag && (
            <button
              onClick={() => setSelectedTag(null)}
              className="text-xs text-blue-600 dark:text-blue-400 hover:underline"
            >
              Clear filter
            </button>
          )}
        </div>

        <div className="flex flex-wrap gap-2">
          {mockTrendingTopics.map((topic, i) => {
            const isSelected = selectedTag === topic.tag;
            return (
              <button
                key={i}
                onClick={() =>
                  setSelectedTag(isSelected ? null : topic.tag)
                }
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors cursor-pointer ${
                  isSelected
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                {topic.tag}{' '}
                <span className="opacity-60 text-[10px]">({topic.postsCount.split(' ')[0]})</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Suggested Communities Showcase */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-5 shadow-xs transition-colors">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
            <Users className="w-4 h-4 text-indigo-500" />
            <span>Discover Communities</span>
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {mockCommunities.map((comm) => (
            <div
              key={comm.id}
              className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 flex items-center gap-3"
            >
              <img
                src={comm.avatar}
                alt={comm.name}
                className="w-11 h-11 rounded-xl object-cover"
              />
              <div className="min-w-0 flex-1">
                <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100 truncate">
                  {comm.name}
                </h4>
                <p className="text-[11px] text-slate-400 truncate">
                  {comm.membersCount} members
                </p>
              </div>
              <button className="px-3 py-1 text-xs font-medium rounded-full bg-slate-200 dark:bg-slate-700 hover:bg-blue-600 hover:text-white dark:hover:bg-blue-600 dark:hover:text-white transition-colors">
                Join
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Posts Stream for Explore */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-emerald-500" />
          <span>{selectedTag ? `Posts tagged with ${selectedTag}` : 'Trending in Community'}</span>
        </h3>
        {filteredPosts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>
    </div>
  );
};

export default Explore;
