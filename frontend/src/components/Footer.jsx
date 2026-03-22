import { Link } from 'react-router-dom';
import { Heart, Github, Twitter, Linkedin, Mail } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-white border-t border-neutral-100 pt-20 pb-10 px-8 relative overflow-hidden">
      {/* Decorative Blobs */}
      <div className="absolute bottom-[-10%] left-[-5%] w-[30%] h-[50%] bg-crimson-50/50 rounded-full blur-[80px]" />
      
      <div className="max-w-6xl mx-auto relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          {/* Brand Col */}
          <div className="col-span-1 md:col-span-1">
            <Link to="/" className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 rounded-lg bg-crimson-600 flex items-center justify-center">
                <Heart className="w-4 h-4 text-white fill-white" />
              </div>
              <span className="text-xl font-bold text-neutral-900 tracking-tight font-header">
                Donor<span className="text-crimson-600">Net</span>
              </span>
            </Link>
            <p className="text-sm font-medium text-neutral-500 leading-relaxed">
              Empowering the world's blood donation network through real-time technology and community action.
            </p>
          </div>

          {/* Links Col 1 */}
          <div>
            <h4 className="text-sm font-bold text-neutral-900 uppercase tracking-widest mb-6 font-header">Platform</h4>
            <ul className="space-y-4 text-sm font-medium text-neutral-500">
              <li><Link to="/register/donor" className="hover:text-crimson-600 transition-colors">Become a Donor</Link></li>
              <li><Link to="/register/hospital" className="hover:text-crimson-600 transition-colors">Hospital Partners</Link></li>
              <li><Link to="/donor/urgent-needs" className="hover:text-crimson-600 transition-colors">Emergency Needs</Link></li>
            </ul>
          </div>

          {/* Links Col 2 */}
          <div>
            <h4 className="text-sm font-bold text-neutral-900 uppercase tracking-widest mb-6 font-header">Resources</h4>
            <ul className="space-y-4 text-sm font-medium text-neutral-500">
              <li><Link to="/donor/eligibility" className="hover:text-crimson-600 transition-colors">Eligibility Guide</Link></li>
              <li><Link to="/donor/ai-assistant" className="hover:text-crimson-600 transition-colors">AI Assistant</Link></li>
              <li><a href="#" className="hover:text-crimson-600 transition-colors">Help Center</a></li>
            </ul>
          </div>

          {/* Newsletters / Social */}
          <div>
            <h4 className="text-sm font-bold text-neutral-900 uppercase tracking-widest mb-6 font-header">Connect</h4>
            <div className="flex gap-4">
              <SocialIcon icon={<Twitter />} />
              <SocialIcon icon={<Linkedin />} />
              <SocialIcon icon={<Github />} />
              <SocialIcon icon={<Mail />} />
            </div>
          </div>
        </div>

        <div className="pt-10 border-t border-neutral-100 flex flex-col md:flex-row items-center justify-between gap-6">
          <p className="text-xs font-bold text-neutral-400 uppercase tracking-widest">
            &copy; 2026 DonorNet. Project of fearsomecity.
          </p>
          <div className="flex gap-8 text-xs font-bold text-neutral-400 uppercase tracking-widest">
            <a href="#" className="hover:text-neutral-900 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-neutral-900 transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

function SocialIcon({ icon }) {
  return (
    <a href="#" className="w-10 h-10 rounded-xl bg-neutral-50 flex items-center justify-center text-neutral-400 hover:bg-crimson-600 hover:text-white hover:scale-110 transition-all duration-300 shadow-sm">
      <span className="w-5 h-5">{icon}</span>
    </a>
  );
}
