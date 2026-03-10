import React from 'react';
import { Link } from 'react-router-dom';
import { Scissors, Clock, Award, Star } from 'lucide-react';

const LandingPage: React.FC = () => {
  return (
    <div className="animate-in fade-in duration-500">
      {/* Hero Section */}
      <section id="home" className="pt-32 pb-20 lg:pt-48 lg:pb-32 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:flex lg:items-center lg:gap-12">
            <div className="lg:w-1/2">
              <span className="inline-block py-1 px-3 rounded-full bg-amber-100 text-[#1E3A5F] text-sm font-bold mb-4 uppercase tracking-wider">
                Premium Grooming Experience
              </span>
              <h1 className="text-4xl lg:text-6xl font-bold text-[#1E3A5F] leading-tight mb-6">
                Precision Cuts for the <span className="text-[#ED1C24]">Modern Gentleman.</span>
              </h1>
              <p className="text-lg text-slate-600 mb-8 max-w-xl">
                Experience the art of traditional barbering combined with modern techniques. 
                Our master barbers are dedicated to making you look and feel your absolute best.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link to="/booking" className="bg-[#ED1C24] text-white px-8 py-4 rounded-lg font-bold hover:opacity-90 transition shadow-lg">
                  Book Appointment
                </Link>
                <Link to="/queue" className="bg-white border-2 border-slate-200 text-slate-700 px-8 py-4 rounded-lg font-bold hover:bg-slate-50 transition">
                  Join Live Queue
                </Link>
              </div>
            </div>
            <div className="hidden lg:block lg:w-1/2">
              <div className="relative">
                <div className="absolute -inset-4 bg-[#ED1C24]/10 rounded-2xl transform rotate-3"></div>
                <img 
                  src="https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&q=80&w=800" 
                  alt="Barber at work" 
                  className="relative rounded-2xl shadow-2xl object-cover h-[500px] w-full"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 grid md:grid-cols-3 gap-8">
          {[
            { icon: Scissors, title: "Expert Barbers", desc: "Years of experience in classic and trendy styles." },
            { icon: Clock, title: "Live Queue", desc: "Check wait times and join the line from your phone." },
            { icon: Award, title: "Loyalty Rewards", desc: "Earn points on every visit for free services." }
          ].map((feature, i) => (
            <div key={i} className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition">
              <div className="w-12 h-12 bg-[#ED1C24]/10 rounded-xl flex items-center justify-center mb-6">
                <feature.icon className="text-[#ED1C24]" size={24} />
              </div>
              <h3 className="text-xl font-bold text-[#1E3A5F] mb-3">{feature.title}</h3>
              <p className="text-slate-600">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default LandingPage;