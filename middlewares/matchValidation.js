const Joi = require("joi");
const ResponseHandler = require("../utils/ResponseHandler");

class MatchValidator {
  constructor() {
    this.matchSchema = Joi.object({
      runs: Joi.number().integer().min(0),
      striker: Joi.string().required(),
      nonStriker: Joi.string().required(),
      bowler: Joi.string().required(),
      noBall: Joi.number().integer().min(0).max(1),
      over_str: Joi.number(),
    });
  }

  validate(req, res, next) {
    const { error } = this.matchSchema.validate(req.body);

    if (error) {
      // Use the ResponseHandler to send a validation error response
      return ResponseHandler.validationError(
        res,
        "Validation failed",
        error.details.map((detail) => detail.message) // Map the error details to get messages
      );
    }

    next();
  }
}

module.exports = new MatchValidator();
