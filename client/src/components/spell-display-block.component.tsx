import { format } from "mathjs";
import { createSpellLink, empty_string, ordinalSuffixOf, space_char, toTitleCase } from "./Utils";

export interface PsychicMagicEntry {
    caster_level: number;
    concentration: number;
    psychic_energy_points: number;
    spell_list: SpellBlock[];
}

export interface SpellCasterBlock {
    caster_level: number,
    difficulty_class: number,
    spontaneous_caster: boolean,
    spellcasting_class: string,
    spellcasting_basis_label: string,
    spellcasting_basis_values: string[],
    spell_list: SpellLevelBlock[],
    spell_like_abilities: SpellLikeAbilityBlock
}

export interface SpellLevelBlock {
    spell_level: number,
    spells: SpellBlock[]
}

export interface SpellLikeAbilityBlock {
    caster_level: number,
    difficulty_class: number,
    concentration: number,
    abilities: SpellLikeAbilityGroup[]
}

export interface SpellLikeAbilityGroup {
    spell_level: number,
    frequency: Frequency,
    ability_list: SpellBlock[]
}

export interface Frequency {
    count: number,
    per_unit: string
}

export interface SpellBlock {
    spell_name: string,
    spell_version: number,
    difficulty_class: number, 
    modifiers: string,
    number_prepared: number,
    basis_spell: boolean,
    basis_value: string,
    psi_points: number
}

export const SpellDisplayBlock = ({ spell_block, basis_type, is_basis_ability } : { spell_block: SpellBlock, basis_type: string, is_basis_ability: boolean }) => {
    
    var { spell_name, spell_version, difficulty_class, modifiers, basis_value, number_prepared, psi_points } = spell_block;
    var version = format(spell_version, 0);
    if(spell_version === 9) version = "IX";
    else if(spell_version === 4) version = "IV";
    else { 
        if(spell_version > 4) {
            version = "V";
        }
        for(var i=0; i<spell_version%5; i++)  version = version.concat("I");
    }

    var url = createSpellLink(spell_name, spell_version, is_basis_ability, basis_value, basis_type);
    return(
        <span className="spell_listing">
            {spell_version ?
                <a href={url} target="blank">{toTitleCase(spell_name).concat(' ', version)}</a> :
                <a href={url} target="blank">{toTitleCase(spell_name)}</a>
            }
            {is_basis_ability && basis_type && <sup>{basis_type[0].toUpperCase()}</sup>}
            {(!(difficulty_class === undefined || difficulty_class === null) || !(number_prepared === undefined || number_prepared === null) || modifiers || !(psi_points === undefined || psi_points === null)) && " (" }
            {!(difficulty_class === undefined || difficulty_class === null) && "DC ".concat(space_char, format(difficulty_class, 0))}
            {(difficulty_class && (!(number_prepared === undefined || number_prepared === null) || modifiers || !(psi_points === undefined || psi_points === null))) && ", "}
            {!(number_prepared === undefined || number_prepared === null) && format(number_prepared, 0)}
            {(!(number_prepared === undefined || number_prepared === null) && (modifiers || !(psi_points === undefined || psi_points === null))) && ", "}
            {!(psi_points === undefined || psi_points === null) && format(psi_points, 0).concat(" PE")}
            {(!(psi_points === undefined || psi_points === null) && modifiers) && ", "}
            {modifiers && toTitleCase(modifiers) }
            {(!(difficulty_class === undefined || difficulty_class === null) || !(number_prepared === undefined || number_prepared === null) || modifiers || !(psi_points === undefined || psi_points === null)) && ")"}
        </span>
    )
}

