import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

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

  return (
    <div style={{ padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <h1>Admin Dashboard</h1>
        <button onClick={handleLogout} style={{ padding: '10px 20px', backgroundColor: '#ff6b6b', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
          Logout
        </button>
      </div>

      <div>
        <h2>Welcome, {adminName}!</h2>
          <div style={{ marginTop: '30px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
            <div style={{ padding: '20px', backgroundColor: '#f0f0f0', borderRadius: '8px' }}>
              <h3>📦 Upload Product</h3>
              <p>Add new products to store</p>
              <button onClick={() => navigate('/seller')} style={{ padding: '10px 20px', backgroundColor: '#ff7a00', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
                Go to Upload
              </button>
            </div>

            <div style={{ padding: '20px', backgroundColor: '#f0f0f0', borderRadius: '8px' }}>
              <h3>📊 View Products</h3>
              <p>Manage all products</p>
              <button onClick={() => navigate('/')} style={{ padding: '10px 20px', backgroundColor: '#ff7a00', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
                View All
              </button>
            </div>

            <div style={{ padding: '20px', backgroundColor: '#f0f0f0', borderRadius: '8px' }}>
              <h3>👥 Users</h3>
              <p>Manage users</p>
              <button style={{ padding: '10px 20px', backgroundColor: '#ccc', color: '#333', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
                Coming Soon
              </button>
            </div>
          </div>
        </div>
    </div>
  );
};

export default AdminDashboard;
