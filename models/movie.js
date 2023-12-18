const mongoose = require('mongoose');

const userMovie = new mongoose.Schema({}, { versionKey: false });

module.exports = mongoose.model('movie', userMovie);
