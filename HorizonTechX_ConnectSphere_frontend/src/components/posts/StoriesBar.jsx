import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import { Plus, ChevronLeft, ChevronRight, CheckCircle } from 'lucide-react';
import { mockStories } from '../../utils/mockData';
import { useAuth } from '../../store/useAuthStore';
import Avatar from '../users/Avatar';

export const StoriesBar = () => {
  const { user } = useAuth();

  return (
    <div className="relative mb-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-3.5 shadow-xs group transition-colors overflow-hidden">
      <div className="w-full overflow-hidden rounded-xl">
        <Swiper
          modules={[Navigation]}
          navigation={{
            prevEl: '.swiper-button-prev-custom',
            nextEl: '.swiper-button-next-custom',
          }}
          spaceBetween={10}
          slidesPerView={'auto'}
          className="w-full"
        >
          {/* Add your story card */}
          <SwiperSlide className="!w-[96px] sm:!w-[120px]">
            <div className="relative h-[148px] sm:h-[176px] rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-800 border border-slate-200/60 dark:border-slate-700/60 cursor-pointer group/card flex flex-col justify-end p-2 sm:p-2.5 transition-transform hover:scale-[1.02]">
              <img
                src={user?.avatar}
                alt="My Story"
                className="absolute inset-0 w-full h-full object-cover filter brightness-[0.75] group-hover/card:scale-105 transition-transform duration-300"
              />
              <div className="relative z-10 flex items-center gap-1.5">
                <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-orange-500 text-white flex items-center justify-center ring-2 ring-white dark:ring-slate-900 shadow-md flex-shrink-0">
                  <Plus className="w-3 h-3 sm:w-3.5 sm:h-3.5 stroke-[3]" />
                </div>
                <span className="text-[10px] sm:text-[11px] font-semibold text-white leading-tight drop-shadow-sm truncate">
                  Add story
                </span>
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />
            </div>
          </SwiperSlide>

          {/* Stories from creators */}
          {mockStories.filter((s) => !s.isAddStory).map((story) => (
            <SwiperSlide key={story.id} className="!w-[96px] sm:!w-[120px]">
              <div className="relative h-[148px] sm:h-[176px] rounded-xl overflow-hidden bg-slate-900 border border-slate-200/60 dark:border-slate-700/60 cursor-pointer group/card flex flex-col justify-end p-2 sm:p-2.5 transition-transform hover:scale-[1.02]">
                <img
                  src={story.image}
                  alt={story.user.fullName}
                  className="absolute inset-0 w-full h-full object-cover filter brightness-[0.9] group-hover/card:scale-105 transition-transform duration-300"
                  loading="lazy"
                />

                {/* Creator info at the BOTTOM of card matching Screenshot 4 */}
                <div className="relative z-10 flex items-center gap-1 sm:gap-1.5 min-w-0">
                  <Avatar
                    src={story.user.avatar}
                    alt={story.user.fullName}
                    size="xs"
                    className="ring-1.5 ring-blue-500 flex-shrink-0"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-0.5">
                      <p className="text-[10px] sm:text-[11px] font-semibold text-white truncate drop-shadow-sm">
                        {story.user.fullName}
                      </p>
                      {story.user.isVerified && (
                        <CheckCircle className="w-2.5 h-2.5 text-blue-400 fill-blue-400 flex-shrink-0" />
                      )}
                    </div>
                  </div>
                </div>

                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent pointer-events-none" />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {/* Navigation Arrow buttons (hidden on mobile, visible on desktop hover) */}
      <button
        className="swiper-button-prev-custom absolute left-2 top-1/2 -translate-y-1/2 z-20 w-7 h-7 rounded-full bg-white/90 dark:bg-slate-900/90 text-slate-800 dark:text-slate-200 shadow-md border border-slate-200/60 dark:border-slate-700 hidden sm:flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-0 cursor-pointer"
        aria-label="Previous story"
      >
        <ChevronLeft className="w-4 h-4 stroke-[2.5]" />
      </button>
      <button
        className="swiper-button-next-custom absolute right-2 top-1/2 -translate-y-1/2 z-20 w-7 h-7 rounded-full bg-white/90 dark:bg-slate-900/90 text-slate-800 dark:text-slate-200 shadow-md border border-slate-200/60 dark:border-slate-700 hidden sm:flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-0 cursor-pointer"
        aria-label="Next story"
      >
        <ChevronRight className="w-4 h-4 stroke-[2.5]" />
      </button>
    </div>
  );
};

export default StoriesBar;
