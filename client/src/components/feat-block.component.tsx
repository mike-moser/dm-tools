

export interface FeatEntry {
    name : string,
    is_bonus : boolean,
    feat_focus_list : string[]
}

const FeatsBlock = ({ feats } : { feats: Array<FeatEntry> }) => {
    
    return (
        <div className="card-text">
            <div>
                <span className="font-weight-bold">Feats&nbsp;</span>
                {
                    feats.map((feat, i) => {
                        var separator = (i > 0);
                        
                        return  <span key={i}>
                                    <span>{separator && ', '}{feat.name}{feat.is_bonus && <sup>B</sup>}</span>
                                        {(feat.feat_focus_list && feat.feat_focus_list.length > 0) && 
                                    <span> ({feat.feat_focus_list.join(', ')})</span>}
                                </span>             
                    })
                }
            </div>
        </div>
    )
}

export default FeatsBlock;