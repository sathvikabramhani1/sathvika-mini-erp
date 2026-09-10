import React, { useEffect, useState } from 'react';
import {
  Search,
  Plus,
  Calendar,
  Building,
  Phone,
  Mail,
  Download,
  CheckCircle2,
  X,
  Edit2,
  Eye,
  MessageSquare,
  Send,
  User,
  Percent
} from 'lucide-react';
import { api } from '../services/api';
import { Customer, CustomerType, CustomerStatus } from '../types';
import { useToast } from '../context/ToastContext';
import { useAuth } from '../context/AuthContext';

export const CustomersPage: React.FC = () => {
  const { user } = useAuth();
  const { success, error } = useToast();

  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('ALL');

  // Create Customer Modal State
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [creating, setCreating] = useState(false);
  const [name, setName] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [mobile, setMobile] = useState('');
  const [email, setEmail] = useState('');
  const [gstNumber, setGstNumber] = useState('');
  const [customerType, setCustomerType] = useState<CustomerType>('WHOLESALE');
  const [address, setAddress] = useState('');
  const [followUpDate, setFollowUpDate] = useState('');

  // Edit Customer Modal State
  const [editCustomer, setEditCustomer] = useState<Customer | null>(null);
  const [updating, setUpdating] = useState(false);

  // View Detail & Follow-up Notes State
  const [detailCustomer, setDetailCustomer] = useState<Customer | null>(null);
  const [newNote, setNewNote] = useState('');
  const [submittingNote, setSubmittingNote] = useState(false);

  const fetchCustomers = async () => {
    setLoading(true);
    try {
      const res = await api.getCustomers({
        search: search || undefined,
        customerType: typeFilter !== 'ALL' ? typeFilter : undefined,
      });
      const list = Array.isArray(res) ? res : (res?.customers || res?.data || []);
      setCustomers(list);
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

  // CSV Export
  const handleExportCsv = () => {
    if ((customers || []).length === 0) return;
    const headers = ['Name', 'Business Name', 'Mobile', 'Email', 'GST Number', 'Type', 'Status', 'Follow-Up Date', 'Address'];
    const rows = (customers || []).map(c => [
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

  // Add Customer Submit
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
      setIsCreateModalOpen(false);
      resetCreateForm();
      fetchCustomers();
    } catch (err: any) {
      error(err.message || 'Failed to create customer');
    } finally {
      setCreating(false);
    }
  };

  // Edit Customer Submit
  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editCustomer) return;
    setUpdating(true);
    try {
      await api.updateCustomer(editCustomer.id, {
        name: editCustomer.name,
        businessName: editCustomer.businessName,
        mobile: editCustomer.mobile,
        email: editCustomer.email || undefined,
        gstNumber: editCustomer.gstNumber || undefined,
        customerType: editCustomer.customerType,
        status: editCustomer.status,
        address: editCustomer.address || undefined,
        followUpDate: editCustomer.followUpDate ? new Date(editCustomer.followUpDate).toISOString() : undefined,
      });
      success('Customer account updated successfully');
      setEditCustomer(null);
      fetchCustomers();
    } catch (err: any) {
      error(err.message || 'Failed to update customer');
    } finally {
      setUpdating(false);
    }
  };

  // View Customer Details
  const handleOpenDetail = async (c: Customer) => {
    try {
      const fullCust = await api.getCustomerById(c.id);
      setDetailCustomer(fullCust);
    } catch (err) {
      setDetailCustomer(c);
    }
  };

  // Add Follow-Up Note Submit
  const handleAddNoteSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!detailCustomer || !newNote.trim()) return;
    setSubmittingNote(true);
    try {
      await api.addCustomerNote(detailCustomer.id, newNote.trim());
      success('Follow-up note appended to timeline');
      setNewNote('');
      // Refresh detail customer
      const refreshed = await api.getCustomerById(detailCustomer.id);
      setDetailCustomer(refreshed);
      fetchCustomers();
    } catch (err: any) {
      error(err.message || 'Failed to record note');
    } finally {
      setSubmittingNote(false);
    }
  };

  const resetCreateForm = () => {
    setName('');
    setBusinessName('');
    setMobile('');
    setEmail('');
    setGstNumber('');
    setCustomerType('WHOLESALE');
    setAddress('');
    setFollowUpDate('');
  };

  const getTierBadge = (type: CustomerType) => {
    switch (type) {
      case 'DISTRIBUTOR':
        return <span className="badge badge-gold"><Percent size={11} /> Distributor (18% Off)</span>;
      case 'WHOLESALE':
        return <span className="badge badge-primary"><Percent size={11} /> Wholesale (10% Off)</span>;
      default:
        return <span className="badge badge-neutral">Retail (Standard)</span>;
    }
  };

  return (
    <div className="page-body">
      {/* Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">
            <span>Customer CRM Module</span>
            <span className="badge badge-primary">{(customers || []).length} Accounts</span>
          </h1>
          <p className="page-subtitle">Wholesale partners, supermarket chains, GST records, and customer follow-up notes</p>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button onClick={handleExportCsv} className="btn btn-outline" style={{ gap: '6px' }}>
            <Download size={16} />
            <span>Export CSV</span>
          </button>
          {user?.role !== 'WAREHOUSE' && (
            <button onClick={() => setIsCreateModalOpen(true)} className="btn btn-primary" style={{ gap: '6px' }}>
              <Plus size={16} />
              <span>Add Customer</span>
            </button>
          )}
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="card" style={{ padding: '16px 20px', marginBottom: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
          <form onSubmit={handleSearchSubmit} style={{ display: 'flex', gap: '8px', flex: 1, minWidth: '280px' }}>
            <div style={{ position: 'relative', flex: 1 }}>
              <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#6ee7b7' }} />
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
              <th>Business & Contact</th>
              <th>Customer Type</th>
              <th>GST Number</th>
              <th>Mobile</th>
              <th>Status</th>
              <th>Follow-Up</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={7} style={{ textAlign: 'center', padding: '40px', color: '#a7f3d0' }}>Loading customer directory...</td>
              </tr>
            ) : (customers || []).length === 0 ? (
              <tr>
                <td colSpan={7} style={{ textAlign: 'center', padding: '40px', color: '#a7f3d0' }}>No customers found matching query.</td>
              </tr>
            ) : (
              (customers || []).map(c => (
                <tr key={c.id}>
                  <td>
                    <div style={{ fontWeight: 700, color: '#ffffff', cursor: 'pointer' }} onClick={() => handleOpenDetail(c)}>
                      {c.businessName}
                    </div>
                    <div style={{ fontSize: '12px', color: '#86efac' }}>{c.name}</div>
                  </td>
                  <td>{getTierBadge(c.customerType)}</td>
                  <td>
                    <span style={{ fontFamily: 'monospace', color: '#e2e8f0', fontSize: '12px' }}>
                      {c.gstNumber || 'N/A'}
                    </span>
                  </td>
                  <td>{c.mobile}</td>
                  <td>
                    <span className={`badge ${c.status === 'ACTIVE' ? 'badge-success' : c.status === 'LEAD' ? 'badge-gold' : 'badge-neutral'}`}>
                      {c.status}
                    </span>
                  </td>
                  <td>
                    {c.followUpDate ? (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: '#fbbf24' }}>
                        <Calendar size={13} />
                        <span>{new Date(c.followUpDate).toLocaleDateString()}</span>
                      </div>
                    ) : (
                      <span style={{ color: '#6ee7b7', fontSize: '12px' }}>None</span>
                    )}
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button
                        onClick={() => handleOpenDetail(c)}
                        className="btn btn-secondary btn-sm"
                        style={{ gap: '4px', fontSize: '11px' }}
                        title="View Details & Notes"
                      >
                        <Eye size={12} color="#10b981" />
                        <span>View</span>
                      </button>
                      {user?.role !== 'WAREHOUSE' && (
                        <button
                          onClick={() => setEditCustomer({ ...c })}
                          className="btn btn-outline btn-sm"
                          style={{ gap: '4px', fontSize: '11px' }}
                          title="Edit Customer"
                        >
                          <Edit2 size={12} color="#fbbf24" />
                          <span>Edit</span>
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* 1. CREATE CUSTOMER MODAL */}
      {isCreateModalOpen && (
        <div className="modal-backdrop" onClick={() => setIsCreateModalOpen(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">Add New Customer Account</h3>
              <button onClick={() => setIsCreateModalOpen(false)} className="btn btn-secondary btn-sm" style={{ padding: '4px 8px' }}>
                <X size={16} />
              </button>
            </div>
            <form onSubmit={handleCreateSubmit}>
              <div className="modal-body">
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                  <div className="form-group">
                    <label className="form-label">Business / Firm Name *</label>
                    <input
                      type="text"
                      required
                      className="form-input"
                      placeholder="e.g. GreenLeaf Supermarkets"
                      value={businessName}
                      onChange={e => setBusinessName(e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Contact Person Name *</label>
                    <input
                      type="text"
                      required
                      className="form-input"
                      placeholder="e.g. Arjun Somani"
                      value={name}
                      onChange={e => setName(e.target.value)}
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                  <div className="form-group">
                    <label className="form-label">Mobile Number *</label>
                    <input
                      type="text"
                      required
                      className="form-input"
                      placeholder="+91 98450 11223"
                      value={mobile}
                      onChange={e => setMobile(e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Email Address</label>
                    <input
                      type="email"
                      className="form-input"
                      placeholder="arjun@greenleaf.in"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                  <div className="form-group">
                    <label className="form-label">GST Number (Optional)</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="29AABCG5512D1Z3"
                      value={gstNumber}
                      onChange={e => setGstNumber(e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Customer Type *</label>
                    <select className="form-select" value={customerType} onChange={e => setCustomerType(e.target.value as CustomerType)}>
                      <option value="DISTRIBUTOR">Distributor (18% Tier Off)</option>
                      <option value="WHOLESALE">Wholesale (10% Tier Off)</option>
                      <option value="RETAIL">Retail (Standard Rate)</option>
                    </select>
                  </div>
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

                <div className="form-group">
                  <label className="form-label">Delivery & Billing Address</label>
                  <textarea
                    rows={2}
                    className="form-textarea"
                    placeholder="Warehouse / shop location, City, Pincode"
                    value={address}
                    onChange={e => setAddress(e.target.value)}
                  />
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" onClick={() => setIsCreateModalOpen(false)} className="btn btn-secondary">
                  Cancel
                </button>
                <button type="submit" disabled={creating} className="btn btn-primary">
                  {creating ? 'Saving...' : 'Add Customer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 2. EDIT CUSTOMER MODAL */}
      {editCustomer && (
        <div className="modal-backdrop" onClick={() => setEditCustomer(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">Edit Customer: {editCustomer.businessName}</h3>
              <button onClick={() => setEditCustomer(null)} className="btn btn-secondary btn-sm" style={{ padding: '4px 8px' }}>
                <X size={16} />
              </button>
            </div>
            <form onSubmit={handleEditSubmit}>
              <div className="modal-body">
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                  <div className="form-group">
                    <label className="form-label">Business / Firm Name *</label>
                    <input
                      type="text"
                      required
                      className="form-input"
                      value={editCustomer.businessName}
                      onChange={e => setEditCustomer({ ...editCustomer, businessName: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Contact Person *</label>
                    <input
                      type="text"
                      required
                      className="form-input"
                      value={editCustomer.name}
                      onChange={e => setEditCustomer({ ...editCustomer, name: e.target.value })}
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                  <div className="form-group">
                    <label className="form-label">Mobile Number *</label>
                    <input
                      type="text"
                      required
                      className="form-input"
                      value={editCustomer.mobile}
                      onChange={e => setEditCustomer({ ...editCustomer, mobile: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Email Address</label>
                    <input
                      type="email"
                      className="form-input"
                      value={editCustomer.email || ''}
                      onChange={e => setEditCustomer({ ...editCustomer, email: e.target.value })}
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                  <div className="form-group">
                    <label className="form-label">GST Number</label>
                    <input
                      type="text"
                      className="form-input"
                      value={editCustomer.gstNumber || ''}
                      onChange={e => setEditCustomer({ ...editCustomer, gstNumber: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Customer Type</label>
                    <select
                      className="form-select"
                      value={editCustomer.customerType}
                      onChange={e => setEditCustomer({ ...editCustomer, customerType: e.target.value as CustomerType })}
                    >
                      <option value="DISTRIBUTOR">Distributor</option>
                      <option value="WHOLESALE">Wholesale</option>
                      <option value="RETAIL">Retail</option>
                    </select>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                  <div className="form-group">
                    <label className="form-label">Account Status</label>
                    <select
                      className="form-select"
                      value={editCustomer.status}
                      onChange={e => setEditCustomer({ ...editCustomer, status: e.target.value as CustomerStatus })}
                    >
                      <option value="ACTIVE">Active</option>
                      <option value="LEAD">Lead</option>
                      <option value="INACTIVE">Inactive</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Follow-up Date</label>
                    <input
                      type="date"
                      className="form-input"
                      value={editCustomer.followUpDate ? editCustomer.followUpDate.slice(0, 10) : ''}
                      onChange={e => setEditCustomer({ ...editCustomer, followUpDate: e.target.value })}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Address</label>
                  <textarea
                    rows={2}
                    className="form-textarea"
                    value={editCustomer.address || ''}
                    onChange={e => setEditCustomer({ ...editCustomer, address: e.target.value })}
                  />
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" onClick={() => setEditCustomer(null)} className="btn btn-secondary">
                  Cancel
                </button>
                <button type="submit" disabled={updating} className="btn btn-primary">
                  {updating ? 'Saving...' : 'Update Customer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 3. VIEW CUSTOMER DETAIL PAGE & ADD FOLLOW-UP NOTES */}
      {detailCustomer && (
        <div className="modal-backdrop" onClick={() => setDetailCustomer(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '700px' }}>
            <div className="modal-header">
              <div>
                <h3 className="modal-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Building size={20} color="#10b981" />
                  <span>{detailCustomer.businessName}</span>
                </h3>
                <div style={{ fontSize: '12px', color: '#a7f3d0', marginTop: '4px' }}>
                  Contact: {detailCustomer.name} | Phone: {detailCustomer.mobile}
                </div>
              </div>
              <button onClick={() => setDetailCustomer(null)} className="btn btn-secondary btn-sm" style={{ padding: '4px 8px' }}>
                <X size={16} />
              </button>
            </div>

            <div className="modal-body" style={{ maxHeight: '72vh', overflowY: 'auto' }}>
              {/* Info Cards */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '10px', marginBottom: '20px' }}>
                <div style={{ background: 'rgba(6,22,14,0.8)', padding: '12px', borderRadius: '8px', border: '1px solid rgba(16,185,129,0.2)' }}>
                  <div style={{ fontSize: '11px', color: '#a7f3d0' }}>Customer Tier</div>
                  <div style={{ fontSize: '13px', fontWeight: 700, color: '#ffffff', marginTop: '2px' }}>{detailCustomer.customerType}</div>
                </div>
                <div style={{ background: 'rgba(6,22,14,0.8)', padding: '12px', borderRadius: '8px', border: '1px solid rgba(16,185,129,0.2)' }}>
                  <div style={{ fontSize: '11px', color: '#a7f3d0' }}>Account Status</div>
                  <div style={{ fontSize: '13px', fontWeight: 700, color: '#34d399', marginTop: '2px' }}>{detailCustomer.status}</div>
                </div>
                <div style={{ background: 'rgba(6,22,14,0.8)', padding: '12px', borderRadius: '8px', border: '1px solid rgba(16,185,129,0.2)' }}>
                  <div style={{ fontSize: '11px', color: '#a7f3d0' }}>GSTIN</div>
                  <div style={{ fontSize: '12px', fontWeight: 600, color: '#fbbf24', marginTop: '2px', fontFamily: 'monospace' }}>
                    {detailCustomer.gstNumber || 'Not Registered'}
                  </div>
                </div>
                <div style={{ background: 'rgba(6,22,14,0.8)', padding: '12px', borderRadius: '8px', border: '1px solid rgba(16,185,129,0.2)' }}>
                  <div style={{ fontSize: '11px', color: '#a7f3d0' }}>Next Follow-up</div>
                  <div style={{ fontSize: '12px', fontWeight: 600, color: '#ffffff', marginTop: '2px' }}>
                    {detailCustomer.followUpDate ? new Date(detailCustomer.followUpDate).toLocaleDateString() : 'None'}
                  </div>
                </div>
              </div>

              {detailCustomer.address && (
                <div style={{ background: 'rgba(6,22,14,0.6)', padding: '12px', borderRadius: '8px', marginBottom: '20px', fontSize: '13px', color: '#cbd5e1' }}>
                  <strong>Address:</strong> {detailCustomer.address}
                </div>
              )}

              {/* Follow-up Notes Section */}
              <div style={{ marginTop: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                  <MessageSquare size={16} color="#10b981" />
                  <h4 style={{ fontSize: '14px', fontWeight: 700, color: '#ffffff' }}>Follow-Up Interaction Notes</h4>
                </div>

                {/* Add Note Form */}
                <form onSubmit={handleAddNoteSubmit} style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
                  <input
                    type="text"
                    required
                    placeholder="Log a client conversation, follow-up, or requirement..."
                    className="form-input"
                    value={newNote}
                    onChange={e => setNewNote(e.target.value)}
                  />
                  <button type="submit" disabled={submittingNote} className="btn btn-primary" style={{ gap: '6px', whiteSpace: 'nowrap' }}>
                    <Send size={14} />
                    <span>{submittingNote ? 'Saving...' : 'Add Note'}</span>
                  </button>
                </form>

                {/* Notes Timeline List */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {detailCustomer.followUpNotes && detailCustomer.followUpNotes.length > 0 ? (
                    detailCustomer.followUpNotes.map((note) => (
                      <div
                        key={note.id}
                        style={{
                          background: 'rgba(6,22,14,0.85)',
                          border: '1px solid rgba(16,185,129,0.2)',
                          borderRadius: '8px',
                          padding: '12px',
                        }}
                      >
                        <div style={{ fontSize: '13px', color: '#f0fdf4', marginBottom: '4px' }}>{note.note}</div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#86efac' }}>
                          <span>By: {note.createdByUser?.name || 'Staff Member'}</span>
                          <span>{new Date(note.createdAt).toLocaleString('en-IN')}</span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div style={{ textAlign: 'center', color: '#6ee7b7', padding: '16px', background: 'rgba(255,255,255,0.03)', borderRadius: '8px', fontSize: '13px' }}>
                      No follow-up notes recorded yet. Add the first note above!
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button onClick={() => setDetailCustomer(null)} className="btn btn-secondary">
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
