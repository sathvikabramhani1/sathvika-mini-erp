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
  Package,
  PlusCircle,
  FileSpreadsheet,
  Layers
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
        <div style={{ color: 'var(--text-muted)', fontSize: '16px' }}>Loading operations intelligence...</div>
      </div>
    );
  }

  const metrics = stats?.metrics;
  const targetMonthlyRevenue = 2500000;
  const currentRevenue = metrics?.totalRevenue || 0;
  const targetProgress = Math.min(100, Math.round((currentRevenue / targetMonthlyRevenue) * 100));

  return (
    <div className="page-body">
      {/* Top Banner Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">
            <span>Operations Intelligence Dashboard</span>
            <span className="badge badge-primary" style={{ fontSize: '12px' }}>v2.0 Pro</span>
          </h1>
          <p className="page-subtitle">
            Real-time telemetry across customer accounts, wholesale stock velocity, and verified sales challans
          </p>
        </div>

        {/* Quick Actions Shortcuts Bar */}
        <div style={{ display: 'flex', gap: '10px' }}>
          <button onClick={() => onNavigate('challans')} className="btn btn-primary" style={{ gap: '6px' }}>
            <Zap size={16} />
            <span>New Challan</span>
          </button>
          <button onClick={() => onNavigate('products')} className="btn btn-outline" style={{ gap: '6px' }}>
            <PlusCircle size={16} />
            <span>Adjust Stock</span>
          </button>
        </div>
      </div>

      {/* KPI Metric Cards */}
      <div className="stats-grid">
        {/* Total Revenue */}
        <div className="stat-card">
          <div>
            <div className="stat-label">Confirmed Revenue</div>
            <div className="stat-value">
              ₹{(metrics?.totalRevenue || 0).toLocaleString('en-IN', { maximumFractionDigits: 0 })}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', color: '#34d399', marginTop: '6px' }}>
              <ArrowUpRight size={14} />
              <span>+24.8% vs last cycle</span>
            </div>
          </div>
          <div className="stat-icon-wrapper" style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#10b981' }}>
            <DollarSign size={24} />
          </div>
        </div>

        {/* Confirmed Orders */}
        <div className="stat-card">
          <div>
            <div className="stat-label">Confirmed Challans</div>
            <div className="stat-value">{metrics?.confirmedChallansCount || 0}</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', color: '#38bdf8', marginTop: '6px' }}>
              <TrendingUp size={14} />
              <span>100% ACID Deducted</span>
            </div>
          </div>
          <div className="stat-icon-wrapper" style={{ background: 'rgba(6, 182, 212, 0.15)', color: '#06b6d4' }}>
            <FileCheck2 size={24} />
          </div>
        </div>

        {/* Active Customers */}
        <div className="stat-card">
          <div>
            <div className="stat-label">Managed Accounts</div>
            <div className="stat-value">{metrics?.totalCustomers || 0}</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', color: '#c4b5fd', marginTop: '6px' }}>
              <Sparkles size={14} />
              <span>Wholesale & Retail</span>
            </div>
          </div>
          <div className="stat-icon-wrapper" style={{ background: 'rgba(139, 92, 246, 0.15)', color: '#8b5cf6' }}>
            <Users size={24} />
          </div>
        </div>

        {/* Low Stock SKUs */}
        <div className="stat-card">
          <div>
            <div className="stat-label">Low Stock Alerts</div>
            <div className="stat-value" style={{ color: (metrics?.lowStockCount || 0) > 0 ? '#fb7185' : '#ffffff' }}>
              {metrics?.lowStockCount || 0}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', color: '#fbbf24', marginTop: '6px' }}>
              <AlertTriangle size={14} />
              <span>Threshold Monitored</span>
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
              <Target size={18} color="#8b5cf6" />
              <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#ffffff' }}>Monthly Revenue Goal</h3>
            </div>
            <span className="badge badge-primary">{targetProgress}% Reached</span>
          </div>

          <div style={{ fontSize: '13px', color: '#94a3b8', marginBottom: '12px' }}>
            ₹{currentRevenue.toLocaleString('en-IN')} achieved of ₹{targetMonthlyRevenue.toLocaleString('en-IN')} quota
          </div>

          <div style={{ width: '100%', height: '10px', background: 'rgba(255,255,255,0.08)', borderRadius: '9999px', overflow: 'hidden', marginBottom: '16px' }}>
            <div style={{ 
              width: `${targetProgress}%`, 
              height: '100%', 
              background: 'linear-gradient(90deg, #8b5cf6 0%, #10b981 100%)',
              boxShadow: '0 0 12px rgba(16, 185, 129, 0.5)'
            }} />
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#64748b' }}>
            <span>Base: ₹0</span>
            <span>Target: ₹25 Lakhs</span>
          </div>
        </div>

        {/* Category Breakdown */}
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Layers size={18} color="#06b6d4" />
              <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#ffffff' }}>Category Stock Valuation</h3>
            </div>
            <span className="badge badge-cyan">4 Segments</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '4px' }}>
                <span style={{ color: '#cbd5e1' }}>Electronics & Storage</span>
                <span style={{ color: '#8b5cf6', fontWeight: 700 }}>45%</span>
              </div>
              <div style={{ height: '6px', background: 'rgba(255,255,255,0.06)', borderRadius: '4px' }}>
                <div style={{ width: '45%', height: '100%', background: '#8b5cf6', borderRadius: '4px' }} />
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '4px' }}>
                <span style={{ color: '#cbd5e1' }}>Peripherals & Input</span>
                <span style={{ color: '#06b6d4', fontWeight: 700 }}>30%</span>
              </div>
              <div style={{ height: '6px', background: 'rgba(255,255,255,0.06)', borderRadius: '4px' }}>
                <div style={{ width: '30%', height: '100%', background: '#06b6d4', borderRadius: '4px' }} />
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '4px' }}>
                <span style={{ color: '#cbd5e1' }}>Audio & Communication</span>
                <span style={{ color: '#10b981', fontWeight: 700 }}>25%</span>
              </div>
              <div style={{ height: '6px', background: 'rgba(255,255,255,0.06)', borderRadius: '4px' }}>
                <div style={{ width: '25%', height: '100%', background: '#10b981', borderRadius: '4px' }} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Row: Recent Challans & Low Stock Alert Tables */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(420px, 1fr))', gap: '20px' }}>
        {/* Recent Challans */}
        <div className="card" style={{ padding: '0', overflow: 'hidden' }}>
          <div style={{ padding: '20px 24px', borderBottom: '1px solid rgba(255,255,255,0.08)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#ffffff' }}>Latest Sales Challans</h3>
            <button onClick={() => onNavigate('challans')} className="btn btn-outline btn-sm">
              View All
            </button>
          </div>
          <div className="table-responsive" style={{ border: 'none', borderRadius: 0 }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Challan #</th>
                  <th>Customer</th>
                  <th>Amount</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {stats?.recentChallans && stats.recentChallans.length > 0 ? (
                  stats.recentChallans.map((ch) => (
                    <tr key={ch.id}>
                      <td style={{ fontWeight: 700, color: '#a78bfa' }}>{ch.challanNumber}</td>
                      <td>{ch.customer?.name}</td>
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
                    <td colSpan={4} style={{ textAlign: 'center', color: '#64748b' }}>No challans recorded yet.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Low Stock Alerts */}
        <div className="card" style={{ padding: '0', overflow: 'hidden' }}>
          <div style={{ padding: '20px 24px', borderBottom: '1px solid rgba(255,255,255,0.08)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#ffffff' }}>Low Stock Inventory Warnings</h3>
            <button onClick={() => onNavigate('products')} className="btn btn-outline btn-sm">
              Manage Inventory
            </button>
          </div>
          <div className="table-responsive" style={{ border: 'none', borderRadius: 0 }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Product / SKU</th>
                  <th>Available</th>
                  <th>Min Alert</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {stats?.lowStockAlerts && stats.lowStockAlerts.length > 0 ? (
                  stats.lowStockAlerts.map((p) => (
                    <tr key={p.id}>
                      <div>
                        <div style={{ fontWeight: 600, color: '#ffffff' }}>{p.name}</div>
                        <div style={{ fontSize: '11px', color: '#64748b' }}>{p.sku}</div>
                      </div>
                      <td style={{ fontWeight: 700, color: '#fb7185' }}>{p.currentStock} Units</td>
                      <td style={{ color: '#94a3b8' }}>{p.minStockAlert} Units</td>
                      <td>
                        <button onClick={() => onNavigate('products')} className="btn btn-secondary btn-sm" style={{ fontSize: '11px' }}>
                          Restock
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} style={{ textAlign: 'center', color: '#10b981', padding: '24px' }}>
                      ✓ All products are above low stock thresholds!
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
