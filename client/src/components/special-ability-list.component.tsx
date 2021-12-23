import { Table, TableBody, TableCell, TableHead, TableRow } from "@material-ui/core"
import { format, fraction } from "mathjs"
import { empty_string, insertLinks, space_char } from "./Utils"
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import { SpecialAbilityBlock, SpecialAbilityListing } from "./special-ability-block";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    ability_list : {
        '& div' : {
            paddingLeft: '10px'
        }
    }
  })
);

export const SpecialAbilities = ({special_abilities} : { special_abilities: Array<SpecialAbilityBlock> }) => {

    return (
        <div>
            {special_abilities.map((ability, i) => {
                return <SpecialAbility ability={ability} key={i} />
                })
            }
        </div>
    )
}

export const SpecialAbility = ({ ability } : { ability: SpecialAbilityBlock, key: number }) => {

    const classes = useStyles();

    return (
        <div className="card-text">
            <div>
                <span className="font-weight-bold">
                    {ability.ability_name}
                    { ability.ability_type &&
                        '\u00A0('.concat(ability.ability_type, ')')
                    }
                </span>&nbsp;&mdash;&nbsp;
                {ability.description &&
                    <span>{ability.description.toString().split('\n').map((line, i) => {
                        if(ability.links && ability.links.length > 0) {
                            let line_text: string | JSX.Element = line;
                            line_text = insertLinks(line, ability.links)
                            return (i === 0) ? <span key={i}>{ line_text }</span> : <div key={i}>{ line_text }</div>
                        }
                        else
                        {
                            return (i === 0) ? <span key={i}>{ line }</span> : <div key={i}>{ line }</div>
                        }
                    })}</span>}
                {ability.ability_list &&
                    <div className={classes.ability_list}>
                        {ability.ability_list.map((item, i) => {
                            return <div key={i}><span className="font-weight-bold">{item.item}</span>:&nbsp;<span>{item.description}</span></div>
                        })}
                    </div>
                }
                {ability.ability_listing &&
                    <AbilityListing ability_listing={ability.ability_listing as SpecialAbilityListing} />}                    
                {ability.effects_table && 
                    <span className="effects_table">
                        <Table>
                            <TableHead>
                                <TableRow>
                                    {ability.effects_table.header_row &&
                                        ability.effects_table.header_row.map((hdr, i) => {
                                            return <TableCell key={i}>{hdr}</TableCell>
                                        })
                                    }
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {ability.effects_table.content_rows && ability.effects_table.content_rows.length > 0 &&
                                    ability.effects_table.content_rows.map((row, i) => {
                                        return <TableRow key={i}>
                                            {row.map((col, j) => {
                                                return <TableCell key={j}>{col}</TableCell>
                                            })}
                                        </TableRow>
                                    })
                                }
                            </TableBody>
                        </Table>
                    </span>
                }
                </div>
            </div>
    )
}

