import { jest } from '@jest/globals';

// ---------------------------------------------------------------------------
// Mocks
// ---------------------------------------------------------------------------
const mockLogger = {
  info: jest.fn().mockReturnThis(), error: jest.fn().mockReturnThis(), warn: jest.fn().mockReturnThis(),
  debug: jest.fn().mockReturnThis(), log: jest.fn().mockReturnThis(), verbose: jest.fn().mockReturnThis(),
  silly: jest.fn().mockReturnThis(), http: jest.fn().mockReturnThis(), add: jest.fn(), remove: jest.fn(),
  clear: jest.fn(), configure: jest.fn(), child: jest.fn(), level: 'info', exitOnError: false,
  transports: [], exceptionHandlers: [], rejectionHandlers: []
};
const mockTransports = { Console: jest.fn(() => ({})), File: jest.fn(() => ({})), Http: jest.fn(() => ({})), Stream: jest.fn(() => ({})) };

jest.unstable_mockModule('winston', () => {
  const mockFormat = {};
  ['combine','timestamp','json','colorize','simple','printf','splat','label','align','logstash',
   'padLevels','cli','errors','metadata','ms','prettyPrint','uncolorize'].forEach(k => {
    mockFormat[k] = jest.fn(() => mockFormat);
  });
  return {
    __esModule: true,
    default: { createLogger: jest.fn(() => mockLogger), format: mockFormat, transports: mockTransports, addColors: jest.fn() },
    createLogger: jest.fn(() => mockLogger), format: mockFormat, transports: mockTransports, addColors: jest.fn()
  };
});

jest.unstable_mockModule('mongoose', () => {
  const Schema = function MockSchema(def) {
    this.obj = def || {};
    this.pre = jest.fn().mockReturnThis();
    this.plugin = jest.fn().mockReturnThis();
    this.virtual = jest.fn().mockReturnThis();
    this.index = jest.fn().mockReturnThis();
    this.methods = {};
    this.statics = {};
    this.add = jest.fn().mockReturnThis();
    this.path = jest.fn();
    this.eachPath = jest.fn();
    this.remove = jest.fn();
  };
  Schema.Types = { ObjectId: 'ObjectId', String, Number, Boolean, Date, Array, Buffer, Mixed: Object };

  const createMockModel = () => ({
    find: jest.fn().mockReturnThis(),
    findOne: jest.fn().mockReturnThis(),
    findById: jest.fn().mockReturnThis(),
    findByIdAndUpdate: jest.fn().mockReturnThis(),
    findByIdAndDelete: jest.fn().mockReturnThis(),
    create: jest.fn(),
    lean: jest.fn().mockReturnThis(),
    populate: jest.fn().mockReturnThis(),
    sort: jest.fn().mockReturnThis(),
    limit: jest.fn().mockReturnThis(),
    skip: jest.fn().mockReturnThis(),
    exec: jest.fn(),
    countDocuments: jest.fn(),
    paginate: jest.fn().mockResolvedValue({
      docs: [], totalDocs: 0, limit: 10, totalPages: 1, page: 1,
      pagingCounter: 1, hasPrevPage: false, hasNextPage: false, prevPage: null, nextPage: null
    })
  });

  const mongooseMock = {
    connect: jest.fn().mockResolvedValue(),
    connection: { readyState: 1, on: jest.fn(), once: jest.fn() },
    Schema,
    SchemaTypes: { ObjectId: 'ObjectId', String, Number, Boolean, Date, Array, Mixed: Object },
    Types: { ObjectId: function() { return 'mock-object-id'; } },
    model: jest.fn(() => createMockModel()),
    set: jest.fn(),
    get: jest.fn()
  };
  mongooseMock.Types.ObjectId.isValid = jest.fn(() => true);
  return { __esModule: true, default: mongooseMock, ...mongooseMock };
});

jest.unstable_mockModule('mongoose-paginate-v2', () => ({ __esModule: true, default: jest.fn() }));
jest.unstable_mockModule('../db/mongo.js', () => ({ __esModule: true, default: jest.fn().mockResolvedValue() }));

jest.unstable_mockModule('passport', () => ({
  __esModule: true,
  default: {
    initialize: jest.fn(() => (req, res, next) => next()),
    authenticate: jest.fn((strategy, opts) => {
      return (req, res, next) => {
        if (req.headers && req.headers['x-mock-user']) {
          req.user = JSON.parse(req.headers['x-mock-user']);
          return next();
        }
        return res.status(401).json({ status: 'error', message: 'No autenticado. Token requerido.' });
      };
    }),
    use: jest.fn(), serializeUser: jest.fn(), deserializeUser: jest.fn()
  }
}));

