import { ip } from 'address';
import React from 'react';
import { Switch, Route } from 'react-router-dom';
import App from '../App'
import Signup from './pages/Signup';


const Main = () => {
  return (
    <Switch> {/* The Switch decides which component to show based on the current URL.*/}
             <Route exact path="/Signup" component={Signup}/>
             <Route exact path="/" component={App} />
    </Switch>
  );
}

export default Main;