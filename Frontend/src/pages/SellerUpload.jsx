import React, { useState, useRef } from 'react';
import '../Style/SellerUpload.css';
const API = import.meta.env.VITE_API_URL;

const SellerUpload = () => {
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');
  const [img, setImg] = useState('');
  const [filePreview, setFilePreview] = useState('');
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);
  const fileRef = useRef(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    // basic client-side validation
    if (!title?.trim()) return setStatus('Please enter product title');
    const normalizedPrice = String(price).replace(/[^0-9.]/g, '');
    if (!normalizedPrice) return setStatus('Please enter a valid price');
    setLoading(true);
    try {
      const res = await fetch(`${API}/api/admin/product`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
            // seller key removed — uploading without x-seller-key header
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
    setLoading(false);
  };

  const previewSrc = filePreview || img?.trim() || '/placeholder-product.svg';

  const handleFile = (file) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => setFilePreview(e.target.result);
    reader.readAsDataURL(file);
  };

  const onFileChange = (e) => {
    const f = e.target.files && e.target.files[0];
    if (!f) return;
    handleFile(f);
    // set img to dataUrl so backend receives something usable when creating a product
    const reader = new FileReader();
    reader.onload = (ev) => setImg(ev.target.result);
    reader.readAsDataURL(f);
  };

  const onDropFile = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const f = e.dataTransfer?.files?.[0];
    if (f) {
      fileRef.current.files = e.dataTransfer.files;
      onFileChange({ target: fileRef.current });
    }
  };

  const clearForm = () => {
    setTitle(''); setPrice(''); setImg(''); setFilePreview(''); setStatus('');
    if (fileRef.current) fileRef.current.value = null;
  };

  return (
    <div className="seller-wrap">
      <div className="seller-header modern">
        <div>
          <h2 className="seller-title">Seller — Upload Product</h2>
          <div className="seller-sub">Public upload — sellers can upload products without a secret key.</div>
        </div>
        <div className="meta">🚀 Fast upload</div>
      </div>

      <div className="seller-grid modern-grid">
        <div className="upload-card form-card">
          <form onSubmit={handleSubmit} className="seller-form">
            {/* Seller Key removed — upload no longer requires a secret key */}

            <div className="form-row">
              <div className="field">
                <label>Product Title</label>
                <input value={title} onChange={e=>setTitle(e.target.value)} placeholder="E.g. Wireless Headphones" required aria-label="Product title" />
              </div>
              <div className="field">
                <label>Price</label>
                <div className="price-row">
                  <span className="currency">$</span>
                  <input
                    inputMode="decimal"
                    value={price}
                    onChange={e => setPrice(e.target.value)}
                    placeholder="e.g. 19.99"
                    required
                    aria-label="Price"
                  />
                </div>
              </div>
            </div>

            <div className="form-row single">
              <div className="field">
                <label>Image URL (or upload)</label>
                <input value={img} onChange={e=>setImg(e.target.value)} placeholder="https://... (optional)" aria-label="Image URL" />
                <div className="file-area" onDrop={onDropFile} onDragOver={(e)=>e.preventDefault()}>
                  <input ref={fileRef} type="file" accept="image/*" onChange={onFileChange} aria-label="Upload image file" />
                  <small>Or drag & drop an image here</small>
                </div>
              </div>
            </div>

            <div style={{display:'flex',gap:10,marginTop:10}}>
              <button type="submit" className="btn btn-primary" disabled={loading}>{loading ? 'Uploading...' : 'Upload Product'}</button>
              <button type="button" className="btn btn-ghost" onClick={clearForm}>Reset</button>
            </div>

            {status && <div className={`status ${status.toLowerCase().includes('success') ? 'success' : status.toLowerCase().includes('error') ? 'error' : ''}`}>{status}</div>}
          </form>
        </div>

        <aside className="preview-col">
          <div className="upload-card preview modern-preview">
            <div style={{display:'flex',justifyContent:'space-between',width:'100%'}}>
              <div style={{display:'flex',flexDirection:'column',gap:4}}>
                <div style={{fontSize:12,color:'#64748b'}}>Live Preview</div>
                <div className="preview-title" style={{fontSize:16}}>{title || 'Product title (preview)'}</div>
                <div className="preview-price">{price ? `$${String(price).replace(/[^0-9.]/g,'')}` : '$–'}</div>
              </div>
            </div>

            <div className="product-thumb modern-thumb">
              {previewSrc ? <img src={previewSrc} alt="preview" onError={(e)=>{e.target.onerror=null;e.target.src='/placeholder-product.png'}} /> : (
                <div style={{padding:18,textAlign:'center',color:'#94a3b8'}}>No image — place a valid image URL or upload a picture</div>
              )}
            </div>

            <div className="preview-note">Once uploaded the item will appear in your product list so customers can buy it. Tip: Use a clear product image for better conversion.</div>
            <div className="meta smallish" style={{marginTop:8}}>Preview updates live — image, title and price.</div>
          </div>
        </aside>
      </div>
    </div>
  );
}

export default SellerUpload;
