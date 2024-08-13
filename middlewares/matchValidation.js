const Joi = require('joi');

class MatchValidator {
  constructor() {
    this.createMatchSchema = Joi.object({
      striker: Joi.string(),
      nonStriker: Joi.string(),
      bowler: Joi.string(),
      over_str: Joi.number().integer().min(1)
    });

    this.updateMatchSchema = Joi.object({
      striker: Joi.string(),
      nonStriker: Joi.string(),
      bowler: Joi.string(),
      over_str: Joi.number().integer().min(1)
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
