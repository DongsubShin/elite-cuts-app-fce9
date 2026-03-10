import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { UserNavbar } from './UserNavbar';
import { AdminSidebar } from './AdminSidebar';

export const Layout: React.FC = () => {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith('/admin');

  if (isAdmin) {
    return (
      <div className="flex h-screen overflow-hidden bg-white">
        <AdminSidebar />
        <main className="flex-1 overflow-y-auto bg-slate-50/50">
          <Outlet />
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <UserNavbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <footer className="bg-slate-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-slate-400">© 2024 Elite Cuts. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};