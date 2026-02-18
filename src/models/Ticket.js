import mongoose from 'mongoose';

const ticketSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true },
  purchase_datetime: { type: Date, required: true },
  amount: { type: Number, required: true },
  purchaser: { type: String, required: true },
  products: [{
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    title: String,
    price: Number,
    quantity: Number
  }]
});

export default mongoose.model('Ticket', ticketSchema);
