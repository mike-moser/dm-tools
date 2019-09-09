import React, { Component } from 'react';
import axios from 'axios';
import he from 'he';
import * as math from 'mathjs/dist/math.js';
import { Row, Col, CardImg, Image } from 'react-bootstrap';


const toTitleCase = str => {
    var value = (str === undefined || str === null) ? "" : str;
    return value.toLowerCase()
        .split(' ')
        .map((s) => s.charAt(0).toUpperCase() + s.substring(1))
        .join(' ');
}

const toDiceText = (count, faces, bonus) => {
    var diceNum = (count === undefined || count === null) ? math.format(1, 0) : math.format(count, 0);
    var diceFace = (faces === undefined || faces === null) ? math.format(6, 0) : math.format(faces, 0);
    var bonusStr = (bonus === undefined || bonus === null || bonus === 0) ? "" : math.format(bonus, 0);

    return diceNum.concat("d", diceFace, (bonusStr.length > 0 && bonus > 0) ? "+" : "", bonusStr);

}

class NameAndCR extends Component {
    render()
    {
        const { name, family, subfamilies, alt_name, challenge_rating } = this.props;

        var creature_name = 'Monster';
        if(name !== undefined && name !== null) {
            creature_name = name;
        }
        
        if(alt_name !== undefined && alt_name !== null) {
            creature_name.concat(" (", alt_name, ")");
        }
        var cr = '0';
        if(challenge_rating !== undefined && challenge_rating !== null) {            
            var rating = challenge_rating;
            if(rating < 1) {
                cr = math.format(math.fraction(rating), {fraction: 'ratio'});
            } else {
                cr = math.format(rating, 0);
            }
        }
        var family_text = "";
        if(family) {
            family_text = toTitleCase(family);
        }
        if(subfamilies && subfamilies.length > 0) {
            var sub = subfamilies.map( (fam) => {
                return toTitleCase(fam);
            });

            family_text = family_text.concat(" (", sub.join(', '), ")");
        }
        return (
            <Row className='card-text name-block'>
                <Col md="10">{family && (family_text.length > 0)  && family_text.concat(", ")} { creature_name }</Col>
                <Col md="2" className='float-right'>CR&nbsp;{ cr }</Col>
            </Row>
        )
    }
}

class Experience extends Component {
    render()
    {
        var exp = 0;
        if(this.props.exp_points !== undefined && this.props.exp_points !== null) exp = this.props.exp_points;
        return (
            <Row className="card-text"><Col className="font-weight-bold">XP&nbsp;{ exp.toLocaleString() }</Col></Row>
        )
    }
}

class AlignmentSizeAndType extends Component {
    render()
    {
        const { ethical, moral, size, type, subtypes } = this.props;
        var alignText = '';

        if(ethical !== undefined && ethical !== null &&
            moral !== undefined && moral !== null) {
            if(ethical.toLowerCase() === "neutral" && moral.toLowerCase() === "neutral") {
                alignText = "N".toUpperCase();
            } else {
                alignText = (ethical[0] + moral[0]).toUpperCase();
            }
        }
            
        return (
            <Row className="card-text">
                <Col>
                    { alignText }&nbsp;
                    { size && toTitleCase(size.toString()) }&nbsp;
                    { type && type }
                    { (subtypes && subtypes.length > 0) && " (" + subtypes.join(", ") + ")"}
                </Col>
            </Row>
        )
    }
}

class Senses extends Component {
    render() {
        const { initiative_bonus, perception_bonus, senses_list } = this.props;

        var init = "+0";
        if(initiative_bonus != null) {
            if(initiative_bonus >= 0) {
                init = "+" + math.format(initiative_bonus, 0);
            } else {
                init = math.format(initiative_bonus, 0);
            }
        }

        var perception = "+0";
        if(perception_bonus != null) {
            if(perception_bonus >= 0) {
                perception = "+" + math.format(perception_bonus, 0);
            } else {
                perception = math.format(perception_bonus, 0);
            }
        }
        
        if(this.senses_list) {
            var senses = senses_list.map((sense) => {
                var text = "";
                if(sense.name !== undefined && sense.name !== null) text += sense.name;
                if(sense.range !== undefined && sense.range !== null) text += ' ' + sense.range + ' ft.';

                return text;
            });
        }

        return (
            <Row className="card-text">
                <Col>
                    <span className="font-weight-bold">Initiative&nbsp;</span>{ init };&nbsp;
                    {
                        (senses !== undefined && senses !== null && senses.length > 0) &&
                            <span id="senses">
                                <span className="font-weight-bold">Senses&nbsp;</span> { senses.join(", ") };&nbsp;
                            </span>
                    }
                    <span className="font-weight-bold">Perception&nbsp;</span>{ perception }
                </Col>
            </Row>
        )
    }
}

class UniqueDetails extends Component {
    
}

class Auras extends Component {
    render() {
        const { aura_list } = this.props;
        
        var auras = aura_list.map((aura) => {
            var text = ""
            if(aura.name !== undefined && aura.name !== null) text += aura.name;
            if(aura.range !== undefined && aura.range !== null) text += ' ' + aura.range + ' ft.';

            return text;
        });

        return (
            <Row className="card-text">
                <Col>
                    <span className="font-weight-bold">Auras&nbsp;</span> { auras.join(", ") }
                </Col>
            </Row>
        )
    }
}

class ArmorClass extends Component {
    render() {
        const { ac, touch, flat_footed, bonuses } = this.props;
        var ac_text, touch_text, flat_footed_text = "0";
        if(ac === undefined || ac === null) ac_text = "+0"; else ac_text = ac >= 0 ? "+" + ac : ac.toLocaleString();
        if(touch === undefined || touch === null) touch_text = "+0"; else touch_text = touch >= 0 ? "+" + touch : touch.toLocaleString();
        if(flat_footed === undefined || flat_footed === null) flat_footed_text = "+0"; else flat_footed_text = flat_footed >=  0 ? "+" + flat_footed : flat_footed.toLocaleString();

        if(bonuses != null && bonuses.length > 0)
        {            
            const bonus_string = bonuses.map( (bon) => {
                var text = "";
                
                if(bon.value !== undefined && bon.value !== null) {
                    if(bon.value >= 0)
                        text += "+";
                    text += bon.value;
                }
                if(bon.bonus_type !== undefined && bon.bonus_type !== null) {
                    text += " ";
                    if(bon.bonus_type.toLowerCase() === "str" || bon.bonus_type.toLowerCase() === "dex" || bon.bonus_type.toLowerCase() === "con" ||
                    bon.bonus_type.toLowerCase() === "int" || bon.bonus_type.toLowerCase() === "wis" || bon.bonus_type.toLowerCase() === "cha") {
                        text += toTitleCase(bon.bonus_type);
                    } else {
                        text += bon.bonus_type.toLowerCase();
                    }
                }
                return text;
            });
            var bonus_text = "(" + bonus_string.join(", ") + ")";
        }

        return (
            <Row className="card-text">
                <Col>
                    <span className="font-weight-bold">AC</span> { ac_text }, touch { touch_text }, flat footed { flat_footed_text }&nbsp;{ bonus_text }
                </Col>
            </Row>
        )
    }
}

