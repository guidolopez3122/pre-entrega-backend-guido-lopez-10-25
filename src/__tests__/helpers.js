// Mock data and helpers for tests

/**
 * Generate a mock MongoDB ObjectId-like string
 */
export const generateMockId = () => {
  const hex = '0123456789abcdef';
  let id = '';
  for (let i = 0; i < 24; i++) {
    id += hex[Math.floor(Math.random() * 16)];
  }
  return id;
};

/**
 * Create a mock user object
 */
export const mockUser = (overrides = {}) => ({
  _id: generateMockId(),
  id: generateMockId(),
  first_name: 'Test',
  last_name: 'User',
  email: 'test@example.com',
  age: 25,
  password: 'hashed_password',
  role: 'user',
  cart: generateMockId(),
  ...overrides
});

/**
 * Create a mock admin user object
 */
export const mockAdmin = (overrides = {}) => mockUser({ role: 'admin', email: 'admin@example.com', ...overrides });

/**
 * Create a mock product object
 */
export const mockProduct = (overrides = {}) => ({
  _id: generateMockId(),
  title: 'Producto de prueba',
  description: 'Descripción de prueba',
  code: `CODE-${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
  price: 100,
  status: true,
  stock: 50,
  category: 'test',
  thumbnails: [],
  ...overrides
});

/**
 * Create auth headers using a mock user object
 */
export const authHeaders = (user = mockUser()) => ({
  Authorization: `Bearer ${Buffer.from(JSON.stringify({ id: user._id || user.id, email: user.email, role: user.role })).toString('base64')}`,
  'Content-Type': 'application/json'
});
