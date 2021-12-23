import { toTitleCase } from "./Utils";
import { Fragment } from "react";
import CreatureTypeDialog from "./creature-type-dialog.component";

const AlignmentBlock = ({type, subtypes, size, ethical, moral, challengeRating} : {type: string, subtypes: Array<string>, size: string, ethical: string, moral: string, challengeRating: number}) => {
        
    return (
        <div className="card-text">
            <div>
                {ethical && moral ? 
                    (ethical.toLowerCase() === moral.toLowerCase() ? ethical[0].toUpperCase() : ethical[0].concat(moral[0]).toUpperCase()) : "N" }&nbsp;
                { size && toTitleCase(size) }&nbsp;
                { type && <CreatureTypeDialog creature_type={type} challenge_rating={challengeRating} />}
                { (subtypes !== undefined && subtypes !== null && subtypes.length > 0) && " (" }
                { (subtypes !== undefined && subtypes !== null && subtypes.length > 0) && 
                    subtypes.map((sub, i) => {
                        let separator = i > 0;
                        
                        return (
                            <Fragment key={i}>
                                {(separator && ', ')}
                                <CreatureTypeDialog creature_type={sub} challenge_rating={challengeRating} />
                            </Fragment>
                        )

                    })
                }
                { (subtypes !== undefined && subtypes !== null && subtypes.length > 0) && ")"}
            </div>
        </div>
    )
}

export default AlignmentBlock;