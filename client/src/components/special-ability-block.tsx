import Dice from "./dice";
import { AbilityCureBlock, AbilityEffectBlock, AbilityFrequencyBlock, AbilityOnsetBlock, AbilitySave, GenericTable, InternalLink, SourceBlock } from "./interfaces";

export interface SpecialAbilityBlock {
    ability_name: string | null | undefined,
    ability_type: string | null | undefined,
    description: string | null | undefined,
    ability_list: AbilityListItem[] | null | undefined,
    ability_listing: SpecialAbilityListing | Disease | Poison | null | undefined,
    effects_table: GenericTable | null | undefined,
    links: InternalLink[] | null | undefined
}

export interface AbilityListItem {
    item: string | null | undefined,
    description: string | null | undefined
}

export interface SpecialAbilityListing {
    name: string | null | undefined,
    type_name: string | null | undefined,
    to_apply: string | null | undefined,
    save: AbilitySave | null | undefined,
    onset: AbilityOnsetBlock | null | undefined,
    frequency: AbilityFrequencyBlock | null | undefined,
    effect: AbilityEffectBlock[] | null | undefined,        
    cure: AbilityCureBlock | null | undefined
}

export interface Disease {
    name: string | null | undefined,
    alt_name: string | null | undefined,
    pf3_5: boolean | null | undefined,
    type: string[] | null | undefined,
    description: string | null | undefined,
    onset: Onset | null | undefined,
    frequency: Frequency | null | undefined,
    effect: DiseaseEffect[] | null | undefined,
    effects_table: GenericTable | null | undefined,
    links: InternalLink[] | null | undefined,
    ongoing_save: DiseaseSave | null | undefined,
    cure: DiseaseCure | null | undefined,
    saves: DiseaseSave[] | null | undefined,
    sources: SourceBlock[] | null | undefined
}

export interface Onset {
    count: number,
    period: string,
    dice: Dice
}

export interface Frequency {
    count: number,
    period: string,
    maximum_period: number
}

export interface DiseaseEffect {
    count: number,
    damage_dice: Dice,
    damage_type: string,
    drain: boolean,
    text: string,
    links: InternalLink[]
}

export interface DiseaseSave {
    saving_throw: string,
    difficulty_class: number,
    notes: string
}

export interface DiseaseCure {
    save_count: number,
    alt_cure: string,
    text: string,
    links: InternalLink[]
}

export interface Poison {

}