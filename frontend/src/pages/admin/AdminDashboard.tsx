import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { 
  Users, 
  CalendarCheck, 
  TrendingUp, 
  Clock,
  ChevronRight 
} from 'lucide-react';
import { bookingService } from '../../services/api/booking.service';
import { queueService } from '../../services/api/queue.service';

const AdminDashboard: React.FC = () => {
  const { data: bookings } = useQuery({
    queryKey: ['bookings'],
    queryFn: bookingService.getBookings
  });

  const { data: queue } = useQuery({
    queryKey: ['queue'],
    queryFn: queueService.getLiveQueue
  });

  const stats = [
    { label: 'Total Revenue', value: '$1,284', change: '+12.5%', icon: TrendingUp, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { label: 'Today\'s Bookings', value: bookings?.length || 0, change: '+3', icon: CalendarCheck, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Active Queue', value: queue?.length || 0, change: '-2', icon: Users, color: 'text-amber-600', bg: 'bg-amber-50' },
    { label: 'Avg. Wait Time', value: '18 min', change: 'Stable', icon: Clock, color: 'text-purple-600', bg: 'bg-purple-50' },
  ];

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Shop Overview</h1>
          <p className="text-slate-500">Welcome back, here's what's happening today.</p>
        </div>
        <button className="bg-[#ED1C24] text-white px-4 py-2 rounded-lg font-medium shadow-sm hover:opacity-90 transition">
          Download Report
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <div className="flex justify-between items-start mb-4">
              <div className={stat.bg + " p-2 rounded-lg"}>
                <stat.icon className={stat.color} size={20} />
              </div>
              <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded">
                {stat.change}
              </span>
            </div>
            <h3 className="text-slate-500 text-sm font-medium">{stat.label}</h3>
            <p className="text-2xl font-bold text-slate-900 mt-1">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Recent Activity */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex justify-between items-center">
            <h2 className="font-bold text-slate-900">Upcoming Appointments</h2>
            <button className="text-[#ED1C24] text-sm font-semibold flex items-center gap-1">
              View All <ChevronRight size={16} />
            </button>
          </div>
          <div className="divide-y divide-slate-100">
            {bookings?.slice(0, 5).map((booking) => (
              <div key={booking.id} className="p-4 flex items-center justify-between hover:bg-slate-50 transition">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-600">
                    {booking.clientName.charAt(0)}
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900">{booking.clientName}</p>
                    <p className="text-xs text-slate-500">{booking.serviceName} • {booking.startTime}</p>
                  </div>
                </div>
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-700">
                  {booking.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Live Queue Mini */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-100">
            <h2 className="font-bold text-slate-900">Live Queue</h2>
          </div>
          <div className="p-6">
            {queue?.length === 0 ? (
              <p className="text-center text-slate-500 py-8">Queue is currently empty</p>
            ) : (
              <div className="space-y-4">
                {queue?.map((entry, i) => (
                  <div key={entry.id} className="flex items-center gap-3">
                    <span className="w-6 h-6 flex items-center justify-center bg-slate-900 text-white text-[10px] font-bold rounded-full">
                      {i + 1}
                    </span>
                    <div className="flex-1">
                      <p className="text-sm font-bold text-slate-900">{entry.clientName}</p>
                      <p className="text-[10px] text-slate-500 uppercase tracking-wider">{entry.serviceName}</p>
                    </div>
                    <span className="text-xs font-medium text-slate-400">{entry.estimatedWaitMinutes}m</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;