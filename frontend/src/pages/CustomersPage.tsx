import React, { useState, useEffect } from 'react';
import { Users, Plus, Search, Building2, Phone, Mail, MapPin } from 'lucide-react';
import { api } from '../services/api';
import { Customer } from '../types';
import { useToast } from '../context/ToastContext';

export const CustomersPage: React.FC = () => {
  const { success, error } = useToast();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [newCust, setNewCust] = useState({
    companyName: '',
    contactPerson: '',
    mobile: '',
    email: '',
    city: '',
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadCustomers();
  }, []);

  const loadCustomers = async () => {
    setLoading(true);
    try {
      const data = await api.getCustomers();
      setCustomers(data);
    } catch (err: any) {
      error(err.message || 'Failed to load customers.');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCustomer = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const created = await api.createCustomer(newCust);
      success(`Customer ${created.companyName} registered successfully!`);
      setShowModal(false);
      setNewCust({ companyName: '', contactPerson: '', mobile: '', email: '', city: '' });
      loadCustomers();
    } catch (err: any) {
      error(err.message || 'Failed to register customer.');
    } finally {
      setSubmitting(false);
    }
  };

  const filtered = customers.filter((c) => {
    const s = searchTerm.toLowerCase();
    return (
      c.companyName.toLowerCase().includes(s) ||
      c.contactPerson.toLowerCase().includes(s) ||
      c.city.toLowerCase().includes(s)
    );
  });

  return (
    <div className="page-container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
            <div style={{ background: '#1e3a8a', padding: '8px', borderRadius: '8px', color: '#fff' }}>
              <Users size={24} />
            </div>
            <h1 style={{ margin: 0, fontSize: '24px', fontWeight: 800, color: '#0f172a' }}>
              Customer Relationship Master
            </h1>
          </div>
          <p style={{ margin: 0, color: '#64748b', fontSize: '14px' }}>
            Registered B2B industrial clients and procurement contacts.
          </p>
        </div>

        <button onClick={() => setShowModal(true)} className="btn btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
          <Plus size={18} /> Register Customer
        </button>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <div style={{ position: 'relative', width: '320px' }}>
          <Search size={16} color="#94a3b8" style={{ position: 'absolute', left: '10px', top: '10px' }} />
          <input
            type="text"
            placeholder="Search company, contact person, city..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="form-control"
            style={{ paddingLeft: '32px' }}
          />
        </div>
      </div>

      <div className="card" style={{ overflow: 'hidden', padding: 0 }}>
        {loading ? (
          <div style={{ padding: '40px', textAlign: 'center', color: '#64748b' }}>Loading customer directory...</div>
        ) : filtered.length === 0 ? (
          <div style={{ padding: '48px', textAlign: 'center' }}>
            <Users size={44} color="#cbd5e1" style={{ margin: '0 auto 12px' }} />
            <h3 style={{ margin: 0, color: '#334155' }}>No Customers Found</h3>
          </div>
        ) : (
          <table className="table" style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0', textAlign: 'left', fontSize: '12px', color: '#475569', textTransform: 'uppercase' }}>
                <th style={{ padding: '12px 16px' }}>Company Name</th>
                <th style={{ padding: '12px 16px' }}>Contact Person</th>
                <th style={{ padding: '12px 16px' }}>Phone / Mobile</th>
                <th style={{ padding: '12px 16px' }}>Email</th>
                <th style={{ padding: '12px 16px' }}>City</th>
                <th style={{ padding: '12px 16px', textAlign: 'center' }}>Workflow Activity</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((cust) => (
                <tr key={cust.id} style={{ borderBottom: '1px solid #f1f5f9', fontSize: '13px' }}>
                  <td style={{ padding: '14px 16px', fontWeight: 700, color: '#1e3a8a' }}>
                    {cust.companyName}
                  </td>
                  <td style={{ padding: '14px 16px', fontWeight: 600, color: '#0f172a' }}>
                    {cust.contactPerson}
                  </td>
                  <td style={{ padding: '14px 16px', color: '#64748b' }}>
                    {cust.mobile}
                  </td>
                  <td style={{ padding: '14px 16px', color: '#64748b' }}>
                    {cust.email}
                  </td>
                  <td style={{ padding: '14px 16px' }}>
                    <span className="badge badge-secondary">{cust.city}</span>
                  </td>
                  <td style={{ padding: '14px 16px', textAlign: 'center' }}>
                    <span style={{ fontSize: '11px', color: '#64748b' }}>
                      {cust._count?.enquiries || 0} Enq • {cust._count?.quotations || 0} Quote • {cust._count?.salesOrders || 0} Order
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Register Modal */}
      {showModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.6)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px' }}>
          <div style={{ background: '#fff', borderRadius: '12px', maxWidth: '520px', width: '100%', padding: '24px', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.2)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
              <h2 style={{ margin: 0, fontSize: '18px', fontWeight: 700 }}>Register New B2B Customer</h2>
              <button onClick={() => setShowModal(false)} style={{ background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer' }}>✕</button>
            </div>
            <form onSubmit={handleCreateCustomer}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '20px' }}>
                <input
                  type="text"
                  placeholder="Company Name *"
                  value={newCust.companyName}
                  onChange={(e) => setNewCust({ ...newCust, companyName: e.target.value })}
                  className="form-control"
                  required
                />
                <input
                  type="text"
                  placeholder="Contact Person *"
                  value={newCust.contactPerson}
                  onChange={(e) => setNewCust({ ...newCust, contactPerson: e.target.value })}
                  className="form-control"
                  required
                />
                <input
                  type="text"
                  placeholder="Mobile / Phone *"
                  value={newCust.mobile}
                  onChange={(e) => setNewCust({ ...newCust, mobile: e.target.value })}
                  className="form-control"
                  required
                />
                <input
                  type="email"
                  placeholder="Email Address *"
                  value={newCust.email}
                  onChange={(e) => setNewCust({ ...newCust, email: e.target.value })}
                  className="form-control"
                  required
                />
                <input
                  type="text"
                  placeholder="City *"
                  value={newCust.city}
                  onChange={(e) => setNewCust({ ...newCust, city: e.target.value })}
                  className="form-control"
                  required
                />
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                <button type="button" onClick={() => setShowModal(false)} className="btn btn-secondary">Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={submitting}>
                  {submitting ? 'Saving...' : 'Register Customer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
