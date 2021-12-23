import { faEye } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from "@material-ui/core";
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import axios, { AxiosError, AxiosResponse } from "axios";
import { Fragment, useEffect, useState } from "react";
import { LinkedDescription, SourceBlock } from "./interfaces";
import { SpecialAbilityBlock } from "./special-ability-block";

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

export interface UniversalMonsterRule {
    name: string | undefined | null,
    description: LinkedDescription | undefined | null,
    ability_type: string[] | undefined | null,
    sources: SourceBlock[] | undefined | null,
    format: string | undefined | null,
    location: string | undefined | null
}

const UniversalMonsterRuleDialog = ({creatureName, searchText, displayText} : {creatureName: string, searchText: string, displayText: string}) => {
    const [open, setOpen] = useState(false);
    const [umr, setUMR] = useState<UniversalMonsterRule | undefined | null>(null);
    const [found, setFound] = useState<boolean>(false);

    const [specialAbility, setSpecialAbility] = useState<undefined | null | SpecialAbilityBlock>(null);

    const classes = useStyles();

    useEffect(() => {
        axios.get(`http://localhost:4000/umrs/find/${searchText}`)
        .then((response: AxiosResponse) => {            
            let rules_text = response.data;

            let universalMonsterRule: UniversalMonsterRule = {
                name: null,
                description: null,
                ability_type: null,
                sources: null,
                format: null,
                location: null
            };
                
            if ('name' in rules_text && rules_text.name) universalMonsterRule.name = rules_text.name;
            if ('description' in rules_text && rules_text.description) universalMonsterRule.description = rules_text.description;
            if ('ability_type' in rules_text && rules_text.ability_type) universalMonsterRule.ability_type = rules_text.ability_type;
            if ('sources' in rules_text && rules_text.sources) universalMonsterRule.sources = rules_text.sources;
            if ('format' in rules_text && rules_text.format) universalMonsterRule.format = rules_text.format;
            if ('location' in rules_text && rules_text.location) universalMonsterRule.location = rules_text.location;

            setUMR(universalMonsterRule);
            setFound(true);
        })
        .catch((err: AxiosError) => {
            if(err && err.response && err.response.status && err.response.status === 404) {
                axios.get(`http://localhost:4000/creatures/special_ability/${creatureName}/${searchText}`)
                .then((response: AxiosResponse) => {
                    let ability_data = response.data;
                    let specialAbility: SpecialAbilityBlock = {
                        ability_name: null,
                        ability_type: null,
                        description: null,
                        ability_list: null,
                        ability_listing: null,
                        effects_table: null,
                        links: null
                    };

                    if ('ability_name' in ability_data && ability_data.ability_name) specialAbility.ability_name = ability_data.ability_name;
                    if ('ability_type' in ability_data && ability_data.ability_type) specialAbility.ability_type = ability_data.ability_type;
                    if ('description' in ability_data && ability_data.description) specialAbility.description = ability_data.description;

                    setSpecialAbility(specialAbility);

                    setFound(true);
                })
                .catch((eror: AxiosError) => {
                    console.log(eror.message);
                    setFound(false);
                });
            } else {
               console.log(err.message);
               setFound(false);
            }
        });
    }, [open, creatureName, searchText]);

    const handleClick = (evt: React.MouseEvent<HTMLElement, MouseEvent>) => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    return (
        !found ?
            <Fragment>
                <span>{displayText}</span>
            </Fragment>
            :
        <Fragment>
            <span onClick={handleClick}>{displayText}</span>
            <Dialog
                id={`umr-description-${umr !== undefined && umr !== null && umr.name !== undefined && umr.name !== null ? umr.name : specialAbility !== undefined && specialAbility !== null && specialAbility.ability_name !== undefined && specialAbility.ability_name !== null ? specialAbility.ability_name : "unknown" }`}
                open={open}
                onClose={handleClose}>
                <DialogTitle>
                    <span className={classes.boldTitle}>
                        {umr !== undefined && umr !== null && umr.name !== undefined && umr.name !== null ? umr.name : specialAbility !== undefined && specialAbility !== null && specialAbility.ability_name !== undefined && specialAbility.ability_name !== null ? specialAbility.ability_name : "unknown" }
                        {umr !== undefined && umr !== null && 
                            umr.ability_type !== undefined && umr.ability_type !== null && 
                            umr.ability_type.length > 0 && `\u00A0(`}
                        {umr !== undefined && umr !== null && 
                            umr.ability_type !== undefined && umr.ability_type !== null && 
                            umr.ability_type.length > 0 &&
                                umr.ability_type.map((typ: string, i: number) => {
                                    let separator = false;
                                    let ending = false;
                                    if(i > 0) separator = true;
                                    if(umr !== undefined && umr !== null &&
                                        umr.ability_type !== undefined && umr.ability_type !== null &&
                                        i === umr.ability_type.length - 1) ending = true;
                                    return (
                                        <span key={i}>
                                            {(separator && !ending) && ',\u00A0'}
                                            {(separator && ending) && '\u00A0or\u00A0'}
                                            {typ.substring(0,2)}
                                        </span>
                                    )
                                })
                            }
                            {umr !== undefined && umr !== null && 
                            umr.ability_type !== undefined && umr.ability_type !== null && 
                            umr.ability_type.length > 0 && `)`}
                            {specialAbility !== undefined && specialAbility !== null && 
                            specialAbility.ability_type !== undefined && specialAbility.ability_type !== null && `\u00A0(`}
                            {specialAbility !== undefined && specialAbility !== null && 
                            specialAbility.ability_type !== undefined && specialAbility.ability_type !== null && 
                            specialAbility.ability_type}
                            {specialAbility !== undefined && specialAbility !== null && 
                            specialAbility.ability_type !== undefined && specialAbility.ability_type !== null && `)`}
                    </span>
                    { umr !== undefined && umr !== null && 
                        umr.name !== undefined && umr.name !== null &&
                        <small>
                            &nbsp;
                            <a href={"https://aonprd.com/UMR.aspx?ItemName=".concat((umr && umr.name) ? umr.name : "ALL")} target="blank" rel="noopener noreferrer"><FontAwesomeIcon icon={ faEye } size="xs" /></a>
                        </small>
                    }
                    {
                        specialAbility !== undefined && specialAbility !== null &&
                        <small>
                            &nbsp;see Special Abilities below
                        </small>
                    }
                </DialogTitle>
                <DialogContent dividers>
                    {umr && umr.description && umr.description.text ? umr.description.text : specialAbility !== undefined && specialAbility !== null && specialAbility.description !== undefined && specialAbility.description !== null ? specialAbility.description : "No data found."}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} className={classes.closeButton}>
                        Done
                    </Button>
                </DialogActions>
            </Dialog>
        </Fragment>
    )
}

export default UniversalMonsterRuleDialog;