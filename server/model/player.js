const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Score = {
  amount: {
    type: Number,
    default: 0,
    required: true,
  },
  date: {
    type: Date,
  },
};

const opts = {
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
  timestamps: true,
};

const PlayerSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    text: {
      type: String,
      required: true,
      maxlength: 35,
    },
    color: {
      type: String,
      required: true,
    },
    points: {
      type: [Number],
      default: [],
    },
    scores: {
      type: [Score],
      default: [],
    },
  },
  opts
);

module.exports = mongoose.model("Player", PlayerSchema);
