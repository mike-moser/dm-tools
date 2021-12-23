import express, { Request, Response } from 'express';
import Creature from '../models/creature.model';

var router = express.Router();

router.route('/').get(function(req: Request, res: Response) {
    var selectQuery = Creature.find().sort({'name': 1});
    let offset = req.query.offset.toString();
    let limit = req.query.limit.toString();
    if(offset && offset !== '' && !isNaN(Number(offset)))
        selectQuery = selectQuery.skip(Number.parseInt(offset));
    if(limit && limit !== '' && !isNaN(Number(limit)))
        selectQuery = selectQuery.limit(Number.parseInt(limit));
    selectQuery.exec(function(err, creatures) {
        if(err) {
            console.log(err);
        } else {
            res.json(creatures);
        }
    });
});

router.route('/find/:id').get(function(req: Request, res: Response) {
    let id = req.params.id;
    Creature.findById(id, function(err: Error, creature: any) {
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

router.route('/special_ability/:creature_name/:ability_name').get(function(req: Request, res: Response) {
    let creatureName = req.params.creature_name;
    let abilityName = req.params.ability_name;

    Creature.findOne({'name' : creatureName}, 'special_abilities', {}, function(err: Error, projection: any){
        if(err) {
            console.log(err);
        } else {
            console.log(projection);
            let ability = null;
            if(projection !== undefined && projection !== null && 'special_abilities' in projection) {
                projection.special_abilities.forEach((ele : any) => {
                    if(ele.ability_name.toLowerCase() === abilityName.toLowerCase()) ability = ele;
                });
            }
            res.json(ability);
        }
    });
});

router.route('/list/:count/:offset').get(function(req, res) {
    let count = req.params.count;
    let offset = req.params.offset;

    var selectQuery = Creature.find().sort({'name': 1});
   
    if(offset && offset !== '' && !isNaN(Number(offset)))
        selectQuery = selectQuery.skip(Number.parseInt(offset));

    if(count && count !== '' && !isNaN(Number(count)))
        selectQuery = selectQuery.limit(Number.parseInt(count));

    selectQuery.exec(function(err, creatures) {
        if(err) {
            console.log(err);
        } else {
            res.json(creatures);
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
    Creature.findById(req.params.id, function(err: Error, creature: any) {
        if (!creature)
            res.status(404).send("data is not found");
        else {
            creature.name = req.body.name;
            creature.challenge_rating = req.body.challenge_rating;
            creature.type = req.body.type;
            creature.subtypes = req.body.subtypes;

            creature.save().then((creature: any) => {
                res.json('Creature updated!');
            })
            .catch((err: Error) => {
                res.status(400).send("Update not possible");
            });
        }
    });
});

router.route('/count').get(function(req: Request, res: Response) {
    Creature.countDocuments({}, function(err, creatureCount) {
        if(err) {
            res.status(500).send(err);
        } else {
            let result = { count: creatureCount };
            res.json(result);
        }
    });
});

export default router;