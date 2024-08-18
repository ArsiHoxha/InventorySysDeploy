// models/User.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  googleId: String,
  email: String,
  displayName: String,
  profileImage: String,
  isAdmin: Boolean,
  blocked: {
    type: Boolean,
    default: false
  },
  pending: {
    type: Boolean,
    default: true
  }
});

const User = mongoose.model('UserHarry-Fultz', userSchema);

module.exports = User;