export const SpellList = ({spells_known} : {spells_known: SpellCasterBlock}) => {
    
    return (
        <div className="card-text">
        {(spells_known && spells_known.spell_list.length > 0) &&
            <div>
                {spells_known.spell_like_abilities && spells_known.spell_like_abilities.abilities.length > 0 &&
                    <SpellcastingBasisAbilities abilities={spells_known.spell_like_abilities} basis={spells_known.spellcasting_basis_label} /> }
                <div>
                    {(spells_known.spontaneous_caster) ?
                        <span className="font-weight-bold">{spells_known.spellcasting_class && toTitleCase(spells_known.spellcasting_class)} Spells Known</span> :
                        <span className="font-weight-bold">{spells_known.spellcasting_class && toTitleCase(spells_known.spellcasting_class)} Spells Prepared</span>
                    }
                    {(spells_known.caster_level || spells_known.difficulty_class) &&
                        <span> ({spells_known.caster_level && "CL " + spells_known.caster_level}
                            {(spells_known.caster_level && spells_known.difficulty_class) && "; "}
                            {spells_known.difficulty_class && "DC " + spells_known.difficulty_class})</span>
                    }
                </div>
                <div className="ml-3">
                    {spells_known.spell_list.map((spell_level, i) =>
                    {
                        return (
                            <div key={i} className="spell_level">
                                <span className="font-weight-bold">{ordinalSuffixOf(spell_level.spell_level)}&nbsp;&mdash;&nbsp;</span>
                                <span>
                                    {spell_level.spells.map((spell, j) => {
                                        return <span key={j}>
                                                    <SpellDisplayBlock spell_block={spell} basis_type={spells_known.spellcasting_basis_label} is_basis_ability={spell.basis_spell} />
                                                    {(j < spell_level.spells.length - 1) ? ', ' : ''}
                                                </span>
                                    })}
                                </span>
                            </div>
                        )
                    })}
                </div>
                <div>
                    {spells_known.spellcasting_basis_values && spells_known.spellcasting_basis_values.length > 0 &&
                        <span>
                            <span className="font-weight-bold">{ spells_known.spellcasting_basis_label[0].toUpperCase() }&nbsp;</span>
                            <span>{ spells_known.spellcasting_basis_label }</span>;&nbsp;
                            <span className="font-weight-bold">{ spells_known.spellcasting_basis_values.length > 1 ? toTitleCase(spells_known.spellcasting_basis_label).concat("s") : toTitleCase(spells_known.spellcasting_basis_label) }&nbsp;</span>
                            <span>
                                { spells_known.spellcasting_basis_values.map(val => {
                                    return toTitleCase(val);
                                }).join(', ')}
                            </span>
                        </span>
                    }
                </div>
            </div>
            }
        </div>
    )
}

export const SpellLikeAbilities = ({abilities, basis} : { abilities: SpellLikeAbilityBlock, basis: string }) => {
    return (
        <div>
            <div>
                <span className="font-weight-bold">{basis && basis.trim().length > 0 ? toTitleCase(basis).concat(" Abilities") : "Spell-Like Abilities"}</span>                
                {(abilities.caster_level || abilities.concentration) &&
                    <span> ({abilities.caster_level && "CL ".concat(format(abilities.caster_level, 0))}
                        {(abilities.caster_level && abilities.concentration) && "; "}
                        {abilities.concentration && "concentration ".concat(format(abilities.concentration, 0))})</span>
                }
            </div>
            <div className="ml-3">
                {abilities.abilities.map((ability_grp, i) =>
                    {
                        return (
                            <div key={i} className="spell_level">
                                <span className="font-weight-bold">{(ability_grp.spell_level && ability_grp.frequency) ?
                                    (ability_grp.frequency.count ?
                                        format(ability_grp.spell_level, 0).concat(" (", format(ability_grp.frequency.count, 0), "/", ability_grp.frequency.per_unit, ")") :
                                        format(ability_grp.spell_level, 0).concat(" (", ability_grp.frequency.per_unit, ")")) :
                                    (ability_grp.frequency.count ?
                                        format(ability_grp.frequency.count, 0).concat("/", ability_grp.frequency.per_unit) :
                                        ability_grp.frequency.per_unit) }&nbsp;&mdash;&nbsp;</span>
                                <span>
                                    { ability_grp.ability_list &&
                                        ability_grp.ability_list.map((spell, j) => {
                                            return <span key={j}>
                                                        <SpellDisplayBlock spell_block={spell} basis_type={basis} is_basis_ability={spell.basis_spell} />
                                                        {(j < ability_grp.ability_list.length - 1) ? ', ' : ''}
                                                    </span>
                                        })
                                    }
                                </span>
                            </div>
                        )
                    }
                )}
            </div>
        </div>
    )
}

