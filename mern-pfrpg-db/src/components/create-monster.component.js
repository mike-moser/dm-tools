import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import axios from 'axios';


export default class CreateMonster extends Component {
    constructor(props) {
        super(props);

        this.state = {
            creature_name: '',
            alt_name: '',
            challenge_rating: '',
            type: '',
            subtypes: []
        }

        this.onChangeMonsterName = this.onChangeMonsterName.bind(this);
        this.onChangeChallengeRating = this.onChangeChallengeRating.bind(this);
        this.onChangeMonsterType = this.onChangeMonsterType.bind(this);
        this.onChangeMonsterSubtype = this.onChangeMonsterSubtype.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
    }

    onChangeMonsterName(e) {
        this.setState({
            creature_name: e.target.value
        });
    }

    onChangeChallengeRating(e) {
        this.setState({
            challenge_rating: e.target.value
        });
    }

    onChangeMonsterType(e) {
        this.setState({
            type: e.target.value
        });
    }

    onChangeMonsterSubtype(e) {
        const { options } = e.target;
        const value = [];
        for (var i = 0, l = options.length; i < l; i++) {
          if (options[i].selected) {
            value.push(options[i].value);
          }
        }
        
        this.setState({
            subtypes: value
        });
    }

    onSubmit(e) {
        e.preventDefault();
        
        console.log(`Monster Created:`);
        console.log(`Creature Name: ${this.state.creature_name}`);
        console.log(`Challenge Rating: ${this.state.challenge_rating}`);
        console.log(`Creature Type: ${this.state.type}`);
        console.log(`Creature Subtypes: ${this.state.subtypes.join(",")}`);
        
        const newCreature = {
            name: this.state.creature_name,
            challenge_rating: this.state.challenge_rating,
            type: this.state.type,
            subtypes: this.state.subtypes
        };

        axios.post('http://localhost:4000/creatures/add', newCreature)
            .then(res => console.log(res.data));

        this.setState({
            creature_name: '',
            challenge_rating: '',
            type: '',
            subtypes: []
        })
    }

    render() {
        return (
            <div style={{marginTop: 10}}>
                <h3>Create Creature</h3>
                <form autoComplete="off" onSubmit={this.onSubmit}>
                    <div className="form-group">
                        <label  htmlFor="creature-name">Name: </label>
                        <input
                            type="text"
                            className="form-control"
                            value={this.state.creature_name}
                            onChange={this.onChangeMonsterName}
                            id="creature-name"
                            name="creature-name"
                        />
                    </div>                    
                    <div className="form-group">
                        <label  htmlFor="challenge-rating">Challenge Rating: </label>
                        <input 
                            type="number"
                            step="0.5" 
                            className="form-control"
                            value={this.state.challenge_rating}
                            onChange={this.onChangeChallengeRating}
                            id="challenge-rating"
                            name="challenge-rating"
                        />
                    </div>                    
                    <div className="form-group">
                        <label htmlFor="creatureType">Creature Type: </label>
                        <select
                            value={this.state.type}
                            onChange={this.onChangeMonsterType}
                            name="creatureType"
                            id="creatureType"
                        >
                            <option value=''>
                                &lt;Select One&gt;
                            </option>
                            <option value="Aberration">Aberration</option>
                            <option value="Animal">Animal</option>
                            <option value="Construct">Construct</option>
                            <option value="Dragon">Dragon</option>
                            <option value="Fey">Fey</option>
                            <option value="Humanoid">Humanoid</option>
                            <option value="Magical Beast">Magical Beast</option>
                            <option value="Monstrous Humanoid">Monstrous Humanoid</option>
                            <option value="Ooze">Ooze</option>
                            <option value="Outsider">Outsider</option>
                            <option value="Plant">Plant</option>
                            <option value="Undead">Undead</option>
                            <option value="Vermin">Vermin</option>
                        </select>
                    </div>                    
                    <div className="form-group">
                        <label  htmlFor="creatureSubtypes">Subtype(s)</label>
                        <select
                            value={this.state.subtypes}
                            onChange={this.onChangeMonsterSubtype}
                            className="form-control"
                            multiple={true}
                            name="creatureSubtypes"
                            id="creatureSubtypes"
                        >
                            <option value="Adlet">Adlet</option>
                            <option value="Aeon">Aeon</option>
                            <option value="Aether">Aether</option>
                            <option value="Agathion">Agathion</option>
                            <option value="Air">Air</option>
                            <option value="Android">Android</option>
                            <option value="Angel">Angel</option>
                            <option value="Aquatic">Aquatic</option>
                            <option value="Archon">Archon</option>
                            <option value="Astomoi">Astomoi</option>
                            <option value="Asura">Asura</option>
                            <option value="Augmented">Augmented</option>
                            <option value="Azata">Azata</option>
                            <option value="Behemoth">Behemoth</option>
                            <option value="Blight">Blight</option>
                            <option value="Catfolk">Catfolk</option>
                            <option value="Changelin">Changeling</option>
                            <option value="Chaotic">Chaotic</option>
                            <option value="Clockwork">Clockwork</option>
                            <option value="Cold">Cold</option>
                            <option value="Colossus">Colossus</option>
                            <option value="Daemon">Daemon</option>
                            <option value="Dark Folk">Dark Folk</option>
                            <option value="Deep One">Deep One</option>
                            <option value="Demodand">Demodand</option>
                            <option value="Demon">Demon</option>
                            <option value="Derro">Derro</option>
                            <option value="Devil">Devil</option>
                            <option value="Div">Div</option>
                            <option value="Dwarf">Dwarf</option>
                        </select>
                        </div>

                    <input type="submit" value="Create Creature" className="btn btn-primary" />
                </form>
            </div>
        )
    }
}