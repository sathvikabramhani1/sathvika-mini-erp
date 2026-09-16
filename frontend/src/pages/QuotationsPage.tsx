import React, { useState, useEffect } from 'react';
import {
  FileText,
  Plus,
  Search,
  CheckCircle2,
  Clock,
  XCircle,
  Send,
  ArrowRight,
  Calculator,
  ChevronRight,
} from 'lucide-react';
import { api } from '../services/api';
import { Quotation, Enquiry, Product, QuotationStatus } from '../types';
import { useToast } from '../context/ToastContext';

interface QuotationsPageProps {
  onNavigate?: (tab: string) => void;
}

export const QuotationsPage: React.FC<QuotationsPageProps> = ({ onNavigate }) => {
  const { success, error } = useToast();

  const [quotations, setQuotations] = useState<Quotation[]>([]);
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [searchTerm, setSearchTerm] = useState('');

  // New Quotation Modal State
  const [showModal, setShowModal] = useState(false);
  const [selectedEnquiryId, setSelectedEnquiryId] = useState('');
  const [discountPercent, setDiscountPercent] = useState<number>(5);
  const [gstPercent, setGstPercent] = useState<number>(18);
  const [validUntil, setValidUntil] = useState(
    new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0]
  );
  const [quoteItems, setQuoteItems] = useState<
    { productId: string; quantity: number; unitPrice: number; discountPercent: number; gstPercent: number }[]
  >([]);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadData();
  }, [statusFilter]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [quotesList, enqList, prodList] = await Promise.all([
        api.getQuotations(statusFilter),
        api.getEnquiries(),
        api.getProducts(),
      ]);
      setQuotations(quotesList);
      setEnquiries(enqList);
      setProducts(prodList);

      if (!selectedEnquiryId && enqList.length > 0) {
        setSelectedEnquiryId(enqList[0].id);
        populateItemsFromEnquiry(enqList[0], prodList);
      }
    } catch (err: any) {
      error(err.message || 'Failed to load quotations data.');
    } finally {
      setLoading(false);
    }
  };

  const populateItemsFromEnquiry = (enquiry: Enquiry, prodList: Product[]) => {
    if (enquiry && enquiry.items && enquiry.items.length > 0) {
      const populated = enquiry.items.map((ei) => {
        const prod = prodList.find((p) => p.id === ei.productId);
        return {
          productId: ei.productId,
          quantity: ei.quantity,
          unitPrice: prod?.basePrice || 1000,
          discountPercent: 5,
          gstPercent: 18,
        };
      });
      setQuoteItems(populated);
    }
  };

  const handleEnquirySelect = (enqId: string) => {
    setSelectedEnquiryId(enqId);
    const enq = enquiries.find((e) => e.id === enqId);
    if (enq) {
      populateItemsFromEnquiry(enq, products);
    }
  };

  // Live calculation helpers
  const calculateTotals = () => {
    let subtotal = 0;
    for (const item of quoteItems) {
      subtotal += item.quantity * item.unitPrice;
    }
    const discountAmount = subtotal * (discountPercent / 100);
    const taxableAmount = subtotal - discountAmount;
    const gstAmount = taxableAmount * (gstPercent / 100);
    const grandTotal = Math.round((taxableAmount + gstAmount) * 100) / 100;
    return { subtotal, discountAmount, taxableAmount, gstAmount, grandTotal };
  };

  const totals = calculateTotals();

  const handleCreateQuotation = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const payload = {
        enquiryId: selectedEnquiryId,
        validUntil,
        discountPercent,
        gstPercent,
        items: quoteItems.map((qi) => ({
          productId: qi.productId,
          quantity: Number(qi.quantity),
          unitPrice: Number(qi.unitPrice),
          discountPercent,
          gstPercent,
        })),
      };

      const created = await api.createQuotation(payload);
      success(`Quotation ${created.quotationNumber} generated successfully!`);
      setShowModal(false);
      loadData();
    } catch (err: any) {
      error(err.message || 'Failed to create quotation.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleStatusUpdate = async (id: string, newStatus: QuotationStatus) => {
    try {
      await api.updateQuotationStatus(id, newStatus);
      success(`Quotation status updated to ${newStatus}`);
      loadData();
    } catch (err: any) {
      error(err.message || 'Failed to update quotation status.');
    }
  };

  const handleConvertToOrder = async (quote: Quotation) => {
    if (quote.status !== 'ACCEPTED') {
      error(`Cannot convert to Sales Order. Quotation must be in ACCEPTED status (currently '${quote.status}').`);
      return;
    }

    try {
      const result = await api.convertQuotationToOrder(quote.id);
      success(`Successfully converted to Sales Order ${result.orderNumber}! Status is PENDING.`);
      loadData();
      if (onNavigate) {
        onNavigate('sales-orders');
      }
    } catch (err: any) {
      error(err.message || 'Failed to convert quotation to Sales Order.');
    }
  };

  const filteredQuotes = quotations.filter((q) => {
    const search = searchTerm.toLowerCase();
    return (
      q.quotationNumber.toLowerCase().includes(search) ||
      q.customer.companyName.toLowerCase().includes(search) ||
      (q.enquiry?.enquiryNumber && q.enquiry.enquiryNumber.toLowerCase().includes(search))
    );
  });

  const getStatusBadge = (status: QuotationStatus) => {
    switch (status) {
      case 'DRAFT':
        return (
          <span className="badge badge-secondary" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
            <Clock size={13} /> DRAFT
          </span>
        );
      case 'SENT':
        return (
          <span className="badge badge-info" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
            <Send size={13} /> SENT
          </span>
        );
      case 'ACCEPTED':
        return (
          <span className="badge badge-success" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
            <CheckCircle2 size={13} /> ACCEPTED
          </span>
        );
      case 'REJECTED':
        return (
          <span className="badge badge-danger" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
            <XCircle size={13} /> REJECTED
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
            <div style={{ background: '#2563eb', padding: '8px', borderRadius: '8px', color: '#fff' }}>
              <Calculator size={24} />
            </div>
            <h1 style={{ margin: 0, fontSize: '24px', fontWeight: 800, color: '#0f172a' }}>
              Commercial Quotations
            </h1>
          </div>
          <p style={{ margin: 0, color: '#64748b', fontSize: '14px' }}>
            Step 2 of Workflow: Calculate unit prices, discount, GST, and convert ACCEPTED quotations into Sales Orders.
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="btn btn-primary"
          style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}
        >
          <Plus size={18} /> New Commercial Quotation
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
        <span style={{ color: '#10b981' }}>1. Customer Enquiry</span>
        <ChevronRight size={16} color="#94a3b8" />
        <span style={{ color: '#2563eb', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
          <span style={{ background: '#2563eb', color: '#fff', borderRadius: '50%', width: '20px', height: '20px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px' }}>2</span>
          Quotation Engine
        </span>
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
          {['ALL', 'DRAFT', 'SENT', 'ACCEPTED', 'REJECTED'].map((st) => (
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
            placeholder="Search Quotation #, Customer, Enquiry #..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="form-control"
            style={{ paddingLeft: '32px', fontSize: '13px' }}
          />
        </div>
      </div>

      {/* Quotations Table */}
      <div className="card" style={{ overflow: 'hidden', padding: 0 }}>
        {loading ? (
          <div style={{ padding: '40px', textAlign: 'center', color: '#64748b' }}>Loading quotations...</div>
        ) : filteredQuotes.length === 0 ? (
          <div style={{ padding: '48px', textAlign: 'center' }}>
            <FileText size={44} color="#cbd5e1" style={{ margin: '0 auto 12px' }} />
            <h3 style={{ margin: '0 0 6px 0', color: '#334155' }}>No Commercial Quotations Found</h3>
            <p style={{ margin: 0, color: '#94a3b8', fontSize: '14px' }}>
              Create a quotation against a customer enquiry to establish pricing and terms.
            </p>
          </div>
        ) : (
          <table className="table" style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0', textAlign: 'left', fontSize: '12px', color: '#475569', textTransform: 'uppercase' }}>
                <th style={{ padding: '12px 16px' }}>Quotation #</th>
                <th style={{ padding: '12px 16px' }}>Customer</th>
                <th style={{ padding: '12px 16px' }}>Enquiry Ref</th>
                <th style={{ padding: '12px 16px' }}>Valid Until</th>
                <th style={{ padding: '12px 16px' }}>Financial Breakdown</th>
                <th style={{ padding: '12px 16px' }}>Status</th>
                <th style={{ padding: '12px 16px', textAlign: 'right' }}>Convert & Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredQuotes.map((quote) => (
                <tr key={quote.id} style={{ borderBottom: '1px solid #f1f5f9', fontSize: '13px' }}>
                  <td style={{ padding: '14px 16px', fontWeight: 700, color: '#1e3a8a' }}>
                    {quote.quotationNumber}
                  </td>
                  <td style={{ padding: '14px 16px' }}>
                    <div style={{ fontWeight: 600, color: '#0f172a' }}>{quote.customer.companyName}</div>
                    <div style={{ fontSize: '12px', color: '#64748b' }}>
                      {quote.customer.contactPerson} • {quote.customer.city}
                    </div>
                  </td>
                  <td style={{ padding: '14px 16px', color: '#2563eb', fontWeight: 600 }}>
                    {quote.enquiry?.enquiryNumber || 'N/A'}
                  </td>
                  <td style={{ padding: '14px 16px', color: '#64748b' }}>
                    {new Date(quote.validUntil).toLocaleDateString()}
                  </td>
                  <td style={{ padding: '14px 16px' }}>
                    <div style={{ fontWeight: 700, fontSize: '14px', color: '#0f172a' }}>
                      ₹{quote.grandTotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </div>
                    <div style={{ fontSize: '11px', color: '#64748b' }}>
                      Base: ₹{quote.subtotal.toLocaleString()} | Disc: {quote.discountPercent}% | GST: {quote.gstPercent}%
                    </div>
                  </td>
                  <td style={{ padding: '14px 16px' }}>
                    {getStatusBadge(quote.status)}
                  </td>
                  <td style={{ padding: '14px 16px', textAlign: 'right' }}>
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                      {/* Status Action Buttons */}
                      {quote.status === 'DRAFT' && (
                        <button
                          onClick={() => handleStatusUpdate(quote.id, 'SENT')}
                          className="btn btn-sm"
                          style={{ background: '#0284c7', color: '#fff', fontSize: '11px', padding: '4px 8px', borderRadius: '4px', border: 'none', cursor: 'pointer' }}
                        >
                          Mark Sent
                        </button>
                      )}

                      {quote.status === 'SENT' && (
                        <>
                          <button
                            onClick={() => handleStatusUpdate(quote.id, 'ACCEPTED')}
                            className="btn btn-sm"
                            style={{ background: '#10b981', color: '#fff', fontSize: '11px', padding: '4px 8px', borderRadius: '4px', border: 'none', cursor: 'pointer' }}
                          >
                            Accept
                          </button>
                          <button
                            onClick={() => handleStatusUpdate(quote.id, 'REJECTED')}
                            className="btn btn-sm"
                            style={{ background: '#ef4444', color: '#fff', fontSize: '11px', padding: '4px 8px', borderRadius: '4px', border: 'none', cursor: 'pointer' }}
                          >
                            Reject
                          </button>
                        </>
                      )}

                      {/* Convert to Sales Order Button */}
                      {quote.salesOrder ? (
                        <span style={{ fontSize: '11px', fontWeight: 600, color: '#16a34a', background: '#dcfce7', padding: '4px 8px', borderRadius: '4px' }}>
                          ✓ Order: {quote.salesOrder.orderNumber}
                        </span>
                      ) : (
                        <button
                          onClick={() => handleConvertToOrder(quote)}
                          disabled={quote.status !== 'ACCEPTED'}
                          className="btn btn-sm"
                          style={{
                            background: quote.status === 'ACCEPTED' ? '#16a34a' : '#e2e8f0',
                            color: quote.status === 'ACCEPTED' ? '#fff' : '#94a3b8',
                            fontSize: '12px',
                            fontWeight: 600,
                            padding: '6px 12px',
                            borderRadius: '4px',
                            border: 'none',
                            cursor: quote.status === 'ACCEPTED' ? 'pointer' : 'not-allowed',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px',
                          }}
                          title={
                            quote.status === 'ACCEPTED'
                              ? 'Convert this accepted quotation to a Sales Order'
                              : `Cannot convert: quotation must be ACCEPTED (currently ${quote.status})`
                          }
                        >
                          Create Order <ArrowRight size={13} />
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

      {/* New Quotation Modal */}
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
              maxWidth: '750px',
              width: '100%',
              maxHeight: '92vh',
              overflowY: 'auto',
              padding: '24px',
              boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.2)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
              <div>
                <h2 style={{ margin: 0, fontSize: '18px', fontWeight: 700, color: '#0f172a' }}>
                  Generate Commercial Quotation
                </h2>
                <p style={{ margin: '4px 0 0', fontSize: '13px', color: '#64748b' }}>
                  Pricing and tax calculation are authoritatively computed and enforced by the backend engine.
                </p>
              </div>
              <button
                onClick={() => setShowModal(false)}
                style={{ background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer', color: '#64748b' }}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateQuotation}>
              {/* Select Source Enquiry */}
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px', color: '#334155' }}>
                  Source Customer Enquiry Reference *
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
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px', marginBottom: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px', color: '#334155' }}>
                    Valid Until Date
                  </label>
                  <input
                    type="date"
                    value={validUntil}
                    onChange={(e) => setValidUntil(e.target.value)}
                    className="form-control"
                    required
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px', color: '#334155' }}>
                    Discount %
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    step="0.5"
                    value={discountPercent}
                    onChange={(e) => setDiscountPercent(parseFloat(e.target.value) || 0)}
                    className="form-control"
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px', color: '#334155' }}>
                    GST %
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="28"
                    step="1"
                    value={gstPercent}
                    onChange={(e) => setGstPercent(parseFloat(e.target.value) || 0)}
                    className="form-control"
                  />
                </div>
              </div>

              {/* Line Items Pricing */}
              <div style={{ marginBottom: '18px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '8px', color: '#334155' }}>
                  Quotation Line Items & Unit Prices
                </label>
                <div style={{ border: '1px solid #e2e8f0', borderRadius: '6px', overflow: 'hidden' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px' }}>
                    <thead style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0', textAlign: 'left' }}>
                      <tr>
                        <th style={{ padding: '8px 12px' }}>Product</th>
                        <th style={{ padding: '8px 12px', width: '90px' }}>Quantity</th>
                        <th style={{ padding: '8px 12px', width: '120px' }}>Unit Price (₹)</th>
                        <th style={{ padding: '8px 12px', width: '120px', textAlign: 'right' }}>Base Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      {quoteItems.map((item, idx) => {
                        const prod = products.find((p) => p.id === item.productId);
                        const baseAmt = item.quantity * item.unitPrice;
                        return (
                          <tr key={idx} style={{ borderBottom: '1px solid #f1f5f9' }}>
                            <td style={{ padding: '8px 12px' }}>
                              <div style={{ fontWeight: 600 }}>{prod?.productName || 'Industrial Product'}</div>
                              <div style={{ fontSize: '11px', color: '#64748b' }}>{prod?.productCode} • {prod?.unit}</div>
                            </td>
                            <td style={{ padding: '8px 12px' }}>
                              <input
                                type="number"
                                min="1"
                                value={item.quantity}
                                onChange={(e) => {
                                  const updated = [...quoteItems];
                                  updated[idx].quantity = Math.max(1, parseInt(e.target.value) || 1);
                                  setQuoteItems(updated);
                                }}
                                className="form-control"
                                style={{ padding: '4px 8px', fontSize: '12px' }}
                              />
                            </td>
                            <td style={{ padding: '8px 12px' }}>
                              <input
                                type="number"
                                min="0"
                                step="10"
                                value={item.unitPrice}
                                onChange={(e) => {
                                  const updated = [...quoteItems];
                                  updated[idx].unitPrice = parseFloat(e.target.value) || 0;
                                  setQuoteItems(updated);
                                }}
                                className="form-control"
                                style={{ padding: '4px 8px', fontSize: '12px' }}
                              />
                            </td>
                            <td style={{ padding: '8px 12px', textAlign: 'right', fontWeight: 600 }}>
                              ₹{baseAmt.toLocaleString()}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Financial Calculation Summary Card */}
              <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '8px', border: '1px solid #e2e8f0', marginBottom: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '6px', color: '#475569' }}>
                  <span>Gross Subtotal:</span>
                  <span>₹{totals.subtotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '6px', color: '#475569' }}>
                  <span>Discount ({discountPercent}%):</span>
                  <span style={{ color: '#16a34a' }}>-₹{totals.discountAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '6px', color: '#475569' }}>
                  <span>Taxable Base:</span>
                  <span>₹{totals.taxableAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '8px', color: '#475569' }}>
                  <span>GST ({gstPercent}%):</span>
                  <span>+₹{totals.gstAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '16px', fontWeight: 800, color: '#1e3a8a', borderTop: '1px solid #cbd5e1', paddingTop: '8px' }}>
                  <span>Grand Total (Net Amount):</span>
                  <span>₹{totals.grandTotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
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
