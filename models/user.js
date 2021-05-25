const mongoose = require('mongoose');
const userSchema = mongoose.Schema({
    name : String,
    email: String,
    date: String,
    password : String
})
const User = mongoose.model('usuario', userSchema);

module.exports = User