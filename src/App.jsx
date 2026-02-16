import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import NewsTicker from './components/NewsTicker';
import ActivityNotifications from './components/ActivityNotifications';
import Hero from './components/Hero';
import Stats from './components/Stats';
import Services from './components/Services';
import WhyChooseUs from './components/WhyChooseUs';
import InvestmentPlans from './components/InvestmentPlans';
import MarketInfo from './components/MarketInfo';
import AboutUs from './components/AboutUs';
import Contact from './components/Contact';
import SignageSection from './components/SignageSection';
import Footer from './components/Footer';
import Dashboard from './components/Dashboard';
import AdminDashboard from './components/AdminDashboard';
import AnalyticsPage from './components/AnalyticsPage';
import LoginModal from './components/LoginModal';


// Component to handle hash scrolling
function ScrollToHash() {
  const location = useLocation();

  useEffect(() => {
    if (location.hash) {
      const element = document.querySelector(location.hash);
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);
      }
    } else if (location.pathname === '/') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [location]);

  return null;
}

function App() {
  const [user, setUser] = React.useState(null);
  const [isLoginOpen, setIsLoginOpen] = React.useState(false);

  React.useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
  };

  const HomePage = () => (
    <>
      <Hero onLoginClick={() => setIsLoginOpen(true)} />
      <Stats />
      <SignageSection />
      <Services />
      <WhyChooseUs />
      <InvestmentPlans />
      <MarketInfo />
      <AboutUs />
      <Contact />
    </>
  );

  return (
    <Router>
      <ScrollToHash />
      <div className="App">
        <Navbar user={user} onLogout={handleLogout} onLoginClick={() => setIsLoginOpen(true)} />
        <NewsTicker />
        <ActivityNotifications />

        <Routes>
          <Route path="/" element={
            user ? (
              user.role === 'admin' ? <Navigate to="/admin" replace /> : <Navigate to="/dashboard" replace />
            ) : (
              <HomePage />
            )
          } />
          <Route path="/admin" element={
            user && user.role === 'admin' ? (
              <AdminDashboard user={user} onLogout={handleLogout} />
            ) : (
              <Navigate to="/" replace />
            )
          } />
          <Route path="/dashboard" element={
            user && user.role !== 'admin' ? (
              <Dashboard user={user} onLogout={handleLogout} />
            ) : (
              <Navigate to="/" replace />
            )
          } />
          <Route path="/analytics" element={<AnalyticsPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>

        <Footer />
        <LoginModal
          isOpen={isLoginOpen}
          onClose={() => setIsLoginOpen(false)}
          onLoginSuccess={(userData) => setUser(userData)}
        />
      </div>
    </Router>
  );
}

export default App;
