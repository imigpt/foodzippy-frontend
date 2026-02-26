import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import RestaurantsSection from './components/RestaurantsSection';
import StatsSection from './components/StatsSection';
import CitiesWeServe from './components/CitiesWeServe';
import TestimonialsSection from './components/TestimonialsSection';
import PartnershipSection from './components/PartnershipSection';
import Footer from './components/Footer';
import OurStoryPage from './pages/OurStory';
import ScrollToTop from './components/ScrollToTop';
import WhatWeOffer from './components/WhatWeOffer';
import FranchiseRegistration from './pages/FranchiseRegistration';
import ServiceRegistration from './pages/ServiceRegistration';
import FranchiseInquiry from './pages/FranchiseInquiry';
import InvestorInquiry from './pages/InvestorInquiry';
import StudentCashback from './pages/StudentCashback';
import Careers from './pages/Careers';
import DeliveryPartnerRegister from './pages/DeliveryPartnerRegister';
// Agent Pages
import AgentDashboard from './pages/agent/AgentDashboard';
import AgentAttendance from './pages/agent/AgentAttendance';
import VendorTypeSelection from './pages/agent/VendorTypeSelection';
import DynamicVendorForm from './pages/agent/DynamicVendorForm';
import VendorEditForm from './pages/agent/VendorEditForm';
import AgentRequests from './pages/agent/AgentRequests';
import AgentProfile from './pages/agent/AgentProfile';
import AgentEarnings from './pages/agent/AgentEarnings';
import AgentFollowUps from './pages/agent/AgentFollowUps';
// Employee Pages (use same components with different routes)
import EmployeeDashboard from './pages/agent/EmployeeDashboard';

function PublicLayout() {
  return (
    <>
      <Navbar />
      <Outlet />
    </>
  );
}

function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      <Hero />
      <WhatWeOffer />
      <RestaurantsSection />
      <StatsSection />
      <CitiesWeServe />
      <TestimonialsSection />
      <PartnershipSection />
    </div>
  );
}

function App() {
  return (
    <Router>
      <ScrollToTop />
      <Routes>
        {/* Public routes with shared Navbar */}
        <Route element={<PublicLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/our-story" element={<OurStoryPage />} />
          <Route path="/vendor-registration" element={<FranchiseRegistration />} />
          <Route path="/service-registration" element={<ServiceRegistration />} />
          <Route path="/franchise-inquiry" element={<FranchiseInquiry />} />
          <Route path="/investor-inquiry" element={<InvestorInquiry />} />
          <Route path="/student-cashback" element={<StudentCashback />} />
          <Route path="/careers" element={<Careers />} />
          <Route path="/delivery-partner-register" element={<DeliveryPartnerRegister />} />
        </Route>
        
        {/* Agent Routes */}
        <Route path="/agent/dashboard" element={<AgentDashboard />} />
        <Route path="/agent/vendor-type" element={<VendorTypeSelection />} />
        <Route path="/agent/vendor-form" element={<DynamicVendorForm />} />
        <Route path="/agent/vendor/:id/edit" element={<VendorEditForm />} />
        <Route path="/agent/requests" element={<AgentRequests />} />
        <Route path="/agent/profile" element={<AgentProfile />} />
        <Route path="/agent/earnings" element={<AgentEarnings role="agent" />} />
        <Route path="/agent/follow-ups" element={<AgentFollowUps role="agent" />} />
        
        {/* Employee Routes */}
        <Route path="/employee/dashboard" element={<EmployeeDashboard />} />
        <Route path="/employee/attendance" element={<AgentAttendance />} />
        <Route path="/employee/vendor-type" element={<VendorTypeSelection />} />
        <Route path="/employee/vendor-form" element={<DynamicVendorForm />} />
        <Route path="/employee/vendor/:id/edit" element={<VendorEditForm />} />
        <Route path="/employee/requests" element={<AgentRequests />} />
        <Route path="/employee/profile" element={<AgentProfile />} />
        <Route path="/employee/earnings" element={<AgentEarnings role="employee" />} />
        <Route path="/employee/follow-ups" element={<AgentFollowUps role="employee" />} />
        
        {/* Vendor Routes */}
        <Route path="/vendor/vendor-form" element={<DynamicVendorForm />} />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
