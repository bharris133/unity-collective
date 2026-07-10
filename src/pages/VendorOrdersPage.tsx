import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Package, ChevronDown, ArrowLeft } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { orderService } from '../services/orderService';
import { formatPrice } from '../utils/formatPrice';
import type { Order, OrderStatus } from '../types/Order';

const STATUS_LABELS: Record<OrderStatus, string> = {
  pending: 'Pending',
  paid: 'Paid',
  processing: 'Processing',
  shipped: 'Shipped',
  delivered: 'Delivered',
  cancelled: 'Cancelled',
  refunded: 'Refunded',
};

const STATUS_COLORS: Record<OrderStatus, string> = {
  pending: 'bg-yellow-100 text-yellow-800',
  paid: 'bg-blue-100 text-blue-800',
  processing: 'bg-purple-100 text-purple-800',
  shipped: 'bg-indigo-100 text-indigo-800',
  delivered: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800',
  refunded: 'bg-gray-100 text-gray-800',
};

const VENDOR_TRANSITIONS: Partial<Record<OrderStatus, OrderStatus[]>> = {
  paid: ['processing'],
  processing: ['shipped'],
  shipped: ['delivered'],
};

export default function VendorOrdersPage() {
  const { currentUser } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);

  useEffect(() => {
    if (!currentUser) { setLoading(false); return; }
    orderService.getOrdersByVendor(currentUser.uid)
      .then(setOrders)
      .finally(() => setLoading(false));
  }, [currentUser]);

  const handleStatusUpdate = async (orderId: string, newStatus: OrderStatus) => {
    setUpdating(orderId);
    try {
      await orderService.updateOrderStatus(orderId, newStatus);
      setOrders(prev =>
        prev.map(o => o.orderId === orderId ? { ...o, status: newStatus } : o)
      );
    } finally {
      setUpdating(null);
    }
  };

  const formatDate = (ts: unknown) => {
    if (!ts) return 'N/A';
    const date = (ts as { toDate?: () => Date }).toDate?.() ?? new Date(ts as string);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <div className="min-h-screen bg-[#111111] py-8 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center gap-4 mb-6">
          <Link to="/dashboard" className="text-gray-400 hover:text-white flex items-center gap-1 text-sm">
            <ArrowLeft size={16} /> Back to Dashboard
          </Link>
        </div>

        <h1 className="text-2xl font-bold text-white mb-6">My Store Orders</h1>

        {loading && (
          <p className="text-gray-400 text-center py-12">Loading orders...</p>
        )}

        {!loading && orders.length === 0 && (
          <div className="bg-[#1A1A1A] rounded-lg p-12 text-center border border-white/10">
            <Package size={48} className="mx-auto text-gray-600 mb-4" />
            <h3 className="text-lg font-medium text-white mb-2">No orders yet</h3>
            <p className="text-gray-400 text-sm">Orders from buyers will appear here once your products are purchased.</p>
          </div>
        )}

        {!loading && orders.length > 0 && (
          <div className="space-y-4">
            {orders.map(order => {
              const nextStatuses = VENDOR_TRANSITIONS[order.status] ?? [];
              const ref = `UC-${order.orderId.slice(-8).toUpperCase()}`;
              return (
                <div key={order.orderId} className="bg-[#1A1A1A] rounded-lg border border-white/10 p-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                    <div>
                      <p className="text-white font-semibold">{ref}</p>
                      <p className="text-gray-400 text-sm">{formatDate(order.createdAt)}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${STATUS_COLORS[order.status] ?? 'bg-gray-100 text-gray-800'}`}>
                        {STATUS_LABELS[order.status] ?? order.status}
                      </span>
                      {nextStatuses.length > 0 && (
                        <div className="relative">
                          <select
                            disabled={updating === order.orderId}
                            onChange={e => handleStatusUpdate(order.orderId, e.target.value as OrderStatus)}
                            value=""
                            className="appearance-none bg-red-600 text-white text-xs px-3 py-1.5 rounded-lg pr-7 cursor-pointer disabled:opacity-50"
                          >
                            <option value="" disabled>Update status</option>
                            {nextStatuses.map(s => (
                              <option key={s} value={s}>{STATUS_LABELS[s]}</option>
                            ))}
                          </select>
                          <ChevronDown size={12} className="absolute right-2 top-1/2 -translate-y-1/2 text-white pointer-events-none" />
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Items */}
                  <div className="space-y-2 mb-4">
                    {order.items.map(item => (
                      <div key={item.productId} className="flex justify-between text-sm">
                        <span className="text-gray-300">{item.name} × {item.quantity}</span>
                        <span className="text-white">{formatPrice(item.price * item.quantity)}</span>
                      </div>
                    ))}
                  </div>

                  {/* Footer */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between pt-4 border-t border-white/10 gap-2">
                    <div className="text-sm text-gray-400">
                      Ship to: <span className="text-gray-200">{order.shippingAddress.fullName} — {order.shippingAddress.city}, {order.shippingAddress.state}</span>
                    </div>
                    <div className="text-white font-bold">
                      Total: {formatPrice(order.total)}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
