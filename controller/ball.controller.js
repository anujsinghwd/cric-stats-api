const mongoose = require("mongoose");
const Ball = require("../models/Ball");
const Match = require("../models/Match");
const ResponseHandler = require("../utils/ResponseHandler");

class BallController {
  async addBall(req, res) {
    const session = await mongoose.startSession();
    session.startTransaction();
    
    try {
      const { matchId, runs, striker, nonStriker, bowler, noBall, wideBall, over_str } = req.body;
  
      // Create and save the ball data
      const ball = new Ball({
        matchId,
        runs,
        striker,
        nonStriker,
        bowler: { key: bowler },
        noBall,
        over_str,
      });
  
      const savedBall = await ball.save({ session });
  
      // Update the match data
      const match = await Match.findById(matchId).session(session);
  
      if (!match) {
        await session.abortTransaction();
        session.endSession();
        return ResponseHandler.error(res, "Match not found", null, 404);
      }
  
      match.totalRuns += runs;
      match.noBall += noBall || 0;
      match.wideBall += wideBall || 0;
      
      // Update number of fours and sixes
      if (runs === 4) {
        match.fours = (match.fours || 0) + 1;
      } else if (runs === 6) {
        match.sixes = (match.sixes || 0) + 1;
      }
  
      // Recalculate current run rate (CRR)
      match.crr = calculateCRR(match);
      match.over_str = over_str;
      match.updated_at = Date.now();
  
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
      return ResponseHandler.error(res, "Failed to add ball", error);
    }
  }

  async updateBall(req, res) {
    try {
      const { ballId } = req.params;
      const { runs, striker, nonStriker, bowler, noBall, over_str } = req.body;

      // Find and update the ball data
      const ball = await Ball.findByIdAndUpdate(
        ballId,
        {
          runs,
          striker,
          nonStriker,
          bowler: { key: bowler },
          noBall: noBall || 0,
          over_str,
          updated_at: Date.now(),
        },
        { new: true }
      );

      if (!ball) {
        return ResponseHandler.error(res, "Ball not found", null, 404);
      }

      // Update the match data accordingly
      const match = await Match.findById(ball.matchId);

      if (!match) {
        return ResponseHandler.error(res, "Match not found", null, 404);
      }

      // Recalculate match stats
      const originalBall = await Ball.findById(ballId);
      match.totalRuns = match.totalRuns - originalBall.runs + runs;
      match.noBall = match.noBall - originalBall.noBall + noBall;
      match.crr = calculateCRR(match); // Update with the new run rate
      match.over_str = over_str;
      match.updated_at = Date.now();

      await match.save();

      return ResponseHandler.success(res, "Ball updated successfully", ball);
    } catch (error) {
      console.error("Error updating ball:", error);
      return ResponseHandler.error(res, "Failed to update ball", error);
    }
  }
}

function calculateCRR(match) {
  // Implement the logic to calculate the Current Run Rate (CRR)
  return match.totalRuns > 0 ? (match.totalRuns / match.over_str) : 0;
}

module.exports = new BallController();
