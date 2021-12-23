import { createStyles, makeStyles, Theme } from '@material-ui/core';
import { format, fraction} from 'mathjs';
import { empty_string, space_char, toTitleCase } from "./Utils";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
      nameBlock: {
        color: "#ebd5b3",
        backgroundColor: "#722f37",
        fontFamily: "'Fondamento', Helvetica, Arial, sans-serif",
        fontWeight: 700,
        fontSize: "1.45em"
      }
  })
);

const NameBlock = ({name, family, subfamilies, alt_name, challenge_rating, adjustment} : {name: string, family: string, subfamilies: Array<string>, alt_name: string, challenge_rating: number, adjustment: string}) => {

    const classes = useStyles();
    
    return (
        <div className={ classes.nameBlock }>
            <span className='col-6 p-0'>{family && `${toTitleCase(family)}`}{(subfamilies && subfamilies.length > 0) && ` (${subfamilies.map((sf) => { return toTitleCase(sf)}).join(", ")})`}{family === undefined || family === null || family === empty_string ? space_char : ", "}{ name ? name : 'Monster' }{alt_name && ` (${alt_name})`}{adjustment && `, ${adjustment}`}</span>
            <span className='col-4'>&nbsp;</span>
            <span className='col-2 p-0'>CR&nbsp;{ challenge_rating ? challenge_rating >= 1 ? format(challenge_rating, 0) : format(fraction(challenge_rating), {fraction: 'ratio'}) : '0' }</span>
        </div>
    )
}

export default NameBlock;