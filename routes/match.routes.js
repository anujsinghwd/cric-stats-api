// routes/MatchRoutes.js
const express = require("express");
const MatchController = require("../controller/match.controller");
const MatchValidation = require("../middlewares/matchValidation");

class MatchRoutes {
  constructor() {
    this.router = express.Router();
    this.initializeRoutes();
  }

  initializeRoutes() {
    /**
     * @api {post} /matches Create a new match
     * @apiName CreateMatch
     * @apiGroup Match
     *
     * @apiBody {String} striker Name of the striker.
     * @apiBody {String} nonStriker Name of the non-striker.
     * @apiBody {String} bowler Name of the bowler.
     * @apiBody {Number} [over_str=0] The starting over for the match.
     *
     * @apiSuccess {String} message Success message.
     * @apiSuccess {Object} data The created match object.
     * @apiSuccess {String} data._id Match ID.
     * @apiSuccess {String} data.striker Striker's name.
     * @apiSuccess {String} data.nonStriker Non-striker's name.
     * @apiSuccess {Object} data.bowler Bowler details.
     * @apiSuccess {Date} data.created_at Match creation date.
     *
     * @apiError (400) {String} message Validation failed.
     * @apiError (500) {String} message Failed to create match.
     */
    this.router.post(
      "/",
      MatchValidation.validateCreate.bind(MatchValidation),
      MatchController.createMatch.bind(MatchController)
    );

    /**
     * @api {get} /matches get match stats
     * @apiName Get a Match
     * @apiGroup Match
     * 
     * 
     * @apiParam {String} matchId Match ID
     * 
    */
    this.router.get(
      "/:matchId",
      MatchValidation.validateUpdate.bind(MatchValidation),
      MatchController.getMatchDetails.bind(MatchController)
    );
  }
}

module.exports = new MatchRoutes().router;
