import mongoose from 'mongoose';

const MONGO_URL = 'mongodb+srv://guido_lopez_db_user:epnShknUzHAW2m5v@cluster0.ifw7swu.mongodb.net/ecommerce?retryWrites=true&w=majority';

const connectDB = async () => {
  try {
    await mongoose.connect(MONGO_URL);
    console.log('🟢 MongoDB conectado correctamente');
  } catch (error) {
    console.error('❌ Error al conectar a MongoDB:', error);
    process.exit(1);
  }
};

export default connectDB;











