import { useEffect, useState } from 'react';
import { Link } from '@reach/router';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import { format, fraction } from 'mathjs';
import axios from 'axios';
import { Paper, Table, TableBody, TableCell, TableContainer, TableFooter, TableHead, TablePagination, TableRow } from '@material-ui/core';


interface Creature {
    _id: string,
    name: string,
    challenge_rating: number,
    type: string,
    subtypes: Array<string>,
    adjustment: string
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    listTable: {
        margin: 'auto',
        width: '85vw',
        height: '95vh',
        '& tr': {
            height: '5vh',
            '&:nth-of-type(odd)': {
                backgroundColor: '#efe5b5'
            },
            '&:nth-of-type(even)': {
                backgroundColor: '#faf0e6'                
            }
        }
    },
    creatureLink: {
        color: '#722f37',
        '&:hover': {
            color: '#722f37'
        },
        '&:visited': {
            color: '#722f37'
        }
    }
  })
);

const MonsterList = (props : any) => {
    const [rows, setRows] = useState(new Array<Creature>());
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(25);
    const [totalRows, setTotalRows] = useState(0);

    const classes = useStyles();

    const handleChangePage = (event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };
    
    useEffect(() => {
        fetch(`http://localhost:4000/creatures/list/${rowsPerPage}/${page * rowsPerPage}`)
            .then(res => res.json())
            .then(res => setRows(res) )
            .catch(res => {console.log( res.status )});

            fetch(`http://localhost:4000/creatures/count`)
            .then(res => res.json())
            .then(res => setTotalRows(res.count) );
      }, [page, rowsPerPage]);

    return (
        <Paper>
            <TableContainer>
                <Table stickyHeader className={classes.listTable}>
                    <TableHead>
                        <TableRow>
                            <TableCell align={'center'}>Name</TableCell>
                            <TableCell align={'center'} >CR</TableCell>
                            <TableCell align={'center'}>Types</TableCell>
                            <TableCell align={'center'}>&nbsp;</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        { (rowsPerPage > 0) ?  
                            rows.map((row, i) => {
                                return (
                                    <TableRow key={i}>
                                        <TableCell align={'center'}>
                                            <Link to={`/details/${row._id}`} className={classes.creatureLink} >
                                                {row.name}{row.adjustment && `, ${row.adjustment}`}
                                            </Link>
                                        </TableCell>
                                        <TableCell align={'center'} >
                                            { row.challenge_rating  < 1 ?
                                                format(fraction(row.challenge_rating), {fraction: 'ratio'}) : 
                                                    row.challenge_rating}
                                        </TableCell>
                                        <TableCell align={'center'}>
                                            { row.type } 
                                            {
                                                (row.subtypes !== undefined && row.subtypes !== null && row.subtypes.length > 0) &&
                                                    ` (${row.subtypes.join(", ")})`
                                            }
                                        </TableCell>
                                        <TableCell align={'center'}>
                                            <Link to={`/edit/${props._id}`}>Edit</Link>
                                        </TableCell>
                                    </TableRow>
                                )
                            })
                            :
                            <TableRow style={{ height: 53 }}>
                                <TableCell colSpan={4} />
                            </TableRow>
                        }
                    </TableBody>
                    <TableFooter>
                        <TableRow>
                            <TablePagination
                                rowsPerPageOptions={[25, 50, 75, 100]}
                                count={totalRows}
                                rowsPerPage={rowsPerPage}
                                page={page}
                                onPageChange={handleChangePage}
                                onRowsPerPageChange={handleChangeRowsPerPage}
                            />
                        </TableRow>
                    </TableFooter>
                </Table>
            </TableContainer>
        </Paper>
      )
}
export default MonsterList;