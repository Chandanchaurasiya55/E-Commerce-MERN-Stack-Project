import React from "react";
import "../Style/CartPage.css";
import { useNavigate } from "react-router-dom";
import useCart from "../Context/useCart";


const CartPage = () => {
  const navigate = useNavigate();

  
  const { cartItems, removeFromCart, updateQuantity, getTotalPrice } = useCart();

  const handleRemove = (productId) => {
    removeFromCart(productId);
  };

  const handleQuantityChange = (productId, newQuantity) => {
    const quantity = parseInt(newQuantity);
    if (quantity > 0) {
      updateQuantity(productId, quantity);
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
            <button className="checkoutBtn">Proceed to Checkout</button>
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
