import productRepository from '../repositories/product.repository.js';
import { ProductDTO } from '../dto/product.dto.js';

export class ProductService {
  async getAllProducts(options = {}) {
    try {
      const result = await productRepository.getAll(options);
      return {
        status: 'success',
        payload: result.docs || [],
        totalPages: result.totalPages || 1,
        prevPage: result.prevPage || null,
        nextPage: result.nextPage || null,
        page: result.page || 1,
        hasPrevPage: result.hasPrevPage || false,
        hasNextPage: result.hasNextPage || false
      };
    } catch (error) {
      throw new Error(`Error al obtener productos: ${error.message}`);
    }
  }

  async getProductById(id) {
    try {
      const product = await productRepository.getById(id);
      if (!product) {
        throw new Error('Producto no encontrado');
      }
      return product;
    } catch (error) {
      throw new Error(`Error al obtener producto: ${error.message}`);
    }
  }

  async createProduct(productData) {
    try {
      // Validaciones de negocio
      if (!productData.title || !productData.price) {
        throw new Error('Título y precio son requeridos');
      }

      if (productData.stock < 0) {
        throw new Error('El stock no puede ser negativo');
      }

      if (productData.price < 0) {
        throw new Error('El precio no puede ser negativo');
      }

      const product = await productRepository.create(productData);
      return product;
    } catch (error) {
      throw new Error(`Error al crear producto: ${error.message}`);
    }
  }

  async updateProduct(id, productData) {
    try {
      const existingProduct = await productRepository.getRawById(id);
      if (!existingProduct) {
        throw new Error('Producto no encontrado');
      }

      // Validaciones de negocio
      if (productData.stock !== undefined && productData.stock < 0) {
        throw new Error('El stock no puede ser negativo');
      }

      if (productData.price !== undefined && productData.price < 0) {
        throw new Error('El precio no puede ser negativo');
      }

      const product = await productRepository.update(id, productData);
      return product;
    } catch (error) {
      throw new Error(`Error al actualizar producto: ${error.message}`);
    }
  }

  async deleteProduct(id) {
    try {
      const existingProduct = await productRepository.getRawById(id);
      if (!existingProduct) {
        throw new Error('Producto no encontrado');
      }

      await productRepository.delete(id);
      return { message: 'Producto eliminado exitosamente' };
    } catch (error) {
      throw new Error(`Error al eliminar producto: ${error.message}`);
    }
  }

  async checkStock(productId, quantity) {
    try {
      const product = await productRepository.getRawById(productId);
      if (!product) {
        throw new Error('Producto no encontrado');
      }
      return product.stock >= quantity;
    } catch (error) {
      throw new Error(`Error al verificar stock: ${error.message}`);
    }
  }

  async updateStock(productId, quantity) {
    try {
      const product = await productRepository.getRawById(productId);
      if (!product) {
        throw new Error('Producto no encontrado');
      }

      const newStock = product.stock - quantity;
      if (newStock < 0) {
        throw new Error('Stock insuficiente');
      }

      await productRepository.update(productId, { stock: newStock });
      return { stock: newStock };
    } catch (error) {
      throw new Error(`Error al actualizar stock: ${error.message}`);
    }
  }
}

export default new ProductService();
