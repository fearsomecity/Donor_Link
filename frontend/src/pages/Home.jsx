import { Link } from 'react-router-dom';
import { Heart, ShieldCheck, Zap, Users, ArrowRight, Activity, MapPin, Calendar } from 'lucide-react';

export default function Home() {
  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* ── Hero Section ───────────────────────────────────────────── */}
      <section className="relative pt-40 pb-32 px-8 flex-1 flex flex-col items-center justify-center overflow-hidden bg-neutral-50/30">
        {/* Aesthetic Background Elements */}
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-crimson-100/30 rounded-full blur-[120px] animate-float" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-crimson-50/30 rounded-full blur-[120px] animate-float" style={{ animationDelay: '3s' }} />

        <div className="relative max-w-4xl mx-auto text-center z-10 animate-fade-in-up">
          <div className="inline-flex items-center gap-3 bg-white/80 backdrop-blur-md border border-crimson-100 text-crimson-700 text-[10px] font-bold px-4 py-1.5 rounded-full mb-10 tracking-widest uppercase shadow-sm">
            <span className="w-2 h-2 rounded-full bg-crimson-500 animate-pulse" />
            The Future of Blood Donation
          </div>

          <h1 className="text-6xl md:text-8xl font-black text-neutral-900 leading-[1.05] tracking-tightest mb-8 font-header">
            Every Drop <span className="text-gradient">Counts.</span>
          </h1>

          <p className="text-xl text-neutral-500 leading-relaxed max-w-2xl mx-auto mb-12 font-medium">
            DonorNet bridges the gap between donors and hospitals through real-time matching, intelligent tracking, and emergency alerts.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <Link to="/register/donor" className="btn-primary w-full sm:w-auto px-10 py-4 text-lg">
              Donate Blood
            </Link>
            <Link to="/register/hospital" className="w-full sm:w-auto px-10 py-4 text-lg bg-white border-2 border-neutral-100 text-neutral-800 font-bold rounded-xl hover:bg-neutral-50 transition-all shadow-sm">
              Request Blood
            </Link>
          </div>
          
          <div className="mt-16 flex flex-wrap justify-center gap-12 opacity-50 grayscale hover:grayscale-0 transition-all duration-700">
             <div className="flex items-center gap-2 font-bold text-neutral-500"><Activity className="w-5 h-5" /> Live Tracking</div>
             <div className="flex items-center gap-2 font-bold text-neutral-500"><MapPin className="w-5 h-5" /> Smart Matching</div>
             <div className="flex items-center gap-2 font-bold text-neutral-500"><Calendar className="w-5 h-5" /> Instant Booking</div>
          </div>

          {/* Live Activity Ticker */}
          <div className="mt-20 w-screen overflow-hidden relative -mx-8 py-4 border-y border-crimson-100 bg-white/40 backdrop-blur-sm">
            <div className="flex gap-20 animate-scroll whitespace-nowrap">
              {[1, 2].map((group) => (
                <div key={group} className="flex gap-20 items-center">
                  <span className="flex items-center gap-2 text-[10px] font-black uppercase tracking-tighter text-neutral-400">
                    <span className="w-2 h-2 rounded-full bg-green-500" />
                    Hosp. City General posted O- request 2m ago
                  </span>
                  <span className="flex items-center gap-2 text-[10px] font-black uppercase tracking-tighter text-neutral-400">
                    <span className="w-2 h-2 rounded-full bg-crimson-500" />
                    Donor Sarah just booked an appointment
                  </span>
                  <span className="flex items-center gap-2 text-[10px] font-black uppercase tracking-tighter text-neutral-400">
                    <span className="w-2 h-2 rounded-full bg-blue-500" />
                    St. Mary's inventory sync complete
                  </span>
                  <span className="flex items-center gap-2 text-[10px] font-black uppercase tracking-tighter text-neutral-400">
                    <span className="w-2 h-2 rounded-full bg-amber-500" />
                    New Urgent Match: 12 Donors Notified
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Features ───────────────────────────────────────────────── */}
      <section className="py-32 px-8 bg-white relative z-10">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-24">
            <h2 className="text-4xl font-bold text-neutral-900 mb-4 font-header">
              How It Works
            </h2>
            <p className="text-lg text-neutral-400 max-w-md mx-auto font-medium">
              Seamlessly connecting lifesavers with those in critical need.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-10">
            <FeatureCard 
              icon={<Users className="w-8 h-8" />}
              title="Quick Register"
              desc="Create your profile in seconds. We handle the eligibility matching automatically."
            />
            <FeatureCard 
              icon={<Zap className="w-8 h-8" />}
              title="Real-time Connect"
              desc="Receive push alerts for urgent blood needs matching your blood type."
              delay="0.2s"
            />
            <FeatureCard 
              icon={<ShieldCheck className="w-8 h-8" />}
              title="Save Lives"
              desc="Complete your donation and track your personal impact history."
              delay="0.4s"
            />
          </div>
        </div>
      </section>

      {/* ── Stats ──────────────────────────────────────────────────── */}
      <section className="py-32 px-8 bg-neutral-900 text-white rounded-[3rem] mx-6 mb-32 overflow-hidden relative">
        <div className="absolute top-0 right-0 w-64 h-64 bg-crimson-600/20 blur-[100px]" />
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-12">
            <Stat value="12,500+" label="Verified Donors" />
            <Stat value="450+" label="Partner Hospitals" />
            <Stat value="99.9%" label="Uptime Service" />
            <Stat value="24/7" label="Emergency Support" />
          </div>
        </div>
      </section>

      {/* ── CTA ────────────────────────────────────────────────────── */}
      <section className="px-8 pb-32">
        <div className="max-w-5xl mx-auto glass-dark rounded-[3rem] py-20 px-12 text-center text-white relative overflow-hidden">
          <div className="absolute top-[-50%] right-[-10%] w-[60%] h-[100%] bg-crimson-600/20 blur-[100px] animate-float" />
          <h2 className="text-5xl font-bold mb-6 font-header">
            Start Your <span className="text-crimson-500">Lifesaving</span> Journey
          </h2>
          <p className="text-neutral-400 text-xl font-medium mb-12 max-w-xl mx-auto">
            Join the most technologically advanced blood network. It takes less than 2 minutes.
          </p>
          <div className="flex flex-wrap justify-center gap-6">
            <Link to="/register/donor" className="btn-primary px-12 py-5 text-lg flex items-center gap-3">
              Get Started Free <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

function FeatureCard({ icon, title, desc, delay = "0s" }) {
  return (
    <div className="group glass p-10 rounded-[2.5rem] hover:border-crimson-100 transition-all duration-500 hover:-translate-y-2 animate-fade-in-up" style={{ animationDelay: delay }}>
      <div className="w-16 h-16 rounded-[1.25rem] bg-crimson-50 text-crimson-600 flex items-center justify-center mb-8 group-hover:scale-110 group-hover:bg-crimson-600 group-hover:text-white transition-all duration-500">
        {icon}
      </div>
      <h3 className="text-2xl font-bold text-neutral-900 mb-4 font-header">{title}</h3>
      <p className="text-neutral-500 leading-relaxed font-medium">
        {desc}
      </p>
    </div>
  );
}

function Stat({ value, label }) {
  return (
    <div className="text-center group">
      <div className="text-5xl font-black text-white mb-3 group-hover:text-crimson-500 transition-colors duration-500 font-header">{value}</div>
      <div className="text-xs text-neutral-400 uppercase tracking-widest font-bold">{label}</div>
    </div>
  );
}
