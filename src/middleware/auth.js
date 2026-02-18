import passport from 'passport';

// Middleware de autenticación usando estrategia 'current'
export const authenticate = passport.authenticate('current', { session: false });

// Middleware de autorización basado en roles
export const authorize = (roles) => {
  return (req, res, next) => {
    // Verificar que el usuario esté autenticado
    if (!req.user) {
      return res.status(401).json({ 
        status: 'error', 
        message: 'No autenticado. Token requerido.' 
      });
    }

    // Verificar que el usuario tenga un rol permitido
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ 
        status: 'error', 
        message: 'Acceso denegado. No tienes permisos para realizar esta acción.',
        requiredRoles: roles,
        currentRole: req.user.role
      });
    }

    // Usuario autorizado, continuar
    next();
  };
};

// Middleware específico para verificar propiedad del recurso
export const authorizeOwnerOrAdmin = (getResourceOwnerId) => {
  return async (req, res, next) => {
    try {
      if (!req.user) {
        return res.status(401).json({ 
          status: 'error', 
          message: 'No autenticado' 
        });
      }

      // Admin siempre tiene acceso
      if (req.user.role === 'admin') {
        return next();
      }

      // Obtener el ID del dueño del recurso
      const resourceOwnerId = await getResourceOwnerId(req);
      
      // Verificar si el usuario es el dueño
      if (req.user.id === resourceOwnerId || req.user._id.toString() === resourceOwnerId) {
        return next();
      }

      return res.status(403).json({ 
        status: 'error', 
        message: 'Acceso denegado. No eres el dueño de este recurso.' 
      });
    } catch (error) {
      return res.status(500).json({ 
        status: 'error', 
        message: 'Error al verificar permisos' 
      });
    }
  };
};

// Middleware para verificar que el usuario sea el dueño del carrito
export const authorizeCartOwner = () => {
  return async (req, res, next) => {
    try {
      if (!req.user) {
        return res.status(401).json({ 
          status: 'error', 
          message: 'No autenticado' 
        });
      }

      // Admin siempre tiene acceso
      if (req.user.role === 'admin') {
        return next();
      }

      // Para usuarios normales, verificar que el carrito les pertenezca
      // Esto se implementaría cuando el carrito tenga referencia al usuario
      // Por ahora, permitimos el acceso si está autenticado como 'user'
      if (req.user.role === 'user') {
        return next();
      }

      return res.status(403).json({ 
        status: 'error', 
        message: 'Acceso denegado' 
      });
    } catch (error) {
      return res.status(500).json({ 
        status: 'error', 
        message: 'Error al verificar permisos del carrito' 
      });
    }
  };
};

// Constantes de roles para uso consistente
export const ROLES = {
  ADMIN: 'admin',
  USER: 'user',
  PREMIUM: 'premium'
};
