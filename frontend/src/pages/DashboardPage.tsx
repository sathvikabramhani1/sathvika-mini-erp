import React, { useEffect, useState } from 'react';
import {
  FileQuestion,
  Calculator,
  ShoppingCart,
  Package,
  ArrowRight,
  TrendingUp,
  CheckCircle2,
  Clock,
  Truck,
  ShieldCheck,
  AlertTriangle,
  ChevronRight,
} from 'lucide-react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';

interface DashboardProps {
  onNavigate: (tab: string) => void;
}

export const DashboardPage: React.FC<DashboardProps> = ({ onNavigate }) => {
  const { user } = useAuth();
  const [metrics, setMetrics] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMetrics();
  }, []);

  const loadMetrics = async () => {
    try {
      const data = await api.getDashboardMetrics();
      setMetrics(data);
    } catch (err) {
      console.error('Failed to load metrics:', err);
    } finally {
      setLoading(false);
    }
  };

  const counts = metrics?.counts || { enquiries: 0, quotations: 0, salesOrders: 0, dispatches: 0 };
  const inventory = metrics?.inventory || { totalPhysical: 0, totalReserved: 0, totalAvailable: 0 };
  const breakdowns = metrics?.breakdowns || {};

  return (
    <div className="page-container">
      {/* Welcome & Role Banner */}
      <div
        style={{
          background: 'linear-gradient(135deg, #1e3a8a 0%, #0f172a 100%)',
          color: '#fff',
          padding: '24px 28px',
          borderRadius: '12px',
          marginBottom: '24px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '16px',
        }}
      >
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(255,255,255,0.12)', padding: '3px 10px', borderRadius: '9999px', fontSize: '11px', fontWeight: 700, marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            <ShieldCheck size={13} color="#38bdf8" /> Active Role: {user?.role} User
          </div>
          <h1 style={{ margin: '0 0 6px 0', fontSize: '24px', fontWeight: 800 }}>
            Welcome back, {user?.name}
          </h1>
          <p style={{ margin: 0, color: '#94a3b8', fontSize: '14px', maxWidth: '600px' }}>
            PERN Stack Industrial Supply ERP & CRM Suite. Full 5-stage traceability from customer enquiry through automated pricing, stock reservation, and dispatch.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            onClick={() => onNavigate('enquiries')}
            className="btn"
            style={{ background: '#2563eb', color: '#fff', padding: '10px 18px', fontSize: '13px', fontWeight: 600, border: 'none', borderRadius: '6px', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
          >
            <FileQuestion size={16} /> New Enquiry
          </button>
          <button
            onClick={() => onNavigate('sales-orders')}
            className="btn"
            style={{ background: 'rgba(255,255,255,0.15)', color: '#fff', padding: '10px 18px', fontSize: '13px', fontWeight: 600, border: '1px solid rgba(255,255,255,0.2)', borderRadius: '6px', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
          >
            <ShoppingCart size={16} /> View Orders
          </button>
        </div>
      </div>

      {/* 5-STAGE INTERACTIVE WORKFLOW PIPELINE */}
      <div className="card" style={{ marginBottom: '24px', padding: '20px' }}>
        <h3 style={{ margin: '0 0 14px 0', fontSize: '15px', fontWeight: 700, color: '#0f172a' }}>
          Core Commercial Workflow Lifecycle
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px' }}>
          {/* Step 1 */}
          <div
            onClick={() => onNavigate('enquiries')}
            style={{ background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '8px', padding: '14px', cursor: 'pointer', transition: 'all 0.2s' }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <span style={{ fontSize: '11px', fontWeight: 700, color: '#1d4ed8' }}>STEP 1</span>
              <FileQuestion size={18} color="#2563eb" />
            </div>
            <div style={{ fontSize: '14px', fontWeight: 700, color: '#0f172a', marginBottom: '4px' }}>
              Customer Enquiry
            </div>
            <div style={{ fontSize: '12px', color: '#64748b', marginBottom: '8px' }}>
              {counts.enquiries} Total Records
            </div>
            <span style={{ fontSize: '11px', color: '#2563eb', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
              Open Enquiries <ChevronRight size={12} />
            </span>
          </div>

          {/* Step 2 */}
          <div
            onClick={() => onNavigate('quotations')}
            style={{ background: '#f5f3ff', border: '1px solid #ddd6fe', borderRadius: '8px', padding: '14px', cursor: 'pointer', transition: 'all 0.2s' }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <span style={{ fontSize: '11px', fontWeight: 700, color: '#6d28d9' }}>STEP 2</span>
              <Calculator size={18} color="#7c3aed" />
            </div>
            <div style={{ fontSize: '14px', fontWeight: 700, color: '#0f172a', marginBottom: '4px' }}>
              Quotation Engine
            </div>
            <div style={{ fontSize: '12px', color: '#64748b', marginBottom: '8px' }}>
              {counts.quotations} Total Quotes
            </div>
            <span style={{ fontSize: '11px', color: '#7c3aed', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
              Review Quotes <ChevronRight size={12} />
            </span>
          </div>

          {/* Step 3 */}
          <div
            onClick={() => onNavigate('sales-orders')}
            style={{ background: '#ecfdf5', border: '1px solid #a7f3d0', borderRadius: '8px', padding: '14px', cursor: 'pointer', transition: 'all 0.2s' }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <span style={{ fontSize: '11px', fontWeight: 700, color: '#047857' }}>STEP 3</span>
              <ShoppingCart size={18} color="#059669" />
            </div>
            <div style={{ fontSize: '14px', fontWeight: 700, color: '#0f172a', marginBottom: '4px' }}>
              Sales Order
            </div>
            <div style={{ fontSize: '12px', color: '#64748b', marginBottom: '8px' }}>
              {counts.salesOrders} Generated Orders
            </div>
            <span style={{ fontSize: '11px', color: '#059669', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
              Manage Orders <ChevronRight size={12} />
            </span>
          </div>

          {/* Step 4 */}
          <div
            onClick={() => onNavigate('sales-orders')}
            style={{ background: '#fffbeb', border: '1px solid #fde68a', borderRadius: '8px', padding: '14px', cursor: 'pointer', transition: 'all 0.2s' }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <span style={{ fontSize: '11px', fontWeight: 700, color: '#b45309' }}>STEP 4</span>
              <ShieldCheck size={18} color="#d97706" />
            </div>
            <div style={{ fontSize: '14px', fontWeight: 700, color: '#0f172a', marginBottom: '4px' }}>
              Stock Reservation
            </div>
            <div style={{ fontSize: '12px', color: '#64748b', marginBottom: '8px' }}>
              {inventory.totalReserved} Reserved Units
            </div>
            <span style={{ fontSize: '11px', color: '#d97706', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
              Inspect Stock <ChevronRight size={12} />
            </span>
          </div>

          {/* Step 5 */}
          <div
            onClick={() => onNavigate('sales-orders')}
            style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '8px', padding: '14px', cursor: 'pointer', transition: 'all 0.2s' }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <span style={{ fontSize: '11px', fontWeight: 700, color: '#15803d' }}>STEP 5</span>
              <Truck size={18} color="#16a34a" />
            </div>
            <div style={{ fontSize: '14px', fontWeight: 700, color: '#0f172a', marginBottom: '4px' }}>
              Dispatch
            </div>
            <div style={{ fontSize: '12px', color: '#64748b', marginBottom: '8px' }}>
              {counts.dispatches} Total Dispatched
            </div>
            <span style={{ fontSize: '11px', color: '#16a34a', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
              Process Dispatches <ChevronRight size={12} />
            </span>
          </div>
        </div>
      </div>

      {/* METRIC CARDS */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px', marginBottom: '24px' }}>
        <div className="card" style={{ padding: '18px 20px' }}>
          <div style={{ fontSize: '12px', color: '#64748b', textTransform: 'uppercase', fontWeight: 700, marginBottom: '6px' }}>
            Physical Stock in Warehouse
          </div>
          <div style={{ fontSize: '26px', fontWeight: 800, color: '#0f172a' }}>
            {inventory.totalPhysical.toLocaleString()} <span style={{ fontSize: '14px', color: '#64748b' }}>Units</span>
          </div>
          <div style={{ fontSize: '12px', color: '#16a34a', marginTop: '6px', display: 'flex', alignItems: 'center', gap: '4px' }}>
            Across 6 Industrial Product SKUs
          </div>
        </div>

        <div className="card" style={{ padding: '18px 20px' }}>
          <div style={{ fontSize: '12px', color: '#64748b', textTransform: 'uppercase', fontWeight: 700, marginBottom: '6px' }}>
            Currently Reserved Inventory
          </div>
          <div style={{ fontSize: '26px', fontWeight: 800, color: '#d97706' }}>
            {inventory.totalReserved.toLocaleString()} <span style={{ fontSize: '14px', color: '#64748b' }}>Units</span>
          </div>
          <div style={{ fontSize: '12px', color: '#b45309', marginTop: '6px' }}>
            Committed to Confirmed Sales Orders
          </div>
        </div>

        <div className="card" style={{ padding: '18px 20px' }}>
          <div style={{ fontSize: '12px', color: '#64748b', textTransform: 'uppercase', fontWeight: 700, marginBottom: '6px' }}>
            Net Available Stock
          </div>
          <div style={{ fontSize: '26px', fontWeight: 800, color: '#2563eb' }}>
            {inventory.totalAvailable.toLocaleString()} <span style={{ fontSize: '14px', color: '#64748b' }}>Units</span>
          </div>
          <div style={{ fontSize: '12px', color: '#2563eb', marginTop: '6px' }}>
            Free stock available for new quotations
          </div>
        </div>

        <div className="card" style={{ padding: '18px 20px' }}>
          <div style={{ fontSize: '12px', color: '#64748b', textTransform: 'uppercase', fontWeight: 700, marginBottom: '6px' }}>
            Total Customers
          </div>
          <div style={{ fontSize: '26px', fontWeight: 800, color: '#0f172a' }}>
            {counts.customers} <span style={{ fontSize: '14px', color: '#64748b' }}>Active Accounts</span>
          </div>
          <div style={{ fontSize: '12px', color: '#64748b', marginTop: '6px' }}>
            B2B Manufacturing & Engineering Clients
          </div>
        </div>
      </div>
    </div>
  );
};
