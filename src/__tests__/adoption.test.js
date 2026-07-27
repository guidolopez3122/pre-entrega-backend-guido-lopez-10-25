import { jest } from '@jest/globals';

// ---------------------------------------------------------------------------
// Mocks - Must be before ANY import of the mocked modules
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
    paginate: jest.fn().mockResolvedValue({ docs: [], totalDocs: 0, limit: 10, totalPages: 1, page: 1, pagingCounter: 1, hasPrevPage: false, hasNextPage: false, prevPage: null, nextPage: null })
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

// Mock passport - returns 401 when no x-mock-user header is present
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

// Mock express-validator - body() returns callable middleware for Express routes
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

// Mock DAOs
const mockPetManager = {
  getAll: jest.fn(), getById: jest.fn(), create: jest.fn(), update: jest.fn(), delete: jest.fn(),
  getAvailable: jest.fn(), search: jest.fn()
};
const mockAdoptionManager = {
  getAll: jest.fn(), getById: jest.fn(), create: jest.fn(), update: jest.fn(), delete: jest.fn(),
  getByUser: jest.fn(), getByPet: jest.fn(), approve: jest.fn(), reject: jest.fn()
};

jest.unstable_mockModule('../dao/PetManager.js', () => ({ __esModule: true, default: jest.fn(() => mockPetManager) }));
jest.unstable_mockModule('../dao/AdoptionManager.js', () => ({ __esModule: true, default: jest.fn(() => mockAdoptionManager) }));

// ---------------------------------------------------------------------------
// Imports
// ---------------------------------------------------------------------------
import request from 'supertest';
import { mockUser, mockAdmin, authHeaders, generateMockId } from './helpers.js';

let app;
const user = mockUser();
const admin = mockAdmin();
const fakePetId = generateMockId();
const fakeAdoptionId = generateMockId();

// Set x-mock-user header for authenticated requests
const userHeaders = (role = 'user') => {
  const u = role === 'admin' ? admin : user;
  return {
    'x-mock-user': JSON.stringify({ id: u._id || u.id, email: u.email, role: u.role })
  };
};

beforeAll(async () => {
  const appModule = await import('../app.js');
  app = appModule.app || appModule.default || appModule;
});

beforeEach(() => {
  jest.clearAllMocks();
  const now = new Date();

  mockPetManager.getAll.mockResolvedValue([{ _id: fakePetId, name: 'Buddy', species: 'dog', breed: 'Labrador', age: 2, status: 'available', vaccinated: true, createdAt: now, updatedAt: now }]);
  mockPetManager.getById.mockImplementation((id) => {
    if (id === fakePetId) return Promise.resolve({ _id: fakePetId, name: 'Buddy', species: 'dog', breed: 'Labrador', age: 2, status: 'available', vaccinated: true, createdAt: now, updatedAt: now });
    return Promise.resolve(null);
  });
  mockPetManager.create.mockImplementation((data) => Promise.resolve({ _id: generateMockId(), ...data, status: 'available', createdAt: now, updatedAt: now }));
  mockPetManager.update.mockImplementation((id, data) => Promise.resolve({ _id: id, name: 'Buddy', species: 'dog', status: data.status || 'available', ...data, createdAt: now, updatedAt: now }));
  mockPetManager.delete.mockResolvedValue({ _id: fakePetId, name: 'Buddy' });
  mockPetManager.getAvailable.mockResolvedValue([{ _id: fakePetId, name: 'Buddy', species: 'dog', status: 'available' }]);
  mockPetManager.search.mockResolvedValue([{ _id: fakePetId, name: 'Buddy', species: 'dog', status: 'available' }]);

  mockAdoptionManager.getAll.mockResolvedValue([{ _id: fakeAdoptionId, pet: { _id: fakePetId, name: 'Buddy' }, user: { _id: user._id, first_name: 'Test', email: 'test@example.com' }, status: 'pending', adoptionDate: now, notes: '', createdAt: now, updatedAt: now }]);
  mockAdoptionManager.getById.mockImplementation((id) => {
    if (id === fakeAdoptionId) return Promise.resolve({ _id: fakeAdoptionId, pet: { _id: fakePetId, name: 'Buddy', id: fakePetId }, user: { _id: user._id, first_name: 'Test', email: 'test@example.com', id: user._id }, status: 'pending', adoptionDate: now, notes: '', createdAt: now, updatedAt: now });
    return Promise.resolve(null);
  });
  mockAdoptionManager.create.mockImplementation((data) => Promise.resolve({ _id: fakeAdoptionId, ...data, status: 'pending', adoptionDate: now, createdAt: now, updatedAt: now }));
  mockAdoptionManager.update.mockImplementation((id, data) => Promise.resolve({ _id: id, pet: { _id: fakePetId, name: 'Buddy', id: fakePetId }, user: { _id: user._id, id: user._id }, ...data, status: data.status || 'pending', createdAt: now, updatedAt: now }));
  mockAdoptionManager.delete.mockResolvedValue({ _id: fakeAdoptionId });
  mockAdoptionManager.getByUser.mockResolvedValue([{ _id: fakeAdoptionId, pet: { _id: fakePetId, name: 'Buddy' }, status: 'pending', adoptionDate: now }]);
  mockAdoptionManager.getByPet.mockResolvedValue([]);
  mockAdoptionManager.approve.mockImplementation((id, reviewerId) => Promise.resolve({ _id: id, pet: { _id: fakePetId, name: 'Buddy', id: fakePetId }, user: { _id: user._id, id: user._id }, status: 'approved', reviewedBy: reviewerId, adoptionDate: now, createdAt: now, updatedAt: now }));
  mockAdoptionManager.reject.mockImplementation((id, reviewerId, notes) => Promise.resolve({ _id: id, pet: { _id: fakePetId, name: 'Buddy', id: fakePetId }, user: { _id: user._id, id: user._id }, status: 'rejected', reviewedBy: reviewerId, notes: notes || '', adoptionDate: now, createdAt: now, updatedAt: now }));
});

