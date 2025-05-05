const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  username: String,
  email: String,
  password: String,
  favourite: [{ type: mongoose.Schema.Types.ObjectId, ref: "Item" }], // Array of favorite item IDs
});

module.exports = mongoose.model("User", UserSchema);
