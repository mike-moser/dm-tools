import mongoose, {Schema, Document } from 'mongoose';

export interface IDisease extends Document {
    name : String;
    alt_name : String;
    sources : [
        {
            title: String,
            page : Number
        }
    ];
    application : String;
    saves : {
        saving_throw : String,
        difficulty_class : Number
    };
    
    onset : {
        period : String,
        count : Number
    },
    frequency : {
        period : String,
        count : Number
    },
    effect : [
        {
            damage_dice : {
                count : Number,
                faces : Number
            },
            ability_score : String,
            damage_type : String,
            description : String
        }
    ],
    cure : {
        count : Number,
        basis : String,
        alternate_cure : String,
        description : String
    },
    description : String
}

const Disease : Schema = new Schema({
    name : {
        type : String,
        required : true
    },
    alt_name : String,
    sources : [
        {
            title : String,
            page : Number
        }
    ],
    application : String,
    saves : {
        saving_throw : String,
        difficulty_class : Number
    },
    onset : {
        period : String,
        count : Number
    },
    frequency : {
        period : String,
        count : 1
    },
    effect : [
        {
            damage_dice : {
                count : Number,
                faces : Number
            },
            ability_score : String,
            damage_type : String,
            description : String
        }
    ],
    cure : {
        count : Number,
        basis : String,
        alternate_cure : String,
        description : String
    },
    description : String
},
{ collation: { locale: 'en_US', strength: 2 }});

export default mongoose.model<IDisease>('Disease', Disease);