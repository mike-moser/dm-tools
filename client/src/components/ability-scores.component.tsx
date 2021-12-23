import { format } from "mathjs";


export interface AbilityScores {
    strength: number,
    dexterity: number,
    constitution: number,
    intelligence: number,
    wisdom: number,
    charisma: number
}

const AbilityScoreBlock = ({ ability_scores } : { ability_scores: AbilityScores }) => {
    
    const { strength, dexterity, constitution, wisdom, intelligence, charisma } = ability_scores;

    return (
        <div className="card-text">
            <div>
                <span className="font-weight-bold">Str&nbsp;</span>{strength ? format(strength, 0) : '\u2014'},&nbsp;
                <span className="font-weight-bold">Dex&nbsp;</span>{dexterity ?  format(dexterity, 0) : '\u2014'},&nbsp;
                <span className="font-weight-bold">Con&nbsp;</span>{constitution ? format(constitution, 0) : '\u2014'},&nbsp;
                <span className="font-weight-bold">Wis&nbsp;</span>{wisdom ?  format(wisdom, 0) : '\u2014'},&nbsp;
                <span className="font-weight-bold">Int&nbsp;</span>{intelligence ? format(intelligence, 0) : '\u2014'},&nbsp;
                <span className="font-weight-bold">Cha&nbsp;</span>{charisma ?  format(charisma, 0) : '\u2014'}  
            </div>              
        </div>
    )
}

export default AbilityScoreBlock;