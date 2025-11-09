import Product from '../models/product.model.js';

class ProductManager {
  async getProducts({ limit = 10, page = 1, sort, query } = {}) {
    const options = {
      limit: parseInt(limit) || 10,
      page: parseInt(page) || 1,
      lean: true
    };
    if (sort === 'asc') options.sort = { price: 1 };
    if (sort === 'desc') options.sort = { price: -1 };

    const filter = {};
    if (query !== undefined && query !== '') {
      const q = query.toString().toLowerCase();
      if (q === 'true' || q === 'false') {
        filter.status = q === 'true';
      } else {
        filter.category = query;
      }
    }

    return await Product.paginate(filter, options);
  }

  async getById(id) {
    return await Product.findById(id).lean();
  }

  async create(data) {
    const p = new Product(data);
    return await p.save();
  }

  async update(id, data) {
    return await Product.findByIdAndUpdate(id, data, { new: true });
  }

  async delete(id) {
    return await Product.findByIdAndDelete(id);
  }
}

export default ProductManager;


