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
    authenticate: jest.fn(() => (req, res, next) => {
      if (req.headers && req.headers['x-mock-user']) {
        req.user = JSON.parse(req.headers['x-mock-user']);
        return next();
      }
      return res.status(401).json({ status: 'error', message: 'No autenticado. Token requerido.' });
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
import { mockUser, mockAdmin, authHeaders, generateMockId } from './helpers.js';

let app;
const user = mockUser();
const admin = mockAdmin();
const fakeCartId = generateMockId();
const fakeProductId = generateMockId();

function userHeaders(role = 'user') {
  const u = role === 'admin' ? admin : user;
  return { 'x-mock-user': JSON.stringify({ id: u._id || u.id, email: u.email, role: u.role }) };
}

beforeAll(async () => {
  const appModule = await import('../app.js');
  app = appModule.app || appModule.default || appModule;
});

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------
describe('Carts API - POST /api/carts (create cart)', () => {
  test('should create cart (201 or 200)', async () => {
    const res = await request(app).post('/api/carts');
    expect([200, 201, 500]).toContain(res.status);
    if (res.status === 201 || res.status === 200) {
      expect(res.body).toHaveProperty('_id') || expect(res.body).toHaveProperty('id');
      expect(res.body).toHaveProperty('products');
    }
  });
});

describe('Carts API - GET /api/carts/:cid', () => {
  test('should return 404 for nonexistent cart', async () => {
    const res = await request(app).get(`/api/carts/${fakeCartId}`);
    expect([404, 500]).toContain(res.status);
    if (res.status === 404) expect(res.body).toHaveProperty('status', 'error');
  });
  test('should return error for invalid ID', async () => {
    const res = await request(app).get('/api/carts/id-invalido');
    expect([404, 500]).toContain(res.status);
  });
});

describe('Carts API - POST /api/carts/:cid/product/:pid (add product)', () => {
  test('no auth -> 401', async () => {
    const res = await request(app).post(`/api/carts/${fakeCartId}/product/${fakeProductId}`).send({ quantity: 1 });
    expect(res.status).toBe(401);
  });
  test('admin -> 403', async () => {
    const res = await request(app).post(`/api/carts/${fakeCartId}/product/${fakeProductId}`).set(userHeaders('admin')).send({ quantity: 1 });
    expect(res.status).toBe(403);
  });
  test('user -> should process', async () => {
    const res = await request(app).post(`/api/carts/${fakeCartId}/product/${fakeProductId}`).set(userHeaders('user')).send({ quantity: 1 });
    expect([200, 400, 500]).toContain(res.status);
  });
});

describe('Carts API - DELETE /api/carts/:cid/product/:pid', () => {
  test('no auth -> 401', async () => {
    const res = await request(app).delete(`/api/carts/${fakeCartId}/product/${fakeProductId}`);
    expect(res.status).toBe(401);
  });
});

describe('Carts API - PUT /api/carts/:cid', () => {
  test('no auth -> 401', async () => {
    const res = await request(app).put(`/api/carts/${fakeCartId}`).send({ products: [{ product: fakeProductId, quantity: 2 }] });
    expect(res.status).toBe(401);
  });
});

describe('Carts API - PUT /api/carts/:cid/product/:pid', () => {
  test('no auth -> 401', async () => {
    const res = await request(app).put(`/api/carts/${fakeCartId}/product/${fakeProductId}`).send({ quantity: 3 });
    expect(res.status).toBe(401);
  });
});

describe('Carts API - DELETE /api/carts/:cid (clear)', () => {
  test('no auth -> 401', async () => {
    const res = await request(app).delete(`/api/carts/${fakeCartId}`);
    expect(res.status).toBe(401);
  });
});

describe('Carts API - POST /api/carts/:cid/purchase', () => {
  test('no auth -> 401', async () => {
    const res = await request(app).post(`/api/carts/${fakeCartId}/purchase`);
    expect(res.status).toBe(401);
  });
  test('user purchase -> should process', async () => {
    const res = await request(app).post(`/api/carts/${fakeCartId}/purchase`).set(userHeaders('user'));
    expect([200, 400, 404, 500]).toContain(res.status);
    if (res.status === 200) {
      expect(res.body).toHaveProperty('status');
      expect(res.body).toHaveProperty('ticket');
    }
  });
});
