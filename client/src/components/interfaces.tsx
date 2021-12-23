import Dice from "./dice";

export interface CreatureListItem {
    _id: string,
    name: string,
    challenge_rating: number,
    type: string,
    subtypes: string[],
    adjustment: string
}

export interface LinkedDescription {
    text: string,
    links: string[]
}

export interface NameIdentifiers {
    name: string, 
    family: string, 
    subfamilies: string[],
    alt_name: string, 
    challenge_rating: number, 
    adjustment: string
}

export interface Alignment {
    ethical: string,
    moral: string
}

export interface AlignmentTypeDetails {
    align: Alignment,
    size: string,
    type: string,
    subtypes: string[], 
    knowledge: string,
    cr: number
}

export interface RangeElement {
    name: string,
    range: number,
    units: string
}

export interface AdjustableImage {
    source: string,
    width: number,
    height: number,
    caption: string
}

export interface Aura extends RangeElement {}

export interface TacticsBlock {
    combat_stage : string,
    description : string
}

export interface PlayerClass {
    class_name: string,
    level: number
}

export interface UniqueDetails {
    sex: string, 
    race: string, 
    player_classes: PlayerClass[], 
    is_unique: boolean
}

export interface ACBonus {
    value: number,
    bonus_type: string
}

export interface ArmorClass {
    total: number,
    touch: number, 
    flat_footed: number, 
    bonuses: ACBonus[]
}

export interface HealingAbilities {
    ability: string,
    rate: number,
    prevention: string[]
}

export interface HitPoints {
    hit_dice: Dice[],
    bonus_hit_points: number
}

export interface SavingThrowModifiers {
    saving_throw: string,
    modifier: string
}

export interface SavingThrows {
    fortitude: number,
    reflex: number,
    will: number,
    modifiers: SavingThrowModifiers[]
}

export interface SourceBlock {
    title : string,
    page : number,
    npcLink : boolean
}

export interface InternalLink {
    text: string | null | undefined,
    uri: string | null | undefined
}

export interface GenericTable {
    table_id: {
        section: number,
        id: number
    } | null | undefined,
    title: string | null | undefined,
    subtitle: string | null | undefined,
    header_row: string[] | null | undefined,
    content_rows: string[][] | null | undefined,
    caption: string | null | undefined
}

export interface FlyDetails {
    rate : number,
    maneuverability : string
}

export interface Speed {
    land : number,
    burrow : number,
    climb : number,
    fly : FlyDetails,
    swim : number,
    special : string
}

export interface SpeedDetails {
    base : Speed,
    armor_adjustment : Speed
}

export interface AbilitySave {
    saving_throw: string,
    difficulty_class: number,
    modifiers: AbilitySaveModifier[]
}

export interface AbilitySaveModifier {
    multiplier: number,
    property: string
}

export interface AbilityOnsetBlock {
    count: number,
    period: string,
    dice: Dice
}

export interface AbilityFrequencyBlock {
    count: number,
    period: string,
    maximum_period: number
}

export interface AbilityEffectBlock {
    count: number | undefined,
    damage_type: string | undefined,
    hit_dice: Dice | undefined,
    drain: boolean | undefined,
    condition: string | undefined,
    alt_condition: string | undefined
}

export interface AbilityCureBlock {
    saves: number,
    save_basis: string,
    notes: string,
    alt_cures: string[],
    links: InternalLink[]
}

export interface Subtype {
    type : string,
    description : string,
    traits : [
        {
            ability_name: string,
            ability_type: string,
            name : string,
            header : string,
            description: string,
            links : InternalLink []
        }
    ]
}

export interface EnvironmentalBlock {    
    text: string,
    descriptor: string
}

export interface TroopBlock {
    minimum : number,
    maximum : number,
    name : string
}

export interface OrganizationGroup {
    group : string,
    examples : TroopBlock
}

export interface WealthBundle {
    copper : number,
    silver : number,
    gold : number,
    platinum : number,
    electrum : number
}

export interface TreasureBundle {
    level : string,
    items : string [],
    npc_gear : string [],
    money : WealthBundle
}

export interface EcologicalData {
    environment : EnvironmentalBlock,
    organization : OrganizationGroup [],
    treasure : TreasureBundle
}