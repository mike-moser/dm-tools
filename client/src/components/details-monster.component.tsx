import { useState, useEffect } from 'react';
import axios from 'axios';
import { format } from 'mathjs';
import { unescape } from 'he';
import { PlayerClass } from './interfaces';
import Monster from './monster';
import ImageSlider from './image-slider.component';
import SensesBlock from './senses-block.component';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faDragon } from '@fortawesome/free-solid-svg-icons';
import { space_char, toTitleCase } from './Utils';
import NameBlock from './name-block.component';
import ExperienceBlock from './xp-block.component';
import AlignmentBlock from './align-block.component';
import AuraBlock from './aura-block.component';
import ACBlock from './armor-class-block.component';
import HitPointBlock from './hit-point-block.component';
import SavingThrowBlock from './saving-throw-block.component';
import AreaBlock from './space-reach-block.component';
import { PsychicMagicBlock, SpellLikeAbilities, SpellList } from './spell-display-block.component';
import GearDisplayBlock from './gear-display-block.component';
import { RacialModifiers, SkillsList } from './skills-list.component';
import { SpecialAbilities } from './special-ability-list.component';
import { AttackListing } from './attack-listing.component';
import { DefensiveAbilities, DRBlock, Resistances } from './defensive-abilities.component';
import { CombatManeuversBlock } from './combat-maneuvers.component';
import SpeedBlock from './speed-block.component';
import FeatsBlock from './feat-block.component';
import AbilityScoreBlock from './ability-scores.component';
import { SpecialQualities } from './special-qualities-block.component';
import { Immunities } from './immune-block.component';
import UniversalMonsterRuleDialog from './umr-dialog.components';

const PlayerClassDetails = ({sex, race, player_classes, is_unique} : {sex: string, race: string, player_classes: Array<PlayerClass>, is_unique: boolean}) => {
    
    return (
        <div className="card-text">
            <div>
                {is_unique && "Unique "}
                {sex && toTitleCase(sex)}
                {sex && (race || player_classes) && space_char}
                {race && race}
                {race && player_classes && space_char}
                {player_classes && 
                    player_classes.map((cls, i) =>{
                        var separator = (i > 0);
                        
                        return  <span key={i}>
                                    <span>{separator && ', '}{cls.class_name && toTitleCase(cls.class_name)} {cls.level && format(cls.level, 0)}</span>
                                </span> 
                    })
                }

            </div>
        </div>
    );
}



