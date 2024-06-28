// models/User.js
const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  username: String,
  password: String,
});

const User = mongoose.model('user_login', UserSchema);

module.exports = User;