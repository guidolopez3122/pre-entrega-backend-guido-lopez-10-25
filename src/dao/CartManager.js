import Cart from '../models/cart.js';

class CartManager {
  async createCart() {
    const c = new Cart({ products: [] });
    return await c.save();
  }

  async getById(id) {
    return await Cart.findById(id).populate('products.product').lean();
  }

  async addProduct(cid, pid) {
    const cart = await Cart.findById(cid);
    if (!cart) return null;
    const item = cart.products.find(p => p.product.toString() === pid);
    if (item) item.quantity += 1;
    else cart.products.push({ product: pid, quantity: 1 });
    await cart.save();
    return await Cart.findById(cid).populate('products.product');
  }

  async removeProduct(cid, pid) {
    const cart = await Cart.findById(cid);
    if (!cart) return null;
    cart.products = cart.products.filter(p => p.product.toString() !== pid);
    await cart.save();
    return await Cart.findById(cid).populate('products.product');
  }

  async updateProducts(cid, productsArray = []) {
    const cart = await Cart.findById(cid);
    if (!cart) return null;
    cart.products = Array.isArray(productsArray) ? productsArray : [];
    await cart.save();
    return await Cart.findById(cid).populate('products.product');
  }

  async updateProductQuantity(cid, pid, quantity) {
    const cart = await Cart.findById(cid);
    if (!cart) return null;
    const item = cart.products.find(p => p.product.toString() === pid);
    if (!item) return null;
    item.quantity = quantity;
    await cart.save();
    return await Cart.findById(cid).populate('products.product');
  }

  async clearCart(cid) {
    const cart = await Cart.findById(cid);
    if (!cart) return null;
    cart.products = [];
    await cart.save();
    return cart;
  }
}

export default CartManager;




