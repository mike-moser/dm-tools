import { format, isNumeric } from "mathjs"
import UniversalMonsterRuleDialog from "./umr-dialog.components";
import { empty_string, space_char, toSignedValue } from "./Utils"


export interface DefensiveAbility {
    ability_name: string,
    ability_modifier: string
}

export interface DamageReduction {
    reduction_value: number,
    overcome: string[],
    combined: boolean
}

export interface SpecialDefenses {
    defenses: DefensiveAbility[],
    damage_reduction: DamageReduction[],
    immunities: string[],
    spell_resistance: number
}

export interface Resistance {
    resistance_type : string,
    resistance_value : number
}

export const Resistances = ({ resistances } : { resistances: Array<Resistance> }) => {
    
    return (
        <span id='resistances'>
            <span className='font-weight-bold'><UniversalMonsterRuleDialog creatureName="" searchText="Resistance" displayText="Resist" />&nbsp;</span>
            {resistances.map((resist : Resistance, i : number) => {
                var separator = i > 0;

                return (
                    <span key={i}>
                        {(separator && ','.concat('\u00A0'))} 
                        {(resist.resistance_type && resist.resistance_value)  && 
                            resist.resistance_type.concat(space_char, format(resist.resistance_value, 0))}
                    </span>
                )
            })}
        </span>
    )
}

export const DRBlock = ({ dmgReduction } : { dmgReduction: DamageReduction }) => {
    
    return ( 
        <span id='dmg_reduction'>
            <span className="font-weight-bold"><UniversalMonsterRuleDialog creatureName="" searchText="Damage Resistance" displayText="DR" />&nbsp;</span>{ 
                dmgReduction.reduction_value.toString().concat('/', dmgReduction.overcome ? dmgReduction.overcome.map((ovr) => {
                        return ( ovr )
                    }).join(dmgReduction.combined ? 'and ' : 'or ') : '\u2014')
            } 
        </span>
    )
}

export const DefensiveAbilities = ({ creatureName, defenses } : { creatureName: string, defenses: Array<DefensiveAbility> }) => {
    
    return (
        <span id="defensive_abilities">
            <span className="font-weight-bold">Defensive Abilities&nbsp;</span>
            {defenses.map((def : DefensiveAbility, i : number) => {
                let separator = (i > 0);
                let searchText = def && def.ability_name && def.ability_name;
                let displayText =  (def && def.ability_name) ? def.ability_name : empty_string;
                if(def && def.ability_modifier)
                    displayText = displayText.concat(space_char, isNumeric(def.ability_modifier) ? toSignedValue(Number.parseInt(def.ability_modifier)) : def.ability_modifier);                    

                    return <span key={i}>
                                {separator && ','.concat('\u00A0')}
                                {def && def.ability_name && <UniversalMonsterRuleDialog creatureName={creatureName} searchText={searchText} displayText={displayText} />}
                            </span>
            })}
        </span>
    )
}