import React, { useEffect, useState } from 'react';
import {
  Search,
  Plus,
  Package,
  AlertTriangle,
  ArrowUpDown,
  Download,
  CheckCircle2,
  X,
  Edit2,
  PlusCircle,
  MinusCircle
} from 'lucide-react';
import { api } from '../services/api';
import { Product } from '../types';
import { useToast } from '../context/ToastContext';
import { useAuth } from '../context/AuthContext';

export const ProductsPage: React.FC = () => {
  const { user } = useAuth();
  const { success, error } = useToast();

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');

  // Creation Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [creating, setCreating] = useState(false);
  const [name, setName] = useState('');
  const [sku, setSku] = useState('');
  const [category, setCategory] = useState('Gourmet Beverages');
  const [unitPrice, setUnitPrice] = useState('');
  const [minStockAlert, setMinStockAlert] = useState('20');
  const [initialStock, setInitialStock] = useState('0');
  const [location, setLocation] = useState('Warehouse Bay A-1');

  // Edit Product Modal State
  const [editProduct, setEditProduct] = useState<Product | null>(null);
  const [updatingProduct, setUpdatingProduct] = useState(false);

  // Quick Inward/Outward Modal State
  const [adjustProduct, setAdjustProduct] = useState<Product | null>(null);
  const [adjustQty, setAdjustQty] = useState('');
  const [adjustType, setAdjustType] = useState<'IN' | 'OUT'>('IN');
  const [adjustReason, setAdjustReason] = useState('Harvest lot verification');
  const [adjusting, setAdjusting] = useState(false);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await api.getProducts({
        search: search || undefined,
        category: categoryFilter !== 'ALL' ? categoryFilter : undefined,
      });
      const list = Array.isArray(res) ? res : (res?.products || res?.data || []);
      setProducts(list);
    } catch (err: any) {
      error(err.message || 'Failed to fetch product catalog');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [categoryFilter]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchProducts();
  };

  // CSV Export
  const handleExportCsv = () => {
    if ((products || []).length === 0) return;
    const headers = ['SKU', 'Name', 'Category', 'Unit Price', 'Current Stock', 'Min Stock Alert', 'Location'];
    const rows = (products || []).map(p => [
      `"${p.sku}"`,
      `"${p.name.replace(/"/g, '""')}"`,
      `"${p.category}"`,
      p.unitPrice,
      p.currentStock,
      p.minStockAlert,
      `"${p.location || 'Warehouse'}"`
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `sathvika_products_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    success('Products exported to CSV');
  };

  // Add Product Submit
  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreating(true);
    try {
      await api.createProduct({
        name,
        sku,
        category,
        location: location || 'Main Warehouse',
        unitPrice: parseFloat(unitPrice),
        minStockAlert: parseInt(minStockAlert),
        initialStock: parseInt(initialStock),
      });
      success('Product SKU created successfully');
      setIsModalOpen(false);
      resetCreateForm();
      fetchProducts();
    } catch (err: any) {
      error(err.message || 'Failed to create product');
    } finally {
      setCreating(false);
    }
  };

  // Edit Product Submit
  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editProduct) return;
    setUpdatingProduct(true);
    try {
      await api.updateProduct(editProduct.id, {
        name: editProduct.name,
        sku: editProduct.sku,
        category: editProduct.category,
        unitPrice: Number(editProduct.unitPrice),
        minStockAlert: Number(editProduct.minStockAlert),
        location: editProduct.location,
      });
      success('Product details updated successfully');
      setEditProduct(null);
      fetchProducts();
    } catch (err: any) {
      error(err.message || 'Failed to update product');
    } finally {
      setUpdatingProduct(false);
    }
  };

  // Quick Stock Adjust Submit
  const handleQuickAdjustSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!adjustProduct) return;
    const qty = parseInt(adjustQty);
    if (isNaN(qty) || qty <= 0) {
      error('Please enter a valid quantity');
      return;
    }

    setAdjusting(true);
    try {
      await api.adjustStock(adjustProduct.id, {
        quantityChanged: qty,
        movementType: adjustType,
        reason: adjustReason || 'Manual stock update',
      });
      success(`Stock ${adjustType === 'IN' ? 'increased' : 'decreased'} by ${qty} for ${adjustProduct.name}`);
      setAdjustProduct(null);
      setAdjustQty('');
      fetchProducts();
    } catch (err: any) {
      error(err.message || 'Stock adjustment failed');
    } finally {
      setAdjusting(false);
    }
  };

  const resetCreateForm = () => {
    setName('');
    setSku('');
    setCategory('Gourmet Beverages');
    setUnitPrice('');
    setMinStockAlert('20');
    setInitialStock('0');
    setLocation('Warehouse Bay A-1');
  };

  const categories = ['ALL', 'Gourmet Beverages', 'Oils & Ghee', 'Spices & Herbs', 'Grains & Flours', 'Specialty Foods'];

  return (
    <div className="page-body">
      {/* Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">
            <span>Product & Inventory Module</span>
            <span className="badge badge-primary">{(products || []).length} Items</span>
          </h1>
          <p className="page-subtitle">Product catalog, real-time stock levels, warehouse locations, and inward/outward adjustments</p>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button onClick={handleExportCsv} className="btn btn-outline" style={{ gap: '6px' }}>
            <Download size={16} />
            <span>Export CSV</span>
          </button>
          {user?.role !== 'ACCOUNTS' && (
            <button onClick={() => setIsModalOpen(true)} className="btn btn-primary" style={{ gap: '6px' }}>
              <Plus size={16} />
              <span>Add Product</span>
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
                placeholder="Search by SKU code or product name..."
                className="form-input"
                style={{ paddingLeft: '38px' }}
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
            <button type="submit" className="btn btn-secondary">Search</button>
          </form>

          <div style={{ display: 'flex', gap: '6px', overflowX: 'auto' }}>
            {categories.map(c => (
              <button
                key={c}
                onClick={() => setCategoryFilter(c)}
                className={`btn btn-sm ${categoryFilter === c ? 'btn-primary' : 'btn-secondary'}`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Products Table */}
      <div className="table-responsive">
        <table className="data-table">
          <thead>
            <tr>
              <th>SKU / Product Name</th>
              <th>Category</th>
              <th>Unit Price</th>
              <th>Current Stock</th>
              <th>Location</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={7} style={{ textAlign: 'center', padding: '40px', color: '#a7f3d0' }}>Loading inventory...</td>
              </tr>
            ) : (products || []).length === 0 ? (
              <tr>
                <td colSpan={7} style={{ textAlign: 'center', padding: '40px', color: '#a7f3d0' }}>No products found.</td>
              </tr>
            ) : (
              (products || []).map(p => {
                const isLowStock = p.currentStock <= p.minStockAlert;
                return (
                  <tr key={p.id}>
                    <td>
                      <div style={{ fontWeight: 700, color: '#ffffff' }}>{p.name}</div>
                      <div style={{ fontSize: '11px', color: '#fbbf24', fontFamily: 'monospace' }}>{p.sku}</div>
                    </td>
                    <td><span className="badge badge-neutral">{p.category}</span></td>
                    <td style={{ fontWeight: 600 }}>₹{p.unitPrice.toLocaleString('en-IN')}</td>
                    <td>
                      <span style={{ fontWeight: 700, color: isLowStock ? '#fb7185' : '#34d399' }}>
                        {p.currentStock} Units
                      </span>
                    </td>
                    <td style={{ fontSize: '13px', color: '#cbd5e1' }}>{p.location || 'Warehouse'}</td>
                    <td>
                      {isLowStock ? (
                        <span className="badge badge-danger"><AlertTriangle size={12} /> Low Stock</span>
                      ) : (
                        <span className="badge badge-success"><CheckCircle2 size={12} /> Adequate</span>
                      )}
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button
                          onClick={() => {
                            setAdjustProduct(p);
                            setAdjustQty('10');
                            setAdjustType('IN');
                          }}
                          className="btn btn-outline btn-sm"
                          style={{ gap: '4px', fontSize: '11px' }}
                          title="Stock Movement (IN/OUT)"
                        >
                          <ArrowUpDown size={12} color="#10b981" />
                          <span>Stock</span>
                        </button>
                        {user?.role !== 'SALES' && (
                          <button
                            onClick={() => setEditProduct({ ...p })}
                            className="btn btn-secondary btn-sm"
                            style={{ gap: '4px', fontSize: '11px' }}
                            title="Edit Product"
                          >
                            <Edit2 size={12} color="#fbbf24" />
                            <span>Edit</span>
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* 1. ADD PRODUCT MODAL */}
      {isModalOpen && (
        <div className="modal-backdrop" onClick={() => setIsModalOpen(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">Add New Product</h3>
              <button onClick={() => setIsModalOpen(false)} className="btn btn-secondary btn-sm" style={{ padding: '4px 8px' }}>
                <X size={16} />
              </button>
            </div>
            <form onSubmit={handleCreateSubmit}>
              <div className="modal-body">
                <div className="form-group">
                  <label className="form-label">Product Name *</label>
                  <input
                    type="text"
                    required
                    className="form-input"
                    placeholder="e.g. Royal Kashmiri Mogra Saffron (10g)"
                    value={name}
                    onChange={e => setName(e.target.value)}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                  <div className="form-group">
                    <label className="form-label">SKU / Code *</label>
                    <input
                      type="text"
                      required
                      className="form-input"
                      placeholder="e.g. ORG-SAF-KSH"
                      value={sku}
                      onChange={e => setSku(e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Category *</label>
                    <select className="form-select" value={category} onChange={e => setCategory(e.target.value)}>
                      <option value="Gourmet Beverages">Gourmet Beverages</option>
                      <option value="Oils & Ghee">Oils & Ghee</option>
                      <option value="Spices & Herbs">Spices & Herbs</option>
                      <option value="Grains & Flours">Grains & Flours</option>
                      <option value="Specialty Foods">Specialty Foods</option>
                    </select>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                  <div className="form-group">
                    <label className="form-label">Unit Price (₹) *</label>
                    <input
                      type="number"
                      required
                      min="0"
                      step="0.01"
                      className="form-input"
                      placeholder="1450"
                      value={unitPrice}
                      onChange={e => setUnitPrice(e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Warehouse Location</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="e.g. Warehouse Bay A-1"
                      value={location}
                      onChange={e => setLocation(e.target.value)}
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                  <div className="form-group">
                    <label className="form-label">Initial Stock</label>
                    <input
                      type="number"
                      required
                      min="0"
                      className="form-input"
                      value={initialStock}
                      onChange={e => setInitialStock(e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Minimum Stock Alert Quantity *</label>
                    <input
                      type="number"
                      required
                      min="1"
                      className="form-input"
                      value={minStockAlert}
                      onChange={e => setMinStockAlert(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" onClick={() => setIsModalOpen(false)} className="btn btn-secondary">
                  Cancel
                </button>
                <button type="submit" disabled={creating} className="btn btn-primary">
                  {creating ? 'Saving...' : 'Add Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 2. EDIT PRODUCT MODAL */}
      {editProduct && (
        <div className="modal-backdrop" onClick={() => setEditProduct(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">Edit Product: {editProduct.name}</h3>
              <button onClick={() => setEditProduct(null)} className="btn btn-secondary btn-sm" style={{ padding: '4px 8px' }}>
                <X size={16} />
              </button>
            </div>
            <form onSubmit={handleEditSubmit}>
              <div className="modal-body">
                <div className="form-group">
                  <label className="form-label">Product Name *</label>
                  <input
                    type="text"
                    required
                    className="form-input"
                    value={editProduct.name}
                    onChange={e => setEditProduct({ ...editProduct, name: e.target.value })}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                  <div className="form-group">
                    <label className="form-label">SKU / Code *</label>
                    <input
                      type="text"
                      required
                      className="form-input"
                      value={editProduct.sku}
                      onChange={e => setEditProduct({ ...editProduct, sku: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Category *</label>
                    <select
                      className="form-select"
                      value={editProduct.category}
                      onChange={e => setEditProduct({ ...editProduct, category: e.target.value })}
                    >
                      <option value="Gourmet Beverages">Gourmet Beverages</option>
                      <option value="Oils & Ghee">Oils & Ghee</option>
                      <option value="Spices & Herbs">Spices & Herbs</option>
                      <option value="Grains & Flours">Grains & Flours</option>
                      <option value="Specialty Foods">Specialty Foods</option>
                    </select>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                  <div className="form-group">
                    <label className="form-label">Unit Price (₹) *</label>
                    <input
                      type="number"
                      required
                      min="0"
                      step="0.01"
                      className="form-input"
                      value={editProduct.unitPrice}
                      onChange={e => setEditProduct({ ...editProduct, unitPrice: parseFloat(e.target.value) || 0 })}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Location / Warehouse</label>
                    <input
                      type="text"
                      className="form-input"
                      value={editProduct.location || ''}
                      onChange={e => setEditProduct({ ...editProduct, location: e.target.value })}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Minimum Stock Alert Quantity *</label>
                  <input
                    type="number"
                    required
                    min="1"
                    className="form-input"
                    value={editProduct.minStockAlert}
                    onChange={e => setEditProduct({ ...editProduct, minStockAlert: parseInt(e.target.value) || 1 })}
                  />
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" onClick={() => setEditProduct(null)} className="btn btn-secondary">
                  Cancel
                </button>
                <button type="submit" disabled={updatingProduct} className="btn btn-primary">
                  {updatingProduct ? 'Saving...' : 'Update Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 3. STOCK ADJUSTMENT MODAL (IN / OUT with REASON & LOGGING) */}
      {adjustProduct && (
        <div className="modal-backdrop" onClick={() => setAdjustProduct(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '460px' }}>
            <div className="modal-header">
              <h3 className="modal-title">Stock Movement Log (IN / OUT)</h3>
              <button onClick={() => setAdjustProduct(null)} className="btn btn-secondary btn-sm" style={{ padding: '4px 8px' }}>
                <X size={16} />
              </button>
            </div>
            <form onSubmit={handleQuickAdjustSubmit}>
              <div className="modal-body">
                <div style={{ marginBottom: '16px', background: 'rgba(6,22,14,0.8)', padding: '12px', borderRadius: '8px', border: '1px solid rgba(16,185,129,0.2)' }}>
                  <div style={{ fontSize: '14px', fontWeight: 700, color: '#ffffff' }}>{adjustProduct.name}</div>
                  <div style={{ fontSize: '12px', color: '#a7f3d0' }}>SKU: {adjustProduct.sku} | In Stock: {adjustProduct.currentStock} Units</div>
                </div>

                <div className="form-group">
                  <label className="form-label">Movement Type *</label>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                    <button
                      type="button"
                      onClick={() => setAdjustType('IN')}
                      className={`btn ${adjustType === 'IN' ? 'btn-primary' : 'btn-secondary'}`}
                      style={{ gap: '6px' }}
                    >
                      <PlusCircle size={16} />
                      <span>IN (Receipt)</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setAdjustType('OUT')}
                      className={`btn ${adjustType === 'OUT' ? 'btn-danger' : 'btn-secondary'}`}
                      style={{ gap: '6px' }}
                    >
                      <MinusCircle size={16} />
                      <span>OUT (Deduction)</span>
                    </button>
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Quantity Changed *</label>
                  <input
                    type="number"
                    required
                    min="1"
                    className="form-input"
                    placeholder="Enter quantity"
                    value={adjustQty}
                    onChange={e => setAdjustQty(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Audit Reason *</label>
                  <input
                    type="text"
                    required
                    className="form-input"
                    placeholder="e.g. Harvest intake, Damaged goods, Lot audit"
                    value={adjustReason}
                    onChange={e => setAdjustReason(e.target.value)}
                  />
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" onClick={() => setAdjustProduct(null)} className="btn btn-secondary">
                  Cancel
                </button>
                <button type="submit" disabled={adjusting} className="btn btn-primary">
                  {adjusting ? 'Recording...' : 'Record Stock Movement'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
