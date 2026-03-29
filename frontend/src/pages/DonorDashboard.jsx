import { useState, useEffect } from 'react';
import useAuthStore from '../store/authStore';
import { Heart, Activity, ArrowRight, Calendar, Droplets, Clock, XCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import axios from 'axios';

export default function DonorDashboard() {
  const { user } = useAuthStore();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('/api/donors/appointments/my', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setAppointments(res.data.filter(a => a.status === 'scheduled'));
      } catch (err) {
        console.error('Failed to fetch appointments', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAppointments();
  }, []);

  const totalDonations = user?.profile?.donations?.length || 0;
  const livesSaved = totalDonations * 3; // Standard metric: 1 donation saves 3 lives

  return (
    <div className="relative min-h-screen bg-neutral-50/50 dark:bg-[#000000] pt-32 pb-20 px-6 overflow-hidden">
      {/* Aesthetic Background Elements */}
      <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-crimson-100/30 rounded-full blur-[100px] animate-float dark:hidden dark:hidden" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-crimson-50/30 rounded-full blur-[100px] animate-float dark:hidden dark:hidden" style={{ animationDelay: '2s' }} />

      <div className="relative max-w-6xl mx-auto z-10">
        <header className="mb-16 animate-fade-in-up">
          <div className="inline-flex items-center gap-2 bg-crimson-50 text-crimson-700 text-[10px] font-bold px-3 py-1 rounded-full mb-6 tracking-widest uppercase">
            <Droplets className="w-3 h-3" />
            Active Donor Status
          </div>
          <h1 className="text-5xl md:text-7xl font-black text-neutral-900 dark:text-white tracking-tightest mb-4 font-header">
            Welcome back, <span className="text-gradient">{user?.profile?.name?.split(' ')[0] || 'Hero'}</span>!
          </h1>
          <p className="text-xl text-neutral-500 max-w-2xl font-medium">
            Your contributions have already impacted multiple lives. Ready for your next mission?
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
          <DashboardCard 
            icon={<Heart className="w-8 h-8" />}
            title="Next Donation"
            value="Eligible Now"
            desc="You are ready to donate! Check centers nearby."
            link="/donor/book-appointment"
            highlight
          />
          <DashboardCard 
            icon={<Activity className="w-8 h-8" />}
            title="Urgent Needs"
            value="Nearby"
            desc="Hospitals near you are requesting your blood type."
            link="/donor/urgent-needs"
          />
          <DashboardCard 
            icon={<Calendar className="w-8 h-8" />}
            title="Total Impact"
            value={`${livesSaved} Lives`}
            desc={`You've completed ${totalDonations} donations. Amazing work!`}
            link="/donor/dashboard"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
          <div className="glass p-10 rounded-[2.5rem]">
            <h2 className="text-2xl font-bold text-neutral-900 dark:text-white mb-6 font-header">AI Health Assistant</h2>
            <div className="bg-neutral-900 dark:bg-[#111] rounded-3xl p-8 text-white relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-crimson-600/20 blur-3xl group-hover:scale-150 transition-transform duration-700" />
              <p className="text-lg font-medium mb-8 relative z-10">
                Have questions about donation eligibility or post-donation care? Our AI is here to help 24/7.
              </p>
              <Link to="/donor/ai-assistant" className="btn-primary inline-flex items-center gap-2 relative z-10">
                Start Consultation <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          <div className="glass p-10 rounded-[2.5rem] flex flex-col">
            <h2 className="text-2xl font-bold text-neutral-900 dark:text-white mb-6 font-header">Upcoming Appointments</h2>
            <div className="space-y-4 flex-1">
              {loading ? (
                <div className="p-8 text-center animate-pulse text-neutral-400 font-bold uppercase tracking-widest">Loading...</div>
              ) : appointments.length > 0 ? (
                appointments.map(app => (
                  <AppointmentItem 
                    key={app._id}
                    hospital={app.hospitalName}
                    date={new Date(app.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                    time={app.time}
                  />
                ))
              ) : (
                <div className="p-8 border-2 border-dashed border-neutral-100 dark:border-[#222] rounded-3xl text-center flex flex-col items-center gap-4">
                  <p className="text-sm font-bold text-neutral-400 uppercase tracking-widest">No upcoming appointments</p>
                  <Link to="/donor/book-appointment" className="text-crimson-600 font-bold text-sm hover:underline flex items-center gap-1">
                    Book one now <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function DashboardCard({ icon, title, value, desc, link, highlight = false }) {
  return (
    <Link to={link} className={`group glass p-10 rounded-[2.5rem] transition-all duration-500 hover:-translate-y-2 ${highlight ? 'border-crimson-100 shadow-xl dark:shadow-none shadow-crimson-100/10' : ''}`}>
      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-8 transition-all duration-500 ${highlight ? 'bg-crimson-600 text-white shadow-lg shadow-crimson-200' : 'bg-neutral-100 text-neutral-600 group-hover:bg-crimson-50 group-hover:text-crimson-600'}`}>
        {icon}
      </div>
      <h3 className="text-sm font-bold text-neutral-400 uppercase tracking-widest mb-2">{title}</h3>
      <div className="text-3xl font-black text-neutral-900 dark:text-white mb-4 font-header">{value}</div>
      <p className="text-sm font-medium text-neutral-500 leading-relaxed mb-6">
        {desc}
      </p>
      <div className="flex items-center gap-2 text-xs font-bold text-crimson-600 uppercase tracking-widest group-hover:gap-4 transition-all">
        Manage <ArrowRight className="w-3 h-3" />
      </div>
    </Link>
  );
}

function AppointmentItem({ hospital, date, time }) {
  return (
    <div className="flex items-center justify-between p-6 bg-white dark:bg-[#111] rounded-2xl border border-neutral-100 dark:border-[#222] shadow-sm dark:shadow-none hover:border-crimson-100 transition-colors group">
      <div>
        <h4 className="font-bold text-neutral-900 dark:text-white">{hospital}</h4>
        <div className="flex items-center gap-3 mt-1">
          <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest flex items-center gap-1">
            <Calendar className="w-3 h-3" /> {date}
          </p>
          <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest flex items-center gap-1">
            <Clock className="w-3 h-3" /> {time}
          </p>
        </div>
      </div>
      <div className="w-10 h-10 rounded-full bg-crimson-50 flex items-center justify-center text-crimson-600 group-hover:bg-crimson-600 group-hover:text-white transition-all">
        <ArrowRight className="w-5 h-5" />
      </div>
    </div>
  );
}
