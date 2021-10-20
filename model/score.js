var mongoose = require("mongoose");

var Schema = mongoose.Schema;

const opts = {
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
  timestamps: true,
};

const ScoreSchema = new Schema(
  {
    amount: {
      type: Number,
      default: 0,
    },
  },
  opts
);

module.exports = mongoose.model("Score", ScoreSchema);
