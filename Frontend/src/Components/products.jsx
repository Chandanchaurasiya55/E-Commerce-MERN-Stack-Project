import React from 'react'
import '../Style/products.css'
import useCart from '../Context/useCart'

const Products = ({ product }) => {
  const { addToCart } = useCart();

  const handleAddToCart = () => {
    const item = {
      id: product._id || product.id || Date.now(),
      title: product.title,
      price: product.price,
      img: product.img,
    };
    addToCart(item);
    alert(`${product.title} added to cart!`);
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
