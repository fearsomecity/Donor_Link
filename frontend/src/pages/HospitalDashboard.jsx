import { useState, useEffect } from 'react';
import useAuthStore from '../store/authStore';
import { PlusCircle, ArrowRight, Activity, Database, TrendingUp, CheckCircle, Clock, User } from 'lucide-react';
import { Link } from 'react-router-dom';
import axios from 'axios';

export default function HospitalDashboard() {
  const { user } = useAuthStore();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTodayAppointments = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('/api/hospitals/appointments/today', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setAppointments(res.data);
      } catch (err) {
        console.error('Failed to fetch hospital appointments', err);
      } finally {
        setLoading(false);
      }
    };
    fetchTodayAppointments();
  }, []);

  const handleComplete = async (id) => {
    if (!window.confirm('Mark this appointment as completed and update inventory?')) return;
    try {
      const token = localStorage.getItem('token');
      await axios.post(`/api/hospitals/appointments/${id}/complete`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAppointments(prev => prev.filter(a => a._id !== id));
      alert('Success! Records and inventory updated.');
    } catch (err) {
      alert('Error updating records');
    }
  };

  const inventoryTotal = Object.values(user?.profile?.inventory || {}).reduce((a, b) => a + b, 0);

  return (
    <div className="relative min-h-screen bg-neutral-50/50 dark:bg-[#0a0a0a] pt-32 pb-20 px-6 overflow-hidden">
      {/* Aesthetic Background Elements */}
      <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-crimson-100/30 rounded-full blur-[100px] animate-float dark:hidden dark:hidden" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-50/50 rounded-full blur-[100px] animate-float dark:hidden" style={{ animationDelay: '2s' }} />

      <div className="relative max-w-6xl mx-auto z-10">
        <header className="mb-16 animate-fade-in-up">
          <div className="inline-flex items-center gap-2 bg-neutral-900 dark:bg-[#141414] text-white text-[10px] font-bold px-3 py-1 rounded-full mb-6 tracking-widest uppercase shadow-lg">
            <Activity className="w-3 h-3 text-crimson-500" />
            Hospital Operations Control
          </div>
          <h1 className="text-5xl md:text-7xl font-black text-neutral-900 dark:text-white tracking-tightest mb-4 font-header">
            Welcome, <span className="text-gradient">{user?.profile?.hospitalName || 'Partner'}</span>
          </h1>
          <p className="text-xl text-neutral-500 max-w-2xl font-medium">
            Manage your critical blood supplies and coordinate life-saving transfers with real-time analytics.
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
          <DashboardCard 
            icon={<Database className="w-8 h-8" />}
            title="Blood Inventory"
            value={`${inventoryTotal} Units`}
            desc="Current stock levels across all blood types. Optimized for urgent needs."
            link="/hospital/inventory"
            highlight
          />
          <DashboardCard 
            icon={<PlusCircle className="w-8 h-8" />}
            title="Active Requests"
            value="Manage"
            desc="Post or view outbound requests for rare blood types."
            link="/hospital/requests"
          />
          <DashboardCard 
            icon={<TrendingUp className="w-8 h-8" />}
            title="Fulfillment"
            value="100%"
            desc="Your hospital's efficiency in meeting critical patient needs."
            link="/hospital/dashboard"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
          <div className="glass p-10 rounded-[2.5rem] flex flex-col">
            <h2 className="text-2xl font-bold text-neutral-900 dark:text-white mb-6 font-header">Today's Scheduled Donors</h2>
            <div className="space-y-4 flex-1">
              {loading ? (
                <div className="p-8 text-center animate-pulse text-neutral-400 font-bold uppercase tracking-widest">Loading...</div>
              ) : appointments.length > 0 ? (
                appointments.map(app => (
                  <ScheduleItem 
                    key={app._id}
                    donorName={app.donorId?.donorProfile?.name || 'Anonymous Donor'}
                    bloodType={app.bloodType}
                    time={app.time}
                    onComplete={() => handleComplete(app._id)}
                  />
                ))
              ) : (
                <div className="p-12 border-2 border-dashed border-neutral-100 dark:border-[#2a2a2a] rounded-3xl text-center">
                  <p className="text-sm font-bold text-neutral-400 uppercase tracking-widest">No donors scheduled for today</p>
                </div>
              )}
            </div>
          </div>

          <div className="glass p-10 rounded-[2.5rem]">
            <h2 className="text-2xl font-bold text-neutral-900 dark:text-white mb-6 font-header">AI Support Center</h2>
            <div className="bg-neutral-900 dark:bg-[#141414] rounded-3xl p-8 text-white relative overflow-hidden group h-full flex flex-col justify-between">
              <div className="absolute bottom-0 right-0 w-48 h-48 bg-crimson-600/30 blur-3xl group-hover:scale-150 transition-transform duration-700" />
              <p className="text-lg font-medium mb-8 relative z-10">
                Optimize your inventory management with AI-driven demand forecasting and supply matching.
              </p>
              <Link to="/hospital/ai-assistant" className="btn-primary inline-flex items-center gap-2 self-start relative z-10">
                Open AI Dashboard <ArrowRight className="w-4 h-4" />
              </Link>
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
        Operational View <ArrowRight className="w-3 h-3" />
      </div>
    </Link>
  );
}

function ScheduleItem({ donorName, bloodType, time, onComplete }) {
  return (
    <div className="flex items-center justify-between p-6 bg-white dark:bg-[#141414] rounded-2xl border border-neutral-100 dark:border-[#2a2a2a] shadow-sm dark:shadow-none hover:border-crimson-100 transition-all group">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-2xl bg-neutral-50 dark:bg-[#0a0a0a] flex items-center justify-center text-neutral-400 group-hover:bg-crimson-50 group-hover:text-crimson-600 transition-colors">
          <User className="w-6 h-6" />
        </div>
        <div>
          <h4 className="font-bold text-neutral-900 dark:text-white">{donorName}</h4>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-[10px] font-bold text-crimson-600 bg-crimson-50 px-2 py-0.5 rounded-full">{bloodType}</span>
            <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest flex items-center gap-1">
              <Clock className="w-3 h-3" /> {time}
            </span>
          </div>
        </div>
      </div>
      <button 
        onClick={onComplete}
        className="w-10 h-10 rounded-full bg-neutral-50 dark:bg-[#0a0a0a] flex items-center justify-center text-neutral-300 hover:bg-green-600 hover:text-white transition-all shadow-sm dark:shadow-none"
        title="Mark as Complete"
      >
        <CheckCircle className="w-5 h-5" />
      </button>
    </div>
  );
}