class HitPointRules extends Component {
    render() {
        const { hit_dice, bonus_hit_points, healing_abilities, has_class_levels } = this.props;

        var rulesText = "";
        if(hit_dice !== undefined && hit_dice !== null && hit_dice.length > 0) {
            var avg_hp = 0;
            hit_dice.forEach((hd) => {
                var evens = Math.floor(hd.count / 2.0);
                var odds = Math.ceil(hd.count / 2.0);

                var half_die = Math.floor(hd.faces / 2.0);

                avg_hp += (odds * half_die) + (evens * (half_die + 1));
            });
            if(bonus_hit_points !== undefined && bonus_hit_points !== null) {
                avg_hp += bonus_hit_points;
            }

            rulesText = math.format(avg_hp, 0).concat(" ");

            if(hit_dice.length > 1) {
                var hd_count = 0;
                hit_dice.forEach((hd) => {
                    hd_count += hd.count;
                });

                rulesText = rulesText.concat(math.format(hd_count, 0), "HD; ");
            }

            var hp_rules = hit_dice.map((hd) => {
                return toDiceText(hd.count, hd.faces, null);
            });

            rulesText = rulesText.concat("(", hp_rules.join("+"));
            if(bonus_hit_points !== undefined && bonus_hit_points !== null) {
                if(bonus_hit_points > 0) rulesText = rulesText.concat("+", math.format(bonus_hit_points, 0));
                else rulesText = rulesText.concat(math.format(bonus_hit_points, 0));
            }
            rulesText = rulesText.concat(")");
        }

        var healingText = "";
        if(healing_abilities !== undefined && healing_abilities !== null && healing_abilities.length > 0 ) {
            if(rulesText.length > 0 ) rulesText = rulesText.concat(";");
            var healing = healing_abilities.map((heals) => {
                var text = "".concat(heals.ability, " ", heals.rate);
                if(heals.prevention !== undefined && heals.prevention !== null && heals.prevention.length > 0)
                {
                    var first = true;
                    var prev_text = "";
                    heals.prevention.forEach((prev) =>{
                        if(first) {
                            first = false;
                        } else {
                            if(heals.prevention.indexOf(prev)  == heals.prevention.length - 1) {
                                prev_text += " and ";
                            } else {
                                prev_text += ", "
                            }
                        }
                        prev_text += prev;
                    });

                    text = text.concat(" (", prev_text, ")");
                }

                return text;
            });
            healingText = healing.join("; ");
        }

        return (
            <Row className="card-text">
                <Col>
                    <span className="font-weight-bold">hp&nbsp;</span>
                    { rulesText }&nbsp;{ healingText }
                </Col>
            </Row>
        )
    }
}

class SavingThrows extends Component {
    render() {
        const { fortitude, reflex, will, modifiers } = this.props;

        var fort_text = (fortitude !== undefined && fortitude !== null && fortitude >= 0) ? "+".concat(fortitude) : math.format(fortitude, 0);
        var ref_text = (reflex !== undefined && reflex !== null && reflex >= 0) ? "+".concat(reflex) : math.format(reflex, 0);
        var will_text = (will !== undefined && will !== null && will >= 0) ? "+".concat(will) : math.format(will, 0);

        var mods = [];
        var will_mods = [];
        var ref_mods = [];
        var fort_mods = [];
        if(modifiers !== undefined && modifiers !== null  && modifiers.length > 0) {
            modifiers.forEach((st) => {
                if(st.saving_throw === undefined || st.saving_throw === null) {
                    mods.push(st.modifiers);
                } else {
                    if( st.saving_throw.toUpperCase() === "WILL".toUpperCase() )  will_mods.push(st.modifiers);
                    else if(st.saving_throw.toUpperCase() === "REFLEX".toUpperCase()) ref_mods.push(st.modifiers);
                    else if(st.saving_throw.toUpperCase() === "FORTITUDE".toUpperCase()) fort_mods.push(st.modifiers);
                }
            }); 
        }

        if (will_mods.length > 0) will_text = will_text.concat(' (', will_mods.join(', '), ')');
        if (ref_mods.length > 0) ref_text = ref_text.concat(' (', ref_mods.join(', '), ')');
        if (fort_mods.length > 0) fort_text = fort_text.concat(' (', fort_mods.join(', '), ')');

        return (
            <Row className="card-text">
                <Col>
                    <span className="font-weight-bold">Fort&nbsp;</span>{ fort_text },&nbsp;
                    <span className="font-weight-bold">Ref&nbsp;</span>{ ref_text },&nbsp;
                    <span className="font-weight-bold">Will&nbsp;</span>{ will_text }
                    { mods && mods.length > 0 ? '; ' + mods.join(', ') : ''}
                </Col>
            </Row> 
        )
    }
}

class SpecialDefenses extends Component {
    render() {
        const { abilities, damage_reduction, immunities, resistances, spell_resistance } = this.props;

        var ability_separator = (damage_reduction !== undefined && damage_reduction !== null && damage_reduction.resist !== undefined && damage_reduction.resist !== null) ||
            (immunities !== undefined && immunities !== null && immunities.length > 0) ||
            (resistances !== undefined && resistances !== null && resistances.length > 0) ||
            (spell_resistance !== undefined && spell_resistance !== null);
        
        var dr_separator = (immunities !== undefined && immunities !== null && immunities.length > 0) ||
            (resistances !== undefined && resistances !== null && resistances.length > 0) ||
            (spell_resistance !== undefined && spell_resistance !== null);
        
        var imm_separator = (resistances !== undefined && resistances !== null && resistances.length > 0) ||
            (spell_resistance !== undefined && spell_resistance !== null);
        
        var resist_separator = (spell_resistance !== undefined && spell_resistance !== null);

        return (
            <Row className="card-text">
                <Col>
                    {
                        (abilities !== undefined && abilities !== null && abilities.length > 0) &&
                        <DefensiveAbilities abilities={ abilities } next={ ability_separator } />
                    }
                    {

                        (damage_reduction !== undefined && damage_reduction !== null && 
                            damage_reduction.resist !== undefined && damage_reduction !== null) &&
                            <DamageReduction damage_reduction={ damage_reduction } next={ dr_separator } />
                    }
                    {
                        (immunities !== undefined && immunities !== null && immunities.length > 0) &&
                            <Immunities immunities={ immunities } next={ imm_separator } />
                    }
                    {
                        (resistances !== undefined && resistances !== null && resistances.length > 0) &&
                            <Resistances resistances={ resistances } next={ resist_separator } />
                    }
                    {
                        (spell_resistance !== undefined && spell_resistance !== null) && 
                            <span id="spell_resistance">
                                <span className="font-weight-bold">SR&nbsp;</span>{ spell_resistance }
                            </span>
                    }
                </Col>
            </Row>
        )
    }
}

