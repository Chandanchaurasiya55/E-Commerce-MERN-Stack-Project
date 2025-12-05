import React, { useEffect, useState } from 'react';
import '../Style/AdminDashboard.css';
import '../Style/AdminOrders.css';

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchOrders = async () => {
      const API = import.meta.env.VITE_API_URL;
      const token = localStorage.getItem('adminToken');
      if (!token) return;
      try {
        setLoading(true);
        const res = await fetch(`${API}/api/order/admin/orders`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();
        if (res.ok) setOrders(data.orders || []);
      } catch (err) {
        console.error('fetch admin orders', err);
      } finally { setLoading(false); }
    };
    fetchOrders();
  }, []);

  return (
    <div className="orders-page">
      <header className="orders-header">
        <div>
          <h1>Orders</h1>
          <p className="sub">A modern, colorful view of all placed orders</p>
        </div>
        <div className="actions">
          <div className="total-stat">{orders.length} orders</div>
        </div>
      </header>

      {loading ? (
        <div className="orders-empty">Loading orders…</div>
      ) : orders.length === 0 ? (
        <div className="orders-empty">No orders yet</div>
      ) : (
        <div className="orders-grid">
          {orders.map((o) => (
            <article className="order-card" key={o._id}>
              <section className="card-header">
                <div className="order-id">#{String(o._id).slice(-8)}</div>
                <div className="order-meta">
                  <div className="user-name">{o.user?.Fullname || 'Unknown'}</div>
                  <div className="user-email">{o.user?.Email}</div>
                </div>
                <div className="order-date">{new Date(o.createdAt).toLocaleString()}</div>
              </section>

              <section className="card-body">
                <div className="order-summary panel gradient-1">
                  <div className="label">Total</div>
                  <div className="value">${o.totalAmount?.toFixed?.(2) ?? o.totalAmount}</div>
                </div>

                <div className="items-panel panel gradient-2">
                  <div className="panel-title">Items</div>
                  <ul className="items-list">
                    {o.items.map((it) => (
                      <li key={String(it.product)} className="item-row">
                        <div className="item-title">{it.title || it.product}</div>
                        <div className="item-meta">{it.price} × {it.quantity}</div>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="shipping-panel panel gradient-3">
                  <div className="panel-title">Shipping</div>
                  {o.shippingAddress ? (
                    <div className="shipping-info">
                      {o.shippingAddress.name && <div className="ship-line">{o.shippingAddress.name}</div>}
                      {o.shippingAddress.street && <div className="ship-line">{o.shippingAddress.street}</div>}
                      <div className="ship-line">{[o.shippingAddress.city, o.shippingAddress.state].filter(Boolean).join(', ')} {o.shippingAddress.postalCode || ''}</div>
                      <div className="ship-line">{o.shippingAddress.country}</div>
                      {o.shippingAddress.phone && <div className="ship-line">📞 {o.shippingAddress.phone}</div>}
                    </div>
                  ) : (
                    <div className="ship-line muted">No shipping address</div>
                  )}
                </div>

                <div className="payment-panel panel gradient-4">
                  <div className="panel-title">Payment</div>
                  <div className="payment-info">{String(o.paymentMethod || 'Unknown')}</div>
                </div>
              </section>

              <footer className="card-footer">
                <div className={`status-pill ${o.isDelivered ? 'delivered' : 'pending'}`}>
                  {o.isDelivered ? 'Delivered' : 'Pending'}
                </div>
                <div className="footer-actions">
                  <button className="btn-ghost">View</button>
                  <button className="btn-sm">Contact</button>
                  <button
                    className="btn-sm btn-danger"
                    onClick={async () => {
                      if (!confirm('Delete this order? This cannot be undone.')) return;
                      const adminToken = localStorage.getItem('adminToken');
                      if (!adminToken) return alert('Admin login required to delete orders');
                      try {
                        const API = import.meta.env.VITE_API_URL;
                        const res = await fetch(`${API}/api/admin/order/${o._id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${adminToken}` } });
                        const data = await res.json();
                        if (!res.ok) return alert(data.message || 'Failed to delete order');
                        // remove order from UI list
                        setOrders(prev => prev.filter(x => String(x._id) !== String(o._id)));
                      } catch (err) {
                        console.error('delete order failed', err);
                        alert('Failed to delete order — try again');
                      }
                    }}
                  >
                    Delete
                  </button>
                </div>
              </footer>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}

export default AdminOrders;
