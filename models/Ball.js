const mongoose = require("mongoose");

const BallSchema = new mongoose.Schema({
  matchId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Match",
    required: true,
  },
  runs: {
    type: Number,
    required: true,
  }, // Runs scored on this ball
  striker: {
    type: String,
    required: true,
  }, // Striker's name
  nonStriker: {
    type: String,
    required: true,
  }, // Non-striker's name
  bowler: {
    key: {
      type: String,
      required: true,
    }, // Bowler's name
  },
  noBall: {
    type: Number,
    default: 0,
  }, // No-ball flag (1 for yes, 0 for no)
  over_str: {
    type: Number,
    required: true,
  }, // Over string (e.g., 3.2)
  created_at: {
    type: Date,
    default: Date.now,
  },
  updated_at: {
    type: Date,
    default: Date.now,
  },
});

const Ball = mongoose.model("Ball", BallSchema);
module.exports = Ball;
