import React, { useEffect, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import RightSidebar from './RightSidebar';
import MobileNav from './MobileNav';
import Toast from '../common/Toast';
import Modal from '../common/Modal';
import PostForm from '../posts/PostForm';

gsap.registerPlugin(ScrollTrigger);

export const Layout = ({ children, hideSidebars = false }) => {
  const [isMobileComposeOpen, setIsMobileComposeOpen] = useState(false);
  const location = useLocation();

  // Initialize Lenis smooth scrolling and synchronize with GSAP ScrollTrigger
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const lenis = new Lenis({
      duration: 0.9,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      touchMultiplier: 1.5,
    });

    // Sync Lenis scroll updates with GSAP ScrollTrigger
    lenis.on('scroll', ScrollTrigger.update);

    const updateTicker = (time) => {
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(updateTicker);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(updateTicker);
      lenis.destroy();
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, []);

  const isMessagesPage = location.pathname.startsWith('/messages');

  return (
    <div className="min-h-screen bg-[#f6f8fb] dark:bg-[#090d16] text-slate-900 dark:text-slate-100 flex flex-col transition-colors duration-200 selection:bg-blue-500/20">
      <Navbar />

      <main className="flex-1 max-w-7xl 2xl:max-w-[1400px] w-full mx-auto px-2.5 sm:px-4 md:px-6 lg:px-8 py-3 sm:py-5 lg:py-6">
        {isMessagesPage || hideSidebars ? (
          <div className="w-full safe-pb-with-nav md:pb-6">
            {children || <Outlet />}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 lg:gap-6 items-start">
            {/* Left Column: Navigation, Mini Profile, Pages (hidden on mobile, 4 cols on md, 3 cols on lg) */}
            <div className="hidden md:block md:col-span-4 lg:col-span-3 sticky top-20">
              <Sidebar />
            </div>

            {/* Center Column: Feed / Active page content (12 cols on mobile, 8 cols on md, 6 cols on lg) */}
            <div className="col-span-12 md:col-span-8 lg:col-span-6 min-w-0 safe-pb-with-nav md:pb-6">
              {children || <Outlet />}
            </div>

            {/* Right Column: Trending Topics & Who to follow (hidden on mobile and md, 3 cols on lg) */}
            <div className="hidden lg:block lg:col-span-3 sticky top-20">
              <RightSidebar />
            </div>
          </div>
        )}
      </main>

      {/* Mobile Bottom Navigation */}
      <MobileNav onOpenCompose={() => setIsMobileComposeOpen(true)} />

      {/* Global Toast */}
      <Toast />

      {/* Mobile Compose Modal */}
      <Modal
        isOpen={isMobileComposeOpen}
        onClose={() => setIsMobileComposeOpen(false)}
        title="Create a Post"
      >
        <PostForm onPostCreated={() => setIsMobileComposeOpen(false)} />
      </Modal>
    </div>
  );
};

export default Layout;