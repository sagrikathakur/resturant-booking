/**
 * Middleware factory for validating Express request data against Zod schemas.
 */
export const validateBody = (schema) => (req, res, next) => {
  const result = schema.safeParse(req.body);
  if (!result.success) {
    const formattedErrors = result.error.errors.map((err) => ({
      field: err.path.join("."),
      message: err.message,

    }));

    return res.status(400).json({
      message: formattedErrors[0]?.message || "Validation failed",
      errors: formattedErrors,
    });
  }

  req.body = result.data;
  next();
};

export const validateParams = (schema) => (req, res, next) => {
  const result = schema.safeParse(req.params);
  if (!result.success) {
    const formattedErrors = result.error.errors.map((err) => ({
      field: err.path.join("."),
      message: err.message,
    }));

    return res.status(400).json({
      message: formattedErrors[0]?.message || "Invalid route parameters",
      errors: formattedErrors,
    });
  }

  req.params = result.data;
  next();
};

export const validateQuery = (schema) => (req, res, next) => {
  const result = schema.safeParse(req.query);
  if (!result.success) {
    const formattedErrors = result.error.errors.map((err) => ({
      field: err.path.join("."),
      message: err.message,
    }));

    return res.status(400).json({
      message: formattedErrors[0]?.message || "Invalid query parameters",
      errors: formattedErrors,
    });
  }

  req.query = result.data;
  next();
};

export default validateBody;
