import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Cargar variables de entorno
dotenv.config({ path: path.join(__dirname, '../../.env') });

const config = {
  // Servidor
  PORT: process.env.PORT || 8080,
  NODE_ENV: process.env.NODE_ENV || 'development',
  
  // Base de datos
  MONGODB_URI: process.env.MONGODB_URI || process.env.MONGO_URI || 'mongodb://localhost:27017/ecommerce',

  
  // JWT
  JWT_SECRET: process.env.JWT_SECRET || 'secret',
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '1h',
  
  // Email
  EMAIL_USER: process.env.EMAIL_USER,
  EMAIL_PASS: process.env.EMAIL_PASS,
  EMAIL_SERVICE: process.env.EMAIL_SERVICE || 'gmail',
  
  // Frontend URL
  FRONTEND_URL: process.env.FRONTEND_URL || 'http://localhost:8080',
  
  // Reset Password
  RESET_TOKEN_EXPIRY: process.env.RESET_TOKEN_EXPIRY || '1h',
  
  // Validación de configuración requerida
  validate: () => {
    const required = ['JWT_SECRET', 'EMAIL_USER', 'EMAIL_PASS'];
    const missing = required.filter(key => !process.env[key]);
    
    if (missing.length > 0) {
      console.warn(`⚠️  Variables de entorno faltantes: ${missing.join(', ')}`);
      console.warn('Usando valores por defecto para desarrollo');
    }
  }
};

// Validar configuración al cargar
config.validate();

export default config;
