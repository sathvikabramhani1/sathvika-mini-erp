import React, { useState, useEffect } from 'react';
import {
  ShoppingCart,
  Search,
  CheckCircle2,
  Clock,
  Truck,
  XCircle,
  AlertTriangle,
  Package,
  Layers,
  ChevronRight,
  ShieldCheck,
  Building,
  RefreshCw,
} from 'lucide-react';
import { api } from '../services/api';
import { SalesOrder, InventoryItem, SalesOrderStatus } from '../types';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export const SalesOrdersPage: React.FC = () => {
  const { user } = useAuth();
  const { success, error, warning } = useToast();

  const [orders, setOrders] = useState<SalesOrder[]>([]);
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [searchTerm, setSearchTerm] = useState('');

  // Dispatch Modal State
  const [showDispatchModal, setShowDispatchModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<SalesOrder | null>(null);
  const [vehicleNumber, setVehicleNumber] = useState('');
  const [driverName, setDriverName] = useState('');
  const [dispatching, setDispatching] = useState(false);

  // Detail Modal
  const [detailOrder, setDetailOrder] = useState<SalesOrder | null>(null);

  useEffect(() => {
    loadData();
  }, [statusFilter]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [orderList, invList] = await Promise.all([
        api.getSalesOrders(statusFilter),
        api.getInventory(),
      ]);
      setOrders(orderList);
      setInventory(invList);
    } catch (err: any) {
      error(err.message || 'Failed to load sales orders.');
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmOrder = async (order: SalesOrder) => {
    if (user?.role !== 'ADMIN') {
      warning('Only ADMIN users have authority to confirm orders and reserve inventory.');
      return;
    }

    try {
      const result = await api.confirmSalesOrder(order.id);
      success(`Order ${result.orderNumber} confirmed! Inventory reserved successfully.`);
      loadData();
    } catch (err: any) {
      error(err.message || 'Failed to confirm order.');
    }
  };

  const openDispatchModal = (order: SalesOrder) => {
    if (user?.role !== 'ADMIN') {
      warning('Only ADMIN users have authority to process dispatches.');
      return;
    }
    setSelectedOrder(order);
    setVehicleNumber('MH-12-PQ-9080');
    setDriverName('Ramesh Patil');
    setShowDispatchModal(true);
  };

  const handleProcessDispatch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOrder) return;
    setDispatching(true);

    try {
      const res = await api.dispatchSalesOrder(selectedOrder.id, {
        vehicleNumber,
        driverName,
      });
      success(`Order ${selectedOrder.orderNumber} dispatched! Physical and reserved inventory decremented.`);
      setShowDispatchModal(false);
      setSelectedOrder(null);
      loadData();
    } catch (err: any) {
      error(err.message || 'Dispatch failed.');
    } finally {
      setDispatching(false);
    }
  };

  const handleCancelOrder = async (order: SalesOrder) => {
    if (!window.confirm(`Are you sure you want to cancel order ${order.orderNumber}? Any reserved stock will be released.`)) {
      return;
    }

    try {
      await api.cancelSalesOrder(order.id);
      success(`Order ${order.orderNumber} cancelled. Reserved stock released back to available inventory.`);
      loadData();
    } catch (err: any) {
      error(err.message || 'Cancellation failed.');
    }
  };

  const filteredOrders = orders.filter((o) => {
    const search = searchTerm.toLowerCase();
    return (
      o.orderNumber.toLowerCase().includes(search) ||
      o.customer.companyName.toLowerCase().includes(search) ||
      (o.quotation?.quotationNumber && o.quotation.quotationNumber.toLowerCase().includes(search))
    );
  });

  const getStatusBadge = (status: SalesOrderStatus) => {
    switch (status) {
      case 'PENDING':
        return (
          <span className="badge badge-warning" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
            <Clock size={13} /> PENDING CONFIRMATION
          </span>
        );
      case 'CONFIRMED':
        return (
          <span className="badge badge-info" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
            <ShieldCheck size={13} /> STOCK RESERVED
          </span>
        );
      case 'DISPATCHED':
        return (
          <span className="badge badge-success" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
            <Truck size={13} /> DISPATCHED
          </span>
        );
      case 'CANCELLED':
        return (
          <span className="badge badge-danger" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
            <XCircle size={13} /> CANCELLED
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
            <div style={{ background: '#059669', padding: '8px', borderRadius: '8px', color: '#fff' }}>
              <ShoppingCart size={24} />
            </div>
            <h1 style={{ margin: 0, fontSize: '24px', fontWeight: 800, color: '#0f172a' }}>
              Sales Orders & Stock Management
            </h1>
          </div>
          <p style={{ margin: 0, color: '#64748b', fontSize: '14px' }}>
            Steps 3, 4 & 5: Trace orders from accepted quotations, verify stock availability, atomically reserve inventory, and process dispatches.
          </p>
        </div>

        <button
          onClick={loadData}
          className="btn btn-secondary"
          style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '13px' }}
        >
          <RefreshCw size={15} /> Refresh Stock & Orders
        </button>
      </div>

      {/* Workflow Breadcrumb */}
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
        <span style={{ color: '#10b981' }}>2. Quotation</span>
        <ChevronRight size={16} color="#94a3b8" />
        <span style={{ color: '#059669', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
          <span style={{ background: '#059669', color: '#fff', borderRadius: '50%', width: '20px', height: '20px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px' }}>3</span>
          Sales Order
        </span>
        <ChevronRight size={16} color="#94a3b8" />
        <span style={{ color: '#059669', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
          <span style={{ background: '#059669', color: '#fff', borderRadius: '50%', width: '20px', height: '20px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px' }}>4</span>
          Stock Reservation
        </span>
        <ChevronRight size={16} color="#94a3b8" />
        <span style={{ color: '#059669', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
          <span style={{ background: '#059669', color: '#fff', borderRadius: '50%', width: '20px', height: '20px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px' }}>5</span>
          Dispatch
        </span>
      </div>

      {/* ========================================================================= */}
      {/* SECTION 1: LIVE INVENTORY STOCK AVAILABILITY TABLE                        */}
      {/* ========================================================================= */}
      <div className="card" style={{ marginBottom: '24px', padding: '18px 20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Package size={18} color="#059669" />
            <h3 style={{ margin: 0, fontSize: '15px', fontWeight: 700, color: '#0f172a' }}>
              Live Warehouse Stock Availability (Available = Physical − Reserved)
            </h3>
          </div>
          <span style={{ fontSize: '12px', color: '#64748b' }}>
            Authoritative Product Master • Realistic Industrial Seed Data
          </span>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px' }}>
            <thead>
              <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0', textAlign: 'left', color: '#475569', textTransform: 'uppercase' }}>
                <th style={{ padding: '8px 12px' }}>Product Code</th>
                <th style={{ padding: '8px 12px' }}>Product Name</th>
                <th style={{ padding: '8px 12px' }}>Category</th>
                <th style={{ padding: '8px 12px', textAlign: 'center' }}>Physical Stock</th>
                <th style={{ padding: '8px 12px', textAlign: 'center' }}>Reserved Stock</th>
                <th style={{ padding: '8px 12px', textAlign: 'center' }}>Available Stock</th>
                <th style={{ padding: '8px 12px', textAlign: 'center' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {inventory.map((inv) => (
                <tr key={inv.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '8px 12px', fontWeight: 700, color: '#1e3a8a' }}>
                    {inv.productCode}
                  </td>
                  <td style={{ padding: '8px 12px', fontWeight: 600, color: '#1e293b' }}>
                    {inv.productName}
                  </td>
                  <td style={{ padding: '8px 12px', color: '#64748b' }}>
                    {inv.category}
                  </td>
                  <td style={{ padding: '8px 12px', textAlign: 'center', fontWeight: 600 }}>
                    {inv.physicalQuantity} {inv.unit}
                  </td>
                  <td style={{ padding: '8px 12px', textAlign: 'center', color: '#f59e0b', fontWeight: 700 }}>
                    {inv.reservedQuantity} {inv.unit}
                  </td>
                  <td style={{ padding: '8px 12px', textAlign: 'center', fontWeight: 800, color: inv.availableQuantity > 0 ? '#10b981' : '#ef4444', fontSize: '13px' }}>
                    {inv.availableQuantity} {inv.unit}
                  </td>
                  <td style={{ padding: '8px 12px', textAlign: 'center' }}>
                    {inv.availableQuantity > 20 ? (
                      <span className="badge badge-success" style={{ fontSize: '11px', padding: '2px 6px' }}>In Stock</span>
                    ) : inv.availableQuantity > 0 ? (
                      <span className="badge badge-warning" style={{ fontSize: '11px', padding: '2px 6px' }}>Low Stock</span>
                    ) : (
                      <span className="badge badge-danger" style={{ fontSize: '11px', padding: '2px 6px' }}>Exhausted</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* SECTION 2: SALES ORDERS LIST & WORKFLOW ACTIONS                           */}
      {/* ========================================================================= */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '16px', marginBottom: '18px', flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', gap: '8px' }}>
          {['ALL', 'PENDING', 'CONFIRMED', 'DISPATCHED', 'CANCELLED'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`filter-tab ${statusFilter === st ? 'active' : ''}`}
              style={{
                padding: '7px 16px',
                borderRadius: '6px',
                border: statusFilter === st ? '1px solid #059669' : '1px solid #e2e8f0',
                background: statusFilter === st ? '#ecfdf5' : '#ffffff',
                color: statusFilter === st ? '#065f46' : '#64748b',
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
            placeholder="Search Order #, Customer, Quotation..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="form-control"
            style={{ paddingLeft: '32px', fontSize: '13px' }}
          />
        </div>
      </div>

      {/* Orders Table */}
      <div className="card" style={{ overflow: 'hidden', padding: 0 }}>
        {loading ? (
          <div style={{ padding: '40px', textAlign: 'center', color: '#64748b' }}>Loading orders...</div>
        ) : filteredOrders.length === 0 ? (
          <div style={{ padding: '48px', textAlign: 'center' }}>
            <ShoppingCart size={44} color="#cbd5e1" style={{ margin: '0 auto 12px' }} />
            <h3 style={{ margin: '0 0 6px 0', color: '#334155' }}>No Sales Orders Found</h3>
            <p style={{ margin: 0, color: '#94a3b8', fontSize: '14px' }}>
              Convert an ACCEPTED quotation from the Quotations page to create an order here.
            </p>
          </div>
        ) : (
          <table className="table" style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0', textAlign: 'left', fontSize: '12px', color: '#475569', textTransform: 'uppercase' }}>
                <th style={{ padding: '12px 16px' }}>Order #</th>
                <th style={{ padding: '12px 16px' }}>Customer</th>
                <th style={{ padding: '12px 16px' }}>Quotation Ref</th>
                <th style={{ padding: '12px 16px' }}>Items & Stock Feasibility</th>
                <th style={{ padding: '12px 16px' }}>Net Total</th>
                <th style={{ padding: '12px 16px' }}>Status</th>
                <th style={{ padding: '12px 16px', textAlign: 'right' }}>Workflow Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((order) => (
                <tr key={order.id} style={{ borderBottom: '1px solid #f1f5f9', fontSize: '13px' }}>
                  <td style={{ padding: '14px 16px', fontWeight: 700, color: '#047857' }}>
                    {order.orderNumber}
                  </td>
                  <td style={{ padding: '14px 16px' }}>
                    <div style={{ fontWeight: 600, color: '#0f172a' }}>{order.customer.companyName}</div>
                    <div style={{ fontSize: '12px', color: '#64748b' }}>
                      {order.customer.contactPerson} • {order.customer.city}
                    </div>
                  </td>
                  <td style={{ padding: '14px 16px', color: '#2563eb', fontWeight: 600 }}>
                    {order.quotation?.quotationNumber || 'Direct'}
                  </td>
                  <td style={{ padding: '14px 16px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      {order.items.map((item, idx) => {
                        const isSufficient = item.stockStatus?.sufficient ?? true;
                        return (
                          <div key={idx} style={{ fontSize: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <span style={{ color: '#334155' }}>
                              • <strong>{item.quantity} {item.product?.unit}</strong> of {item.product?.productName}
                            </span>
                            {order.status === 'PENDING' && (
                              isSufficient ? (
                                <span style={{ color: '#16a34a', fontSize: '11px', background: '#dcfce7', padding: '1px 5px', borderRadius: '3px' }}>
                                  ✓ Available ({item.stockStatus?.availableQuantity})
                                </span>
                              ) : (
                                <span style={{ color: '#dc2626', fontSize: '11px', background: '#fee2e2', padding: '1px 5px', borderRadius: '3px' }}>
                                  ⚠ Short ({item.stockStatus?.availableQuantity} avail)
                                </span>
                              )
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </td>
                  <td style={{ padding: '14px 16px', fontWeight: 700, color: '#0f172a' }}>
                    ₹{order.totalAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                  </td>
                  <td style={{ padding: '14px 16px' }}>
                    {getStatusBadge(order.status)}
                  </td>
                  <td style={{ padding: '14px 16px', textAlign: 'right' }}>
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                      {/* Step 4 Action: Confirm & Reserve Inventory */}
                      {order.status === 'PENDING' && (
                        <button
                          onClick={() => handleConfirmOrder(order)}
                          disabled={!order.canFulfill}
                          className="btn btn-sm"
                          style={{
                            background: order.canFulfill ? '#2563eb' : '#94a3b8',
                            color: '#fff',
                            fontSize: '12px',
                            padding: '6px 12px',
                            borderRadius: '4px',
                            border: 'none',
                            cursor: order.canFulfill ? 'pointer' : 'not-allowed',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px',
                          }}
                          title={order.canFulfill ? 'Admin confirmation reserves stock' : 'Insufficient stock available to confirm order'}
                        >
                          <ShieldCheck size={14} /> Confirm & Reserve
                        </button>
                      )}

                      {/* Step 5 Action: Process Dispatch */}
                      {order.status === 'CONFIRMED' && (
                        <button
                          onClick={() => openDispatchModal(order)}
                          className="btn btn-sm"
                          style={{
                            background: '#059669',
                            color: '#fff',
                            fontSize: '12px',
                            padding: '6px 12px',
                            borderRadius: '4px',
                            border: 'none',
                            cursor: 'pointer',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px',
                          }}
                        >
                          <Truck size={14} /> Process Dispatch
                        </button>
                      )}

                      {/* Dispatched Info */}
                      {order.status === 'DISPATCHED' && order.dispatches && order.dispatches.length > 0 && (
                        <span style={{ fontSize: '11px', color: '#047857', background: '#d1fae5', padding: '4px 8px', borderRadius: '4px' }}>
                          🚚 {order.dispatches[0].vehicleNumber} ({order.dispatches[0].driverName})
                        </span>
                      )}

                      {/* Cancel Order Action */}
                      {(order.status === 'PENDING' || order.status === 'CONFIRMED') && (
                        <button
                          onClick={() => handleCancelOrder(order)}
                          className="btn btn-sm"
                          style={{
                            background: 'transparent',
                            color: '#94a3b8',
                            border: '1px solid #e2e8f0',
                            padding: '5px 8px',
                            fontSize: '11px',
                            borderRadius: '4px',
                            cursor: 'pointer',
                          }}
                          title="Cancel order and release reserved stock"
                        >
                          Cancel
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

      {/* ========================================================================= */}
      {/* PROCESS DISPATCH MODAL                                                    */}
      {/* ========================================================================= */}
      {showDispatchModal && selectedOrder && (
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
              maxWidth: '520px',
              width: '100%',
              padding: '24px',
              boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.2)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Truck size={20} color="#059669" />
                <h2 style={{ margin: 0, fontSize: '18px', fontWeight: 700, color: '#0f172a' }}>
                  Dispatch Order {selectedOrder.orderNumber}
                </h2>
              </div>
              <button
                onClick={() => setShowDispatchModal(false)}
                style={{ background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer', color: '#64748b' }}
              >
                ✕
              </button>
            </div>

            <p style={{ fontSize: '13px', color: '#64748b', marginBottom: '16px' }}>
              Dispatching this order will decrease <strong>Physical Quantity</strong> AND <strong>Reserved Quantity</strong> in the inventory.
            </p>

            {/* Order Items Summary */}
            <div style={{ background: '#f8fafc', padding: '12px 14px', borderRadius: '6px', border: '1px solid #e2e8f0', marginBottom: '16px' }}>
              <div style={{ fontSize: '12px', fontWeight: 600, color: '#334155', marginBottom: '4px' }}>
                Customer: {selectedOrder.customer.companyName}
              </div>
              <div style={{ fontSize: '12px', color: '#64748b' }}>
                Items to dispatch:
              </div>
              <ul style={{ margin: '4px 0 0 16px', padding: 0, fontSize: '12px', color: '#334155' }}>
                {selectedOrder.items.map((item, idx) => (
                  <li key={idx}>
                    {item.quantity} {item.product?.unit} of {item.product?.productName}
                  </li>
                ))}
              </ul>
            </div>

            <form onSubmit={handleProcessDispatch}>
              <div style={{ marginBottom: '14px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px', color: '#334155' }}>
                  Vehicle Registration Number *
                </label>
                <input
                  type="text"
                  placeholder="e.g. MH-12-AB-1234"
                  value={vehicleNumber}
                  onChange={(e) => setVehicleNumber(e.target.value)}
                  className="form-control"
                  required
                />
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px', color: '#334155' }}>
                  Driver Name *
                </label>
                <input
                  type="text"
                  placeholder="e.g. Ramesh Patil"
                  value={driverName}
                  onChange={(e) => setDriverName(e.target.value)}
                  className="form-control"
                  required
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                <button
                  type="button"
                  onClick={() => setShowDispatchModal(false)}
                  className="btn btn-secondary"
                  disabled={dispatching}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  style={{ background: '#059669', borderColor: '#059669' }}
                  disabled={dispatching}
                >
                  {dispatching ? 'Processing Dispatch...' : 'Confirm Dispatch & Deduct Stock'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