export const SpellcastingBasisAbilities = ({abilities, basis} : {abilities: SpellLikeAbilityBlock, basis: string}) => {
    
    return (
        <div>
            <div>
                <span className="font-weight-bold">{basis ? toTitleCase(basis).concat(" Abilities") : "Spell-Like Abilities"}</span>                
                {(abilities.caster_level || abilities.concentration) &&
                    <span> ({abilities.caster_level && "CL ".concat(format(abilities.caster_level, 0))}
                        {(abilities.caster_level && abilities.concentration) && "; "}
                        {abilities.concentration && "concentration ".concat(format(abilities.concentration, 0))})</span>
                }
            </div>
            <div className="ml-3">
                {abilities.abilities.map((ability_grp, i) =>  {
                    return (
                        <div key={i} className="spell_level">
                            <span className="font-weight-bold">{(ability_grp.spell_level && ability_grp.frequency) ?
                                (ability_grp.frequency.count ?
                                    format(ability_grp.spell_level, 0).concat(" (", format(ability_grp.frequency.count, 0), "/", ability_grp.frequency.per_unit, ")") :
                                    format(ability_grp.spell_level, 0).concat(" (", ability_grp.frequency.per_unit, ")")) :
                                (ability_grp.frequency.count ?
                                    format(ability_grp.frequency.count, 0).concat("/", ability_grp.frequency.per_unit) :
                                    ability_grp.frequency.per_unit) }&nbsp;&mdash;&nbsp;</span>
                            <span>
                                { ability_grp.ability_list &&
                                    ability_grp.ability_list.map((spell, j) => {
                                        let isBasisSpell = false;
                                        if('basis_spell' in spell && spell.basis_spell !== undefined && spell.basis_spell !== null) isBasisSpell = true;
                                        return  <span key={j}><SpellDisplayBlock spell_block={spell} basis_type={basis} is_basis_ability={isBasisSpell} />{(j < ability_grp.ability_list.length - 1) ? ', ' : ''}</span>
                                    })
                                }
                            </span>
                        </div>
                        )
                    }
                )}
            </div>
        </div>
    )
}

export const PsychicMagicBlock = ({ psychic_magic } : { psychic_magic: PsychicMagicEntry }) => {
    
    var {caster_level, concentration, psychic_energy_points, spell_list} = psychic_magic;

    return(
        <div className="card-text">
            <div>
                <div>
                    {(caster_level || concentration) &&
                        <span><span className="font-weight-bold">Psychic Magic</span> ({caster_level && "CL ".concat(format(caster_level, 0))}
                            {(caster_level && concentration) && "; "}
                            {concentration && "concentration ".concat(concentration > 0 ? "+".concat(format(concentration, 0)) : format(concentration, 0))})</span>
                    }
                </div>
                <div>                        
                    { psychic_energy_points && 
                        <span>{ format(psychic_energy_points, 0).concat(" PE") }&nbsp;&mdash;&nbsp;</span>
                    }
                    {spell_list && 
                        spell_list.map((spell: SpellBlock, i: number) => {
                            return <span key={i}><SpellDisplayBlock spell_block={spell} basis_type={empty_string} is_basis_ability={false} />{(i < spell_list.length - 1) && ', '}</span>
                        })
                    }
                </div>
            </div>
        </div>
    )
}