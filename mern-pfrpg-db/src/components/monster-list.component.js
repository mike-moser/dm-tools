import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import * as math from 'mathjs/dist/math.js';
import debounce from 'lodash.debounce';

const Creature = props => (
    <tr>
        <td>
            <Link to={"/details/" + props.creature._id }>{props.creature.name}</Link>
        </td>
        <td>
            { 
                props.creature.challenge_rating  < 1 ?
                    math.format(math.fraction(props.creature.challenge_rating), {fraction: 'ratio'}) : 
                    props.creature.challenge_rating
            }
        </td>
        <td>{ props.creature.type } 
            {
                (props.creature.subtypes !== undefined && props.creature.subtypes !== null && props.creature.subtypes.length > 0) &&
                    " (" + props.creature.subtypes.join(", ") + ")"
            }
        </td>
        <td>
            <Link to={"/edit/" + props.creature._id}>Edit</Link>
        </td>
    </tr>
)

export default class MonsterList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            limit: 35,
            offset: 0,
            error: false,
            hasMore: true,
            isLoading: false,
            creatures: [] 
        };

        window.onscroll = debounce(() => {
            const { 
                loadCreatures,
                state : {
                    error,
                    hasMore,
                    isLoading
                },
            } = this;

            // Bails early if:
            // * there's an error
            // * it's already loading
            // * there's nothing left to load
            if (error || isLoading || !hasMore) return;

            if (
                document.documentElement.scrollHeight - document.documentElement.scrollTop
                <= document.documentElement.clientHeight
              ) {
                loadCreatures();
              }
        }, 100);
    }

    componentWillMount() {
        this.loadCreatures();
    }

    loadCreatures = () => {
        this.setState({isLoading: true}, () => {
            var queryString = "limit=" + this.state.limit + '&offset=' + this.state.offset;
            axios.get('http://localhost:4000/creatures/?' + queryString)
            .then(response => {
                this.setState({ 
                    hasMore: response.data.length > 0,
                    isLoading: false,
                    creatures: [
                        ...this.state.creatures,
                        ...response.data 
                    ]
                });
                this.setState({offset: this.state.creatures.length});
            })
            .catch(function (err) {
                this.setState({
                    error: err.message,
                    isLoading: false
                })
            });
        });
    }

    creatureList() {
        return this.state.creatures.map( function( current, i) {
            return <Creature creature={current} key={i} />;
        });
    }

    render() {
        const { isLoading, hasMore, error } = this;
        return (
            <div>
                <h3>Pathfinder RPG Creatures</h3>
                {error &&
                    <div style={{ color: '#900' }}>
                        {error}
                    </div>
                }
                <table className="table table-striped" style={{ marginTop: 20 }}>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>CR</th>
                            <th>Type</th>
                            <th>&nbsp;</th>
                        </tr>
                    </thead>
                    <tbody>
                        { this.creatureList() }
                    </tbody>
                </table>
                {isLoading &&
                    <div>Loading...</div>
                }
                {!hasMore &&
                    <div>You did it! You reached the end!</div>
                }
            </div>
        )
    }
}