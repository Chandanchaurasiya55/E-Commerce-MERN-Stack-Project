import React from 'react'
import '../Style/products.css'
import useCart from '../Context/useCart'

const Products = (props) => {
  const { addToCart } = useCart();

  const handleAddToCart = () => {
    const product = {
      id: props.id || Date.now(),
      title: props.title,
      price: props.price,
      img: props.img,
    };
    addToCart(product);
    
    // Show success message and navigate to cart
    alert(`${props.title} added to cart!`);
  };
  
  return (
    <div className='products'>
      <div className='productCard'>
        <img src={props.img} alt={props.title} className='productImage' />   
        <h3 className='productTitle'>{props.title}</h3>
        <p className='productPrice'>{props.price}</p>
        <button className='addToCartButton' onClick={handleAddToCart}>Add to Cart</button>
      </div>   

    </div>
  )
}
export default Products
