import React from 'react';
import {
  LogOut,
  Search,
  Activity,
  LayoutDashboard,
  FileQuestion,
  Calculator,
  ShoppingCart,
  Package,
  Users,
  ShieldCheck,
  Building2,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface HeaderProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  onOpenCommandPalette?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ currentTab, setCurrentTab, onOpenCommandPalette }) => {
  const { user, logout } = useAuth();

  const navTabs = [
    { id: 'dashboard', label: 'Workflow Overview', icon: LayoutDashboard },
    { id: 'enquiries', label: '1. Enquiries', icon: FileQuestion },
    { id: 'quotations', label: '2. Quotations', icon: Calculator },
    { id: 'sales-orders', label: '3. Sales Orders & Stock', icon: ShoppingCart },
    { id: 'products', label: 'Product Master', icon: Package },
    { id: 'customers', label: 'Customers', icon: Users },
  ];

  return (
    <header className="top-studio-nav">
      {/* Top Row: Brand, Search, User Role & Profile */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
        {/* Brand Crest */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #1e3a8a 0%, #2563eb 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 16px rgba(37, 99, 235, 0.35)',
              border: '1px solid rgba(255, 255, 255, 0.25)',
            }}
          >
            <Building2 size={22} color="#ffffff" />
          </div>
          <div>
            <div style={{ fontWeight: 800, fontSize: '18px', letterSpacing: '-0.02em', color: '#ffffff' }}>
              Sathvika <span style={{ color: '#60a5fa', fontSize: '15px', fontWeight: 600 }}>Mini ERP</span>
            </div>
            <div style={{ fontSize: '10px', color: '#93c5fd', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 700 }}>
              PERN Full-Stack Technical Case Study
            </div>
          </div>
        </div>

        {/* Global Search Button */}
        <button
          onClick={onOpenCommandPalette}
          className="btn btn-secondary"
          style={{
            padding: '7px 16px',
            fontSize: '13px',
            gap: '10px',
            background: 'rgba(15, 23, 42, 0.7)',
            borderColor: 'rgba(59, 130, 246, 0.3)',
            color: '#bfdbfe',
          }}
          title="Global Quick Search (Ctrl + K)"
        >
          <Search size={15} color="#60a5fa" />
          <span>Quick actions & jump...</span>
          <kbd
            style={{
              fontSize: '11px',
              background: 'rgba(255, 255, 255, 0.1)',
              padding: '2px 6px',
              borderRadius: '4px',
              color: '#ffffff',
            }}
          >
            Ctrl K
          </kbd>
        </button>

        {/* Authenticated User Status & Profile */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              background: 'rgba(15, 23, 42, 0.8)',
              padding: '6px 12px',
              borderRadius: '12px',
              border: '1px solid rgba(59, 130, 246, 0.25)',
            }}
          >
            <ShieldCheck size={16} color="#60a5fa" />
            <div style={{ fontSize: '12px', color: '#e2e8f0' }}>
              Role: <strong style={{ color: '#fbbf24' }}>{user?.role}</strong>
            </div>
          </div>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              borderLeft: '1px solid rgba(255,255,255,0.1)',
              paddingLeft: '14px',
            }}
          >
            <div
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                background: 'linear-gradient(135deg, #2563eb, #7c3aed)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#ffffff',
                fontWeight: 700,
                fontSize: '13px',
              }}
            >
              {user?.name?.charAt(0) || 'S'}
            </div>
            <div>
              <div style={{ fontSize: '12px', fontWeight: 700, color: '#ffffff' }}>{user?.name}</div>
              <div style={{ fontSize: '10px', color: '#93c5fd' }}>{user?.email}</div>
            </div>
            <button
              onClick={logout}
              className="btn btn-secondary btn-sm"
              style={{ padding: '5px 8px', color: '#fb7185', borderColor: 'rgba(244, 63, 94, 0.3)' }}
              title="Sign Out"
            >
              <LogOut size={13} />
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Row: Horizontal Navigation Tabs */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderTop: '1px solid rgba(59, 130, 246, 0.2)',
          paddingTop: '10px',
        }}
      >
        <nav className="nav-tabs-bar">
          {navTabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = currentTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setCurrentTab(tab.id)}
                className={`studio-tab-btn ${isActive ? 'active' : ''}`}
              >
                <Icon size={16} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Operational Pulse */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: '11px',
            color: '#60a5fa',
            background: 'rgba(37, 99, 235, 0.15)',
            padding: '4px 10px',
            borderRadius: '9999px',
            border: '1px solid rgba(37, 99, 235, 0.3)',
          }}
        >
          <Activity size={12} />
          <span>PERN Workflow Operational</span>
        </div>
      </div>
    </header>
  );
};
