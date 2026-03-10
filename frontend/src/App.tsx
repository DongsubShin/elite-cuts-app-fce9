import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Layout } from './components/layout/Layout';

// Lazy load pages
const LandingPage = React.lazy(() => import('./pages/LandingPage'));
const AdminDashboard = React.lazy(() => import('./pages/admin/AdminDashboard'));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1,
    },
  },
});

const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <React.Suspense fallback={
          <div className="h-screen w-full flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#ED1C24]"></div>
          </div>
        }>
          <Routes>
            <Route path="/" element={<Layout />}>
              {/* User Routes */}
              <Route index element={<LandingPage />} />
              <Route path="booking" element={<div>Booking Page (To be implemented)</div>} />
              <Route path="queue" element={<div>Live Queue Page (To be implemented)</div>} />
              
              {/* Admin Routes */}
              <Route path="admin">
                <Route index element={<AdminDashboard />} />
                <Route path="queue" element={<div>Admin Queue Management</div>} />
                <Route path="clients" element={<div>Client CRM</div>} />
                <Route path="analytics" element={<div>Analytics Dashboard</div>} />
                <Route path="settings" element={<div>Settings</div>} />
              </Route>
            </Route>
          </Routes>
        </React.Suspense>
      </BrowserRouter>
    </QueryClientProvider>
  );
};

export default App;