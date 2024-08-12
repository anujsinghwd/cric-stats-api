class ResponseHandler {
  // Success response method
  static success(res, message, data = null, statusCode = 200) {
    return res.status(statusCode).json({
      success: true,
      message,
      data,
    });
  }

  // Error response method
  static error(res, message, error = null, statusCode = 500) {
    return res.status(statusCode).json({
      success: false,
      message,
      error: error ? error.message || error : null,
    });
  }

  // Validation error response method (optional)
  static validationError(res, message, errors = [], statusCode = 400) {
    return res.status(statusCode).json({
      success: false,
      message,
      errors,
    });
  }
}

module.exports = ResponseHandler;