class DefensiveAbilities extends Component {
    render() {
        const { abilities, next } = this.props;
        var def_text = '';
        if(abilities !== undefined && abilities !== null && abilities.length > 0)
        {
            var defensive = abilities.map((da) => {
                var text = da.ability_name;
                if(da.ability_modifier !== undefined && da.ability_modifier !== null) {
                    if(Number.isInteger(da.ability_modifier))
                        text = text.concat(' +', da.ability_modifier);
                    else 
                        text = text.concat(' (', da.ability_modifier, ')');
                }
                return text;
            });
            def_text += defensive.join(', ');
            if(next) def_text += '; ';
        }
        return ( 
            <Row id="defensive_abilities">
                <Col>
                    <span className="font-weight-bold">Defensive Abilities&nbsp;</span> { def_text } 
                </Col>
            </Row>
        )
    }
}

class DamageReduction extends Component {
    render() {
        const { damage_reduction, next } = this.props;

        var dr_text = '';
        if(damage_reduction !== undefined && damage_reduction !== null && 
            damage_reduction.resist !== undefined && damage_reduction.resist !== null)
        {
            dr_text = dr_text.concat(damage_reduction.resist, '/');

            if(damage_reduction.overcome !== undefined && damage_reduction.overcome !== null && damage_reduction.overcome.length > 0)
            {
                var first = true;
                damage_reduction.overcome.forEach((dr) =>{
                    if(first) {
                        first = false;
                    } else {
                        if( damage_reduction.overcome.indexOf(dr)  ==  damage_reduction.overcome.length - 1) {
                            if(damage_reduction.overcome.combined !== undefined && damage_reduction.overcome.combined !== null) dr_text += " and ";
                            else dr_text += " or "
                        } else {
                            dr_text += ", "
                        }
                    }
                    dr_text += dr;
                });
            }
            else dr_text += '\u2014';
            if(next) dr_text += '; ';
        }
        return ( 
            <span id='dmg_reduction'>
                <span className="font-weight-bold">DR&nbsp;</span>{ dr_text } 
            </span>
        )
    }
}

class Immunities extends Component {
    render() {
        const { immunities, next } = this.props;
        var imm_text = immunities.join(', ');
        if(next) imm_text += '; ';
        return(
            <span id='immunities'>
                <span className='font-weight-bold'>Immunities&nbsp;</span>{ imm_text }
            </span>
        )
    }
}

class Resistances extends Component {
    render() {
        const { resistances, next } = this.props;

        var resist_map = resistances.map((resist) => {
            var text = '';
            if(resist.resistance_type !== undefined && resist.resistance_type !== null)
                text = resist.resistance_type.concat(' ', resist.resistance_value);
            return text;
        });

        var resist_text = resist_map.join(', ');

        if(next) resist_text += '; ';
        return (
            <span id='resistances'>
                <span className='font-weight-bold'>Resist&nbsp;</span>{resist_text}
            </span>
        )
    }
}

class Speed extends Component {
    render() {
        const { speed } = this.props;

        var speed_text = '';
        if(speed) {
            if(speed.land !== undefined && speed.land !== null) speed_text = speed_text.concat(speed.land, " ft.");
            if(speed.burrow !== undefined && speed.burrow !== null) {
                if(speed_text.length > 0) speed_text += ", "
                speed_text = speed_text.concat("burrow ", speed.burrow, " ft.");
            }
            if(speed.climb !== undefined && speed.climb !== null) {
                if(speed_text.length > 0) speed_text += ", "
                speed_text = speed_text.concat("climb ", speed.climb, " ft.");
            }
            if(speed.fly !== undefined && speed.fly !== null && speed.fly.rate !== undefined && speed.fly.rate !== null) {
                if(speed_text.length > 0) speed_text += ", "
                speed_text = speed_text.concat("fly ", speed.fly.rate, " ft.", " (", speed.fly.maneuverability, ")");
            }
            if(speed.swim !== undefined && speed.swim !== null) {
                if(speed_text.length > 0) speed_text += ", "
                speed_text = speed_text.concat("swim ", speed.swim, " ft.");
            }
            if(speed.special !== undefined && speed.special !== null) {
                if(speed_text.length > 0) speed_text += ", "
                speed_text = speed_text.concat(speed.special);
            }
            
            if(speed.armor_adjustment !== undefined && speed.armor_adjustment !== null) { 
                var adjust_text = '';
                if(speed.armor_adjustment.land !== undefined && speed.armor_adjustment.land !== null) adjust_text = adjust_text.concat(speed.armor_adjustment.land, " ft.");
                if(speed.armor_adjustment.burrow !== undefined && speed.armor_adjustment.burrow !== null) {
                    if(adjust_text.length > 0) adjust_text += ", "
                    adjust_text = speed_text.concat("burrow ", speed.armor_adjustment.burrow, " ft.");
                }
                if(speed.armor_adjustment.climb !== undefined && speed.armor_adjustment.climb !== null) {
                    if(adjust_text.length > 0) adjust_text += ", "
                    adjust_text = speed_text.concat("climb ", speed.armor_adjustment.climb, " ft.");
                }
                if(speed.armor_adjustment.fly !== undefined && speed.armor_adjustment.fly !== null && speed.armor_adjustment.fly.rate !== undefined && speed.armor_adjustment.fly.rate !== null) {
                    if(adjust_text.length > 0) adjust_text += ", "
                    adjust_text = speed_text.concat("fly ", speed.armor_adjustment.fly.rate, " ft.", " (", speed.armor_adjustment.fly.maneuverability, ")");
                }
                if(speed.armor_adjustment.swim !== undefined && speed.armor_adjustment.swim !== null) {
                    if(adjust_text.length > 0) adjust_text += ", "
                    adjust_text = speed_text.concat("swim ", speed.armor_adjustment.swim, " ft.");
                }
                if(speed.armor_adjustment.special !== undefined && speed.armor_adjustment.special !== null) {
                    if(adjust_text.length > 0) adjust_text += ", "
                    adjust_text = speed_text.concat(speed.armor_adjustment.special);
                }
            }
        }

        return(
            <Row className='card-text'>
                <Col>
                    <span className='font-weight-bold'>Speed&nbsp;</span> { speed_text }
                </Col>
            </Row>
        )
    }
}

class AttackBlock extends Component {
    render() {
        const { attacks } = this.props;
        var melee_attacks = [];
        var ranged_attacks = [];
        attacks.forEach((atk) => {
            if(atk.attack_type !== undefined && atk.attack_type !== null) {
                if(atk.attack_type.toUpperCase() == "melee".toUpperCase()) melee_attacks.push(atk);
                else if(atk.attack_type.toUpperCase() == "ranged".toUpperCase()) ranged_attacks.push(atk)
            }
        });

        return (
            <Row className='card-text'>
                <Col>
                    { 
                        (melee_attacks !== undefined && melee_attacks !== null && melee_attacks.length > 0) &&
                            <AttackList attacks={ melee_attacks } type={ 'melee' } />
                    }
                    { 
                        (ranged_attacks !== undefined && ranged_attacks !== null && ranged_attacks.length > 0) &&
                            <AttackList attacks={ ranged_attacks } type={ 'ranged' } />
                    }
                </Col>
            </Row>
        )
    }
}

