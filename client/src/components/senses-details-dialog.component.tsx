import { faEye } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from "@material-ui/core"
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import { Fragment, useEffect, useState } from "react";
import axios from "axios";
import { UniversalMonsterRule } from "./umr-dialog.components";
import { space_char, withUnits } from "./Utils";

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

const SensesDetailsDialog = ({name, range, units} : {name: string, range: number, units: string}) => {
    const [open, setOpen] = useState(false);
    const [umr, setUMR] = useState<UniversalMonsterRule>();

    const classes = useStyles();

    useEffect(() => {
        axios.get(`http://localhost:4000/umrs/find/${name}`)
        .then(response => {            
            let rules_text = response.data;
            let umr_defn: UniversalMonsterRule = {
                name: ('name' in rules_text && rules_text.name) ? rules_text.name : null,
                description: ('description' in rules_text && rules_text.description) ? rules_text.description : null,
                ability_type: ('ability_type' in rules_text && rules_text.ability_type) ? rules_text.ability_type : null,
                sources: ('sources' in rules_text && rules_text.sources) ? rules_text.sources : null,
                format: ('format' in rules_text && rules_text.format) ? rules_text.format : null,
                location: ('location' in rules_text && rules_text.location) ? rules_text.location : null
            }

            setUMR(umr_defn);
        });
    }, [open, name]);

    const handleClick = (evt: React.MouseEvent<HTMLElement, MouseEvent>) => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    return (
        <Fragment>
            <span onClick={handleClick}>{name !== undefined && name !== null && name}{range !== undefined && range !== null && range > 0 && space_char.concat(withUnits(range, units))}</span>
            <Dialog
                id={`umr-description-${umr && umr.name}`}
                open={open}
                onClose={handleClose}>
                <DialogTitle>
                    <span className={classes.boldTitle}>{umr && umr.name}</span>
                    <small>
                        <a href={"https://aonprd.com/UMR.aspx?ItemName=".concat((umr && umr.name) ? umr.name : "ALL")} target="blank" rel="noopener noreferrer"><FontAwesomeIcon icon={ faEye } size="xs" /></a>
                    </small>
                </DialogTitle>
                <DialogContent dividers>
                    {umr && umr.description && umr.description.text}
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

export default SensesDetailsDialog;