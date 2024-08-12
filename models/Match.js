const mongoose = require('mongoose');
const { Schema } = mongoose;

const MatchSchema = new Schema({
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
  totalBallsPlayed: {
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
  batsmanStats: [
    {
      batsman: { type: String, required: true },
      runs: { type: Number, default: 0 },
      ballsFaced: { type: Number, default: 0 },
      strikeRate: { type: Number, default: 0 },
    },
  ],
  bowlerStats: [
    {
      bowler: { type: String, required: true },
      runsConceded: { type: Number, default: 0 },
      deliveries: { type: Number, default: 0 },
      noBallsConceded: { type: Number, default: 0 },
      economyRate: { type: Number, default: 0 },
    },
  ],
  created_at: {
    type: Date,
    default: Date.now,
  },
  updated_at: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Match', MatchSchema);
