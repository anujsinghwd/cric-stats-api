const Joi = require('joi');

class MatchValidator {
  constructor() {
    this.createMatchSchema = Joi.object({
      striker: Joi.string().required().messages({
        'string.empty': 'Striker is required.',
        'any.required': 'Striker is required.'
      }),
      nonStriker: Joi.string().required().messages({
        'string.empty': 'Non-striker is required.',
        'any.required': 'Non-striker is required.'
      }),
      bowler: Joi.string().required().messages({
        'string.empty': 'Bowler is required.',
        'any.required': 'Bowler is required.'
      }),
      over_str: Joi.number().integer().min(0).default(0).messages({
        'number.base': 'Starting over must be a number.',
        'number.integer': 'Starting over must be an integer.',
        'number.min': 'Starting over cannot be negative.'
      })
    });

    this.updateMatchSchema = Joi.object({
      striker: Joi.string(),
      nonStriker: Joi.string(),
      bowler: Joi.string(),
      over_str: Joi.number().integer().min(0)
    });
  }

  validateCreate(req, res, next) {
    const { error } = this.createMatchSchema.validate(req.body);

    if (error) {
      return res.status(400).json({
        message: 'Validation failed',
        errors: error.details.map((detail) => detail.message)
      });
    }

    next();
  }

  validateUpdate(req, res, next) {
    const { error } = this.updateMatchSchema.validate(req.body);

    if (error) {
      return res.status(400).json({
        message: 'Validation failed',
        errors: error.details.map((detail) => detail.message)
      });
    }

    next();
  }
}

module.exports = new MatchValidator();
