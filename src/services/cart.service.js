import cartRepository from '../repositories/cart.repository.js';
import productService from './product.service.js';
import ticketService from './ticket.service.js';
import { CartDTO } from '../dto/cart.dto.js';

export class CartService {
  async getCartById(cartId) {
    try {
      const cart = await cartRepository.getById(cartId);
      if (!cart) {
        throw new Error('Carrito no encontrado');
      }
      return cart;
    } catch (error) {
      throw new Error(`Error al obtener carrito: ${error.message}`);
    }
  }

  async createCart(userId = null) {
    try {
      const cartData = userId ? { user: userId, products: [] } : { products: [] };
      const cart = await cartRepository.create(cartData);
      return cart;
    } catch (error) {
      throw new Error(`Error al crear carrito: ${error.message}`);
    }
  }

  async addProductToCart(cartId, productId, quantity = 1) {
    try {
      // Verificar que el producto existe y tiene stock
      const hasStock = await productService.checkStock(productId, quantity);
      if (!hasStock) {
        throw new Error('Stock insuficiente para este producto');
      }

      const cart = await cartRepository.getRawById(cartId);
      if (!cart) {
        throw new Error('Carrito no encontrado');
      }

      const existingProduct = cart.products.find(
        p => p.product.toString() === productId
      );

      if (existingProduct) {
        // Verificar stock para la nueva cantidad total
        const newQuantity = existingProduct.quantity + quantity;
        const hasStockForNewQty = await productService.checkStock(productId, newQuantity);
        if (!hasStockForNewQty) {
          throw new Error('Stock insuficiente para la cantidad solicitada');
        }
        existingProduct.quantity = newQuantity;
      } else {
        cart.products.push({ product: productId, quantity });
      }

      await cartRepository.update(cartId, { products: cart.products });
      return await cartRepository.getById(cartId);
    } catch (error) {
      throw new Error(`Error al agregar producto: ${error.message}`);
    }
  }

  async removeProductFromCart(cartId, productId) {
    try {
      const cart = await cartRepository.getRawById(cartId);
      if (!cart) {
        throw new Error('Carrito no encontrado');
      }

      cart.products = cart.products.filter(
        p => p.product.toString() !== productId
      );

      await cartRepository.update(cartId, { products: cart.products });
      return await cartRepository.getById(cartId);
    } catch (error) {
      throw new Error(`Error al eliminar producto: ${error.message}`);
    }
  }

  async updateProductQuantity(cartId, productId, quantity) {
    try {
      if (quantity < 1) {
        throw new Error('La cantidad debe ser al menos 1');
      }

      // Verificar stock
      const hasStock = await productService.checkStock(productId, quantity);
      if (!hasStock) {
        throw new Error('Stock insuficiente para esta cantidad');
      }

      const cart = await cartRepository.getRawById(cartId);
      if (!cart) {
        throw new Error('Carrito no encontrado');
      }

      const product = cart.products.find(
        p => p.product.toString() === productId
      );

      if (!product) {
        throw new Error('Producto no encontrado en el carrito');
      }

      product.quantity = quantity;
      await cartRepository.update(cartId, { products: cart.products });
      return await cartRepository.getById(cartId);
    } catch (error) {
      throw new Error(`Error al actualizar cantidad: ${error.message}`);
    }
  }

  async clearCart(cartId) {
    try {
      const cart = await cartRepository.clearCart(cartId);
      if (!cart) {
        throw new Error('Carrito no encontrado');
      }
      return cart;
    } catch (error) {
      throw new Error(`Error al limpiar carrito: ${error.message}`);
    }
  }

  async purchaseCart(cartId, userId) {
    try {
      const cart = await cartRepository.getRawById(cartId);
      if (!cart || cart.products.length === 0) {
        throw new Error('Carrito vacío o no encontrado');
      }

      const productsNotPurchased = [];
      const productsPurchased = [];

      // Procesar cada producto del carrito
      for (const item of cart.products) {
        try {
          // Verificar stock y actualizar
          await productService.updateStock(item.product.toString(), item.quantity);
          
          // Obtener datos del producto para el ticket
          const productData = await productService.getProductById(item.product.toString());
          
          productsPurchased.push({
            product: item.product,
            title: productData.title,
            price: productData.price,
            quantity: item.quantity
          });
        } catch (error) {
          productsNotPurchased.push({
            product: item.product,
            reason: error.message
          });
        }
      }

      // Si no se pudo comprar ningún producto
      if (productsPurchased.length === 0) {
        return {
          status: 'error',
          message: 'No se pudieron comprar productos por falta de stock',
          productsNotPurchased
        };
      }

      // Calcular monto total
      const totalAmount = productsPurchased.reduce(
        (acc, p) => acc + (p.price * p.quantity), 
        0
      );

      // Crear ticket
      const ticket = await ticketService.createTicket({
        amount: totalAmount,
        purchaser: userId,
        products: productsPurchased
      });

      // Actualizar carrito con productos no comprados
      const remainingProducts = cart.products.filter(p => 
        productsNotPurchased.some(np => np.product.toString() === p.product.toString())
      );

      await cartRepository.update(cartId, { products: remainingProducts });

      return {
        status: 'success',
        message: productsNotPurchased.length > 0 
          ? 'Compra parcial completada' 
          : 'Compra completada exitosamente',
        ticket,
        productsNotPurchased: productsNotPurchased.length > 0 ? productsNotPurchased : undefined
      };
    } catch (error) {
      throw new Error(`Error en la compra: ${error.message}`);
    }
  }
}

// Exportar instancia para mantener compatibilidad con código existente
export default new CartService();

// Mantener función exportada para compatibilidad
export const purchaseCart = async (cartId, userId) => {
  return await new CartService().purchaseCart(cartId, userId);
};