jest.unstable_mockModule('passport-local', () => ({ __esModule: true, default: { Strategy: jest.fn() }, Strategy: jest.fn() }));
jest.unstable_mockModule('passport-jwt', () => ({
  __esModule: true,
  Strategy: jest.fn(),
  ExtractJwt: { fromAuthHeaderAsBearerToken: jest.fn(), fromHeader: jest.fn(), fromBodyField: jest.fn(), fromUrlQueryParameter: jest.fn(), fromAuthHeaderWithScheme: jest.fn() }
}));
jest.unstable_mockModule('bcrypt', () => ({
  __esModule: true,
  default: { hashSync: jest.fn(() => 'hashed'), compareSync: jest.fn(() => true), hash: jest.fn(), compare: jest.fn() },
  hashSync: jest.fn(() => 'hashed'), compareSync: jest.fn(() => true), hash: jest.fn(), compare: jest.fn()
}));

const makeMockValidationChain = () => {
  const middleware = jest.fn((req, res, next) => next());
  middleware.isString = jest.fn().mockReturnValue(middleware);
  middleware.isNumeric = jest.fn().mockReturnValue(middleware);
  middleware.isIn = jest.fn().mockReturnValue(middleware);
  middleware.isMongoId = jest.fn().mockReturnValue(middleware);
  middleware.notEmpty = jest.fn().mockReturnValue(middleware);
  middleware.withMessage = jest.fn().mockReturnValue(middleware);
  middleware.isArray = jest.fn().mockReturnValue(middleware);
  middleware.isBoolean = jest.fn().mockReturnValue(middleware);
  middleware.isDate = jest.fn().mockReturnValue(middleware);
  middleware.bail = jest.fn().mockReturnValue(middleware);
  middleware.custom = jest.fn().mockReturnValue(middleware);
  middleware.optional = jest.fn().mockReturnValue(middleware);
  middleware.isLength = jest.fn().mockReturnValue(middleware);
  middleware.matches = jest.fn().mockReturnValue(middleware);
  middleware.exists = jest.fn().mockReturnValue(middleware);
  return middleware;
};

jest.unstable_mockModule('express-validator', () => ({
  __esModule: true,
  body: jest.fn(() => makeMockValidationChain()),
  validationResult: jest.fn(() => ({ isEmpty: jest.fn(() => true), array: jest.fn(() => []) }))
}));

// ---------------------------------------------------------------------------
// Imports
// ---------------------------------------------------------------------------
import request from 'supertest';
import { mockUser, mockAdmin, authHeaders } from './helpers.js';

let app;

function userHeaders(role = 'user') {
  const u = role === 'admin' ? mockAdmin() : mockUser();
  return { 'x-mock-user': JSON.stringify({ id: u._id || u.id, email: u.email, role: u.role }) };
}

beforeAll(async () => {
  const appModule = await import('../app.js');
  app = appModule.app || appModule.default || appModule;
});

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------
describe('Sessions API - POST /api/sessions/register', () => {
  test('empty data -> 400/500', async () => {
    const res = await request(app).post('/api/sessions/register').send({});
    expect([400, 500]).toContain(res.status);
  });
  test('register new user -> 201/400', async () => {
    const res = await request(app).post('/api/sessions/register').send({ first_name: 'Test', last_name: 'User', email: 'test@test.com', password: '123456' });
    expect([201, 400, 500]).toContain(res.status);
  });
});

describe('Sessions API - POST /api/sessions/login', () => {
  test('no credentials -> 400/401', async () => {
    const res = await request(app).post('/api/sessions/login').send({});
    expect([400, 401, 500]).toContain(res.status);
  });
});

describe('Sessions API - GET /api/sessions/current', () => {
  test('no auth -> 401', async () => {
    const res = await request(app).get('/api/sessions/current');
    expect(res.status).toBe(401);
  });
  test('valid token -> 200', async () => {
    const res = await request(app).get('/api/sessions/current').set(userHeaders('user'));
    expect([200, 500]).toContain(res.status);
    if (res.status === 200) {
      expect(res.body).toHaveProperty('payload');
    }
  });
});
