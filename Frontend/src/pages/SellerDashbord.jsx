import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function SellerDashboard() {
  const navigate = useNavigate();
  const [sellerName, setSellerName] = useState("Seller");

  useEffect(() => {
    const token = localStorage.getItem("sellerToken");
    if (!token) {
      alert("Please login as a seller first!");
      navigate("/seller-auth");
      return;
    }
    const name = localStorage.getItem("sellerName");
    setSellerName(name || "Seller");
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("sellerToken");
    localStorage.removeItem("sellerEmail");
    localStorage.removeItem("sellerName");
    alert("Logged out successfully!");
    navigate("/");
  };

  return (
    <div style={{ textAlign: "center", marginTop: "100px", fontFamily: "Arial" }}>
      <h1>Welcome to Seller Dashboard 🧑‍💼</h1>
      <h2>Shop: {sellerName}</h2>
      <p>Manage your products and sales here.</p>
      
      <div style={{ marginTop: "30px" }}>
        <button
          onClick={() => navigate("/")}
          style={{
            padding: "10px 20px",
            margin: "10px",
            background: "#667eea",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
            fontSize: "16px"
          }}
        >
          Back to Home
        </button>
        
        <button
          onClick={handleLogout}
          style={{
            padding: "10px 20px",
            margin: "10px",
            background: "#f5576c",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
            fontSize: "16px"
          }}
        >
          Logout as Seller
        </button>
      </div>
    </div>
  );
}
