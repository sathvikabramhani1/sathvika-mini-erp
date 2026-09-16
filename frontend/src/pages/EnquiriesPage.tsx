import React, { useState, useEffect } from 'react';
import {
  FileQuestion,
  Plus,
  Search,
  ArrowRight,
  CheckCircle2,
  Clock,
  XCircle,
  Layers,
  ChevronRight,
} from 'lucide-react';
import { api } from '../services/api';
import { Enquiry, Customer, Product, EnquiryStatus } from '../types';
import { useToast } from '../context/ToastContext';

interface EnquiriesPageProps {
  onNavigate?: (tab: string) => void;
}

export const EnquiriesPage: React.FC<EnquiriesPageProps> = ({ onNavigate }) => {
  const { success, error } = useToast();

  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [searchTerm, setSearchTerm] = useState('');

  // New Enquiry Modal State
  const [showModal, setShowModal] = useState(false);
  const [selectedCustomerId, setSelectedCustomerId] = useState('');
  const [isNewCustomer, setIsNewCustomer] = useState(false);
  const [newCust, setNewCust] = useState({
    companyName: '',
    contactPerson: '',
    mobile: '',
    email: '',
    city: '',
  });
  const [requiredDate, setRequiredDate] = useState(
    new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0]
  );
  const [notes, setNotes] = useState('');
  const [enquiryItems, setEnquiryItems] = useState<{ productId: string; quantity: number }[]>([
    { productId: '', quantity: 10 },
  ]);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadData();
  }, [statusFilter]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [enqData, custList, prodList] = await Promise.all([
        api.getEnquiries(statusFilter),
        api.getCustomers(),
        api.getProducts(),
      ]);
      setEnquiries(enqData);
      setCustomers(custList);
      setProducts(prodList);
      if (custList.length > 0 && !selectedCustomerId) {
        setSelectedCustomerId(custList[0].id);
      }
      if (prodList.length > 0 && !enquiryItems[0]?.productId) {
        setEnquiryItems([{ productId: prodList[0].id, quantity: 10 }]);
      }
    } catch (err: any) {
      error(err.message || 'Failed to load enquiries data.');
    } finally {
      setLoading(false);
    }
  };

  const handleAddItem = () => {
    if (products.length > 0) {
      setEnquiryItems([...enquiryItems, { productId: products[0].id, quantity: 10 }]);
    }
  };

  const handleRemoveItem = (index: number) => {
    if (enquiryItems.length > 1) {
      setEnquiryItems(enquiryItems.filter((_, i) => i !== index));
    }
  };

  const handleItemChange = (index: number, field: 'productId' | 'quantity', value: any) => {
    const updated = [...enquiryItems];
    updated[index] = { ...updated[index], [field]: value };
    setEnquiryItems(updated);
  };

  const handleCreateEnquiry = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const payload: any = {
        requiredDate,
        notes,
        items: enquiryItems.map((item) => ({
          productId: item.productId,
          quantity: Number(item.quantity),
        })),
      };

      if (isNewCustomer) {
        payload.customer = newCust;
      } else {
        payload.customerId = selectedCustomerId;
      }

      const created = await api.createEnquiry(payload);
      success(`Enquiry ${created.enquiryNumber} created successfully!`);
      setShowModal(false);
      setNotes('');
      setIsNewCustomer(false);
      loadData();
    } catch (err: any) {
      error(err.message || 'Failed to create enquiry.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleStatusChange = async (id: string, newStatus: EnquiryStatus) => {
    try {
      await api.updateEnquiryStatus(id, newStatus);
      success(`Enquiry status updated to ${newStatus}`);
      loadData();
    } catch (err: any) {
      error(err.message || 'Failed to update status.');
    }
  };

  const filteredEnquiries = enquiries.filter((e) => {
    const search = searchTerm.toLowerCase();
    return (
      e.enquiryNumber.toLowerCase().includes(search) ||
      e.customer.companyName.toLowerCase().includes(search) ||
      e.customer.city.toLowerCase().includes(search)
    );
  });

  const getStatusBadge = (status: EnquiryStatus) => {
    switch (status) {
      case 'NEW':
        return (
          <span className="badge badge-primary">
            <Clock size={12} /> NEW
          </span>
        );
      case 'QUOTED':
        return (
          <span className="badge badge-warning">
            <Layers size={12} /> QUOTED
          </span>
        );
      case 'WON':
        return (
          <span className="badge badge-success">
            <CheckCircle2 size={12} /> WON
          </span>
        );
      case 'LOST':
        return (
          <span className="badge badge-danger">
            <XCircle size={12} /> LOST
          </span>
        );
      default:
        return <span className="badge badge-secondary">{status}</span>;
    }
  };

  return (
    <div className="page-container">
      {/* Page Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
            <div style={{ background: '#eff6ff', padding: '8px', borderRadius: '8px', color: '#2563eb', border: '1px solid #bfdbfe' }}>
              <FileQuestion size={22} />
            </div>
            <h1 style={{ margin: 0, fontSize: '24px', fontWeight: 800, color: '#0f172a' }}>
              Customer Enquiries
            </h1>
          </div>
          <p style={{ margin: 0, color: '#64748b', fontSize: '13.5px' }}>
            Step 1 of 5: Capture incoming buyer RFQs and initiate commercial pricing workflows.
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="btn btn-primary"
        >
          <Plus size={16} /> New Customer Enquiry
        </button>
      </div>

      {/* Modern Workflow Stepper */}
      <div className="workflow-stepper">
        <span className="stepper-item active">
          <span className="stepper-number">1</span>
          <span>Enquiry</span>
        </span>
        <ChevronRight size={14} color="#cbd5e1" />
        <span className="stepper-item">
          <span className="stepper-number">2</span>
          <span>Quotation</span>
        </span>
        <ChevronRight size={14} color="#cbd5e1" />
        <span className="stepper-item">
          <span className="stepper-number">3</span>
          <span>Sales Order</span>
        </span>
        <ChevronRight size={14} color="#cbd5e1" />
        <span className="stepper-item">
          <span className="stepper-number">4</span>
          <span>Stock Reservation</span>
        </span>
        <ChevronRight size={14} color="#cbd5e1" />
        <span className="stepper-item">
          <span className="stepper-number">5</span>
          <span>Dispatch</span>
        </span>
      </div>

      {/* Filter Segmented Control & Search Box */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '16px', marginBottom: '18px', flexWrap: 'wrap' }}>
        <div className="segmented-control">
          {['ALL', 'NEW', 'QUOTED', 'WON', 'LOST'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`filter-tab ${statusFilter === st ? 'active' : ''}`}
            >
              {st}
            </button>
          ))}
        </div>

        <div className="search-box" style={{ width: '320px' }}>
          <Search size={15} />
          <input
            type="text"
            placeholder="Search Enquiry #, Customer, City..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="form-control"
          />
        </div>
      </div>

      {/* Enquiries Table */}
      <div className="table-responsive">
        {loading ? (
          <div style={{ padding: '48px', textAlign: 'center', color: '#64748b' }}>Loading customer enquiries...</div>
        ) : filteredEnquiries.length === 0 ? (
          <div style={{ padding: '48px', textAlign: 'center' }}>
            <FileQuestion size={44} color="#cbd5e1" style={{ margin: '0 auto 12px' }} />
            <h3 style={{ margin: '0 0 6px 0', color: '#334155', fontSize: '16px' }}>No Customer Enquiries Found</h3>
            <p style={{ margin: 0, color: '#94a3b8', fontSize: '13.5px' }}>
              Create your first customer enquiry above to initiate the commercial workflow.
            </p>
          </div>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>Enquiry #</th>
                <th>Customer Account</th>
                <th>Enquiry Date</th>
                <th>Required By</th>
                <th>Products Requested</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredEnquiries.map((enq) => (
                <tr key={enq.id}>
                  <td style={{ fontWeight: 700, color: '#1e3a8a' }}>
                    <code>{enq.enquiryNumber}</code>
                  </td>
                  <td>
                    <div style={{ fontWeight: 600, color: '#0f172a' }}>{enq.customer.companyName}</div>
                    <div style={{ fontSize: '12px', color: '#64748b' }}>
                      {enq.customer.contactPerson} • {enq.customer.city}
                    </div>
                  </td>
                  <td style={{ color: '#475569' }}>
                    {new Date(enq.enquiryDate).toLocaleDateString()}
                  </td>
                  <td style={{ color: '#475569' }}>
                    {new Date(enq.requiredDate).toLocaleDateString()}
                  </td>
                  <td>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
                      {enq.items.slice(0, 2).map((item, idx) => (
                        <span key={idx} style={{ fontSize: '12.5px', color: '#334155' }}>
                          • <strong>{item.quantity} {item.product?.unit || 'Units'}</strong> of {item.product?.productName}
                        </span>
                      ))}
                      {enq.items.length > 2 && (
                        <span style={{ fontSize: '11px', color: '#64748b', fontWeight: 500 }}>
                          +{enq.items.length - 2} more item(s)
                        </span>
                      )}
                    </div>
                  </td>
                  <td>
                    {getStatusBadge(enq.status)}
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                      {/* Status Dropdown */}
                      <select
                        value={enq.status}
                        onChange={(e) => handleStatusChange(enq.id, e.target.value as EnquiryStatus)}
                        className="form-select"
                        style={{ fontSize: '12px', padding: '4px 8px', width: 'auto' }}
                      >
                        <option value="NEW">NEW</option>
                        <option value="QUOTED">QUOTED</option>
                        <option value="WON">WON</option>
                        <option value="LOST">LOST</option>
                      </select>

                      {/* Convert to Quotation Button */}
                      <button
                        onClick={() => onNavigate?.('quotations')}
                        className="btn btn-primary btn-sm"
                        title="Open Quotation Engine"
                      >
                        <span>Quote</span>
                        <ArrowRight size={13} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Standardized Enterprise New Enquiry Modal */}
      {showModal && (
        <div className="modal-backdrop">
          <div className="modal-content" style={{ maxWidth: '680px' }}>
            <div className="modal-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#2563eb', border: '1px solid #bfdbfe' }}>
                  <FileQuestion size={18} />
                </div>
                <div>
                  <h2 className="modal-title">New Customer Enquiry</h2>
                  <p className="modal-subtitle">Log incoming industrial procurement RFQ into commercial pipeline</p>
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

            <form onSubmit={handleCreateEnquiry}>
              <div className="modal-body">
                {/* Customer Selector */}
                <div className="form-group">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                    <label className="form-label" style={{ marginBottom: 0 }}>
                      Customer Account <span className="required">*</span>
                    </label>
                    <button
                      type="button"
                      onClick={() => setIsNewCustomer(!isNewCustomer)}
                      style={{ background: 'none', border: 'none', color: '#2563eb', fontSize: '12px', fontWeight: 600, cursor: 'pointer' }}
                    >
                      {isNewCustomer ? '← Select Existing Customer' : '+ Register New Customer'}
                    </button>
                  </div>

                  {!isNewCustomer ? (
                    <select
                      value={selectedCustomerId}
                      onChange={(e) => setSelectedCustomerId(e.target.value)}
                      className="form-control"
                      required
                    >
                      {customers.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.companyName} ({c.contactPerson} - {c.city})
                        </option>
                      ))}
                    </select>
                  ) : (
                    <div style={{ background: '#f8fafc', padding: '14px', borderRadius: '8px', border: '1px solid #e2e8f0', marginTop: '6px' }}>
                      <div style={{ fontSize: '12px', fontWeight: 700, color: '#334155', marginBottom: '10px' }}>
                        Quick Client Profile Details:
                      </div>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
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
                          placeholder="City / Region *"
                          value={newCust.city}
                          onChange={(e) => setNewCust({ ...newCust, city: e.target.value })}
                          className="form-control"
                          style={{ gridColumn: 'span 2' }}
                          required
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Required Delivery Date & Notes */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                  <div className="form-group">
                    <label className="form-label">
                      Required Delivery Date <span className="required">*</span>
                    </label>
                    <input
                      type="date"
                      value={requiredDate}
                      onChange={(e) => setRequiredDate(e.target.value)}
                      className="form-control"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">
                      Commercial Notes
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Urgent requirement for facility overhaul"
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      className="form-control"
                    />
                  </div>
                </div>

                {/* Dynamic Product Items */}
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <label className="form-label" style={{ marginBottom: 0 }}>
                      Enquiry Line Items <span className="required">*</span>
                    </label>
                    <button
                      type="button"
                      onClick={handleAddItem}
                      className="btn btn-outline btn-sm"
                      style={{ color: '#2563eb', borderColor: '#bfdbfe', background: '#eff6ff' }}
                    >
                      + Add Item Line
                    </button>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {enquiryItems.map((item, idx) => (
                      <div key={idx} style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                        <select
                          value={item.productId}
                          onChange={(e) => handleItemChange(idx, 'productId', e.target.value)}
                          className="form-control"
                          style={{ flex: 1 }}
                          required
                        >
                          {products.map((p) => (
                            <option key={p.id} value={p.id}>
                              [{p.productCode}] {p.productName} (Base: ₹{p.basePrice} / {p.unit})
                            </option>
                          ))}
                        </select>

                        <input
                          type="number"
                          min="1"
                          placeholder="Qty"
                          value={item.quantity}
                          onChange={(e) => handleItemChange(idx, 'quantity', Math.max(1, parseInt(e.target.value) || 1))}
                          className="form-control"
                          style={{ width: '100px' }}
                          required
                        />

                        {enquiryItems.length > 1 && (
                          <button
                            type="button"
                            onClick={() => handleRemoveItem(idx)}
                            style={{
                              background: '#fef2f2',
                              border: '1px solid #fecaca',
                              color: '#dc2626',
                              width: '34px',
                              height: '34px',
                              borderRadius: '6px',
                              cursor: 'pointer',
                              display: 'inline-flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontWeight: 700,
                            }}
                            title="Remove line item"
                          >
                            ✕
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Submit Buttons */}
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
                  {submitting ? 'Creating...' : 'Create Enquiry'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
