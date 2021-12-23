import mongoose, {Schema} from 'mongoose';

let CreatureType = new Schema({
    type : {
        type : String,
        required : true
    },
    description : {
        type : String,
        required : true
    },
    subtype : Boolean,
    features : [ String ],
    knowledge_check : String,
    skill_points_per_hd : Number,
    skill_point_text : String,
    class_skills : [ String ],
    traits : [
        {
            name : String,
            ability_name : String,
            ability_types : [ String ],
            description : String,
            header : String,
            links : [
                {
                    text : String,
                    uri : String
                }
            ],
            effects_table : {
                header_row : [ String ],
                content_rows : [ [ String ] ]
            }
        }
    ]
},
{ collation: { locale: 'en_US', strength: 2 }});


export default mongoose.model('Creature_Type', CreatureType);