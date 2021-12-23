import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import { space_char, toSignedValue } from "./Utils";
import UniversalMonsterRuleDialog from "./umr-dialog.components";

export interface SpecialQualityEntry {
    name: string,
    descriptor: string,
    modifier: number,
    difficulty_class: number
}

export const SpecialQualities = ({creatureName, special_qualities} : { creatureName: string, special_qualities: Array<SpecialQualityEntry> }) => {
    
    return (
        <div className="card-text">
            <div>
                <span className="font-weight-bold">SQ&nbsp;</span>
                {
                    (special_qualities !== undefined && special_qualities !== null && special_qualities.length > 0) &&
                    special_qualities.map((sq: SpecialQualityEntry, i: number) => {
                        let separator = (i > 0);

                        let displayText = sq.name;
                        if(sq && sq.descriptor) displayText.concat(space_char, sq.descriptor);
                        if(sq && sq.modifier) displayText.concat(space_char, toSignedValue(sq.modifier))
                        if(sq && sq.difficulty_class) displayText.concat(space_char, "(DC ", sq.difficulty_class.toString(), ")");

                        return (
                            <span key={i}>
                                {separator && ', '}
                                <UniversalMonsterRuleDialog creatureName={ creatureName } searchText={ sq.name } displayText={ displayText } />
                            </span>
                        )
                    })
                }
            </div>
        </div>
    )
}