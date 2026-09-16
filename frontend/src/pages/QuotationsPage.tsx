import React, { useState, useEffect } from 'react';
import {
  Calculator,
  Plus,
  Search,
  CheckCircle2,
  Clock,
  Send,
  XCircle,
  ArrowRight,
  FileText,
  ChevronRight,
  AlertCircle,
  Percent,
} from 'lucide-react';
import { api } from '../services/api';
import { Quotation, Enquiry, QuotationStatus } from '../types';
import { useToast } from '../context/ToastContext';

interface QuotationsPageProps {
  onNavigate?: (tab: string) => void;
}

export const QuotationsPage: React.FC<QuotationsPageProps> = ({ onNavigate }) => {
  const { success, error, warning } = useToast();

  const [quotations, setQuotations] = useState<Quotation[]>([]);
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [searchTerm, setSearchTerm] = useState('');

  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [selectedEnquiryId, setSelectedEnquiryId] = useState('');
  const [validUntil, setValidUntil] = useState(
    new Date(Date.now() + 15 * 86400000).toISOString().split('T')[0]
  );
  const [discountPercent, setDiscountPercent] = useState<number>(5);
  const [gstPercent, setGstPercent] = useState<number>(18);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadData();
  }, [statusFilter]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [quoteData, enqData] = await Promise.all([
        api.getQuotations(statusFilter),
        api.getEnquiries(),
      ]);
      setQuotations(quoteData);
      setEnquiries(enqData);
      if (enqData.length > 0 && !selectedEnquiryId) {
        setSelectedEnquiryId(enqData[0].id);
      }
    } catch (err: any) {
      error(err.message || 'Failed to load quotations data.');
    } finally {
      setLoading(false);
    }
  };

  const handleEnquirySelect = (enquiryId: string) => {
    setSelectedEnquiryId(enquiryId);
  };

  const handleCreateQuotation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEnquiryId) {
      warning('Please select an enquiry reference to generate a quotation.');
      return;
    }

    setSubmitting(true);
    try {
      const itemsPayload = (selectedEnquiry?.items || []).map((it) => ({
        productId: it.productId,
        quantity: it.quantity,
        unitPrice: it.product?.basePrice || 0,
        discountPercent: Number(discountPercent) || 0,
        gstPercent: Number(gstPercent) || 0,
      }));

      const created = await api.createQuotation({
        enquiryId: selectedEnquiryId,
        validUntil,
        discountPercent: Number(discountPercent) || 0,
        gstPercent: Number(gstPercent) || 0,
        items: itemsPayload,
      });

      success(`Quotation ${created.quotationNumber} generated successfully!`);
      setShowModal(false);
      loadData();
    } catch (err: any) {
      error(err.message || 'Failed to generate quotation.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleStatusUpdate = async (id: string, status: QuotationStatus) => {
    try {
      await api.updateQuotationStatus(id, status);
      success(`Quotation status marked as ${status}`);
      loadData();
    } catch (err: any) {
      error(err.message || 'Failed to update status.');
    }
  };

  const handleConvertToOrder = async (quote: Quotation) => {
    if (quote.status !== 'ACCEPTED') {
      warning('Only ACCEPTED quotations can be converted to an active Sales Order.');
      return;
    }

    try {
      const so = await api.convertQuotationToOrder(quote.id);
      success(`Sales Order ${so.orderNumber} successfully generated from Quotation ${quote.quotationNumber}!`);
      loadData();
      if (onNavigate) {
        onNavigate('sales-orders');
      }
    } catch (err: any) {
      error(err.message || 'Failed to convert quotation to order.');
    }
  };

  const filteredQuotes = quotations.filter((q) => {
    const search = searchTerm.toLowerCase();
    return (
      q.quotationNumber.toLowerCase().includes(search) ||
      q.customer.companyName.toLowerCase().includes(search) ||
      (q.enquiry && q.enquiry.enquiryNumber.toLowerCase().includes(search))
    );
  });

  const getStatusBadge = (status: QuotationStatus) => {
    switch (status) {
      case 'DRAFT':
        return (
          <span className="badge badge-secondary">
            <Clock size={12} /> DRAFT
          </span>
        );
      case 'SENT':
        return (
          <span className="badge badge-primary">
            <Send size={12} /> SENT
          </span>
        );
      case 'ACCEPTED':
        return (
          <span className="badge badge-success">
            <CheckCircle2 size={12} /> ACCEPTED
          </span>
        );
      case 'REJECTED':
        return (
          <span className="badge badge-danger">
            <XCircle size={12} /> REJECTED
          </span>
        );
      default:
        return <span className="badge badge-secondary">{status}</span>;
    }
  };

  const selectedEnquiry = enquiries.find((e) => e.id === selectedEnquiryId);

  const calculatePreview = () => {
    if (!selectedEnquiry) return { subtotal: 0, discountAmount: 0, taxableAmount: 0, gstAmount: 0, grandTotal: 0 };
    const subtotal = selectedEnquiry.items.reduce((acc, item) => {
      const price = item.product?.basePrice || 0;
      return acc + price * item.quantity;
    }, 0);
    const discountAmount = (subtotal * (Number(discountPercent) || 0)) / 100;
    const taxableAmount = subtotal - discountAmount;
    const gstAmount = (taxableAmount * (Number(gstPercent) || 0)) / 100;
    const grandTotal = taxableAmount + gstAmount;

    return { subtotal, discountAmount, taxableAmount, gstAmount, grandTotal };
  };

  const totals = calculatePreview();

  return (
    <div className="page-container">
      {/* Page Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
            <div style={{ background: '#eff6ff', padding: '8px', borderRadius: '8px', color: '#2563eb', border: '1px solid #bfdbfe' }}>
              <Calculator size={22} />
            </div>
            <h1 style={{ margin: 0, fontSize: '24px', fontWeight: 800, color: '#0f172a' }}>
              Commercial Quotations
            </h1>
          </div>
          <p style={{ margin: 0, color: '#64748b', fontSize: '13.5px' }}>
            Step 2 of 5: Authoritative calculation of unit prices, volume discounts, GST rates, and client terms.
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="btn btn-primary"
        >
          <Plus size={16} /> New Commercial Quotation
        </button>
      </div>

      {/* Modern Workflow Stepper */}
      <div className="workflow-stepper">
        <span className="stepper-item completed">
          <span className="stepper-number">✓</span>
          <span>Enquiry</span>
        </span>
        <ChevronRight size={14} color="#cbd5e1" />
        <span className="stepper-item active">
          <span className="stepper-number">2</span>
          <span>Quotation Engine</span>
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
          {['ALL', 'DRAFT', 'SENT', 'ACCEPTED', 'REJECTED'].map((st) => (
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
            placeholder="Search Quotation #, Customer, Ref..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="form-control"
          />
        </div>
      </div>

      {/* Quotations Table */}
      <div className="table-responsive">
        {loading ? (
          <div style={{ padding: '48px', textAlign: 'center', color: '#64748b' }}>Loading commercial quotations...</div>
        ) : filteredQuotes.length === 0 ? (
          <div style={{ padding: '48px', textAlign: 'center' }}>
            <FileText size={44} color="#cbd5e1" style={{ margin: '0 auto 12px' }} />
            <h3 style={{ margin: '0 0 6px 0', color: '#334155', fontSize: '16px' }}>No Commercial Quotations Found</h3>
            <p style={{ margin: 0, color: '#94a3b8', fontSize: '13.5px' }}>
              Create a quotation against a customer enquiry to establish pricing and terms.
            </p>
          </div>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>Quotation #</th>
                <th>Customer Account</th>
                <th>Enquiry Ref</th>
                <th>Valid Until</th>
                <th>Financial Breakdown</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Convert & Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredQuotes.map((quote) => (
                <tr key={quote.id}>
                  <td style={{ fontWeight: 700, color: '#1e3a8a' }}>
                    <code>{quote.quotationNumber}</code>
                  </td>
                  <td>
                    <div style={{ fontWeight: 600, color: '#0f172a' }}>{quote.customer.companyName}</div>
                    <div style={{ fontSize: '12px', color: '#64748b' }}>
                      {quote.customer.contactPerson} • {quote.customer.city}
                    </div>
                  </td>
                  <td style={{ color: '#2563eb', fontWeight: 600 }}>
                    <code>{quote.enquiry?.enquiryNumber || 'N/A'}</code>
                  </td>
                  <td style={{ color: '#475569' }}>
                    {new Date(quote.validUntil).toLocaleDateString()}
                  </td>
                  <td>
                    <div style={{ fontWeight: 800, fontSize: '14px', color: '#0f172a' }}>
                      ₹{quote.grandTotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </div>
                    <div style={{ fontSize: '11px', color: '#64748b', marginTop: '2px' }}>
                      Base: ₹{quote.subtotal.toLocaleString()} | Disc: {quote.discountPercent}% | GST: {quote.gstPercent}%
                    </div>
                  </td>
                  <td>
                    {getStatusBadge(quote.status)}
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                      {/* Status Action Buttons */}
                      {quote.status === 'DRAFT' && (
                        <button
                          onClick={() => handleStatusUpdate(quote.id, 'SENT')}
                          className="btn btn-secondary btn-sm"
                          style={{ color: '#2563eb' }}
                        >
                          Mark Sent
                        </button>
                      )}

                      {quote.status === 'SENT' && (
                        <>
                          <button
                            onClick={() => handleStatusUpdate(quote.id, 'ACCEPTED')}
                            className="btn btn-success btn-sm"
                          >
                            Accept
                          </button>
                          <button
                            onClick={() => handleStatusUpdate(quote.id, 'REJECTED')}
                            className="btn btn-danger btn-sm"
                          >
                            Reject
                          </button>
                        </>
                      )}

                      {/* Convert to Sales Order Button */}
                      {quote.salesOrder ? (
                        <span className="badge badge-success">
                          ✓ Order: {quote.salesOrder.orderNumber}
                        </span>
                      ) : (
                        <button
                          onClick={() => handleConvertToOrder(quote)}
                          disabled={quote.status !== 'ACCEPTED'}
                          className="btn btn-primary btn-sm"
                          title={
                            quote.status === 'ACCEPTED'
                              ? 'Convert this accepted quotation to a Sales Order'
                              : `Cannot convert: quotation must be ACCEPTED (currently ${quote.status})`
                          }
                        >
                          <span>Create Order</span>
                          <ArrowRight size={13} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Standardized Enterprise New Quotation Modal */}
      {showModal && (
        <div className="modal-backdrop">
          <div className="modal-content" style={{ maxWidth: '750px' }}>
            <div className="modal-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#2563eb', border: '1px solid #bfdbfe' }}>
                  <Calculator size={18} />
                </div>
                <div>
                  <h2 className="modal-title">Generate Commercial Quotation</h2>
                  <p className="modal-subtitle">
                    Authoritative pricing, volume discount matrix, and statutory GST calculation engine
                  </p>
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

            <form onSubmit={handleCreateQuotation}>
              <div className="modal-body">
                {/* Select Source Enquiry */}
                <div className="form-group">
                  <label className="form-label">
                    Source Customer Enquiry Reference <span className="required">*</span>
                  </label>
                  <select
                    value={selectedEnquiryId}
                    onChange={(e) => handleEnquirySelect(e.target.value)}
                    className="form-control"
                    required
                  >
                    {enquiries.map((enq) => (
                      <option key={enq.id} value={enq.id}>
                        [{enq.enquiryNumber}] {enq.customer.companyName} ({enq.items.length} products requested) - Status: {enq.status}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Quotation Validity & Discounts */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
                  <div className="form-group">
                    <label className="form-label">
                      Valid Until Date <span className="required">*</span>
                    </label>
                    <input
                      type="date"
                      value={validUntil}
                      onChange={(e) => setValidUntil(e.target.value)}
                      className="form-control"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">
                      Commercial Discount % <span className="required">*</span>
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      step="0.5"
                      value={discountPercent}
                      onChange={(e) => setDiscountPercent(parseFloat(e.target.value) || 0)}
                      className="form-control"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">
                      GST Rate % <span className="required">*</span>
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="28"
                      step="1"
                      value={gstPercent}
                      onChange={(e) => setGstPercent(parseFloat(e.target.value) || 0)}
                      className="form-control"
                      required
                    />
                  </div>
                </div>

                {/* Enquiry Items Verification Box */}
                {selectedEnquiry && (
                  <div style={{ background: '#f8fafc', padding: '14px', borderRadius: '8px', border: '1px solid #e2e8f0', marginBottom: '18px' }}>
                    <div style={{ fontSize: '12px', fontWeight: 700, color: '#334155', marginBottom: '8px' }}>
                      Enquiry Items Line Breakdown:
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      {selectedEnquiry.items.map((it, idx) => (
                        <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12.5px', color: '#475569' }}>
                          <span>
                            • <strong>{it.quantity} {it.product?.unit}</strong> of {it.product?.productName}
                          </span>
                          <span style={{ fontWeight: 600, color: '#0f172a' }}>
                            ₹{((it.product?.basePrice || 0) * it.quantity).toLocaleString()}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Financial Calculation Summary Card */}
                <div style={{ background: '#f8fafc', padding: '16px 18px', borderRadius: '8px', border: '1px solid #cbd5e1' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '6px', color: '#475569' }}>
                    <span>Gross Catalog Subtotal:</span>
                    <span>₹{totals.subtotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '6px', color: '#475569' }}>
                    <span>Commercial Discount ({discountPercent}%):</span>
                    <span style={{ color: '#059669', fontWeight: 600 }}>-₹{totals.discountAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '6px', color: '#475569' }}>
                    <span>Net Taxable Base:</span>
                    <span>₹{totals.taxableAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '10px', color: '#475569' }}>
                    <span>Statutory GST ({gstPercent}%):</span>
                    <span>+₹{totals.gstAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '16px', fontWeight: 800, color: '#1e3a8a', borderTop: '1px solid #cbd5e1', paddingTop: '10px' }}>
                    <span>Total Quoted Amount:</span>
                    <span>₹{totals.grandTotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
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
                  {submitting ? 'Generating...' : 'Save & Generate Quotation (DRAFT)'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
