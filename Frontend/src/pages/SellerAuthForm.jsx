import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../Style/SellerAuthForm.css";
import avatar from "../assets/avtar.png";

const API = import.meta.env.VITE_API_URL;

export default function SellerAuthForm() {
  const navigate = useNavigate();
  const [mode, setMode] = useState("login");
  const [formData, setFormData] = useState({
    fullname: "",
    shopname: "",
    email: "",
    password: "",
    GST_number: "",
    address: "",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  async function handleSubmit(e) {
    e.preventDefault();
    setMessage(null);
    setLoading(true);

    try {
      if (mode === "register") {
        const res = await fetch(`${API}/api/auth/seller/register`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            fullname: formData.fullname,
            shopname: formData.shopname,
            email: formData.email,
            password: formData.password,
            GST_number: formData.GST_number,
            address: formData.address,
          }),
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Registration failed");

        // Save seller token
        localStorage.setItem("sellerToken", data.token || data.sellerToken || "seller_token_" + Date.now());
        localStorage.setItem("sellerEmail", formData.email);
        localStorage.setItem("sellerName", formData.shopname);
        
        // Remove user token if seller logs in as seller
        localStorage.removeItem("userToken");
        localStorage.removeItem("userEmail");
        localStorage.removeItem("userName");

        setMessage({ type: "success", text: data.message || "Registered as seller successfully" });
        setTimeout(() => navigate("/seller-dashboard"), 1500);
      } else {
        // Login
        const res = await fetch(`${API}/api/auth/seller/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            email: formData.email,
            password: formData.password,
          }),
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Login failed");

        // Save seller token
        localStorage.setItem("sellerToken", data.token || data.sellerToken || "seller_token_" + Date.now());
        localStorage.setItem("sellerEmail", formData.email);
        localStorage.setItem("sellerName", formData.shopname || "Seller");
        
        // Remove user token if seller logs in as seller
        localStorage.removeItem("userToken");
        localStorage.removeItem("userEmail");
        localStorage.removeItem("userName");

        setMessage({ type: "success", text: data.message || "Logged in successfully" });
        setTimeout(() => navigate("/seller-dashboard"), 1500);
      }
    } catch (err) {
      setMessage({ type: "error", text: err.message || "Something went wrong" });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="seller-auth-page">
      <div className="seller-auth-card">
        <div className="seller-auth-left">
          <div className="seller-welcome">
            <h2>
              Welcome to
              <br /> DEVDOSE SELLER
              <br /> Community!...
            </h2>
            <p>Grow your business with us</p>
          </div>
        </div>

        <div className="seller-auth-right">
          <div className="lock-icon">
            <img src={avatar} alt="seller avatar" />
          </div>

          <p className="subtitle">
            {mode === "login"
              ? "WELCOME BACK SELLER!"
              : "Register your shop to get started"}
          </p>

          <form className="form" onSubmit={handleSubmit}>
            {/* ===== LOGIN MODE ===== */}
            {mode === "login" && (
              <>
                <div className="field">
                  <input
                    type="email"
                    placeholder="Shop Email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="field">
                  <input
                    type="password"
                    placeholder="Password"
                    name="password"
                    required
                    value={formData.password}
                    onChange={handleInputChange}
                  />
                </div>
              </>
            )}

            {/* ===== REGISTER MODE ===== */}
            {mode === "register" && (
              <>
                <div className="field">
                  <input
                    type="text"
                    placeholder="Full Name"
                    name="fullname"
                    required
                    value={formData.fullname}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="field">
                  <input
                    type="text"
                    placeholder="Shop Name"
                    name="shopname"
                    required
                    value={formData.shopname}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="field">
                  <input
                    type="email"
                    placeholder="Shop Email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="field">
                  <input
                    type="password"
                    placeholder="Password"
                    name="password"
                    required
                    value={formData.password}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="field">
                  <input type="text" placeholder="GST Number" name="GST_number" required value={formData.GST_number} onChange={handleInputChange}/>
                </div>

                <div className="field">
                  <textarea placeholder="Shop Address" name="address" required value={formData.address} onChange={handleInputChange} rows="2"
                  />
                </div>
              </>
            )}

            <button className="btn-grad" type="submit" disabled={loading}>
              {loading
                ? "Please wait..."
                : mode === "login"
                ? "Login as Seller"
                : "Register as Seller"}
            </button>
          </form>

          {message && (
            <div className={`auth-message ${message.type === "error" ? "error" : "success"}`}>
              {message.text}
            </div>
          )}

          <p className="switch">
            {mode === "login" ? (
              <>
                New Seller?{" "}
                <button type="button" className="link" onClick={() => setMode("register")}>
                  Register here.
                </button>
              </>
            ) : (
              <>
                Already a Seller?{" "}
                <button type="button" className="link" onClick={() => setMode("login")}>    
                  Login.
                </button>
              </>
            )}
          </p>
        </div>
      </div>
    </div>
  );
}
