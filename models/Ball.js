const mongoose = require('mongoose');
const { Schema } = mongoose;

const BallSchema = new Schema({
  matchId: {
    type: Schema.Types.ObjectId,
    ref: 'Match',
    required: true,
  },
  runs: {
    type: Number,
    default: 0,
    required: true,
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
  noBall: {
    type: Number,
    default: 0,
  },
  wideBall: {
    type: Number,
    default: 0,
  },
  over_str: {
    type: Number,
    default: 0,
    required: true,
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

module.exports = mongoose.model('Ball', BallSchema);