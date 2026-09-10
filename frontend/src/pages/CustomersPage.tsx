import React, { useEffect, useState } from 'react';
import {
  Search,
  Plus,
  Users,
  Calendar,
  Building,
  Phone,
  Mail,
  Download,
  CheckCircle2,
  X,
  Clock,
  Sparkles,
  Percent
} from 'lucide-react';
import { api } from '../services/api';
import { Customer, CustomerType } from '../types';
import { useToast } from '../context/ToastContext';
import { useAuth } from '../context/AuthContext';

export const CustomersPage: React.FC = () => {
  const { user } = useAuth();
  const { success, error } = useToast();

  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('ALL');

  // Create Customer Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [creating, setCreating] = useState(false);
  const [name, setName] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [mobile, setMobile] = useState('');
  const [email, setEmail] = useState('');
  const [gstNumber, setGstNumber] = useState('');
  const [customerType, setCustomerType] = useState<CustomerType>('WHOLESALE');
  const [address, setAddress] = useState('');
  const [followUpDate, setFollowUpDate] = useState('');

  const fetchCustomers = async () => {
    setLoading(true);
    try {
      const res = await api.getCustomers({
        search: search || undefined,
        customerType: typeFilter !== 'ALL' ? typeFilter : undefined,
      });
      setCustomers(res.customers);
    } catch (err: any) {
      error(err.message || 'Failed to fetch customer directory');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, [typeFilter]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchCustomers();
  };

  // CSV Export Function
  const handleExportCsv = () => {
    if (customers.length === 0) return;
    const headers = ['Name', 'Business Name', 'Mobile', 'Email', 'GST Number', 'Type', 'Status', 'Follow-Up Date', 'Address'];
    const rows = customers.map(c => [
      `"${c.name.replace(/"/g, '""')}"`,
      `"${c.businessName.replace(/"/g, '""')}"`,
      `"${c.mobile}"`,
      `"${c.email || ''}"`,
      `"${c.gstNumber || ''}"`,
      c.customerType,
      c.status,
      c.followUpDate ? new Date(c.followUpDate).toISOString().slice(0, 10) : '',
      `"${(c.address || '').replace(/"/g, '""')}"`
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `sathvika_customers_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    success('Customers exported to CSV');
  };

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreating(true);
    try {
      await api.createCustomer({
        name,
        businessName,
        mobile,
        email: email || undefined,
        gstNumber: gstNumber || undefined,
        customerType,
        address: address || undefined,
        followUpDate: followUpDate ? new Date(followUpDate).toISOString() : undefined,
      });
      success('Customer account registered successfully');
      setIsModalOpen(false);
      resetForm();
      fetchCustomers();
    } catch (err: any) {
      error(err.message || 'Failed to create customer');
    } finally {
      setCreating(false);
    }
  };

  const resetForm = () => {
    setName('');
    setBusinessName('');
    setMobile('');
    setEmail('');
    setGstNumber('');
    setCustomerType('WHOLESALE');
    setAddress('');
    setFollowUpDate('');
  };

  const getTierDiscountBadge = (type: CustomerType) => {
    switch (type) {
      case 'DISTRIBUTOR':
        return <span className="badge badge-primary" style={{ gap: '4px' }}><Percent size={11} /> 18% Distributor Tier</span>;
      case 'WHOLESALE':
        return <span className="badge badge-cyan" style={{ gap: '4px' }}><Percent size={11} /> 10% Wholesale Tier</span>;
      default:
        return <span className="badge badge-neutral">Standard Retail</span>;
    }
  };

  return (
    <div className="page-body">
      {/* Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">
            <span>Customer Accounts & CRM</span>
            <span className="badge badge-primary">{customers.length} Accounts</span>
          </h1>
          <p className="page-subtitle">Tiered wholesale partnerships, GST verified records, and scheduled follow-ups</p>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button onClick={handleExportCsv} className="btn btn-outline" style={{ gap: '6px' }}>
            <Download size={16} />
            <span>Export CSV</span>
          </button>
          {user?.role !== 'WAREHOUSE' && (
            <button onClick={() => setIsModalOpen(true)} className="btn btn-primary" style={{ gap: '6px' }}>
              <Plus size={16} />
              <span>Add Customer Lead</span>
            </button>
          )}
        </div>
      </div>

      {/* Filter Bar */}
      <div className="card" style={{ padding: '16px 20px', marginBottom: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
          <form onSubmit={handleSearchSubmit} style={{ display: 'flex', gap: '8px', flex: 1, minWidth: '280px' }}>
            <div style={{ position: 'relative', flex: 1 }}>
              <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} />
              <input
                type="text"
                placeholder="Search by customer name, business, or GSTIN..."
                className="form-input"
                style={{ paddingLeft: '38px' }}
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
            <button type="submit" className="btn btn-secondary">Search</button>
          </form>

          <div style={{ display: 'flex', gap: '6px' }}>
            {['ALL', 'DISTRIBUTOR', 'WHOLESALE', 'RETAIL'].map(t => (
              <button
                key={t}
                onClick={() => setTypeFilter(t)}
                className={`btn btn-sm ${typeFilter === t ? 'btn-primary' : 'btn-secondary'}`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Customer Directory Table */}
      <div className="table-responsive">
        <table className="data-table">
          <thead>
            <tr>
              <th>Business / Contact</th>
              <th>Category & Discount Tier</th>
              <th>GSTIN Number</th>
              <th>Contact Phone</th>
              <th>Status</th>
              <th>Follow-up Date</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={6} style={{ textAlign: 'center', padding: '40px', color: '#94a3b8' }}>Loading customer records...</td>
              </tr>
            ) : customers.length === 0 ? (
              <tr>
                <td colSpan={6} style={{ textAlign: 'center', padding: '40px', color: '#94a3b8' }}>No customers found matching filter.</td>
              </tr>
            ) : (
              customers.map(c => (
                <tr key={c.id}>
                  <td>
                    <div style={{ fontWeight: 700, color: '#ffffff' }}>{c.businessName}</div>
                    <div style={{ fontSize: '12px', color: '#94a3b8' }}>{c.name}</div>
                  </td>
                  <td>
                    {getTierDiscountBadge(c.customerType)}
                  </td>
                  <td>
                    <span style={{ fontFamily: 'monospace', color: '#cbd5e1', fontSize: '12px' }}>
                      {c.gstNumber || 'Unregistered'}
                    </span>
                  </td>
                  <td>{c.mobile}</td>
                  <td>
                    <span className={`badge ${c.status === 'ACTIVE' ? 'badge-success' : 'badge-warning'}`}>
                      {c.status}
                    </span>
                  </td>
                  <td>
                    {c.followUpDate ? (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: '#f59e0b' }}>
                        <Calendar size={13} />
                        <span>{new Date(c.followUpDate).toLocaleDateString()}</span>
                      </div>
                    ) : (
                      <span style={{ color: '#64748b', fontSize: '12px' }}>None</span>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Create Modal */}
      {isModalOpen && (
        <div className="modal-backdrop" onClick={() => setIsModalOpen(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">Register Customer Account</h3>
              <button onClick={() => setIsModalOpen(false)} className="btn btn-secondary btn-sm" style={{ padding: '4px 8px' }}>
                <X size={16} />
              </button>
            </div>
            <form onSubmit={handleCreateSubmit}>
              <div className="modal-body">
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                  <div className="form-group">
                    <label className="form-label">Business / Firm Name</label>
                    <input
                      type="text"
                      required
                      className="form-input"
                      placeholder="e.g. Apex Global Distributors"
                      value={businessName}
                      onChange={e => setBusinessName(e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Primary Contact Person</label>
                    <input
                      type="text"
                      required
                      className="form-input"
                      placeholder="e.g. Ramesh Kumar"
                      value={name}
                      onChange={e => setName(e.target.value)}
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                  <div className="form-group">
                    <label className="form-label">Mobile Number</label>
                    <input
                      type="text"
                      required
                      className="form-input"
                      placeholder="+91 98765 43210"
                      value={mobile}
                      onChange={e => setMobile(e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">GST Number</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="27AABCU9603R1ZM"
                      value={gstNumber}
                      onChange={e => setGstNumber(e.target.value)}
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                  <div className="form-group">
                    <label className="form-label">Account Tier</label>
                    <select className="form-select" value={customerType} onChange={e => setCustomerType(e.target.value as CustomerType)}>
                      <option value="DISTRIBUTOR">Distributor (18% Volume Off)</option>
                      <option value="WHOLESALE">Wholesale (10% Tier Off)</option>
                      <option value="RETAIL">Retail (Standard Rate)</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Follow-up Date</label>
                    <input
                      type="date"
                      className="form-input"
                      value={followUpDate}
                      onChange={e => setFollowUpDate(e.target.value)}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Billing & Shipping Address</label>
                  <textarea
                    rows={2}
                    className="form-textarea"
                    placeholder="Shop/Warehouse address, City, Pincode"
                    value={address}
                    onChange={e => setAddress(e.target.value)}
                  />
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" onClick={() => setIsModalOpen(false)} className="btn btn-secondary">
                  Cancel
                </button>
                <button type="submit" disabled={creating} className="btn btn-primary">
                  {creating ? 'Saving Account...' : 'Register Customer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
