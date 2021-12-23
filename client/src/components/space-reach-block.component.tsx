import { unit_of_measurement } from './Utils';
import { format, fraction } from 'mathjs';


const AreaBlock = ({ space, reach } : { space: number, reach: number }) => {
    let has_space = space !== undefined || space !== null;
    let has_reach = reach !== undefined || reach !== null;

    return (
        <div className="card-text">
            { has_space && (space || space === 0) && <span className="font-weight-bold">Space&nbsp;</span> }
            { has_space && (space || space === 0) && (space - Math.floor(space)) > 0 ? 
                    format(Math.floor(space), 0).concat(' & ', format(fraction(space - Math.floor(space)), {fraction: 'ratio'}), ' ', unit_of_measurement) :
                    format(space, 0).concat(' ', unit_of_measurement) }
            {(has_space && (space || space === 0) && has_reach && (reach || reach === 0)) && '; '}
            { has_reach && (reach || reach === 0) && <span className="font-weight-bold">Reach&nbsp;</span> }
            { has_reach && (reach || reach === 0) && (reach - Math.floor(reach)) > 0 ? 
                    format(Math.floor(reach), 0).concat(' & ', format(fraction(reach - Math.floor(reach)), {fraction: 'ratio'}), ' ', unit_of_measurement) :
                    format(reach, 0).concat(' ', unit_of_measurement) }
        </div>
    )
}

export default AreaBlock;