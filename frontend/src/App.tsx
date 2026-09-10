import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import { Header } from './components/layout/Header';
import { DashboardPage } from './pages/DashboardPage';
import { CustomersPage } from './pages/CustomersPage';
import { ProductsPage } from './pages/ProductsPage';
import { StockLogsPage } from './pages/StockLogsPage';
import { ChallansPage } from './pages/ChallansPage';
import { LoginPage } from './pages/LoginPage';
import { CommandPalette } from './components/CommandPalette';

const MainLayout: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const [currentTab, setCurrentTab] = useState('dashboard');
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);

  if (isLoading) {
    return (
      <div
        style={{
          height: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#05140d',
          color: '#ffffff',
          fontFamily: 'sans-serif',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '16px', color: '#34d399' }}>
          <div style={{ width: '18px', height: '18px', borderRadius: '50%', border: '2px solid #10b981', borderTopColor: 'transparent', animation: 'spin 0.8s linear infinite' }} />
          <span>Synchronizing Sathvika Organics cluster...</span>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <LoginPage />;
  }

  return (
    <div className="app-container">
      {/* Studio Top-Navigation Bar */}
      <Header 
        currentTab={currentTab} 
        setCurrentTab={setCurrentTab} 
        onOpenCommandPalette={() => setIsCommandPaletteOpen(true)} 
      />

      <div className="main-content">
        {currentTab === 'dashboard' && <DashboardPage onNavigate={setCurrentTab} />}
        {currentTab === 'customers' && <CustomersPage />}
        {currentTab === 'products' && <ProductsPage />}
        {currentTab === 'stock-logs' && <StockLogsPage />}
        {currentTab === 'challans' && <ChallansPage />}
      </div>

      <CommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        onNavigate={setCurrentTab}
      />
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <AuthProvider>
      <ToastProvider>
        <MainLayout />
      </ToastProvider>
    </AuthProvider>
  );
};

export default App;
