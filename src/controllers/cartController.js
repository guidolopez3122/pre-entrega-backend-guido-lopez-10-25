import CartManager from '../dao/CartManager.js';

const cm = new CartManager();

export const createCart = async (req, res) => {
  try {
    const c = await cm.createCart();
    res.status(201).json(c);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getCart = async (req, res) => {
  try {
    const cart = await cm.getById(req.params.cid);
    if (!cart) return res.status(404).json({ message: 'Carrito no encontrado' });
    res.json(cart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const addProductToCart = async (req, res) => {
  try {
    const updated = await cm.addProduct(req.params.cid, req.params.pid);
    if (!updated) return res.status(404).json({ message: 'Carrito o producto no encontrado' });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteProductFromCart = async (req, res) => {
  try {
    const updated = await cm.removeProduct(req.params.cid, req.params.pid);
    if (!updated) return res.status(404).json({ message: 'Carrito o producto no encontrado' });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateCartProducts = async (req, res) => {
  try {
    const updated = await cm.updateProducts(req.params.cid, req.body.products);
    if (!updated) return res.status(404).json({ message: 'Carrito no encontrado' });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateProductQuantity = async (req, res) => {
  try {
    const { quantity } = req.body;
    const updated = await cm.updateProductQuantity(req.params.cid, req.params.pid, quantity);
    if (!updated) return res.status(404).json({ message: 'Carrito o producto no encontrado' });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const clearCart = async (req, res) => {
  try {
    const cleared = await cm.clearCart(req.params.cid);
    if (!cleared) return res.status(404).json({ message: 'Carrito no encontrado' });
    res.json(cleared);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};







