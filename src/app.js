import express from 'express';
import { engine } from 'express-handlebars';
import path from 'path';
import { fileURLToPath } from 'url';
import viewsRouter from './routes/views.router.js';
import cartsRouter from './routes/api/carts.routes.js';
import productsRouter from './routes/api/products.routes.js';
import sessionsRouter from './routes/api/sessions.js';
import adoptionRouter from './routes/api/adoption.router.js';
import petsRouter from './routes/api/pets.routes.js';
import usersRouter from './routes/api/users.router.js';
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
app.use('/api/adoptions', adoptionRouter);
app.use('/api/pets', petsRouter);
app.use('/api/users', usersRouter);

app.use((err, req, res, next) => {
  logger.error(err.message);
  res.status(500).json({ error: 'Internal Server Error' });
});

export { app, logger };

export async function startServer() {
  await connectDB();
  const server = http.createServer(app);
  const io = new Server(server);
  io.on('connection', (socket) => {
    logger.info('Usuario conectado via Socket.io');
  });
  const PORT = config.PORT;
  server.listen(PORT, () => {
    logger.info(`✅ Servidor escuchando en http://localhost:${PORT}`);
  });
  return { server, io };
}

const __main = fileURLToPath(import.meta.url);
if (process.argv[1] === __main || process.argv[1]?.endsWith('src/app.js')) {
  startServer();
}
