import React from 'react';
import { Link } from 'react-router-dom';

export const UserNavbar: React.FC = () => {
  return (
    <nav className="fixed top-0 w-full bg-white border-b border-slate-100 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center">
            <Link to="/" className="text-xl font-bold text-[#ED1C24]">Elite Cuts</Link>
          </div>
          <div className="hidden md:flex space-x-8">
            <a href="#home" className="text-slate-600 hover:text-[#ED1C24] font-medium transition">Home</a>
            <a href="#services" className="text-slate-600 hover:text-[#ED1C24] font-medium transition">Services</a>
            <Link to="/booking" className="text-slate-600 hover:text-[#ED1C24] font-medium transition">Book Now</Link>
            <Link to="/queue" className="text-slate-600 hover:text-[#ED1C24] font-medium transition">Live Queue</Link>
          </div>
          <div>
            <Link to="/booking" className="bg-[#ED1C24] text-white px-5 py-2 rounded-md font-medium hover:opacity-90 transition shadow-sm">
              Book Appointment
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};