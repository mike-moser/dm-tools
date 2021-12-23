import { space_char, toSignedValue, toTitleCase } from "./Utils"


export interface SkillEntry {
    skill_name : string,
    skill_specialization : string,
    skill_ranks : number,
    notes : string
}

export const SkillsList = ({skills} : { skills: Array<SkillEntry> }) => {

    return (
        <div className="card-text">
            <div>
                <span className="font-weight-bold">Skills&nbsp;</span>{
                    skills.map((skill, i) => {                        
                        return  <span key={i}>
                                    <Skill name={skill.skill_name} specialization={skill.skill_specialization} ranks={skill.skill_ranks} notes={skill.notes} />
                                    {(i < skills.length - 1) ? ', ' : space_char}
                                </span>
                    })
                }
            </div>
        </div>
    )
}

export const RacialModifiers = ({skills} : { skills: Array<SkillEntry> }) => {

    return (
        <div className="card-text">
            <div>
                <span className="font-weight-bold">Racial Modifiers&nbsp;</span>{
                    skills.map((skill, i) => {
                        return  <span key={i}>
                                    <Skill name={skill.skill_name} specialization={skill.skill_specialization} ranks={skill.skill_ranks} notes={skill.notes} />
                                    {(i < skills.length - 1) ? ', ' : space_char}
                                </span>
                    })
                }
            </div>
        </div>
    )
}

export const Skill = ({name, specialization, ranks, notes} : { name: string, specialization: string, ranks: number, notes: string }) => {

    return (
        <span className="skill-desc">
            {name && <span>{toTitleCase(name)}</span>}
            {specialization && <span>&nbsp;({specialization})</span>}
            {(ranks || ranks === 0) && <span>&nbsp;{toSignedValue(ranks)}</span>}
            {notes && <span> ({notes})</span>}
        </span>
    )
}
