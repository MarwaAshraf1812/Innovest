const AuditLog = require('../db/models/auditLogModel');
const queueService = require('../services/queue.service');

// Register queue worker to write audit logs asynchronously without blocking HTTP response
queueService.registerWorker('writeAuditLog', async (auditData) => {
  try {
    await AuditLog.create(auditData);
  } catch (error) {
    console.error('Failed to write background audit log:', error.message);
  }
});

/**
 * Express middleware helper to log critical actions to AuditLog asynchronously.
 */
const logAudit = (action, resourceType) => {
  return (req, res, next) => {
    // Capture response finish
    res.on('finish', () => {
      if (res.statusCode >= 200 && res.statusCode < 400) {
        const auditData = {
          action,
          resourceType,
          performedBy: req.user?._id || req.user?.id || null,
          role: req.user?.role || 'guest',
          resourceId: req.params?.id || req.body?.id || null,
          details: {
            method: req.method,
            path: req.originalUrl,
            params: req.params,
            statusCode: res.statusCode
          },
          ipAddress: req.ip || req.headers['x-forwarded-for'] || req.socket.remoteAddress,
          userAgent: req.headers['user-agent']
        };

        // Queue audit log write in background
        queueService.add('writeAuditLog', auditData);
      }
    });

    next();
  };
};

module.exports = { logAudit };
