/**
 * Generic Joi Validation Middleware
 * Validates request body/params/query against a specified Joi schema.
 * Returns 400 Bad Request with formatted error details if validation fails.
 */
const validatePayload = (schema, source = 'body') => {
  return (req, res, next) => {
    if (!schema) return next();

    const { error, value } = schema.validate(req[source], {
      abortEarly: false,
      allowUnknown: true, // Allows extra fields like files or query params
      stripUnknown: false,
    });

    if (error) {
      const errorMessages = error.details.map((detail) => detail.message);
      return res.status(400).json({
        message: 'Validation Error',
        errors: errorMessages,
      });
    }

    req[source] = value;
    next();
  };
};

module.exports = validatePayload;
