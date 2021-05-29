import React from 'react';
import {BrowserRouter as Router, Switch, Route} from 'react-router-dom';

import Currencies from './Currencies';
import Converter from './Converter';
import Header from '../components/Header';

import './App.css';

function App() {
  return (
    <div className="container">
      <Router>
        <Header/>
        <Switch>
          <Route exact path="/" component={Converter} />
          <Route path="/currencies" component={Currencies} />
        </Switch>
      </Router>
    </div>
  );
}

export default App;
