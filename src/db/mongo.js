import mongoose from 'mongoose';
import winston from 'winston';
import config from '../config/index.js';

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' })
  ]
});

const connectDB = async () => {
  try {
    await mongoose.connect(config.MONGODB_URI);
    logger.info('✅ MongoDB conectado correctamente');
  } catch (error) {
    logger.error('❌ Error al conectar a MongoDB:', error);
    process.exit(1);
  }
};

export default connectDB;
