var mongoose = require("mongoose"),
  Schema = mongoose.Schema;
var BasketballSchema = new Schema(
  {
    GameId: { type: Number, required: true },
    GameTitle: { type: String, required: true },
    Time: { type: String, default: "" },
    Status: { type: String, default: "" },
    Link: { type: String, default: "" },
  },
  { timestamps: true }
);

module.exports = mongoose.model(
  "Basketball",
  BasketballSchema,
  "basketball"
);