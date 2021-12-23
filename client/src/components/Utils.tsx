import { InternalLink } from './interfaces';
import { format, isNegative, unit } from 'mathjs';
export const empty_string = "";
export const space_char = " ";
export const unit_of_measurement = "ft";

export const toTitleCase = (str: string) => {
    var value = str ? str : "";
    return value.toLowerCase()
        .split(' ')
        .map((s, i) => {
            var noCapsWords = [ "the", "a", "an", "of", "with"];
            if(noCapsWords.indexOf(s) < 0 || i === 0)
                return s.charAt(0).toUpperCase() + s.substring(1);
            else return s;
        })
        .join(' ');
}

export const toSignedValue = (val: number) => {
    return isNegative(val) ? format(val, 0) : '+'.concat(format(val,0));
}

export const withUnits = (i: number, uom: string | null | undefined) => {
    let units = uom ? uom : unit_of_measurement;
    units = units.endsWith('.') ? units.slice(0, -1) : units;

    return unit(i, units).toString();
}

export const ordinalSuffixOf = (i: number) => {
    var j = i % 10,
        k = i % 100;
    if (j === 1 && k !== 11) {
        return i + "st";
    }
    if (j === 2 && k !== 12) {
        return i + "nd";
    }
    if (j === 3 && k !== 13) {
        return i + "rd";
    }
    return i + "th";
}

export const createSpellLink = (spell_name: string, spell_version: number, is_basis_ability: boolean, basis_value: string, basis_type: string) => {
    var url = "https://www.aonprd.com/";
    if(is_basis_ability && basis_value) {
        url = url.concat(toTitleCase(basis_type), "Display.aspx?ItemName=", toTitleCase(basis_value));
    } else { 
        if(spell_version) {
            url = url.concat("SpellDisplay.aspx?ItemName=", spell_name, ' ', format(spell_version, 0)); 
        } else {
            url = url.concat("SpellDisplay.aspx?ItemName=", spell_name); 
        }
    }
    return url;
}

export const insertLinks = (line: string, links: InternalLink[]) => {
    if (!links) {
      return line;
    }
          
    let text_list = links.map(t => t.text);
    let regex = new RegExp(/@(.*?)@/);

    return (<span>
      { line.split(regex)
        .reduce((prev: any, current: any, i: number) => {
          if (!i) {
            return [current];
          }

          let link = links.find(elem => elem.text === current.trim('@'))
          return prev.concat(
               text_list.includes(current) ?
               <span key={i + current}>
                    <a href={link && link.uri ? link.uri : '#'} target="_blank" rel="noopener noreferrer">
                        { current }
                    </a>
                </span>
                : current
            )
        }, [])
      }
    </span>);
  }

  export function delimit(arr: Array<any>, delimiter: string) {
    if (arr.length === 0) {
        return [];
    }

    return arr.slice(1).reduce(function(xs, x, i) {
        return xs.concat([delimiter, x]);
    }, [arr[0]]);
}