const MonsterDetails = (props: any) => {

   const [monster, setMonster] = useState<Monster>(new Monster('creature'));

   let monsterId : any = props.creatureId;

   useEffect(() => {
    axios.get(`http://localhost:4000/creatures/find/${monsterId}`)
        .then(response => {
            var creature = response.data;
                setMonster(creature);
            })
            .catch(function (error) {
                console.log(error);
            });
        }, [monsterId])

    let { name, family, subfamilies, alt_name, challenge_rating, adjustment } = monster;
    let { experience_points, images } = monster;
    let { player_classes, race, sex, is_unique } = monster;
    let { type, subtypes, size, alignment, languages, flavor_text } = monster;
    let { initiative_bonus, perception_bonus, senses, auras } = monster;
    let { armor_class, ability_scores } = monster;
    let { hp, healing_abilities, special_qualities, special_abilities } = monster;
    let { saving_throws, feats, skills, racial_modifiers } = monster;
    let { defensive_abilities, damage_reduction, immunities, resistances, spell_resistance} = monster;
    let { attacks, special_attacks, speed, space, reach } = monster;
    let { spell_like_abilities, spells_known, psychic_magic } = monster;
    let { base_attack_bonus, combat_maneuver_bonus, combat_maneuver_defense } = monster;
    let { sources, inventory } = monster;
    
    let has_defensive_abilities = defensive_abilities && defensive_abilities.length > 0;
    let has_damage_reduction = damage_reduction && damage_reduction.reduction_value;
    let has_immunities = immunities && immunities.length > 0;
    let has_resistances = resistances && resistances.length > 0;
    let has_area = (space !== undefined && space !== null) || (reach !== undefined && reach !== null);
    let npc_link = false;
    let base = 'https://aonprd.com/MonsterDisplay.aspx?ItemName=';
    let npcBase = 'https://aonprd.com/NPCDisplay.aspx?ItemName=';

    return (
        <div className="card-container rounded">
            <div className="detail-body justify-content-center">
                { images && images.length > 0 &&
                    <ImageSlider images={images} />
                }
                <div className="md-10">
                    <div className="card-title">
                        <h5>{adjustment && toTitleCase(adjustment).concat(space_char)}{name}</h5>
                        { sources && sources.length > 0 &&
                            <div className="source-block">
                                {sources.map((src, i) => {
                                    if('npcLink' in src && src.npcLink !== undefined && src.npcLink !== null && src.npcLink === true) {
                                        npc_link = true;
                                    }
                                    if(src.title !== undefined && src.title !== null && src.page !== undefined && src.page !== null)
                                        return <span key={i}>
                                                    <small>{(i>0?', ':'').concat(src.title, " pg. ", format(src.page)) }&nbsp;</small>
                                                </span>
                                    else return "";
                                })}
                                {npc_link ?                                 
                                    <a href={npcBase.concat(name)} target="_blank" rel="noreferrer">
                                        <FontAwesomeIcon icon={ faDragon } size="xs" />
                                    </a> :                                    
                                    <a href={base.concat(name)} target="_blank" rel="noreferrer">
                                        <FontAwesomeIcon icon={ faDragon } size="xs" />
                                    </a>
                                }
                            </div>
                        }
                    </div>
                    <div className="container">
                        <div className="p-0">
                            {flavor_text &&
                                <div className="card-text">
                                    <div>{flavor_text}</div>
                                </div>
                            }
                            <NameBlock name={name} family={family || ''} subfamilies={subfamilies || []} alt_name={alt_name || ''} challenge_rating={challenge_rating || 0} adjustment={adjustment || ''} />
                            <ExperienceBlock xp={ experience_points } />
                            {
                                ((player_classes && player_classes.length > 0) || race || sex || is_unique) &&
                                    <PlayerClassDetails sex={sex || ''} race={race || ''} player_classes={player_classes || []} is_unique={is_unique} />
                            }
                            {alignment &&
                                <AlignmentBlock ethical={alignment.ethical} moral={alignment.moral} size={size || ''} type={type || ''} subtypes={subtypes || []} challengeRating={challenge_rating || 0}/>
                            }
                            
                            
                            <SensesBlock creatureName={ name } initiative_bonus={initiative_bonus} perception_bonus={perception_bonus} extra_senses={senses || []} />
                            { (auras && auras.length > 0) &&
                                <AuraBlock auras={auras || []} /> 
                            }
                            <div className="card-text border-top border-bottom border-secondary font-weight-bold section-header">Defense</div>
                            {armor_class &&
                                <ACBlock total={armor_class.total} touch={armor_class.touch} flat_footed={armor_class.flat_footed} bonuses={armor_class.bonuses } />
                            }
                            {hp &&
                                <HitPointBlock creature_name={name} hit_points={hp} healing_abilities={healing_abilities || [] } />
                            }
                            {saving_throws &&
                                <SavingThrowBlock saves={ saving_throws } />
                            }
                            {(has_defensive_abilities || has_damage_reduction || has_immunities || has_resistances || spell_resistance) &&
                                <div className="card-text">
                                    {defensive_abilities && has_defensive_abilities &&
                                        <span>
                                            <DefensiveAbilities creatureName={ name } defenses={ defensive_abilities } />
                                        </span>
                                    }
                                    {has_defensive_abilities && (has_damage_reduction || has_immunities || has_resistances || spell_resistance) && '; '}
                                    {damage_reduction && has_damage_reduction && 
                                        <span>
                                            <DRBlock dmgReduction={ damage_reduction } /> 
                                        </span>
                                    }
                                    {has_damage_reduction && (has_immunities || has_resistances || spell_resistance) && '; '}
                                    {immunities && has_immunities &&
                                        <span>
                                            <Immunities creature_name={name} immunities={immunities} />
                                        </span>
                                    }
                                    {has_immunities && (has_resistances || spell_resistance) && '; '}
                                    { has_resistances && resistances &&
                                        <span>
                                            <Resistances resistances={ resistances } />
                                        </span>
                                    }
                                    {has_resistances && spell_resistance && '; '}
                                    {spell_resistance &&
                                        <span className="card-text">
                                            <span className="font-weight-bold"><UniversalMonsterRuleDialog creatureName={ name } searchText="Spell Resistance" displayText="SR" />&nbsp;</span>{spell_resistance}
                                        </span>
                                    }
                                </div>
                            }
                            <div className="card-text border-top border-bottom border-secondary font-weight-bold section-header">Offense</div>
                            {speed &&
                                <SpeedBlock speed={ speed } />
                            }
                            {attacks &&
                                <AttackListing attacks={attacks} />
                            }
                            { has_area &&
                                <AreaBlock space={space || 0} reach={reach || 0} />
                            }
                            { (special_attacks && special_attacks.length > 0) &&
                                <div className="card-text">
                                    <span className="font-weight-bold">Special Attacks&nbsp;</span> 
                                    { 
                                        special_attacks.map((atk) => {
                                            return unescape(atk)
                                        }).join(', ') 
                                    }
                                </div>
                            }
                            { spell_like_abilities && spell_like_abilities.abilities && 
                                spell_like_abilities.abilities.length > 0 &&
                                <div className="card-text">
                                    <SpellLikeAbilities abilities={spell_like_abilities} basis={space_char} />
                                </div>
                            }
                            { spells_known && 
                                <SpellList spells_known={spells_known} />
                            }
                            { psychic_magic &&
                                <PsychicMagicBlock psychic_magic={psychic_magic}  />
                            }
                            <div className="card-text border-top border-bottom border-secondary font-weight-bold section-header">Statistics</div>
                            { ability_scores &&
                                <div className="card-text">
                                    <AbilityScoreBlock ability_scores={ability_scores} />
                                </div>
                            }
                            { ((base_attack_bonus && base_attack_bonus.length > 0) && combat_maneuver_bonus && combat_maneuver_defense) &&
                                <CombatManeuversBlock bab={base_attack_bonus} cmb={combat_maneuver_bonus} cmd={combat_maneuver_defense} />
                            }
                            { (feats && feats.length > 0) &&
                                <FeatsBlock feats={feats} />
                            }
                            { (skills && skills.length > 0) &&
                                <SkillsList skills={skills} />
                            }
                            { (racial_modifiers && racial_modifiers.length > 0) &&
                                <RacialModifiers skills={racial_modifiers} />
                            }
                            {
                                (languages && languages.length > 0) &&
                                <div className="card-text">
                                    <span className="font-weight-bold">Languages&nbsp;</span> 
                                    { languages.join(", ") }
                                </div>
                            }
                            { (special_qualities && special_qualities.length > 0) &&
                                <SpecialQualities creatureName={ name } special_qualities={special_qualities} />
                            }
                            {( inventory && (inventory.gear || inventory.combat_gear || inventory.other_gear)) &&
                                <GearDisplayBlock inventory={inventory} />
                            }
                            { (special_abilities && special_abilities.length > 0) &&
                                <div>
                                    <div className="card-text border-top border-bottom border-secondary font-weight-bold section-header">Special Abilities</div>
                                    <SpecialAbilities special_abilities={special_abilities} />
                                </div>
                            }
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default MonsterDetails;