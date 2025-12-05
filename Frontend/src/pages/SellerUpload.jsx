import React, { useState } from 'react';
const API = import.meta.env.VITE_API_URL;

const SellerUpload = () => {
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');
  const [img, setImg] = useState('');
  const [sellerKey, setSellerKey] = useState('');
  const [status, setStatus] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API}/api/admin/product`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-seller-key': sellerKey
        },
        body: JSON.stringify({ title, price, img })
      });
      const data = await res.json();
      if (res.ok) {
        setStatus('Product uploaded successfully');
        setTitle(''); setPrice(''); setImg('');
      } else {
        setStatus(data.message || 'Upload failed');
      }
    } catch (err) {
      console.error(err);
      setStatus('Server error');
    }
  };

  return (
    <div style={{padding:20}}>
      <h2>Seller: Upload Product</h2>
      <p>Enter seller key and product details. Seller key is server-side secret.</p>
      <form onSubmit={handleSubmit} style={{display:'grid',gap:8,maxWidth:400}}>
        <input value={sellerKey} onChange={e=>setSellerKey(e.target.value)} placeholder="Seller Key (paste here)" />
        <input value={title} onChange={e=>setTitle(e.target.value)} placeholder="Product title" required />
        <input value={price} onChange={e=>setPrice(e.target.value)} placeholder="Price (e.g. $19.99)" required />
        <input value={img} onChange={e=>setImg(e.target.value)} placeholder="Image URL (optional)" />
        <button type="submit">Upload</button>
      </form>
      {status && <p>{status}</p>}
    </div>
  )
}

export default SellerUpload;
