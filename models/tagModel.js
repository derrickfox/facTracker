var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var tagSchema = new mongoose.Schema({
    tagName: String
});


mongoose.model('Tag', tagSchema);
