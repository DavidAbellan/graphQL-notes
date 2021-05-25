const mongoose = require('mongoose');
const courseSchema = mongoose.Schema({
    name : String,
    languaje: String,
    date: String,
    professorId : String
})
const Course = mongoose.model('curso', courseSchema);

module.exports = Course