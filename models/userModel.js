var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchema = new mongoose.Schema({
    userAuth0id: String,
    userFirstName: String,
    userLastName: String,
    userEmail: String,
    userFavoriteArticles: Array,
    userArticlesAdded: Array
});


mongoose.model('User', userSchema);
