import { format } from 'mathjs';
import Dice from './dice';
import { HealingAbilities, HitPoints } from "./interfaces";
import UniversalMonsterRuleDialog from './umr-dialog.components';
import { empty_string } from "./Utils";

const HitPointBlock = ({creature_name, hit_points, healing_abilities} : {creature_name: string, hit_points: HitPoints, healing_abilities: Array<HealingAbilities> }) => {
    const { hit_dice, bonus_hit_points } = hit_points;

    let avergeHitPoints = 0;
    let hitDice = empty_string;
    let hpFormula = empty_string;
    if(hit_dice !== undefined && hit_dice !== null && hit_dice.length > 0) {
        hit_dice.forEach((hd) => {
            let die = new Dice(hd.count, hd.faces);
            avergeHitPoints += die.average();
        });
        if(bonus_hit_points) {
            avergeHitPoints += bonus_hit_points;
        }

        if(hit_dice.length > 1) {
            let hd_count = 0;
            hit_dice.forEach((hd) => {
                hd_count += hd.count;
            });

            hitDice = format(hd_count, 0).concat(" HD; ");
        }

        let hp_rules = hit_dice.map((hd) => {
            let die = new Dice(hd.count, hd.faces);
            return die.toDiceText();
        });
        
        hpFormula = "(".concat(hp_rules.join("+"));
        if(bonus_hit_points !== undefined && bonus_hit_points !== null) {
            if(bonus_hit_points > 0) hpFormula = hpFormula.concat("+", format(bonus_hit_points, 0));
            else hpFormula = hpFormula.concat(format(bonus_hit_points, 0));
        }
        hpFormula = hpFormula.concat(")");
    }

    return (
        <div className="card-text">
            <div>
                <span className="font-weight-bold">hp&nbsp;</span>
                { avergeHitPoints }
                { hitDice && ` ${hitDice}` }
                { hpFormula && ` ${hpFormula}` }
                { healing_abilities && healing_abilities.length > 0 && ';'.concat('\u00A0')}
                { healing_abilities && healing_abilities.length > 0 &&
                    healing_abilities.map((heals: HealingAbilities) => {
                        var text = `${heals.ability} ${format(heals.rate, 0)}`;
                        if(heals.prevention !== undefined && heals.prevention !== null && heals.prevention.length > 0)
                        {
                            var first = true;
                            var prev_text = empty_string;
                            heals.prevention.forEach((prev) =>{
                                if(first) {
                                    first = false;
                                } else {
                                    if(heals.prevention.indexOf(prev)  === heals.prevention.length - 1) {
                                        prev_text += '\u00A0'.concat('and','\u00A0');
                                    } else {
                                        prev_text += ','.concat('\u00A0')
                                    }
                                }
                                prev_text += prev;
                            });

                            text = text.concat('\u00A0', '(', prev_text, ")");
                        }

                        return <UniversalMonsterRuleDialog creatureName={creature_name} searchText={heals.ability}  displayText={text} />
                    })
                }
            </div>
        </div>
    )
}

export default HitPointBlock;