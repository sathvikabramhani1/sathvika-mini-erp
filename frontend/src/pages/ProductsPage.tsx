import React, { useState, useEffect } from 'react';
import { Package, Plus, Search, ShieldCheck } from 'lucide-react';
import { api } from '../services/api';
import { Product } from '../types';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export const ProductsPage: React.FC = () => {
  const { user } = useAuth();
  const { success, error, warning } = useToast();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [newProd, setNewProd] = useState({
    productCode: '',
    productName: '',
    category: 'Industrial Valves',
    unit: 'PCS',
    basePrice: 1000,
    initialPhysicalQuantity: 50,
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    setLoading(true);
    try {
      const data = await api.getProducts();
      setProducts(data);
    } catch (err: any) {
      error(err.message || 'Failed to load products.');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (user?.role !== 'ADMIN') {
      warning('Only ADMIN users can create new product master entries.');
      return;
    }
    setSubmitting(true);
    try {
      const created = await api.createProduct(newProd);
      success(`Product [${created.productCode}] ${created.productName} created successfully!`);
      setShowModal(false);
      setNewProd({
        productCode: '',
        productName: '',
        category: 'Industrial Valves',
        unit: 'PCS',
        basePrice: 1000,
        initialPhysicalQuantity: 50,
      });
      loadProducts();
    } catch (err: any) {
      error(err.message || 'Failed to create product.');
    } finally {
      setSubmitting(false);
    }
  };

  const filtered = products.filter((p) => {
    const s = searchTerm.toLowerCase();
    return (
      p.productCode.toLowerCase().includes(s) ||
      p.productName.toLowerCase().includes(s) ||
      p.category.toLowerCase().includes(s)
    );
  });

  return (
    <div className="page-container">
      {/* Page Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
            <div style={{ background: '#eff6ff', padding: '8px', borderRadius: '8px', color: '#2563eb', border: '1px solid #bfdbfe' }}>
              <Package size={22} />
            </div>
            <h1 style={{ margin: 0, fontSize: '24px', fontWeight: 800, color: '#0f172a' }}>
              Industrial Product Master & Stock
            </h1>
          </div>
          <p style={{ margin: 0, color: '#64748b', fontSize: '14px' }}>
            Authoritative catalog of industrial items with live warehouse inventory metrics.
          </p>
        </div>

        {user?.role === 'ADMIN' && (
          <button onClick={() => setShowModal(true)} className="btn btn-primary">
            <Plus size={16} /> Add Industrial Product
          </button>
        )}
      </div>

      {/* Filter and Search Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
        <div style={{ position: 'relative', width: '340px' }}>
          <Search size={16} color="#94a3b8" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
          <input
            type="text"
            placeholder="Search code, name, category..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="form-control"
            style={{ paddingLeft: '36px' }}
          />
        </div>
        <div style={{ fontSize: '13px', color: '#64748b', fontWeight: 500 }}>
          Showing <strong>{filtered.length}</strong> catalog items
        </div>
      </div>

      {/* Product Data Table */}
      <div className="table-responsive">
        {loading ? (
          <div style={{ padding: '48px', textAlign: 'center', color: '#64748b' }}>Loading products...</div>
        ) : filtered.length === 0 ? (
          <div style={{ padding: '48px', textAlign: 'center' }}>
            <Package size={44} color="#cbd5e1" style={{ margin: '0 auto 12px' }} />
            <h3 style={{ margin: '0 0 6px 0', color: '#334155', fontSize: '16px' }}>No Products Found</h3>
            <p style={{ margin: 0, color: '#94a3b8', fontSize: '13px' }}>Try searching a different item or category.</p>
          </div>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>Product Code</th>
                <th>Product Name</th>
                <th>Category</th>
                <th>Base Price</th>
                <th style={{ textAlign: 'center' }}>Physical Stock</th>
                <th style={{ textAlign: 'center' }}>Reserved Stock</th>
                <th style={{ textAlign: 'center' }}>Available to Promise</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((prod) => {
                const inv = prod.inventory;
                const isAvailable = (inv?.availableQuantity ?? 0) > 0;
                return (
                  <tr key={prod.id}>
                    <td style={{ fontWeight: 700, color: '#1e3a8a' }}>
                      <code>{prod.productCode}</code>
                    </td>
                    <td style={{ fontWeight: 600, color: '#0f172a' }}>
                      {prod.productName}
                    </td>
                    <td style={{ color: '#64748b' }}>
                      <span className="badge badge-secondary">{prod.category}</span>
                    </td>
                    <td style={{ fontWeight: 700, color: '#0f172a' }}>
                      ₹{prod.basePrice.toLocaleString()} <span style={{ fontSize: '12px', fontWeight: 400, color: '#64748b' }}>/ {prod.unit}</span>
                    </td>
                    <td style={{ textAlign: 'center', fontWeight: 600, color: '#334155' }}>
                      {inv?.physicalQuantity ?? 0} {prod.unit}
                    </td>
                    <td style={{ textAlign: 'center', color: '#d97706', fontWeight: 600 }}>
                      {inv?.reservedQuantity ?? 0} {prod.unit}
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      <span className={`badge ${isAvailable ? 'badge-success' : 'badge-danger'}`}>
                        {inv?.availableQuantity ?? 0} {prod.unit}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* Standardized Enterprise Product Modal */}
      {showModal && (
        <div className="modal-backdrop">
          <div className="modal-content" style={{ maxWidth: '540px' }}>
            <div className="modal-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#2563eb', border: '1px solid #bfdbfe' }}>
                  <Package size={18} />
                </div>
                <div>
                  <h2 className="modal-title">Add Industrial Product</h2>
                  <p className="modal-subtitle">Register item in SKU catalog with initial warehouse batch</p>
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

            <form onSubmit={handleCreateProduct}>
              <div className="modal-body">
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                  <div className="form-group">
                    <label className="form-label">
                      Product Code <span className="required">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. IND-VLV-999"
                      value={newProd.productCode}
                      onChange={(e) => setNewProd({ ...newProd, productCode: e.target.value })}
                      className="form-control"
                      required
                      autoFocus
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">
                      Category <span className="required">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Industrial Valves"
                      value={newProd.category}
                      onChange={(e) => setNewProd({ ...newProd, category: e.target.value })}
                      className="form-control"
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">
                    Product Full Name <span className="required">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. High Pressure Cast Steel Flanged Ball Valve"
                    value={newProd.productName}
                    onChange={(e) => setNewProd({ ...newProd, productName: e.target.value })}
                    className="form-control"
                    required
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label">
                      Unit <span className="required">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="PCS / SET / NOS"
                      value={newProd.unit}
                      onChange={(e) => setNewProd({ ...newProd, unit: e.target.value })}
                      className="form-control"
                      required
                    />
                  </div>

                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label">
                      Base Price (₹) <span className="required">*</span>
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={newProd.basePrice}
                      onChange={(e) => setNewProd({ ...newProd, basePrice: parseFloat(e.target.value) || 0 })}
                      className="form-control"
                      required
                    />
                  </div>

                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label">
                      Initial Stock <span className="required">*</span>
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={newProd.initialPhysicalQuantity}
                      onChange={(e) => setNewProd({ ...newProd, initialPhysicalQuantity: parseInt(e.target.value) || 0 })}
                      className="form-control"
                      required
                    />
                  </div>
                </div>
              </div>

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
                  {submitting ? 'Creating...' : 'Create Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
