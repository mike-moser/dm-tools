import express from 'express';
import UniversalMonsterRule from '../models/universal_monster_rule.model';

var router = express.Router();

router.route('/find/:name').get(function(req, res) {
    let name = req.params.name;
    UniversalMonsterRule.findOne({'name' : name}, function(err: Error, umr: any) {
        if(err) {
            console.log(err);
            res.status(500).send(err.message);
        } else {
            if (!umr)
                res.status(404).send("data is not found");
            else
                res.status(200).json(umr);
        }
    });
});

export default router;