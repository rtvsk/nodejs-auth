const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  login: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 255
  },
  password: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 1024
  },
  email: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 255
  },
  date: {
    type: Date,
    default: Date.now
  },
});

module.exports = mongoose.model('User', userSchema);