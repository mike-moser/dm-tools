import { InternalLink } from "./interfaces"

export class DefinitionTable {
    header_row : [] | undefined;
    content_rows : [][] | undefined;
}

export class CreatureTrait {    
    ability_name : string | undefined;
    ability_types : string[] | undefined;
    name : string | undefined;
    header : string | undefined
    description: string | undefined;
    links : InternalLink [] | undefined;
    effects_table : DefinitionTable | undefined;
}

export default class CreatureType {
    type : string | undefined;
    description : string | undefined;
    knowledge_check : string | undefined;
    traits : CreatureTrait [] | undefined;
}