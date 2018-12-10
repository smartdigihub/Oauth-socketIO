const mongoose = require('mongoose');
const Schema = mongoose.Schema;

mongoose.Promise = global.Promise;

const userSchema = new Schema({
    username: String,
    googleId: String,
    thumbnail: String
});

const User = mongoose.model('user', userSchema);

module.exports = User;
