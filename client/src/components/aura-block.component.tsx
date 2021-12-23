import { RangeElement } from "./interfaces"
import { withUnits } from "./Utils"

const AuraBlock = ({auras} : {auras: Array<RangeElement>})  => {

    return (
        <div className="card-text">
            <div>
                <span className="font-weight-bold">Auras&nbsp;</span> { auras.map((aura) => {
                    return (aura.name ? aura.name : '') + (aura.range ? (' ' + withUnits(aura.range, aura.units)) : '')
                }).join(", ") }
            </div>
        </div>
    )
}

export default AuraBlock;