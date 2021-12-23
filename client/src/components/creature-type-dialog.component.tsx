import { Button, Dialog, DialogActions, DialogContent, DialogTitle,Table,TableBody,TableHead,TableRow } from "@material-ui/core"
import { useState } from "react";
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import { useEffect } from "react";
import { Fragment } from "react";
import axios from "axios";
import { format } from "mathjs";
import { CreatureTrait } from "./creature-type";
import { insertLinks, toTitleCase } from "./Utils";
import { TableCell } from "@material-ui/core";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    closeButton: {
        borderStyle: "inset",
        borderWidth: "2px",
        borderColor: "#722f37"
    },
    scrollableSpan: {
        maxHeight: "250px",
        overflowY: "scroll"
    },
    titleBlock: {
        fontSize: "2em",
        fontWeight: 700
    }
  })
);

const CreatureTypeDialog = ({creature_type, challenge_rating} : { creature_type: string, challenge_rating: number }) => {
    const [open, setOpen] = useState(false);
    const [crType, setCrType] = useState<string>("untyped");
    const [knowledgeCheck, setKnowledgeCheck] = useState<string>("");
    const [description, setDescription] = useState<string>("");
    const [isSubType, setIsSubType] = useState<boolean>(false);
    const [traits, setTraits] = useState<CreatureTrait[] | null>(null)

    const classes = useStyles();

    useEffect(() => {
        axios.get(`http://localhost:4000/creature_types/${creature_type}`)
        .then(response => {
            if('type' in response.data && response.data.type) setCrType(response.data.type);
            if('description' in response.data && response.data.description) setDescription(response.data.description);
            if('knowledge_check' in response.data && response.data.knowledge_check) setKnowledgeCheck(response.data.knowledge_check);
            if('subtype' in response.data && response.data.subtype) setIsSubType(response.data.subtype === 'true');
            if('traits' in response.data && response.data.traits) setTraits(response.data.traits);
        });
    }, [open, creature_type]);

    const handleClick = (evt: React.MouseEvent<HTMLElement, MouseEvent>) => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    return (
        <Fragment>
            <span onClick={handleClick}>{creature_type !== undefined && creature_type !== null && creature_type}</span>
            <Dialog
                id={`type-knowledge-${crType}`}
                open={open}
                className={'knowledge_check_popup'}
                onClose={handleClose}>
                    <DialogTitle className="knowledge_check">
                        <span className={classes.titleBlock}>{(crType) ? toTitleCase(crType) : "untyped"}</span>
                        <div className={classes.scrollableSpan}>
                            {description && description.length > 0 && description.toString().split("<br />").map((para, i) => {
                                return <p key={i}>{para}</p>
                            })}
                        </div>
                        {(knowledgeCheck !== undefined && knowledgeCheck !== null && knowledgeCheck.length > 0) &&
                            <span>
                                <strong>{knowledgeCheck}</strong> { format(challenge_rating > 0 && challenge_rating < 1 ? 11 : (10 + challenge_rating), 0)}
                            </span>
                        }
                    </DialogTitle>
                    {(traits !==  undefined && traits !== null && traits.length > 0) &&
                        <DialogContent>
                            <ul>
                                {traits.map((trt, i) => {
                                    return <li key={i}>
                                            {trt.name && <em>{trt.name}: </em>}
                                            {trt.header && <em>{trt.header} </em>}
                                            {trt.ability_name && <span><em>{trt.ability_name}</em> </span>}
                                            {trt.ability_types && trt.ability_types.length > 0 && <span><em>({trt.ability_types.map((ab: string, i: number) => {
                                                var separator = (i > 0);

                                                return (
                                                    <Fragment key={i}>{separator && ', '}{toTitleCase(ab).substring(0, 2)}</Fragment>)
                                            })})</em> </span>}
                                            {(trt.description && trt.links && trt.links.length > 0) ? insertLinks(trt.description, trt.links) : trt.description}
                                            {trt.effects_table && trt.effects_table.header_row && trt.effects_table.content_rows && 
                                                <span className="effects_table" >
                                                    <Table>
                                                        <TableHead>
                                                            <TableRow>
                                                                {trt.effects_table.header_row &&
                                                                    trt.effects_table.header_row.map((hdr, i) => {
                                                                        return <TableCell key={i}>{hdr}</TableCell>
                                                                    })
                                                                }
                                                            </TableRow>
                                                        </TableHead>
                                                        <TableBody>
                                                            {trt.effects_table.content_rows && trt.effects_table.content_rows.length > 0 &&
                                                                trt.effects_table.content_rows.map((row, i) => {
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
                                        </li>
                                    })
                                }
                            </ul>
                        </DialogContent>
                    }
                    <DialogActions>
                    <Button onClick={handleClose} className={ classes.closeButton }>
                        Done
                    </Button>
                    </DialogActions>
            </Dialog>
        </Fragment>
    )
}

export default CreatureTypeDialog;