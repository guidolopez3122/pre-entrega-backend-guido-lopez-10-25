// Configuración global para tests
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Cargar variables de entorno para tests
dotenv.config({ path: path.join(__dirname, '../../.env') });

// Configurar variables de entorno por defecto para testing
process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = process.env.JWT_SECRET || 'test-secret-key';
process.env.MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/ecommerce_test';
process.env.PORT = process.env.PORT || '8080';

// Configuración global para tests
// NOTA: jest.mock no funciona en setupFiles con ESM.
// El mock de winston se realiza en cada archivo de test que lo necesite.

