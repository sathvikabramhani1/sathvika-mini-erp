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
  Layers,
  Users,
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

  const counts = metrics?.counts || { enquiries: 0, quotations: 0, salesOrders: 0, dispatches: 0, customers: 0 };
  const inventory = metrics?.inventory || { totalPhysical: 0, totalReserved: 0, totalAvailable: 0 };

  return (
    <div className="page-container">
      {/* Executive Welcome & Context Header */}
      <div
        className="card"
        style={{
          padding: '24px 28px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '20px',
          background: '#ffffff',
          border: '1px solid #e2e8f0',
        }}
      >
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: '#eff6ff', border: '1px solid #bfdbfe', color: '#1e40af', padding: '3px 10px', borderRadius: '9999px', fontSize: '11px', fontWeight: 700, marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            <ShieldCheck size={13} color="#2563eb" /> Active Role: {user?.role} Portal User
          </div>
          <h1 style={{ margin: '0 0 6px 0', fontSize: '22px', fontWeight: 800, color: '#0f172a' }}>
            Commercial Operations Control Center
          </h1>
          <p style={{ margin: 0, color: '#64748b', fontSize: '13.5px', maxWidth: '640px' }}>
            Authoritative PERN stack management across the entire 5-stage commercial lifecycle — from initial buyer RFQ through automated pricing, atomic stock reservation, and gatepass dispatch.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            onClick={() => onNavigate('enquiries')}
            className="btn btn-primary"
          >
            <FileQuestion size={15} /> Log New Enquiry
          </button>
          <button
            onClick={() => onNavigate('sales-orders')}
            className="btn btn-secondary"
          >
            <ShoppingCart size={15} /> Review Orders
          </button>
        </div>
      </div>

      {/* 5-STAGE COMMERCIAL WORKFLOW LIFECYCLE */}
      <div className="card" style={{ padding: '22px 24px', marginBottom: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <div>
            <h3 style={{ margin: 0, fontSize: '15px', fontWeight: 700, color: '#0f172a' }}>
              Commercial Pipeline & Traceability
            </h3>
            <p style={{ margin: '2px 0 0', fontSize: '12.5px', color: '#64748b' }}>
              Click any stage to inspect real-time records and execute commercial transitions
            </p>
          </div>
          <span style={{ fontSize: '12px', fontWeight: 600, color: '#2563eb', background: '#eff6ff', padding: '4px 10px', borderRadius: '6px' }}>
            5 Stages Active
          </span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px' }}>
          {/* Step 1 */}
          <div
            onClick={() => onNavigate('enquiries')}
            style={{
              background: '#f8fafc',
              border: '1px solid #e2e8f0',
              borderRadius: '8px',
              padding: '14px 16px',
              cursor: 'pointer',
              transition: 'all 0.15s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = '#2563eb';
              e.currentTarget.style.background = '#ffffff';
              e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0,0,0,0.05)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = '#e2e8f0';
              e.currentTarget.style.background = '#f8fafc';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <span style={{ fontSize: '11px', fontWeight: 700, color: '#2563eb', background: '#eff6ff', padding: '2px 6px', borderRadius: '4px' }}>STEP 1</span>
              <FileQuestion size={16} color="#2563eb" />
            </div>
            <div style={{ fontSize: '14px', fontWeight: 700, color: '#0f172a', marginBottom: '2px' }}>
              Customer Enquiry
            </div>
            <div style={{ fontSize: '12px', color: '#64748b', marginBottom: '10px' }}>
              {counts.enquiries} Total Logged
            </div>
            <span style={{ fontSize: '11.5px', color: '#2563eb', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
              View Enquiries <ChevronRight size={12} />
            </span>
          </div>

          {/* Step 2 */}
          <div
            onClick={() => onNavigate('quotations')}
            style={{
              background: '#f8fafc',
              border: '1px solid #e2e8f0',
              borderRadius: '8px',
              padding: '14px 16px',
              cursor: 'pointer',
              transition: 'all 0.15s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = '#2563eb';
              e.currentTarget.style.background = '#ffffff';
              e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0,0,0,0.05)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = '#e2e8f0';
              e.currentTarget.style.background = '#f8fafc';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <span style={{ fontSize: '11px', fontWeight: 700, color: '#2563eb', background: '#eff6ff', padding: '2px 6px', borderRadius: '4px' }}>STEP 2</span>
              <Calculator size={16} color="#2563eb" />
            </div>
            <div style={{ fontSize: '14px', fontWeight: 700, color: '#0f172a', marginBottom: '2px' }}>
              Quotation Engine
            </div>
            <div style={{ fontSize: '12px', color: '#64748b', marginBottom: '10px' }}>
              {counts.quotations} Quotes Created
            </div>
            <span style={{ fontSize: '11.5px', color: '#2563eb', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
              Calculate Quotes <ChevronRight size={12} />
            </span>
          </div>

          {/* Step 3 */}
          <div
            onClick={() => onNavigate('sales-orders')}
            style={{
              background: '#f8fafc',
              border: '1px solid #e2e8f0',
              borderRadius: '8px',
              padding: '14px 16px',
              cursor: 'pointer',
              transition: 'all 0.15s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = '#2563eb';
              e.currentTarget.style.background = '#ffffff';
              e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0,0,0,0.05)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = '#e2e8f0';
              e.currentTarget.style.background = '#f8fafc';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <span style={{ fontSize: '11px', fontWeight: 700, color: '#2563eb', background: '#eff6ff', padding: '2px 6px', borderRadius: '4px' }}>STEP 3</span>
              <ShoppingCart size={16} color="#2563eb" />
            </div>
            <div style={{ fontSize: '14px', fontWeight: 700, color: '#0f172a', marginBottom: '2px' }}>
              Sales Orders
            </div>
            <div style={{ fontSize: '12px', color: '#64748b', marginBottom: '10px' }}>
              {counts.salesOrders} Generated Orders
            </div>
            <span style={{ fontSize: '11.5px', color: '#2563eb', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
              Review Orders <ChevronRight size={12} />
            </span>
          </div>

          {/* Step 4 */}
          <div
            onClick={() => onNavigate('sales-orders')}
            style={{
              background: '#f8fafc',
              border: '1px solid #e2e8f0',
              borderRadius: '8px',
              padding: '14px 16px',
              cursor: 'pointer',
              transition: 'all 0.15s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = '#2563eb';
              e.currentTarget.style.background = '#ffffff';
              e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0,0,0,0.05)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = '#e2e8f0';
              e.currentTarget.style.background = '#f8fafc';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <span style={{ fontSize: '11px', fontWeight: 700, color: '#d97706', background: '#fffbeb', padding: '2px 6px', borderRadius: '4px' }}>STEP 4</span>
              <ShieldCheck size={16} color="#d97706" />
            </div>
            <div style={{ fontSize: '14px', fontWeight: 700, color: '#0f172a', marginBottom: '2px' }}>
              Stock Reservation
            </div>
            <div style={{ fontSize: '12px', color: '#64748b', marginBottom: '10px' }}>
              {inventory.totalReserved} Units Committed
            </div>
            <span style={{ fontSize: '11.5px', color: '#d97706', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
              Inspect Stock <ChevronRight size={12} />
            </span>
          </div>

          {/* Step 5 */}
          <div
            onClick={() => onNavigate('sales-orders')}
            style={{
              background: '#f8fafc',
              border: '1px solid #e2e8f0',
              borderRadius: '8px',
              padding: '14px 16px',
              cursor: 'pointer',
              transition: 'all 0.15s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = '#059669';
              e.currentTarget.style.background = '#ffffff';
              e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0,0,0,0.05)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = '#e2e8f0';
              e.currentTarget.style.background = '#f8fafc';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <span style={{ fontSize: '11px', fontWeight: 700, color: '#059669', background: '#ecfdf5', padding: '2px 6px', borderRadius: '4px' }}>STEP 5</span>
              <Truck size={16} color="#059669" />
            </div>
            <div style={{ fontSize: '14px', fontWeight: 700, color: '#0f172a', marginBottom: '2px' }}>
              Logistics Dispatch
            </div>
            <div style={{ fontSize: '12px', color: '#64748b', marginBottom: '10px' }}>
              {counts.dispatches} Gatepass Dispatches
            </div>
            <span style={{ fontSize: '11.5px', color: '#059669', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
              Process Dispatches <ChevronRight size={12} />
            </span>
          </div>
        </div>
      </div>

      {/* METRIC CARDS */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
        <div className="card" style={{ padding: '20px 22px', marginBottom: 0 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '12px', color: '#64748b', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.04em' }}>
              Physical Warehouse Stock
            </span>
            <Package size={18} color="#2563eb" />
          </div>
          <div style={{ fontSize: '28px', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.02em' }}>
            {inventory.totalPhysical.toLocaleString()} <span style={{ fontSize: '14px', fontWeight: 500, color: '#64748b' }}>Units</span>
          </div>
          <div style={{ fontSize: '12px', color: '#059669', marginTop: '8px', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '4px' }}>
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#059669', display: 'inline-block' }}></span>
            Active across 6 Industrial SKU lines
          </div>
        </div>

        <div className="card" style={{ padding: '20px 22px', marginBottom: 0 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '12px', color: '#64748b', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.04em' }}>
              Committed Reserved Units
            </span>
            <ShieldCheck size={18} color="#d97706" />
          </div>
          <div style={{ fontSize: '28px', fontWeight: 800, color: '#d97706', letterSpacing: '-0.02em' }}>
            {inventory.totalReserved.toLocaleString()} <span style={{ fontSize: '14px', fontWeight: 500, color: '#64748b' }}>Units</span>
          </div>
          <div style={{ fontSize: '12px', color: '#b45309', marginTop: '8px', fontWeight: 500 }}>
            Locked to Confirmed Sales Orders
          </div>
        </div>

        <div className="card" style={{ padding: '20px 22px', marginBottom: 0 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '12px', color: '#64748b', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.04em' }}>
              Available to Promise (ATP)
            </span>
            <CheckCircle2 size={18} color="#059669" />
          </div>
          <div style={{ fontSize: '28px', fontWeight: 800, color: '#059669', letterSpacing: '-0.02em' }}>
            {inventory.totalAvailable.toLocaleString()} <span style={{ fontSize: '14px', fontWeight: 500, color: '#64748b' }}>Units</span>
          </div>
          <div style={{ fontSize: '12px', color: '#059669', marginTop: '8px', fontWeight: 500 }}>
            Uncommitted free stock for quotations
          </div>
        </div>

        <div className="card" style={{ padding: '20px 22px', marginBottom: 0 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '12px', color: '#64748b', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.04em' }}>
              Active B2B Client Accounts
            </span>
            <Users size={18} color="#2563eb" />
          </div>
          <div style={{ fontSize: '28px', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.02em' }}>
            {counts.customers || 5} <span style={{ fontSize: '14px', fontWeight: 500, color: '#64748b' }}>Accounts</span>
          </div>
          <div style={{ fontSize: '12px', color: '#64748b', marginTop: '8px', fontWeight: 500 }}>
            Procurement contacts & engineering buyers
          </div>
        </div>
      </div>
    </div>
  );
};
