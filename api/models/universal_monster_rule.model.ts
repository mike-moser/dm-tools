import mongoose, {Schema, Document } from 'mongoose';

let UniversalMonsterRule = new Schema({
    name : {
        type : String,
        required : true
    },
    ability_type : [ String ],
    sources : [
        {
            title : String,
            page : Number
        }
    ],
    description : {
        text : String,
        links : [
            {
                text : String,
                uri : String
            }
        ]
    },
    format : String,
    location: String
},
{ collation: { locale: 'en_US', strength: 2 }});


export default mongoose.model('Universal_Monster_Rule', UniversalMonsterRule);