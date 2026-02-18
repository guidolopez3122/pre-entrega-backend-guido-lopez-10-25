// Constantes de la aplicación

// Roles de usuario
export const USER_ROLES = {
  ADMIN: 'admin',
  USER: 'user',
  PREMIUM: 'premium'
};

// Mensajes de error
export const ERROR_MESSAGES = {
  // Autenticación
  AUTH_REQUIRED: 'No autenticado. Token requerido.',
  ACCESS_DENIED: 'Acceso denegado. No tienes permisos para realizar esta acción.',
  INVALID_TOKEN: 'Token inválido o expirado',
  TOKEN_EXPIRED: 'El enlace ha expirado. Solicita uno nuevo.',
  
  // Usuario
  USER_NOT_FOUND: 'Usuario no encontrado',
  USER_ALREADY_EXISTS: 'El email ya está registrado',
  INVALID_CREDENTIALS: 'Credenciales inválidas',
  SAME_PASSWORD: 'No puedes usar la misma contraseña anterior',
  
  // Producto
  PRODUCT_NOT_FOUND: 'Producto no encontrado',
  PRODUCT_STOCK_INSUFFICIENT: 'Stock insuficiente',
  PRODUCT_PRICE_INVALID: 'El precio no puede ser negativo',
  PRODUCT_STOCK_NEGATIVE: 'El stock no puede ser negativo',
  PRODUCT_TITLE_REQUIRED: 'Título es requerido',
  PRODUCT_PRICE_REQUIRED: 'Precio es requerido',
  
  // Carrito
  CART_NOT_FOUND: 'Carrito no encontrado',
  CART_EMPTY: 'Carrito vacío',
  PRODUCT_NOT_IN_CART: 'Producto no encontrado en el carrito',
  QUANTITY_INVALID: 'La cantidad debe ser al menos 1',
  
  // Compra
  PURCHASE_NO_PRODUCTS: 'No se pudieron comprar productos',
  PURCHASE_ERROR: 'Error en la compra',
  
  // General
  INTERNAL_ERROR: 'Error interno del servidor',
  VALIDATION_ERROR: 'Error de validación'
};

// Mensajes de éxito
export const SUCCESS_MESSAGES = {
  // Autenticación
  LOGIN_SUCCESS: 'Login exitoso',
  LOGOUT_SUCCESS: 'Logout exitoso',
  REGISTER_SUCCESS: 'Usuario registrado exitosamente',
  PASSWORD_RESET_EMAIL: 'Email de recuperación enviado',
  PASSWORD_RESET_SUCCESS: 'Contraseña actualizada exitosamente',
  
  // Producto
  PRODUCT_CREATED: 'Producto creado exitosamente',
  PRODUCT_UPDATED: 'Producto actualizado exitosamente',
  PRODUCT_DELETED: 'Producto eliminado exitosamente',
  
  // Carrito
  PRODUCT_ADDED: 'Producto agregado al carrito',
  PRODUCT_REMOVED: 'Producto eliminado del carrito',
  CART_CLEARED: 'Carrito limpiado exitosamente',
  
  // Compra
  PURCHASE_COMPLETE: 'Compra completada exitosamente',
  PURCHASE_PARTIAL: 'Compra parcial completada'
};

// Códigos de estado HTTP
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_ERROR: 500
};

// Configuración de paginación
export const PAGINATION = {
  DEFAULT_LIMIT: 10,
  DEFAULT_PAGE: 1,
  MAX_LIMIT: 100
};

// Configuración de tokens
export const TOKEN_CONFIG = {
  EXPIRY: '1h',
  RESET_EXPIRY: '1h'
};
