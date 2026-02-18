import CartManager from '../dao/CartManager.js';
import { CartDTO } from '../dto/cart.dto.js';

class CartRepository {
  constructor() {
    this.dao = new CartManager();
  }

  async getById(id) {
    const cart = await this.dao.getById(id);
    return cart ? new CartDTO(cart) : null;
  }

  async getRawById(id) {
    return await this.dao.getById(id);
  }

  async getByUserId(userId) {
    const cart = await this.dao.getByUserId(userId);
    return cart ? new CartDTO(cart) : null;
  }

  async create(data) {
    const cart = await this.dao.createCart(data);
    return new CartDTO(cart);
  }

  async update(id, data) {
    const cart = await this.dao.updateProducts(id, data.products);
    return cart ? new CartDTO(cart) : null;
  }

  async delete(id) {
    return await this.dao.clearCart(id);
  }

  async addProduct(cid, pid) {
    const cart = await this.dao.addProduct(cid, pid);
    return cart ? new CartDTO(cart) : null;
  }

  async removeProduct(cid, pid) {
    const cart = await this.dao.removeProduct(cid, pid);
    return cart ? new CartDTO(cart) : null;
  }

  async updateProductQuantity(cid, pid, quantity) {
    const cart = await this.dao.updateProductQuantity(cid, pid, quantity);
    return cart ? new CartDTO(cart) : null;
  }

  async clearCart(cid) {
    const cart = await this.dao.clearCart(cid);
    return cart ? new CartDTO(cart) : null;
  }
}

export default new CartRepository();