class AttackList extends Component {
    render() {
        const { attacks, type } = this.props;

        var atk_type = toTitleCase(type);
        var atk_list = attacks.map((a) => {
            var text = '';
            if(a.attack_count !== undefined && a.attack_count !== null) text = text.concat(a.attack_count, ' ');
            if(a.attack_name !== undefined && a.attack_name !== null) text = text.concat(a.attack_name);
            if(a.to_hit_bonuses !== undefined && a.to_hit_bonuses !== null && a.to_hit_bonuses.length > 0) {
                var bonuses = a.to_hit_bonuses.map((thb) => {
                    return (thb >= 0) ? '+' + thb : '' + thb;
                });
                text = text.concat(' ', bonuses.join('/'));
            }
            if( a.is_touch_attack !== undefined && a.is_touch_attack !== null && a.is_touch_attack === true) text = text.concat(' touch ');
            if(a.dmg_dice_count !== undefined && a.dmg_dice_count !== null &&
                a.damage_die !== undefined && a.damage_die !== null) {
                    text = text.concat(" (", toDiceText(a.dmg_dice_count, a.damage_die, a.bonus_damage));
                    if(a.damage_type !== undefined && a.damage_type !== null) text = text.concat(' ', a.damage_type, ' ');
                    if(a.addl_dmg_attack !== undefined && a.addl_dmg_attack !== null) text = text.concat(' plus ', a.addl_dmg_attack);
                    text = text.trim().concat(')');
                }
            return text;
        });

        var atk_text = atk_list.join(', ');

        return(
            <div id={type + '_attacks'}>
                <span className='font-weight-bold'>{ atk_type }&nbsp;</span>{atk_text}
            </div>
        )
    }
}

class Area extends Component {
    render() {
        const { space, reach } = this.props;

        var space_text = '';
            if((space % 1) < 1 && (space % 1) > 0) {
                var space_whole = Math.floor(space);
                var space_ratio = space % 1;
                space_text = ''.concat(math.format(space_whole, 0), ' & ', math.format(math.fraction(space_ratio), {fraction: 'ratio'}), ' ft.');
            } else {
                space_text = ''.concat(math.format(space, 0), ' ft.');
            }
        
        var reach_text = '';
        if((reach % 1) < 1 && (reach % 1) > 0) {
            var reach_whole = Math.floor(reach);
            var reach_ratio = reach % 1;
            reach_text = ''.concat(math.format(reach_whole, 0), ' & ', math.format(math.fraction(reach_ratio), {fraction: 'ratio'}), ' ft.');
        } else {
            reach_text = ''.concat(math.format(reach, 0), ' ft.');
        }

        return (
            <Row className="card-text">
                <Col>
                    <span className="font-weight-bold">Space&nbsp;</span>{space_text}; <span className="font-weight-bold">Reach&nbsp;</span>{reach_text}
                </Col>
            </Row>
        )
    }
}

class AbilityScores extends Component {
    render() {
        const { strength, dexterity, constitution, wisdom, intelligence, charisma } = this.props;

        var str = (strength === undefined || strength === null) ? '\u2014' : math.format(strength, 0);
        var dex = (dexterity === undefined || dexterity === null) ? '\u2014' : math.format(dexterity, 0);
        var con = (constitution === undefined || constitution === null) ? '\u2014' : math.format(constitution, 0);
        var wis = (wisdom === undefined || wisdom === null) ? '\u2014' : math.format(wisdom, 0);
        var intel = (intelligence === undefined || intelligence === null) ? '\u2014' : math.format(intelligence, 0);
        var cha = (charisma === undefined || charisma === null) ? '\u2014' : math.format(charisma, 0);

        return (
            <Row className="card-text">
                <Col>
                    <span className="font-weight-bold">Str&nbsp;</span>{str},&nbsp;
                    <span className="font-weight-bold">Dex&nbsp;</span>{dex},&nbsp;
                    <span className="font-weight-bold">Con&nbsp;</span>{con},&nbsp;
                    <span className="font-weight-bold">Wis&nbsp;</span>{wis},&nbsp;
                    <span className="font-weight-bold">Int&nbsp;</span>{intel},&nbsp;
                    <span className="font-weight-bold">Cha&nbsp;</span>{cha}  
                </Col>              
            </Row>
        )
    }
}

