import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Login from './pages/Login';
import RegisterDonor from './pages/RegisterDonor';
import RegisterHospital from './pages/RegisterHospital';
import DonorDashboard from './pages/DonorDashboard';
import BookAppointment from './pages/BookAppointment';
import HospitalDashboard from './pages/HospitalDashboard';
import HospitalInventory from './pages/HospitalInventory';
import HospitalRequests from './pages/HospitalRequests';
import HospitalDonate from './pages/HospitalDonate';
import DonorEligibility from './pages/DonorEligibility';
import DonorNeeds from './pages/DonorNeeds';
import AIAssistant from './pages/AIAssistant';
import ProtectedRoute from './components/ProtectedRoute';

export default function App() {
  return (
    <Router>
      <div className="min-h-screen font-sans flex flex-col transition-colors duration-300">
        <Navbar />
        <main className="flex-1 flex flex-col pt-16">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register/donor" element={<RegisterDonor />} />
            <Route path="/register/hospital" element={<RegisterHospital />} />
            
            {/* Donor Routes */}
            <Route path="/dashboard/donor" element={<ProtectedRoute allowedRole="donor"><DonorDashboard /></ProtectedRoute>} />
            <Route path="/donor/book-appointment" element={<ProtectedRoute allowedRole="donor"><BookAppointment /></ProtectedRoute>} />
            <Route path="/donor/eligibility" element={<ProtectedRoute allowedRole="donor"><DonorEligibility /></ProtectedRoute>} />
            <Route path="/donor/urgent-needs" element={<ProtectedRoute allowedRole="donor"><DonorNeeds /></ProtectedRoute>} />
            
            {/* Hospital Routes */}
            <Route path="/dashboard/hospital" element={<ProtectedRoute allowedRole="hospital"><HospitalDashboard /></ProtectedRoute>} />
            <Route path="/hospital/inventory" element={<ProtectedRoute allowedRole="hospital"><HospitalInventory /></ProtectedRoute>} />
            <Route path="/hospital/requests" element={<ProtectedRoute allowedRole="hospital"><HospitalRequests /></ProtectedRoute>} />
            <Route path="/hospital/donate" element={<ProtectedRoute allowedRole="hospital"><HospitalDonate /></ProtectedRoute>} />
            
            {/* Shared Authenticated Routes */}
            <Route path="/ai-assistant" element={
              <ProtectedRoute allowedRole="donor">
                <AIAssistant />
              </ProtectedRoute>
            } />
            {/* We can just not pass allowedRole if we want it for both, wait ProtectedRoute needs allowedRole. Let me make it just check if user exists. We'll add two routes or we can update ProtectedRoute to accept an array, or just not check role if not passed. Since the original ProtectedRoute required a string, I'll just render it outside of ProtectedRoute or copy the component without allowedRole. Actually, better yet: just duplicate it. */}
            <Route path="/donor/ai-assistant" element={<ProtectedRoute allowedRole="donor"><AIAssistant /></ProtectedRoute>} />
            <Route path="/hospital/ai-assistant" element={<ProtectedRoute allowedRole="hospital"><AIAssistant /></ProtectedRoute>} />

          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}
