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
      {/* Page Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
            <div style={{ background: '#eff6ff', padding: '8px', borderRadius: '8px', color: '#2563eb', border: '1px solid #bfdbfe' }}>
              <Users size={22} />
            </div>
            <h1 style={{ margin: 0, fontSize: '24px', fontWeight: 800, color: '#0f172a' }}>
              Customer Relationship Master
            </h1>
          </div>
          <p style={{ margin: 0, color: '#64748b', fontSize: '14px' }}>
            Registered B2B industrial clients, procurement managers, and commercial accounts.
          </p>
        </div>

        <button onClick={() => setShowModal(true)} className="btn btn-primary">
          <Plus size={16} /> Register New Customer
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
        <div style={{ position: 'relative', width: '340px' }}>
          <Search size={16} color="#94a3b8" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
          <input
            type="text"
            placeholder="Search company, contact person, city..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="form-control"
            style={{ paddingLeft: '36px' }}
          />
        </div>
        <div style={{ fontSize: '13px', color: '#64748b', fontWeight: 500 }}>
          Showing <strong>{filtered.length}</strong> active client{filtered.length === 1 ? '' : 's'}
        </div>
      </div>

      {/* Customers Data Table */}
      <div className="table-responsive">
        {loading ? (
          <div style={{ padding: '48px', textAlign: 'center', color: '#64748b' }}>Loading customer directory...</div>
        ) : filtered.length === 0 ? (
          <div style={{ padding: '48px', textAlign: 'center' }}>
            <Users size={44} color="#cbd5e1" style={{ margin: '0 auto 12px' }} />
            <h3 style={{ margin: '0 0 6px 0', color: '#334155', fontSize: '16px' }}>No Customers Found</h3>
            <p style={{ margin: 0, color: '#94a3b8', fontSize: '13px' }}>
              Try refining your search keyword or register a new customer above.
            </p>
          </div>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>Company Name</th>
                <th>Contact Person</th>
                <th>Phone / Mobile</th>
                <th>Email</th>
                <th>City</th>
                <th style={{ textAlign: 'center' }}>Workflow Activity</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((cust) => (
                <tr key={cust.id}>
                  <td style={{ fontWeight: 700, color: '#1e3a8a' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Building2 size={16} color="#2563eb" />
                      <span>{cust.companyName}</span>
                    </div>
                  </td>
                  <td style={{ fontWeight: 600, color: '#0f172a' }}>
                    {cust.contactPerson}
                  </td>
                  <td style={{ color: '#475569' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Phone size={13} color="#94a3b8" />
                      <span>{cust.mobile}</span>
                    </div>
                  </td>
                  <td style={{ color: '#475569' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Mail size={13} color="#94a3b8" />
                      <span>{cust.email}</span>
                    </div>
                  </td>
                  <td>
                    <span className="badge badge-secondary">
                      <MapPin size={11} color="#64748b" />
                      {cust.city}
                    </span>
                  </td>
                  <td style={{ textAlign: 'center' }}>
                    <span style={{ fontSize: '12px', color: '#475569', background: '#f1f5f9', padding: '4px 8px', borderRadius: '4px', fontWeight: 500 }}>
                      {cust._count?.enquiries || 0} Enq • {cust._count?.quotations || 0} Quote • {cust._count?.salesOrders || 0} Order
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Standardized Enterprise Register Modal */}
      {showModal && (
        <div className="modal-backdrop">
          <div className="modal-content" style={{ maxWidth: '540px' }}>
            {/* Modal Header */}
            <div className="modal-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#2563eb', border: '1px solid #bfdbfe' }}>
                  <Building2 size={18} />
                </div>
                <div>
                  <h2 className="modal-title">Register New B2B Customer</h2>
                  <p className="modal-subtitle">Add verified enterprise client to the commercial CRM directory</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="modal-close-btn"
                title="Close dialog"
              >
                ✕
              </button>
            </div>

            {/* Modal Form Body */}
            <form onSubmit={handleCreateCustomer}>
              <div className="modal-body">
                {/* Company Name Field */}
                <div className="form-group">
                  <label className="form-label">
                    Company Name <span className="required">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Bharat Agro Foods Ltd."
                    value={newCust.companyName}
                    onChange={(e) => setNewCust({ ...newCust, companyName: e.target.value })}
                    className="form-control"
                    required
                    autoFocus
                  />
                </div>

                {/* 2-Column Contact Person & Mobile */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                  <div className="form-group">
                    <label className="form-label">
                      Contact Person <span className="required">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Rajesh Sharma"
                      value={newCust.contactPerson}
                      onChange={(e) => setNewCust({ ...newCust, contactPerson: e.target.value })}
                      className="form-control"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">
                      Mobile / Phone <span className="required">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. +91 98765 43210"
                      value={newCust.mobile}
                      onChange={(e) => setNewCust({ ...newCust, mobile: e.target.value })}
                      className="form-control"
                      required
                    />
                  </div>
                </div>

                {/* 2-Column Email & City */}
                <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '14px' }}>
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label">
                      Email Address <span className="required">*</span>
                    </label>
                    <input
                      type="email"
                      placeholder="procurement@company.com"
                      value={newCust.email}
                      onChange={(e) => setNewCust({ ...newCust, email: e.target.value })}
                      className="form-control"
                      required
                    />
                  </div>

                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label">
                      City / Location <span className="required">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Hyderabad"
                      value={newCust.city}
                      onChange={(e) => setNewCust({ ...newCust, city: e.target.value })}
                      className="form-control"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="modal-footer">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="btn btn-secondary"
                  disabled={submitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={submitting}
                >
                  {submitting ? 'Registering...' : 'Register Customer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
