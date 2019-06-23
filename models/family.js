const mongoose = require('mongoose');

var Family = new mongoose.Schema({
    name : String,
    details: String
})

module.exports = mongoose.model('Family', Family);