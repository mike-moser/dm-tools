export interface InventoryBlock {
    gear: string[],
    combat_gear: string[],
    other_gear: string[]
}


const GearDisplayBlock = ({ inventory } : { inventory : InventoryBlock }) => {
    return (
        <div className="gear-inventory-block">
            {('gear' in inventory) && inventory.gear && inventory.gear.length > 0 &&
                <span className="inventory-basic-gear"><strong>Gear</strong>&nbsp;{inventory.gear.join(", ")}&nbsp;</span>
            }
            {('combat_gear' in inventory) && inventory.combat_gear && inventory.combat_gear.length > 0 &&
                <span className="inventory-combat-gear"><strong>Combat Gear</strong>&nbsp;{inventory.combat_gear.join(", ")}&nbsp;</span>
            }
            {('other_gear' in inventory) && inventory.other_gear && inventory.other_gear.length > 0 &&
                <span className="inventory-other-gear"><strong>Other Gear</strong>&nbsp;{inventory.other_gear.join(", ")}</span>
            }
        </div>
    );
}

export default GearDisplayBlock;