import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Heart, Menu, X, ChevronDown, LogOut, User, LayoutDashboard, Database, ClipboardList, PlusCircle, Sparkles, Bell, Moon, Sun } from 'lucide-react';
import axios from 'axios';
import useAuthStore from '../store/authStore';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { isAuthenticated, logout, user } = useAuthStore();
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    return localStorage.getItem('theme') === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches);
  });
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  const toggleTheme = () => setIsDarkMode(!isDarkMode);

  useEffect(() => {
    if (isAuthenticated) {
      const fetchNotifications = async () => {
        try {
          const res = await axios.get('/api/auth/notifications', {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
          });
          setNotifications(res.data);
        } catch (err) {
          console.error('Failed to fetch notifications');
        }
      };
      fetchNotifications();
      const interval = setInterval(fetchNotifications, 30000); // 30s polling
      return () => clearInterval(interval);
    }
  }, [isAuthenticated]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAsRead = async (id) => {
    try {
      await axios.put(`/api/auth/notifications/${id}/read`, {}, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setNotifications(prev => prev.map(n => n._id === id ? { ...n, read: true } : n));
    } catch (err) {
      console.error('Failed to mark read');
    }
  };

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const NavLink = ({ to, children }) => (
    <Link 
      to={to} 
      className={`text-sm font-semibold transition-all duration-300 ${
        location.pathname === to 
          ? 'text-crimson-600 dark:text-crimson-500' 
          : 'text-neutral-500 dark:text-neutral-400 hover:text-crimson-600 dark:hover:text-crimson-400'
      }`}
    >
      {children}
    </Link>
  );

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
      scrolled ? 'py-3' : 'py-5'
    }`}>
      <div className={`max-w-6xl mx-auto px-6 h-16 flex items-center justify-between transition-all duration-500 ${
        scrolled ? 'glass rounded-[2rem] mx-6' : 'bg-transparent'
      }`}>
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-crimson-600 flex items-center justify-center shadow-lg shadow-crimson-200 dark:shadow-none group-hover:scale-110 transition-transform duration-300">
            <Heart className="w-5 h-5 text-white fill-white animate-pulse" />
          </div>
          <span className="text-xl font-bold text-neutral-900 dark:text-white tracking-tight font-header relative z-10 transition-colors duration-300">
            Donor<span className="text-crimson-600">Net</span>
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8">
          {isAuthenticated ? (
            <>
              <div className="relative group">
                <button className="text-sm font-bold text-neutral-700 dark:text-neutral-200 hover:text-crimson-600 dark:hover:text-crimson-500 transition-all flex items-center gap-2 py-4">
                  <User className="w-4 h-4" />
                  {user?.profile?.name || user?.profile?.hospitalName || 'My Account'}
                  <ChevronDown className="w-4 h-4 group-hover:rotate-180 transition-transform duration-300" />
                </button>
                <div className="absolute right-0 top-full pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50">
                  <div className="w-56 glass p-2 rounded-2xl">
                    {user?.role === 'donor' ? (
                      <>
                        <DropdownLink to="/dashboard/donor" icon={<LayoutDashboard />}>Dashboard</DropdownLink>
                        <DropdownLink to="/donor/eligibility" icon={<ClipboardList />}>My Eligibility</DropdownLink>
                        <DropdownLink to="/donor/urgent-needs" icon={<Sparkles />}>Urgent Needs</DropdownLink>
                        <DropdownLink to="/donor/ai-assistant" icon={<Sparkles className="text-crimson-500" />}>AI Assistant</DropdownLink>
                      </>
                    ) : (
                      <>
                        <DropdownLink to="/dashboard/hospital" icon={<LayoutDashboard />}>Dashboard</DropdownLink>
                        <DropdownLink to="/hospital/inventory" icon={<Database />}>My Inventory</DropdownLink>
                        <DropdownLink to="/hospital/requests" icon={<ClipboardList />}>My Requests</DropdownLink>
                        <DropdownLink to="/hospital/donate" icon={<PlusCircle />}>Donate Blood</DropdownLink>
                        <DropdownLink to="/hospital/ai-assistant" icon={<Sparkles className="text-crimson-500" />}>AI Assistant</DropdownLink>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Theme Toggle */}
              <button 
                onClick={toggleTheme}
                className="p-3 mr-2 rounded-xl bg-neutral-100/50 text-neutral-500 hover:text-crimson-600 hover:bg-crimson-50 transition-all dark:bg-[#111] dark:text-neutral-400 dark:hover:text-crimson-400 dark:hover:bg-[#222]"
              >
                {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>

              {/* Notifications Bell */}
              <div className="relative">
                <button 
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="p-3 rounded-xl bg-neutral-100/50 text-neutral-500 hover:text-crimson-600 hover:bg-crimson-50 transition-all dark:bg-[#111] dark:hover:bg-[#222] relative"
                >
                  <Bell className="w-5 h-5" />
                  {unreadCount > 0 && (
                    <span className="absolute top-2 right-2 w-4 h-4 bg-crimson-600 text-white text-[8px] font-black flex items-center justify-center rounded-full animate-bounce">
                      {unreadCount}
                    </span>
                  )}
                </button>
                
                {showNotifications && (
                  <div className="absolute right-0 top-full mt-4 w-80 glass rounded-[2rem] p-4 shadow-2xl z-[100] animate-fade-in-up">
                    <div className="flex items-center justify-between px-4 py-2 border-b border-neutral-100 mb-4">
                      <h4 className="text-xs font-black text-neutral-900 uppercase tracking-widest">Notifications</h4>
                      <span className="text-[10px] font-bold text-crimson-600">{unreadCount} Unread</span>
                    </div>
                    <div className="max-h-64 overflow-y-auto space-y-2 pr-2 custom-scrollbar">
                      {notifications.length > 0 ? (
                        notifications.map(n => (
                          <div 
                            key={n._id} 
                            onClick={() => {
                              markAsRead(n._id);
                              if (n.link) navigate(n.link);
                              setShowNotifications(false);
                            }}
                            className={`p-4 rounded-2xl transition-all cursor-pointer ${n.read ? 'bg-neutral-50 dark:bg-[#111]' : 'bg-white dark:bg-[#0a0a0a] border border-crimson-100 dark:border-[#222] shadow-sm dark:shadow-none'}`}
                          >
                            <p className="text-xs font-bold text-neutral-900 dark:text-white mb-1">{n.title}</p>
                            <p className="text-[10px] font-medium text-neutral-500 dark:text-neutral-400 leading-tight">{n.message}</p>
                          </div>
                        ))
                      ) : (
                        <div className="py-8 text-center text-[10px] font-bold text-neutral-400 uppercase tracking-widest">No notifications</div>
                      )}
                    </div>
                  </div>
                )}
              </div>
              <button 
                onClick={logout}
                className="btn-primary py-2 px-5 text-xs flex items-center gap-2">
                <LogOut className="w-3.5 h-3.5" />
                Log Out
              </button>
            </>
          ) : (
            <>
              <NavLink to="/login">Log In</NavLink>
              <Link to="/register/donor" className="btn-primary py-2.5 px-6 text-sm">
                Get Started
              </Link>
            </>
          )}
        </div>

        {/* Mobile Hamburger & Theme Toggle */}
        <div className="md:hidden flex items-center gap-2">
          <button 
            onClick={toggleTheme}
            className="p-2 rounded-xl text-neutral-500 hover:bg-neutral-100 transition-colors dark:text-neutral-400 dark:hover:bg-[#111]"
          >
            {isDarkMode ? <Sun className="w-6 h-6" /> : <Moon className="w-6 h-6" />}
          </button>
          <button
            className="p-2 rounded-xl hover:bg-neutral-100 transition-colors dark:hover:bg-[#111] dark:text-white"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-full left-6 right-6 mt-2 glass p-6 rounded-3xl space-y-4 animate-fade-in-up">
          {isAuthenticated ? (
            <>
              <div className="pb-4 border-b border-neutral-100 dark:border-[#222] mb-4">
                <p className="text-xs font-bold text-neutral-400 uppercase tracking-widest mb-1">Signed in as</p>
                <p className="text-lg font-bold text-neutral-900 dark:text-white">{user?.profile?.name || user?.profile?.hospitalName}</p>
              </div>
              {user?.role === 'donor' ? (
                <>
                  <MobileLink onClick={() => setMobileMenuOpen(false)} to="/dashboard/donor">Dashboard</MobileLink>
                  <MobileLink onClick={() => setMobileMenuOpen(false)} to="/donor/eligibility">My Eligibility</MobileLink>
                  <MobileLink onClick={() => setMobileMenuOpen(false)} to="/donor/urgent-needs">Urgent Needs</MobileLink>
                  <MobileLink onClick={() => setMobileMenuOpen(false)} to="/donor/ai-assistant">AI Assistant</MobileLink>
                </>
              ) : (
                <>
                  <MobileLink onClick={() => setMobileMenuOpen(false)} to="/dashboard/hospital">Dashboard</MobileLink>
                  <MobileLink onClick={() => setMobileMenuOpen(false)} to="/hospital/inventory">My Inventory</MobileLink>
                  <MobileLink onClick={() => setMobileMenuOpen(false)} to="/hospital/requests">My Requests</MobileLink>
                  <MobileLink onClick={() => setMobileMenuOpen(false)} to="/hospital/donate">Donate Blood</MobileLink>
                  <MobileLink onClick={() => setMobileMenuOpen(false)} to="/hospital/ai-assistant">AI Assistant</MobileLink>
                </>
              )}
              <button onClick={() => { logout(); setMobileMenuOpen(false); }} className="w-full py-3 mt-4 text-sm font-bold text-crimson-600 bg-crimson-50 rounded-xl flex items-center justify-center gap-2">
                <LogOut className="w-4 h-4" />
                Log Out
              </button>
            </>
          ) : (
            <>
              <Link onClick={() => setMobileMenuOpen(false)} to="/login" className="block w-full py-3 text-center text-sm font-bold text-neutral-700 dark:text-neutral-200">Log In</Link>
              <Link onClick={() => setMobileMenuOpen(false)} to="/register/donor" className="btn-primary w-full block text-center">Get Started</Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
}

function DropdownLink({ to, children, icon }) {
  return (
    <Link to={to} className="flex items-center gap-3 px-4 py-3 text-sm font-semibold text-neutral-600 dark:text-neutral-300 hover:bg-crimson-50 dark:hover:bg-crimson-900/30 hover:text-crimson-600 dark:hover:text-crimson-400 rounded-xl transition-all duration-200">
      {icon && <span className="w-4 h-4">{icon}</span>}
      {children}
    </Link>
  );
}

function MobileLink({ to, children, onClick }) {
  return (
    <Link onClick={onClick} to={to} className="block w-full py-3 text-sm font-bold text-neutral-700 dark:text-neutral-300 hover:text-crimson-600 dark:hover:text-crimson-400 transition-colors">
      {children}
    </Link>
  );
}
