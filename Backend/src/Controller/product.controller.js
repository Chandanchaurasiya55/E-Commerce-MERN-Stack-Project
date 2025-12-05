const Product = require('../Model/product.model');

// Product controller
// NOTE: Previously this endpoint required a seller secret key header (x-seller-key).
// The requirement has been removed and uploads are allowed without that header.
async function createProduct(req, res) {
  try {
    // NOTE: seller key check removed — uploads allowed without an x-seller-key header.
    // If you want to re-introduce optional verification, check process.env.SELLER_KEY
    // and validate the header only if a value is present.

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

// Admin: delete a product by id
async function deleteProduct(req, res) {
  try {
    const id = req.params.id;
    if (!id) return res.status(400).json({ message: 'Product id required' });

    const deleted = await Product.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ message: 'Product not found' });

    return res.status(200).json({ message: 'Product deleted', product: deleted });
  } catch (err) {
    console.error('deleteProduct error', err);
    return res.status(500).json({ message: 'Server error while deleting product' });
  }
}

module.exports = {
  createProduct,
  getProducts,
  deleteProduct,
};
