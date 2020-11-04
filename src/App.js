import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

import './App.css';
import Navigation from './components/Navigation'
import Home from './components/Pages/Home'
import Error from './components/Pages/Error'
import Data from './components/Pages/Data/Data'
import ErrorContextProvider from './components/ErrorContextProvider'
import ErrorModal from './components/ErrorModal'

// Set up context
export const context = {
  light: {
    foreground: '#000000',
    background: '#eeeeee',
  },
  dark: {
    foreground: '#ffffff',
    background: '#222222',
  },
};

export const Context = React.createContext(
  context
);

function App() {
  return (
    <ErrorContextProvider>
      <BrowserRouter>
        <ErrorModal/>
        <div>
          <Navigation />
            <Switch>
              <Route path="/" component={Home} exact/>
              <Route path="/data" component={Data}/>
              <Route component={Error}/>
            </Switch>
        </div> 
      </BrowserRouter>
    </ErrorContextProvider>
  );
}

export default App;
