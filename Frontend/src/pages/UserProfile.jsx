import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../Style/UserProfile.css";
import avatar from "../assets/avtar.png";

const UserProfile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [isSeller, setIsSeller] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userToken = localStorage.getItem("userToken");
    const sellerToken = localStorage.getItem("sellerToken");

    if (!userToken) {
      alert("Please login first!");
      navigate("/auth");
      return;
    }

    // Fetch user profile from backend (adjust API endpoint as needed)
    const fetchUserProfile = async () => {
      try {
        const API = import.meta.env.VITE_API_URL;
        const res = await fetch(`${API}/api/auth/user/profile`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${userToken}`,
          },
          credentials: "include",
        });

        const data = await res.json();
        if (res.ok) {
          setUser(data.user || { email: localStorage.getItem("userEmail") });
        } else {
          // Fallback if backend endpoint not available
          setUser({
            email: localStorage.getItem("userEmail") || "user@example.com",
            Fullname: localStorage.getItem("userName") || "User",
          });
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
        setUser({
          email: localStorage.getItem("userEmail") || "user@example.com",
          Fullname: localStorage.getItem("userName") || "User",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
    setIsSeller(!!sellerToken);
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("userToken");
    localStorage.removeItem("sellerToken");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("userName");
    localStorage.removeItem("sellerEmail");
    localStorage.removeItem("sellerName");
    alert("Logged out successfully!");
    navigate("/");
  };

  const handleBackToHome = () => {
    navigate("/");
  };

  if (loading) {
    return (
      <div className="profile-container">
        <p className="loading">Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="profile-container">
      <button className="back-btn" onClick={handleBackToHome}>
        ← Back to Home
      </button>

      <div className="profile-card">
        <div className="profile-header">
          <img src={avatar} alt="User Avatar" className="profile-avatar" />
          <h1 className="profile-name">{user?.Fullname || "User"}</h1>
        </div>

        <div className="profile-details">
          <div className="detail-item">
            <label>Email:</label>
            <p>{user?.email || "N/A"}</p>
          </div>

          {isSeller && (
            <div className="detail-item seller-badge">
              <p>✓ Verified Seller</p>
            </div>
          )}

          <div className="detail-item">
            <label>Account Type:</label>
            <p>{isSeller ? "Seller Account" : "Customer Account"}</p>
          </div>
        </div>

        <div className="profile-actions">
          <button className="btn-action" onClick={() => navigate('/orders')}>📦 Your Orders</button>
          {isSeller && (
            <button
              className="btn-action seller-btn"
              onClick={() => navigate("/seller-dashboard")}
            >
              📊 Go to Seller Dashboard
            </button>
          )}

          <button className="btn-action logout-btn" onClick={handleLogout}>
            🚪 Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
