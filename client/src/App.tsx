import { Link, Router } from "@reach/router";
import CssBaseline from "@material-ui/core/CssBaseline";
import { MuiThemeProvider, createTheme } from "@material-ui/core/styles";

import "bootstrap/dist/css/bootstrap.min.css";

import MonsterList from "./components/monster-list.component";
import MonsterDetails from "./components/details-monster.component";
// import CreateMonster from "./components/create-monster.component";
// import EditMonster from "./components/edit-monster.component";
// import InitiativeTracker from "./components/initiative-tracker.component";
import { AppBar, Box, Toolbar, Typography } from '@material-ui/core';

//import logo from "./logo.jpg";

const dbTheme = createTheme({
  palette: {
    text: {
      primary: '#722f37',
      secondary: '#a0522d',
      disabled: '#f5deb3',
      hint: '#8b4513'
    },
    background: {
      default: '#f5f5dc',
      paper: '#ffebcd'
    }
  },
  typography: {
    fontFamily: 'Fondamento, Helvetica, Arial, sans-serif',
    fontSize: 14
  }
});

const App = () => (
  <MuiThemeProvider theme={dbTheme}>
    <CssBaseline />
        <Box className="app-background">
          <AppBar position="static">
            <Toolbar className="app-header">
              <Typography variant="h6"><Link to="" className="app-name">Strange &AElig;ons</Link></Typography>
            </Toolbar>
          </AppBar>
          <br />
        </Box>
        <Router>
          <MonsterList path="/" />
          <MonsterDetails path ="/details/:creatureId" />
        </Router>
  </MuiThemeProvider>  
)

export default App;
