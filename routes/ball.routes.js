const express = require("express");
const BallController = require("../controller/ball.controller");
const BallValidator = require("../middlewares/ballValidation");

class BallRoutes {
  constructor() {
    this.router = express.Router();
    this.initializeRoutes();
  }

  initializeRoutes() {
    /**
     * @api {post} /balls Add a ball to the match
     * @apiName AddBall
     * @apiGroup Ball
     *
     * @apiBody {String} matchId ID of the match.
     * @apiBody {Number} runs Number of runs scored.
     * @apiBody {String} striker Name of the striker.
     * @apiBody {String} nonStriker Name of the non-striker.
     * @apiBody {String} bowler Name of the bowler.
     * @apiBody {Number} [noBall=0] Indicates if the ball is a no-ball (0 or 1).
     * @apiBody {Number} [over_str=0] The over in which the ball was bowled.
     *
     * @apiSuccess {String} message Success message.
     * @apiSuccess {Object} data The created ball object.
     * @apiSuccess {String} data._id Ball ID.
     * @apiSuccess {String} data.matchId Match ID.
     * @apiSuccess {Number} data.runs Number of runs scored.
     * @apiSuccess {Date} data.created_at Ball creation date.
     *
     * @apiError (400) {String} message Validation failed.
     * @apiError (404) {String} message Match not found.
     * @apiError (500) {String} message Failed to add ball.
     */
    this.router.post(
      "/",
      BallValidator.validateAdd.bind(BallValidator),
      BallController.addBall.bind(BallController)
    );

    /**
     * @api {put} /balls Update a ball in the match
     * @apiName UpdateBall
     * @apiGroup Ball
     *
     *
     * @apiBody {String} ballId ID of the ball to update.
     * @apiBody {Number} runs Number of runs scored.
     * @apiBody {String} striker Name of the striker.
     * @apiBody {String} nonStriker Name of the non-striker.
     * @apiBody {String} bowler Name of the bowler.
     * @apiBody {Number} [noBall=0] Indicates if the ball is a no-ball (0 or 1).
     * @apiBody {Number} [over_str=0] The over in which the ball was bowled.
     *
     * @apiSuccess {String} message Success message.
     * @apiSuccess {Object} data The updated ball object.
     *
     * @apiError (400) {String} message Validation failed.
     * @apiError (404) {String} message Ball not found.
     * @apiError (500) {String} message Failed to update ball.
     */
    this.router.put(
      "/",
      BallValidator.validateUpdate.bind(BallValidator),
      BallController.updatedBall.bind(BallController)
    );

    // this.router.get("/", BallController.getAllBalls.bind(BallController));
  }
}

module.exports = new BallRoutes().router;
