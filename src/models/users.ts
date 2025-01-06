var mongoose = require("mongoose"),
  Schema = mongoose.Schema;
var UsersSchema = new Schema(
  {
    TgId: { type: Number, required: true },
    FirstName: { type: String, default: ""},
    UserName: { type: String, default: ""},
    Premium: { type: Boolean, default: false },
    Favourite: { type: Array, default: [] },
    Alert: { type: Array, default: [] },
  },
  { timestamps: true }
);

module.exports = mongoose.model(
  "Users",
  UsersSchema,
  "users"
);