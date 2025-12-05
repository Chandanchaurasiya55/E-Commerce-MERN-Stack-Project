import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../Style/AdminDashboard.css';

const AdminDashboard = () => {
  const [adminName, setAdminName] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const adminName = localStorage.getItem('adminName');
    setAdminName(adminName || 'Admin');
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminEmail');
    localStorage.removeItem('adminName');
    window.dispatchEvent(new Event('adminLoggedOut'));
    navigate('/');
  };

  // sample placeholder stats (in future we can fetch real data)
  const stats = [
    { id: 1, label: 'Products', value: 124, icon: '📦', color: 'linear-gradient(120deg,#7c3aed,#06b6d4)' },
    { id: 2, label: 'Orders', value: 48, icon: '🧾', color: 'linear-gradient(120deg,#06b6d4,#7c3aed)' },
    { id: 3, label: 'Revenue', value: '$24.6k', icon: '💰', color: 'linear-gradient(120deg,#f97316,#ef4444)' },
    { id: 4, label: 'Users', value: 3_412, icon: '👥', color: 'linear-gradient(120deg,#10b981,#06b6d4)' }
  ];

  const [recentProducts, setRecentProducts] = useState([]);
  const [loadingRecent, setLoadingRecent] = useState(false);
  const [systemStatus, setSystemStatus] = useState({ dbConnected: false, paymentConfigured: false, emailConfigured: false });
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Fetch recent ordered products for admin
  useEffect(() => {
    const fetchRecent = async () => {
      const API = import.meta.env.VITE_API_URL;
      const adminToken = localStorage.getItem('adminToken');
      if (!adminToken) return; // not admin

      try {
        setLoadingRecent(true);
        const res = await fetch(`${API}/api/order/admin/recent-orders`, {
          method: 'GET',
          headers: { Authorization: `Bearer ${adminToken}` },
        });
        const data = await res.json();
          if (res.ok) {
          // unique by productId - keep most recent
          const seen = new Set();
          const unique = [];
          for (const it of data.items || []) {
            const pid = String(it.productId);
            if (!seen.has(pid)) {
              seen.add(pid);
              // include shippingAddress if present on the recent-orders item
              unique.push({
                id: pid,
                title: it.title,
                price: it.price,
                img: it.img,
                orderedAt: it.orderedAt,
                orderedBy: it.orderedBy,
                shippingAddress: it.shippingAddress || null,
              });
            }
            if (unique.length >= 5) break;
          }
          setRecentProducts(unique);
        } else {
          console.error('Failed loading recent orders', data);
        }
      } catch (err) {
        console.error('Error fetching recent orders', err);
      } finally {
        setLoadingRecent(false);
      }
    };

    fetchRecent();

    // fetch system status
    const fetchStatus = async () => {
      const API = import.meta.env.VITE_API_URL;
      try {
        const res = await fetch(`${API}/api/status`);
        const data = await res.json();
        if (res.ok) setSystemStatus({ dbConnected: !!data.dbConnected, paymentConfigured: !!data.paymentConfigured, emailConfigured: !!data.emailConfigured });
      } catch (err) {
        console.error('failed to read system status', err);
      }
    };
    fetchStatus();
  }, []);

  return (
    <div className="admin-dashboard">
      <aside className={`admin-sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="brand">E‑Store Admin</div>
        <nav className="side-nav">
          <button className="nav-item active">Admin</button>
          <button className="nav-item" onClick={() => navigate('/seller')}>Upload Product</button>
          <button className="nav-item" onClick={() => navigate('/admin-products')}>Products</button>
          <button className="nav-item" onClick={() => navigate('/admin-orders')}>Orders</button>
        </nav>
        <div className="sidebar-footer">Logged in as <strong>{adminName || 'Admin'}</strong></div>
      </aside>
      {sidebarOpen && <div className="mobile-overlay" onClick={()=>setSidebarOpen(false)} aria-hidden="true"></div>}

      <main className="admin-main">
        <header className="admin-header">
          {/* mobile toggle */}
          <button className="sidebar-toggle" onClick={() => setSidebarOpen(v => !v)} aria-expanded={sidebarOpen} aria-label="Toggle sidebar">
            ☰
          </button>
          <div>
            <h1 className="page-title">Dashboard</h1>
            <div className="page-sub">Welcome back, <strong>{adminName}</strong></div>
          </div>

          <div className="header-actions">
            <div className="search">
              <input placeholder="Search products, orders or users" />
            </div>
            <button className="btn-ghost" onClick={handleLogout}>Logout</button>
            {/* small-screen close button inside main area */}
            {sidebarOpen ? <button className="sidebar-close" onClick={() => setSidebarOpen(false)} aria-label="Close sidebar">✕</button> : null}
          </div>
        </header>

        <section className="card split" style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div className="card-col">
            <h3 className="card-title">Recent Products</h3>
            {loadingRecent ? (
              <div>Loading recent orders…</div>
            ) : recentProducts.length === 0 ? (
              <div style={{color:'#64748b'}}>No recent ordered products yet — they will appear here after customers place orders.</div>
            ) : (
              <ul className="recent-list">
                {recentProducts.map(p => (
                  <li key={p.id} className="recent-item">
                    <img src={p.img || '/placeholder-product.png'} alt={p.title} />
                    <div className="meta">
                      <div className="title">{p.title}</div>
                      <div className="sub">{p.id} • {p.price}</div>
                      {p.shippingAddress ? (
                        <div className="address smallish" title={p.shippingAddress && JSON.stringify(p.shippingAddress)}>
                          Shipping: {p.shippingAddress.name || p.shippingAddress.street || ''}{p.shippingAddress.city ? `, ${p.shippingAddress.city}` : ''}{p.shippingAddress.country ? ` • ${p.shippingAddress.country}` : ''}
                        </div>
                      ) : null}
                    </div>
                    <div className="actions">
                      <button className="btn-sm" onClick={() => navigate(`/admin-orders?highlight=${p.id}`)}>Edit</button>
                      <button
                        className="btn-sm btn-danger"
                        onClick={async () => {
                          if (!confirm('Are you sure you want to DELETE this product? This action cannot be undone.')) return;
                          const adminToken = localStorage.getItem('adminToken');
                          if (!adminToken) return alert('Admin login required to delete products');
                          try {
                            const API = import.meta.env.VITE_API_URL;
                            const res = await fetch(`${API}/api/admin/product/${p.id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${adminToken}` } });
                            const data = await res.json();
                            if (!res.ok) return alert(data.message || 'Failed to delete product');
                            // remove from the displayed list
                            setRecentProducts(prev => prev.filter(x => x.id !== p.id));
                          } catch (err) {
                            console.error('delete product failed', err);
                            alert('Failed to delete product — try again');
                          }
                        }}
                      >
                        Delete
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="card-col">
            <h3 className="card-title">Quick Access</h3>
            <div className="quick-grid">
              <button className="action" onClick={() => navigate('/seller')}>➕ Upload</button>
              <button className="action" onClick={() => navigate('/admin-products')}>📦 Products</button>
              <button className="action" onClick={() => navigate('/admin-orders')}>📝 Orders</button>
              <button className="action" onClick={() => {
                // Export visible recent products to CSV
                if (!recentProducts || recentProducts.length === 0) return alert('No recent products to export');
                const rows = recentProducts.map(p => ({ id: p.id, title: p.title, price: p.price }));
                const csv = [Object.keys(rows[0]).join(','), ...rows.map(r => Object.values(r).map(v => `"${String(v).replace(/"/g,'""')}"`).join(','))].join('\n');
                const blob = new Blob([csv], { type: 'text/csv' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url; a.download = `recent-products-${Date.now()}.csv`;
                document.body.appendChild(a); a.click(); a.remove(); URL.revokeObjectURL(url);
              }}>📤 Export CSV</button>
              <button className="action" onClick={() => alert('Settings screen — coming soon')}>⚙️ Settings</button>
            </div>

            <div style={{ marginTop: 18 }}>
              <h4 className="smallish">System status</h4>
              <div className="status-pills">
                <span className={`pill ${systemStatus.dbConnected ? 'green' : ''}`}>{systemStatus.dbConnected ? 'DB connected' : 'DB disconnected'}</span>
                <span className={`pill ${systemStatus.paymentConfigured ? 'green' : ''}`}>{systemStatus.paymentConfigured ? 'Payment online' : 'Payment disabled'}</span>
                <span className={`pill ${systemStatus.emailConfigured ? 'green' : ''}`}>{systemStatus.emailConfigured ? 'Email service' : 'Email disabled'}</span>
              </div>
            </div>
          </div>
        </section>

        <footer className="admin-footer">© {new Date().getFullYear()} E‑Store • Admin panel</footer>
      </main>
    </div>
  );
};

export default AdminDashboard;
