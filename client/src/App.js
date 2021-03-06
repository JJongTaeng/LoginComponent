import React from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";

import LandinigPage from './components/views/LandingPage/LandingPage';
import RegisterPage from './components/views/RegisterPage/RegisterPage';
import LoginPage from './components/views/LoginPage/LoginPage';

function App() {
  return (
    <Router>
    <div>
      <hr />

      {/*
        A <Switch> looks through all its children <Route>
        elements and renders the first one whose path
        matches the current URL. Use a <Switch> any time
        you have multiple routes, but you want only one
        of them to render at a time
      */}
      <Switch>
        <Route exact path="/" component={LandinigPage} />
        <Route path="/login" component={LoginPage} />

        <Route path="/register" component={RegisterPage} />
      </Switch>
    </div>
  </Router>
  );
}
export default App;
