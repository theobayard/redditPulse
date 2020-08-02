import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

import './App.css';
import Navigation from './components/Navigation'
import Home from './components/Pages/Home'
import About from './components/Pages/About'
import Error from './components/Pages/Error'
import Data from './components/Pages/Data/Data'

function App() {
  return (
    <BrowserRouter>
        <div id={"error-modal"}></div>
        <div>
          <Navigation />
            <Switch>
             <Route path="/" component={Home} exact/>
             <Route path="/data" component={Data}/>
             <Route path="/about" component={About}/>
             <Route component={Error}/>
           </Switch>
        </div> 
      </BrowserRouter>
  );
}

export default App;