class CombatManeuvers extends Component {
    render() {
        const { bab, cmb, cmd } = this.props;
        var atk_bonus = (bab === undefined || bab === null) ? "+0" : ( bab >= 0 ? "+".concat(math.format(bab, 0)) : math.format(bab, 0) );
        var cmb_base = ((cmb === undefined || cmb === null) || (cmb.base === undefined || cmb.base === null)) ? "+0" : 
            (cmb.base >= 0 ? "+".concat(math.format(cmb.base, 0)) : math.format(cmb.base, 0));
        var cmd_base = ((cmd === undefined || cmd === null) || (cmd.base === undefined || cmd.base === null)) ? "+0" : 
            (cmd.base >= 0 ? "+".concat(math.format(cmd.base, 0)) : math.format(cmd.base, 0));
        
        var combat_maneuvers = [];
        if(cmb !== undefined && cmb !== null) {
            if(cmb.bull_rush !== undefined && cmb.bull_rush !== null) combat_maneuvers.push(''.concat( (cmb.bull_rush >= 0 ? "+" : ""), cmb.bull_rush, " bull rush"));
            if(cmb.dirty_trick !== undefined && cmb.dirty_trick !== null) combat_maneuvers.push(''.concat( (cmb.dirty_trick >= 0 ? "+" : ""), cmb.dirty_trick, " dirty trick"));
            if(cmb.disarm !== undefined && cmb.disarm !== null) combat_maneuvers.push(''.concat( (cmb.disarm >= 0 ? "+" : ""), cmb.disarm, " disarm"));
            if(cmb.drag !== undefined && cmb.drag !== null) combat_maneuvers.push(''.concat( (cmb.drag >= 0 ? "+" : ""), cmb.drag, " drag"));
            if(cmb.grapple !== undefined && cmb.grapple !== null) combat_maneuvers.push(''.concat( (cmb.grapple >= 0 ? "+" : ""), cmb.grapple, " grapple"));
            if(cmb.overrun !== undefined && cmb.overrun !== null) combat_maneuvers.push(''.concat( (cmb.overrun >= 0 ? "+" : ""), cmb.overrun, " overrun"));
            if(cmb.reposition !== undefined && cmb.reposition !== null) combat_maneuvers.push(''.concat( (cmb.reposition >= 0 ? "+" : ""), cmb.reposition, " reposition"));
            if(cmb.steal !== undefined && cmb.steal !== null) combat_maneuvers.push(''.concat( (cmb.steal >= 0 ? "+" : ""), cmb.steal, " steal"));
            if(cmb.sunder !== undefined && cmb.sunder !== null) combat_maneuvers.push(''.concat( (cmb.sunder >= 0 ? "+" : ""), cmb.sunder, " sunder"));
            if(cmb.trip !== undefined && cmb.trip !== null) combat_maneuvers.push(''.concat( (cmb.trip >= 0 ? "+" : ""), cmb.trip, " trip"));
            if(cmb.special !== undefined && cmb.special !== null) {
                cmb.special.forEach((spec) =>{
                    var text = (spec.bonus > 0) ? '+' : '';
                    text = text.concat(spec.bonus, ' ', spec.maneuver, ' ', spec.condition);
                    combat_maneuvers.push(text);
                });
            }
        }
        var cmb_text = cmb_base;
        if(combat_maneuvers.length > 0) {
            var first = true;
            combat_maneuvers.forEach((man) =>{
                if(first) {
                    first = false;
                    cmb_text = cmb_text.concat(' (');
                } else {
                    if( combat_maneuvers.indexOf(man)  ==  combat_maneuvers.length - 1) {
                        cmb_text += " or "
                    } else {
                        cmb_text += ", "
                    }
                }
                cmb_text += man;
            });
            cmb_text = cmb_text.concat(")");
        }

        var combat_defense = [];
        if(cmd !== undefined && cmd !== null) {
            if(cmd.can_bull_rush !== undefined && cmd.can_bull_rush !== null && !cmd.can_bull_rush)combat_defense.push("cannot be bull rushed");
            else if(cmd.bull_rush !== undefined && cmd.bull_rush !== null) combat_defense.push(''.concat( (cmd.bull_rush >= 0 ? "+" : ""), cmd.bull_rush, " vs bull rush"));
            if(cmd.can_dirty_trick !== undefined && cmd.can_dirty_trick !== null && !cmd.can_dirty_trick)combat_defense.push("cannot be tricked");
            else if(cmd.dirty_trick !== undefined && cmd.dirty_trick !== null) combat_defense.push(''.concat( (cmd.dirty_trick >= 0 ? "+" : ""), cmd.dirty_trick, " vs dirty trick"));
            if(cmd.can_disarm !== undefined && cmd.can_disarm !== null && !cmd.can_disarm)combat_defense.push("cannot be disarmed");
            else if(cmd.disarm !== undefined && cmd.disarm !== null) combat_defense.push(''.concat( (cmd.disarm >= 0 ? "+" : ""), cmd.disarm, " vs disarm"));
            if(cmd.can_drag !== undefined && cmd.can_drag !== null && !cmd.can_drag)combat_defense.push("cannot be dragged");
            else if(cmd.drag !== undefined && cmd.drag !== null) combat_defense.push(''.concat( (cmd.drag >= 0 ? "+" : ""), cmd.drag, " vs drag"));
            if(cmd.can_grapple !== undefined && cmd.can_grapple !== null && !cmd.can_grapple)combat_defense.push("cannot be grappled");
            else if(cmd.grapple !== undefined && cmd.grapple !== null) combat_defense.push(''.concat( (cmd.grapple >= 0 ? "+" : ""), cmd.grapple, " vs grapple"));
            if(cmd.can_overrun !== undefined && cmd.can_overrun !== null && !cmd.can_overrun)combat_defense.push("cannot be overrun");
            else if(cmd.overrun !== undefined && cmd.overrun !== null) combat_defense.push(''.concat( (cmd.overrun >= 0 ? "+" : ""), cmd.overrun, " vs overrun"));
            if(cmd.can_reposition !== undefined && cmd.can_reposition !== null && !cmd.can_reposition)combat_defense.push("cannot be repositioned");
            else if(cmd.reposition !== undefined && cmd.reposition !== null) combat_defense.push(''.concat( (cmd.reposition >= 0 ? "+" : ""), cmd.reposition, " vs reposition"));
            if(cmd.can_steal !== undefined && cmd.can_steal !== null && !cmd.can_steal)combat_defense.push("cannot be stolen from");
            else if(cmd.steal !== undefined && cmd.steal !== null) combat_defense.push(''.concat( (cmd.steal >= 0 ? "+" : ""), cmd.steal, " vs steal"));
            if(cmd.can_sunder !== undefined && cmd.can_sunder !== null && !cmd.can_sunder)combat_defense.push("weapon or item cannot be sundered");
            else if(cmd.sunder !== undefined && cmd.sunder !== null) combat_defense.push(''.concat( (cmd.sunder >= 0 ? "+" : ""), cmd.sunder, " vs sunder"));
            if(cmd.can_trip !== undefined && cmd.can_trip !== null && !cmd.can_trip)combat_defense.push("cannot be tripped");
            else if(cmd.trip !== undefined && cmd.trip !== null) combat_defense.push(''.concat( (cmd.trip >= 0 ? "+" : ""), cmd.trip, " vs trip"));
            if(cmd.special !== undefined && cmd.special !== null) {
                cmd.special.forEach((spec) =>{
                    var text = (spec.bonus > 0) ? '+' : '';
                    text = text.concat(spec.bonus, ' ', spec.maneuver, ' ', spec.condition);
                    combat_defense.push(text);
                });
            }
        }
        var cmd_text = cmd_base;
        if(combat_defense.length > 0) {
            var begin = true;
            combat_defense.forEach((def) =>{
                if(begin) {
                    begin = false;
                    cmd_text = cmd_text.concat(' (');
                } else {
                    if( combat_defense.indexOf(def)  ==  combat_defense.length - 1) {
                        cmd_text += " or "
                    } else {
                        cmd_text += ", "
                    }
                }
                cmd_text += def;
            });
            cmd_text = cmd_text.concat(")");
        }

        return (
            <Row className="card-text">
                <Col>
                    <span className="font-weight-bold">Base Atk&nbsp;</span>{atk_bonus};&nbsp;
                    <span className="font-weight-bold">CMB&nbsp;</span>{cmb_text};&nbsp;
                    <span className="font-weight-bold">CMD&nbsp;</span>{cmd_text}
                </Col>
            </Row>
        )
    }
}

class FeatsList extends Component {
    render() {
        var {feats} = this.props;
        
        return (
            <Row className="card-text">
                <Col>
                    <span className="font-weight-bold">Feats&nbsp;</span>
                    {
                        feats.map((feat, i) => {
                            var separator = (i > 0);
                            
                            return  <span key={i}>
                                        <span>{separator && ', '}{feat.name}{feat.bonus && <sup>B</sup>}</span>
                                            {(feat.feat_focus_list && feat.feat_focus_list.length > 0) && 
                                        <span> ({feat.feat_focus_list.join(', ')})</span>}
                                    </span>             
                        })
                    }
                </Col>
            </Row>
        )
    }
}

class SkillsList extends Component {
    render() {
        var {skills} = this.props;

        return (
            <Row className="card-text">
                <Col>
                    <span className="font-weight-bold">Skills&nbsp;</span>{
                        skills.map((skill, i) => {
                            var separator = (i > 0);
                            
                            return  <span key={i}>
                                        {separator && ', '}
                                        <Skill name={skill.skill_name} specialization={skill.skill_specialization} ranks={skill.skill_ranks} notes={skill.skill_note} />
                                    </span>
                        })
                    }
                </Col>
            </Row>
        )
    }
}

class RacialModifiers extends Component {
    render() {
        var {skills} = this.props;

        return (
            <Row className="card-text">
                <Col>
                    <span className="font-weight-bold">Racial Modifiers&nbsp;</span>{
                        skills.map((skill, i) => {
                            var separator = (i > 0);
                            
                            return  <span key={i}>
                                        {separator && ', '}
                                        <Skill name={skill.skill_name} specialization={skill.skill_specialization} ranks={skill.skill_ranks} notes={skill.skill_note} />
                                    </span>
                        })
                    }
                </Col>
            </Row>
        )
    }
}

