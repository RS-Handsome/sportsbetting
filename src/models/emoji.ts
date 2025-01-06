var mongoose = require("mongoose"),
  Schema = mongoose.Schema;
var EmojiSchema = new Schema(
  {
    content: { type: String, default: "" },
    emoji: { type: String, default: "" },
  },
  { timestamps: true }
);

module.exports = mongoose.model(
  "Emoji",
  EmojiSchema,
  "emojis"
);