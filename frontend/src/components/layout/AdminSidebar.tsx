import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  UsersRound, 
  Contact2, 
  BarChart3, 
  Settings, 
  LogOut 
} from 'lucide-react';
import { cn } from '../../lib/utils';

export const AdminSidebar: React.FC = () => {
  const navItems = [
    { label: 'Dashboard', path: '/admin', icon: LayoutDashboard, section: 'Main' },
    { label: 'Live Queue', path: '/admin/queue', icon: UsersRound, section: 'Main' },
    { label: 'Clients', path: '/admin/clients', icon: Contact2, section: 'Main' },
    { label: 'Analytics', path: '/admin/analytics', icon: BarChart3, section: 'Finance' },
    { label: 'Settings', path: '/admin/settings', icon: Settings, section: 'System' },
  ];

  return (
    <aside className="w-60 bg-slate-50 border-r border-slate-200 flex flex-col shrink-0 h-screen">
      <div className="p-6">
        <span className="text-[#1E3A5F] font-bold text-xl tracking-tight">Elite Cuts</span>
      </div>
      
      <nav className="flex-1 px-4 space-y-1 overflow-y-auto">
        {['Main', 'Finance', 'System'].map((section) => (
          <React.Fragment key={section}>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider px-2 mt-6 mb-2">
              {section}
            </p>
            {navItems.filter(item => item.section === section).map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) => cn(
                  "flex items-center gap-3 px-3 py-2 rounded-md transition-colors text-sm font-medium",
                  isActive 
                    ? "bg-white text-[#ED1C24] shadow-sm border border-slate-200" 
                    : "text-slate-600 hover:bg-slate-100"
                )}
              >
                <item.icon size={18} />
                <span>{item.label}</span>
              </NavLink>
            ))}
          </React.Fragment>
        ))}
      </nav>

      <div className="p-4 border-t border-slate-200">
        <button className="flex items-center gap-3 px-3 py-2 w-full text-slate-600 hover:text-[#ED1C24] transition-colors text-sm font-medium">
          <LogOut size={18} />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
};