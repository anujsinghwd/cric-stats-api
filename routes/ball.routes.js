const express = require("express");
const BallController = require("../controller/ball.controller");
const BallValidator = require("../middlewares/ballValidation");

class BallRoutes {
  constructor() {
    this.router = express.Router();
    this.initializeRoutes();
  }

  initializeRoutes() {
    this.router.post(
      "/",
      BallValidator.validateBall.bind(BallValidator),
      BallController.addBall.bind(BallController)
    );

    this.router.put(
      "/:ballId",
      BallValidator.validateBall.bind(BallValidator),
      BallController.updateBall.bind(BallController)
    );
  }
}

module.exports = new BallRoutes().router;
