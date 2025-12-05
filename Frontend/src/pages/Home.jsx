import React, { useState, useEffect } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import "../Style/Home.css";
import avatar from "../assets/avtar.png";
import Products from '../Components/products.jsx';
import useCart from "../Context/useCart";

const API = import.meta.env.VITE_API_URL;

const Home = () => {
  const [search, setSearch] = useState("");
  const [isSearched, setIsSearched] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isSeller, setIsSeller] = useState(false);
  const navigate = useNavigate();
  const { getCartCount } = useCart();
  const [cartCount, setCartCount] = useState(0);

  // Products fetched from backend
  const [products, setProducts] = React.useState([]);

  //check login status and seller status on component mount
  useEffect(() => {
    const userToken = localStorage.getItem("userToken");
    const sellerToken = localStorage.getItem("sellerToken");
    setIsLoggedIn(!!userToken);
    setIsSeller(!!sellerToken);

    //  Listen for storage changes (when user logs in on another tab or page)
    const handleStorageChange = () => {
      const updatedUserToken = localStorage.getItem("userToken");
      setIsLoggedIn(!updatedUserToken);
    };

    // Listen for custom login event from UserAuthForm
    const handleUserLoggedIn = () => {
      const updatedUserToken = localStorage.getItem("userToken");
      setIsLoggedIn(!!updatedUserToken);
    };

    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("userLoggedIn", handleUserLoggedIn);
    
    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("userLoggedIn", handleUserLoggedIn);
    };
  }, []);

  // Update cart count
  useEffect(() => {
    setCartCount(getCartCount());
  }, [getCartCount]);

  // Fetch products from backend
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch(`${API}/api/products`);
        if (!res.ok) throw new Error('Failed to fetch products');
        const data = await res.json();
        setProducts(data.products || []);
      } catch (err) {
        console.error('Error fetching products:', err);
      }
    };
    fetchProducts();
  }, []);

  // Search button
  const handleSearch = () => {
    if (search.trim() === "") {
      alert("Please enter a search term");
    } else {
      setIsSearched(true);
    }
  };

  // Clear search - show all products again
  const handleClearSearch = () => {
    setSearch("");
    setIsSearched(false);
  };

  // Get filtered products only after search button is clicked
  const filteredProducts = isSearched
    ? products.filter(product => product.title.toLowerCase().includes(search.toLowerCase()))
    : [];

  //  Avatar click → Navigate to profile
  const handleAvatarClick = () => {
    navigate("/profile");
  };

  //  Login button → navigate to auth
  const handleLoginClick = () => {
    navigate("/auth");
  };

  // Cart button → navigate to cart
  const HandleCart = () => {
    navigate("/cart");
  };
 
const ChatBot = () => {
  alert("Chat Bot Clicked");
  const ChatBotWindow = window.open("https://devdoseai.netlify.app", "ChatBot", "width=400,height=400");
  
};

  return (
    <>
    <div className="navbar">
      <div className="nav-left">
        <h2 className="logo" onClick={() => navigate("/")}>
          KHIYANSH COMPUTER
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

      <button className="btn" onClick={ChatBot}>Chat Bot</button>

      <div className="nav-right">
        <button className="btn" onClick={HandleCart}>
          🛒 Cart {cartCount > 0 && <span>({cartCount})</span>}
        </button>

        {/* Login button visible only when NOT logged in and NOT seller */}
        {!isLoggedIn && !isSeller && (
          <button className="btn" onClick={handleLoginClick}>
            Login
          </button>
        )}

        {/* Avatar visible only when user logged in (priority over seller) */}
        {isLoggedIn && (
          <img
            src={avatar}
            alt="avatar"
            className="avatar"
            onClick={handleAvatarClick}
            title="View Profile"
          />
        )}

      </div>

  </div>
    <div className="products-container">
    {isSearched && filteredProducts.length > 0 && (
      <div style={{gridColumn: "1 / -1", marginBottom: "20px"}}>
        <button className="btn" onClick={handleClearSearch} style={{backgroundColor: "#ff7a00", color: "white"}}>
          ← Back to All Products
        </button>
      </div>
    )}
    {!isSearched && products.map((product) => (
      <Products key={product._id || product.id} product={product} />
    ))}
    {isSearched && filteredProducts.length > 0 && filteredProducts.map((product) => (
      <Products key={product._id || product.id} product={product} />
    ))}
    {isSearched && filteredProducts.length === 0 && (
      <div className="no-products">
        <h2>❌ No products found for "{search}"</h2>
        <p>Try searching with different keywords</p>
        <button className="btn" onClick={handleClearSearch} style={{marginTop: "20px"}}>
          ← Back to All Products
        </button>
      </div>
    )}
  </div>
  </>
  );
};

export default Home;