export const AbilityListing = ({ability_listing} : { ability_listing: SpecialAbilityListing }) => {

    return (
        <span>
            {ability_listing.name && <em><strong>{ability_listing.name.concat(': ')}</strong></em>}
            {ability_listing.type_name && ' '.concat(ability_listing.type_name)}
            {ability_listing.type_name && ability_listing.to_apply && ' \u2014 '}
            {ability_listing.to_apply && ability_listing.to_apply}
            {(ability_listing.type_name || ability_listing.to_apply) && '; '}
            {ability_listing.save && ability_listing.save.saving_throw && <em><strong>save </strong></em>}
            {ability_listing.save && ability_listing.save.saving_throw && 
                (ability_listing.save.saving_throw.startsWith("R")? ability_listing.save.saving_throw.substring(0, 3) : ability_listing.save.saving_throw.substring(0, 4))}
            {ability_listing.save && ability_listing.save.difficulty_class &&
                " DC ".concat(ability_listing.save.difficulty_class.toString())}
            {ability_listing.save && ability_listing.save.modifiers && ability_listing.save.modifiers.length > 0 &&
                ability_listing.save.modifiers.map((mod, i) => {
                    var multi_text = '';
                    if((mod.multiplier % 1) < 1 && (mod.multiplier % 1) > 0) {
                        var multi_whole = Math.floor(mod.multiplier);
                        var multi_ratio = mod.multiplier % 1;
                        if(multi_whole > 0) {
                            multi_text = ' + '.concat(format(multi_whole, 0), ' & ', format(fraction(multi_ratio), {fraction: 'ratio'}));
                        } else { multi_text = ' + '.concat(format(fraction(multi_ratio), {fraction: 'ratio'})); }
                    } else if(mod.multiplier === 1) {
                        multi_text = ' + ';
                    } else {
                        multi_text = ' + '.concat(format(mod.multiplier, 0));
                    }
                    return <span key={i}>{multi_text} {mod.property}</span>
                })}
            {ability_listing.save && ability_listing.save.saving_throw && '; '}
            {ability_listing.onset && ability_listing.onset.count && ability_listing.onset.period &&
                <span><em><strong>onset</strong></em> {ability_listing.onset.count} {ability_listing.onset.period}</span>}
            {ability_listing.onset && ability_listing.onset.dice && ability_listing.onset.period &&
                <span><em><strong>onset</strong></em> {ability_listing.onset.dice.toDiceText()} {ability_listing.onset.period.concat('s')}</span>}
            {ability_listing.onset && ability_listing.onset.period && '; '}
            {ability_listing.frequency && ability_listing.frequency.count && ability_listing.frequency.period &&
                <span> <em><strong>frequency</strong></em> {ability_listing.frequency.count.toString().concat('\u002f', ability_listing.frequency.period)}</span>}
            {ability_listing.frequency && ability_listing.frequency.maximum_period &&
                <span>{' for '.concat(ability_listing.frequency.maximum_period.toString(), ' ', ability_listing.frequency.period, 's')}</span>}
            {ability_listing.frequency && ability_listing.frequency.count && ability_listing.frequency.period && ';'}
            {ability_listing.effect && ability_listing.effect.length > 0 && <span> <em><strong>effect </strong></em>                
                {ability_listing.effect.map((eff, i) => {
                        let separator = empty_string;
                        if(ability_listing !== undefined && ability_listing !== null &&
                            ability_listing.effect !== undefined && ability_listing.effect !== null && 
                            i < ability_listing.effect.length - 2) separator = ',\u00A0';
                        if(ability_listing !== undefined && ability_listing !== null &&
                            ability_listing.effect !== undefined && ability_listing.effect !== null && 
                            i < ability_listing.effect.length - 2) separator = '\u00A0and\u00A0';
                        if(ability_listing !== undefined && ability_listing !== null &&
                            ability_listing.effect !== undefined && ability_listing.effect !== null && 
                            ability_listing.effect.length === 1) separator = empty_string;
                    if(eff.count !== undefined && eff.count !== null) {
                        if(eff.condition !== undefined && eff.condition !== null) {
                            return (
                                <span key={i}>
                                    {format(eff.count, 0)}&nbsp;
                                    { eff.damage_type ? eff.damage_type === "hit point" ? "hp" : eff.damage_type : 'dmg' }
                                    {(eff.drain !== null && eff.drain !== undefined && eff.drain === true) ? '\u00A0drain' : ''}
                                    &nbsp;and&nbsp;
                                    {eff.condition}
                                    {eff.alt_condition && space_char.concat(eff.alt_condition)}
                                    {separator}
                                </span>
                            )
                        } else {
                            return (
                                <span key={i}>
                                    {format(eff.count, 0)}&nbsp;
                                    { eff.damage_type ? eff.damage_type === "hit point" ? "hp" : eff.damage_type : 'dmg' }
                                    {(eff.drain !== null && eff.drain !== undefined && eff.drain === true) ? '\u00A0drain' : ''}
                                    {separator}</span>
                            )
                        }
                    } else if(eff.hit_dice !== undefined && eff.hit_dice !== null) {
                        if(eff.condition !== undefined && eff.condition !== null) {
                            return (
                                <span key={i}>
                                    {eff.hit_dice.toDiceText()}&nbsp;
                                    { eff.damage_type ? eff.damage_type === "hit point" ? "hp" : eff.damage_type : 'dmg' }
                                    {(eff.drain !== null && eff.drain !== undefined && eff.drain === true) ? '\u00A0drain' : ''}
                                    {'\u00A0and\u00A0'}
                                    {eff.condition}
                                    {eff.alt_condition && space_char.concat(eff.alt_condition)}
                                    {separator}
                                </span>
                            )
                        } else {
                            return (
                                <span key={i}>
                                    {eff.hit_dice.toDiceText()}&nbsp;
                                    { eff.damage_type ? eff.damage_type === "hit point" ? "hp" : eff.damage_type : 'dmg' }
                                    {(eff.drain !== null && eff.drain !== undefined && eff.drain === true) ? ' drain' : ''}
                                    {separator}
                                </span>
                            )
                        }
                    }
                    else if(eff.condition !== undefined && eff.condition !== null) {
                        let separator = empty_string;
                        if(ability_listing !== undefined && ability_listing !== null &&
                            ability_listing.effect !== undefined && ability_listing.effect !== null && 
                            i < ability_listing.effect.length - 2) separator = ',\u00A0';
                        if(ability_listing !== undefined && ability_listing !== null &&
                            ability_listing.effect !== undefined && ability_listing.effect !== null && 
                            i < ability_listing.effect.length - 2) separator = '\u00A0and\u00A0';
                        if(ability_listing !== undefined && ability_listing !== null &&
                            ability_listing.effect !== undefined && ability_listing.effect !== null && 
                            ability_listing.effect.length === 1) separator = empty_string;
                        return <span key={i}>
                                {eff.condition}
                                {eff.alt_condition && space_char.concat(eff.alt_condition)}
                                {separator}
                            </span>
                    } 
                    else return <span key={i}> &mdash; </span>
                })}
                </span>
            }                
            {ability_listing.cure && 
                <span>; <em><strong>cure</strong></em>{ space_char } 
                    {format(ability_listing.cure.saves, 0).concat(ability_listing.cure.saves > 1 ? '\u00A0consecutive saves' : '\u00A0save', '.') }
                    {ability_listing.cure.alt_cures && '\u00A0or\u00A0' }
                    {ability_listing.cure.alt_cures && 
                        ability_listing.cure.alt_cures.map((c, i) => {
                            let separator = empty_string;
                            if(i > 0) separator = ',\u00A0';
                            else if(ability_listing !== undefined && ability_listing !== null &&
                                ability_listing.cure !== undefined && ability_listing.cure !== null &&
                                ability_listing.cure.alt_cures !== undefined && ability_listing.cure.alt_cures !== null &&
                                i === ability_listing.cure.alt_cures.length - 1) separator = '\u00A0or\u00A0';

                            return (ability_listing !== undefined && ability_listing !== null && 
                                ability_listing.cure !== undefined && ability_listing.cure !== null && 
                                ability_listing.cure.alt_cures !== undefined &&  ability_listing.cure.alt_cures !== null && i === ability_listing.cure.alt_cures.length - 1) &&
                                <span key={i}>
                                    {separator}
                                    {insertLinks(c, ability_listing.cure.links)}
                                </span>
                        })
                    }
                    {ability_listing.cure.save_basis && " The save DC is ".concat(ability_listing.cure.save_basis, "-based.")}
                    {(ability_listing.cure.save_basis && ability_listing.cure.notes) && { space_char } && insertLinks(ability_listing.cure.notes, ability_listing.cure.links)}
                    {ability_listing.cure.save_basis && "."}
                </span>
            }
        </span>
    )
}