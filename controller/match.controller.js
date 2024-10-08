const Match = require("../models/Match");
const Ball = require("../models/Ball");
const ResponseHandler = require("../utils/ResponseHandler");

class MatchController {
  // Method to create a new match
  async createMatch(req, res) {
    try {
      const { striker, nonStriker, bowler, over_str } = req.body;

      const newMatch = {};

      if (over_str === 0 || over_str) {
        newMatch.over_str = over_str;
      }

      if (striker) {
        newMatch.striker = striker;
      }
      if (nonStriker) {
        newMatch.nonStriker = nonStriker;
      }
      if (bowler) {
        newMatch.bowler = { key: bowler };
      }

      // Create a new match instance
      const match = new Match(newMatch);

      // Save the match to the database
      const savedMatch = await match.save();

      // Return success response
      return ResponseHandler.success(
        res,
        "Match created successfully",
        savedMatch,
        201
      );
    } catch (error) {
      console.error("Error creating match:", error);
      return ResponseHandler.error(res, "Failed to create match", error);
    }
  }

  // Method to get match details
  async getMatchDetails(req, res) {
    try {
      const { matchId } = req.params;

      // Fetch match details
      const match = await Match.findById(matchId);

      if (!match) {
        return ResponseHandler.error(res, "Match not found", null, 404);
      }

      // Aggregate ball details for batsman and bowler stats
      const batsmanStats = match.batsmanStats.map((stat) => ({
        batsman: stat.batsman,
        runs: stat.runs,
        ballsFaced: stat.ballsFaced,
        strikeRate: stat.strikeRate.toFixed(2),
      }));

      const bowlerStats = match.bowlerStats.map((stat) => ({
        bowler: stat.bowler,
        runsConceded: stat.runsConceded,
        deliveries: stat.deliveries,
        noBallsConceded: stat.noBallsConceded,
        economyRate: stat.economyRate.toFixed(2),
      }));

      // Prepare response data
      const responseData = {
        match: {
          totalRuns: match.totalRuns,
          crr: match.crr.toFixed(2),
          noBall: match.noBall,
          wideBall: match.wideBall,
          fours: match.fours,
          sixes: match.sixes,
          totalBallsPlayed: match.totalBallsPlayed,
          striker: match.striker,
          nonStriker: match.nonStriker,
          bowler: match.bowler,
          over_str: match.over_str,
          batsmanStats,
          bowlerStats,
          created_at: match.created_at,
          updated_at: match.updated_at,
        }
      };

      return ResponseHandler.success(
        res,
        "Match details retrieved successfully",
        responseData,
        200
      );
    } catch (error) {
      console.error("Error retrieving match details:", error);
      return ResponseHandler.error(
        res,
        "Failed to retrieve match details",
        error
      );
    }
  }
}

module.exports = new MatchController();
