import React, { createContext, useState, useEffect } from 'react';

const API = import.meta.env.VITE_API_URL;

// Create Cart Context
const CartContext = createContext();

// Cart Provider Component
const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

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
            const items = (data.cart || []).map((c) => ({
              id: c.product._id || c.product,
              title: c.product.title,
              price: c.product.price,
              img: c.product.img,
              quantity: c.quantity,
            }));
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

      const items = (data.cart || []).map((c) => ({
        id: c.product._id || c.product,
        title: c.product.title,
        price: c.product.price,
        img: c.product.img,
        quantity: c.quantity,
      }));
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

      const items = (data.cart || []).map((c) => ({
        id: c.product._id || c.product,
        title: c.product.title,
        price: c.product.price,
        img: c.product.img,
        quantity: c.quantity,
      }));
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

      const items = (data.cart || []).map((c) => ({
        id: c.product._id || c.product,
        title: c.product.title,
        price: c.product.price,
        img: c.product.img,
        quantity: c.quantity,
      }));
      setCartItems(items);
    } catch (err) {
      console.error('updateQuantity API error', err);
      throw err;
    }
  };

  // Get total price of all items
  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => {
      const price = parseFloat(item.price.replace('$', ''));
      return total + price * item.quantity;
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