import React, { useEffect, useState } from 'react';
import { 
  Search, 
  LayoutDashboard, 
  Users, 
  Package, 
  History, 
  FileSpreadsheet, 
  CornerDownLeft
} from 'lucide-react';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (tab: string) => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({ isOpen, onClose, onNavigate }) => {
  const [query, setQuery] = useState('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        onClose();
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
    { id: 'dashboard', label: 'Go to Operations Overview', category: 'Navigation', icon: LayoutDashboard },
    { id: 'customers', label: 'Go to Customer CRM Module', category: 'Navigation', icon: Users },
    { id: 'products', label: 'Go to Product & Inventory Module', category: 'Navigation', icon: Package },
    { id: 'stock-logs', label: 'Go to Stock Movement Audit Trail', category: 'Navigation', icon: History },
    { id: 'challans', label: 'Go to Sales Challans & Dispatch', category: 'Navigation', icon: FileSpreadsheet },
  ];

  const filteredNav = navCommands.filter(c => c.label.toLowerCase().includes(query.toLowerCase()));

  return (
    <div className="modal-backdrop" onClick={onClose} style={{ zIndex: 100 }}>
      <div 
        className="modal-content" 
        onClick={e => e.stopPropagation()} 
        style={{ 
          maxWidth: '560px', 
          background: '#082115', 
          border: '1px solid rgba(16, 185, 129, 0.4)',
          boxShadow: '0 25px 60px rgba(0,0,0,0.8), 0 0 30px rgba(16, 185, 129, 0.2)'
        }}
      >
        <div style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', gap: '12px', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
          <Search size={20} color="#10b981" />
          <input
            autoFocus
            type="text"
            placeholder="Type a command or jump to module..."
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
          <span style={{ fontSize: '11px', color: '#a7f3d0', background: 'rgba(255,255,255,0.08)', padding: '2px 8px', borderRadius: '4px' }}>
            ESC
          </span>
        </div>

        <div style={{ maxHeight: '360px', overflowY: 'auto', padding: '12px 14px' }}>
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
                  padding: '12px 14px',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                  color: '#f0fdf4'
                }}
                onMouseEnter={e => (e.currentTarget.style.backgroundColor = 'rgba(16, 185, 129, 0.15)')}
                onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <Icon size={18} color="#10b981" />
                  <span style={{ fontSize: '14px', fontWeight: 500 }}>{item.label}</span>
                </div>
                <CornerDownLeft size={14} color="#6ee7b7" />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
