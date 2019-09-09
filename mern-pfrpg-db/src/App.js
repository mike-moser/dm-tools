import React, { Component } from 'react';
import { BrowserRouter as Router, Route } from "react-router-dom";

import "bootstrap/dist/css/bootstrap.min.css";

import CreateMonster from "./components/create-monster.component";
import EditMonster from "./components/edit-monster.component";
import MonsterList from "./components/monster-list.component";
import MonsterDetails from "./components/details-monster.component";
import InitiativeTracker from "./components/initiative-tracker.component";
import { Container, Nav, Navbar } from 'react-bootstrap';

import logo from "./logo.jpg";

class App extends Component {
  render() {
    return (
      <Router>
        <Container>
          <Navbar expand="lg" bg="light" variant="light">
            <Navbar.Brand href="http://aonprd.com" target="_blank" rel="noopener noreferrer">
              <img src={logo} width="30" height="31" alt="Strange Aeons" />
            </Navbar.Brand>
            <Navbar.Collapse>
              <Nav className="mr-auto">
                <Nav.Link href="/">Pathfinder DB</Nav.Link>
                <Nav.Link href="/create">Create Monster</Nav.Link>
                <Nav.Link href="/initiative">Initiative Tracker</Nav.Link>
              </Nav>
            </Navbar.Collapse>
          </Navbar>
          <br />
          <Route path="/" exact component={MonsterList} />
          <Route path="/edit/:id" component={EditMonster} />
          <Route path="/create" component={CreateMonster} />
          <Route path="/details/:id" component={MonsterDetails} />
          <Route path="/initiative" component={InitiativeTracker} />
        </Container>
      </Router>
    );
  }
}

export default App;
