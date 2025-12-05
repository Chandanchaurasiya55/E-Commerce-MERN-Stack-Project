import React from "react";
import "../Style/CartPage.css";
import { useNavigate } from "react-router-dom";
import useCart from "../Context/useCart";


const CartPage = () => {
  const navigate = useNavigate();

  
  const { cartItems, removeFromCart, updateQuantity, getTotalPrice, clearCart } = useCart();
  const [checkoutLoading, setCheckoutLoading] = React.useState(false);
  const [checkoutMsg, setCheckoutMsg] = React.useState('');


  const handleRemove = async (productId) => {
    try {
      await removeFromCart(productId);
    } catch (err) {
      alert(err?.message || 'Failed to remove item');
    }
  };

  const handleQuantityChange = async (productId, newQuantity) => {
    const quantity = parseInt(newQuantity);
    if (quantity > 0) {
      try {
        await updateQuantity(productId, quantity);
      } catch (err) {
        alert(err?.message || 'Failed to update quantity');
      }
    }
  };

  return (
    <div className="CartPage">
      <h1>Your Cart 🛒</h1>
      
      {cartItems.length === 0 ? (
        <div className="emptyCart">
          <p>No items yet!</p>
          <button className="btn" onClick={() => navigate("/")}>
            Continue Shopping
          </button>
        </div>
      ) : (
        <div className="cartContainer">
          <div className="cartItems">
            {cartItems.map((item) => (
              <div key={item.id} className="cartItemCard">
                <div className="cartItemImageWrapper">
                  <img src={item.img} alt={item.title} className="cartItemImage" />
                </div>
                
                <div className="cartItemContent">
                  <div className="cartItemHeader">
                    <h3 className="cartItemTitle">{item.title}</h3>
                    <button
                      className="removeBtn"
                      onClick={() => handleRemove(item.id)}
                      title="Remove from cart"
                    >
                      ✕
                    </button>
                  </div>

                  <p className="cartItemPrice">{item.price}</p>

                  <div className="cartItemFooter">
                    <div className="cartItemQuantity">
                      <label htmlFor={`qty-${item.id}`}>Qty:</label>
                      <input
                        id={`qty-${item.id}`}
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={(e) => handleQuantityChange(item.id, e.target.value)}
                        className="quantityInput"
                      />
                    </div>

                    <div className="cartItemTotal">
                      <span className="totalLabel">Total:</span>
                      <span className="totalPrice">
                        ${(parseFloat(item.price.replace("$", "")) * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="cartSummary">
            <h2>Order Summary</h2>
            <div className="summaryRow">
              <span>Subtotal:</span>
              <span>${getTotalPrice().toFixed(2)}</span>
            </div>
            <div className="summaryRow">
              <span>Shipping:</span>
              <span>$0.00</span>
            </div>
            <div className="summaryRow total">
              <span>Total:</span>
              <span>${getTotalPrice().toFixed(2)}</span>
            </div>
            <button className="checkoutBtn" onClick={async () => {
              // Navigate to dedicated checkout page where user fills address + payment
              setCheckoutLoading(true);
              setCheckoutMsg('');
              try {
                const token = localStorage.getItem('userToken');
                if (!token) {
                  // not logged in → redirect to auth/login page and tell Auth to send user back to /checkout after login
                  navigate('/auth', { state: { redirectTo: '/checkout' } });
                  return;
                }
                navigate('/checkout');
              } catch (err) {
                setCheckoutMsg(err?.message || 'Please login to checkout');
              } finally {
                setCheckoutLoading(false);
              }
            }}>{checkoutLoading ? 'Processing...' : 'Proceed to Checkout'}</button>
            {checkoutMsg && <div style={{marginTop:8, fontSize:13}}>{checkoutMsg}</div>}
            
            {/* Shipping + payment will be collected on /checkout page */}
            <button className="continueShopping" onClick={() => navigate("/")}>
              Continue Shopping
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;
