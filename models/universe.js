const mongoose = require('mongoose');

var Universe = new mongoose.Schema({
    name : String,
    details: String
})

module.exports = mongoose.model('Universe', Universe);