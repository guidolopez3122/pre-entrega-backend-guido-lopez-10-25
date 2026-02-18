import productService from '../services/product.service.js';
import { body, validationResult } from 'express-validator';


export const validateProduct = [
  body('title').isString().notEmpty().withMessage('Nombre es requerido'),
  body('price').isNumeric().withMessage('Precio debe ser numérico'),
  body('stock').isNumeric().withMessage('Stock debe ser numérico'),
];

export const getProducts = async (req, res) => {
  try {
    const { limit = 10, page = 1, sort, query } = req.query;
    const options = { 
      limit: parseInt(limit), 
      page: parseInt(page), 
      sort, 
      query 
    };
    const result = await productService.getAllProducts(options);
    const baseUrl = `${req.protocol}://${req.get('host')}${req.baseUrl}`;
    res.json({
      ...result,
      prevLink: result.hasPrevPage ? `${baseUrl}?page=${result.prevPage}&limit=${limit}${sort ? `&sort=${sort}` : ''}${query ? `&query=${query}` : ''}` : null,
      nextLink: result.hasNextPage ? `${baseUrl}?page=${result.nextPage}&limit=${limit}${sort ? `&sort=${sort}` : ''}${query ? `&query=${query}` : ''}` : null
    });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};


export const getProductById = async (req, res) => {
  try {
    const prod = await productService.getProductById(req.params.pid);
    res.json(prod);
  } catch (error) {
    res.status(404).json({ status: 'error', message: error.message });
  }
};


export const createProduct = [
  ...validateProduct,
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    try {
      const created = await productService.createProduct(req.body);
      res.status(201).json(created);
    } catch (error) {
      res.status(400).json({ status: 'error', message: error.message });
    }
  }
];


export const updateProduct = [
  ...validateProduct,
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    try {
      const updated = await productService.updateProduct(req.params.pid, req.body);
      res.json(updated);
    } catch (error) {
      res.status(400).json({ status: 'error', message: error.message });
    }
  }
];


export const deleteProduct = async (req, res) => {
  try {
    const result = await productService.deleteProduct(req.params.pid);
    res.json({ status: 'success', message: result.message });
  } catch (error) {
    res.status(404).json({ status: 'error', message: error.message });
  }
};
