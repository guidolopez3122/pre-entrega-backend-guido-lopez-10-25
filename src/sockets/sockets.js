import Product from '../models/product.model.js';

export default (io) => {
  io.on('connection', async (socket) => {
    const products = await Product.find().lean();
    socket.emit('updateProducts', products);

    socket.on('addProduct', async (data) => {
      await Product.create(data);
      io.emit('updateProducts', await Product.find().lean());
    });

    socket.on('deleteProduct', async (id) => {
      await Product.findByIdAndDelete(id);
      io.emit('updateProducts', await Product.find().lean());
    });
  });
};


