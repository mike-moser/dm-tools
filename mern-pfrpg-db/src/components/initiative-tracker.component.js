import React, {Component} from 'react';
import {Modal, Button, Form, Row, Col, Container, ButtonGroup, ButtonToolbar} from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus, faSkullCrossbones, faCheck } from '@fortawesome/free-solid-svg-icons'

class Actor extends Component {

    onRemove = () => {
        this.props.clickRemove(this.props.id);
    }
    onPlus = () => {
        this.props.clickThePlus(this.props);
    }
    onComplete = () => {
        this.props.completeTurn(this.props.id);
    }

    render() {
        var {id, actor_type, name, initiative, hit_points, condition, on_the_plus} = this.props;
        var plus_color = on_the_plus ? "green" : "darkgray";

        return (
            <Row className={actor_type.concat(" ", "actor"," ", "combatant-", id)}>
                <Col md="4">{name}</Col>
                <Col md="2" className="border border-secondary rounded mr-2">{initiative}</Col>
                <Col md="2" className="border border-secondary rounded mr-2">{hit_points}</Col>
                <Col md="2">
                    <Button type="button" variant="outline-info" onClick={this.onRemove} className="mr-2">
                        <FontAwesomeIcon icon={faSkullCrossbones} color="red" />
                    </Button>
                    <Button type="button" variant="outline-info" onClick={this.onPlus} color={plus_color} className="mr-2">
                        <FontAwesomeIcon icon={faPlus} color={plus_color} />
                    </Button>
                    <Button type="button" variant="success" onClick={this.onPlus}>
                        <FontAwesomeIcon icon={faCheck} color="white" />
                    </Button>
                </Col>
            </Row>
        )
    }
}

class InitiativeTracker extends Component {
    constructor(props) {
        super(props);

        this.state = {
            show : false,
            combatants : [ ]
        };

    }

    setShow = (b) => {this.setState({
                            show: b,
                            combatants: this.state.combatants
                        });
                    }
    
    handleShow = () => { this.setShow(true); }

    handleClose = () => { this.setShow(false); }

    removeActor = (actorNum) => {
        this.setState(prevState => ({ 
            show: this.state.show,
            combatants: prevState.combatants.filter(actor => actor.id !== actorNum) }));
    }

    handleThePlus = (selectedActor) => {
        this.setState({
            show: this.state.show,
            combatants: [...this.state.combatants.filter(actor => selectedActor.id !== actor.id), 
            {
                id: selectedActor.id,
                actor_type: selectedActor.actor_type,
                name: selectedActor.name,
                initiative: selectedActor.initiative,
                hit_points: selectedActor.hit_points,
                condition: selectedActor.condition,
                on_the_plus: !selectedActor.on_the_plus
            }]
          });
    };

    addActor = (event) => {
        event.preventDefault();
        var maxId = this.state.combatants.length;
        var actor = 
        {
            id: maxId+1,
            actor_type: event.target.actorType.value,
            name: event.target.actorName.value,
            initiative: event.target.actorInitiative.value,
            hit_points: event.target.actorHealth.value,
            condition: [],
            on_the_plus: false
        };
        
        this.setState({
            show: false,
            combatants: [...this.state.combatants, actor]
        });
    };

    sortActors = () => {
        let list = [...this.state.combatants];
        list.sort((a, b) => {
             if(a.initiative < b.initiative) return 1;
             else if(b.initiative < a.initiative) return -1;
             else {
                 if(a.on_the_plus && !b.on_the_plus) return -1;
                 else if(b.on_the_plus && !a.on_the_plus) return 1;
                 else return 0;
             }
        });
        console.log(list);
        this.setState({
            show: false,
            combatants: [...list]
        })
    }

    actionTaken = (actorNum) => {
        var turn = this.state.combatants.find(a => a.id === actorNum);
        this.setState({
            show: this.state.show,
            combatants: [...this.state.combatants.filter(actor => actorNum !== actor.id), turn]
        });
    }
            
    render() {
        return (
            <div>
                <Container fluid={true} className="actor_list">
                    {this.state.combatants.map((actor, i) => {
                        return <Actor key={i} id={actor.id} actor_type={actor.actor_type} name={actor.name} initiative={actor.initiative} 
                            hit_points={actor.hit_points} condition={actor.condition} on_the_plus={actor.on_the_plus} clickRemove={this.removeActor} 
                            clickThePlus={this.handleThePlus} completeTurn={this.actionTaken} />
                    })}
                </Container>
                <Container>
                    <ButtonToolbar className="justify-content-end">
                        <Button variant="primary" onClick={this.sortActors}>Sort</Button>
                        <Button variant="info" onClick={this.sortActors}>Search Actors</Button>
                        <Button variant="success" onClick={this.handleShow}>Add Actor</Button>
                    </ButtonToolbar>
                </Container>
                <Modal show={this.state.show} onHide={this.handleClose}>
                    <Modal.Header closeButton>
                        <Modal.Title>Add Combatant</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Container fluid={true}>
                            <Form id="actorForm" noValidate onSubmit={this.addActor}>
                                <Form.Row>
                                    <Form.Group as={Col} md="7" controlId="actorName">
                                        <Form.Label>Name</Form.Label>
                                        <Form.Control type="text" placeholder="Combatant Name"  />
                                    </Form.Group>
                                </Form.Row>
                                <Form.Row>
                                    <Form.Group as={Col} md="7" controlId="actorInitiative">
                                        <Form.Label>Initiative</Form.Label>
                                        <Form.Control type="text" placeholder="Init"  />
                                    </Form.Group>
                                </Form.Row>
                                <Form.Row>
                                    <Form.Group as={Col} md="7" controlId="actorHealth">
                                        <Form.Label>Hit Points</Form.Label>
                                        <Form.Control type="text" placeholder="HP"  />
                                    </Form.Group>
                                </Form.Row>
                                <Form.Row>
                                    <Form.Group as={Col} md="6" controlId="actorType">
                                        <Form.Check inline label="Player" type="radio" name="actorType" id="actorTypePlayer" value="player" />
                                        <Form.Check inline label="Enemy" type="radio" name="actorType" id="actorTypeEnemy" value="enemy" />
                                        <Form.Check inline label="NPC" type="radio" name="actorType" id="actorTypeNPC" value="npc" />
                                    </Form.Group>
                                </Form.Row>
                                <Form.Row>
                                    <ButtonToolbar>
                                        <Button variant="success" type="submit">Add</Button>
                                        <Button variant="danger" onClick={this.handleClose}>Cancel</Button>
                                    </ButtonToolbar>
                                </Form.Row>
                            </Form>
                        </Container>
                    </Modal.Body>
                </Modal>
            </div>
        )
    }
}

export default InitiativeTracker;