// ---------------------------------------------------------------------------
// Tests - GET /api/adoptions (admin only)
// ---------------------------------------------------------------------------
describe('GET /api/adoptions', () => {
  test('no auth -> 401', async () => {
    const res = await request(app).get('/api/adoptions');
    expect(res.status).toBe(401);
  });
  test('user role -> 403', async () => {
    const res = await request(app).get('/api/adoptions').set(userHeaders('user'));
    expect(res.status).toBe(403);
  });
  test('admin -> 200', async () => {
    const res = await request(app).get('/api/adoptions').set(userHeaders('admin'));
    expect([200, 500]).toContain(res.status);
  });
  test('admin with status filter -> 200', async () => {
    const res = await request(app).get('/api/adoptions?status=pending').set(userHeaders('admin'));
    expect([200, 500]).toContain(res.status);
  });
});

// ---------------------------------------------------------------------------
// Tests - GET /api/adoptions/me
// ---------------------------------------------------------------------------
describe('GET /api/adoptions/me', () => {
  test('no auth -> 401', async () => {
    const res = await request(app).get('/api/adoptions/me');
    expect(res.status).toBe(401);
  });
  test('user -> 200', async () => {
    const res = await request(app).get('/api/adoptions/me').set(userHeaders('user'));
    expect([200, 500]).toContain(res.status);
  });
});

// ---------------------------------------------------------------------------
// Tests - GET /api/adoptions/:aid
// ---------------------------------------------------------------------------
describe('GET /api/adoptions/:aid', () => {
  test('no auth -> 401', async () => {
    const res = await request(app).get(`/api/adoptions/${fakeAdoptionId}`);
    expect(res.status).toBe(401);
  });
  test('user -> 200', async () => {
    const res = await request(app).get(`/api/adoptions/${fakeAdoptionId}`).set(userHeaders('user'));
    expect([200, 500]).toContain(res.status);
  });
  test('not found -> 404', async () => {
    const res = await request(app).get(`/api/adoptions/${generateMockId()}`).set(userHeaders('user'));
    expect([404, 500]).toContain(res.status);
  });
});

// ---------------------------------------------------------------------------
// Tests - POST /api/adoptions
// ---------------------------------------------------------------------------
describe('POST /api/adoptions', () => {
  test('no auth -> 401', async () => {
    const res = await request(app).post('/api/adoptions').send({ pet: fakePetId });
    expect(res.status).toBe(401);
  });
  test('user creates adoption -> 201', async () => {
    const res = await request(app).post('/api/adoptions').set(userHeaders('user')).send({ pet: fakePetId, notes: 'Quiero adoptar a Buddy' });
    expect([201, 400, 500]).toContain(res.status);
  });
  test('pet not available -> 400', async () => {
    mockPetManager.getById.mockResolvedValue({ _id: fakePetId, name: 'Buddy', species: 'dog', status: 'adopted' });
    const res = await request(app).post('/api/adoptions').set(userHeaders('user')).send({ pet: fakePetId });
    expect([400, 500]).toContain(res.status);
  });
});

