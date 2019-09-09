var express = require('express');
var router = express.Router();

let Creature = require('../creature.model');

router.route('/').get(function(req, res) {
    var selectQuery = Creature.find().sort({'name': 1});
    if(req.query.offset && !isNaN(req.query.offset))
        selectQuery = selectQuery.skip(Number.parseInt(req.query.offset));
    if(req.query.limit && !isNaN(req.query.limit))
        selectQuery = selectQuery.limit(Number.parseInt(req.query.limit));
    selectQuery.exec(function(err, creatures) {
        if(err) {
            console.log(err);
        } else {
            res.json(creatures);
        }
    });
});

router.route('/:id').get(function(req, res) {
    let id = req.params.id;
    Creature.findById(id, function(err, creature) {
        if(err) {
            console.log(err);
        } else {
            if (!creature)
                res.status(404).send("data is not found");
            else
                res.json(creature);
        }
    });
});

router.route('/add').post(function(req, res) {
    let creature = new Creature(req.body);
    creature.save()
        .then(creature => {
            res.status(200).json({
               "creature": "Creature added successfully." 
            });
        })
        .catch(err => {
            res.status(500).send('adding new creature failed.')
        });
});

router.route('/update/:id').post(function(req, res) {
    Creature.findById(req.params.id, function(err, creature) {
        if (!creature)
            res.status(404).send("data is not found");
        else {
            creature.name = req.body.name;
            creature.challenge_rating = req.body.challenge_rating;
            creature.type = req.body.type;
            creature.subtypes = req.body.subtypes;

            creature.save().then(creature => {
                res.json('Creature updated!');
            })
            .catch(err => {
                res.status(400).send("Update not possible");
            });
        }
    });
});

module.exports = router;