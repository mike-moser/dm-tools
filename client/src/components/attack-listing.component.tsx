import { format } from "mathjs";
import Dice from "./dice";
import { space_char, toSignedValue } from "./Utils";

export enum AttackType { melee, ranged }

export interface AttackBlock {
    attack_name : string,
    attack_type : AttackType,
    damage_type : string,
    to_hit_bonuses : number[],
    addl_dmg_attack : string,
    attack_count : number,
    bonus_damage : number,
    damage_die : number,
    dmg_dice_count : number,
    is_touch_attack : boolean,
    optional_attack : boolean
}

export const AttackListing = ({ attacks } : { attacks: Array<AttackBlock> }) => {

    let melee_attacks: Array<AttackBlock> = [];
    let ranged_attacks: Array<AttackBlock> = [];
    attacks.forEach(atk => {
        if(atk.attack_type && atk.attack_type === AttackType.ranged) ranged_attacks.push(atk);
        else melee_attacks.push(atk);
    });

    return (
        <div className='card-text'>
            <div>
                { 
                    (melee_attacks && melee_attacks.length > 0) &&
                        <AttackList attacks={ melee_attacks } atkType={ AttackType.melee } />
                }
                { 
                    (ranged_attacks && ranged_attacks.length > 0) &&
                        <AttackList attacks={ ranged_attacks } atkType={ AttackType.ranged } />
                }
            </div>
        </div>
    )
}

export const AttackList = ({ attacks, atkType } : { attacks: Array<AttackBlock>, atkType: AttackType }) => {
    
    return(
        <div id={atkType === AttackType.melee ?  'melee_attacks' : 'ranged_attacks'}>
            <span className='font-weight-bold'>{ atkType === AttackType.melee ?  'Melee' : 'Ranged' }&nbsp;</span>
            {attacks.map((atk: AttackBlock, i: number) => {                
                let attackDice = new Dice(atk.dmg_dice_count, atk.damage_die);

                return (
                    <span key={i}>
                        {atk.attack_count && format(atk.attack_count, 0).concat(space_char)}
                        {atk.attack_name && atk.attack_name}                        
                        {(atk.to_hit_bonuses && atk.to_hit_bonuses.length > 0) && (
                            space_char.concat(
                                atk.to_hit_bonuses.map((thb) => {
                                    return toSignedValue(thb);
                                }).join('/'))
                            )
                        }

                        {((attackDice !== undefined && attackDice !== null) || atk.damage_type) && ' ('.concat(attackDice.toDiceText(atk.bonus_damage))}
                        {atk.damage_type && (atk.dmg_dice_count && atk.damage_die) ? space_char.concat(atk.damage_type, space_char) : atk.damage_type}
                        {atk.addl_dmg_attack && ' plus '.concat(atk.addl_dmg_attack)}
                        {((atk.dmg_dice_count && atk.damage_die) || atk.damage_type) && ')'}                            
                        {atk.is_touch_attack && ' touch'}
                        {atk.optional_attack && (i < attacks.length - 1) && ' or '}
                        {(i < attacks.length - 1 && !atk.optional_attack) ? ', ' : ''}
                    </span>
                )
            })}
            
        </div>
    )
}