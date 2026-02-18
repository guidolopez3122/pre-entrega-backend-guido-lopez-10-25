import express from 'express';
import { engine } from 'express-handlebars';
import path from 'path';
import { fileURLToPath } from 'url';
import viewsRouter from './routes/views.router.js';
import cartsRouter from './routes/api/carts.routes.js';
import productsRouter from './routes/api/products.routes.js';
import sessionsRouter from './routes/api/sessions.js';
import connectDB from './db/mongo.js';
import { eqHelper } from './utils.js';
import passport from 'passport';
import './middleware/passport.js';
import helmet from 'helmet';
import cors from 'cors';
import compression from 'compression';
import winston from 'winston';
import { Server } from 'socket.io';
import http from 'http';
import config from './config/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const server = http.createServer(app);
const io = new Server(server);
const PORT = config.PORT;


const logger = winston.createLogger({
  level: config.NODE_ENV === 'production' ? 'info' : 'debug',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      )
    }),
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' })
  ]
});


connectDB();

app.use(helmet());
app.use(cors());
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.use(passport.initialize());

app.engine('handlebars', engine({ helpers: { eq: eqHelper } }));
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));

app.use('/', viewsRouter);
app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);
app.use('/api/sessions', sessionsRouter);

app.use((err, req, res, next) => {
  logger.error(err.message);
  res.status(500).json({ error: 'Internal Server Error' });
});

io.on('connection', (socket) => {
  logger.info('Usuario conectado via Socket.io');
});

server.listen(PORT, () => {
  logger.info(`✅ Servidor escuchando en http://localhost:${PORT}`);
});
