import React, { createContext, useState, useEffect } from 'react';

const API = import.meta.env.VITE_API_URL;

// Create Cart Context
const CartContext = createContext();

// Cart Provider Component
const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  // Helper: normalize a server cart item (c) into a safe client item
  const normalizeEntry = (c) => {
    const product = typeof c.product === 'string' ? { _id: c.product } : (c.product || {});
    const id = product._id || product.id || c.product || Date.now();
    const title = product.title || product.name || 'Unknown product';
    // Keep price as a number OR string with currency; normalize later before arithmetic
    const price = product.price != null ? product.price : '$0.00';
    const img = product.img || product.image || '';
    const quantity = typeof c.quantity === 'number' ? c.quantity : parseInt(c.quantity) || 1;
    return { id, title, price, img, quantity };
  };

  // Load cart from server when authenticated; fallback to localStorage
  useEffect(() => {
    const init = async () => {
      const token = localStorage.getItem('userToken');
      if (token) {
        try {
          const res = await fetch(`${API}/api/cart`, {
            headers: { Authorization: `Bearer ${token}` },
            credentials: 'include',
          });
          if (res.ok) {
            const data = await res.json();
            const items = (data.cart || []).map(normalizeEntry);
            setCartItems(items);
            return;
          }
        } catch (err) {
          console.error('Failed to load server cart', err);
        }
      }

      const savedCart = localStorage.getItem('cart');
      if (savedCart) {
        try {
          setCartItems(JSON.parse(savedCart));
        } catch (error) {
          console.error('Error loading cart from localStorage:', error);
          setCartItems([]);
        }
      }
    };

    init();
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cartItems));
  }, [cartItems]);

  // Add product to cart
  const addToCart = async (product) => {
    const token = localStorage.getItem('userToken');
    if (!token) {
      throw new Error('Please login to add items to your cart');
    }

    const productId = product.id || product._id;
    try {
      const res = await fetch(`${API}/api/cart/add`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        credentials: 'include',
        body: JSON.stringify({ productId, quantity: 1 }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to add to cart');

      // Build a quick lookup from the product param (optimistic merge)
      // The `product` argument may contain title/img/price info we want to keep
      const localPreview = {};
      if (product && (product.id || product._id)) {
        const pid = product.id || product._id;
        localPreview[pid] = {
          id: pid,
          title: product.title,
          price: product.price,
          img: product.img,
          quantity: product.quantity || 1,
        };
      }

      // Normalize server response and merge with any local preview data so UI shows product info
      const items = (data.cart || []).map((c) => {
        const normalized = normalizeEntry(c);
        const merge = localPreview[String(normalized.id)];
        return merge ? { ...normalized, ...merge } : normalized;
      });
      setCartItems(items);
      return { success: true, cart: items };
    } catch (err) {
      console.error('addToCart API error', err);
      throw err;
    }
  };

  // Remove product from cart
  const removeFromCart = async (productId) => {
    const token = localStorage.getItem('userToken');
    if (!token) {
      setCartItems((prevItems) => prevItems.filter((item) => item.id !== productId));
      return;
    }

    try {
      const res = await fetch(`${API}/api/cart/remove`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        credentials: 'include',
        body: JSON.stringify({ productId }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to remove from cart');

      const items = (data.cart || []).map(normalizeEntry);
      setCartItems(items);
    } catch (err) {
      console.error('removeFromCart API error', err);
      throw err;
    }
  };

  // Update product quantity
  const updateQuantity = async (productId, quantity) => {
    if (quantity <= 0) {
      await removeFromCart(productId);
      return;
    }

    const token = localStorage.getItem('userToken');
    if (!token) {
      setCartItems((prevItems) => prevItems.map((item) => (item.id === productId ? { ...item, quantity } : item)));
      return;
    }

    try {
      const res = await fetch(`${API}/api/cart/update`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        credentials: 'include',
        body: JSON.stringify({ productId, quantity }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to update cart');

      const items = (data.cart || []).map(normalizeEntry);
      setCartItems(items);
    } catch (err) {
      console.error('updateQuantity API error', err);
      throw err;
    }
  };

  // Get total price of all items
  // Parse price safely: accept numbers, numeric strings, or currency strings like "$12.99"
  const parsePrice = (price) => {
    if (price == null) return 0;
    if (typeof price === 'number') return price;
    if (typeof price === 'string') {
      // Remove everything except digits, dot, minus
      const cleaned = price.replace(/[^0-9.-]+/g, '');
      return parseFloat(cleaned) || 0;
    }
    return 0;
  };

  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => {
      const price = parsePrice(item.price);
      const qty = Number.isFinite(item.quantity) ? item.quantity : parseInt(item.quantity) || 1;
      return total + price * qty;
    }, 0);
  };

  // Get total number of items in cart
  const getCartCount = () => {
    return cartItems.reduce((count, item) => count + item.quantity, 0);
  };

  // Clear entire cart
  const clearCart = () => {
    setCartItems([]);
  };

  const value = {
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    getTotalPrice,
    getCartCount,
    clearCart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};



export { CartContext, CartProvider };