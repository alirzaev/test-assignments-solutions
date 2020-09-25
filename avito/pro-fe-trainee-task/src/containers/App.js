import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

import './App.css';
import Home from './Home';
import Repository from './Repository';

function App() {
  return (
    <div className="app">
      <Router>
        <Switch>
          <Route exact path="/" component={Home} />
          <Route path="/repo/:owner/:repo" component={Repository} />
        </Switch>
      </Router>
    </div>
  );
}

export default App;
