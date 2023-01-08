const mongoose = require("mongoose");
const findOrCreate = require("mongoose-findorcreate");

const Schema = mongoose.Schema;

const UserSchema = new Schema({
  firstName: String,
  lastName: String,
  recipes: [{ type: Schema.Types.ObjectId, ref: "Recipe" }],
});

UserSchema.plugin(findOrCreate);

module.exports = mongoose.model("User", UserSchema);