class Skill extends Component {
    render() {
        var {name, specialization, ranks, notes} = this.props;

        return (
            <span className="skill-desc">
                {name && <span>{toTitleCase(name)}</span>}
                {specialization && <span>&nbsp;({specialization})</span>}
                {ranks && <span>{(ranks < 0) ? ' ' + ranks : ' +' + ranks}</span>}
                {notes && <span> ({notes})</span>}
            </span>
        )
    }
}

class SpecialQualities extends Component {
    render() {
        var {special_qualities} = this.props;

        var sq_text = special_qualities.join(', ');
        return (
            <Row className="card-text">
                <Col>
                    <span className="font-weight-bold">SQ&nbsp;</span>{sq_text}
                </Col>
            </Row>
        )
    }
}

class SpecialAbilities extends Component {
    render() {
        var {special_abilities} = this.props;
        return special_abilities.map(function (ability, i){
            return <SpecialAbility ability={ability} key={i} />
        })
    }
}

class SpecialAbility extends Component {
    render() {
        var {ability} = this.props;
        return (
            <Row className="card-text">
                <Col>
                    <span className="font-weight-bold">
                        {ability.ability_name}
                        <span>
                            { ability.ability_type &&
                                " (" + ability.ability_type + ")"
                            }
                        </span>
                    </span>&nbsp;&mdash;&nbsp;
                    {ability.description &&
                        <span>{ability.description}</span>}
                    {ability.ability_listing &&
                        <AbilityListing ability_listing={ability.ability_listing} />}
                    </Col>
                </Row>
        )
    }
}

class AbilityListing extends Component {
    render() {
        var {ability_listing} = this.props;
        return (
            <span>
                {ability_listing.name && <em>{ability_listing.name.concat(': ')}</em>}
                {ability_listing.type_name && ' '.concat(ability_listing.type_name)}
                {ability_listing.type_name && ability_listing.to_apply && ' \u2014 '}
                {ability_listing.to_apply && ability_listing.to_apply}
                {(ability_listing.type_name || ability_listing.to_apply) && '; '}
                {ability_listing.save && ability_listing.save.saving_throw && <em>save </em>}
                {ability_listing.save && ability_listing.save.saving_throw && 
                    (ability_listing.save.saving_throw.startsWith("R")? ability_listing.save.saving_throw.substring(0, 3) : ability_listing.save.saving_throw.substring(0, 4))}
                {ability_listing.save && ability_listing.save.difficulty_class &&
                    " DC ".concat(ability_listing.save.difficulty_class)}
                {ability_listing.save && ability_listing.save.modifiers && ability_listing.save.modifiers.length > 0 &&
                    ability_listing.save.modifiers.map((mod, i) => {
                        var multi_text = '';
                        if((mod.multiplier % 1) < 1 && (mod.multiplier % 1) > 0) {
                            var multi_whole = Math.floor(mod.multiplier);
                            var multi_ratio = mod.multiplier % 1;
                            if(multi_whole > 0) {
                                multi_text = ' + '.concat(math.format(multi_whole, 0), ' & ', math.format(math.fraction(multi_ratio), {fraction: 'ratio'}));
                            } else { multi_text = ' + '.concat(math.format(math.fraction(multi_ratio), {fraction: 'ratio'})); }
                        } else if(mod.multiplier == 1) {
                            multi_text = ' + ';
                        } else {
                            multi_text = ' + '.concat(math.format(mod.multiplier, 0));
                        }
                        return <span key={i}>{multi_text} {mod.property}</span>
                    })}
                {ability_listing.save && ability_listing.save.saving_throw && '; '}
                {ability_listing.onset && ability_listing.onset.count && ability_listing.onset.period &&
                    <span><em>onset</em> {ability_listing.onset.count} {ability_listing.onset.period}</span>}
                {ability_listing.onset && ability_listing.onset.dice && ability_listing.onset.period &&
                    <span><em>onset</em> {toDiceText(ability_listing.onset.dice.count, ability_listing.onset.dice.faces)} {ability_listing.onset.period.concat('s')}</span>}
                {ability_listing.onset && ability_listing.onset.period && '; '}
                {ability_listing.frequency && ability_listing.frequency.count && ability_listing.frequency.period &&
                    <span><em>frequency</em> {ability_listing.frequency.count.toString().concat('\u002f', ability_listing.frequency.period)}</span>}
                {ability_listing.frequency && ability_listing.frequency.maximum_period &&
                    <span>{' for '.concat(ability_listing.frequency.maximum_period, ' ', ability_listing.frequency.period, 's')}</span>}
                {ability_listing.frequency && ability_listing.frequency.count && ability_listing.frequency.period && ';'}
                {ability_listing.cure && 
                    <span><em>cure</em> {ability_listing.cure.count} consecutive saves. Save DC is {ability_listing.cure.basis}-based.</span>
                }
            </span>
        )
    }
}

class SpellList extends Component {
    render() {
        var {spells_known} = this.props;
        var basis_abbr = "";
        var basis_name = ""
        if(spells_known.spellcasting_basis_values !== undefined && spells_known.spellcasting_basis_values !== null &&
            spells_known.spellcasting_basis_values.length > 0) {
                basis_abbr = spells_known.spellcasting_basis_label.substring(0, 1).toUpperCase();
                basis_name = toTitleCase(spells_known.spellcasting_basis_label);
            }
        return (
            (spells_known && spells_known.spell_list.length > 0) &&
                <Row className="card-text">
                    <Col>
                        {spells_known.spell_like_abilities && spells_known.spell_like_abilities.abilities.length > 0 &&
                            <SpellLikeAbilities abilities={spells_known.spell_like_abilities} basis={spells_known.spellcasting_basis_label} /> }
                        <div>
                            {(spells_known.spontaneous_caster) ?
                                <span className="font-weight-bold">{spells_known.spellcasting_class && ("".concat(toTitleCase(spells_known.spellcasting_class)))} Spells Known</span> :
                                <span className="font-weight-bold">{spells_known.spellcasting_class && ("".concat(toTitleCase(spells_known.spellcasting_class)))} Spells Prepared</span>
                            }
                            {(spells_known.caster_level || spells_known.difficulty_class) &&
                                <span> ({spells_known.caster_level && "CL ".concat(spells_known.caster_level)}
                                    {(spells_known.caster_level && spells_known.difficulty_class) && "; "}
                                    {spells_known.difficulty_class && "DC ".concat(spells_known.difficulty_class)})</span>
                            }
                        </div>
                        <div className="ml-3">
                            {spells_known.spell_list.map((spell_level, i) =>
                            {
                                return (
                                        <div key={i} className="spell_level">
                                            <span className="font-weight-bold">{spell_level.spell_level}&nbsp;&mdash;&nbsp;</span>
                                            <span>
                                                {spell_level.spells.map((spell, j) => {
                                                    if(j > 0)
                                                        return <span key={j}>,&nbsp;<SpellDisplay spell_name={spell.spell_name} difficulty_class={spell.difficulty_class} 
                                                        basis_spell={spell.basis_spell} basis_abbr={basis_abbr} number_prepared={spell.number_prepared} /></span>
                                                    else
                                                        return <span key={j}><SpellDisplay spell_name={spell.spell_name} difficulty_class={spell.difficulty_class} 
                                                            basis_spell={spell.basis_spell} basis_abbr={basis_abbr} number_prepared={spell.number_prepared} /></span>
                                                })}
                                            </span>
                                        </div>
                                )
                            })}
                        </div>
                        <div>
                            {spells_known.spellcasting_basis_values && (spells_known.spellcasting_basis_values.length > 0) &&
                                <span>
                                    <span className="font-weight-bold">{ basis_abbr }&nbsp;</span>
                                    <span>{ basis_name }</span>;&nbsp;
                                    <span className="font-weight-bold">{ spells_known.spellcasting_basis_values.length > 1 ? toTitleCase(basis_name).concat("s") : toTitleCase(basis_name) }&nbsp;</span>
                                    <span>
                                        { spells_known.spellcasting_basis_values.map( (val, i) => {
                                            if(i>0) return ", ".concat(toTitleCase(val));
                                            else return toTitleCase(val);
                                        })}
                                    </span>
                                </span>
                                
                            }
                        </div>
                    </Col>
                </Row>
        )
    }
}

