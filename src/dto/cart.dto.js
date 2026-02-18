export class CartDTO {
  constructor(cart) {
    this.id = cart._id;
    this.products = cart.products ? cart.products.map(item => ({
      product: item.product ? {
        id: item.product._id,
        title: item.product.title,
        price: item.product.price,
        stock: item.product.stock,
        category: item.product.category
      } : item.product,
      quantity: item.quantity
    })) : [];
  }
}
