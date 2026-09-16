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
      // Reset form
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
          <span className="badge badge-info" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
            <Clock size={13} /> NEW
          </span>
        );
      case 'QUOTED':
        return (
          <span className="badge badge-warning" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
            <Layers size={13} /> QUOTED
          </span>
        );
      case 'WON':
        return (
          <span className="badge badge-success" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
            <CheckCircle2 size={13} /> WON
          </span>
        );
      case 'LOST':
        return (
          <span className="badge badge-danger" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
            <XCircle size={13} /> LOST
          </span>
        );
      default:
        return <span className="badge">{status}</span>;
    }
  };

  return (
    <div className="page-container">
      {/* Header Banner */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
            <div style={{ background: '#1e3a8a', padding: '8px', borderRadius: '8px', color: '#fff' }}>
              <FileQuestion size={24} />
            </div>
            <h1 style={{ margin: 0, fontSize: '24px', fontWeight: 800, color: '#0f172a' }}>
              Customer Enquiries
            </h1>
          </div>
          <p style={{ margin: 0, color: '#64748b', fontSize: '14px' }}>
            Step 1 of Workflow: Capture incoming commercial enquiries for industrial products. (NEW → QUOTED → WON/LOST)
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="btn btn-primary"
          style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}
        >
          <Plus size={18} /> New Customer Enquiry
        </button>
      </div>

      {/* Workflow Indicator Breadcrumb */}
      <div
        style={{
          background: '#f8fafc',
          border: '1px solid #e2e8f0',
          borderRadius: '8px',
          padding: '12px 18px',
          marginBottom: '20px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          fontSize: '13px',
          fontWeight: 600,
        }}
      >
        <span style={{ color: '#2563eb', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
          <span style={{ background: '#2563eb', color: '#fff', borderRadius: '50%', width: '20px', height: '20px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px' }}>1</span>
          Customer Enquiry
        </span>
        <ChevronRight size={16} color="#94a3b8" />
        <span style={{ color: '#64748b' }}>2. Quotation</span>
        <ChevronRight size={16} color="#94a3b8" />
        <span style={{ color: '#64748b' }}>3. Sales Order</span>
        <ChevronRight size={16} color="#94a3b8" />
        <span style={{ color: '#64748b' }}>4. Inventory Reservation</span>
        <ChevronRight size={16} color="#94a3b8" />
        <span style={{ color: '#64748b' }}>5. Dispatch</span>
      </div>

      {/* Filter Tabs & Search Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '16px', marginBottom: '20px', flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', gap: '8px' }}>
          {['ALL', 'NEW', 'QUOTED', 'WON', 'LOST'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`filter-tab ${statusFilter === st ? 'active' : ''}`}
              style={{
                padding: '7px 16px',
                borderRadius: '6px',
                border: statusFilter === st ? '1px solid #2563eb' : '1px solid #e2e8f0',
                background: statusFilter === st ? '#eff6ff' : '#ffffff',
                color: statusFilter === st ? '#1d4ed8' : '#64748b',
                fontWeight: statusFilter === st ? 700 : 500,
                fontSize: '13px',
                cursor: 'pointer',
              }}
            >
              {st}
            </button>
          ))}
        </div>

        <div style={{ position: 'relative', minWidth: '260px' }}>
          <Search size={16} color="#94a3b8" style={{ position: 'absolute', left: '10px', top: '10px' }} />
          <input
            type="text"
            placeholder="Search by Enquiry #, Customer, City..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="form-control"
            style={{ paddingLeft: '32px', fontSize: '13px' }}
          />
        </div>
      </div>

      {/* Enquiries Table */}
      <div className="card" style={{ overflow: 'hidden', padding: 0 }}>
        {loading ? (
          <div style={{ padding: '40px', textAlign: 'center', color: '#64748b' }}>Loading enquiries...</div>
        ) : filteredEnquiries.length === 0 ? (
          <div style={{ padding: '48px', textAlign: 'center' }}>
            <FileQuestion size={44} color="#cbd5e1" style={{ margin: '0 auto 12px' }} />
            <h3 style={{ margin: '0 0 6px 0', color: '#334155' }}>No Customer Enquiries Found</h3>
            <p style={{ margin: 0, color: '#94a3b8', fontSize: '14px' }}>
              Create your first enquiry to initiate the sales quotation workflow.
            </p>
          </div>
        ) : (
          <table className="table" style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0', textAlign: 'left', fontSize: '12px', color: '#475569', textTransform: 'uppercase' }}>
                <th style={{ padding: '12px 16px' }}>Enquiry #</th>
                <th style={{ padding: '12px 16px' }}>Customer</th>
                <th style={{ padding: '12px 16px' }}>Date</th>
                <th style={{ padding: '12px 16px' }}>Required By</th>
                <th style={{ padding: '12px 16px' }}>Products Requested</th>
                <th style={{ padding: '12px 16px' }}>Status</th>
                <th style={{ padding: '12px 16px', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredEnquiries.map((enq) => (
                <tr key={enq.id} style={{ borderBottom: '1px solid #f1f5f9', fontSize: '13px' }}>
                  <td style={{ padding: '14px 16px', fontWeight: 700, color: '#1e3a8a' }}>
                    {enq.enquiryNumber}
                  </td>
                  <td style={{ padding: '14px 16px' }}>
                    <div style={{ fontWeight: 600, color: '#0f172a' }}>{enq.customer.companyName}</div>
                    <div style={{ fontSize: '12px', color: '#64748b' }}>
                      {enq.customer.contactPerson} • {enq.customer.city}
                    </div>
                  </td>
                  <td style={{ padding: '14px 16px', color: '#64748b' }}>
                    {new Date(enq.enquiryDate).toLocaleDateString()}
                  </td>
                  <td style={{ padding: '14px 16px', color: '#64748b' }}>
                    {new Date(enq.requiredDate).toLocaleDateString()}
                  </td>
                  <td style={{ padding: '14px 16px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
                      {enq.items.slice(0, 2).map((item, idx) => (
                        <span key={idx} style={{ fontSize: '12px', color: '#334155' }}>
                          • <strong>{item.quantity} {item.product?.unit || 'Units'}</strong> of {item.product?.productName}
                        </span>
                      ))}
                      {enq.items.length > 2 && (
                        <span style={{ fontSize: '11px', color: '#64748b' }}>
                          +{enq.items.length - 2} more item(s)
                        </span>
                      )}
                    </div>
                  </td>
                  <td style={{ padding: '14px 16px' }}>
                    {getStatusBadge(enq.status)}
                  </td>
                  <td style={{ padding: '14px 16px', textAlign: 'right' }}>
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                      {/* Status Dropdown */}
                      <select
                        value={enq.status}
                        onChange={(e) => handleStatusChange(enq.id, e.target.value as EnquiryStatus)}
                        style={{
                          fontSize: '12px',
                          padding: '4px 8px',
                          borderRadius: '4px',
                          border: '1px solid #cbd5e1',
                          background: '#fff',
                        }}
                      >
                        <option value="NEW">NEW</option>
                        <option value="QUOTED">QUOTED</option>
                        <option value="WON">WON</option>
                        <option value="LOST">LOST</option>
                      </select>

                      {/* Convert to Quotation Button */}
                      <button
                        onClick={() => onNavigate?.('quotations')}
                        className="btn btn-sm"
                        style={{
                          background: '#2563eb',
                          color: '#fff',
                          padding: '5px 10px',
                          fontSize: '12px',
                          borderRadius: '4px',
                          border: 'none',
                          cursor: 'pointer',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px',
                        }}
                        title="Open Quotation Engine"
                      >
                        Quote <ArrowRight size={13} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* New Enquiry Modal */}
      {showModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(15, 23, 42, 0.6)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '20px',
          }}
        >
          <div
            style={{
              background: '#fff',
              borderRadius: '12px',
              maxWidth: '680px',
              width: '100%',
              maxHeight: '90vh',
              overflowY: 'auto',
              padding: '24px',
              boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.2)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
              <h2 style={{ margin: 0, fontSize: '18px', fontWeight: 700, color: '#0f172a' }}>
                New Customer Enquiry
              </h2>
              <button
                onClick={() => setShowModal(false)}
                style={{ background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer', color: '#64748b' }}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateEnquiry}>
              {/* Customer Selector */}
              <div style={{ marginBottom: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                  <label style={{ fontSize: '13px', fontWeight: 600, color: '#334155' }}>
                    Customer Details
                  </label>
                  <button
                    type="button"
                    onClick={() => setIsNewCustomer(!isNewCustomer)}
                    style={{ background: 'none', border: 'none', color: '#2563eb', fontSize: '12px', fontWeight: 600, cursor: 'pointer' }}
                  >
                    {isNewCustomer ? '← Choose Existing Customer' : '+ Add New Customer'}
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
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', background: '#f8fafc', padding: '12px', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
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
                      placeholder="Mobile (+91...) *"
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
                      style={{ gridColumn: 'span 2' }}
                      required
                    />
                  </div>
                )}
              </div>

              {/* Required Delivery Date & Notes */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px', color: '#334155' }}>
                    Required Delivery Date
                  </label>
                  <input
                    type="date"
                    value={requiredDate}
                    onChange={(e) => setRequiredDate(e.target.value)}
                    className="form-control"
                    required
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px', color: '#334155' }}>
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
              <div style={{ marginBottom: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <label style={{ fontSize: '13px', fontWeight: 600, color: '#334155' }}>
                    Products & Quantities
                  </label>
                  <button
                    type="button"
                    onClick={handleAddItem}
                    style={{
                      background: '#eff6ff',
                      border: '1px solid #bfdbfe',
                      color: '#1d4ed8',
                      fontSize: '12px',
                      padding: '4px 10px',
                      borderRadius: '4px',
                      fontWeight: 600,
                      cursor: 'pointer',
                    }}
                  >
                    + Add Another Product
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
                            background: '#fee2e2',
                            border: 'none',
                            color: '#b91c1c',
                            width: '32px',
                            height: '32px',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            display: 'inline-flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          ✕
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Submit Buttons */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
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
