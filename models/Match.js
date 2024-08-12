const mongoose = require("mongoose");

const MatchSchema = new mongoose.Schema({
  totalRuns: {
    type: Number,
    default: 0,
  },
  crr: {
    type: Number,
    default: 0,
  },
  noBall: {
    type: Number,
    default: 0,
  },
  wideBall: {
    type: Number,
    default: 0,
  },
  fours: {
    type: Number,
    default: 0,
  },
  sixes: {
    type: Number,
    default: 0,
  },
  striker: {
    type: String,
    required: true,
  },
  nonStriker: {
    type: String,
    required: true,
  },
  bowler: {
    key: {
      type: String,
      required: true,
    },
  },
  over_str: {
    type: Number,
    default: 0,
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
  updated_at: {
    type: Date,
    default: Date.now,
  },
});

const Match = mongoose.model("Match", MatchSchema);
module.exports = Match;
