import express from 'express';
import CreatureType from '../models/creature_type.model';

var router = express.Router();

router.route('/:name').get(function(req, res) {
    let name = req.params.name;
    CreatureType.findOne({'type' : name}, function(err: Error, creatureType: any) {
        if(err) {
            console.log(err);
        } else {
            if (!creatureType)
                res.status(404).send("data is not found");
            else
                res.json(creatureType);
        }
    });
});

export default router;