import UniversalMonsterRuleDialog from "./umr-dialog.components";


export const Immunities = ({creature_name, immunities} : {creature_name: string, immunities: Array<string> }) => {

    return (
            <span>
                <span className="font-weight-bold"><UniversalMonsterRuleDialog creatureName="" searchText="Immunity" displayText="Immunities" />&nbsp;</span>
                {
                    (immunities !== undefined && immunities !== null && immunities.length > 0) &&
                    immunities.map((imm: string, i: number) => {
                        let separator = (i>0);
                        return (
                            <span key={i}>
                                {separator && ', '}
                                <UniversalMonsterRuleDialog creatureName={creature_name} searchText={imm} displayText={imm} />
                            </span>
                        )
                    })
                }
            </span>
    )
}