import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useCart from '../Context/useCart';
import '../Style/Checkout.css';

const CheckoutPage = () => {
  const navigate = useNavigate();
  const { getTotalPrice, clearCart, cartItems, getCartCount } = useCart();

  const [address, setAddress] = useState({
    name: '',
    phone: '',
    street: '',
    city: '',
    state: '',
    postalCode: '',
    country: ''
  });

  const [paymentMethod, setPaymentMethod] = useState('card');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [placedOrder, setPlacedOrder] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setLoading(true);
    try {
      const token = localStorage.getItem('userToken');
      if (!token) throw new Error('Please login to place an order');

      // minimal validation
      if (!address.street || !address.city || !address.postalCode || !address.country) {
        throw new Error('Please provide street, city, postal code and country');
      }

      const API = import.meta.env.VITE_API_URL;
      const res = await fetch(`${API}/api/order/checkout`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        credentials: 'include',
        body: JSON.stringify({ address, paymentMethod })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Checkout failed');

      // clear local cart and hold placed order to show details
      clearCart();
      setPlacedOrder(data.order || null);

      // give a friendly message and highlight if COD — admins will receive full order details
      if (paymentMethod === 'cod') {
        setMessage('Order placed successfully — Cash on Delivery. Admin has been notified with the order details. Order ID: ' + (data.order?._id || 'N/A'));
      } else {
        setMessage('Order placed successfully — Order ID: ' + (data.order?._id || 'N/A'));
      }
      // optional: redirect to orders or home after a short timeout
      setTimeout(() => navigate('/'), 1800);
    } catch (err) {
      console.error('checkout error', err);
      setMessage(err?.message || 'Checkout failed');
    } finally {
      setLoading(false);
    }
  };

  const parsePrice = (price) => {
    if (price == null) return 0;
    if (typeof price === 'number') return price;
    const cleaned = String(price).replace(/[^0-9.-]+/g, '');
    return parseFloat(cleaned) || 0;
  };

  return (
    <div className="checkout-page">
      <div className="checkout-header">
        <div>
          <h1>Secure Checkout</h1>
          <div className="subtitle">Fast, secure and beautifully designed — confirm your order</div>
        </div>
        <div className="order-count">{getCartCount()} items</div>
      </div>

      <div className="checkout-grid">
        <form className="checkout-form card" onSubmit={handleSubmit}>
          <div className="form-section">
            <h2>Shipping Address</h2>
            <div className="inputs-grid">
              <input placeholder="Full name" value={address.name} onChange={e => setAddress({ ...address, name: e.target.value })} />
              <input placeholder="Phone" value={address.phone} onChange={e => setAddress({ ...address, phone: e.target.value })} />
              <input placeholder="Street address" value={address.street} onChange={e => setAddress({ ...address, street: e.target.value })} />
              <input placeholder="City" value={address.city} onChange={e => setAddress({ ...address, city: e.target.value })} />
              <input placeholder="State / Region" value={address.state} onChange={e => setAddress({ ...address, state: e.target.value })} />
              <input placeholder="Postal code" value={address.postalCode} onChange={e => setAddress({ ...address, postalCode: e.target.value })} />
              <input placeholder="Country" value={address.country} onChange={e => setAddress({ ...address, country: e.target.value })} />
            </div>
          </div>

          <div className="form-section">
            <h2>Payment Method</h2>
            <div className="payment-options">
              <label className={`pm ${paymentMethod === 'card' ? 'selected' : ''}`}>
                <input type="radio" name="pm" checked={paymentMethod === 'card'} onChange={() => setPaymentMethod('card')} />
                <div className="pm-content">
                  <div className="pm-title">Card / Online</div>
                  <div className="pm-sub">Pay securely using card</div>
                </div>
              </label>

              <label className={`pm ${paymentMethod === 'cod' ? 'selected' : ''}`}>
                <input type="radio" name="pm" checked={paymentMethod === 'cod'} onChange={() => setPaymentMethod('cod')} />
                <div className="pm-content">
                  <div className="pm-title">Cash on Delivery</div>
                  <div className="pm-sub">Pay when courier arrives</div>
                </div>
              </label>

              <label className={`pm ${paymentMethod === 'paypal' ? 'selected' : ''}`}>
                <input type="radio" name="pm" checked={paymentMethod === 'paypal'} onChange={() => setPaymentMethod('paypal')} />
                <div className="pm-content">
                  <div className="pm-title">PayPal</div>
                  <div className="pm-sub">Fast and trusted</div>
                </div>
              </label>
            </div>
          </div>

          <div className="form-actions">
            <button className="btn primary" type="submit">{loading ? 'Placing order...' : 'Place order securely'}</button>
            <button type="button" className="btn-ghost" onClick={() => navigate('/cart')}>Back to cart</button>
          </div>

          {message && <div className="form-message">{message}</div>}

          {placedOrder && (
            <div className="order-confirm card" style={{marginTop:12}}>
              <div className="oc-header"><strong>Order confirmed</strong> • #{String(placedOrder._id).slice(-8)}</div>
              <div className="oc-body" style={{marginTop:8}}>
                <div><strong>Total:</strong> ${placedOrder.totalAmount?.toFixed?.(2) ?? placedOrder.totalAmount}</div>
                <div><strong>Payment:</strong> {placedOrder.paymentMethod}</div>
                {placedOrder.shippingAddress && (
                  <div style={{marginTop:8}}>
                    <div><strong>Ship to:</strong></div>
                    <div>{placedOrder.shippingAddress.name}</div>
                    <div>{placedOrder.shippingAddress.street}</div>
                    <div>{[placedOrder.shippingAddress.city, placedOrder.shippingAddress.state].filter(Boolean).join(', ')} {placedOrder.shippingAddress.postalCode || ''}</div>
                    <div>{placedOrder.shippingAddress.country}</div>
                  </div>
                )}
                <div style={{marginTop:8}}>
                  <strong>Items:</strong>
                  <ul style={{marginTop:6}}>
                    {placedOrder.items?.map(it => (
                      <li key={String(it.product)}>{it.title} · ${it.price} × {it.quantity}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}
        </form>

        <aside className="summary card">
          <div className="summary-top gradient-1">
            <div className="summary-title">Payment Summary</div>
            <div className="summary-amount">${getTotalPrice().toFixed(2)}</div>
          </div>

          <div className="summary-body">
            <div className="summary-list">
              {cartItems.length === 0 ? (
                <div className="summary-empty">Your cart is empty</div>
              ) : (
                cartItems.map((it) => (
                  <div className="summary-item" key={it.id}>
                    <div className="thumb"><img src={it.img} alt={it.title} /></div>
                    <div className="meta">
                      <div className="title">{it.title}</div>
                      <div className="opts">{it.quantity || 1} × ${parsePrice(it.price).toFixed(2)}</div>
                    </div>
                    <div className="item-price">${(parsePrice(it.price) * (it.quantity || 1)).toFixed(2)}</div>
                  </div>
                ))
              )}
            </div>

            <div className="summary-row"><span>Subtotal</span><strong>${getTotalPrice().toFixed(2)}</strong></div>
            <div className="summary-row"><span>Shipping</span><span>$0.00</span></div>
            <div className="summary-row total"><span>Total</span><strong>${getTotalPrice().toFixed(2)}</strong></div>

            <div className="summary-note">Your payment method will be recorded with the order and visible to admins.</div>
          </div>

          <div className="summary-footer">
            <button className="btn-sm" onClick={() => { clearCart(); }}>Clear cart</button>
            <button className="btn-ghost" onClick={() => navigate('/')}>Continue shopping</button>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default CheckoutPage;
