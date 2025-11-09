import express from 'express';
import Product from '../models/product.model.js';
import Cart from '../models/cart.js';

const router = express.Router();

router.get(['/', '/products'], async (req, res) => {
  try {
    const { limit = 10, page = 1, sort, query } = req.query;

    const filter = {};
    if (query) {
      if (query === 'true' || query === 'false') {
        filter.status = query === 'true';
      } else {
        filter.category = query;
      }
    }

    const sortOption = sort === 'asc' ? { price: 1 } : sort === 'desc' ? { price: -1 } : {};

    const result = await Product.paginate(filter, { page, limit, sort: sortOption, lean: true });

    let cart = await Cart.findOne().populate('products.product').lean();
    if (!cart) cart = await Cart.create({ products: [] });

    const totalCart = cart.products.reduce((acc, p) => acc + p.product.price * p.quantity, 0);

    res.render('home', {
      title: 'Tienda Online',
      products: result.docs,
      totalPages: result.totalPages,
      prevPage: result.prevPage,
      nextPage: result.nextPage,
      currentPage: result.page,
      hasPrevPage: result.hasPrevPage,
      hasNextPage: result.hasNextPage,
      sort,
      query,
      cartId: cart._id,
      cartProducts: cart.products,
      totalCart
    });
  } catch (error) {
    console.error('Error al obtener productos:', error);
    res.status(500).send('Error al cargar los productos');
  }
});

router.get('/products/:pid', async (req, res) => {
  try {
    const { pid } = req.params;
    const product = await Product.findById(pid).lean();
    if (!product) return res.status(404).send('Producto no encontrado');

    const cart = await Cart.findOne().lean();

    res.render('product', { title: product.title, product, cartId: cart ? cart._id : null });
  } catch (error) {
    console.error('Error al obtener el producto:', error);
    res.status(500).send('Error al cargar el producto');
  }
});

router.get('/carts/:cid', async (req, res) => {
  try {
    const { cid } = req.params;
    const cart = await Cart.findById(cid).populate('products.product').lean();
    if (!cart) return res.status(404).send('Carrito no encontrado');

    res.render('cart', { title: 'Carrito de compras', cart });
  } catch (error) {
    console.error('Error al obtener el carrito:', error);
    res.status(500).send('Error al cargar el carrito');
  }
});

export default router;

