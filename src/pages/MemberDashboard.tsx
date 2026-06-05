import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Plus,
  Pencil,
  Trash2,
  CheckCircle,
  Clock,
  AlertCircle,
  Package,
  Store,
  ChevronRight,
  X,
  Save,
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { type OnboardingState, type VerificationStatus } from '../data/mockOnboarding';
import { type Product } from '../data/mockProducts';
import { getOnboardingState } from '../services/onboardingService';
import { productService } from '../services/productService';
import { formatPrice } from '../utils/formatPrice';

// ─── Types ────────────────────────────────────────────────────────────────────

interface ProductFormData {
  name: string;
  description: string;
  price: string; // user enters dollars, we convert to cents
  category: string;
  imageUrl: string;
  inStock: boolean;
}

const EMPTY_FORM: ProductFormData = {
  name: '',
  description: '',
  price: '',
  category: '',
  imageUrl: '',
  inStock: true,
};

// ─── Verification badge helper ────────────────────────────────────────────────

function VerificationBadge({ status }: { status: VerificationStatus }) {
  if (status === 'verified') {
    return (
      <div className="inline-flex items-center gap-1.5 bg-[#228B22]/20 border border-[#228B22]/40 rounded-full px-3 py-1">
        <CheckCircle size={14} className="text-[#228B22]" />
        <span className="text-xs font-semibold text-[#228B22]">Verified</span>
      </div>
    );
  }
  if (status === 'pending') {
    return (
      <div className="inline-flex items-center gap-1.5 bg-yellow-500/10 border border-yellow-500/30 rounded-full px-3 py-1">
        <Clock size={14} className="text-yellow-400" />
        <span className="text-xs font-semibold text-yellow-400">Verification Pending</span>
      </div>
    );
  }
  if (status === 'rejected') {
    return (
      <div className="inline-flex items-center gap-1.5 bg-red-600/10 border border-red-600/30 rounded-full px-3 py-1">
        <AlertCircle size={14} className="text-red-500" />
        <span className="text-xs font-semibold text-red-500">Verification Rejected</span>
      </div>
    );
  }
  return (
    <div className="inline-flex items-center gap-1.5 bg-[#2A2A2A] border border-[#3A3A3A] rounded-full px-3 py-1">
      <AlertCircle size={14} className="text-gray-400" />
      <span className="text-xs font-semibold text-gray-400">Not Verified</span>
    </div>
  );
}

// ─── Product Form Modal ───────────────────────────────────────────────────────

interface ProductModalProps {
  initial?: Product | null;
  businessId: string;
  businessName: string;
  onSave: (product: Product) => void;
  onClose: () => void;
}

