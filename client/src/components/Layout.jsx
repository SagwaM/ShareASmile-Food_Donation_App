import React from 'react';
import DashboardNavbar from '@/components/DashboardNavbar';
import BackToTop from '@/components/BackToTop';

const Layout = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen">
      <DashboardNavbar />
      <main className="flex-grow pt-32">
        {children}
      </main>
      <BackToTop />
    </div>
  );
};

export default Layout;
