import React, { useState } from 'react';
import { Boxes, Lock, Mail, ArrowRight, Sparkles, ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export const LoginPage: React.FC = () => {
  const { login } = useAuth();
  const { error, success } = useToast();

  const [email, setEmail] = useState('admin@sathvika.com');
  const [password, setPassword] = useState('Password123!');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(email, password);
      success('Authenticated successfully! Welcome to SathvikaOps.');
    } catch (err: any) {
      error(err.message || 'Login failed. Please check credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickLogin = async (roleEmail: string, roleName: string) => {
    setEmail(roleEmail);
    setPassword('Password123!');
    setLoading(true);
    try {
      await login(roleEmail, 'Password123!');
      success(`Logged in as ${roleName}`);
    } catch (err: any) {
      error(err.message || 'Quick login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: '#070913',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px',
        backgroundImage: 
          'radial-gradient(circle at 50% 15%, rgba(139, 92, 246, 0.18) 0%, transparent 65%), radial-gradient(circle at 20% 80%, rgba(6, 182, 212, 0.1) 0%, transparent 50%)',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '480px',
          backgroundColor: 'rgba(16, 22, 38, 0.85)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderRadius: '20px',
          boxShadow: '0 30px 70px rgba(0, 0, 0, 0.8), 0 0 35px rgba(139, 92, 246, 0.25)',
          padding: '40px 36px',
          border: '1px solid rgba(139, 92, 246, 0.25)',
        }}
      >
        {/* Header Branding */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div
            style={{
              width: '60px',
              height: '60px',
              borderRadius: '16px',
              background: 'linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%)',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '16px',
              boxShadow: '0 8px 24px rgba(139, 92, 246, 0.45)',
              border: '1px solid rgba(255, 255, 255, 0.25)'
            }}
          >
            <Boxes size={32} color="#ffffff" />
          </div>
          <h1 style={{ fontSize: '24px', fontWeight: 800, color: '#ffffff', letterSpacing: '-0.02em' }}>
            SATHVIKA<span style={{ color: '#a78bfa' }}>OPS</span>
          </h1>
          <p style={{ fontSize: '13px', color: '#94a3b8', marginTop: '6px' }}>
            Enterprise Resource Planning & Tiered Customer Relationship Portal
          </p>
        </div>

        {/* 1-Click Quick Demo Login Buttons */}
        <div
          style={{
            backgroundColor: 'rgba(12, 16, 29, 0.9)',
            border: '1px solid rgba(139, 92, 246, 0.2)',
            borderRadius: '12px',
            padding: '16px',
            marginBottom: '28px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', fontWeight: 700, color: '#f59e0b', marginBottom: '10px' }}>
            <Sparkles size={14} />
            <span>1-CLICK DEMO AUTHENTICATION (ALL 4 ROLES)</span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
            <button
              type="button"
              onClick={() => handleQuickLogin('admin@sathvika.com', 'Admin')}
              className="btn btn-secondary btn-sm"
              style={{ fontSize: '12px', justifyContent: 'flex-start', background: 'rgba(139, 92, 246, 0.12)', color: '#c4b5fd' }}
            >
              👑 Admin (Full)
            </button>
            <button
              type="button"
              onClick={() => handleQuickLogin('sales@sathvika.com', 'Sales')}
              className="btn btn-secondary btn-sm"
              style={{ fontSize: '12px', justifyContent: 'flex-start' }}
            >
              💼 Sales Rep
            </button>
            <button
              type="button"
              onClick={() => handleQuickLogin('warehouse@sathvika.com', 'Warehouse')}
              className="btn btn-secondary btn-sm"
              style={{ fontSize: '12px', justifyContent: 'flex-start' }}
            >
              📦 Warehouse
            </button>
            <button
              type="button"
              onClick={() => handleQuickLogin('accounts@sathvika.com', 'Accounts')}
              className="btn btn-secondary btn-sm"
              style={{ fontSize: '12px', justifyContent: 'flex-start' }}
            >
              📊 Accounts
            </button>
          </div>
        </div>

        {/* Standard Form */}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <div style={{ position: 'relative' }}>
              <Mail size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#8b5cf6' }} />
              <input
                type="email"
                required
                className="form-input"
                style={{ paddingLeft: '40px' }}
                value={email}
                onChange={e => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div className="form-group" style={{ marginBottom: '24px' }}>
            <label className="form-label">Password</label>
            <div style={{ position: 'relative' }}>
              <Lock size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#8b5cf6' }} />
              <input
                type="password"
                required
                className="form-input"
                style={{ paddingLeft: '40px' }}
                value={password}
                onChange={e => setPassword(e.target.value)}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary"
            style={{ width: '100%', padding: '12px', fontSize: '15px' }}
          >
            {loading ? 'Authenticating...' : 'Enter Operations Portal'}
            <ArrowRight size={16} />
          </button>
        </form>
      </div>
    </div>
  );
};
