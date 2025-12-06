import React from 'react'
import '../Style/products.css'
import useCart from '../Context/useCart'
import { useNavigate } from 'react-router-dom';

const Products = ({ product }) => {
  const { addToCart } = useCart();
  const navigate = useNavigate();

  const handleAddToCart = () => {
    const item = {
      id: product._id || product.id || Date.now(),
      title: product.title,
      price: product.price,
      img: product.img,
    };
    (async () => {
      try {
        await addToCart(item);
      } catch (err) {
        if (err?.message && err.message.toLowerCase().includes('login')) {
          if (window.confirm('You must be logged in to add items to cart. Go to login page?')) {
            navigate('/auth');
          }
        } else {
          alert(err?.message || 'Could not add to cart');
        }
      }
    })();
  };

  return (
    <div className='products'>
      <div className='productCard'>
        <img src={product.img} alt={product.title} className='productImage' />   
        <h3 className='productTitle'>{product.title}</h3>
        <p className='productPrice'>{product.price}</p>
        <button className='addToCartButton' onClick={handleAddToCart}>Add to Cart</button>
      </div>   
    </div>
  )
}
export default Products
