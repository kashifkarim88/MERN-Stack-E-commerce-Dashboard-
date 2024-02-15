const mongoose = require("mongoose");
const userCollection = "users";

const userSchema = new mongoose.Schema(
  {
    name: String,
    email: String,
    phone: String,
    password: String,
  },
  { versionKey: false }
);


module.exports = new mongoose.model(userCollection, userSchema);
