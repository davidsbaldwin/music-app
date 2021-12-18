const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const user = new Schema(
  {
    name: {
      type: String,
      min: 3,
      max: 24,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      min: 6,
      max: 36,
    },
    code: {
      type: String,
      required: true,
    },
    trial: {
      type: Boolean,
      required: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("user", user);