class SpellLikeAbilities extends Component {
    render() {
        const {abilities, basis} = this.props;
        return (
            <div>
                <div>
                    <span className="font-weight-bold">{basis ? toTitleCase(basis).concat(" Abilities") : "Spell-Like Abilities"}</span>                
                    {(abilities.caster_level || abilities.concentration) &&
                                    <span> ({abilities.caster_level && "CL ".concat(abilities.caster_level)}
                                        {(abilities.caster_level && abilities.concentration) && "; "}
                                        {abilities.concentration && "concentration ".concat(abilities.concentration)})</span>
                                }
                </div>
                <div className="ml-3">
                    {abilities.abilities.map((ability_grp, i) =>
                        {
                            return (
                                    <div key={i} className="spell_level">
                                        <span className="font-weight-bold">{(ability_grp.spell_level && ability_grp.frequency) ?
                                            (ability_grp.frequency.count ?
                                                math.format(ability_grp.spell_level, 0).concat(" (", ability_grp.frequency.count, "/", ability_grp.frequency.per_unit, ")") :
                                                math.format(ability_grp.spell_level, 0).concat(" (", ability_grp.frequency.per_unit, ")")) :
                                            (ability_grp.frequency.count ?
                                                math.format(ability_grp.frequency.count, 0).concat("/", ability_grp.frequency.per_unit) :
                                                ability_grp.frequency.per_unit) }&nbsp;&mdash;&nbsp;</span>
                                        <span>
                                            {ability_grp.abilities.map((spell, j) => {
                                                if(j > 0)
                                                    return <span key={j}>,&nbsp;<SpellDisplay spell_name={spell.spell_name} spell_version={spell.spell_version} difficulty_class={spell.difficulty_class} modifiers={spell.modifiers} /></span>
                                                else
                                                    return <span key={j}><SpellDisplay spell_name={spell.spell_name} spell_version={spell.spell_version} difficulty_class={spell.difficulty_class} modifiers={spell.modifiers} /></span>
                                            })}
                                        </span>
                                    </div>
                            )
                        }
                    )}
                </div>
            </div>
        )
    }
}

class PsychicMagic extends Component {
    render() {
        var {caster_level, concentration, psi_points, spell_list} = this.props;

        return(
            <span>&nbsp;</span>
        )
    }
}

class SpellDisplay extends Component {
    render() {
        var {spell_name, spell_version, difficulty_class, basis_spell, basis_abbr, modifiers, number_prepared, psychic_energy} = this.props;
        var version = math.format(spell_version, 0);
        if(version === 9) version = "IX";
        else if(version === 4) version = "IV";
        else if(version > 4) {
            version = "V";
            for(var i=0; i<spell_version%5; i++)  version = version.concat("I");
        }
        else {
            version = "";
            for(var i=0; i<(spell_version); i++)  version = version.concat("I");
        }

        return(
            <span className="spell_listing">
                {spell_version ?
                    <a href={"https://www.aonprd.com/SpellDisplay.aspx?ItemName=".concat(spell_name, ' ', spell_version)} target="blank">{toTitleCase(spell_name).concat(' ', version)}</a> :
                    <a href={"https://www.aonprd.com/SpellDisplay.aspx?ItemName=".concat(spell_name)} target="blank">{toTitleCase(spell_name)}</a>
                }
                {basis_spell && <sup>{basis_abbr}</sup>}
                {(difficulty_class || number_prepared || modifiers || psychic_energy) && " ("}
                {difficulty_class && "DC ".concat(" ", difficulty_class)}
                {(difficulty_class && (number_prepared || modifiers || psychic_energy)) && ", "}
                {number_prepared && math.format(number_prepared, 0)}
                {(number_prepared && (modifiers || psychic_energy)) && ", "}
                {psychic_energy && "PE ".concat(" ", math.format(psychic_energy, 0))}
                {(psychic_energy && modifiers) && ", "}
                {modifiers && toTitleCase(modifiers) }
                {(difficulty_class || number_prepared || modifiers || psychic_energy) && ")"}
            </span>
        )
    }
}

class DisplayImage extends Component {
    render() {
        const { source, width, height } = this.props;
        var maxHeight = 240;
        var maxWidth = 320;
        if(width > maxWidth || height > maxHeight)
        {
            var newHeight = height;
            var newWidth = width;
            if(width > maxWidth)
            {
                newHeight = maxHeight * (height / width);
                newWidth = width;
            }
            else if(height > maxHeight)
            {
                newWidth = maxHeight * (width / height);
                newHeight = height;
            }
        }

        return(
            <span>
                <Image src={process.env.PUBLIC_URL.concat("/images/", source)} width={newWidth} height={newHeight} fluid />
            </span>
        )
    }


}

