import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import { SpeedDetails } from "./interfaces";
import { unit_of_measurement, withUnits } from "./Utils";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    speedDetails : {
        paddingLeft: 0,
        display: "inline",
        textTransform: "lowercase",
        "& > li" : {
            display: "inline",
            "&:before" : {
                content: '",\\0000a0"'
            },
            "&:first-child:before": {
                content: "normal"
            }
        }
    }
  })
);

const SpeedBlock = ({ speed } : { speed: SpeedDetails }) => {

    const classes = useStyles();

    let speed_text: Array<string> = [];
    let adjust_text: Array<string> = [];

    if(speed && speed.base) {
        let base = speed.base;

        if(base.land) speed_text.push(withUnits(base.land, unit_of_measurement));
        if(base.burrow) speed_text.push("burrow ".concat(withUnits(base.burrow, unit_of_measurement)));
        if(base.climb) speed_text.push("climb ".concat(withUnits(base.climb, unit_of_measurement)));
        if(base.fly && base.fly.rate) speed_text.push("fly ".concat(withUnits(base.fly.rate, unit_of_measurement), " (", base.fly.maneuverability, ")"));
        if(base.swim) speed_text.push("swim ".concat(withUnits(base.swim, unit_of_measurement)));
        if(base.special) speed_text.push(base.special);
        
        if(speed && speed.armor_adjustment) {
            let adjusted = speed.armor_adjustment;
            if(adjusted.land) adjust_text.push(withUnits(adjusted.land, unit_of_measurement));
            if(adjusted.burrow) adjust_text.push("burrow ".concat(withUnits(adjusted.burrow, unit_of_measurement)));
            if(adjusted.climb) adjust_text.push("climb ".concat(withUnits(adjusted.climb, unit_of_measurement)));
            if(adjusted.fly && adjusted.fly.rate) adjust_text.push("fly ".concat(withUnits(adjusted.fly.rate, unit_of_measurement)), " (", adjusted.fly.maneuverability, ")");
            if(adjusted.swim) adjust_text.push("swim ".concat(withUnits(adjusted.swim, unit_of_measurement)));
            if(adjusted.special) adjust_text.push(adjusted.special);
        }
    }

    return (
        <div>
            <div>
                <span className='font-weight-bold'>Speed&nbsp;</span>
                <ul className={ classes.speedDetails }>
                    {speed && speed.base && speed.base.land && <li>{ withUnits(speed.base.land, unit_of_measurement)}</li>}
                    {(speed && speed.base && speed.base.burrow) && <li>{ "burrow  ".concat(withUnits(speed.base.burrow, unit_of_measurement)) }</li>}
                    {(speed && speed.base && speed.base.climb) && <li>{ "climb  ".concat(withUnits(speed.base.climb, unit_of_measurement)) }</li>}
                    {(speed && speed.base && speed.base.fly && speed.base.fly.rate && speed.base.fly.maneuverability) 
                        && <li>{ "fly  ".concat(withUnits(speed.base.fly.rate, unit_of_measurement), " (", speed.base.fly.maneuverability, ")") }</li>}
                    {(speed && speed.base && speed.base.swim) && <li>{ "swim  ".concat(withUnits(speed.base.swim, unit_of_measurement)) }</li>}
                    {(speed && speed.base && speed.base.special) && <li>{ speed.base.special }</li>}
                </ul>
            </div>
        </div>
    )
}

export default SpeedBlock;