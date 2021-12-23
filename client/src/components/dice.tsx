import { format } from 'mathjs';
import { toSignedValue } from './Utils';

export default class Dice {
    count: number = 0;
    faces: number = 0;
    bonus: number = 0;

    constructor(count: number, faces: number, bonus?: number) {
        this.count = Math.round(count);
        this.faces = Math.round(faces);
        if(bonus !== undefined && bonus !== null) this.bonus = Math.round(bonus);
    }
    
    toDiceText = (bonus?: number | undefined | null) : string => {
        var diceNum = (this.count) ? format(this.count, 0) : format(1, 0);
        var diceFace = (this.faces) ? format(this.faces, 0) : format(6, 0);
    
        return diceNum.concat("d", diceFace, (bonus !== undefined && bonus !== null && bonus > 0) ? toSignedValue(bonus) : "");
    }

    average = (bonus?: number | undefined | null) : number => {
        if(this.count === 0) return 0;
        if(this.faces === 1) return this.count;
        if(this.count === 1) return Math.floor(this.faces / 2.0);
        else {
            var avg = 0;
            var evens = Math.floor(this.count / 2.0);
            var odds = Math.ceil(this.count / 2.0);

            var half_die = Math.floor(this.faces / 2.0);

            avg += (odds * half_die) + (evens * (half_die + 1));
                
            if(bonus !== undefined && bonus !== null) {
                avg += bonus;
            }
            return avg;
        }
    }

    roll = (bonus?: number | undefined | null) : number => {
        let val = 0;
        for(let i = 0; i < this.faces; i++) {
            val  += Math.round(Math.random() * this.faces);
        }

        if(bonus !== undefined && bonus !== null) {
            val += bonus;
        }
        return val;
    }
}