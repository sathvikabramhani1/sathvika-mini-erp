import React, { useState } from 'react';
import { Leaf, Lock, Mail, ArrowRight, Info, ChevronDown, ChevronUp } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export const LoginPage: React.FC = () => {
  const { login } = useAuth();
  const { error, success } = useToast();

  const [email, setEmail] = useState('admin@sathvika.com');
  const [password, setPassword] = useState('Password123!');
  const [loading, setLoading] = useState(false);
  const [showCredentialsHelp, setShowCredentialsHelp] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(email, password);
      success('Logged in successfully! Welcome to Sathvika Organics.');
    } catch (err: any) {
      error(err.message || 'Invalid email or password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickLogin = async (roleEmail: string) => {
    setEmail(roleEmail);
    setPassword('Password123!');
    setLoading(true);
    try {
      await login(roleEmail, 'Password123!');
      success(`Logged in successfully as ${roleEmail === 'admin@sathvika.com' ? 'Admin' : 'Sales'}!`);
    } catch (err: any) {
      error(err.message || 'Login failed. Please try again.');
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
          maxWidth: '460px',
          backgroundColor: 'rgba(9, 29, 20, 0.88)',
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
              width: '56px',
              height: '56px',
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
            <Leaf size={28} color="#ffffff" />
          </div>
          <h1 style={{ fontSize: '22px', fontWeight: 800, color: '#ffffff', letterSpacing: '-0.02em' }}>
            Mini ERP + CRM Portal
          </h1>
          <p style={{ fontSize: '13px', color: '#a7f3d0', marginTop: '6px' }}>
            Sathvika Organics Wholesale & Distribution Operations Suite
          </p>
        </div>

        {/* Standard Clean Professional Login Form */}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Work Email</label>
            <div style={{ position: 'relative' }}>
              <Mail size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#10b981' }} />
              <input
                type="email"
                required
                className="form-input"
                placeholder="name@sathvika.com"
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
                placeholder="••••••••••••"
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
            style={{ width: '100%', padding: '12px', fontSize: '15px', fontWeight: 700 }}
          >
            {loading ? 'Authenticating...' : 'Sign In to Portal'}
            <ArrowRight size={16} />
          </button>
        </form>

        {/* Quick 1-Click Evaluator Sign-In */}
        <div style={{ marginTop: '16px', display: 'flex', gap: '8px' }}>
          <button
            type="button"
            disabled={loading}
            onClick={() => handleQuickLogin('admin@sathvika.com')}
            style={{
              flex: 1,
              padding: '8px 10px',
              fontSize: '12px',
              fontWeight: 600,
              backgroundColor: 'rgba(16, 185, 129, 0.15)',
              color: '#6ee7b7',
              border: '1px solid rgba(16, 185, 129, 0.3)',
              borderRadius: '8px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
            }}
          >
            🛡️ Admin Quick Login
          </button>
          <button
            type="button"
            disabled={loading}
            onClick={() => handleQuickLogin('sales@sathvika.com')}
            style={{
              flex: 1,
              padding: '8px 10px',
              fontSize: '12px',
              fontWeight: 600,
              backgroundColor: 'rgba(59, 130, 246, 0.15)',
              color: '#93c5fd',
              border: '1px solid rgba(59, 130, 246, 0.3)',
              borderRadius: '8px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
            }}
          >
            💼 Sales Quick Login
          </button>
        </div>

        {/* Collapsible Credentials Reference for Evaluators */}
        <div style={{ marginTop: '20px', borderTop: '1px solid rgba(16, 185, 129, 0.15)', paddingTop: '14px' }}>
          <button
            type="button"
            onClick={() => setShowCredentialsHelp(!showCredentialsHelp)}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#86efac',
              fontSize: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              width: '100%',
              cursor: 'pointer',
              padding: '4px 0'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Info size={14} color="#fbbf24" />
              <span>Evaluator Test Credentials Guide</span>
            </div>
            {showCredentialsHelp ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </button>

          {showCredentialsHelp && (
            <div style={{ marginTop: '12px', background: 'rgba(6, 22, 14, 0.95)', border: '1px solid rgba(16, 185, 129, 0.25)', borderRadius: '8px', padding: '12px', fontSize: '11px', color: '#cbd5e1' }}>
              <div style={{ marginBottom: '6px', color: '#fbbf24', fontWeight: 700 }}>Password for all roles: Password123!</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                <div
                  onClick={() => handleQuickLogin('admin@sathvika.com')}
                  style={{ cursor: 'pointer', padding: '4px', borderRadius: '4px', background: 'rgba(255,255,255,0.05)' }}
                >
                  • <strong>Admin:</strong> admin@sathvika.com
                </div>
                <div
                  onClick={() => handleQuickLogin('sales@sathvika.com')}
                  style={{ cursor: 'pointer', padding: '4px', borderRadius: '4px', background: 'rgba(255,255,255,0.05)' }}
                >
                  • <strong>Sales:</strong> sales@sathvika.com
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
