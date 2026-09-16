import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import { Header } from './components/layout/Header';
import { DashboardPage } from './pages/DashboardPage';
import { EnquiriesPage } from './pages/EnquiriesPage';
import { QuotationsPage } from './pages/QuotationsPage';
import { SalesOrdersPage } from './pages/SalesOrdersPage';
import { CustomersPage } from './pages/CustomersPage';
import { ProductsPage } from './pages/ProductsPage';
import { LoginPage } from './pages/LoginPage';
import { CommandPalette } from './components/CommandPalette';
import { ErrorBoundary } from './components/ErrorBoundary';

const MainLayout: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const [currentTab, setCurrentTab] = useState('enquiries');
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);

  if (isLoading) {
    return (
      <div
        style={{
          height: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#0f172a',
          color: '#ffffff',
          fontFamily: 'sans-serif',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '16px', color: '#60a5fa' }}>
          <div
            style={{
              width: '18px',
              height: '18px',
              borderRadius: '50%',
              border: '2px solid #3b82f6',
              borderTopColor: 'transparent',
              animation: 'spin 0.8s linear infinite',
            }}
          />
          <span>Initializing Sathvika Mini ERP Suite...</span>
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
        <ErrorBoundary>
          {currentTab === 'dashboard' && <DashboardPage onNavigate={setCurrentTab} />}
          {currentTab === 'enquiries' && <EnquiriesPage />}
          {currentTab === 'quotations' && <QuotationsPage />}
          {currentTab === 'sales-orders' && <SalesOrdersPage />}
          {currentTab === 'customers' && <CustomersPage />}
          {currentTab === 'products' && <ProductsPage />}
        </ErrorBoundary>
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
    <ErrorBoundary fallbackTitle="Sathvika Mini ERP Portal Initializer">
      <AuthProvider>
        <ToastProvider>
          <MainLayout />
        </ToastProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
};

export default App;
