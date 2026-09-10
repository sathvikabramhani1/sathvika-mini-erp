import React from 'react';
import { LogOut, UserCircle2, Sparkles, Search, Activity } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { UserRole } from '../../types';
import { useToast } from '../../context/ToastContext';

interface HeaderProps {
  onOpenCommandPalette?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenCommandPalette }) => {
  const { user, logout, switchRole } = useAuth();
  const { success } = useToast();

  const roles: { role: UserRole; label: string; desc: string }[] = [
    { role: 'ADMIN', label: 'Admin', desc: 'Full Access' },
    { role: 'SALES', label: 'Sales', desc: 'CRM & Orders' },
    { role: 'WAREHOUSE', label: 'Warehouse', desc: 'Stock Adjust' },
    { role: 'ACCOUNTS', label: 'Accounts', desc: 'Invoices' },
  ];

  const handleRoleSwitch = async (role: UserRole) => {
    await switchRole(role);
    success(`Switched role to ${role}`);
  };

  return (
    <header className="top-header">
      {/* Search & Command Palette Trigger */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <button
          onClick={onOpenCommandPalette}
          className="btn btn-secondary"
          style={{
            padding: '7px 14px',
            fontSize: '13px',
            gap: '10px',
            background: 'rgba(16, 22, 38, 0.7)',
            borderColor: 'rgba(139, 92, 246, 0.25)',
            color: '#94a3b8',
          }}
          title="Global Quick Search (Ctrl + K)"
        >
          <Search size={15} color="#8b5cf6" />
          <span>Quick actions & jump...</span>
          <kbd style={{
            fontSize: '11px',
            background: 'rgba(255, 255, 255, 0.1)',
            padding: '2px 6px',
            borderRadius: '4px',
            color: '#cbd5e1'
          }}>Ctrl K</kbd>
        </button>

        {/* Live Operational Status Indicator */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: '#34d399', background: 'rgba(16, 185, 129, 0.1)', padding: '4px 10px', borderRadius: '9999px', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
          <Activity size={12} className="pulse-icon" />
          <span>Live 24/7 Cluster</span>
        </div>
      </div>

      {/* 1-Click Role Switcher & User Profile */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <div className="demo-role-bar">
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', paddingLeft: '6px', color: '#f59e0b', fontSize: '11px', fontWeight: 700 }}>
            <Sparkles size={13} />
            <span style={{ textTransform: 'uppercase', letterSpacing: '0.04em' }}>Role:</span>
          </div>
          {roles.map((r) => {
            const isActive = user?.role === r.role;
            return (
              <button
                key={r.role}
                onClick={() => handleRoleSwitch(r.role)}
                className={`role-pill-btn ${isActive ? 'active' : ''}`}
                title={`${r.label}: ${r.desc}`}
              >
                {r.label}
              </button>
            );
          })}
        </div>

        {/* User Profile Info & Sign Out */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', borderLeft: '1px solid rgba(255,255,255,0.1)', paddingLeft: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '34px', height: '34px', borderRadius: '10px', background: 'linear-gradient(135deg, #8b5cf6, #3b82f6)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ffffff', fontWeight: 700, fontSize: '14px', boxShadow: '0 2px 8px rgba(139, 92, 246, 0.4)' }}>
              {user?.name?.charAt(0) || 'S'}
            </div>
            <div>
              <div style={{ fontSize: '13px', fontWeight: 700, color: '#ffffff', lineHeight: 1.2 }}>
                {user?.name}
              </div>
              <div style={{ fontSize: '11px', color: '#8b5cf6', fontWeight: 600 }}>
                {user?.role} Access
              </div>
            </div>
          </div>

          <button
            onClick={logout}
            className="btn btn-secondary btn-sm"
            style={{ padding: '6px 10px', borderColor: 'rgba(244, 63, 94, 0.25)', color: '#fb7185' }}
            title="Sign Out"
          >
            <LogOut size={14} />
          </button>
        </div>
      </div>
    </header>
  );
};
