
const checkOwnership = (model, isField) => {

  return async (req, res, next) => {
    try {
      const userId = req.user.id;
      const resourceId = req.params.id;
      // console.log('User ID:', userId);
      // console.log('Resource ID:', resourceId);


      // Fetch the resource from the database
      const resource = await model.findOne({ admin_id: resourceId });

      if (!resource) {
        return res.status(404).json({ message: 'Resource not found' });
      }

      // Check if the user is the owner or has a SUPER_ADMIN role
      if (resource[isField].toString() !== userId && req.user.role !== 'SUPER_ADMIN') {
        return res.status(403).json({ message: 'Forbidden: You can only manage your own data' });
      }
      next();
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
}

module.exports = { checkOwnership };
