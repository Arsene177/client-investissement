import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Services from './components/Services';
import InvestmentPlans from './components/InvestmentPlans';
import Insights from './components/Insights';
import AboutUs from './components/AboutUs';
import Contact from './components/Contact';
import Footer from './components/Footer';
import Dashboard from './components/Dashboard';
import AdminDashboard from './components/AdminDashboard';
import LoginModal from './components/LoginModal';
import { LanguageProvider } from './LanguageContext';

function App() {
  const [user, setUser] = useState(null);
  const [isLoginOpen, setIsLoginOpen] = useState(false);

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
  };

  return (
    <LanguageProvider>
      <div className="App">
        <Navbar user={user} onLogout={handleLogout} onLoginClick={() => setIsLoginOpen(true)} />
        {user ? (
          user.role === 'admin' ? (
            <AdminDashboard user={user} onLogout={handleLogout} />
          ) : (
            <Dashboard user={user} onLogout={handleLogout} />
          )
        ) : (
          <>
            <Hero onLoginClick={() => setIsLoginOpen(true)} />
            <Services />
            <InvestmentPlans />
            <Insights />
            <AboutUs />
            <Contact />
          </>
        )}
        <Footer />
        <LoginModal isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} />
      </div>
    </LanguageProvider>
  );
}

export default App;
