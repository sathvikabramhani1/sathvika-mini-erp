import React, { useState } from 'react';
import { Building2, Lock, Mail, ArrowRight, Info, ChevronDown, ChevronUp, ShieldCheck, UserCheck } from 'lucide-react';
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
      success('Logged in successfully! Welcome to Sathvika Mini ERP.');
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
        backgroundColor: '#0f172a',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '440px',
          backgroundColor: '#ffffff',
          borderRadius: '16px',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.35)',
          padding: '36px 32px',
          border: '1px solid #e2e8f0',
        }}
      >
        {/* Header Branding */}
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <div
            style={{
              width: '52px',
              height: '52px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #1e40af 0%, #2563eb 100%)',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '14px',
              boxShadow: '0 4px 12px rgba(37, 99, 235, 0.25)',
            }}
          >
            <Building2 size={26} color="#ffffff" />
          </div>
          <h1 style={{ fontSize: '22px', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.02em', margin: 0 }}>
            Sathvika Mini ERP
          </h1>
          <p style={{ fontSize: '13px', color: '#64748b', marginTop: '4px' }}>
            Enterprise Commercial Operations & Supply Chain Portal
          </p>
        </div>

        {/* Standard Clean Professional Login Form */}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">
              Work Email <span className="required">*</span>
            </label>
            <div style={{ position: 'relative' }}>
              <Mail size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
              <input
                type="email"
                required
                className="form-control"
                placeholder="name@sathvika.com"
                style={{ paddingLeft: '38px' }}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div className="form-group" style={{ marginBottom: '22px' }}>
            <label className="form-label">
              Password <span className="required">*</span>
            </label>
            <div style={{ position: 'relative' }}>
              <Lock size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
              <input
                type="password"
                required
                className="form-control"
                placeholder="••••••••••••"
                style={{ paddingLeft: '38px' }}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary"
            style={{ width: '100%', padding: '11px', fontSize: '14px', fontWeight: 700 }}
          >
            {loading ? 'Authenticating...' : 'Sign In to Portal'}
            <ArrowRight size={16} />
          </button>
        </form>

        {/* Quick 1-Click Evaluator Sign-In */}
        <div style={{ marginTop: '18px', display: 'flex', gap: '8px' }}>
          <button
            type="button"
            disabled={loading}
            onClick={() => handleQuickLogin('admin@sathvika.com')}
            className="btn btn-secondary btn-sm"
            style={{ flex: 1, padding: '8px 10px', fontSize: '12px' }}
          >
            <ShieldCheck size={14} color="#2563eb" />
            <span>Admin Login</span>
          </button>
          <button
            type="button"
            disabled={loading}
            onClick={() => handleQuickLogin('sales@sathvika.com')}
            className="btn btn-secondary btn-sm"
            style={{ flex: 1, padding: '8px 10px', fontSize: '12px' }}
          >
            <UserCheck size={14} color="#059669" />
            <span>Sales Login</span>
          </button>
        </div>

        {/* Collapsible Credentials Reference for Evaluators */}
        <div style={{ marginTop: '20px', borderTop: '1px solid #f1f5f9', paddingTop: '14px' }}>
          <button
            type="button"
            onClick={() => setShowCredentialsHelp(!showCredentialsHelp)}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#64748b',
              fontSize: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              width: '100%',
              cursor: 'pointer',
              padding: '4px 0',
              fontWeight: 500,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Info size={14} color="#2563eb" />
              <span>Evaluator Demo Credentials</span>
            </div>
            {showCredentialsHelp ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </button>

          {showCredentialsHelp && (
            <div style={{ marginTop: '10px', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '12px', fontSize: '12px', color: '#475569' }}>
              <div style={{ marginBottom: '6px', fontWeight: 600, color: '#0f172a' }}>
                Default Demo Password: <code>Password123!</code>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                <div
                  onClick={() => handleQuickLogin('admin@sathvika.com')}
                  style={{ cursor: 'pointer', padding: '6px 8px', borderRadius: '6px', background: '#ffffff', border: '1px solid #e2e8f0' }}
                >
                  <div style={{ fontWeight: 600, color: '#1e40af' }}>Admin</div>
                  <div style={{ fontSize: '11px', color: '#64748b' }}>admin@sathvika.com</div>
                </div>
                <div
                  onClick={() => handleQuickLogin('sales@sathvika.com')}
                  style={{ cursor: 'pointer', padding: '6px 8px', borderRadius: '6px', background: '#ffffff', border: '1px solid #e2e8f0' }}
                >
                  <div style={{ fontWeight: 600, color: '#059669' }}>Sales</div>
                  <div style={{ fontSize: '11px', color: '#64748b' }}>sales@sathvika.com</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