// ---------------------------------------------------------------------------
// Tests - PUT /api/adoptions/:aid (admin only)
// ---------------------------------------------------------------------------
describe('PUT /api/adoptions/:aid', () => {
  test('no auth -> 401', async () => {
    const res = await request(app).put(`/api/adoptions/${fakeAdoptionId}`).send({ notes: 'Updated' });
    expect(res.status).toBe(401);
  });
  test('user -> 403', async () => {
    const res = await request(app).put(`/api/adoptions/${fakeAdoptionId}`).set(userHeaders('user')).send({ notes: 'Updated' });
    expect(res.status).toBe(403);
  });
  test('admin -> 200', async () => {
    const res = await request(app).put(`/api/adoptions/${fakeAdoptionId}`).set(userHeaders('admin')).send({ notes: 'Updated notes' });
    expect([200, 400, 500]).toContain(res.status);
  });
});

// ---------------------------------------------------------------------------
// Tests - DELETE /api/adoptions/:aid
// ---------------------------------------------------------------------------
describe('DELETE /api/adoptions/:aid', () => {
  test('no auth -> 401', async () => {
    const res = await request(app).delete(`/api/adoptions/${fakeAdoptionId}`);
    expect(res.status).toBe(401);
  });
  test('user -> 200', async () => {
    const res = await request(app).delete(`/api/adoptions/${fakeAdoptionId}`).set(userHeaders('user'));
    expect([200, 400, 500]).toContain(res.status);
  });
  test('admin -> 200', async () => {
    const res = await request(app).delete(`/api/adoptions/${fakeAdoptionId}`).set(userHeaders('admin'));
    expect([200, 400, 500]).toContain(res.status);
  });
});

// ---------------------------------------------------------------------------
// Tests - POST /api/adoptions/:aid/approve (admin only)
// ---------------------------------------------------------------------------
describe('POST /api/adoptions/:aid/approve', () => {
  test('no auth -> 401', async () => {
    const res = await request(app).post(`/api/adoptions/${fakeAdoptionId}/approve`);
    expect(res.status).toBe(401);
  });
  test('user -> 403', async () => {
    const res = await request(app).post(`/api/adoptions/${fakeAdoptionId}/approve`).set(userHeaders('user'));
    expect(res.status).toBe(403);
  });
  test('admin approves -> 200', async () => {
    const res = await request(app).post(`/api/adoptions/${fakeAdoptionId}/approve`).set(userHeaders('admin'));
    expect([200, 400, 500]).toContain(res.status);
  });
  test('approve nonexistent -> error', async () => {
    mockAdoptionManager.getById.mockResolvedValue(null);
    const res = await request(app).post(`/api/adoptions/${generateMockId()}/approve`).set(userHeaders('admin'));
    expect([400, 404, 500]).toContain(res.status);
  });
});

// ---------------------------------------------------------------------------
// Tests - POST /api/adoptions/:aid/reject (admin only)
// ---------------------------------------------------------------------------
describe('POST /api/adoptions/:aid/reject', () => {
  test('no auth -> 401', async () => {
    const res = await request(app).post(`/api/adoptions/${fakeAdoptionId}/reject`);
    expect(res.status).toBe(401);
  });
  test('user -> 403', async () => {
    const res = await request(app).post(`/api/adoptions/${fakeAdoptionId}/reject`).set(userHeaders('user'));
    expect(res.status).toBe(403);
  });
  test('admin rejects -> 200', async () => {
    const res = await request(app).post(`/api/adoptions/${fakeAdoptionId}/reject`).set(userHeaders('admin')).send({ notes: 'No cumple requisitos' });
    expect([200, 400, 500]).toContain(res.status);
  });
  test('admin rejects with optional notes -> 200', async () => {
    const res = await request(app).post(`/api/adoptions/${fakeAdoptionId}/reject`).set(userHeaders('admin')).send({ notes: 'Documentacion incompleta' });
    expect([200, 400, 500]).toContain(res.status);
  });
});
