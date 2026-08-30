/**
 * Role-Based Access Control (RBAC) Middleware
 * Restricts route access based on user role (e.g., investor, entrepreneur, admin).
 * @param {...string} allowedRoles 
 */
export const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized. Authentication required.' });
    }

    const userRole = req.user.role || (req.user.isAdmin ? 'admin' : 'user');

    if (!allowedRoles.includes(userRole) && !req.user.isAdmin) {
      return res.status(403).json({ 
        message: `Forbidden. Role '${userRole}' is not permitted to perform this action.` 
      });
    }

    next();
  };
};

/**
 * Resource Ownership Authorization Middleware
 * Verifies that the authenticated user owns the resource or is an administrator.
 * @param {MongooseModel} Model 
 * @param {string} ownerField 
 */
export const authorizeOwnership = (Model, ownerField = 'userId') => {
  return async (req, res, next) => {
    try {
      if (!req.user) {
        return res.status(401).json({ message: 'Unauthorized.' });
      }

      // Admins bypass ownership restriction
      if (req.user.isAdmin) return next();

      const resourceId = req.params.id;
      if (!resourceId) {
        return res.status(400).json({ message: 'Resource ID required.' });
      }

      const resource = await Model.findById(resourceId);
      if (!resource) {
        return res.status(404).json({ message: 'Resource not found.' });
      }

      const ownerId = resource[ownerField]?.toString();
      const currentUserId = (req.user._id || req.user.id)?.toString();

      if (ownerId !== currentUserId) {
        return res.status(403).json({ message: 'Forbidden. Access denied to requested resource.' });
      }

      req.resource = resource;
      next();
    } catch (error) {
      next(error);
    }
  };
};

export default {
  authorizeRoles,
  authorizeOwnership
};