class MonsterDetails extends Component {
    constructor(props) {
        super(props);

        this.state = {            
            name : '',
            challenge_rating : null,
            ability_scores : {
                strength : 10,
                dexterity : 10,
                constitution : 10,
                intelligence : 10,
                wisdom : 10,
                charisma : 10
            },
            type : null,
            ac : {
                base : null,
                flat_footed : null,
                touch : null
            },
            alignment : {
                ethical : null,
                moral : null
            },
            attacks : [
                {
                    attack_name : null,
                    attack_type : null,
                    addl_dmg_attack : null,
                    attack_count : null,
                    bonus_damage : null,
                    damage_die : null,
                    dmg_dice_count : null,
                }
            ],
            base_attack_bonus : null,
            cmb : {
                base : null,
                bull_rush : null,
                dirty_trick : null,
                disarm : null,
                drag : null,
                grapple : null,
                overrun : null,
                reposition : null,
                steal : null,
                sunder : null,
                trip : null,
            },
            cmd : {
                base : null,
                bull_rush : null,
                can_bull_rush : null,
                dirty_trick : null,
                can_dirty_trick : null,
                disarm : null,
                can_disarm : null,
                drag : null,
                can_drag : null,
                grapple : null,
                can_grapple : null,
                overrun : null,
                can_overrun : null,
                reposition : null,
                can_reposition : null,
                steal : null,
                can_steal : null,
                sunder : null,
                can_sunder : null,
                trip : null,
                can_trip : null,
            },
            description : null,
            experience_points : null,
            feats : [
                {
                    name : null,
                    is_bonus : null,
                    feat_focus : null
                }
            ],
            saving_throws : {
                fortitude : null,
                reflex : null,
                will : null
            },
            hp : {
                    hit_dice : [ 
                    {
                        count: null,
                        faces : null
                    }
                ],
                bonus_hit_points : null
            },
            initiative_bonus : null,
            perception_bonus : null,
            space: null,
            reach : null,
            scenarios : [  ],
            size : null,
            sources : [
                {
                    title : null,
                    page : null
                }
            ]
        }
    }

    componentDidMount(props) {
        axios.get('http://localhost:4000/creatures/'+this.props.match.params.id)
        .then(response => {
            this.setState(response.data);
        })
        .catch(function (error) {
            console.log(error);
        });
    }

    render() {
        return (
            <div className="card-container mb-3">
                <div className="card-body">
                    <Row className="card-side side-front no-gutters justify-content-center">
                        <Col md="10">
                            <div className="side-front-content">
                                {(this.state.image) ?
                                    <DisplayImage source={this.state.image.source} width={this.state.image.width} height={this.state.image.height} />
                                  : <Image src={"".concat(process.env.PUBLIC_URL, "/images/Pathfinder.png")} fluid />
                                }
                            </div>
                            <h1 className="creature-title">{this.state.name}</h1>
                        </Col>
                    </Row>
                    <Row className="card-side side-back no-gutters justify-content-center">
                        <Col md="10">
                            <div className="side-back-content">
                                <div className="card-title">
                                    <h5>{ this.state.name }</h5>
                                </div>
                                {this.state.description &&
                                    <div className="card-text">
                                        <div>{ this.state.description }</div>
                                    </div>
                                }
                                <NameAndCR name={this.state.name} family={this.state.family} subfamilies={this.state.subfamilies} alt_name={this.state.alt_name} challenge_rating={this.state.challenge_rating} />
                                <Experience exp_points={ this.state.experience_points } />
                                {
                                    (this.state.player_class && this.state.race && this.state.level) &&
                                        <div className="card-text">
                                            { this.state.unique && "Unique " }
                                            { this.state.sex && this.state.sex + "&nbsp;"}
                                            { this.state.template && this.state.template }
                                            { this.state.player_class + " &nbsp;" + this.state.level }
                                        </div>
                                }
                                {this.state.alignment &&
                                    <AlignmentSizeAndType ethical={this.state.alignment.ethical} moral={this.state.alignment.moral} size={this.state.size} type={this.state.type} subtypes={this.state.subtypes} />
                                }
                                <Senses initiative_bonus={this.state.initiative_bonus} senses_list={this.state.senses} perception_bonus={this.state.perception_bonus} />
                                { (this.state.auras && this.state.auras.length > 0) &&
                                    <Auras aura_list={this.state.auras} /> 
                                }
                                <div className="card-text border-top border-bottom border-secondary font-weight-bold section-header">Defense</div>
                                {this.state.ac &&
                                    <ArmorClass ac={this.state.ac.base} touch={this.state.ac.touch} flat_footed={this.state.ac.flat_footed} bonuses={this.state.ac.bonuses } />
                                }
                                {this.state.hp &&
                                    <HitPointRules hit_dice={this.state.hp.hit_dice} bonus_hit_points={this.state.hp.bonus_hit_points} healing_abilities={this.state.healing_abilities } has_class_levels={ this.state.player_class_list == null } />
                                }
                                {this.state.saving_throws &&
                                    <SavingThrows fortitude={this.state.saving_throws.fortitude} reflex={this.state.saving_throws.reflex} will={this.state.saving_throws.will} modifiers={this.state.saving_throws.saving_throw_modifiers} />
                                }
                                <SpecialDefenses abilities={this.state.defensive_abilities} damage_reduction={this.state.damage_reduction} resistances={this.state.resistances} immunities={this.state.immunities} spell_resistance={this.state.spell_resistance} />
                                <div className="card-text border-top border-bottom border-secondary font-weight-bold section-header">Offense</div>
                                <Speed speed={this.state.speed} />
                                <AttackBlock attacks={this.state.attacks} />
                                { (this.state.space !== undefined && this.state.space !== null && 
                                    this.state.reach !== undefined && this.state.reach !== null) &&
                                    <Area space={this.state.space} reach={this.state.reach} />
                                }
                                { (this.state.special_attacks && this.state.special_attacks.length > 0) &&
                                    <div className="card-text">
                                        <span className="font-weight-bold">Special Attacks&nbsp;</span> 
                                        { 
                                            this.state.special_attacks.map((atk) => {
                                                return he.unescape(atk)
                                            }).join(', ') 
                                        }
                                    </div>
                                }
                                { this.state.spell_like_abilities && 
                                    <div className="card-text">
                                        <SpellLikeAbilities abilities={this.state.spell_like_abilities} />
                                    </div>
                                }
                                { this.state.spells_known && 
                                    <SpellList spells_known={this.state.spells_known} />
                                }
                                <div className="card-text border-top border-bottom border-secondary font-weight-bold section-header">Statistics</div>
                                { this.state.ability_scores &&
                                    <div className="card-text">
                                        <AbilityScores strength={this.state.ability_scores.strength} dexterity={this.state.ability_scores.dexterity} constitution={this.state.ability_scores.constitution}
                                            wisdom={this.state.ability_scores.wisdom} intelligence={this.state.ability_scores.intelligence} charisma={this.state.ability_scores.charisma} />
                                    </div>
                                }
                                <CombatManeuvers bab={this.state.base_attack_bonus} cmb={this.state.cmb} cmd={this.state.cmd} />
                                { (this.state.feats && this.state.feats.length > 0) &&
                                    <FeatsList feats={this.state.feats} />
                                }
                                { (this.state.skills && this.state.skills.length > 0) &&
                                    <SkillsList skills={this.state.skills} />
                                }
                                { (this.state.racial_modifiers && this.state.racial_modifiers.length > 0) &&
                                    <RacialModifiers skills={this.state.racial_modifiers} />
                                }
                                { (this.state.special_qualities && this.state.special_qualities.length > 0) &&
                                    <SpecialQualities special_qualities={this.state.special_qualities} />
                                }
                                { (this.state.special_abilities && this.state.special_abilities.length > 0) &&
                                    <div>
                                        <div className="card-text border-top border-bottom border-secondary font-weight-bold section-header">Special Abilities</div>
                                        <SpecialAbilities special_abilities={this.state.special_abilities} />
                                    </div>
                                }
                            </div>
                        </Col>
                    </Row>
                </div>
            </div>
        )
    }
}

export default MonsterDetails;