var express = require('express');
var router = express.Router();
var mongoose = require( 'mongoose' );
var Fact = mongoose.model('Fact');
var Tag = mongoose.model('Tag');

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

module.exports = router;
