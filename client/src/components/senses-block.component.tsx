import {  RangeElement } from "./interfaces";
import { toSignedValue, space_char, withUnits, unit_of_measurement, empty_string } from "./Utils";
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import UniversalMonsterRuleDialog from "./umr-dialog.components";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    senseDefnPopup: {
        borderStyle: "outset",
        borderColor: "#722f37"
    },
    closeButton: {
        borderStyle: "inset",
        borderWidth: "2px",
        borderColor: "#722f37"
    },
    boldTitle: {
        fontSize: "1.5em",
        fontWeight: 700
    }
  })
);

const SensesBlock = ({creatureName, initiative_bonus, perception_bonus, extra_senses} : {creatureName: string, initiative_bonus: number, perception_bonus: number, extra_senses: Array<RangeElement>}) => {
    
    return (
        <div className="card-text">
            <div>
                <span className="font-weight-bold">Initiative&nbsp;</span>{ initiative_bonus ? toSignedValue(initiative_bonus) : '+0' };&nbsp;
                {
                    (extra_senses && extra_senses.length > 0) &&
                        <span id="senses">
                            <span className="font-weight-bold">Senses&nbsp;</span> { extra_senses.map((sense, i) => {
                                let separator = (i > 0);
                                let searchText = sense && sense.name;
                                let displayText =  (sense && sense.name) ? sense.name : empty_string;
                                if(sense && sense.range && sense.range > 0)
                                    displayText = displayText.concat(space_char, withUnits(sense.range, sense.units || unit_of_measurement));

                                return <span key={i}>
                                            {separator && ', '}
                                            {sense && sense.name &&
                                                <UniversalMonsterRuleDialog creatureName={creatureName} searchText={searchText} displayText={displayText} />
                                            }
                                        </span>
                            }) };&nbsp;
                        </span>
                }
                <span className="font-weight-bold">Perception&nbsp;</span>{ perception_bonus ? toSignedValue(perception_bonus) : '+0' }
            </div>
        </div>
    )
}

export default SensesBlock;