function ProductModal({ initial, businessId, businessName: _businessName, onSave, onClose }: ProductModalProps) {
  const [form, setForm] = useState<ProductFormData>(
    initial
      ? {
          name: initial.name,
          description: initial.description,
          price: (initial.price / 100).toFixed(2),
          category: initial.category,
          imageUrl: initial.images[0] || '',
          inStock: initial.inStock,
        }
      : EMPTY_FORM
  );
  const [errors, setErrors] = useState<Partial<ProductFormData>>({});

  const validate = (): boolean => {
    const e: Partial<ProductFormData> = {};
    if (!form.name.trim()) e.name = 'Product name is required';
    if (!form.description.trim()) e.description = 'Description is required';
    if (!form.price || isNaN(parseFloat(form.price)) || parseFloat(form.price) <= 0)
      e.price = 'Enter a valid price (e.g. 19.99)';
    if (!form.category.trim()) e.category = 'Category is required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;
    const product: Product = {
      productId: initial?.productId || `product-${Date.now()}`,
      name: form.name.trim(),
      description: form.description.trim(),
      price: Math.round(parseFloat(form.price) * 100),
      category: form.category.trim(),
      vendorId: businessId,
      images: form.imageUrl.trim() ? [form.imageUrl.trim()] : ['https://placehold.co/300x300/1E1E1E/D4AF37?text=Product'],
      inStock: form.inStock,
      stockQuantity: initial?.stockQuantity ?? 10,
      tags: [],
      createdAt: initial?.createdAt ?? new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    onSave(product);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4">
      <div className="bg-[#1E1E1E] border border-[#2A2A2A] rounded-xl w-full max-w-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-white">
            {initial ? 'Edit Product' : 'Add New Product'}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="space-y-4">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Product Name *</label>
            <input
              type="text"
              value={form.name}
              onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
              placeholder="e.g. Handcrafted Necklace"
              className="w-full bg-[#2A2A2A] border border-[#3A3A3A] rounded-lg px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-[#D4AF37] text-sm"
            />
            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Description *</label>
            <textarea
              value={form.description}
              onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
              placeholder="Describe your product..."
              rows={3}
              className="w-full bg-[#2A2A2A] border border-[#3A3A3A] rounded-lg px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-[#D4AF37] text-sm resize-none"
            />
            {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description}</p>}
          </div>

          {/* Price + Category row */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Price ($) *</label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={form.price}
                onChange={e => setForm(f => ({ ...f, price: e.target.value }))}
                placeholder="19.99"
                className="w-full bg-[#2A2A2A] border border-[#3A3A3A] rounded-lg px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-[#D4AF37] text-sm"
              />
              {errors.price && <p className="text-red-500 text-xs mt-1">{errors.price}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Category *</label>
              <input
                type="text"
                value={form.category}
                onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
                placeholder="e.g. Jewelry"
                className="w-full bg-[#2A2A2A] border border-[#3A3A3A] rounded-lg px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-[#D4AF37] text-sm"
              />
              {errors.category && <p className="text-red-500 text-xs mt-1">{errors.category}</p>}
            </div>
          </div>

          {/* Image URL */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Image URL (optional)</label>
            <input
              type="url"
              value={form.imageUrl}
              onChange={e => setForm(f => ({ ...f, imageUrl: e.target.value }))}
              placeholder="https://example.com/product.jpg"
              className="w-full bg-[#2A2A2A] border border-[#3A3A3A] rounded-lg px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-[#D4AF37] text-sm"
            />
          </div>

          {/* In Stock toggle */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setForm(f => ({ ...f, inStock: !f.inStock }))}
              className={`w-10 h-6 rounded-full transition-colors ${form.inStock ? 'bg-[#228B22]' : 'bg-[#3A3A3A]'}`}
            >
              <div className={`w-4 h-4 bg-white rounded-full mx-1 transition-transform ${form.inStock ? 'translate-x-4' : 'translate-x-0'}`} />
            </button>
            <span className="text-sm text-gray-300">In Stock</span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 mt-6">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 border border-[#3A3A3A] text-gray-300 rounded-lg hover:bg-[#2A2A2A] transition-colors text-sm"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors text-sm font-semibold flex items-center justify-center gap-2"
          >
            <Save size={16} />
            {initial ? 'Save Changes' : 'Add Product'}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Main Dashboard ───────────────────────────────────────────────────────────

export default function MemberDashboard() {
  const navigate = useNavigate();
  const { userProfile, loading: authLoading } = useAuth();

  const [onboarding, setOnboarding] = useState<OnboardingState | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  // Derive businessId from onboarding data (slug from business name)
  const businessId = onboarding
    ? onboarding.businessProfile.businessName.toLowerCase().replace(/\s+/g, '-')
    : '';
  const businessName = onboarding?.businessProfile.businessName ?? '';

  useEffect(() => {
    if (authLoading) return;

    // Redirect to login if not authenticated
    if (!userProfile) {
      navigate('/login');
      return;
    }

    const uid = userProfile.uid ?? (userProfile as any).uid;

    (async () => {
      const state = await getOnboardingState(uid);

      // Redirect to onboarding if not started or not completed
      if (!state || state.currentStep !== 'complete') {
        navigate('/onboarding');
        return;
      }

      setOnboarding(state);

      // Load products for this business from Firestore (or mock)
      const bid = state.businessProfile.businessName.toLowerCase().replace(/\s+/g, '-');
      const existing = await productService.getByBusinessId(bid);
      setProducts(existing);
    })();
  }, [authLoading, userProfile, navigate]);

  const handleSaveProduct = async (product: Product) => {
    try {
      const saved = await productService.create(product);
      setProducts(prev => {
        const idx = prev.findIndex(p => p.productId === saved.productId);
        if (idx >= 0) {
          const updated = [...prev];
          updated[idx] = saved;
          return updated;
        }
        return [...prev, saved];
      });
    } catch (error) {
      console.error('Error saving product:', error);
      // Optimistic update on failure
      setProducts(prev => {
        const idx = prev.findIndex(p => p.productId === product.productId);
        if (idx >= 0) {
          const updated = [...prev];
          updated[idx] = product;
          return updated;
        }
        return [...prev, product];
      });
    }
    setShowModal(false);
    setEditingProduct(null);
  };

  const handleDeleteProduct = async (id: string) => {
    try {
      await productService.delete(id);
    } catch (error) {
      console.error('Error deleting product:', error);
    }
    setProducts(prev => prev.filter(p => p.productId !== id));
    setDeleteConfirm(null);
  };

  const openAdd = () => {
    setEditingProduct(null);
    setShowModal(true);
  };

  const openEdit = (product: Product) => {
    setEditingProduct(product);
    setShowModal(true);
  };

  // Loading state
  if (authLoading || !onboarding) {
    return (
      <div className="min-h-screen bg-[#111111] flex items-center justify-center">
        <p className="text-gray-400">Loading dashboard...</p>
      </div>
    );
  }

  const { businessProfile, verificationStatus, isBlackOwned } = onboarding;

  return (
    <div className="min-h-screen bg-[#111111] py-8">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-1">Member Dashboard</h1>
          <p className="text-gray-400">Manage your business listing and products</p>
        </div>

        {/* Business Profile Card */}
        <div className="bg-[#1E1E1E] border border-[#2A2A2A] rounded-xl p-6 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 rounded-xl bg-[#2A2A2A] border border-[#3A3A3A] flex items-center justify-center flex-shrink-0">
                <Store size={28} className="text-[#D4AF37]" />
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <h2 className="text-xl font-bold text-white">{businessProfile.businessName}</h2>
                  <VerificationBadge status={verificationStatus} />
                  {isBlackOwned && (
                    <div
                      className="inline-flex items-center gap-1 rounded-full px-3 py-1 border"
                      style={{
                        background: 'linear-gradient(135deg, #CC0000 0%, #1A1A1A 50%, #228B22 100%)',
                        borderColor: '#D4AF37',
                      }}
                    >
                      <span className="text-xs font-bold" style={{ color: '#D4AF37' }}>
                        ✦ Black-Owned
                      </span>
                    </div>
                  )}
                </div>
                <p className="text-sm text-gray-400">{businessProfile.category} · {businessProfile.location}</p>
                <p className="text-sm text-gray-500 mt-1 line-clamp-2">{businessProfile.description}</p>
              </div>
            </div>
            <button
              onClick={() => navigate('/onboarding')}
              className="flex items-center gap-1 text-sm text-[#D4AF37] hover:text-yellow-300 transition-colors flex-shrink-0"
            >
              Edit Profile <ChevronRight size={16} />
            </button>
          </div>

          {/* Business Details Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6 pt-6 border-t border-[#2A2A2A]">
            {businessProfile.phone && (
              <div>
                <p className="text-xs text-gray-500 mb-0.5">Phone</p>
                <p className="text-sm text-gray-300">{businessProfile.phone}</p>
              </div>
            )}
            {businessProfile.email && (
              <div>
                <p className="text-xs text-gray-500 mb-0.5">Email</p>
                <p className="text-sm text-gray-300 truncate">{businessProfile.email}</p>
              </div>
            )}
            {businessProfile.website && (
              <div>
                <p className="text-xs text-gray-500 mb-0.5">Website</p>
                <a
                  href={businessProfile.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-[#D4AF37] hover:underline truncate block"
                >
                  {businessProfile.website}
                </a>
              </div>
            )}
          </div>
        </div>

        {/* Verification Status Banner */}
        {verificationStatus === 'pending' && (
          <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4 mb-6 flex items-start gap-3">
            <Clock size={18} className="text-yellow-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-yellow-400">Verification Under Review</p>
              <p className="text-xs text-yellow-400/70 mt-0.5">
                Our team is reviewing your submitted documents. You'll be notified once the review is complete (typically 1–3 business days).
              </p>
            </div>
          </div>
        )}
        {verificationStatus === 'verified' && (
          <div className="bg-[#228B22]/10 border border-[#228B22]/30 rounded-xl p-4 mb-6 flex items-start gap-3">
            <CheckCircle size={18} className="text-[#228B22] flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-[#228B22]">Business Verified</p>
              <p className="text-xs text-[#228B22]/70 mt-0.5">
                Your business has been verified. Your listing now displays the Verified badge in the directory.
              </p>
            </div>
          </div>
        )}

        {/* Products Section */}
        <div className="bg-[#1E1E1E] border border-[#2A2A2A] rounded-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <Package size={20} className="text-[#D4AF37]" />
              <h2 className="text-lg font-bold text-white">Products</h2>
              <span className="bg-[#2A2A2A] border border-[#3A3A3A] text-gray-400 text-xs rounded-full px-2 py-0.5">
                {products.length}
              </span>
            </div>
            <button
              onClick={openAdd}
              className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors"
            >
              <Plus size={16} />
              Add Product
            </button>
          </div>

          {products.length === 0 ? (
            <div className="text-center py-12 border border-dashed border-[#3A3A3A] rounded-xl">
              <Package size={40} className="text-gray-600 mx-auto mb-3" />
              <p className="text-gray-400 font-medium mb-1">No products yet</p>
              <p className="text-gray-500 text-sm mb-4">Add your first product to start selling in the marketplace.</p>
              <button
                onClick={openAdd}
                className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors"
              >
                <Plus size={16} />
                Add First Product
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {products.map(product => (
                <div
                  key={product.productId}
                  className="bg-[#2A2A2A] border border-[#3A3A3A] rounded-xl overflow-hidden"
                >
                  {/* Product Image */}
                  <div className="aspect-video bg-[#1A1A1A] overflow-hidden">
                    <img
                      src={product.images[0] || 'https://placehold.co/300x200/1E1E1E/D4AF37?text=Product'}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Product Info */}
                  <div className="p-4">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <h3 className="font-semibold text-white text-sm leading-tight line-clamp-1">{product.name}</h3>
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full flex-shrink-0 ${
                          product.inStock
                            ? 'bg-[#228B22]/20 text-[#228B22]'
                            : 'bg-red-600/20 text-red-400'
                        }`}
                      >
                        {product.inStock ? 'In Stock' : 'Out of Stock'}
                      </span>
                    </div>
                    <p className="text-xs text-gray-400 line-clamp-2 mb-3">{product.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-[#D4AF37] font-bold">{formatPrice(product.price)}</span>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => openEdit(product)}
                          className="p-1.5 text-gray-400 hover:text-white hover:bg-[#3A3A3A] rounded-lg transition-colors"
                          title="Edit product"
                        >
                          <Pencil size={14} />
                        </button>
                        <button
                          onClick={() => setDeleteConfirm(product.productId)}
                          className="p-1.5 text-gray-400 hover:text-red-400 hover:bg-red-600/10 rounded-lg transition-colors"
                          title="Delete product"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Product Add/Edit Modal */}
      {showModal && (
        <ProductModal
          initial={editingProduct}
          businessId={businessId}
          businessName={businessName}
          onSave={handleSaveProduct}
          onClose={() => {
            setShowModal(false);
            setEditingProduct(null);
          }}
        />
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4">
          <div className="bg-[#1E1E1E] border border-[#2A2A2A] rounded-xl w-full max-w-sm p-6 text-center">
            <Trash2 size={32} className="text-red-500 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-white mb-2">Delete Product?</h3>
            <p className="text-gray-400 text-sm mb-6">This action cannot be undone.</p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="flex-1 px-4 py-2 border border-[#3A3A3A] text-gray-300 rounded-lg hover:bg-[#2A2A2A] transition-colors text-sm"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteProduct(deleteConfirm)}
                className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors text-sm font-semibold"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
