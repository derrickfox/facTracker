'use strict';

var express = require('express');
var app = express();
var router = express.Router();
var mongoose = require('mongoose');
var Fact = mongoose.model('Fact');
var Tag = mongoose.model('Tag');
var User = mongoose.model('User');
var jwt = require('express-jwt');
var cors = require('cors');

app.use(cors());

// Setting up Middleware here...

var authCheck = jwt({
    // TODO Configure Me or I Won't Work!!
    secret: new Buffer('C4kOQd7qvkMG6jnkI_QQjkosyUx3ap8KufMwBcWQIV_Skm92LTZsgKM4KbXBXGv4'),
    audience: 'AtIFffBkNSn1ohWviV9CneIuoxTURDpb'
});

// ... middleware finished here.

// app.get('/public', function (req, res) {
//     res.json({message: "Hello from a public endpoint. No Auth Needed...yay"});
// });
//
// app.get('/private', authCheck, function (req, res) {
//     console.log(req);
//     res.json({message: "Hello from a private endpoint. You need to be authenticated"});
// });

router.route('/public')
    .get(function (req, res) {
        res.json({message: "Hello from a public FacTracker endpoint. No Auth Needed...yay"});
    });

router.route('/private')
    .get(authCheck, function (req, res) {
        res.json({message: "Priavte Point Reached: Good thing you have access ;) "});
    });


router.route('/tags')
    //creates a new tag
    .post(function(req, res){
        var tag = new Tag();
        tag.tagName = req.body.tagName;
        tag.save(function(err, tag) {
            if (err){
                return res.send(500, err);
            }
            return res.json(tag);
        });
    })
    //gets all tags
    .get(function(req, res){
        Tag.find(function(err, tags){
            if(err){
                return res.send(500, err);
            }
            return res.send(200,tags);
        });
    });

//fact-specific commands.
router.route('/tags/:id')
    //gets specified tag
    .get(function(req, res){
        Tag.findById(req.params.id, function(err, tag){
            if(err)
                res.send(err);
            res.json(tag);
        });
    })
    //updates specified tag
    .put(function(req, res){
        Tag.findById(req.params.id, function(err, tag){
            if(err)
                res.send(err);

            tag.tagName = req.body.tagName;

            tag.save(function(err, tag){
                if(err)
                    res.send(err);

                res.json(tag);
            });
        });
    })
    //deletes the tag
    .delete(function(req, res) {
        Tag.remove({
            _id: req.params.id
        }, function(err) {
            if (err)
                res.send(err);
            res.json("deleted :(");
        });
    });

router.route('/facts')
    //creates a new fact
    .post(function(req, res){

        var fact = new Fact();
        fact.factName = req.body.factName;
        fact.factDescription = req.body.factDescription;
        fact.factURL = req.body.factURL;
        fact.factTags = req.body.factTags;
        fact.factSource = req.body.factSource;
        fact.save(function(err, fact) {
            if (err){
                return res.send(500, err);
            }
            return res.json(fact);
        });
    })
    //gets all facts
    .get(function(req, res){
        Fact.find(function(err, facts){
            if(err){
                return res.send(500, err);
            }
            return res.send(200,facts);
        });
    });

//fact-specific commands.
router.route('/facts/:id')
    //gets specified fact
    .get(function(req, res){
        Fact.findById(req.params.id, function(err, fact){
            if(err)
                res.send(err);
            res.json(fact);
        });
    })
    //updates specified fact
    .put(function(req, res){
        Fact.findById(req.params.id, function(err, fact){
            if(err)
                res.send(err);

            fact.factName = req.body.factName;
            fact.factDescription = req.body.factDescription;
            fact.factURL = req.body.factURL;
            fact.factTags = req.body.factTags;
            fact.factSource = req.body.factSource;

            fact.save(function(err, fact){
                if(err)
                    res.send(err);

                res.json(fact);
            });
        });
    })
    //deletes the fact
    .delete(function(req, res) {
        Fact.remove({
            _id: req.params.id
        }, function(err) {
            if (err)
                res.send(err);
            res.json("deleted :(");
        });
    });

router.route('/users')
//creates a new user
    .post(function(req, res){

        var user = new User();
        user.userAuth0id = req.body.userAuth0id;
        user.userFirstName = req.body.userFirstName;
        user.userLastName = req.body.userLastName;
        user.userEmail = req.body.userEmail;
        user.userFavoriteArticles = req.body.userFavoriteArticles;
        user.userArticlesAdded = req.body.userArticlesAdded;
        user.save(function(err, user) {
            if (err){
                return res.send(500, err);
            }
            return res.json(user);
        });
    })
    //gets all users
    .get(function(req, res){
        User.find(function(err, users){
            if(err){
                return res.send(500, err);
            }
            return res.send(200,users);
        });
    });

//user-specific commands.
router.route('/users/:id')
    //gets specified user
    .get(function(req, res){
        User.findById(req.params.id, function(err, user){
            if(err)
                res.send(err);
            res.json(user);
        });
    })
    //updates specified user
    .put(function(req, res){
        User.findById(req.params.id, function(err, user){
            if(err)
                res.send(err);

            user.userAuth0id = req.body.userAuth0id;
            user.userFirstName = req.body.userFirstName;
            user.userLastName = req.body.userLastName;
            user.userEmail = req.body.userEmail;
            user.userFavoriteArticles = req.body.userFavoriteArticles;
            user.userArticlesAdded = req.body.userArticlesAdded;

            user.save(function(err, user){
                if(err)
                    res.send(err);

                res.json(user);
            });
        });
    })
    //deletes the user
    .delete(function(req, res) {
        User.remove({
            _id: req.params.id
        }, function(err) {
            if (err)
                res.send(err);
            res.json("deleted :(");
        });
    });

//get specific user by user's Auth0 ID number.
router.route('/getuser/:userAuth0id').get(function (reg, res) {
            User.findOne({ 'userAuth0id': '58c414323c9c2b7caff4b629' }, 'userAuth0id userFirstName userLastName userEmail userFavoriteArticles userArticlesAdded', function (err, user) {
                if(err)
                    res.send(err);
                    console.log("Error found in the call dude.");
                res.json(user);
                console.log(user);
            });
        });

module.exports = router;
console.log('App is running on http://localhost:3000/#/');
