import * as math from 'mathjs';

const ExperienceBlock = ({xp} : {xp: number}) => {

    return (
        <div className="card-text">
            <div className="font-weight-bold">XP&nbsp;{ xp && math.format(xp, (val) => {
                let n = val.toString();
                var x = n.split('.');
                var x1 = x[0];
                var x2 = x.length > 1 ? '.' + x[1] : '';
                var rgx = /(\d+)(\d{3})/;
                while (rgx.test(x1)) {
                    x1 = x1.replace(rgx, '$1'.concat(',', '$2'));
                }
                return x1 + x2;
            }) }</div>
        </div>
    )
}

export default ExperienceBlock;