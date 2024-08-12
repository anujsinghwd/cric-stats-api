const Joi = require('joi');

class BallValidator {
  constructor() {
    this.addBallSchema = Joi.object({
      matchId: Joi.string().required().messages({
        'string.empty': 'Match ID is required.',
        'any.required': 'Match ID is required.'
      }),
      runs: Joi.number().integer().min(0).required().messages({
        'number.base': 'Runs must be a number.',
        'number.integer': 'Runs must be an integer.',
        'number.min': 'Runs cannot be negative.',
        'any.required': 'Runs are required.'
      }),
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
      noBall: Joi.number().integer().min(0).max(1).default(0).messages({
        'number.base': 'NoBall must be a number.',
        'number.integer': 'NoBall must be an integer.',
        'number.min': 'NoBall cannot be negative.',
        'number.max': 'NoBall must be 0 or 1.'
      }),
      over_str: Joi.number().integer().min(0).messages({
        'number.base': 'Over_str must be a number.',
        'number.integer': 'Over_str must be an integer.',
        'number.min': 'Over_str cannot be negative.'
      })
    });

    this.updateBallSchema = Joi.object({
      runs: Joi.number().integer().min(0),
      striker: Joi.string(),
      nonStriker: Joi.string(),
      bowler: Joi.string(),
      noBall: Joi.number().integer().min(0).max(1),
      over_str: Joi.number().integer().min(0)
    });
  }

  validateAdd(req, res, next) {
    const { error } = this.addBallSchema.validate(req.body);

    if (error) {
      return res.status(400).json({
        message: 'Validation failed',
        errors: error.details.map((detail) => detail.message)
      });
    }

    next();
  }

  validateUpdate(req, res, next) {
    const { error } = this.updateBallSchema.validate(req.body);

    if (error) {
      return res.status(400).json({
        message: 'Validation failed',
        errors: error.details.map((detail) => detail.message)
      });
    }

    next();
  }
}

module.exports = new BallValidator();
