import { toSignedValue } from "./Utils";

export interface CombatManeuverBonus {
    base: number,
    bull_rush: number,
    dirty_trick: number,
    disarm: number,
    drag: number,
    grapple: number,
    overrun: number,
    reposition: number,
    steal: number,
    sunder: number,
    trip: number,
    special: CombatManeuverSpecial[]
  }
  
  export interface CombatManeuverDefense {
      base: number,
      bull_rush: number | boolean,
      dirty_trick: number | boolean,
      disarm: number | boolean,
      drag: number | boolean,
      grapple: number | boolean,
      overrun: number | boolean,
      reposition: number | boolean,
      steal: number | boolean,
      sunder: number | boolean,
      trip: number | boolean,
      special: CombatManeuverSpecial[]
  }
  
  
  interface CombatManeuverSpecial {
      bonus: number,
      maneuver: string,
      condition: string
  }
  
  export interface CombatManeuvers {
      base_attack_bonus: number[],
      bonus: CombatManeuverBonus,
      defense: CombatManeuverDefense
  }
  

export const CombatManeuversBlock = ({ bab, cmb, cmd } : { bab: number[], cmb: CombatManeuverBonus, cmd: CombatManeuverDefense}) => {
    
    let base_attack_bonus = bab;
    let bonus = cmb;
    let defense = cmd;

    var cmb_base = (bonus && bonus.base) ? toSignedValue(bonus.base) : "\u2014";
    var cmd_base = (defense && defense.base) ? toSignedValue(defense.base) : "\u2014";
    
    var combat_maneuvers: Array<string> = [];
    if(bonus) {
        if(bonus.bull_rush) combat_maneuvers.push(toSignedValue(bonus.bull_rush).concat(" bull rush"));
        if(bonus.dirty_trick) combat_maneuvers.push(toSignedValue(bonus.dirty_trick).concat(" dirty trick"));
        if(bonus.disarm) combat_maneuvers.push(toSignedValue(bonus.disarm).concat(" disarm"));
        if(bonus.drag) combat_maneuvers.push(toSignedValue(bonus.drag).concat(" drag"));
        if(bonus.grapple) combat_maneuvers.push(toSignedValue(bonus.grapple).concat(" grapple"));
        if(bonus.overrun) combat_maneuvers.push(toSignedValue(bonus.overrun).concat(" overrun"));
        if(bonus.reposition) combat_maneuvers.push(toSignedValue(bonus.reposition).concat(" reposition"));
        if(bonus.steal) combat_maneuvers.push(toSignedValue(bonus.steal).concat(" steal"));
        if(bonus.sunder) combat_maneuvers.push(toSignedValue(bonus.sunder).concat(" sunder"));
        if(bonus.trip) combat_maneuvers.push(toSignedValue(bonus.trip).concat(" trip"));
        if(bonus.special) {
            bonus.special.forEach((spec) =>{
                var text =  toSignedValue(spec.bonus).concat(' ', spec.maneuver, ' ', spec.condition);
                combat_maneuvers.push(text);
            });
        }
    }
    var cmb_text = cmb_base;
    if(combat_maneuvers.length > 0) {
        var first = true;
        combat_maneuvers.forEach((man) =>{
            if(first) {
                first = false;
                cmb_text = cmb_text.concat(' (');
            } else {
                if( combat_maneuvers.indexOf(man)  ===  combat_maneuvers.length - 1) {
                    cmb_text += " or "
                } else {
                    cmb_text += ", "
                }
            }
            cmb_text += man;
        });
        cmb_text = cmb_text.concat(")");
    }

    var combat_defense: Array<string> = [];
    if(defense) {
        if('bull_rush' in defense && !(defense.bull_rush === undefined || defense.bull_rush === null)) {
            if (defense.bull_rush === false) combat_defense.push("cannot be bull rushed");
            else if (typeof defense.bull_rush === 'number') combat_defense.push(toSignedValue(defense.bull_rush).concat(" vs bull rush"));
        }
        if('dirty_trick' in defense && !(defense.dirty_trick === undefined || defense.dirty_trick === null)) {
            if(defense.dirty_trick === false) combat_defense.push("cannot be tricked");
            else if(typeof defense.dirty_trick === 'number') combat_defense.push(toSignedValue(defense.dirty_trick).concat(" vs dirty trick"));
        }
        if('disarm' in defense && !(defense.disarm === undefined || defense.disarm === null)) {
            if(defense.disarm === false) combat_defense.push("cannot be disarmed");
            else if(typeof defense.disarm === 'number') combat_defense.push(toSignedValue(defense.disarm).concat(" vs disarm"));
        }
        if('drag' in defense && !(defense.drag === undefined || defense.drag === null)) {
            if(defense.drag === false) combat_defense.push("cannot be dragged");
            else if(typeof defense.drag === 'number') combat_defense.push(toSignedValue(defense.drag).concat(" vs drag"));
        }
        if('grapple' in defense && !(defense.grapple === undefined || defense.grapple === null)) {
            if(defense.grapple === false) combat_defense.push("cannot be grappled");
            else if(typeof defense.grapple === 'number') combat_defense.push(toSignedValue(defense.grapple).concat(" vs grapple"));
        }
        if('overrun' in defense && !(defense.overrun === undefined || defense.overrun === null)) {
            if(defense.overrun) combat_defense.push("cannot be overrun");
            else if(typeof defense.overrun === 'number') combat_defense.push(toSignedValue(defense.overrun).concat(" vs overrun"));
        }
        if('reposition' in defense && !(defense.reposition === undefined || defense.reposition === null)) {
            if(defense.reposition === false) combat_defense.push("cannot be repositioned");
            else if(typeof defense.reposition === 'number') combat_defense.push(toSignedValue(defense.reposition).concat(" vs reposition"));
        }
        if('steal' in defense && !(defense.steal === undefined || defense.steal === null)) {
            if(defense.steal === false) combat_defense.push("cannot be stolen from");
            else if(typeof defense.steal === 'number') combat_defense.push(toSignedValue(defense.steal).concat(" vs steal"));
        }
        if('sunder' in defense && !(defense.sunder === undefined || defense.sunder === null)) {
            if(defense.sunder === false) combat_defense.push("weapon or item cannot be sundered");
            else if(typeof defense.sunder === 'number') combat_defense.push(toSignedValue(defense.sunder).concat(" vs sunder"));
        }
        if('trip' in defense && !(defense.trip === undefined || defense.trip === null)) {
            if(typeof(defense.trip) === 'number') combat_defense.push(toSignedValue(defense.trip).concat(" vs trip"));
            else if(defense.trip === false) combat_defense.push("cannot be tripped");
        }
        if(defense.special) {
            defense.special.forEach((spec) =>{
                var text = toSignedValue(spec.bonus).concat(' ', spec.maneuver, ' ', spec.condition);
                combat_defense.push(text);
            });
        }
    }
    var cmd_text = cmd_base;
    if(combat_defense.length > 0) {
        var begin = true;
        combat_defense.forEach((def) =>{
            if(begin) {
                begin = false;
                cmd_text = cmd_text.concat(' (');
            } else {
                if( combat_defense.indexOf(def)  ===  combat_defense.length - 1) {
                    cmd_text += " or "
                } else {
                    cmd_text += ", "
                }
            }
            cmd_text += def;
        });
        cmd_text = cmd_text.concat(")");
    }

    return (
        <div className="card-text">
            <div>
                <span className="font-weight-bold">Base Atk&nbsp;</span>{(base_attack_bonus && base_attack_bonus.length > 0 ) ?
                    base_attack_bonus.map((baseAtkBonus) => {
                        return toSignedValue(baseAtkBonus)
                    }).join('/') : '+0'};&nbsp;
                <span className="font-weight-bold">CMB&nbsp;</span>{cmb_text};&nbsp;
                <span className="font-weight-bold">CMD&nbsp;</span>{cmd_text}
            </div>
        </div>
    )
}