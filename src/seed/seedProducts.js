import mongoose from 'mongoose';
import Product from '../models/product.model.js';

const MONGO_URL =
  'mongodb+srv://guido_lopez_db_user:epnShknUzHAW2m5v@cluster0.ifw7swu.mongodb.net/ecommerce?retryWrites=true&w=majority';

const products = [
  { title: "Zapatilla Jordan 1", description: "Zapatilla NBA", code: "P001", price: 250, stock: 10, category: "zapatillas", thumbnails: [], status: true },
  { title: "Zapatilla LeBron 20", description: "Zapatilla NBA", code: "P002", price: 270, stock: 8, category: "zapatillas", thumbnails: [], status: true },
  { title: "Remera Lakers", description: "Remera NBA", code: "P003", price: 50, stock: 15, category: "remeras", thumbnails: [], status: true },
  { title: "Remera Golden State", description: "Remera NBA", code: "P004", price: 55, stock: 12, category: "remeras", thumbnails: [], status: true },
  { title: "Gorra Yankees", description: "Gorra MLB", code: "P005", price: 30, stock: 20, category: "gorras", thumbnails: [], status: true },
  { title: "Gorra Red Sox", description: "Gorra MLB", code: "P006", price: 30, stock: 18, category: "gorras", thumbnails: [], status: true },
  { title: "Campera River Plate", description: "Campera fútbol", code: "P007", price: 120, stock: 5, category: "camperas", thumbnails: [], status: true },
  { title: "Campera Boca Juniors", description: "Campera fútbol", code: "P008", price: 125, stock: 6, category: "camperas", thumbnails: [], status: true },
  { title: "Buzo Warriors", description: "Buzo NBA", code: "P009", price: 80, stock: 8, category: "buzos", thumbnails: [], status: true },
  { title: "Buzo Celtics", description: "Buzo NBA", code: "P010", price: 85, stock: 7, category: "buzos", thumbnails: [], status: true },
  { title: "Zapatilla Adidas Futbol", description: "Zapatilla fútbol", code: "P011", price: 90, stock: 12, category: "zapatillas", thumbnails: [], status: true },
  { title: "Zapatilla Nike Futbol", description: "Zapatilla fútbol", code: "P012", price: 95, stock: 10, category: "zapatillas", thumbnails: [], status: true },
  { title: "Remera Barcelona", description: "Remera fútbol", code: "P013", price: 60, stock: 14, category: "remeras", thumbnails: [], status: true },
  { title: "Remera Real Madrid", description: "Remera fútbol", code: "P014", price: 60, stock: 14, category: "remeras", thumbnails: [], status: true },
  { title: "Gorra PSG", description: "Gorra fútbol", code: "P015", price: 28, stock: 20, category: "gorras", thumbnails: [], status: true },
  { title: "Gorra Manchester United", description: "Gorra fútbol", code: "P016", price: 28, stock: 18, category: "gorras", thumbnails: [], status: true },
  { title: "Campera Chicago Bulls", description: "Campera NBA", code: "P017", price: 130, stock: 4, category: "camperas", thumbnails: [], status: true },
  { title: "Campera Brooklyn Nets", description: "Campera NBA", code: "P018", price: 135, stock: 5, category: "camperas", thumbnails: [], status: true },
  { title: "Buzo Yankees", description: "Buzo MLB", code: "P019", price: 75, stock: 10, category: "buzos", thumbnails: [], status: true },
  { title: "Buzo Red Sox", description: "Buzo MLB", code: "P020", price: 75, stock: 9, category: "buzos", thumbnails: [], status: true },
  { title: "Zapatilla NFL", description: "Zapatilla NFL", code: "P021", price: 110, stock: 12, category: "zapatillas", thumbnails: [], status: true },
  { title: "Remera NFL", description: "Remera NFL", code: "P022", price: 55, stock: 15, category: "remeras", thumbnails: [], status: true },
  { title: "Gorra NFL", description: "Gorra NFL", code: "P023", price: 25, stock: 18, category: "gorras", thumbnails: [], status: true },
  { title: "Campera NFL", description: "Campera NFL", code: "P024", price: 120, stock: 6, category: "camperas", thumbnails: [], status: true },
  { title: "Buzo NFL", description: "Buzo NFL", code: "P025", price: 80, stock: 7, category: "buzos", thumbnails: [], status: true },
  { title: "Zapatilla Air Max", description: "Zapatilla NBA", code: "P026", price: 260, stock: 10, category: "zapatillas", thumbnails: [], status: true },
  { title: "Zapatilla KD 14", description: "Zapatilla NBA", code: "P027", price: 240, stock: 9, category: "zapatillas", thumbnails: [], status: true },
  { title: "Remera Bulls", description: "Remera NBA", code: "P028", price: 55, stock: 13, category: "remeras", thumbnails: [], status: true },
  { title: "Remera Nets", description: "Remera NBA", code: "P029", price: 50, stock: 15, category: "remeras", thumbnails: [], status: true },
  { title: "Gorra Dodgers", description: "Gorra MLB", code: "P030", price: 28, stock: 20, category: "gorras", thumbnails: [], status: true },
  { title: "Gorra Cubs", description: "Gorra MLB", code: "P031", price: 28, stock: 18, category: "gorras", thumbnails: [], status: true },
  { title: "Campera Independiente", description: "Campera fútbol", code: "P032", price: 125, stock: 6, category: "camperas", thumbnails: [], status: true },
  { title: "Campera Racing", description: "Campera fútbol", code: "P033", price: 130, stock: 5, category: "camperas", thumbnails: [], status: true },
  { title: "Buzo Heat", description: "Buzo NBA", code: "P034", price: 85, stock: 8, category: "buzos", thumbnails: [], status: true },
  { title: "Buzo Spurs", description: "Buzo NBA", code: "P035", price: 80, stock: 7, category: "buzos", thumbnails: [], status: true },
  { title: "Zapatilla Puma Futbol", description: "Zapatilla fútbol", code: "P036", price: 95, stock: 12, category: "zapatillas", thumbnails: [], status: true },
  { title: "Zapatilla Nike Mercurial", description: "Zapatilla fútbol", code: "P037", price: 100, stock: 10, category: "zapatillas", thumbnails: [], status: true },
  { title: "Remera PSG", description: "Remera fútbol", code: "P038", price: 60, stock: 14, category: "remeras", thumbnails: [], status: true },
  { title: "Remera Juventus", description: "Remera fútbol", code: "P039", price: 60, stock: 14, category: "remeras", thumbnails: [], status: true },
  { title: "Gorra Barcelona", description: "Gorra fútbol", code: "P040", price: 25, stock: 18, category: "gorras", thumbnails: [], status: true },
  { title: "Gorra Real Madrid", description: "Gorra fútbol", code: "P041", price: 25, stock: 18, category: "gorras", thumbnails: [], status: true },
  { title: "Campera Miami Heat", description: "Campera NBA", code: "P042", price: 135, stock: 5, category: "camperas", thumbnails: [], status: true },
  { title: "Campera Boston Celtics", description: "Campera NBA", code: "P043", price: 130, stock: 4, category: "camperas", thumbnails: [], status: true },
  { title: "Buzo Cubs", description: "Buzo MLB", code: "P044", price: 75, stock: 10, category: "buzos", thumbnails: [], status: true },
  { title: "Buzo Dodgers", description: "Buzo MLB", code: "P045", price: 75, stock: 9, category: "buzos", thumbnails: [], status: true },
  { title: "Zapatilla NFL Team", description: "Zapatilla NFL", code: "P046", price: 110, stock: 12, category: "zapatillas", thumbnails: [], status: true },
  { title: "Remera NFL Team", description: "Remera NFL", code: "P047", price: 55, stock: 15, category: "remeras", thumbnails: [], status: true },
  { title: "Gorra NFL Team", description: "Gorra NFL", code: "P048", price: 25, stock: 18, category: "gorras", thumbnails: [], status: true },
  { title: "Campera NFL Team", description: "Campera NFL", code: "P049", price: 120, stock: 6, category: "camperas", thumbnails: [], status: true },
  { title: "Buzo NFL Team", description: "Buzo NFL", code: "P050", price: 80, stock: 7, category: "buzos", thumbnails: [], status: true }
];

const seedDB = async () => {
  try {
    console.log('⏳ Conectando a MongoDB...');
    await mongoose.connect(MONGO_URL);

    console.log('🧹 Eliminando productos existentes...');
    await Product.deleteMany();

    console.log('🌱 Insertando nuevos productos...');
    await Product.insertMany(products);

    console.log('✅ Base de datos inicializada correctamente.');
  } catch (error) {
    console.error('❌ Error al inicializar la base de datos:', error.message);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Conexión cerrada.');
  }
};

seedDB();

