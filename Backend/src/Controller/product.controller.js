const Product = require('../Model/product.model');

// Simple seller check: require header 'x-seller-key' to match env SELLER_KEY
async function createProduct(req, res) {
  try {
    const sellerKey = req.headers['x-seller-key'];
    if (!process.env.SELLER_KEY) {
      return res.status(500).json({ message: 'Seller key not configured on server' });
    }
    if (!sellerKey || sellerKey !== process.env.SELLER_KEY) {
      return res.status(401).json({ message: 'Unauthorized: invalid seller key' });
    }

    const { title, price, img } = req.body;
    if (!title || !price) {
      return res.status(400).json({ message: 'title and price are required' });
    }

    const newProduct = await Product.create({ title, price, img, seller: 'seller' });
    return res.status(201).json({ message: 'Product created', product: newProduct });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
}

async function getProducts(req, res) {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    return res.status(200).json({ products });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
}

module.exports = {
  createProduct,
  getProducts,
};
