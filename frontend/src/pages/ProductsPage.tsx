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

  // Creation modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [creating, setCreating] = useState(false);
  const [name, setName] = useState('');
  const [sku, setSku] = useState('');
  const [category, setCategory] = useState('Electronics');
  const [unit, setUnit] = useState('Units');
  const [unitPrice, setUnitPrice] = useState('');
  const [lowStockThreshold, setLowStockThreshold] = useState('10');
  const [initialStock, setInitialStock] = useState('0');

  // Quick Inward/Outward Modal State
  const [adjustProduct, setAdjustProduct] = useState<Product | null>(null);
  const [adjustQty, setAdjustQty] = useState('');
  const [adjustType, setAdjustType] = useState<'IN' | 'OUT'>('IN');
  const [adjustReason, setAdjustReason] = useState('Manual Stock Audit Adjustment');
  const [adjusting, setAdjusting] = useState(false);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await api.getProducts({
        search: search || undefined,
        category: categoryFilter !== 'ALL' ? categoryFilter : undefined,
      });
      setProducts(res.products);
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

  // CSV Export Function
  const handleExportCsv = () => {
    if (products.length === 0) return;
    const headers = ['SKU', 'Name', 'Category', 'Unit Price', 'Current Stock', 'Min Stock Alert', 'Location'];
    const rows = products.map(p => [
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
    success('Products inventory exported to CSV');
  };

  // Handle Quick Stock Adjust Submit
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
        reason: adjustReason || 'Quick Inward/Outward stock update',
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

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreating(true);
    try {
      await api.createProduct({
        name,
        sku,
        category,
        location: unit || 'Main Warehouse',
        unitPrice: parseFloat(unitPrice),
        minStockAlert: parseInt(lowStockThreshold),
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

  const resetCreateForm = () => {
    setName('');
    setSku('');
    setCategory('Electronics');
    setUnit('Units');
    setUnitPrice('');
    setLowStockThreshold('10');
    setInitialStock('0');
  };

  const categories = ['ALL', 'Gourmet Beverages', 'Oils & Ghee', 'Spices & Herbs', 'Grains & Flours', 'Specialty Foods'];

  return (
    <div className="page-body">
      {/* Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">
            <span>Organic Foods & Gourmet Catalog</span>
            <span className="badge badge-primary">{products.length} Items</span>
          </h1>
          <p className="page-subtitle">Specialty lot inventory: Arabica coffee, A2 Gir cow ghee, Kashmiri saffron, and cold-pressed oils</p>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button onClick={handleExportCsv} className="btn btn-outline" style={{ gap: '6px' }}>
            <Download size={16} />
            <span>Export CSV</span>
          </button>
          {user?.role !== 'ACCOUNTS' && (
            <button onClick={() => setIsModalOpen(true)} className="btn btn-primary" style={{ gap: '6px' }}>
              <Plus size={16} />
              <span>Add Product SKU</span>
            </button>
          )}
        </div>
      </div>

      {/* Filter Bar */}
      <div className="card" style={{ padding: '16px 20px', marginBottom: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
          <form onSubmit={handleSearchSubmit} style={{ display: 'flex', gap: '8px', flex: 1, minWidth: '280px' }}>
            <div style={{ position: 'relative', flex: 1 }}>
              <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} />
              <input
                type="text"
                placeholder="Search by SKU or product name..."
                className="form-input"
                style={{ paddingLeft: '38px' }}
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
            <button type="submit" className="btn btn-secondary">Search</button>
          </form>

          {/* Category Chips */}
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
              <th>SKU / Product</th>
              <th>Category</th>
              <th>Unit Price</th>
              <th>Current Stock</th>
              <th>Status</th>
              <th>Quick Stock Action</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={6} style={{ textAlign: 'center', padding: '40px', color: '#94a3b8' }}>Loading product inventory...</td>
              </tr>
            ) : products.length === 0 ? (
              <tr>
                <td colSpan={6} style={{ textAlign: 'center', padding: '40px', color: '#94a3b8' }}>No products found.</td>
              </tr>
            ) : (
              products.map(p => {
                const isLowStock = p.currentStock <= p.minStockAlert;
                return (
                  <tr key={p.id}>
                    <td>
                      <div style={{ fontWeight: 700, color: '#ffffff' }}>{p.name}</div>
                      <div style={{ fontSize: '11px', color: '#a78bfa', fontFamily: 'monospace' }}>{p.sku}</div>
                    </td>
                    <td>
                      <span className="badge badge-neutral">{p.category}</span>
                    </td>
                    <td style={{ fontWeight: 600 }}>₹{p.unitPrice.toLocaleString('en-IN')}</td>
                    <td>
                      <span style={{ fontWeight: 700, color: isLowStock ? '#fb7185' : '#34d399' }}>{p.currentStock} Units</span>
                    </td>
                    <td>
                      {isLowStock ? (
                        <span className="badge badge-danger">
                          <AlertTriangle size={12} /> Low Stock
                        </span>
                      ) : (
                        <span className="badge badge-success">
                          <CheckCircle2 size={12} /> Healthy
                        </span>
                      )}
                    </td>
                    <td>
                      <button
                        onClick={() => {
                          setAdjustProduct(p);
                          setAdjustQty('10');
                          setAdjustType('IN');
                        }}
                        className="btn btn-outline btn-sm"
                        style={{ gap: '6px', fontSize: '12px' }}
                      >
                        <ArrowUpDown size={13} color="#8b5cf6" />
                        <span>Adjust</span>
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Quick Adjust Modal */}
      {adjustProduct && (
        <div className="modal-backdrop" onClick={() => setAdjustProduct(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '460px' }}>
            <div className="modal-header">
              <h3 className="modal-title">Quick Stock Adjustment</h3>
              <button onClick={() => setAdjustProduct(null)} className="btn btn-secondary btn-sm" style={{ padding: '4px 8px' }}>
                <X size={16} />
              </button>
            </div>
            <form onSubmit={handleQuickAdjustSubmit}>
              <div className="modal-body">
                <div style={{ marginBottom: '16px', background: 'rgba(255,255,255,0.04)', padding: '12px', borderRadius: '8px' }}>
                  <div style={{ fontSize: '14px', fontWeight: 700, color: '#ffffff' }}>{adjustProduct.name}</div>
                  <div style={{ fontSize: '12px', color: '#94a3b8' }}>SKU: {adjustProduct.sku} | Current: {adjustProduct.currentStock} Units</div>
                </div>

                <div className="form-group">
                  <label className="form-label">Movement Type</label>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                    <button
                      type="button"
                      onClick={() => setAdjustType('IN')}
                      className={`btn ${adjustType === 'IN' ? 'btn-primary' : 'btn-secondary'}`}
                      style={{ gap: '6px' }}
                    >
                      <PlusCircle size={16} />
                      <span>INWARD (+)</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setAdjustType('OUT')}
                      className={`btn ${adjustType === 'OUT' ? 'btn-danger' : 'btn-secondary'}`}
                      style={{ gap: '6px' }}
                    >
                      <MinusCircle size={16} />
                      <span>OUTWARD (-)</span>
                    </button>
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Quantity (Units)</label>
                  <input
                    type="number"
                    required
                    min="1"
                    className="form-input"
                    value={adjustQty}
                    onChange={e => setAdjustQty(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Audit Reason</label>
                  <input
                    type="text"
                    required
                    className="form-input"
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
                  {adjusting ? 'Updating...' : 'Commit Stock'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Product Creation Modal */}
      {isModalOpen && (
        <div className="modal-backdrop" onClick={() => setIsModalOpen(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">Create New Product SKU</h3>
              <button onClick={() => setIsModalOpen(false)} className="btn btn-secondary btn-sm" style={{ padding: '4px 8px' }}>
                <X size={16} />
              </button>
            </div>
            <form onSubmit={handleCreateSubmit}>
              <div className="modal-body">
                <div className="form-group">
                  <label className="form-label">Product Name</label>
                  <input
                    type="text"
                    required
                    className="form-input"
                    placeholder="e.g. Ultra HD 4K Wireless Monitor"
                    value={name}
                    onChange={e => setName(e.target.value)}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                  <div className="form-group">
                    <label className="form-label">SKU Code</label>
                    <input
                      type="text"
                      required
                      className="form-input"
                      placeholder="e.g. ELEC-MON-4K"
                      value={sku}
                      onChange={e => setSku(e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Category</label>
                    <select className="form-select" value={category} onChange={e => setCategory(e.target.value)}>
                      <option value="Electronics">Electronics</option>
                      <option value="Appliances">Appliances</option>
                      <option value="Hardware">Hardware</option>
                      <option value="Peripherals">Peripherals</option>
                    </select>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                  <div className="form-group">
                    <label className="form-label">Unit Price (₹)</label>
                    <input
                      type="number"
                      required
                      min="0"
                      step="0.01"
                      className="form-input"
                      placeholder="e.g. 18500"
                      value={unitPrice}
                      onChange={e => setUnitPrice(e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Unit of Measure</label>
                    <input
                      type="text"
                      required
                      className="form-input"
                      placeholder="e.g. Units, Pieces, Boxes"
                      value={unit}
                      onChange={e => setUnit(e.target.value)}
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                  <div className="form-group">
                    <label className="form-label">Initial Stock Count</label>
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
                    <label className="form-label">Low Stock Threshold</label>
                    <input
                      type="number"
                      required
                      min="1"
                      className="form-input"
                      value={lowStockThreshold}
                      onChange={e => setLowStockThreshold(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" onClick={() => setIsModalOpen(false)} className="btn btn-secondary">
                  Cancel
                </button>
                <button type="submit" disabled={creating} className="btn btn-primary">
                  {creating ? 'Creating...' : 'Save Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
