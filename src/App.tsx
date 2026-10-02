import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { countriesService } from './services/supabaseService';
import type { Country } from './services/supabaseService';
import Login from './pages/Login';
import Signup from './pages/Signup';
import CountryDashboard from './pages/CountryDashboard';
import GlobalDashboard from './pages/GlobalDashboard';
import MarketPage from './pages/MarketPage';
import JobsPage from './pages/JobsPage';
import TreasuryPage from './pages/TreasuryPage';
import AdminPanel from './pages/AdminPanel';
import Sidebar from './components/Sidebar';

const AppContent: React.FC = () => {
  const { isAuthenticated, isLoading, user } = useAuth();
  const [authPage, setAuthPage] = useState<'login' | 'signup'>('login');
  const [currentPage, setCurrentPage] = useState('country');
  const [country, setCountry] = useState<Country | null>(null);

  // Fetch user's country data
  useEffect(() => {
    if (user?.country_id) {
      countriesService.getById(user.country_id).then(({ data }) => {
        if (data) setCountry(data);
      });
    }
  }, [user]);

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-indigo-500 to-emerald-500 flex items-center justify-center mb-4 animate-pulse">
            <i className="fa-solid fa-chart-line text-white text-2xl"></i>
          </div>
          <h2 className="text-xl font-bold gradient-text mb-2">Eclesiar Economic Dashboard</h2>
          <p className="text-slate-400 text-sm">جاري التحميل...</p>
          <div className="mt-4 flex items-center justify-center gap-2">
            <div className="w-2 h-2 rounded-full bg-indigo-400 animate-bounce" style={{ animationDelay: '0ms' }}></div>
            <div className="w-2 h-2 rounded-full bg-indigo-400 animate-bounce" style={{ animationDelay: '150ms' }}></div>
            <div className="w-2 h-2 rounded-full bg-indigo-400 animate-bounce" style={{ animationDelay: '300ms' }}></div>
          </div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    if (authPage === 'signup') {
      return <Signup onSwitchToLogin={() => setAuthPage('login')} />;
    }
    return <Login onSwitchToSignup={() => setAuthPage('signup')} onLoginSuccess={() => {}} />;
  }

  const renderPage = () => {
    switch (currentPage) {
      case 'country': return <CountryDashboard />;
      case 'global': return <GlobalDashboard />;
      case 'market': return <MarketPage />;
      case 'jobs': return <JobsPage />;
      case 'treasury': return <TreasuryPage />;
      case 'admin': return <AdminPanel />;
      default: return <CountryDashboard />;
    }
  };

  return (
    <div className="min-h-screen flex">
      <Sidebar currentPage={currentPage} onNavigate={setCurrentPage} country={country} />
      <main className="flex-1 mr-64 p-6 lg:p-8">
        {renderPage()}
      </main>
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
