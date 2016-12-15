var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var factSchema = new mongoose.Schema({
    factName: String,		//should be changed to ObjectId, ref "User"
    factDescription: String,
    factURL: String,
    factTags: Array
});


mongoose.model('Fact', factSchema);
