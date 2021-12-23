import { AbilityScores } from './ability-scores.component';
import { AttackBlock } from './attack-listing.component';
import { CombatManeuverBonus, CombatManeuverDefense } from './combat-maneuvers.component';
import CreatureType from './creature-type';
import { DamageReduction, DefensiveAbility, Resistance } from './defensive-abilities.component';
import { FeatEntry } from './feat-block.component';
import { InventoryBlock } from './gear-display-block.component';
import { AdjustableImage, Alignment, ArmorClass, HitPoints, RangeElement, SavingThrows, SourceBlock, PlayerClass, HealingAbilities, SpeedDetails, EcologicalData } from './interfaces';
import { SkillEntry } from './skills-list.component';
import { PsychicMagicEntry, SpellCasterBlock, SpellLikeAbilityBlock } from './spell-display-block.component';
import { SpecialQualityEntry } from './special-qualities-block.component'
import { SpecialAbilityBlock } from './special-ability-block';


export default class Monster {            
    name : string;
    alt_name : string | undefined;
    description : string | undefined;
    challenge_rating: number | undefined;
    race : string | undefined;
    sex : string | undefined;
    is_unique! : boolean;
    creature_type : CreatureType | undefined;
    creature_subtypes : CreatureType[] | undefined;
    family : string | undefined;
    subfamilies : string[] | undefined; 
    knowledge_check : string | undefined;
    ability_scores! : AbilityScores;
    type : string | undefined;
    subtypes : string[] | undefined;
    languages : string[] | undefined;
    adjustment : string | undefined;
    armor_class : ArmorClass | undefined;
    player_classes : PlayerClass[] | undefined;
    alignment : Alignment | undefined;
    attacks : AttackBlock[] | undefined;
    special_attacks : string[] | undefined;
    base_attack_bonus : number[] | undefined;
    combat_maneuver_bonus : CombatManeuverBonus | undefined;
    combat_maneuver_defense : CombatManeuverDefense | undefined;
    defensive_abilities : DefensiveAbility[] | undefined;
    damage_reduction : DamageReduction | undefined;
    immunities : string[] | undefined;
    spell_resistance : number | undefined;
    special_qualities : SpecialQualityEntry[] | undefined;
    inventory : InventoryBlock | undefined;
    flavor_text : string | undefined;
    experience_points! : number;
    feats : FeatEntry[] | undefined;
    skills : SkillEntry[] | undefined;
    racial_modifiers : SkillEntry[] | undefined;
    saving_throws : SavingThrows | undefined;
    hp : HitPoints | undefined;
    healing_abilities : HealingAbilities[] | undefined;
    resistances : Resistance[] | undefined;
    initiative_bonus! : number;
    perception_bonus! : number;
    special_abilities : SpecialAbilityBlock[] | undefined | null;
    spell_like_abilities : SpellLikeAbilityBlock | undefined;
    spells_known : SpellCasterBlock | undefined;
    psychic_magic : PsychicMagicEntry | undefined;
    senses : RangeElement[] | undefined;
    auras : RangeElement[] | undefined;
    speed : SpeedDetails | undefined;
    space: number | undefined;
    reach : number | undefined;
    scenarios : string[] | undefined;
    size : string | undefined;
    sources : SourceBlock[] | undefined;
    images: AdjustableImage[] | undefined;
    ecology : EcologicalData | undefined;

    constructor(name: string) {
        this.name = name;
        this.is_unique = false;
        this.initialize()
    }

    initialize() {
        this.ability_scores = {
            strength: 10,
            dexterity: 10,
            constitution: 10,
            wisdom: 10,
            intelligence: 10,
            charisma: 10
        };

        this.experience_points = 0;
        this.initiative_bonus = 0;
        this.perception_bonus = 0;
    }
}