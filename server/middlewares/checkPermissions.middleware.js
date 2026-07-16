const checkPermissions = (requiredPermissions) => {
  return (req, res, next) => {
    const userPermissions = req.user.permissions || [];
    
    // Allow all operations if the user is a Super Admin
    if (req.user.role === 'SUPER_ADMIN') {
      return next();
    }

    // All authenticated users are granted basic community/page permissions by default
    const defaultCommunityPermissions = [
      'VIEW_PAGE',
      'CREATE_PAGE',
      'COMMENT_ON_PAGE',
      'LIKE_PAGE',
      'VIEW_COMMENTS',
      'VIEW_LIKES'
    ];

    // Map admin-level permissions to cover standard user permissions
    const effectivePermissions = [...new Set([...userPermissions, ...defaultCommunityPermissions])];
    if (userPermissions.includes('VIEW_USER_OR_ADMIN')) effectivePermissions.push('VIEW_USER');
    if (userPermissions.includes('DELETE_USER_OR_ADMIN')) effectivePermissions.push('DELETE_USER');
    if (userPermissions.includes('UPDATE_USER_OR_ADMIN')) effectivePermissions.push('UPDATE_USER');
    if (userPermissions.includes('CREATE_USER_OR_ADMIN')) effectivePermissions.push('CREATE_USER');

    const hasPermission = requiredPermissions.every((perm) => effectivePermissions.includes(perm));
    
    if (!hasPermission) {
      console.log(`checkPermissions: Access denied. req.user:`, req.user);
      console.log(`checkPermissions: Required: ${requiredPermissions}, Effective permissions: ${effectivePermissions}`);
      return res.status(403).json({ message: 'Forbidden: You do not have the required permissions.' });
    }

    next();
  };
};

module.exports = { checkPermissions };
