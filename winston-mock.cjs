// Mock de winston para tests (CommonJS)
// Los tests usan jest.mock para reemplazar winston
'use strict';

const mockLogger = {
  info: jest.fn().mockReturnThis(),
  error: jest.fn().mockReturnThis(),
  warn: jest.fn().mockReturnThis(),
  debug: jest.fn().mockReturnThis(),
  log: jest.fn().mockReturnThis(),
  verbose: jest.fn().mockReturnThis(),
  silly: jest.fn().mockReturnThis(),
  http: jest.fn().mockReturnThis(),
  add: jest.fn(),
  remove: jest.fn(),
  clear: jest.fn(),
  profile: jest.fn(),
  startTimer: jest.fn(),
  handleExceptions: jest.fn(),
  unhandleExceptions: jest.fn(),
  handleRejections: jest.fn(),
  unhandleRejections: jest.fn(),
  configure: jest.fn(),
  child: jest.fn(),
  query: jest.fn(),
  stream: jest.fn(),
  level: 'info',
  exitOnError: false,
  transports: [],
  exceptions: { handle: jest.fn(), unhandle: jest.fn() },
  rejections: { handle: jest.fn(), unhandle: jest.fn() },
  exceptionHandlers: [],
  rejectionHandlers: []
};

const mockFormat = {
  combine: jest.fn(() => mockFormat),
  timestamp: jest.fn(() => mockFormat),
  json: jest.fn(() => mockFormat),
  colorize: jest.fn(() => mockFormat),
  simple: jest.fn(() => mockFormat),
  printf: jest.fn(() => mockFormat),
  splat: jest.fn(() => mockFormat),
  label: jest.fn(() => mockFormat),
  align: jest.fn(() => mockFormat),
  logstash: jest.fn(() => mockFormat),
  padLevels: jest.fn(() => mockFormat),
  uncolorize: jest.fn(() => mockFormat),
  cli: jest.fn(() => mockFormat),
  errors: jest.fn(() => mockFormat),
  metadata: jest.fn(() => mockFormat),
  ms: jest.fn(() => mockFormat),
  prettyPrint: jest.fn(() => mockFormat)
};

const mockTransports = {
  Console: jest.fn(function Console() { return {}; }),
  File: jest.fn(function File() { return {}; }),
  Http: jest.fn(function Http() { return {}; }),
  Stream: jest.fn(function Stream() { return {}; })
};

const winstonMock = {
  version: '3.19.0',
  transports: mockTransports,
  config: {
    npm: { levels: { error: 0, warn: 1, info: 2, http: 3, verbose: 4, debug: 5, silly: 6 } },
    syslog: { levels: { emerg: 0, alert: 1, crit: 2, error: 3, warning: 4, notice: 5, info: 6, debug: 7 } }
  },
  addColors: jest.fn(),
  format: mockFormat,
  createLogger: jest.fn(() => mockLogger),
  Logger: jest.fn(),
  Container: jest.fn(),
  ExceptionHandler: jest.fn(),
  RejectionHandler: jest.fn(),
  Transport: jest.fn(),
  loggers: { get: jest.fn(), add: jest.fn(), has: jest.fn(), close: jest.fn() },
  log: jest.fn(),
  query: jest.fn(),
  stream: jest.fn(),
  add: jest.fn(),
  remove: jest.fn(),
  clear: jest.fn(),
  profile: jest.fn(),
  startTimer: jest.fn(),
  handleExceptions: jest.fn(),
  unhandleExceptions: jest.fn(),
  handleRejections: jest.fn(),
  unhandleRejections: jest.fn(),
  configure: jest.fn(),
  child: jest.fn(),
  info: jest.fn(),
  error: jest.fn(),
  warn: jest.fn(),
  debug: jest.fn(),
  verbose: jest.fn(),
  silly: jest.fn(),
  http: jest.fn(),
  level: 'info',
  exitOnError: false,
  exceptions: { handle: jest.fn(), unhandle: jest.fn() },
  rejections: { handle: jest.fn(), unhandle: jest.fn() }
};

// Getter 'default' como el real winston tiene
Object.defineProperty(winstonMock, 'default', {
  get() {
    return {
      exceptionHandlers: [],
      rejectionHandlers: [],
      transports: []
    };
  },
  enumerable: true,
  configurable: true
});

module.exports = winstonMock;

