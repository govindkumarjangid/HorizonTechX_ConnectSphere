import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import RightSidebar from './RightSidebar';
import MobileNav from './MobileNav';
import Modal from '../common/Modal';
import PostForm from '../posts/PostForm';

export const Layout = ({ children, hideSidebars = false }) => {
  const [isMobileComposeOpen, setIsMobileComposeOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#f6f8fb] dark:bg-[#090d16] text-slate-900 dark:text-slate-100 flex flex-col transition-colors duration-200">
      <Navbar />

      <main className="flex-1 max-w-7xl 2xl:max-w-[1400px] w-full mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-6">
        {hideSidebars ? (
          <div className="w-full pb-16 md:pb-6">{children || <Outlet />}</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-12 gap-5 lg:gap-6 items-start">
            {/* Left Column: User Summary (3 cols on md/lg) */}
            <div className="hidden md:block md:col-span-4 lg:col-span-3 sticky top-20">
              <Sidebar />
            </div>

            {/* Center Column: Feed / Active page content (8 cols on md, 6 cols on lg) */}
            <div className="col-span-12 md:col-span-8 lg:col-span-6 min-w-0 pb-16 md:pb-6">
              {children || <Outlet />}
            </div>

            {/* Right Column: Suggested Users (3 cols on lg) */}
            <div className="hidden lg:block lg:col-span-3 sticky top-20">
              <RightSidebar />
            </div>
          </div>
        )}
      </main>

      {/* Mobile Bottom Navigation */}
      <MobileNav onOpenCompose={() => setIsMobileComposeOpen(true)} />

      {/* Mobile Compose Modal */}
      <Modal
        isOpen={isMobileComposeOpen}
        onClose={() => setIsMobileComposeOpen(false)}
        title="Create a Post"
      >
        <PostForm onPostCreated={() => setIsMobileComposeOpen(false)} isInsideModal={true} />
      </Modal>
    </div>
  );
};

export default Layout;