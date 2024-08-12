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
    this.router.post(
      "/",
      MatchValidation.validate.bind(MatchValidation),
      MatchController.createMatch.bind(MatchController)
    );
    this.router.get(
      "/:matchId",
      MatchController.getMatchDetails.bind(MatchController)
    );
  }
}

module.exports = new MatchRoutes().router;
