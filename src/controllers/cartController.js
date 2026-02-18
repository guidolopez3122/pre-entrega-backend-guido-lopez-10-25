import cartService from '../services/cart.service.js';


export const createCart = async (req, res) => {
  try {
    const userId = req.user ? req.user.id : null;
    const cart = await cartService.createCart(userId);
    res.status(201).json(cart);
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};


export const getCart = async (req, res) => {
  try {
    const cart = await cartService.getCartById(req.params.cid);
    res.json(cart);
  } catch (error) {
    res.status(404).json({ status: 'error', message: error.message });
  }
};


export const addProductToCart = async (req, res) => {
  try {
    const { cid, pid } = req.params;
    const quantity = req.body.quantity || 1;
    const cart = await cartService.addProductToCart(cid, pid, quantity);
    res.json(cart);
  } catch (error) {
    res.status(400).json({ status: 'error', message: error.message });
  }
};


export const deleteProductFromCart = async (req, res) => {
  try {
    const cart = await cartService.removeProductFromCart(req.params.cid, req.params.pid);
    res.json(cart);
  } catch (error) {
    res.status(404).json({ status: 'error', message: error.message });
  }
};


export const updateCartProducts = async (req, res) => {
  try {
    const cart = await cartService.getCartById(req.params.cid);
    // Actualizar todos los productos del carrito
    for (const item of req.body.products || []) {
      await cartService.updateProductQuantity(req.params.cid, item.product, item.quantity);
    }
    const updated = await cartService.getCartById(req.params.cid);
    res.json(updated);
  } catch (error) {
    res.status(400).json({ status: 'error', message: error.message });
  }
};


export const updateProductQuantity = async (req, res) => {
  try {
    const cart = await cartService.updateProductQuantity(
      req.params.cid, 
      req.params.pid, 
      req.body.quantity
    );
    res.json(cart);
  } catch (error) {
    res.status(400).json({ status: 'error', message: error.message });
  }
};


export const clearCart = async (req, res) => {
  try {
    const cart = await cartService.clearCart(req.params.cid);
    res.json(cart);
  } catch (error) {
    res.status(404).json({ status: 'error', message: error.message });
  }
};


export const purchaseCartController = async (req, res) => {
  try {
    const { cid } = req.params;
    const userId = req.user.id;
    const result = await cartService.purchaseCart(cid, userId);
    res.json(result);
  } catch (error) {
    res.status(400).json({ status: 'error', message: error.message });
  }
};
