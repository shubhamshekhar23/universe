const mongoose = require("mongoose");

var Person = new mongoose.Schema({
  name: String,
  sex: String,
  age: Number,
  familyId: {
    type: mongoose.Schema.ObjectId,
    ref: "Family"
  }
});

module.exports = mongoose.model("Person", Person);
