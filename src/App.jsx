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
import { LanguageProvider } from './LanguageContext';

function App() {
  const [user, setUser] = useState(null);

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
        <Navbar user={user} onLogout={handleLogout} />
        {user ? (
          user.role === 'admin' ? (
            <AdminDashboard user={user} onLogout={handleLogout} />
          ) : (
            <Dashboard user={user} onLogout={handleLogout} />
          )
        ) : (
          <>
            <Hero />
            <Services />
            <InvestmentPlans />
            <Insights />
            <AboutUs />
            <Contact />
          </>
        )}
        <Footer />
      </div>
    </LanguageProvider>
  );
}

export default App;
