const mongoose = require("mongoose");
// var universe = require("./universe");
// var person = require("./person");
// var family = require("./family");

var Powermap = new mongoose.Schema({
  universeId: {
    type: mongoose.Schema.ObjectId,
    ref: "Universe"
  },
  personId: {
    type: mongoose.Schema.ObjectId,
    ref: "Person"
  },
  familyId: {
    type: mongoose.Schema.ObjectId,
    ref: "Family"
  },
  power: Number
});

module.exports = mongoose.model("Powermap", Powermap);
