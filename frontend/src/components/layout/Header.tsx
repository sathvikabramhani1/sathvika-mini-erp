import React from 'react';
import { 
  LogOut, 
  Search, 
  Activity, 
  LayoutDashboard, 
  Users, 
  Package, 
  History, 
  FileSpreadsheet, 
  Leaf,
  ShieldCheck
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
    { id: 'dashboard', label: 'Overview', icon: LayoutDashboard },
    { id: 'customers', label: 'Customer CRM', icon: Users },
    { id: 'products', label: 'Product & Stock', icon: Package },
    { id: 'stock-logs', label: 'Stock Audit', icon: History },
    { id: 'challans', label: 'Sales Challans', icon: FileSpreadsheet },
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
              background: 'linear-gradient(135deg, #10b981 0%, #047857 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 16px rgba(16, 185, 129, 0.4)',
              border: '1px solid rgba(255, 255, 255, 0.25)'
            }}
          >
            <Leaf size={22} color="#ffffff" />
          </div>
          <div>
            <div style={{ fontWeight: 800, fontSize: '18px', letterSpacing: '-0.02em', color: '#ffffff' }}>
              Mini ERP + CRM <span style={{ color: '#fbbf24', fontSize: '15px', fontWeight: 600 }}>Portal</span>
            </div>
            <div style={{ fontSize: '10px', color: '#a7f3d0', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 700 }}>
              Sathvika Organics B2B Operations Suite
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
            background: 'rgba(9, 29, 20, 0.7)',
            borderColor: 'rgba(16, 185, 129, 0.3)',
            color: '#a7f3d0',
          }}
          title="Global Quick Search (Ctrl + K)"
        >
          <Search size={15} color="#10b981" />
          <span>Quick actions & jump...</span>
          <kbd style={{
            fontSize: '11px',
            background: 'rgba(255, 255, 255, 0.1)',
            padding: '2px 6px',
            borderRadius: '4px',
            color: '#ffffff'
          }}>Ctrl K</kbd>
        </button>

        {/* Authenticated User Status & Profile */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(9, 29, 20, 0.8)', padding: '6px 12px', borderRadius: '12px', border: '1px solid rgba(16, 185, 129, 0.25)' }}>
            <ShieldCheck size={16} color="#10b981" />
            <div style={{ fontSize: '12px', color: '#e2e8f0' }}>
              Role: <strong style={{ color: '#fbbf24' }}>{user?.role}</strong>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', borderLeft: '1px solid rgba(255,255,255,0.1)', paddingLeft: '14px' }}>
            <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'linear-gradient(135deg, #10b981, #d97706)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ffffff', fontWeight: 700, fontSize: '13px' }}>
              {user?.name?.charAt(0) || 'S'}
            </div>
            <div>
              <div style={{ fontSize: '12px', fontWeight: 700, color: '#ffffff' }}>{user?.name}</div>
              <div style={{ fontSize: '10px', color: '#a7f3d0' }}>{user?.email}</div>
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

      {/* Bottom Row: Studio Horizontal Navigation Tabs */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid rgba(16, 185, 129, 0.15)', paddingTop: '10px' }}>
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
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: '#34d399', background: 'rgba(16, 185, 129, 0.12)', padding: '4px 10px', borderRadius: '9999px', border: '1px solid rgba(16, 185, 129, 0.25)' }}>
          <Activity size={12} />
          <span>PostgreSQL Cluster Connected</span>
        </div>
      </div>
    </header>
  );
};
