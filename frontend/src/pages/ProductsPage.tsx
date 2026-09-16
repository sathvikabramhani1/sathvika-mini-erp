import React, { useState, useEffect } from 'react';
import { Package, Plus, Search, Layers, ShieldCheck, Tag } from 'lucide-react';
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
      success(`Product [${created.productCode}] ${created.productName} created!`);
      setShowModal(false);
      setNewProd({ productCode: '', productName: '', category: 'Industrial Valves', unit: 'PCS', basePrice: 1000, initialPhysicalQuantity: 50 });
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
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
            <div style={{ background: '#1e3a8a', padding: '8px', borderRadius: '8px', color: '#fff' }}>
              <Package size={24} />
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
          <button onClick={() => setShowModal(true)} className="btn btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
            <Plus size={18} /> Add Industrial Product
          </button>
        )}
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <div style={{ position: 'relative', width: '320px' }}>
          <Search size={16} color="#94a3b8" style={{ position: 'absolute', left: '10px', top: '10px' }} />
          <input
            type="text"
            placeholder="Search code, name, category..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="form-control"
            style={{ paddingLeft: '32px' }}
          />
        </div>
      </div>

      <div className="card" style={{ overflow: 'hidden', padding: 0 }}>
        {loading ? (
          <div style={{ padding: '40px', textAlign: 'center', color: '#64748b' }}>Loading products...</div>
        ) : filtered.length === 0 ? (
          <div style={{ padding: '48px', textAlign: 'center' }}>
            <Package size={44} color="#cbd5e1" style={{ margin: '0 auto 12px' }} />
            <h3 style={{ margin: 0, color: '#334155' }}>No Products Found</h3>
          </div>
        ) : (
          <table className="table" style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0', textAlign: 'left', fontSize: '12px', color: '#475569', textTransform: 'uppercase' }}>
                <th style={{ padding: '12px 16px' }}>Product Code</th>
                <th style={{ padding: '12px 16px' }}>Product Name</th>
                <th style={{ padding: '12px 16px' }}>Category</th>
                <th style={{ padding: '12px 16px' }}>Base Price</th>
                <th style={{ padding: '12px 16px', textAlign: 'center' }}>Physical</th>
                <th style={{ padding: '12px 16px', textAlign: 'center' }}>Reserved</th>
                <th style={{ padding: '12px 16px', textAlign: 'center' }}>Available</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((prod) => {
                const inv = prod.inventory;
                return (
                  <tr key={prod.id} style={{ borderBottom: '1px solid #f1f5f9', fontSize: '13px' }}>
                    <td style={{ padding: '14px 16px', fontWeight: 700, color: '#1e3a8a' }}>
                      {prod.productCode}
                    </td>
                    <td style={{ padding: '14px 16px', fontWeight: 600, color: '#0f172a' }}>
                      {prod.productName}
                    </td>
                    <td style={{ padding: '14px 16px', color: '#64748b' }}>
                      {prod.category}
                    </td>
                    <td style={{ padding: '14px 16px', fontWeight: 700, color: '#0f172a' }}>
                      ₹{prod.basePrice.toLocaleString()} / {prod.unit}
                    </td>
                    <td style={{ padding: '14px 16px', textAlign: 'center', fontWeight: 600 }}>
                      {inv?.physicalQuantity ?? 0} {prod.unit}
                    </td>
                    <td style={{ padding: '14px 16px', textAlign: 'center', color: '#f59e0b', fontWeight: 700 }}>
                      {inv?.reservedQuantity ?? 0} {prod.unit}
                    </td>
                    <td style={{ padding: '14px 16px', textAlign: 'center', fontWeight: 800, color: (inv?.availableQuantity ?? 0) > 0 ? '#10b981' : '#ef4444' }}>
                      {inv?.availableQuantity ?? 0} {prod.unit}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* Product Modal */}
      {showModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.6)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px' }}>
          <div style={{ background: '#fff', borderRadius: '12px', maxWidth: '520px', width: '100%', padding: '24px', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.2)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
              <h2 style={{ margin: 0, fontSize: '18px', fontWeight: 700 }}>Add Industrial Product (Admin)</h2>
              <button onClick={() => setShowModal(false)} style={{ background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer' }}>✕</button>
            </div>
            <form onSubmit={handleCreateProduct}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '20px' }}>
                <input
                  type="text"
                  placeholder="Product Code (e.g. IND-VLV-999) *"
                  value={newProd.productCode}
                  onChange={(e) => setNewProd({ ...newProd, productCode: e.target.value })}
                  className="form-control"
                  required
                />
                <input
                  type="text"
                  placeholder="Product Name *"
                  value={newProd.productName}
                  onChange={(e) => setNewProd({ ...newProd, productName: e.target.value })}
                  className="form-control"
                  required
                />
                <input
                  type="text"
                  placeholder="Category *"
                  value={newProd.category}
                  onChange={(e) => setNewProd({ ...newProd, category: e.target.value })}
                  className="form-control"
                  required
                />
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px' }}>
                  <div>
                    <label style={{ fontSize: '12px', color: '#64748b' }}>Unit</label>
                    <input
                      type="text"
                      placeholder="PCS / SET / NOS"
                      value={newProd.unit}
                      onChange={(e) => setNewProd({ ...newProd, unit: e.target.value })}
                      className="form-control"
                      required
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '12px', color: '#64748b' }}>Base Price (₹)</label>
                    <input
                      type="number"
                      min="1"
                      value={newProd.basePrice}
                      onChange={(e) => setNewProd({ ...newProd, basePrice: parseFloat(e.target.value) || 0 })}
                      className="form-control"
                      required
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '12px', color: '#64748b' }}>Initial Stock</label>
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
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                <button type="button" onClick={() => setShowModal(false)} className="btn btn-secondary">Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={submitting}>
                  {submitting ? 'Saving...' : 'Create Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
