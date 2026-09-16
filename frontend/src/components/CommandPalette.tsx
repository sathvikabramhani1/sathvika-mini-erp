import React, { useEffect, useState } from 'react';
import {
  Search,
  LayoutDashboard,
  Users,
  Package,
  FileQuestion,
  Calculator,
  ShoppingCart,
  CornerDownLeft,
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
    { id: 'enquiries', label: '1. Customer Enquiries (Create, View, Status)', category: 'Workflow', icon: FileQuestion },
    { id: 'quotations', label: '2. Commercial Quotations (Pricing, Discount, GST)', category: 'Workflow', icon: Calculator },
    { id: 'sales-orders', label: '3. Sales Orders, Stock Reservation & Dispatch', category: 'Workflow', icon: ShoppingCart },
    { id: 'dashboard', label: 'Workflow Overview & Live Metrics', category: 'Navigation', icon: LayoutDashboard },
    { id: 'products', label: 'Industrial Product Master & Stock List', category: 'Master Data', icon: Package },
    { id: 'customers', label: 'B2B Customer Relationship Directory', category: 'Master Data', icon: Users },
  ];

  const filteredNav = navCommands.filter((c) => c.label.toLowerCase().includes(query.toLowerCase()));

  return (
    <div className="modal-backdrop" onClick={onClose} style={{ zIndex: 100 }}>
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
        style={{
          maxWidth: '560px',
          width: '100%',
          padding: 0,
          overflow: 'hidden',
          borderRadius: '12px',
          background: '#ffffff',
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.2)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', padding: '12px 16px', borderBottom: '1px solid #e2e8f0', gap: '10px' }}>
          <Search size={18} color="#64748b" />
          <input
            type="text"
            placeholder="Type a command or jump to section..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
            style={{
              border: 'none',
              outline: 'none',
              width: '100%',
              fontSize: '14px',
              color: '#0f172a',
            }}
          />
          <kbd style={{ fontSize: '11px', background: '#f1f5f9', padding: '2px 6px', borderRadius: '4px', color: '#64748b' }}>ESC</kbd>
        </div>

        <div style={{ maxHeight: '340px', overflowY: 'auto', padding: '8px' }}>
          {filteredNav.length === 0 ? (
            <div style={{ padding: '24px', textAlign: 'center', color: '#94a3b8', fontSize: '13px' }}>
              No matching navigation actions found.
            </div>
          ) : (
            filteredNav.map((cmd) => {
              const Icon = cmd.icon;
              return (
                <div
                  key={cmd.id}
                  onClick={() => {
                    onNavigate(cmd.id);
                    onClose();
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '10px 12px',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontSize: '13px',
                    color: '#334155',
                    transition: 'all 0.15s',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = '#f1f5f9')}
                  onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{ background: '#eff6ff', padding: '6px', borderRadius: '6px', color: '#2563eb' }}>
                      <Icon size={16} />
                    </div>
                    <div>
                      <div style={{ fontWeight: 600, color: '#0f172a' }}>{cmd.label}</div>
                      <div style={{ fontSize: '11px', color: '#94a3b8' }}>{cmd.category}</div>
                    </div>
                  </div>
                  <CornerDownLeft size={14} color="#94a3b8" />
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
