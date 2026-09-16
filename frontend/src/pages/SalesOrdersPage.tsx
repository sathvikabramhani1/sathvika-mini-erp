import React, { useState, useEffect } from 'react';
import {
  ShoppingCart,
  Search,
  CheckCircle2,
  Clock,
  Truck,
  XCircle,
  Package,
  Layers,
  ChevronRight,
  ShieldCheck,
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
    setVehicleNumber('');
    setDriverName('');
    setShowDispatchModal(true);
  };

  const handleProcessDispatch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOrder) return;

    setDispatching(true);
    try {
      await api.dispatchSalesOrder(selectedOrder.id, {
        vehicleNumber,
        driverName,
      });

      success(`Order ${selectedOrder.orderNumber} dispatched! Physical and reserved stock deducted.`);
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
          <span className="badge badge-warning">
            <Clock size={12} /> PENDING CONFIRMATION
          </span>
        );
      case 'CONFIRMED':
        return (
          <span className="badge badge-primary">
            <ShieldCheck size={12} /> STOCK RESERVED
          </span>
        );
      case 'DISPATCHED':
        return (
          <span className="badge badge-success">
            <Truck size={12} /> DISPATCHED
          </span>
        );
      case 'CANCELLED':
        return (
          <span className="badge badge-danger">
            <XCircle size={12} /> CANCELLED
          </span>
        );
      default:
        return <span className="badge badge-secondary">{status}</span>;
    }
  };

  return (
    <div className="page-container">
      {/* Header Banner */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
            <div style={{ background: '#eff6ff', padding: '8px', borderRadius: '8px', color: '#2563eb', border: '1px solid #bfdbfe' }}>
              <ShoppingCart size={22} />
            </div>
            <h1 style={{ margin: 0, fontSize: '24px', fontWeight: 800, color: '#0f172a' }}>
              Sales Orders & Stock Management
            </h1>
          </div>
          <p style={{ margin: 0, color: '#64748b', fontSize: '13.5px' }}>
            Steps 3, 4 & 5: Verify stock availability, atomically reserve inventory, and issue logistics gatepasses.
          </p>
        </div>

        <button
          onClick={loadData}
          className="btn btn-secondary"
        >
          <RefreshCw size={14} /> Refresh Stock & Orders
        </button>
      </div>

      {/* Modern Workflow Stepper */}
      <div className="workflow-stepper">
        <span className="stepper-item completed">
          <span className="stepper-number">✓</span>
          <span>1. Enquiry</span>
        </span>
        <ChevronRight size={14} color="#cbd5e1" />
        <span className="stepper-item completed">
          <span className="stepper-number">✓</span>
          <span>2. Quotation</span>
        </span>
        <ChevronRight size={14} color="#cbd5e1" />
        <span className="stepper-item active">
          <span className="stepper-number">3</span>
          <span>Sales Orders</span>
        </span>
        <ChevronRight size={14} color="#cbd5e1" />
        <span className="stepper-item active">
          <span className="stepper-number">4</span>
          <span>Stock Reservation</span>
        </span>
        <ChevronRight size={14} color="#cbd5e1" />
        <span className="stepper-item active">
          <span className="stepper-number">5</span>
          <span>Dispatch</span>
        </span>
      </div>

      {/* ========================================================================= */}
      {/* SECTION 1: LIVE INVENTORY STOCK AVAILABILITY TABLE                        */}
      {/* ========================================================================= */}
      <div className="card" style={{ marginBottom: '24px', padding: '20px 22px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', flexWrap: 'wrap', gap: '10px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Package size={18} color="#2563eb" />
            <h3 style={{ margin: 0, fontSize: '15px', fontWeight: 700, color: '#0f172a' }}>
              Live Warehouse Stock Availability (Available = Physical − Reserved)
            </h3>
          </div>
          <span style={{ fontSize: '12px', color: '#64748b', fontWeight: 500 }}>
            Authoritative SKU Inventory Balance
          </span>
        </div>

        <div className="table-responsive" style={{ boxShadow: 'none', border: '1px solid #e2e8f0' }}>
          <table className="table">
            <thead>
              <tr>
                <th>Product Code</th>
                <th>Product Name</th>
                <th>Category</th>
                <th style={{ textAlign: 'center' }}>Physical Stock</th>
                <th style={{ textAlign: 'center' }}>Reserved Stock</th>
                <th style={{ textAlign: 'center' }}>Available to Promise</th>
              </tr>
            </thead>
            <tbody>
              {inventory.map((item) => {
                const isAvail = item.availableQuantity > 0;
                return (
                  <tr key={item.id}>
                    <td style={{ fontWeight: 700, color: '#1e3a8a' }}>
                      <code>{item.productCode}</code>
                    </td>
                    <td style={{ fontWeight: 600, color: '#0f172a' }}>
                      {item.productName}
                    </td>
                    <td>
                      <span className="badge badge-secondary">{item.category}</span>
                    </td>
                    <td style={{ textAlign: 'center', fontWeight: 600, color: '#334155' }}>
                      {item.physicalQuantity} {item.unit}
                    </td>
                    <td style={{ textAlign: 'center', color: '#d97706', fontWeight: 600 }}>
                      {item.reservedQuantity} {item.unit}
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      <span className={`badge ${isAvail ? 'badge-success' : 'badge-danger'}`}>
                        {item.availableQuantity} {item.unit}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* SECTION 2: SALES ORDERS LIST                                              */}
      {/* ========================================================================= */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '16px', marginBottom: '18px', flexWrap: 'wrap' }}>
        <div className="segmented-control">
          {['ALL', 'PENDING', 'CONFIRMED', 'DISPATCHED', 'CANCELLED'].map((st) => (
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
            placeholder="Search Order #, Customer, Quotation..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="form-control"
          />
        </div>
      </div>

      <div className="table-responsive">
        {loading ? (
          <div style={{ padding: '48px', textAlign: 'center', color: '#64748b' }}>Loading sales orders...</div>
        ) : filteredOrders.length === 0 ? (
          <div style={{ padding: '48px', textAlign: 'center' }}>
            <ShoppingCart size={44} color="#cbd5e1" style={{ margin: '0 auto 12px' }} />
            <h3 style={{ margin: '0 0 6px 0', color: '#334155', fontSize: '16px' }}>No Sales Orders Found</h3>
            <p style={{ margin: 0, color: '#94a3b8', fontSize: '13.5px' }}>
              Convert an accepted quotation to generate commercial sales orders.
            </p>
          </div>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>Order #</th>
                <th>Customer</th>
                <th>Source Quote</th>
                <th>Order Value</th>
                <th>Stock Check</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((order) => (
                <tr key={order.id}>
                  <td style={{ fontWeight: 700, color: '#1e3a8a' }}>
                    <code>{order.orderNumber}</code>
                  </td>
                  <td>
                    <div style={{ fontWeight: 600, color: '#0f172a' }}>{order.customer.companyName}</div>
                    <div style={{ fontSize: '12px', color: '#64748b' }}>
                      {order.items.length} line item(s) • Order Date: {new Date(order.orderDate).toLocaleDateString()}
                    </div>
                  </td>
                  <td style={{ color: '#2563eb', fontWeight: 600 }}>
                    <code>{order.quotation?.quotationNumber || 'Direct'}</code>
                  </td>
                  <td>
                    <div style={{ fontWeight: 800, fontSize: '14px', color: '#0f172a' }}>
                      ₹{order.totalAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </div>
                  </td>
                  <td>
                    {order.status === 'PENDING' ? (
                      order.canFulfill ? (
                        <span className="badge badge-success">
                          ✓ Stock Available
                        </span>
                      ) : (
                        <span className="badge badge-danger">
                          ✕ Stock Deficit
                        </span>
                      )
                    ) : order.status === 'CONFIRMED' ? (
                      <span className="badge badge-primary">
                        ✓ Stock Locked
                      </span>
                    ) : order.status === 'DISPATCHED' ? (
                      <span className="badge badge-success">
                        ✓ Dispatched
                      </span>
                    ) : (
                      <span className="badge badge-secondary">
                        Released
                      </span>
                    )}
                  </td>
                  <td>
                    {getStatusBadge(order.status)}
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                      {/* Step 4 Action: Confirm & Reserve Inventory */}
                      {order.status === 'PENDING' && (
                        <button
                          onClick={() => handleConfirmOrder(order)}
                          disabled={!order.canFulfill}
                          className="btn btn-primary btn-sm"
                          title={order.canFulfill ? 'Admin confirmation reserves stock' : 'Insufficient stock available to confirm order'}
                        >
                          <ShieldCheck size={13} />
                          <span>Reserve Stock</span>
                        </button>
                      )}

                      {/* Step 5 Action: Process Dispatch */}
                      {order.status === 'CONFIRMED' && (
                        <button
                          onClick={() => openDispatchModal(order)}
                          className="btn btn-success btn-sm"
                        >
                          <Truck size={13} />
                          <span>Dispatch</span>
                        </button>
                      )}

                      {/* Dispatched Info */}
                      {order.status === 'DISPATCHED' && order.dispatches && order.dispatches.length > 0 && (
                        <span className="badge badge-success">
                          🚚 {order.dispatches[0].vehicleNumber}
                        </span>
                      )}

                      {/* Cancel Order Action */}
                      {(order.status === 'PENDING' || order.status === 'CONFIRMED') && (
                        <button
                          onClick={() => handleCancelOrder(order)}
                          className="btn btn-secondary btn-sm"
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
        <div className="modal-backdrop">
          <div className="modal-content" style={{ maxWidth: '520px' }}>
            <div className="modal-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: '#ecfdf5', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#059669', border: '1px solid #a7f3d0' }}>
                  <Truck size={18} />
                </div>
                <div>
                  <h2 className="modal-title">Dispatch Order {selectedOrder.orderNumber}</h2>
                  <p className="modal-subtitle">Log logistics dispatch gatepass and deduct physical inventory</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowDispatchModal(false)}
                className="modal-close-btn"
                title="Close dialog"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleProcessDispatch}>
              <div className="modal-body">
                {/* Order Items Summary */}
                <div style={{ background: '#f8fafc', padding: '12px 14px', borderRadius: '8px', border: '1px solid #e2e8f0', marginBottom: '16px' }}>
                  <div style={{ fontSize: '12px', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>
                    Customer: {selectedOrder.customer.companyName}
                  </div>
                  <div style={{ fontSize: '12px', color: '#64748b' }}>
                    Verified Items to Dispatch:
                  </div>
                  <ul style={{ margin: '6px 0 0 16px', padding: 0, fontSize: '12px', color: '#334155' }}>
                    {selectedOrder.items.map((item, idx) => (
                      <li key={idx} style={{ marginBottom: '2px' }}>
                        <strong>{item.quantity} {item.product?.unit}</strong> of {item.product?.productName}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="form-group">
                  <label className="form-label">
                    Vehicle Registration Number <span className="required">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. MH-12-AB-1234"
                    value={vehicleNumber}
                    onChange={(e) => setVehicleNumber(e.target.value)}
                    className="form-control"
                    required
                    autoFocus
                  />
                </div>

                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">
                    Driver Name & Contact <span className="required">*</span>
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
              </div>

              <div className="modal-footer">
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
                  className="btn btn-success"
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
