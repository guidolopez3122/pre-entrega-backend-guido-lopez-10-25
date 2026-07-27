import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

const petSchema = new mongoose.Schema({
  name: { type: String, required: true },
  species: { type: String, required: true, enum: ['dog', 'cat', 'bird', 'rabbit', 'hamster', 'other'] },
  breed: { type: String, default: '' },
  age: { type: Number, required: true, min: 0 },
  weight: { type: Number, min: 0 },
  color: { type: String, default: '' },
  description: { type: String, default: '' },
  status: { type: String, enum: ['available', 'adopted', 'pending', 'unavailable'], default: 'available' },
  medicalNotes: { type: String, default: '' },
  vaccinated: { type: Boolean, default: false },
  sterilized: { type: Boolean, default: false },
  images: { type: [String], default: [] },
  adoptedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  adoptedAt: { type: Date, default: null }
}, {
  timestamps: true
});

petSchema.plugin(mongoosePaginate);

const Pet = mongoose.model('Pet', petSchema);
export default Pet;
