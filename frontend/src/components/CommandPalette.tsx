import React, { useEffect, useState } from 'react';
import { 
  Search, 
  LayoutDashboard, 
  Users, 
  Package, 
  History, 
  FileSpreadsheet, 
  ShieldCheck, 
  X,
  CornerDownLeft
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { UserRole } from '../types';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (tab: string) => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({ isOpen, onClose, onNavigate }) => {
  const [query, setQuery] = useState('');
  const { switchRole } = useAuth();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        onClose(); // toggle if already open or handled outside
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const navCommands = [
    { id: 'dashboard', label: 'Go to Dashboard', category: 'Navigation', icon: LayoutDashboard },
    { id: 'customers', label: 'Go to Customers (CRM)', category: 'Navigation', icon: Users },
    { id: 'products', label: 'Go to Products & Stock Catalog', category: 'Navigation', icon: Package },
    { id: 'stock-logs', label: 'Go to Stock Movement Audit', category: 'Navigation', icon: History },
    { id: 'challans', label: 'Go to Sales Challans & Invoices', category: 'Navigation', icon: FileSpreadsheet },
  ];

  const roleCommands = [
    { role: 'ADMIN' as UserRole, label: 'Switch Role to Admin (Full Access)' },
    { role: 'SALES' as UserRole, label: 'Switch Role to Sales Executive' },
    { role: 'WAREHOUSE' as UserRole, label: 'Switch Role to Warehouse Manager' },
    { role: 'ACCOUNTS' as UserRole, label: 'Switch Role to Accounts & Invoices' },
  ];

  const filteredNav = navCommands.filter(c => c.label.toLowerCase().includes(query.toLowerCase()));
  const filteredRoles = roleCommands.filter(r => r.label.toLowerCase().includes(query.toLowerCase()));

  return (
    <div className="modal-backdrop" onClick={onClose} style={{ zIndex: 100 }}>
      <div 
        className="modal-content" 
        onClick={e => e.stopPropagation()} 
        style={{ 
          maxWidth: '560px', 
          background: '#0c101d', 
          border: '1px solid rgba(139, 92, 246, 0.4)',
          boxShadow: '0 25px 60px rgba(0,0,0,0.8), 0 0 30px rgba(139, 92, 246, 0.2)'
        }}
      >
        <div style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', gap: '12px', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
          <Search size={20} color="#8b5cf6" />
          <input
            autoFocus
            type="text"
            placeholder="Type a command or jump to page..."
            value={query}
            onChange={e => setQuery(e.target.value)}
            style={{
              flex: 1,
              background: 'transparent',
              border: 'none',
              color: '#ffffff',
              fontSize: '16px',
              outline: 'none',
              fontFamily: 'inherit'
            }}
          />
          <span style={{ fontSize: '11px', color: '#64748b', background: 'rgba(255,255,255,0.08)', padding: '2px 8px', borderRadius: '4px' }}>
            ESC
          </span>
        </div>

        <div style={{ maxHeight: '360px', overflowY: 'auto', padding: '12px 14px' }}>
          {filteredNav.length > 0 && (
            <div style={{ marginBottom: '14px' }}>
              <div style={{ fontSize: '11px', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', padding: '6px 10px', letterSpacing: '0.05em' }}>
                Quick Navigation
              </div>
              {filteredNav.map(item => {
                const Icon = item.icon;
                return (
                  <div
                    key={item.id}
                    onClick={() => { onNavigate(item.id); onClose(); }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '10px 14px',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease',
                      color: '#f8fafc'
                    }}
                    onMouseEnter={e => (e.currentTarget.style.backgroundColor = 'rgba(139, 92, 246, 0.15)')}
                    onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <Icon size={18} color="#8b5cf6" />
                      <span style={{ fontSize: '14px', fontWeight: 500 }}>{item.label}</span>
                    </div>
                    <CornerDownLeft size={14} color="#64748b" />
                  </div>
                );
              })}
            </div>
          )}

          {filteredRoles.length > 0 && (
            <div>
              <div style={{ fontSize: '11px', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', padding: '6px 10px', letterSpacing: '0.05em' }}>
                RBAC Quick Switcher
              </div>
              {filteredRoles.map(item => (
                <div
                  key={item.role}
                  onClick={async () => { await switchRole(item.role); onClose(); }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '10px 14px',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                    color: '#f8fafc'
                  }}
                  onMouseEnter={e => (e.currentTarget.style.backgroundColor = 'rgba(16, 185, 129, 0.15)')}
                  onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <ShieldCheck size={18} color="#10b981" />
                    <span style={{ fontSize: '14px', fontWeight: 500 }}>{item.label}</span>
                  </div>
                  <span className="badge badge-success" style={{ fontSize: '10px' }}>{item.role}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
