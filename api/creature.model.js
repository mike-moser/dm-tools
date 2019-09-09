const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let Creature = new Schema({
    name : {
        type : String,
        required : true
    },
    alt_name : String,
    challenge_rating : Number,
    ability_scores : {
        strength : Number,
        dexterity : Number,
        constitution : Number,
        intelligence : Number,
        wisdom : Number,
        charisma : Number
    },
    type : String,
    subtypes : [String],
    ac : {
        base : Number,
        flat_footed : Number,
        touch : Number,
        bonuses : [
            {
                bonus_type : String,
                value : Number
            }
        ]
    },
    alignment : {
        ethical : String,
        moral : String
    },
    attacks : [
        {
            attack_name : String,
            attack_type : String,
            addl_dmg_attack : String,
            attack_count : Number,
            bonus_damage : Number,
            critical_multiplier : Number,
            critical_range : {
                low : Number,
                high : Number
            },
            is_touch_attack : Boolean,
            damage_die : Number,
            dmg_dice_count : Number,
            damage_type : String,
            to_hit_bonuses : [ Number ],
            stat_bonus : {
                stat : String,
                value : Number
            }
        }
    ],
    auras : [
        {
            name: String,
            range: Number
        }
    ],
    base_attack_bonus : Number,
    boon : String,
    cmb : {
        base : Number,
        bull_rush : Number,
        dirty_trick : Number,
        disarm : Number,
        drag : Number,
        grapple : Number,
        overrun : Number,
        reposition : Number,
        steal : Number,
        sunder : Number,
        trip : Number,
        special : [
            {
                bonus : Number,
                condition : String,
                maneuver : String
            }
        ]
    },
    cmd : {
        base : Number,
        bull_rush : Number,
        can_bull_rush : Boolean,
        dirty_trick : Number,
        can_dirty_trick : Boolean,
        disarm : Number,
        can_disarm : Boolean,
        drag : Number,
        can_drag : Boolean,
        grapple : Number,
        can_grapple : Boolean,
        overrun : Number,
        can_overrun : Boolean,
        reposition : Number,
        can_reposition : Boolean,
        steal : Number,
        can_steal : Boolean,
        sunder : Number,
        can_sunder : Boolean,
        trip : Number,
        can_trip : Boolean,
        special : [
            {
                bonus : Number,
                condition : String,
                maneuver : String
            }
        ]
    },
    damage_reduction : {
        resist : Number,
        overcome : [ String ],
        combined : Boolean
    },
    defensive_abilities : [
        {
            ability_name: String,
            ability_modifier : Number
        }
    ],
    description : String,
    experience_points : Number,
    feats : [
        {
            name : String,
            is_bonus : Boolean,
            feat_focus : String,
            feat_focus_list : [ String ]
        }
    ],
    saving_throws : {
        fortitude : Number,
        reflex : Number,
        will : Number,
        saving_throw_modifiers : [
            {
                saving_throw: String,
                modifier : String
            }
        ]
    },
    healing_abilities : [
        {
            ability : String,
            rate : Number,
            prevention : [ String ]
        }
    ],
    hp : {
        avg_hit_points : Number,
        hit_dice : [
            {
                count : Number,
                faces : Number
            }
        ],
        bonus_hit_points : Number
    },
    image : {
        width : Number,
        height : Number,
        source : String
    },
    immunities : [ String ],
    initiative_bonus : Number,
    inventory : {
        gear : [ String ],
        combat_gear : [ String ],
        other_gear : [ String ]
    },
    languages : [ String ],
    level : Number,
    name : String,
    perception_bonus : Number,
    player_class : String,
    player_class_list : [
        {
            class_name : String,
            level : Number
        }
    ],
    psychic_magic : {
        caster_level : Number,
        concentration : Number,
        psychic_energy_points : Number,
        spell_list : [
            {
                spell_name : String,
                psi_points : Number
            }
        ]
    },
    race : Number,
    racial_modifiers : [
        {
            skill_name : String,
            skill_ranks : Number,
            skill_notes : String
        }
    ],
    space: Number,
    reach : Number,
    reach_modifiers : [
        {
            range : Number,
            condition : String
        }
    ],
    resistances : [
        {
            resistance_type : String,
            resistance_value : Number
        }
    ],
    scenarios : [ String ],
    senses : [
        {
            name : String,
            range : Number
        }
    ],
    size : String,
    skills : [
        {
            skill_name: String,
            skill_specialization: String,
            skill_ranks : Number,
            skill_note : String
        }
    ],
    sources : [
        {
            title : String,
            page : Number
        }
    ],
    special_abilities : [
        {
            ability_name : String,
            ability_type : String,
            description : String,
            ability_listing : {
                name : String,
                type_name : String,
                to_apply : String,
                save : {
                    saving_throw : String,
                    difficulty_class : Number,
                    modifiers : [
                        {
                            multiplier : Number,
                            property : String
                        }
                    ]
                },
                onset : {
                    dice : {
                        count : Number,
                        faces : Number
                    },
                    period : String
                },
                frequency : {
                    count : Number,
                    units : String,
                    maximum_period : Number
                },
                effect : [
                    {
                        hit_dice : 
                        {
                            count : Number,
                            faces : Number
                        },
                        damage_type : String,
                        condition : String,
                        period : {
                            count : Number,
                            units : String,
                            maximum_period : Number
                        }
                    }
                ],
                cure : {
                    count : Number,
                    basis : String
                }
            }
        }
    ],
    special_attacks : [ String ],
    special_qualities : [ String ],
    speed : {
        burrow : Number,
        climb : Number,
        fly : {
            rate : Number,
            maneuverability : String
        },
        land : Number,
        special : String,
        swim : Number,
        armor_adjustment : {
            burrow : Number,
            climb : Number,
            fly : {
                rate : Number,
                maneuverability : String
            },
            land : Number,
            special : String,
            swim : Number
        }
    },
    spell_like_abilities : {
        caster_level : Number,
        concentration : Number,
        frequency : String,
        abilities : [
            {
                spell_name : String,
                difficulty_class : Number,
                modifiers : String
            }
        ]
    },
    spells_known : {
        caster_level : Number,
        concentration : Number,
        spellcasting_basis_label : String,
        spellcasting_basis_value : String,
        spellcasting_basis_values : [ String ],
        spontaneous_caster : Boolean,
        spell_like_abilities : {
            caster_level : Number,
            concentration : Number,
            frequency : String,
            modifiers : [ String ],
            abilities : [
                {
                    spell_name : String,
                    difficulty_class : Number,
                    modifiers : [ String ]
                }
            ]
        },
        spell_list : [
            {
                spell_level : Number,
                spells : [
                    {
                        spell_name : String,
                        difficulty_class : Number,
                        number_prepared : Number,
                        basis_spell : Boolean
                    }
                ]
            }
        ]
    },
    spell_resistance : Number,
    tactics : [
        {
            combat_stage : String,
            description : String
        }
    ],
    template : String,
    weaknesses : [ String ]
});

module.exports = mongoose.model('Creature', Creature);