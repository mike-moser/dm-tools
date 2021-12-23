import { ACBonus } from "./interfaces";
import { toSignedValue, toTitleCase } from "./Utils";

const ACBlock = ({total, touch, flat_footed, bonuses} : { total: number, touch: number, flat_footed: number, bonuses: Array<ACBonus> }) => {
    
    return (
        <div className="card-text">
            <div>
                <span className="font-weight-bold">AC</span> { total ? total : '10' }, touch { touch ? touch : '10' }, flat footed { flat_footed ? flat_footed : '10' }&nbsp;
                { (bonuses && bonuses.length > 0) &&  bonuses.map( (bon: ACBonus) => {
                    return (bon.value ? toSignedValue(bon.value) : '+0') + (bon.bonus_type && ' ' + (['str', 'dex', 'con', 'int', 'wis', 'cha'].includes(bon.bonus_type) ? toTitleCase(bon.bonus_type) : bon.bonus_type.toLowerCase()) )
                }).join(", ")}
            </div>
        </div>
    )
}

export default ACBlock;