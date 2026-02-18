import UserDAO from '../dao/user.dao.js';
import ProductManager from '../dao/ProductManager.js';
import CartManager from '../dao/CartManager.js';

// Factory Pattern para crear instancias de DAOs
// Esto permite cambiar fácilmente entre diferentes implementaciones de DAO
// (por ejemplo, MongoDB, MySQL, FileSystem, etc.)

class DAOFactory {
  constructor() {
    this.daos = {};
  }

  // Obtener instancia de UserDAO
  getUserDAO() {
    if (!this.daos.user) {
      this.daos.user = UserDAO;
    }
    return this.daos.user;
  }

  // Obtener instancia de ProductDAO
  getProductDAO() {
    if (!this.daos.product) {
      this.daos.product = new ProductManager();
    }
    return this.daos.product;
  }

  // Obtener instancia de CartDAO
  getCartDAO() {
    if (!this.daos.cart) {
      this.daos.cart = new CartManager();
    }
    return this.daos.cart;
  }

  // Método para resetear instancias (útil para testing)
  reset() {
    this.daos = {};
  }

  // Método para inyectar mocks (útil para testing)
  injectDAO(type, instance) {
    this.daos[type] = instance;
  }
}

// Exportar singleton
export default new DAOFactory();
