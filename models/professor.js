const mongoose = require('mongoose');
const professorSchema = mongoose.Schema({
    name : String,
    age: Number,
    date: String,
    active : Boolean
})
const Professor = mongoose.model('profesor', professorSchema);

module.exports = Professor