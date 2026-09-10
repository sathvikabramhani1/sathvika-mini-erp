import React from 'react';
import {
  LayoutDashboard,
  Users,
  Package,
  History,
  FileSpreadsheet,
  Boxes,
  Sparkles,
  Command
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface SidebarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  onOpenCommandPalette?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentTab, setCurrentTab, onOpenCommandPalette }) => {
  const { user } = useAuth();

  const navItems = [
    { id: 'dashboard', label: 'Overview', icon: LayoutDashboard, badge: null },
    { id: 'customers', label: 'Customers CRM', icon: Users, badge: 'Active' },
    { id: 'products', label: 'Products & Stock', icon: Package, badge: null },
    { id: 'stock-logs', label: 'Stock Movements', icon: History, badge: 'Audit' },
    { id: 'challans', label: 'Sales Challans', icon: FileSpreadsheet, badge: 'ACID' },
  ];

  return (
    <aside className="sidebar">
      {/* Brand Crest */}
      <div
        style={{
          padding: '24px 20px',
          display: 'flex',
          alignItems: 'center',
          gap: '14px',
          borderBottom: '1px solid rgba(139, 92, 246, 0.15)',
          background: 'linear-gradient(180deg, rgba(139, 92, 246, 0.08) 0%, transparent 100%)'
        }}
      >
        <div
          style={{
            width: '42px',
            height: '42px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #8b5cf6 0%, #4338ca 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 16px rgba(139, 92, 246, 0.45)',
            border: '1px solid rgba(255, 255, 255, 0.2)'
          }}
        >
          <Boxes size={22} color="#ffffff" />
        </div>
        <div>
          <div style={{ fontWeight: 800, fontSize: '17px', letterSpacing: '-0.02em', color: '#ffffff' }}>
            SATHVIKA<span style={{ color: '#a78bfa' }}>OPS</span>
          </div>
          <div style={{ fontSize: '10px', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 600 }}>
            Enterprise Suite
          </div>
        </div>
      </div>

      {/* Navigation Links */}
      <div style={{ padding: '18px 12px', flex: 1 }}>
        <div style={{ fontSize: '11px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', padding: '0 12px 10px', letterSpacing: '0.06em' }}>
          Operations Core
        </div>
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setCurrentTab(item.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '11px 14px',
                  borderRadius: '10px',
                  border: isActive ? '1px solid rgba(139, 92, 246, 0.4)' : '1px solid transparent',
                  background: isActive ? 'var(--bg-sidebar-active)' : 'transparent',
                  color: isActive ? '#ffffff' : '#94a3b8',
                  fontWeight: isActive ? 700 : 500,
                  fontSize: '14px',
                  cursor: 'pointer',
                  transition: 'var(--transition)',
                  textAlign: 'left',
                  boxShadow: isActive ? '0 4px 14px rgba(139, 92, 246, 0.2)' : 'none',
                }}
                onMouseEnter={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.backgroundColor = 'rgba(139, 92, 246, 0.1)';
                    e.currentTarget.style.color = '#ffffff';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.backgroundColor = 'transparent';
                    e.currentTarget.style.color = '#94a3b8';
                  }
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <Icon size={19} color={isActive ? '#8b5cf6' : '#64748b'} />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span style={{
                    fontSize: '10px',
                    fontWeight: 700,
                    padding: '2px 7px',
                    borderRadius: '9999px',
                    background: isActive ? 'rgba(139, 92, 246, 0.3)' : 'rgba(255, 255, 255, 0.06)',
                    color: isActive ? '#c4b5fd' : '#64748b',
                  }}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom Shortcut Card */}
      <div style={{ padding: '16px', borderTop: '1px solid rgba(255, 255, 255, 0.08)' }}>
        <div
          onClick={onOpenCommandPalette}
          style={{
            padding: '12px 14px',
            background: 'rgba(16, 22, 38, 0.7)',
            border: '1px solid rgba(139, 92, 246, 0.25)',
            borderRadius: '10px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            transition: 'var(--transition)'
          }}
          onMouseEnter={e => (e.currentTarget.style.borderColor = '#8b5cf6')}
          onMouseLeave={e => (e.currentTarget.style.borderColor = 'rgba(139, 92, 246, 0.25)')}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Command size={16} color="#8b5cf6" />
            <span style={{ fontSize: '12px', fontWeight: 600, color: '#e2e8f0' }}>Command Menu</span>
          </div>
          <kbd style={{ fontSize: '10px', background: 'rgba(255,255,255,0.1)', padding: '2px 5px', borderRadius: '4px', color: '#94a3b8' }}>
            ⌘K
          </kbd>
        </div>
      </div>
    </aside>
  );
};
