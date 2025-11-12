import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../Style/Home.css";
import avatar from "../assets/avtar.png";

const API = import.meta.env.VITE_API_URL;

const Home = () => {
  const [search, setSearch] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isSeller, setIsSeller] = useState(false);
  const navigate = useNavigate();

  // ✅ Check login/seller status from localStorage
  useEffect(() => {
    const userToken = localStorage.getItem("userToken");
    const sellerToken = localStorage.getItem("sellerToken");
    setIsLoggedIn(!!userToken);
    setIsSeller(!!sellerToken);

    // ✅ Listen for storage changes (when user logs in on another tab or page)
    const handleStorageChange = () => {
      const updatedUserToken = localStorage.getItem("userToken");
      const updatedSellerToken = localStorage.getItem("sellerToken");
      setIsLoggedIn(!!updatedUserToken);
      setIsSeller(!!updatedSellerToken);
    };

    // ✅ Listen for custom login event from UserAuthForm
    const handleUserLoggedIn = () => {
      const updatedUserToken = localStorage.getItem("userToken");
      const updatedSellerToken = localStorage.getItem("sellerToken");
      setIsLoggedIn(!!updatedUserToken);
      setIsSeller(!!updatedSellerToken);
    };

    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("userLoggedIn", handleUserLoggedIn);
    
    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("userLoggedIn", handleUserLoggedIn);
    };
  }, []);

  // ✅ Become Seller button - Navigate to seller auth
  const handleBecomeSeller = () => {
    navigate("/seller-auth");
  };

  // ✅ Search button
  const handleSearch = () => {
    alert(`Searching for: ${search}`);
  };

  // ✅ Avatar click → Navigate to profile
  const handleAvatarClick = () => {
    navigate("/profile");
  };

  // ✅ Login button → navigate to auth
  const handleLoginClick = () => {
    navigate("/auth");
  };

  return (
    <nav className="navbar">
      <div className="nav-left">
        <h2 className="logo" onClick={() => navigate("/")}>
          DevDose Shop
        </h2>
      </div>

      <div className="nav-center">
        <input
          type="search"
          placeholder="Search Any Things..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button className="btn" onClick={handleSearch}>
          Search
        </button>
      </div>

      <div className="nav-right">
        <button className="btn" onClick={() => navigate("/cart")}>
          🛒 Cart
        </button>

        {/* ✅ Login button visible only when NOT logged in and NOT seller */}
        {!isLoggedIn && !isSeller && (
          <button className="btn" onClick={handleLoginClick}>
            Login
          </button>
        )}

        {/* ✅ Become Seller button visible only when not seller (and not user logged in) */}
        {!isSeller && !isLoggedIn && (
          <button className="btn seller-btn" onClick={handleBecomeSeller}>
            Become a Seller
          </button>
        )}

        {/* ✅ Avatar visible only when user logged in (priority over seller) */}
        {isLoggedIn && (
          <img
            src={avatar}
            alt="avatar"
            className="avatar"
            onClick={handleAvatarClick}
            title="View Profile"
          />
        )}

        {/* ✅ Seller Avatar/Badge visible only when seller logged in (and user not logged in) */}
        {!isLoggedIn && isSeller && (
          <img
            src={avatar}
            alt="seller avatar"
            className="avatar seller-avatar"
            onClick={() => navigate("/seller-dashboard")}
            title="Seller Dashboard"
          />
        )}
      </div>
    </nav>
  );
};

export default Home;
