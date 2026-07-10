import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Package, ShoppingBag } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { orderService } from '../services/orderService';
import { formatPrice } from '../utils/formatPrice';
import type { Order, OrderStatus } from '../types/Order';

const STATUS_LABELS: Record<OrderStatus, string> = {
  pending: 'Pending',
  paid: 'Paid — Awaiting Processing',
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

export default function BuyerOrdersPage() {
  const { currentUser } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!currentUser) { setLoading(false); return; }
    orderService.getOrdersByBuyer(currentUser.uid)
      .then(setOrders)
      .finally(() => setLoading(false));
  }, [currentUser]);

  const formatDate = (ts: unknown) => {
    if (!ts) return 'N/A';
    const date = (ts as { toDate?: () => Date }).toDate?.() ?? new Date(ts as string);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <div className="min-h-screen bg-[#111111] py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <ShoppingBag className="text-red-500" size={28} />
          <h1 className="text-2xl font-bold text-white">My Orders</h1>
        </div>

        {loading && (
          <p className="text-gray-400 text-center py-12">Loading your orders...</p>
        )}

        {!loading && orders.length === 0 && (
          <div className="bg-[#1A1A1A] rounded-lg p-12 text-center border border-white/10">
            <Package size={48} className="mx-auto text-gray-600 mb-4" />
            <h3 className="text-lg font-medium text-white mb-2">No orders yet</h3>
            <p className="text-gray-400 text-sm mb-6">
              You haven't placed any orders yet. Explore the marketplace to support Black-owned businesses.
            </p>
            <Link
              to="/marketplace"
              className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition text-sm font-medium"
            >
              Browse Marketplace
            </Link>
          </div>
        )}

        {!loading && orders.length > 0 && (
          <div className="space-y-4">
            {orders.map(order => {
              const ref = `UC-${order.orderId.slice(-8).toUpperCase()}`;
              return (
                <div key={order.orderId} className="bg-[#1A1A1A] rounded-lg border border-white/10 p-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                    <div>
                      <p className="text-white font-semibold">{ref}</p>
                      <p className="text-gray-400 text-sm">Placed {formatDate(order.createdAt)}</p>
                    </div>
                    <span className={`self-start sm:self-auto px-3 py-1 rounded-full text-xs font-semibold ${STATUS_COLORS[order.status] ?? 'bg-gray-100 text-gray-800'}`}>
                      {STATUS_LABELS[order.status] ?? order.status}
                    </span>
                  </div>

                  {/* Items */}
                  <div className="space-y-2 mb-4">
                    {order.items.map(item => (
                      <div key={item.productId} className="flex items-center gap-3">
                        {item.image && (
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-12 h-12 object-cover rounded"
                            onError={e => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
                          />
                        )}
                        <div className="flex-1 flex justify-between text-sm">
                          <span className="text-gray-300">{item.name} × {item.quantity}</span>
                          <span className="text-white">{formatPrice(item.price * item.quantity)}</span>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Footer */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between pt-4 border-t border-white/10 gap-2">
                    <div className="text-sm text-gray-400">
                      Shipping to: <span className="text-gray-200">{order.shippingAddress.city}, {order.shippingAddress.state}</span>
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
