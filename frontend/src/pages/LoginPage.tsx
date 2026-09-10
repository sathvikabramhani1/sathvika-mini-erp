import React, { useState } from 'react';
import { Leaf, Lock, Mail, ArrowRight, Sparkles } from 'lucide-react';
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
      success('Welcome to Sathvika Organics B2B Distribution Suite!');
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
        backgroundColor: '#05140d',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px',
        backgroundImage: 
          'radial-gradient(circle at 50% 15%, rgba(16, 185, 129, 0.2) 0%, transparent 65%), radial-gradient(circle at 80% 80%, rgba(245, 158, 11, 0.12) 0%, transparent 50%)',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '480px',
          backgroundColor: 'rgba(9, 29, 20, 0.85)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderRadius: '20px',
          boxShadow: '0 30px 70px rgba(0, 0, 0, 0.8), 0 0 35px rgba(16, 185, 129, 0.25)',
          padding: '40px 36px',
          border: '1px solid rgba(16, 185, 129, 0.3)',
        }}
      >
        {/* Header Branding */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div
            style={{
              width: '60px',
              height: '60px',
              borderRadius: '16px',
              background: 'linear-gradient(135deg, #10b981 0%, #047857 100%)',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '16px',
              boxShadow: '0 8px 24px rgba(16, 185, 129, 0.45)',
              border: '1px solid rgba(255, 255, 255, 0.25)'
            }}
          >
            <Leaf size={32} color="#ffffff" />
          </div>
          <h1 style={{ fontSize: '24px', fontWeight: 800, color: '#ffffff', letterSpacing: '-0.02em' }}>
            SATHVIKA<span style={{ color: '#fbbf24' }}> ORGANICS</span>
          </h1>
          <p style={{ fontSize: '13px', color: '#a7f3d0', marginTop: '6px' }}>
            Specialty Foods & Organic Commodities B2B Operations Suite
          </p>
        </div>

        {/* 1-Click Quick Demo Login Buttons */}
        <div
          style={{
            backgroundColor: 'rgba(6, 22, 14, 0.9)',
            border: '1px solid rgba(16, 185, 129, 0.25)',
            borderRadius: '12px',
            padding: '16px',
            marginBottom: '28px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', fontWeight: 700, color: '#fbbf24', marginBottom: '10px' }}>
            <Sparkles size={14} />
            <span>1-CLICK DEMO AUTHENTICATION (ALL 4 ROLES)</span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
            <button
              type="button"
              onClick={() => handleQuickLogin('admin@sathvika.com', 'Admin')}
              className="btn btn-secondary btn-sm"
              style={{ fontSize: '12px', justifyContent: 'flex-start', background: 'rgba(16, 185, 129, 0.15)', color: '#34d399', borderColor: 'rgba(16, 185, 129, 0.3)' }}
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

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <div style={{ position: 'relative' }}>
              <Mail size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#10b981' }} />
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
              <Lock size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#10b981' }} />
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
