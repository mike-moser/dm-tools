import { SavingThrows } from "./interfaces";
import { toSignedValue } from "./Utils";

const SavingThrowBlock = ({saves} : {saves: SavingThrows}) => {
    const { fortitude, reflex, will, modifiers } = saves;

    var mods: Array<string> = [];
    var will_mods: Array<string> = [];
    var ref_mods: Array<string> = [];
    var fort_mods: Array<string> = [];

    if(modifiers !== undefined && modifiers !== null  && modifiers.length > 0) {
        modifiers.forEach((st) => {
            if(st.saving_throw === undefined || st.saving_throw === null) {
                mods.push(st.modifier);
            } else {
                if( st.saving_throw.toUpperCase() === "WILL".toUpperCase() )  will_mods.push(st.modifier);
                else if(st.saving_throw.toUpperCase() === "REFLEX".toUpperCase()) ref_mods.push(st.modifier);
                else if(st.saving_throw.toUpperCase() === "FORTITUDE".toUpperCase()) fort_mods.push(st.modifier);
            }
        }); 
    }

    return (
        <div className="card-text">
            <div>
                <span className="font-weight-bold">Fort&nbsp;</span>{ (fortitude ? toSignedValue(fortitude) : '+0') + (fort_mods.length > 0 ? ' (' + fort_mods + ')' : '') },&nbsp;
                <span className="font-weight-bold">Ref&nbsp;</span>{ (reflex ? toSignedValue(reflex) : '+0') + (ref_mods.length > 0 ? ' (' + ref_mods + ')' : '') },&nbsp;
                <span className="font-weight-bold">Will&nbsp;</span>{ (will ? toSignedValue(will) : '+0') + (will_mods.length > 0 ? ' (' + will_mods + ')' : '') }
                { mods && mods.length > 0 ? '; ' + mods.join(', ') : ''}
            </div>
        </div> 
    )
}

export default SavingThrowBlock;