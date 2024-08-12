const Match = require("../models/Match");
const ResponseHandler = require("../utils/ResponseHandler");

class MatchController {
  async createMatch(req, res) {
    try {
      const { striker, nonStriker, bowler } = req.body;

      // Create a new match instance
      const newMatch = new Match({
        striker,
        nonStriker,
        bowler: { key: bowler },
      });

      // Save the match to the database
      const savedMatch = await newMatch.save();

      return ResponseHandler.success(
        res,
        "Match created successfully",
        savedMatch,
        201
      );
    } catch (error) {
      return ResponseHandler.error(res, "Failed to create match", error);
    }
  }

  // Method to get match details
  async getMatchDetails(req, res) {
    try {
      const { matchId } = req.params;

      // Fetch match data from the database
      const matchData = await Match.findById(matchId);

      // If match data is not found
      if (!matchData) {
        return ResponseHandler.error(res, "Match not found", null, 404);
      }

      return ResponseHandler.success(
        res,
        "Match details retrieved successfully",
        matchData
      );
    } catch (error) {
      return ResponseHandler.error(res, "Failed to fetch match details", error);
    }
  }
}

module.exports = new MatchController();
