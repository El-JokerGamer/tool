import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
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
  const { isAuthenticated } = useAuth();
  const [authPage, setAuthPage] = useState<'login' | 'signup'>('login');
  const [currentPage, setCurrentPage] = useState('country');

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
      <Sidebar currentPage={currentPage} onNavigate={setCurrentPage} />
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
