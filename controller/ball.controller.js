const mongoose = require("mongoose");
const Ball = require("../models/Ball");
const Match = require("../models/Match");
const utils = require('../utils/utils');
const ResponseHandler = require("../utils/ResponseHandler");

class BallController {
  async addBall(req, res) {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const {
        matchId,
        runs,
        striker,
        nonStriker,
        bowler,
        noBall,
        wideBall,
        over_str,
      } = req.body;

      const newBall = {
        matchId,
        runs,
        striker,
        nonStriker,
        bowler: { key: bowler },
        noBall,
        over_str,
      };

      if (wideBall === 0 || wideBall) {
        newBall.wideBall = wideBall;
      }

      // Create and save the ball data
      const ball = new Ball(newBall);

      const savedBall = await ball.save({ session });

      // Fetch the match document
      const match = await Match.findById(matchId).session(session);

      if (!match) {
        await session.abortTransaction();
        session.endSession();
        return ResponseHandler.error(res, "Match not found", null, 404);
      }

      // Update match statistics
      match.totalRuns += runs;
      match.noBall += noBall || 0;
      match.wideBall += wideBall || 0;

      if (runs === 4) {
        match.fours = (match.fours || 0) + 1;
      } else if (runs === 6) {
        match.sixes = (match.sixes || 0) + 1;
      }

      // Update striker statistics
      let strikerStats = match.batsmanStats.find((b) => b.batsman === striker);
      if (!strikerStats) {
        strikerStats = {
          batsman: striker,
          runs: runs,
          ballsFaced: 1,
          strikeRate: runs * 100,
        };
        match.batsmanStats.push(strikerStats);
      } else {
        strikerStats.runs += runs;
        strikerStats.ballsFaced += 1;
        strikerStats.strikeRate =
          (strikerStats.runs / strikerStats.ballsFaced) * 100;
      }

      // Update non-striker statistics (if applicable)
      if (!noBall && !wideBall) {
        let nonStrikerStats = match.batsmanStats.find(
          (b) => b.batsman === nonStriker
        );
        if (!nonStrikerStats) {
          nonStrikerStats = {
            batsman: nonStriker,
            runs: 0,
            ballsFaced: 0,
            strikeRate: 0,
          };
          match.batsmanStats.push(nonStrikerStats);
        }
      }

      // Update bowler statistics
      let bowlerStats = match.bowlerStats.find((b) => b.bowler === bowler);
      if (!bowlerStats) {
        bowlerStats = {
          bowler: bowler,
          runsConceded: runs,
          deliveries: 1,
          noBallsConceded: noBall || 0,
          economyRate: (runs/(1/6)).toFixed(2),
        };
        match.bowlerStats.push(bowlerStats);
      } else {
        bowlerStats.runsConceded += runs;
        bowlerStats.deliveries += 1;
        bowlerStats.noBallsConceded += noBall || 0;
        bowlerStats.economyRate = (
          bowlerStats.runsConceded /
          (bowlerStats.deliveries / 6)
        ).toFixed(2);
      }

      // Update match CRR and other details
      match.crr = calculateCRR(match);
      match.over_str = over_str;
      match.updated_at = Date.now();
      match.totalBallsPlayed += (!noBall && !wideBall) ? 1 : 0;
      // Save the updated match document
      await match.save({ session });

      await session.commitTransaction();
      session.endSession();

      return ResponseHandler.success(
        res,
        "Ball added successfully",
        savedBall,
        201
      );
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      console.error("Error adding ball:", error);
      return ResponseHandler.error(res, "Failed to add ball", error);
    }
  }

  async updatedBall(req, res) {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
      const { ballId } = req.params;
      const { runs, striker, nonStriker, bowler, noBall, wideBall, over_str } =
        req.body;

      // Find the ball by ID
      const ball = await Ball.findById(ballId).session(session);
      if (!ball) {
        await session.abortTransaction();
        session.endSession();
        return ResponseHandler.error(res, "Ball not found", null, 404);
      }

      // Find the match by ID
      const match = await Match.findById(ball.matchId).session(session);

      if (!match) {
        await session.abortTransaction();
        session.endSession();
        return ResponseHandler.error(res, "Match not found", null, 404);
      }

      // Reverse the previous stats before applying the update
      const previousRuns = ball.runs;
      const previousNoBall = ball.noBall || 0;
      const previousWideBall = ball.wideBall || 0;
      const previousStriker = ball.striker;
      const previousNonStriker = ball.nonStriker;
      const previousBowler = ball.bowler.key;

      // Reverse match stats
      match.totalRuns -= previousRuns;
      match.noBall -= previousNoBall;
      match.wideBall -= previousWideBall;

      if (previousRuns === 4) {
        match.fours = (match.fours || 0) - 1;
      } else if (previousRuns === 6) {
        match.sixes = (match.sixes || 0) - 1;
      }

      // console.log('match', match);return;
      // Reverse striker stats
      const previousStrikerStats = match.batsmanStats.find(
        (b) => b.batsman === previousStriker
      );
      
      if (previousStrikerStats) {
        previousStrikerStats.runs -= previousRuns;
        previousStrikerStats.ballsFaced -= 1;
        previousStrikerStats.strikeRate =
          (previousStrikerStats.runs / previousStrikerStats.ballsFaced) * 100;
      }

      // Reverse non-striker stats
      if (!previousNoBall && !previousWideBall) {
        const previousNonStrikerStats = match.batsmanStats.find(
          (b) => b.batsman === previousNonStriker
        );
        if (previousNonStrikerStats) {
          previousNonStrikerStats.ballsFaced -= 1;
          previousNonStrikerStats.strikeRate =
            (previousNonStrikerStats.runs /
              previousNonStrikerStats.ballsFaced) *
            100;
        }
      }

      // Reverse bowler stats
      const previousBowlerStats = match.bowlerStats.find(
        (b) => b.bowler === previousBowler
      );
      if (previousBowlerStats) {
        previousBowlerStats.runsConceded -= previousRuns;
        previousBowlerStats.deliveries -= 1;
        previousBowlerStats.noBallsConceded -= previousNoBall;
        previousBowlerStats.economyRate = (
          previousBowlerStats.runsConceded /
          (previousBowlerStats.deliveries / 6)
        ).toFixed(2);
      }

      // Update the ball details
      ball.runs = runs;
      ball.striker = striker;
      ball.nonStriker = nonStriker;
      ball.bowler.key = bowler;
      ball.noBall = noBall;
      ball.wideBall = wideBall;
      ball.over_str = over_str;

      const updatedBall = await ball.save({ session });

      // Apply the new stats
      match.totalRuns += runs;
      match.noBall += noBall || 0;
      match.wideBall += wideBall || 0;

      if (runs === 4) {
        match.fours = (match.fours || 0) + 1;
      } else if (runs === 6) {
        match.sixes = (match.sixes || 0) + 1;
      }

      // Update striker stats
      let strikerStats = match.batsmanStats.find((b) => b.batsman === striker);
      
      if (!strikerStats) {
        strikerStats = {
          batsman: striker,
          runs: 0,
          ballsFaced: 1,
          strikeRate: 0,
        };
        match.batsmanStats.push(strikerStats);
      } else {
        strikerStats.runs += runs;
        strikerStats.ballsFaced += 1;
        strikerStats.strikeRate =
        strikerStats.runs > 0 ? ((strikerStats.runs / strikerStats.ballsFaced) * 100) : 0;
      }

      // Update non-striker stats (if applicable)
      if (!noBall && !wideBall) {
        let nonStrikerStats = match.batsmanStats.find(
          (b) => b.batsman === nonStriker
        );
        if (!nonStrikerStats) {
          nonStrikerStats = {
            batsman: nonStriker,
            runs: 0,
            ballsFaced: 0,
            strikeRate: 0,
          };
          match.batsmanStats.push(nonStrikerStats);
        } else {
          nonStrikerStats.ballsFaced += 1;
          nonStrikerStats.strikeRate =
          nonStrikerStats.runs > 0 ? ((nonStrikerStats.runs / nonStrikerStats.ballsFaced) * 100) : 0;
        }
      }

      // Update bowler stats
      let bowlerStats = match.bowlerStats.find((b) => b.bowler === bowler);
      if (!bowlerStats) {
        bowlerStats = {
          bowler: bowler,
          runsConceded: 0,
          deliveries: 0,
          noBallsConceded: 0,
          economyRate: 0,
        };
        match.bowlerStats.push(bowlerStats);
      } else {
        bowlerStats.runsConceded += runs;
        bowlerStats.deliveries += 1;
        bowlerStats.noBallsConceded += noBall || 0;
        bowlerStats.economyRate = (
          bowlerStats.runsConceded /
          (bowlerStats.deliveries / 6)
        ).toFixed(2);
      }
      
      // Update match CRR and other details
      match.crr = calculateCRR(match);
      match.over_str = over_str;
      match.updated_at = Date.now();
      await match.save({ session });

      await session.commitTransaction();
      session.endSession();

      return ResponseHandler.success(
        res,
        "Ball updated successfully",
        updatedBall,
        200
      );
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      console.error("Error updating ball:", error);
      return ResponseHandler.error(res, "Failed to update ball", error);
    }
  }

  async getAllBalls(req, res) {
    const balls = await Ball.find({}).sort({ created_at: 1 });
    return ResponseHandler.success(
      res,
      "Balls data retrieved successfully",
      balls,
      200
    );
  }
}

function calculateCRR(match) {
  let oversCount = utils.calculateOvers(match.totalBallsPlayed) || 1;
  // Implement the logic to calculate the Current Run Rate (CRR)
  return match.totalRuns > 0 ? (match.totalRuns / oversCount) : 0;
}

module.exports = new BallController();
