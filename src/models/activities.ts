var mongoose = require("mongoose"),
  Schema = mongoose.Schema;
var ActivitySchema = new Schema(
  {
    TgId: { type: Number, required: true },
    CurrentSport: { type: String, default: "" },
    CurrentMatch: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model(
  "Activities",
  ActivitySchema,
  "activities"
);