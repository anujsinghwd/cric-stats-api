const Joi = require("joi");

class BallValidator {
  constructor() {
    this.addBallSchema = Joi.object({
      matchId: Joi.string()
        .pattern(/^[0-9a-fA-F]{24}$/)
        .required()
        .messages({
          "string.pattern.base":
            "Invalid match ID format. Must be a valid ObjectId.",
        }), // Ensure matchId is a valid ObjectId
      runs: Joi.number().integer().min(0).required().messages({
        "number.base": "Runs must be a number.",
        "number.min": "Runs must be a positive number.",
      }),
      striker: Joi.string().required().messages({
        "string.base": "Striker's name must be a string.",
        "string.empty": "Striker's name is required.",
      }),
      nonStriker: Joi.string().required().messages({
        "string.base": "Non-striker's name must be a string.",
        "string.empty": "Non-striker's name is required.",
      }),
      bowler: Joi.string().required().messages({
        "string.base": "Bowler's name must be a string.",
        "string.empty": "Bowler's name is required.",
      }),
      noBall: Joi.number().integer().min(0).max(1).default(0).messages({
        "number.base": "No-ball flag must be a number.",
        "number.min": "No-ball flag must be either 0 or 1.",
        "number.max": "No-ball flag must be either 0 or 1.",
      }),
      wideBall: Joi.number().integer().min(0).max(1).default(0).messages({
        "number.base": "Wide-ball flag must be a number.",
        "number.min": "Wide-ball flag must be either 0 or 1.",
        "number.max": "Wide-ball flag must be either 0 or 1.",
      }),
      over_str: Joi.number().integer().min(1).required().messages({
        "number.base": "Over string must be a number.",
        "any.required": "Over string is required.",
      }),
    });

    this.updateBallSchema = Joi.object({
      ballId: Joi.string()
        .pattern(/^[0-9a-fA-F]{24}$/)
        .required()
        .messages({
          "string.pattern.base":
            "Invalid match ID format. Must be a valid ObjectId.",
        }), // Ensure matchId is a valid ObjectId
      runs: Joi.number().integer().min(0).required().messages({
        "number.base": "Runs must be a number.",
        "number.min": "Runs must be a positive number.",
      }),
      striker: Joi.string().required().messages({
        "string.base": "Striker's name must be a string.",
        "string.empty": "Striker's name is required.",
      }),
      nonStriker: Joi.string().required().messages({
        "string.base": "Non-striker's name must be a string.",
        "string.empty": "Non-striker's name is required.",
      }),
      bowler: Joi.string().required().messages({
        "string.base": "Bowler's name must be a string.",
        "string.empty": "Bowler's name is required.",
      }),
      noBall: Joi.number().integer().min(0).max(1).default(0).messages({
        "number.base": "No-ball flag must be a number.",
        "number.min": "No-ball flag must be either 0 or 1.",
        "number.max": "No-ball flag must be either 0 or 1.",
      }),
      wideBall: Joi.number().integer().min(0).max(1).default(0).messages({
        "number.base": "Wide-ball flag must be a number.",
        "number.min": "Wide-ball flag must be either 0 or 1.",
        "number.max": "Wide-ball flag must be either 0 or 1.",
      }),
      over_str: Joi.number().integer().min(1).required().messages({
        "number.base": "Over string must be a number.",
        "any.required": "Over string is required.",
      }),
    });
  }

  validateAdd(req, res, next) {
    const { error } = this.addBallSchema.validate(req.body);

    if (error) {
      return res.status(400).json({
        message: "Validation failed",
        errors: error.details.map((detail) => detail.message),
      });
    }

    next();
  }

  validateUpdate(req, res, next) {
    const { error } = this.updateBallSchema.validate(req.body);

    if (error) {
      return res.status(400).json({
        message: "Validation failed",
        errors: error.details.map((detail) => detail.message),
      });
    }

    next();
  }
}

module.exports = new BallValidator();
