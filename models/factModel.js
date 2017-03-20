var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var factSchema = new mongoose.Schema({
    factName: String,
    factDescription: String,
    factURL: String,
    factTags: Array,
    factSource: String
});


mongoose.model('Fact', factSchema);
