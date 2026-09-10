import React, { useEffect, useState } from 'react';
import {
  DollarSign,
  Users,
  AlertTriangle,
  FileCheck2,
  ArrowUpRight,
  TrendingUp,
  Target,
  Sparkles,
  Zap,
  PlusCircle,
  Layers,
  Leaf
} from 'lucide-react';
import { api } from '../services/api';
import { DashboardStats } from '../types';

interface DashboardProps {
  onNavigate: (tab: string) => void;
}

export const DashboardPage: React.FC<DashboardProps> = ({ onNavigate }) => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await api.getDashboardStats();
        setStats(data);
      } catch (err) {
        console.error('Failed to load dashboard stats:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="page-body" style={{ textAlign: 'center', padding: '60px' }}>
        <div style={{ color: '#86efac', fontSize: '16px' }}>Loading Sathvika Organics intelligence...</div>
      </div>
    );
  }

  const metrics = stats?.metrics;
  const targetMonthlyRevenue = 1000000; // 10 Lakhs target
  const currentRevenue = metrics?.totalRevenue || 0;
  const targetProgress = Math.min(100, Math.round((currentRevenue / targetMonthlyRevenue) * 100));

  return (
    <div className="page-body">
      {/* Top Banner Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">
            <Leaf size={28} color="#10b981" />
            <span>Organic Foods & Gourmet Supply Operations</span>
            <span className="badge badge-gold">Specialty Foods B2B</span>
          </h1>
          <p className="page-subtitle">
            Wholesale distribution telemetry: Single-Origin Arabica, Cold-Pressed Almond Oils, Kashmiri Saffron, and A2 Ghee dispatches
          </p>
        </div>

        {/* Quick Actions Shortcuts Bar */}
        <div style={{ display: 'flex', gap: '10px' }}>
          <button onClick={() => onNavigate('challans')} className="btn btn-gold" style={{ gap: '6px' }}>
            <Zap size={16} />
            <span>New Dispatch Challan</span>
          </button>
          <button onClick={() => onNavigate('products')} className="btn btn-outline" style={{ gap: '6px' }}>
            <PlusCircle size={16} />
            <span>Harvest Intake / Adjust</span>
          </button>
        </div>
      </div>

      {/* KPI Metric Cards */}
      <div className="stats-grid">
        {/* Total Revenue */}
        <div className="stat-card">
          <div>
            <div className="stat-label">Confirmed Wholesale Revenue</div>
            <div className="stat-value">
              ₹{(metrics?.totalRevenue || 0).toLocaleString('en-IN', { maximumFractionDigits: 0 })}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', color: '#34d399', marginTop: '6px' }}>
              <ArrowUpRight size={14} />
              <span>+31.2% Q4 wholesale demand</span>
            </div>
          </div>
          <div className="stat-icon-wrapper" style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#10b981' }}>
            <DollarSign size={24} />
          </div>
        </div>

        {/* Confirmed Orders */}
        <div className="stat-card">
          <div>
            <div className="stat-label">Confirmed Dispatches</div>
            <div className="stat-value">{metrics?.confirmedChallansCount || 0}</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', color: '#fbbf24', marginTop: '6px' }}>
              <TrendingUp size={14} />
              <span>SAT-2026 Serialized</span>
            </div>
          </div>
          <div className="stat-icon-wrapper" style={{ background: 'rgba(245, 158, 11, 0.15)', color: '#f59e0b' }}>
            <FileCheck2 size={24} />
          </div>
        </div>

        {/* Active Customers */}
        <div className="stat-card">
          <div>
            <div className="stat-label">Verified Client Outlets</div>
            <div className="stat-value">{metrics?.totalCustomers || 0}</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', color: '#34d399', marginTop: '6px' }}>
              <Sparkles size={14} />
              <span>Bangalore, Hyd & Mumbai</span>
            </div>
          </div>
          <div className="stat-icon-wrapper" style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#10b981' }}>
            <Users size={24} />
          </div>
        </div>

        {/* Low Stock SKUs */}
        <div className="stat-card">
          <div>
            <div className="stat-label">Harvest Reorder Warnings</div>
            <div className="stat-value" style={{ color: (metrics?.lowStockCount || 0) > 0 ? '#fb7185' : '#ffffff' }}>
              {metrics?.lowStockCount || 0}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', color: '#fbbf24', marginTop: '6px' }}>
              <AlertTriangle size={14} />
              <span>Stock Thresholds</span>
            </div>
          </div>
          <div className="stat-icon-wrapper" style={{ background: 'rgba(244, 63, 94, 0.15)', color: '#f43f5e' }}>
            <AlertTriangle size={24} />
          </div>
        </div>
      </div>

      {/* Mid-Row Analytics: Target Progress & Category Valuation */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '20px', marginBottom: '30px' }}>
        {/* Monthly Target Gauge */}
        <div className="card" style={{ position: 'relative', overflow: 'hidden' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Target size={18} color="#10b981" />
              <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#ffffff' }}>Monthly Quota Progress</h3>
            </div>
            <span className="badge badge-gold">{targetProgress}% Quota</span>
          </div>

          <div style={{ fontSize: '13px', color: '#a7f3d0', marginBottom: '12px' }}>
            ₹{currentRevenue.toLocaleString('en-IN')} achieved of ₹{targetMonthlyRevenue.toLocaleString('en-IN')} monthly target
          </div>

          <div style={{ width: '100%', height: '10px', background: 'rgba(255,255,255,0.08)', borderRadius: '9999px', overflow: 'hidden', marginBottom: '16px' }}>
            <div style={{ 
              width: `${targetProgress}%`, 
              height: '100%', 
              background: 'linear-gradient(90deg, #10b981 0%, #f59e0b 100%)',
              boxShadow: '0 0 12px rgba(245, 158, 11, 0.5)'
            }} />
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#6ee7b7' }}>
            <span>Base: ₹0</span>
            <span>Target: ₹10,00,000</span>
          </div>
        </div>

        {/* Category Breakdown */}
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Layers size={18} color="#f59e0b" />
              <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#ffffff' }}>Gourmet Segment Distribution</h3>
            </div>
            <span className="badge badge-primary">4 Categories</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '4px' }}>
                <span style={{ color: '#f0fdf4' }}>Gourmet Beverages (Arabica & Matcha)</span>
                <span style={{ color: '#34d399', fontWeight: 700 }}>40%</span>
              </div>
              <div style={{ height: '6px', background: 'rgba(255,255,255,0.06)', borderRadius: '4px' }}>
                <div style={{ width: '40%', height: '100%', background: '#10b981', borderRadius: '4px' }} />
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '4px' }}>
                <span style={{ color: '#f0fdf4' }}>Oils & Ghee (Cold-Pressed & A2)</span>
                <span style={{ color: '#fbbf24', fontWeight: 700 }}>35%</span>
              </div>
              <div style={{ height: '6px', background: 'rgba(255,255,255,0.06)', borderRadius: '4px' }}>
                <div style={{ width: '35%', height: '100%', background: '#f59e0b', borderRadius: '4px' }} />
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '4px' }}>
                <span style={{ color: '#f0fdf4' }}>Grains, Spices & Specialty Goods</span>
                <span style={{ color: '#6ee7b7', fontWeight: 700 }}>25%</span>
              </div>
              <div style={{ height: '6px', background: 'rgba(255,255,255,0.06)', borderRadius: '4px' }}>
                <div style={{ width: '25%', height: '100%', background: '#34d399', borderRadius: '4px' }} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Row: Recent Challans & Low Stock Tables */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(420px, 1fr))', gap: '20px' }}>
        {/* Recent Challans */}
        <div className="card" style={{ padding: '0', overflow: 'hidden' }}>
          <div style={{ padding: '20px 24px', borderBottom: '1px solid rgba(16, 185, 129, 0.2)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#ffffff' }}>Latest Dispatch Challans</h3>
            <button onClick={() => onNavigate('challans')} className="btn btn-outline btn-sm">
              View All
            </button>
          </div>
          <div className="table-responsive" style={{ border: 'none', borderRadius: 0 }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Challan ID</th>
                  <th>Gourmet Client</th>
                  <th>Order Value</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {stats?.recentChallans && stats.recentChallans.length > 0 ? (
                  stats.recentChallans.map((ch) => (
                    <tr key={ch.id}>
                      <td style={{ fontWeight: 700, color: '#fbbf24', fontFamily: 'monospace' }}>{ch.challanNumber}</td>
                      <td>{ch.customer?.businessName}</td>
                      <td style={{ fontWeight: 600 }}>₹{ch.totalAmount.toLocaleString('en-IN')}</td>
                      <td>
                        <span className={`badge ${ch.status === 'CONFIRMED' ? 'badge-success' : 'badge-warning'}`}>
                          {ch.status}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} style={{ textAlign: 'center', color: '#6ee7b7' }}>No challans recorded yet.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Low Stock Alerts */}
        <div className="card" style={{ padding: '0', overflow: 'hidden' }}>
          <div style={{ padding: '20px 24px', borderBottom: '1px solid rgba(16, 185, 129, 0.2)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#ffffff' }}>Harvest Reorder Alerts</h3>
            <button onClick={() => onNavigate('products')} className="btn btn-outline btn-sm">
              Manage Inventory
            </button>
          </div>
          <div className="table-responsive" style={{ border: 'none', borderRadius: 0 }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Organic Item / SKU</th>
                  <th>Stock Available</th>
                  <th>Min Alert</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {stats?.lowStockAlerts && stats.lowStockAlerts.length > 0 ? (
                  stats.lowStockAlerts.map((p) => (
                    <tr key={p.id}>
                      <td>
                        <div style={{ fontWeight: 600, color: '#ffffff' }}>{p.name}</div>
                        <div style={{ fontSize: '11px', color: '#fbbf24', fontFamily: 'monospace' }}>{p.sku}</div>
                      </td>
                      <td style={{ fontWeight: 700, color: '#fb7185' }}>{p.currentStock} Units</td>
                      <td style={{ color: '#a7f3d0' }}>{p.minStockAlert} Units</td>
                      <td>
                        <button onClick={() => onNavigate('products')} className="btn btn-secondary btn-sm" style={{ fontSize: '11px' }}>
                          Intake Lot
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} style={{ textAlign: 'center', color: '#34d399', padding: '24px' }}>
                      ✓ All organic items are above minimum stock alert levels!
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
