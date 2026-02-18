import ProductManager from '../dao/ProductManager.js';
import { ProductDTO } from '../dto/product.dto.js';

class ProductRepository {
  constructor() {
    this.dao = new ProductManager();
  }

  async getAll(options = {}) {
    const result = await this.dao.getProducts(options);
    if (result.docs) {
      result.docs = result.docs.map(product => new ProductDTO(product));
    }
    return result;
  }

  async getById(id) {
    const product = await this.dao.getById(id);
    return product ? new ProductDTO(product) : null;
  }

  async getRawById(id) {
    return await this.dao.getById(id);
  }

  async create(data) {
    const product = await this.dao.create(data);
    return new ProductDTO(product);
  }

  async update(id, data) {
    const product = await this.dao.update(id, data);
    return product ? new ProductDTO(product) : null;
  }

  async delete(id) {
    return await this.dao.delete(id);
  }

  async paginate(filter, options) {
    return await this.dao.getProducts({ ...options, ...filter });
  }
}

export default new ProductRepository();
